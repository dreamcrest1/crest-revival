import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Download, FileText, Globe, AlertTriangle, CheckCircle2, Link2 } from 'lucide-react';
import { toast } from 'sonner';

interface PageReport {
  url: string;
  status: number;
  title: string | null;
  description: string | null;
  canonical: string | null;
  robots: string | null;
  indexable: boolean;
  og: Record<string, string>;
  twitter: Record<string, string>;
  jsonLd: unknown[];
  h1Count: number;
  imgMissingAlt: number;
  internalLinks: string[];
  brokenLinks: { url: string; status: number }[];
  issues: string[];
  loadMs: number;
}

interface CrawlResult {
  summary: {
    crawledAt: string;
    origin: string;
    pagesCrawled: number;
    pagesWithIssues: number;
    totalIssues: number;
    brokenLinkCount: number;
    sitemap: { url: string; total: number; ok: number; broken: number; duplicates: number; errors: string[] };
  };
  pages: PageReport[];
  sitemap: { sitemapUrl: string; entries: { loc: string; status?: number; note?: string }[]; duplicates: string[]; errors: string[] };
  robots: { url: string; status: number; content: string };
}

function csvEscape(v: unknown): string {
  if (v == null) return '';
  const s = String(v).replace(/"/g, '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}

function downloadBlob(name: string, content: string, type = 'text/csv') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

function pagesToCsv(pages: PageReport[]): string {
  const header = [
    'url', 'status', 'indexable', 'title', 'title_len', 'description', 'desc_len',
    'canonical', 'robots', 'og:title', 'og:description', 'og:image', 'og:url',
    'twitter:card', 'jsonld_types', 'h1_count', 'img_missing_alt', 'internal_links',
    'broken_links', 'load_ms', 'issues',
  ];
  const rows: string[] = [header.join(',')];
  for (const p of pages) {
    const jsonldTypes = p.jsonLd.map((j) => {
      const o = j as { '@type'?: string | string[] };
      return Array.isArray(o['@type']) ? o['@type'].join('|') : o['@type'] || '?';
    }).join(';');
    rows.push([
      p.url, p.status, p.indexable, p.title, p.title?.length ?? 0,
      p.description, p.description?.length ?? 0, p.canonical, p.robots,
      p.og.title, p.og.description, p.og.image, p.og.url,
      p.twitter.card, jsonldTypes, p.h1Count, p.imgMissingAlt,
      p.internalLinks.length, p.brokenLinks.map((b) => `${b.url}(${b.status})`).join(';'),
      p.loadMs, p.issues.join('; '),
    ].map(csvEscape).join(','));
  }
  return rows.join('\n');
}

function sitemapToCsv(entries: { loc: string; status?: number }[]): string {
  const rows = ['url,status,ok'];
  for (const e of entries) {
    rows.push([e.loc, e.status ?? 0, e.status && e.status >= 200 && e.status < 400].map(csvEscape).join(','));
  }
  return rows.join('\n');
}

const AdminSeoAudit = () => {
  const [url, setUrl] = useState('https://castletools.in');
  const [maxPages, setMaxPages] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CrawlResult | null>(null);

  const run = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('seo-crawler', {
        body: { url: url.trim(), maxPages },
      });
      if (error) throw error;
      setResult(data as CrawlResult);
      toast.success(`Crawled ${(data as CrawlResult).summary.pagesCrawled} pages`);
    } catch (e) {
      toast.error(`Crawl failed: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">SEO Audit & Crawler</h1>
        <p className="text-muted-foreground mt-1">
          Crawls your live site, validates sitemap, finds broken links, and audits SEO metadata.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="https://castletools.in"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Input
            type="number"
            min={1}
            max={60}
            value={maxPages}
            onChange={(e) => setMaxPages(parseInt(e.target.value) || 30)}
            className="w-full sm:w-32"
            title="Max pages"
          />
          <Button onClick={run} disabled={loading} className="min-w-[140px]">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Globe className="h-4 w-4 mr-2" />}
            {loading ? 'Crawling…' : 'Run Audit'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-foreground">{result.summary.pagesCrawled}</div><p className="text-xs text-muted-foreground">Pages crawled</p></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-foreground">{result.summary.pagesWithIssues}</div><p className="text-xs text-muted-foreground">Pages w/ issues</p></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-foreground">{result.summary.totalIssues}</div><p className="text-xs text-muted-foreground">Total issues</p></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-foreground">{result.summary.brokenLinkCount}</div><p className="text-xs text-muted-foreground">Broken links</p></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-foreground">{result.summary.sitemap.ok}/{result.summary.sitemap.total}</div><p className="text-xs text-muted-foreground">Sitemap OK</p></CardContent></Card>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => downloadBlob('seo-audit-pages.csv', pagesToCsv(result.pages))}>
              <Download className="h-4 w-4 mr-2" /> Export Pages CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadBlob('sitemap-validation.csv', sitemapToCsv(result.sitemap.entries))}>
              <Download className="h-4 w-4 mr-2" /> Export Sitemap CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadBlob('seo-audit-full.json', JSON.stringify(result, null, 2), 'application/json')}>
              <FileText className="h-4 w-4 mr-2" /> Export Full JSON
            </Button>
          </div>

          <Tabs defaultValue="pages">
            <TabsList>
              <TabsTrigger value="pages">Pages ({result.pages.length})</TabsTrigger>
              <TabsTrigger value="sitemap">Sitemap ({result.sitemap.entries.length})</TabsTrigger>
              <TabsTrigger value="broken">Broken Links ({result.summary.brokenLinkCount})</TabsTrigger>
              <TabsTrigger value="robots">robots.txt</TabsTrigger>
            </TabsList>

            <TabsContent value="pages" className="space-y-3">
              {result.pages.map((p) => (
                <Card key={p.url}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <CardTitle className="text-sm font-mono break-all">{p.url}</CardTitle>
                      <div className="flex gap-2 shrink-0">
                        <Badge variant={p.status >= 200 && p.status < 400 ? 'default' : 'destructive'}>{p.status || 'err'}</Badge>
                        <Badge variant={p.indexable ? 'default' : 'secondary'}>{p.indexable ? 'index' : 'noindex'}</Badge>
                        {p.issues.length > 0 ? (
                          <Badge variant="destructive">{p.issues.length} issue{p.issues.length === 1 ? '' : 's'}</Badge>
                        ) : (
                          <Badge variant="default" className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" /> clean</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1.5">
                    <div><span className="text-muted-foreground">Title:</span> {p.title || <em className="text-destructive">missing</em>} {p.title && <span className="text-muted-foreground">({p.title.length})</span>}</div>
                    <div><span className="text-muted-foreground">Description:</span> {p.description || <em className="text-destructive">missing</em>} {p.description && <span className="text-muted-foreground">({p.description.length})</span>}</div>
                    <div className="break-all"><span className="text-muted-foreground">Canonical:</span> {p.canonical || <em className="text-destructive">missing</em>}</div>
                    <div><span className="text-muted-foreground">OG:</span> title={p.og.title ? '✓' : '✗'} desc={p.og.description ? '✓' : '✗'} image={p.og.image ? '✓' : '✗'}</div>
                    <div><span className="text-muted-foreground">JSON-LD:</span> {p.jsonLd.length} block(s)</div>
                    <div><span className="text-muted-foreground">H1:</span> {p.h1Count} · <span className="text-muted-foreground">img w/o alt:</span> {p.imgMissingAlt} · <span className="text-muted-foreground">links:</span> {p.internalLinks.length} · <span className="text-muted-foreground">load:</span> {p.loadMs}ms</div>
                    {p.issues.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1">
                        {p.issues.map((i, idx) => (
                          <Badge key={idx} variant="outline" className="text-destructive border-destructive/40">
                            <AlertTriangle className="h-3 w-3 mr-1" /> {i}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="sitemap" className="space-y-3">
              {result.sitemap.errors.length > 0 && (
                <Card><CardContent className="pt-6 text-destructive text-sm">{result.sitemap.errors.join(' · ')}</CardContent></Card>
              )}
              {result.sitemap.duplicates.length > 0 && (
                <Card><CardContent className="pt-6 text-sm">
                  <div className="font-semibold mb-2">Duplicate entries ({result.sitemap.duplicates.length})</div>
                  <ul className="space-y-1 text-xs font-mono">{result.sitemap.duplicates.map((d) => <li key={d}>{d}</li>)}</ul>
                </CardContent></Card>
              )}
              <Card><CardContent className="pt-6 text-xs">
                <div className="grid gap-1">
                  {result.sitemap.entries.map((e) => (
                    <div key={e.loc} className="flex items-center justify-between gap-3 py-1 border-b border-border/50 last:border-0">
                      <span className="font-mono break-all">{e.loc}</span>
                      <Badge variant={e.status && e.status >= 200 && e.status < 400 ? 'default' : 'destructive'} className="shrink-0">{e.status || 'err'}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent></Card>
            </TabsContent>

            <TabsContent value="broken" className="space-y-3">
              {result.pages.filter((p) => p.brokenLinks.length).length === 0 ? (
                <Card><CardContent className="pt-6 text-sm text-muted-foreground flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" /> No broken internal links found.</CardContent></Card>
              ) : result.pages.filter((p) => p.brokenLinks.length).map((p) => (
                <Card key={p.url}>
                  <CardHeader className="pb-3"><CardTitle className="text-sm font-mono break-all flex items-center gap-2"><Link2 className="h-4 w-4" /> {p.url}</CardTitle></CardHeader>
                  <CardContent className="text-xs space-y-1">
                    {p.brokenLinks.map((b, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 py-1 border-b border-border/50 last:border-0">
                        <span className="font-mono break-all">{b.url}</span>
                        <Badge variant="destructive" className="shrink-0">{b.status || 'unreachable'}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="robots">
              <Card>
                <CardHeader><CardTitle className="text-sm font-mono">{result.robots.url} — HTTP {result.robots.status}</CardTitle></CardHeader>
                <CardContent><pre className="text-xs font-mono bg-muted p-3 rounded overflow-auto whitespace-pre-wrap">{result.robots.content || '(empty)'}</pre></CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default AdminSeoAudit;

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, Copy, Check, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const CMD = 'npm run build:zip';

const AdminDeploy = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok?: boolean; error?: string; latestRunUrl?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const trigger = async () => {
    setLoading(true); setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('trigger-deploy', { body: {} });
      if (error) throw error;
      setResult(data);
      if (data?.ok) toast.success('Deploy triggered — GitHub Actions is building now');
      else toast.error(data?.error || 'Failed to trigger deploy');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setResult({ error: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Rocket className="w-6 h-6 text-primary" />
        <h1 className="font-display text-2xl font-bold">Deploy</h1>
      </div>

      {/* One-click deploy */}
      <Card className="border-primary/30">
        <CardContent className="p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-base mb-1">One-click deploy to cPanel</h2>
            <p className="text-sm text-muted-foreground">
              Triggers the GitHub Actions workflow that builds the site and uploads <code className="px-1 bg-muted rounded">dist/</code> (with <code className="px-1 bg-muted rounded">.htaccess</code>) to your cPanel via FTP.
            </p>
          </div>
          <Button onClick={trigger} disabled={loading} size="lg" className="gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
            {loading ? 'Triggering…' : 'Deploy now'}
          </Button>

          {result?.ok && result.latestRunUrl && (
            <a href={result.latestRunUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              View build progress on GitHub <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {result?.error && (
            <div className="flex items-start gap-2 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-md p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <div className="font-medium">{result.error}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Make sure <code>GITHUB_PAT</code> (repo + workflow scope) and <code>GITHUB_REPO</code> (owner/repo) secrets are set in Lovable Cloud.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual build & zip */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <div>
            <h2 className="font-semibold text-base mb-1">Manual build &amp; download zip</h2>
            <p className="text-sm text-muted-foreground">
              Run this on your machine to produce <code className="px-1 bg-muted rounded">dreamcrest-dist.zip</code> with verified <code className="px-1 bg-muted rounded">.htaccess</code>. Upload the zip to cPanel → public_html → Extract.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-md px-3 py-2 font-mono text-sm">
            <span className="text-muted-foreground">$</span>
            <span className="flex-1">{CMD}</span>
            <Button size="sm" variant="ghost" onClick={copy} className="h-7 gap-1.5">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-2 text-sm text-muted-foreground">
          <h3 className="font-semibold text-foreground text-base">Checklist before deploying</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>All admin edits (products, pages, blog) are auto-live — no rebuild needed.</li>
            <li>Rebuild only when code changes ship (UI tweaks, new features, bug fixes).</li>
            <li>The deploy keeps the existing <code>.htaccess</code> so direct product URLs continue to work.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDeploy;

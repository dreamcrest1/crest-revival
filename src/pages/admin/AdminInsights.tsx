import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, TrendingUp, Eye, MessageCircle, RefreshCw, MailQuestion, SearchX, AlertTriangle, Users, Activity, Flame, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const RANGES = { '7d': 7, '30d': 30, '90d': 90 } as const;
type RangeKey = keyof typeof RANGES;

interface EventRow { event_type: string; metadata: Record<string, unknown> | null; visitor_id: string | null; page_path: string | null; device_type: string | null; created_at: string }
interface Feedback { id: string; page_path: string; message: string; created_at: string }
interface Insight { for_date: string; summary_md: string; created_at: string }
interface ClickRow { page_path: string; element_text: string | null; visitor_id: string | null; created_at: string }

const fmt = (n: number) => n.toLocaleString();
const pct = (n: number, d: number) => (d > 0 ? `${Math.round((n / d) * 1000) / 10}%` : '—');
const deltaPct = (a: number, b: number) => (b > 0 ? Math.round(((a - b) / b) * 100) : null);
const PLACEHOLDER = '/placeholder.svg';

const Delta = ({ value }: { value: number | null }) => {
  if (value === null) return null;
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
      <Icon className="w-3 h-3" />{Math.abs(value)}%
    </span>
  );
};

const AdminInsights = () => {
  const [range, setRange] = useState<RangeKey>('30d');
  const [events, setEvents] = useState<EventRow[]>([]);
  const [eventsPrev, setEventsPrev] = useState<EventRow[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [clicks, setClicks] = useState<ClickRow[]>([]);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [productMap, setProductMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    (async () => {
      const map: Record<string, string> = {};
      const { data } = await supabase.from('products').select('id, name, image_url');
      for (const r of (data || []) as Array<{ id: string; name: string; image_url: string | null }>) {
        if (!r.image_url) continue;
        map[r.id] = r.image_url;
        if (r.name) map[r.name.toLowerCase()] = r.image_url;
      }
      setProductMap(map);
    })();
  }, []);

  const resolveImg = (id: string, name: string, fallback?: string) =>
    fallback || productMap[id] || productMap[name?.toLowerCase?.() || ''] || PLACEHOLDER;

  const fetchAllPaged = async <T,>(build: (from: number, to: number) => any, max = 30000): Promise<T[]> => {
    const out: T[] = []; const size = 1000;
    for (let from = 0; from < max; from += size) {
      const { data, error } = await build(from, from + size - 1);
      if (error || !data || data.length === 0) break;
      out.push(...(data as T[]));
      if (data.length < size) break;
    }
    return out;
  };

  const load = async () => {
    setLoading(true);
    const days = RANGES[range];
    const sinceCur = new Date(Date.now() - days * 86400000).toISOString();
    const sincePrev = new Date(Date.now() - 2 * days * 86400000).toISOString();
    const evCols = 'event_type, metadata, visitor_id, page_path, device_type, created_at';
    const [ev, evPrev, ck, { data: fb }, { data: ins }] = await Promise.all([
      fetchAllPaged<EventRow>((f, t) => supabase.from('site_analytics').select(evCols).gte('created_at', sinceCur).order('created_at', { ascending: true }).range(f, t)),
      fetchAllPaged<EventRow>((f, t) => supabase.from('site_analytics').select(evCols).gte('created_at', sincePrev).lt('created_at', sinceCur).order('created_at', { ascending: true }).range(f, t)),
      fetchAllPaged<ClickRow>((f, t) => supabase.from('click_events').select('page_path, element_text, visitor_id, created_at').gte('created_at', sinceCur).order('created_at', { ascending: true }).range(f, t)),
      supabase.from('exit_feedback').select('id, page_path, message, created_at').order('created_at', { ascending: false }).limit(100),
      supabase.from('daily_insights').select('for_date, summary_md, created_at').order('for_date', { ascending: false }).limit(1).maybeSingle(),
    ]);
    setEvents(ev);
    setEventsPrev(evPrev);
    setFeedback((fb as Feedback[]) || []);
    setClicks(ck);
    setInsight(ins as Insight | null);
    setLoading(false);
  };


  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [range]);

  // ---------- KPIs ----------
  const tally = (rows: EventRow[]) => {
    const visitors = new Set<string>();
    const productViewers = new Set<string>();
    const intentVisitors = new Set<string>();
    const deviceCount: Record<string, number> = {};
    let visits = 0;
    for (const r of rows) {
      if (r.visitor_id) visitors.add(r.visitor_id);
      if (r.event_type === 'page_view') visits++;
      if (r.device_type) deviceCount[r.device_type] = (deviceCount[r.device_type] || 0) + 1;
      if ((r.event_type === 'product_view' || r.event_type === 'tool_view') && r.visitor_id) productViewers.add(r.visitor_id);
      if ((r.event_type === 'whatsapp_click' || r.event_type === 'tool_whatsapp_click' || r.event_type === 'checkout_click') && r.visitor_id) intentVisitors.add(r.visitor_id);
    }
    return { visits, visitors: visitors.size, productViewers: productViewers.size, intentVisitors: intentVisitors.size, deviceCount };
  };
  const cur = useMemo(() => tally(events), [events]);
  const prev = useMemo(() => tally(eventsPrev), [eventsPrev]);
  const intentRate = cur.productViewers ? (cur.intentVisitors / cur.productViewers) * 100 : 0;
  const intentRatePrev = prev.productViewers ? (prev.intentVisitors / prev.productViewers) * 100 : 0;
  const topDevice = Object.entries(cur.deviceCount).sort((a, b) => b[1] - a[1])[0];

  // ---------- Category / product breakdowns ----------
  const stats = useMemo(() => {
    const catView: Record<string, number> = {};
    const catClick: Record<string, number> = {};
    const prodView: Record<string, { name: string; image?: string; views: number; clicks: number }> = {};
    for (const e of events) {
      const m = (e.metadata ?? {}) as { product_id?: string; tool_name?: string; name?: string; category?: string; image?: string };
      const id = String(m.product_id ?? m.tool_name ?? m.name ?? '');
      if (!id) continue;
      const isView = e.event_type === 'product_view' || e.event_type === 'tool_view';
      const isClick = e.event_type === 'whatsapp_click' || e.event_type === 'tool_whatsapp_click' || e.event_type === 'checkout_click';
      const cat = String(m.category ?? 'Other');
      if (isView) catView[cat] = (catView[cat] || 0) + 1;
      if (isClick) catClick[cat] = (catClick[cat] || 0) + 1;
      prodView[id] = prodView[id] || { name: String(m.name ?? m.tool_name ?? id), image: m.image as string | undefined, views: 0, clicks: 0 };
      if (isView) prodView[id].views++;
      if (isClick) prodView[id].clicks++;
    }
    const sortedCatView = Object.entries(catView).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const sortedCatClick = Object.entries(catClick).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const products = Object.values(prodView);
    const topByViews = [...products].sort((a, b) => b.views - a.views).slice(0, 10);
    const topByClicks = [...products].sort((a, b) => b.clicks - a.clicks).filter(p => p.clicks > 0).slice(0, 10);
    return { sortedCatView, sortedCatClick, topByViews, topByClicks };
  }, [events]);

  // ---------- Rising products (current half vs previous half of range) ----------
  const rising = useMemo(() => {
    const days = RANGES[range];
    const mid = Date.now() - (days / 2) * 86400000;
    const half: Record<string, { name: string; image?: string; recent: number; older: number }> = {};
    for (const e of events) {
      if (!(e.event_type === 'product_view' || e.event_type === 'tool_view')) continue;
      const m = (e.metadata ?? {}) as { product_id?: string; tool_name?: string; name?: string; image?: string };
      const id = String(m.product_id ?? m.tool_name ?? m.name ?? '');
      if (!id) continue;
      half[id] = half[id] || { name: String(m.name ?? m.tool_name ?? id), image: m.image as string | undefined, recent: 0, older: 0 };
      if (new Date(e.created_at).getTime() >= mid) half[id].recent++; else half[id].older++;
    }
    return Object.values(half)
      .map(p => ({ ...p, delta: p.recent - p.older, score: p.older === 0 ? p.recent * 2 : (p.recent - p.older) / Math.max(1, p.older) }))
      .filter(p => p.recent >= 3 && p.delta > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [events, range]);

  // ---------- Searched but not converted ----------
  const searchedNoConv = useMemo(() => {
    type SearchEntry = { term: string; visitor: string | null; ts: number };
    const searches: SearchEntry[] = [];
    const visitorIntent: Record<string, number[]> = {};
    for (const e of events) {
      const ts = new Date(e.created_at).getTime();
      if (e.event_type === 'search_query') {
        const m = (e.metadata ?? {}) as { q?: string; query?: string };
        const term = String(m.q ?? m.query ?? '').trim().toLowerCase();
        if (term) searches.push({ term, visitor: e.visitor_id, ts });
      }
      if (e.visitor_id && (e.event_type === 'whatsapp_click' || e.event_type === 'tool_whatsapp_click' || e.event_type === 'checkout_click')) {
        (visitorIntent[e.visitor_id] ||= []).push(ts);
      }
    }
    const counts: Record<string, number> = {};
    for (const s of searches) {
      const intents = s.visitor ? visitorIntent[s.visitor] || [] : [];
      const converted = intents.some(t => t > s.ts && t - s.ts < 30 * 60 * 1000); // within 30 min
      if (!converted) counts[s.term] = (counts[s.term] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [events]);

  // ---------- Rage clicks ----------
  const ragePages = useMemo(() => {
    const byVisitor: Record<string, ClickRow[]> = {};
    for (const c of clicks) {
      if (!c.visitor_id) continue;
      (byVisitor[c.visitor_id] ||= []).push(c);
    }
    const hits: Record<string, number> = {};
    for (const list of Object.values(byVisitor)) {
      const sorted = [...list].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
      for (let i = 0; i < sorted.length - 2; i++) {
        const a = sorted[i], c = sorted[i + 2];
        if (a.element_text && a.page_path === c.page_path && a.element_text === c.element_text) {
          const ms = +new Date(c.created_at) - +new Date(a.created_at);
          if (ms <= 1200) hits[a.page_path] = (hits[a.page_path] || 0) + 1;
        }
      }
    }
    return Object.entries(hits).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [clicks]);

  const catMax = Math.max(1, ...stats.sortedCatView.map(([, v]) => v));
  const clickMax = Math.max(1, ...stats.sortedCatClick.map(([, v]) => v));

  const generateDaily = async () => {
    setGenerating(true);
    try {
      const { error } = await supabase.functions.invoke('generate-insights', { body: { mode: 'daily' } });
      if (error) throw error;
      await load();
    } catch (e) { console.error(e); }
    finally { setGenerating(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Sparkles className="w-6 h-6 text-primary" /> Insights & voice of customer</h1>
        <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Headline KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Visits</p><Delta value={deltaPct(cur.visits, prev.visits)} /></div>
          <p className="font-display text-2xl font-bold mt-1">{fmt(cur.visits)}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Unique visitors</p><Delta value={deltaPct(cur.visitors, prev.visitors)} /></div>
          <p className="font-display text-2xl font-bold mt-1">{fmt(cur.visitors)}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center justify-between"><p className="text-xs text-muted-foreground flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> Intent rate</p><Delta value={deltaPct(Math.round(intentRate * 10), Math.round(intentRatePrev * 10))} /></div>
          <p className="font-display text-2xl font-bold mt-1">{pct(cur.intentVisitors, cur.productViewers)}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{fmt(cur.intentVisitors)} of {fmt(cur.productViewers)} viewers</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Top device</p>
          <p className="font-display text-2xl font-bold mt-1 capitalize">{topDevice?.[0] ?? '—'}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{topDevice ? `${fmt(topDevice[1])} events` : 'no data'}</p>
        </CardContent></Card>
      </div>

      {/* AI Daily Brief */}
      <Card className="border-primary/40"><CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="font-display font-semibold text-lg flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> Today's AI brief</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {insight ? `Generated for ${insight.for_date}` : 'No brief yet — generate the first one.'}
            </p>
          </div>
          <Button size="sm" onClick={generateDaily} disabled={generating}>
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${generating ? 'animate-spin' : ''}`} /> {generating ? 'Thinking…' : 'Generate now'}
          </Button>
        </div>
        {insight ? (
          <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {insight.summary_md}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Run the generator to get a 4-bullet summary of what users wanted, what blocked them, and what's trending.</p>
        )}
      </CardContent></Card>

      {/* Categories */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card><CardContent className="p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Eye className="w-4 h-4" /> Top categories visited</h3>
          {stats.sortedCatView.length === 0 ? <p className="text-xs text-muted-foreground">No data yet.</p> : (
            <ul className="space-y-2">
              {stats.sortedCatView.map(([k, v]) => (
                <li key={k}>
                  <div className="flex justify-between text-xs mb-1"><span className="font-medium">{k}</span><span className="text-muted-foreground tabular-nums">{fmt(v)}</span></div>
                  <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-500/80 to-sky-500/40" style={{ width: `${(v / catMax) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent></Card>

        <Card><CardContent className="p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-emerald-400" /> Top categories with intent</h3>
          {stats.sortedCatClick.length === 0 ? <p className="text-xs text-muted-foreground">No click intent yet.</p> : (
            <ul className="space-y-2">
              {stats.sortedCatClick.map(([k, v]) => (
                <li key={k}>
                  <div className="flex justify-between text-xs mb-1"><span className="font-medium">{k}</span><span className="text-emerald-400 tabular-nums">{fmt(v)}</span></div>
                  <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500/80 to-emerald-500/40" style={{ width: `${(v / clickMax) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent></Card>
      </div>

      {/* Rising + Searched-but-not-bought */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-primary/30"><CardContent className="p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Flame className="w-4 h-4 text-primary" /> Hot rising products</h3>
          {rising.length === 0 ? <p className="text-xs text-muted-foreground">No clear risers in this window yet.</p> : (
            <ul className="space-y-2 text-xs">
              {rising.map((p) => (
                <li key={p.name} className="flex items-center gap-3 bg-secondary/20 rounded-lg p-2">
                  <img src={resolveImg("", p.name, p.image)} alt={p.name} className="w-8 h-8 rounded object-contain bg-background/40" onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }} />
                  <span className="flex-1 truncate font-medium" title={p.name}>{p.name}</span>
                  <span className="text-emerald-400 font-semibold tabular-nums">+{p.delta}</span>
                  <span className="text-[10px] text-muted-foreground tabular-nums w-14 text-right">{p.recent} vs {p.older}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent></Card>

        <Card className="border-amber-500/30"><CardContent className="p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><SearchX className="w-4 h-4 text-amber-400" /> Searched but didn't convert</h3>
          {searchedNoConv.length === 0 ? <p className="text-xs text-muted-foreground">Once visitors search and bounce, terms appear here — likely demand you're missing.</p> : (
            <ul className="space-y-1.5 text-xs">
              {searchedNoConv.map(([term, n]) => (
                <li key={term} className="flex justify-between items-center bg-amber-500/5 border border-amber-500/20 rounded px-2 py-1.5">
                  <span className="truncate">{term}</span>
                  <span className="text-amber-400 font-semibold tabular-nums">{n}×</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent></Card>
      </div>

      {/* Top products visual */}
      <Card><CardContent className="p-5">
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Top products — most viewed</h3>
        {stats.topByViews.length === 0 ? <p className="text-xs text-muted-foreground">Once visitors browse products, they'll appear here with images and counts.</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {stats.topByViews.map((p) => (
              <div key={p.name} className="bg-secondary/20 border border-border rounded-xl p-2.5 flex flex-col items-center text-center">
                <div className="w-full aspect-square bg-background/40 rounded-lg overflow-hidden mb-2">
                  <img src={resolveImg("", p.name, p.image)} alt={p.name} className="w-full h-full object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }} />
                </div>
                <p className="text-xs font-medium truncate w-full" title={p.name}>{p.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{p.views} views · {p.clicks} clicks</p>
              </div>
            ))}
          </div>
        )}
      </CardContent></Card>

      <Card><CardContent className="p-5">
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-emerald-400" /> Top products — most clicked (real intent)</h3>
        {stats.topByClicks.length === 0 ? <p className="text-xs text-muted-foreground">No WhatsApp or checkout clicks yet.</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {stats.topByClicks.map((p) => (
              <div key={p.name} className="bg-emerald-500/5 border border-emerald-500/30 rounded-xl p-2.5 flex flex-col items-center text-center">
                <div className="w-full aspect-square bg-background/40 rounded-lg overflow-hidden mb-2">
                  <img src={resolveImg("", p.name, p.image)} alt={p.name} className="w-full h-full object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }} />
                </div>
                <p className="text-xs font-medium truncate w-full" title={p.name}>{p.name}</p>
                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">{p.clicks} clicks · {p.views} views</p>
              </div>
            ))}
          </div>
        )}
      </CardContent></Card>

      {/* Rage + Exit feedback */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-rose-500/30"><CardContent className="p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-rose-400" /> Pages with rage clicks</h3>
          {ragePages.length === 0 ? <p className="text-xs text-muted-foreground">No frustrated repeated clicks detected — clean UX.</p> : (
            <ul className="space-y-1.5 text-xs">
              {ragePages.map(([page, n]) => (
                <li key={page} className="flex justify-between items-center bg-rose-500/5 border border-rose-500/20 rounded px-2 py-1.5">
                  <span className="truncate font-mono">{page}</span>
                  <span className="text-rose-400 font-semibold tabular-nums">{n} bursts</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent></Card>

        <Card><CardContent className="p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><MailQuestion className="w-4 h-4 text-primary" /> Exit-intent feedback</h3>
          {feedback.length === 0 ? (
            <p className="text-xs text-muted-foreground">When visitors close the tab we ask "What were you looking for?" — answers appear here.</p>
          ) : (
            <ul className="space-y-2.5 text-xs max-h-[280px] overflow-y-auto">
              {feedback.map(f => (
                <li key={f.id} className="border-l-2 border-primary/60 pl-2.5">
                  <p className="text-foreground/90">"{f.message}"</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{f.page_path} · {new Date(f.created_at).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent></Card>
      </div>
    </div>
  );
};

export default AdminInsights;

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, TrendingUp, Eye, MessageCircle, RefreshCw, Smile, Meh, Frown, MailQuestion } from 'lucide-react';

const RANGES = { '7d': 7, '30d': 30, '90d': 90 } as const;
type RangeKey = keyof typeof RANGES;

interface EventRow { event_type: string; metadata: Record<string, unknown> | null; visitor_id: string | null }
interface Feedback { id: string; page_path: string; message: string; created_at: string }
interface Review { id: string; sentiment: string | null; sentiment_summary: string | null; body: string; rating: number; created_at: string }
interface Insight { for_date: string; summary_md: string; created_at: string }

const fmt = (n: number) => n.toLocaleString();

const PLACEHOLDER = '/placeholder.svg';

const AdminInsights = () => {
  const [range, setRange] = useState<RangeKey>('30d');
  const [events, setEvents] = useState<EventRow[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [classifying, setClassifying] = useState(false);

  const load = async () => {
    setLoading(true);
    const since = new Date(Date.now() - RANGES[range] * 86400000).toISOString();
    const [{ data: ev }, { data: fb }, { data: rv }, { data: ins }] = await Promise.all([
      supabase.from('site_analytics').select('event_type, metadata, visitor_id').in('event_type', ['product_view', 'tool_view', 'whatsapp_click', 'tool_whatsapp_click', 'checkout_click', 'add_to_cart']).gte('created_at', since).limit(20000),
      supabase.from('exit_feedback').select('id, page_path, message, created_at').order('created_at', { ascending: false }).limit(100),
      supabase.from('product_reviews').select('id, sentiment, sentiment_summary, body, rating, created_at').order('created_at', { ascending: false }).limit(100),
      supabase.from('daily_insights').select('for_date, summary_md, created_at').order('for_date', { ascending: false }).limit(1).maybeSingle(),
    ]);
    setEvents((ev as EventRow[]) || []);
    setFeedback((fb as Feedback[]) || []);
    setReviews((rv as Review[]) || []);
    setInsight(ins as Insight | null);
    setLoading(false);
  };

  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [range]);

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
    const totalEvents = events.length;
    return { sortedCatView, sortedCatClick, topByViews, topByClicks, totalEvents };
  }, [events]);

  const sentimentTally = useMemo(() => {
    const t = { positive: 0, neutral: 0, negative: 0, unclassified: 0 };
    for (const r of reviews) {
      if (r.sentiment === 'positive') t.positive++;
      else if (r.sentiment === 'neutral') t.neutral++;
      else if (r.sentiment === 'negative') t.negative++;
      else t.unclassified++;
    }
    return t;
  }, [reviews]);

  const callFn = async (mode: string) => {
    const { data, error } = await supabase.functions.invoke('generate-insights', { body: { mode } });
    if (error) throw error;
    return data;
  };

  const generateDaily = async () => {
    setGenerating(true);
    try { await callFn('daily'); await load(); }
    catch (e) { console.error(e); }
    finally { setGenerating(false); }
  };

  const classifyReviews = async () => {
    setClassifying(true);
    try { await callFn('review_sentiment'); await load(); }
    catch (e) { console.error(e); }
    finally { setClassifying(false); }
  };

  const catMax = Math.max(1, ...stats.sortedCatView.map(([, v]) => v));
  const clickMax = Math.max(1, ...stats.sortedCatClick.map(([, v]) => v));

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
          <p className="text-sm text-muted-foreground">Run the generator to get a 5-bullet summary of what users wanted, what blocked them, and what's trending.</p>
        )}
      </CardContent></Card>

      {/* Top categories */}
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
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-emerald-400" /> Top categories with intent (WA / checkout)</h3>
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

      {/* Top products visual */}
      <Card><CardContent className="p-5">
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Top products — most viewed</h3>
        {stats.topByViews.length === 0 ? <p className="text-xs text-muted-foreground">Once visitors browse products, they'll appear here with images and counts.</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {stats.topByViews.map((p) => (
              <div key={p.name} className="bg-secondary/20 border border-border rounded-xl p-2.5 flex flex-col items-center text-center">
                <div className="w-full aspect-square bg-background/40 rounded-lg overflow-hidden mb-2">
                  <img src={p.image || PLACEHOLDER} alt={p.name} className="w-full h-full object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }} />
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
                  <img src={p.image || PLACEHOLDER} alt={p.name} className="w-full h-full object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }} />
                </div>
                <p className="text-xs font-medium truncate w-full" title={p.name}>{p.name}</p>
                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">{p.clicks} clicks · {p.views} views</p>
              </div>
            ))}
          </div>
        )}
      </CardContent></Card>

      {/* Sentiment + exit feedback */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card><CardContent className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-semibold text-sm">Review sentiment</h3>
            <Button size="sm" variant="outline" onClick={classifyReviews} disabled={classifying}>
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${classifying ? 'animate-spin' : ''}`} /> {classifying ? 'Classifying…' : 'Classify new'}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center">
              <Smile className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-emerald-400">{sentimentTally.positive}</p>
              <p className="text-[10px] text-muted-foreground">Positive</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center">
              <Meh className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-amber-400">{sentimentTally.neutral}</p>
              <p className="text-[10px] text-muted-foreground">Neutral</p>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 text-center">
              <Frown className="w-5 h-5 text-rose-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-rose-400">{sentimentTally.negative}</p>
              <p className="text-[10px] text-muted-foreground">Negative</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs max-h-[200px] overflow-y-auto">
            {reviews.filter(r => r.sentiment === 'negative').slice(0, 5).map(r => (
              <li key={r.id} className="border-l-2 border-rose-400/60 pl-2">
                <p className="text-foreground/90">{r.sentiment_summary ?? r.body.slice(0, 120)}</p>
              </li>
            ))}
            {sentimentTally.unclassified > 0 && (
              <li className="text-muted-foreground italic">{sentimentTally.unclassified} review(s) waiting to be classified.</li>
            )}
          </ul>
        </CardContent></Card>

        <Card><CardContent className="p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><MailQuestion className="w-4 h-4 text-primary" /> Exit-intent feedback</h3>
          {feedback.length === 0 ? (
            <p className="text-xs text-muted-foreground">When visitors close the tab on /products or /all-tools we ask "What were you looking for?" — answers appear here.</p>
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

      <Card><CardContent className="p-5">
        <h3 className="font-semibold text-sm mb-2">More ways to know what users want</h3>
        <ul className="text-xs text-muted-foreground space-y-1.5">
          <li>• <span className="text-foreground">Search-intent clusters</span> — call <code className="text-primary">generate-insights</code> with <code>mode: "search_clusters"</code> to group raw searches into demand themes.</li>
          <li>• <span className="text-foreground">WhatsApp question capture</span> — add a 1-question modal before each WhatsApp deep-link so you see the question before users leave.</li>
          <li>• <span className="text-foreground">NPS / mood widget</span> — single-emoji footer on product pages to measure delight per category.</li>
          <li>• <span className="text-foreground">Session replay (rrweb)</span> — heavier, but lets you watch real sessions; recommended once you've validated the above.</li>
        </ul>
      </CardContent></Card>
    </div>
  );
};

export default AdminInsights;

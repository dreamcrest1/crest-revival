import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, TrendingDown, TrendingUp, Smartphone, Monitor, Tablet, Globe } from 'lucide-react';

const RANGES = { '7d': 7, '30d': 30, '90d': 90 } as const;
type RangeKey = keyof typeof RANGES;
type Device = 'all' | 'desktop' | 'mobile' | 'tablet';

interface Row { event_type: string; page_path: string; device_type: string | null; visitor_id: string | null; metadata: Record<string, unknown> | null }

const STAGES = [
  { key: 'page_view',      label: 'Page visit',        color: 'from-sky-500/80 to-sky-500/30' },
  { key: 'product_view',   label: 'Product / Tool view', color: 'from-primary to-primary/40' },
  { key: 'add_to_cart',    label: 'Add to cart',       color: 'from-violet-500/80 to-violet-500/30' },
  { key: 'whatsapp_click', label: 'WhatsApp intent',   color: 'from-emerald-500/80 to-emerald-500/30' },
  { key: 'checkout_click', label: 'Checkout click',    color: 'from-rose-500/80 to-rose-500/30' },
] as const;

const tally = (rows: Row[], device: Device) => {
  const counts: Record<string, number> = {};
  const visitorsByStage: Record<string, Set<string>> = {};
  const productViewVisitors = new Set<string>();
  const convertedVisitors = new Set<string>();
  const pageDropoff: Record<string, { views: number; converts: number }> = {};

  for (const r of rows) {
    if (device !== 'all' && r.device_type !== device) continue;
    counts[r.event_type] = (counts[r.event_type] || 0) + 1;
    if (r.visitor_id) {
      (visitorsByStage[r.event_type] ||= new Set()).add(r.visitor_id);
    }
    if (r.event_type === 'product_view' || r.event_type === 'tool_view') {
      const k = r.page_path;
      pageDropoff[k] = pageDropoff[k] || { views: 0, converts: 0 };
      pageDropoff[k].views++;
      if (r.visitor_id) productViewVisitors.add(r.visitor_id);
    }
    if (r.event_type === 'whatsapp_click' || r.event_type === 'tool_whatsapp_click' || r.event_type === 'checkout_click') {
      if (r.visitor_id) convertedVisitors.add(r.visitor_id);
      const k = r.page_path;
      if (pageDropoff[k]) pageDropoff[k].converts++;
    }
  }
  // Merge tool events into product/whatsapp buckets for the funnel
  counts.product_view = (counts.product_view || 0) + (counts.tool_view || 0);
  counts.whatsapp_click = (counts.whatsapp_click || 0) + (counts.tool_whatsapp_click || 0);

  const stagedCounts = STAGES.map((s) => ({ ...s, value: counts[s.key] || 0 }));
  const droppers = Object.entries(pageDropoff)
    .filter(([, v]) => v.views >= 3)
    .map(([page, v]) => ({ page, views: v.views, converts: v.converts, rate: v.views ? v.converts / v.views : 0 }))
    .sort((a, b) => (a.rate - b.rate) || (b.views - a.views))
    .slice(0, 6);

  return { stagedCounts, droppers, convertedVisitors: convertedVisitors.size, productViewVisitors: productViewVisitors.size };
};

const fmt = (n: number) => n.toLocaleString();
const pct = (n: number, d: number) => (d > 0 ? `${Math.round((n / d) * 1000) / 10}%` : '—');
const deltaPct = (a: number, b: number) => (b > 0 ? Math.round(((a - b) / b) * 100) : null);

const DeviceIcon = ({ d }: { d: Device }) =>
  d === 'mobile' ? <Smartphone className="w-4 h-4" /> :
  d === 'tablet' ? <Tablet className="w-4 h-4" /> :
  d === 'desktop' ? <Monitor className="w-4 h-4" /> :
  <Globe className="w-4 h-4" />;

const AdminFunnel = () => {
  const [range, setRange] = useState<RangeKey>('30d');
  const [device, setDevice] = useState<Device>('all');
  const [rowsCurrent, setRowsCurrent] = useState<Row[]>([]);
  const [rowsPrev, setRowsPrev] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      const days = RANGES[range];
      const now = Date.now();
      const sinceCur = new Date(now - days * 86400000).toISOString();
      const sincePrev = new Date(now - 2 * days * 86400000).toISOString();
      const upToPrev = new Date(now - days * 86400000).toISOString();

      const PAGE = 1000;
      const fetchAll = async (start: string, end?: string) => {
        const all: Row[] = [];
        for (let from = 0; from < 200000; from += PAGE) {
          let q = supabase.from('site_analytics')
            .select('event_type, page_path, device_type, visitor_id, metadata')
            .gte('created_at', start);
          if (end) q = q.lt('created_at', end);
          const { data } = await q.range(from, from + PAGE - 1);
          if (!data || data.length === 0) break;
          all.push(...(data as Row[]));
          if (data.length < PAGE) break;
        }
        return all;
      };

      const [cur, prev] = await Promise.all([fetchAll(sinceCur), fetchAll(sincePrev, upToPrev)]);
      if (cancel) return;
      setRowsCurrent(cur);
      setRowsPrev(prev);
      setLoading(false);
    })();
    return () => { cancel = true; };
  }, [range]);

  const cur = useMemo(() => tally(rowsCurrent, device), [rowsCurrent, device]);
  const prev = useMemo(() => tally(rowsPrev, device), [rowsPrev, device]);

  const maxValue = Math.max(1, ...cur.stagedCounts.map(s => s.value));
  const visits = cur.stagedCounts[0].value || 1;
  const overallConv = pct(cur.convertedVisitors, cur.productViewVisitors);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Filter className="w-6 h-6" /> Conversion funnel</h1>
        <div className="flex items-center gap-2">
          <Select value={device} onValueChange={(v) => setDevice(v as Device)}>
            <SelectTrigger className="w-36"><div className="flex items-center gap-2"><DeviceIcon d={device} /><SelectValue /></div></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All devices</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
            </SelectContent>
          </Select>
          <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? <p className="text-muted-foreground">Loading…</p> : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Visits', v: cur.stagedCounts[0].value, p: prev.stagedCounts[0].value },
              { label: 'View → Intent', v: cur.convertedVisitors, p: prev.convertedVisitors },
              { label: 'Conv. rate (view → WA/checkout)', v: overallConv, p: '' },
              { label: 'Drop-off pages', v: cur.droppers.length, p: prev.droppers.length },
            ].map((s) => {
              const d = typeof s.v === 'number' && typeof s.p === 'number' ? deltaPct(s.v, s.p) : null;
              return (
                <Card key={s.label}><CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-display text-2xl font-bold mt-1">{typeof s.v === 'number' ? fmt(s.v) : s.v}</p>
                  {d !== null && (
                    <p className={`text-xs mt-1 flex items-center gap-1 ${d >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {d >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {d}% vs prev. {RANGES[range]}d
                    </p>
                  )}
                </CardContent></Card>
              );
            })}
          </div>

          <Card><CardContent className="p-6 space-y-3">
            {cur.stagedCounts.map((s, i) => {
              const prevStage = i > 0 ? cur.stagedCounts[i - 1].value : null;
              const stepConv = prevStage ? pct(s.value, prevStage) : '—';
              const fromVisits = pct(s.value, visits);
              const widthPct = Math.max(6, Math.round((s.value / maxValue) * 100));
              const prevVal = prev.stagedCounts.find(x => x.key === s.key)?.value ?? 0;
              const d = deltaPct(s.value, prevVal);
              return (
                <div key={s.key} className="group">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}</span>
                      <span className="font-semibold text-sm">{s.label}</span>
                    </div>
                    <div className="flex items-baseline gap-3 text-xs">
                      {i > 0 && <span className="text-amber-400">step {stepConv}</span>}
                      <span className="text-muted-foreground">{fromVisits} of visits</span>
                      {d !== null && (
                        <span className={d >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{d >= 0 ? '+' : ''}{d}%</span>
                      )}
                      <span className="font-semibold tabular-nums w-20 text-right">{fmt(s.value)}</span>
                    </div>
                  </div>
                  <div className="h-8 bg-secondary/20 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full bg-gradient-to-r ${s.color} transition-all duration-700 rounded-lg`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent></Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card><CardContent className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-rose-400" /> Top drop-off pages</h3>
              {cur.droppers.length === 0 ? <p className="text-sm text-muted-foreground">No data yet.</p> : (
                <ul className="space-y-2 text-sm">
                  {cur.droppers.map((d) => (
                    <li key={d.page} className="flex justify-between items-center gap-3">
                      <span className="truncate" title={d.page}>{d.page}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{d.converts}/{d.views} convert ({Math.round(d.rate * 100)}%)</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent></Card>

            <Card><CardContent className="p-5">
              <h3 className="font-semibold mb-3">How to read this</h3>
              <ul className="text-xs text-muted-foreground space-y-2">
                <li>• <span className="text-foreground">Step %</span> shows visitors who moved from the previous stage to this one.</li>
                <li>• <span className="text-foreground">Of visits</span> is the share of total page visits that reached this stage.</li>
                <li>• <span className="text-foreground">+/- %</span> compares to the previous {RANGES[range]}-day window.</li>
                <li>• Tool views and tool WhatsApp clicks are folded into product view and WhatsApp intent.</li>
              </ul>
            </CardContent></Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminFunnel;

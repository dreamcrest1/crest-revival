import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bug, RefreshCw } from 'lucide-react';

const RANGES = { '7d': 7, '30d': 30, '90d': 90 } as const;
type RangeKey = keyof typeof RANGES;

interface Row {
  id: string;
  created_at: string;
  event_type: string;
  page_path: string | null;
  visitor_id: string | null;
  device_type: string | null;
  browser: string | null;
  country: string | null;
  city: string | null;
  metadata: Record<string, unknown> | null;
}

const PAGE = 1000;
const MAX = 30000;

const AdminAnalyticsDebug = () => {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [eventType, setEventType] = useState(params.get('event') ?? 'search_query');
  const [range, setRange] = useState<RangeKey>((params.get('range') as RangeKey) ?? '90d');
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const since = new Date(Date.now() - RANGES[range] * 86400 * 1000).toISOString();
    const collected: Row[] = [];

    // Exact count from Postgres (server-side, no row download)
    const { count } = await supabase
      .from('site_analytics')
      .select('id', { count: 'exact', head: true })
      .eq('event_type', eventType)
      .gte('created_at', since);
    setTotal(count ?? 0);

    for (let from = 0; from < MAX; from += PAGE) {
      const { data, error } = await supabase
        .from('site_analytics')
        .select('id, created_at, event_type, page_path, visitor_id, device_type, browser, country, city, metadata')
        .eq('event_type', eventType)
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .range(from, from + PAGE - 1);
      if (error || !data?.length) break;
      collected.push(...(data as Row[]));
      if (data.length < PAGE) break;
    }
    setRows(collected);
    setLoading(false);
  };

  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [eventType, range]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) => {
      const m = (r.metadata ?? {}) as Record<string, unknown>;
      const hay = JSON.stringify(m).toLowerCase() + ' ' + (r.page_path || '').toLowerCase();
      return hay.includes(needle);
    });
  }, [rows, q]);

  const applyFilter = () => {
    const next = new URLSearchParams(params);
    if (q) next.set('q', q); else next.delete('q');
    next.set('event', eventType);
    next.set('range', range);
    setParams(next, { replace: true });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Bug className="w-6 h-6 text-primary" /> Analytics debug</h1>
        <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Reload
        </Button>
      </div>

      <Card><CardContent className="p-5 space-y-4">
        <div className="grid sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground mb-1 block">Filter (matches metadata + path)</label>
            <Input value={q} onChange={(e) => setQ(e.target.value)} onBlur={applyFilter} placeholder="e.g. netflix" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Event type</label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="search_query">search_query</SelectItem>
                <SelectItem value="page_view">page_view</SelectItem>
                <SelectItem value="product_view">product_view</SelectItem>
                <SelectItem value="tool_view">tool_view</SelectItem>
                <SelectItem value="whatsapp_click">whatsapp_click</SelectItem>
                <SelectItem value="tool_whatsapp_click">tool_whatsapp_click</SelectItem>
                <SelectItem value="checkout_click">checkout_click</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Range</label>
            <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Server count: <span className="text-foreground font-semibold">{total?.toLocaleString() ?? '—'}</span>
          {' · '}Loaded: <span className="text-foreground font-semibold">{rows.length.toLocaleString()}</span>
          {' · '}Filtered: <span className="text-foreground font-semibold">{filtered.length.toLocaleString()}</span>
          {total !== null && rows.length < total && (
            <span className="ml-2 text-amber-400">(capped at {MAX.toLocaleString()})</span>
          )}
        </p>
      </CardContent></Card>

      <Card><CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-secondary/30 text-muted-foreground">
              <tr>
                <th className="text-left p-2">When</th>
                <th className="text-left p-2">Path</th>
                <th className="text-left p-2">Visitor</th>
                <th className="text-left p-2">Device</th>
                <th className="text-left p-2">Location</th>
                <th className="text-left p-2">Metadata</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">Loading…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No matching rows.</td></tr>}
              {filtered.slice(0, 500).map((r) => (
                <tr key={r.id} className="border-t border-border/40 align-top">
                  <td className="p-2 whitespace-nowrap text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="p-2 max-w-[160px] truncate" title={r.page_path || ''}>{r.page_path}</td>
                  <td className="p-2 max-w-[120px] truncate" title={r.visitor_id || ''}>{r.visitor_id?.slice(0, 8)}</td>
                  <td className="p-2">{[r.device_type, r.browser].filter(Boolean).join(' · ')}</td>
                  <td className="p-2">{[r.city, r.country].filter(Boolean).join(', ')}</td>
                  <td className="p-2"><pre className="text-[10px] whitespace-pre-wrap break-all bg-background/40 rounded p-1.5 max-w-[420px]">{JSON.stringify(r.metadata, null, 0)}</pre></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 500 && (
            <p className="text-xs text-muted-foreground p-3">Showing first 500 of {filtered.length.toLocaleString()} filtered rows.</p>
          )}
        </div>
      </CardContent></Card>
    </div>
  );
};

export default AdminAnalyticsDebug;

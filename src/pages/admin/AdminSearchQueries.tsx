import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { SearchCheck, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

interface Row { metadata: { query?: string; source?: string } | null }

const PAGE = 1000;
const MAX = 30000;

const AdminSearchQueries = () => {
  const [tally, setTally] = useState<[string, number][]>([]);
  const [total, setTotal] = useState(0);
  const [serverCount, setServerCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 90 * 86400 * 1000).toISOString();

      // Verification: exact server-side count for the same window/filter
      const { count } = await supabase
        .from('site_analytics')
        .select('id', { count: 'exact', head: true })
        .eq('event_type', 'search_query')
        .gte('created_at', since);
      setServerCount(count ?? 0);

      const all: Row[] = [];
      for (let from = 0; from < MAX; from += PAGE) {
        const { data, error } = await supabase
          .from('site_analytics')
          .select('metadata')
          .eq('event_type', 'search_query')
          .gte('created_at', since)
          .order('created_at', { ascending: true })
          .range(from, from + PAGE - 1);
        if (error || !data?.length) break;
        all.push(...(data as Row[]));
        if (data.length < PAGE) break;
      }
      const counts: Record<string, number> = {};
      for (const r of all) {
        const q = (r.metadata?.query || '').trim().toLowerCase();
        if (q) counts[q] = (counts[q] || 0) + 1;
      }
      setTotal(all.length);
      setTally(Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 200));
      setLoading(false);
    })();
  }, []);

  const verified = serverCount !== null && serverCount === total;
  const capped = serverCount !== null && total < serverCount;

  return (
    <div className="space-y-4 max-w-3xl">
      <h1 className="font-display text-2xl font-bold flex items-center gap-2"><SearchCheck className="w-6 h-6" /> Top search queries (90 days)</h1>
      <Card><CardContent className="p-5">
        {loading ? <p className="text-muted-foreground">Loading…</p> : tally.length === 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">No search queries logged yet.</p>
            <p className="text-xs text-muted-foreground">Searches on Products, AI Tools, and All Tools pages will appear here ~1 second after a visitor stops typing.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <p className="text-xs text-muted-foreground">
                {total.toLocaleString()} search events · {tally.length} unique queries
                {serverCount !== null && <> · server total: <span className="text-foreground font-semibold">{serverCount.toLocaleString()}</span></>}
              </p>
              {verified && (
                <span className="text-[11px] inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded px-2 py-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Verified vs server count
                </span>
              )}
              {capped && (
                <span className="text-[11px] inline-flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded px-2 py-0.5">
                  <AlertTriangle className="w-3 h-3" /> Loaded {total.toLocaleString()} of {serverCount?.toLocaleString()} — increase paging cap
                </span>
              )}
            </div>
            <table className="w-full text-sm">
              <thead><tr className="text-xs text-muted-foreground border-b border-border"><th className="text-left py-2">Query</th><th className="text-right">Count</th><th className="w-10"></th></tr></thead>
              <tbody>
                {tally.map(([q, n]) => (
                  <tr key={q} className="border-b border-border/40">
                    <td className="py-2">{q}</td>
                    <td className="text-right font-semibold text-primary">{n}</td>
                    <td className="text-right">
                      <Link
                        to={`/admin/analytics-debug?event=search_query&range=90d&q=${encodeURIComponent(q)}`}
                        className="inline-flex items-center text-muted-foreground hover:text-primary"
                        title="View raw matching rows"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </CardContent></Card>
    </div>
  );
};

export default AdminSearchQueries;

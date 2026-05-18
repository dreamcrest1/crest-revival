import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { SearchCheck } from 'lucide-react';

interface Row { metadata: { query?: string } | null }

const AdminSearchQueries = () => {
  const [tally, setTally] = useState<[string, number][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('site_analytics')
        .select('metadata')
        .eq('event_type', 'search_query')
        .gte('created_at', new Date(Date.now() - 90 * 86400 * 1000).toISOString())
        .limit(5000);
      const counts: Record<string, number> = {};
      for (const r of (data as Row[]) || []) {
        const q = (r.metadata?.query || '').trim().toLowerCase();
        if (q) counts[q] = (counts[q] || 0) + 1;
      }
      setTally(Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 100));
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-4 max-w-3xl">
      <h1 className="font-display text-2xl font-bold flex items-center gap-2"><SearchCheck className="w-6 h-6" /> Top search queries (90 days)</h1>
      <Card><CardContent className="p-5">
        {loading ? <p className="text-muted-foreground">Loading…</p> : tally.length === 0 ? <p className="text-sm text-muted-foreground">No search queries logged yet.</p> : (
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-muted-foreground border-b border-border"><th className="text-left py-2">Query</th><th className="text-right">Count</th></tr></thead>
            <tbody>
              {tally.map(([q, n]) => (
                <tr key={q} className="border-b border-border/40"><td className="py-2">{q}</td><td className="text-right font-semibold text-primary">{n}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent></Card>
    </div>
  );
};

export default AdminSearchQueries;

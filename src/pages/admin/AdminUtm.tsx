import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

interface Row { metadata: { utm_source?: string; utm_medium?: string; utm_campaign?: string } | null; event_type: string }

const AdminUtm = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('site_analytics')
        .select('metadata, event_type')
        .gte('created_at', new Date(Date.now() - 30 * 86400 * 1000).toISOString())
        .not('metadata', 'is', null)
        .limit(5000);
      setRows((data as Row[]) || []);
      setLoading(false);
    })();
  }, []);

  const groupBy = (key: 'utm_source' | 'utm_medium' | 'utm_campaign') => {
    const map: Record<string, { visits: number; conversions: number }> = {};
    for (const r of rows) {
      const v = r.metadata?.[key];
      if (!v) continue;
      if (!map[v]) map[v] = { visits: 0, conversions: 0 };
      if (r.event_type === 'page_view') map[v].visits++;
      if (r.event_type === 'whatsapp_click' || r.event_type === 'checkout_click') map[v].conversions++;
    }
    return Object.entries(map).sort((a, b) => b[1].visits - a[1].visits).slice(0, 20);
  };

  const Section = ({ title, data }: { title: string; data: [string, { visits: number; conversions: number }][] }) => (
    <Card><CardContent className="p-5">
      <h2 className="font-semibold mb-3">{title}</h2>
      {data.length === 0 ? <p className="text-sm text-muted-foreground">No data yet.</p> : (
        <table className="w-full text-sm">
          <thead><tr className="text-xs text-muted-foreground border-b border-border"><th className="text-left py-2">Value</th><th className="text-right">Visits</th><th className="text-right">Conv.</th><th className="text-right">CR</th></tr></thead>
          <tbody>
            {data.map(([k, v]) => (
              <tr key={k} className="border-b border-border/40"><td className="py-2">{k}</td><td className="text-right">{v.visits}</td><td className="text-right">{v.conversions}</td><td className="text-right text-primary">{v.visits ? `${Math.round((v.conversions / v.visits) * 100)}%` : '—'}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </CardContent></Card>
  );

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Megaphone className="w-6 h-6" /> UTM campaigns (30 days)</h1>
      {loading ? <p className="text-muted-foreground">Loading…</p> : (
        <div className="grid md:grid-cols-2 gap-4">
          <Section title="Top sources" data={groupBy('utm_source')} />
          <Section title="Top mediums" data={groupBy('utm_medium')} />
          <Section title="Top campaigns" data={groupBy('utm_campaign')} />
        </div>
      )}
    </div>
  );
};

export default AdminUtm;

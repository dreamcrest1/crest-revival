import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Globe } from 'lucide-react';

interface Row { country: string | null; city: string | null }

const AdminGeo = () => {
  const [countries, setCountries] = useState<[string, number][]>([]);
  const [cities, setCities] = useState<[string, number][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('site_analytics')
        .select('country, city')
        .gte('created_at', new Date(Date.now() - 30 * 86400 * 1000).toISOString())
        .limit(10000);
      const cMap: Record<string, number> = {};
      const ctMap: Record<string, number> = {};
      for (const r of (data as Row[]) || []) {
        if (r.country) cMap[r.country] = (cMap[r.country] || 0) + 1;
        if (r.city) {
          const key = `${r.city}${r.country ? ', ' + r.country : ''}`;
          ctMap[key] = (ctMap[key] || 0) + 1;
        }
      }
      setCountries(Object.entries(cMap).sort((a, b) => b[1] - a[1]).slice(0, 25));
      setCities(Object.entries(ctMap).sort((a, b) => b[1] - a[1]).slice(0, 50));
      setLoading(false);
    })();
  }, []);

  const Table = ({ title, data }: { title: string; data: [string, number][] }) => (
    <Card><CardContent className="p-5">
      <h2 className="font-semibold mb-3">{title}</h2>
      {data.length === 0 ? <p className="text-sm text-muted-foreground">No data yet.</p> : (
        <ul className="space-y-1.5 text-sm max-h-[500px] overflow-y-auto">
          {data.map(([k, n]) => (
            <li key={k} className="flex justify-between"><span>{k}</span><span className="text-primary font-semibold">{n}</span></li>
          ))}
        </ul>
      )}
    </CardContent></Card>
  );

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Globe className="w-6 h-6" /> Geographic distribution (30 days)</h1>
      {loading ? <p className="text-muted-foreground">Loading…</p> : (
        <div className="grid md:grid-cols-2 gap-4">
          <Table title="Top countries" data={countries} />
          <Table title="Top cities" data={cities} />
        </div>
      )}
    </div>
  );
};

export default AdminGeo;

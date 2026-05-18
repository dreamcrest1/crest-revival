import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Globe, MapPin, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const GeoMap = lazy(() => import('@/components/admin/GeoMap'));

interface Row { country: string | null; city: string | null; device_type: string | null; created_at: string }

const AdminGeo = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [prevRows, setPrevRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const now = Date.now();
      const cur = new Date(now - 30 * 86400000).toISOString();
      const prev = new Date(now - 60 * 86400000).toISOString();
      const [a, b] = await Promise.all([
        supabase.from('site_analytics').select('country, city, device_type, created_at').gte('created_at', cur).limit(20000),
        supabase.from('site_analytics').select('country, city, device_type, created_at').gte('created_at', prev).lt('created_at', cur).limit(20000),
      ]);
      setRows((a.data as Row[]) || []);
      setPrevRows((b.data as Row[]) || []);
      setLoading(false);
    })();
  }, []);

  const insights = useMemo(() => {
    const countryCount: Record<string, number> = {};
    const cityCount: Record<string, number> = {};
    const cityPrev: Record<string, number> = {};
    const countryDevice: Record<string, Record<string, number>> = {};
    const hourByCountry: Record<string, number[]> = {};

    for (const r of rows) {
      if (r.country) {
        countryCount[r.country] = (countryCount[r.country] || 0) + 1;
        countryDevice[r.country] = countryDevice[r.country] || { mobile: 0, desktop: 0, tablet: 0 };
        if (r.device_type) countryDevice[r.country][r.device_type] = (countryDevice[r.country][r.device_type] || 0) + 1;
        const h = new Date(r.created_at).getHours();
        (hourByCountry[r.country] ||= new Array(24).fill(0))[h]++;
      }
      if (r.city) {
        const k = `${r.city}${r.country ? ', ' + r.country : ''}`;
        cityCount[k] = (cityCount[k] || 0) + 1;
      }
    }
    for (const r of prevRows) {
      if (r.city) {
        const k = `${r.city}${r.country ? ', ' + r.country : ''}`;
        cityPrev[k] = (cityPrev[k] || 0) + 1;
      }
    }
    const countries = Object.entries(countryCount).sort((a, b) => b[1] - a[1]);
    const cities = Object.entries(cityCount).sort((a, b) => b[1] - a[1]);
    const growth = cities
      .filter(([k]) => (cityPrev[k] || 0) >= 2)
      .map(([k, v]) => ({ k, v, p: cityPrev[k] || 0, growth: ((v - (cityPrev[k] || 0)) / Math.max(1, cityPrev[k])) * 100 }))
      .filter(g => g.growth > 0)
      .sort((a, b) => b.growth - a.growth)
      .slice(0, 8);
    const topCountry = countries[0]?.[0];
    const hourData = topCountry ? (hourByCountry[topCountry] || []).map((v, h) => ({ h: `${h}:00`, v })) : [];
    return { countries: countries.slice(0, 15), cities: cities.slice(0, 30), growth, countryDevice, hourData, topCountry };
  }, [rows, prevRows]);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Globe className="w-6 h-6" /> Geographic distribution (30 days)</h1>

      {loading ? <p className="text-muted-foreground">Loading…</p> : rows.length === 0 ? (
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">No geo data yet — visitor countries and cities will appear here once tracking starts.</p></CardContent></Card>
      ) : (
        <>
          <Tabs defaultValue="world">
            <TabsList>
              <TabsTrigger value="world">World</TabsTrigger>
              <TabsTrigger value="india">India</TabsTrigger>
            </TabsList>
            <TabsContent value="world">
              <Card><CardContent className="p-4">
                <Suspense fallback={<div className="h-[420px] flex items-center justify-center text-muted-foreground text-sm">Loading map…</div>}>
                  <GeoMap mode="world" countries={insights.countries} />
                </Suspense>
              </CardContent></Card>
            </TabsContent>
            <TabsContent value="india">
              <Card><CardContent className="p-4">
                <Suspense fallback={<div className="h-[420px] flex items-center justify-center text-muted-foreground text-sm">Loading map…</div>}>
                  <GeoMap mode="india" cities={insights.cities} />
                </Suspense>
              </CardContent></Card>
            </TabsContent>
          </Tabs>

          <div className="grid lg:grid-cols-3 gap-4">
            <Card><CardContent className="p-5">
              <h2 className="font-semibold mb-3 text-sm">Top countries</h2>
              <ul className="space-y-1.5 text-sm max-h-[360px] overflow-y-auto">
                {insights.countries.map(([k, n]) => (
                  <li key={k} className="flex justify-between"><span>{k}</span><span className="text-primary font-semibold tabular-nums">{n}</span></li>
                ))}
              </ul>
            </CardContent></Card>

            <Card><CardContent className="p-5">
              <h2 className="font-semibold mb-3 text-sm flex items-center gap-2"><MapPin className="w-4 h-4" /> Top cities</h2>
              <ul className="space-y-1.5 text-sm max-h-[360px] overflow-y-auto">
                {insights.cities.map(([k, n]) => (
                  <li key={k} className="flex justify-between"><span>{k}</span><span className="text-primary font-semibold tabular-nums">{n}</span></li>
                ))}
              </ul>
            </CardContent></Card>

            <Card><CardContent className="p-5">
              <h2 className="font-semibold mb-3 text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Fastest-growing cities</h2>
              {insights.growth.length === 0 ? <p className="text-xs text-muted-foreground">Need at least 30 days of history.</p> : (
                <ul className="space-y-1.5 text-sm max-h-[360px] overflow-y-auto">
                  {insights.growth.map((g) => (
                    <li key={g.k} className="flex justify-between gap-3"><span className="truncate">{g.k}</span><span className="text-emerald-400 font-semibold tabular-nums shrink-0">+{Math.round(g.growth)}%</span></li>
                  ))}
                </ul>
              )}
            </CardContent></Card>
          </div>

          {insights.topCountry && (
            <Card><CardContent className="p-5">
              <h2 className="font-semibold mb-3 text-sm">Visits by hour — {insights.topCountry}</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={insights.hourData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                  <XAxis dataKey="h" stroke="hsl(215,15%,55%)" fontSize={10} />
                  <YAxis stroke="hsl(215,15%,55%)" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,15%,18%)', borderRadius: 8 }} />
                  <Bar dataKey="v" fill="hsl(24,95%,53%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[11px] text-muted-foreground mt-2">Peak hours tell you when to staff WhatsApp replies for your top country.</p>
            </CardContent></Card>
          )}
        </>
      )}
    </div>
  );
};

export default AdminGeo;

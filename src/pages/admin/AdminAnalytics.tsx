import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, Users, TrendingUp, Clock, Smartphone, Monitor, Tablet, Globe } from 'lucide-react';
import LiveVisitors from '@/components/admin/LiveVisitors';

const COLORS = ['hsl(24,95%,53%)', 'hsl(200,70%,50%)', 'hsl(142,71%,45%)', 'hsl(280,60%,50%)', 'hsl(340,70%,50%)', 'hsl(50,90%,55%)'];

type Preset = 'today' | 'yesterday' | '7' | '14' | '30' | '90' | 'custom';

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const fmtDate = (d: Date) => d.toISOString().split('T')[0];

const getRange = (preset: Preset, customStart: string, customEnd: string): { start: Date; end: Date } => {
  const now = new Date();
  const today = startOfDay(now);
  switch (preset) {
    case 'today':
      return { start: today, end: now };
    case 'yesterday': {
      const y = new Date(today); y.setDate(y.getDate() - 1);
      const yEnd = new Date(today); yEnd.setSeconds(-1);
      return { start: y, end: yEnd };
    }
    case 'custom': {
      const s = customStart ? new Date(customStart) : today;
      const e = customEnd ? new Date(customEnd) : now;
      e.setHours(23, 59, 59, 999);
      return { start: s, end: e };
    }
    default: {
      const days = parseInt(preset);
      const s = new Date(now); s.setDate(s.getDate() - days);
      return { start: s, end: now };
    }
  }
};

const DeviceIcon = ({ type }: { type: string }) => {
  if (type === 'mobile') return <Smartphone className="w-4 h-4" />;
  if (type === 'tablet') return <Tablet className="w-4 h-4" />;
  if (type === 'desktop') return <Monitor className="w-4 h-4" />;
  return <Globe className="w-4 h-4" />;
};

const AdminAnalytics = () => {
  const [preset, setPreset] = useState<Preset>('7');
  const [customStart, setCustomStart] = useState(fmtDate(new Date(Date.now() - 7 * 86400000)));
  const [customEnd, setCustomEnd] = useState(fmtDate(new Date()));
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { start, end } = useMemo(() => getRange(preset, customStart, customEnd), [preset, customStart, customEnd]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('site_analytics')
        .select('*')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: true })
        .limit(10000);
      setRows(data || []);
      setLoading(false);
    };
    load();
  }, [start, end]);

  const stats = useMemo(() => {
    const dailyMap: Record<string, number> = {};
    const hourlyMap: Record<string, number> = {};
    const pageMap: Record<string, number> = {};
    const referrerMap: Record<string, number> = {};
    const deviceMap: Record<string, number> = {};
    const browserMap: Record<string, number> = {};
    const osMap: Record<string, number> = {};
    const langMap: Record<string, number> = {};
    const visitorSet = new Set<string>();

    const useHourly = preset === 'today' || preset === 'yesterday';

    for (const a of rows) {
      const d = new Date(a.created_at);
      if (useHourly) {
        const k = `${d.getHours().toString().padStart(2, '0')}:00`;
        hourlyMap[k] = (hourlyMap[k] || 0) + 1;
      } else {
        const k = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dailyMap[k] = (dailyMap[k] || 0) + 1;
      }
      pageMap[a.page_path] = (pageMap[a.page_path] || 0) + 1;
      if (a.referrer) {
        try { referrerMap[new URL(a.referrer).hostname] = (referrerMap[new URL(a.referrer).hostname] || 0) + 1; }
        catch { referrerMap[a.referrer] = (referrerMap[a.referrer] || 0) + 1; }
      } else {
        referrerMap['Direct'] = (referrerMap['Direct'] || 0) + 1;
      }
      const dev = a.device_type || 'unknown';
      deviceMap[dev] = (deviceMap[dev] || 0) + 1;
      const br = a.browser || 'Other';
      browserMap[br] = (browserMap[br] || 0) + 1;
      const os = a.os || 'Other';
      osMap[os] = (osMap[os] || 0) + 1;
      if (a.language) langMap[a.language] = (langMap[a.language] || 0) + 1;
      if (a.visitor_id) visitorSet.add(a.visitor_id);
    }

    const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
    const todayKey = new Date().toISOString().split('T')[0];
    const todayViews = rows.filter((a) => a.created_at?.startsWith(todayKey)).length;

    return {
      timeSeries: useHourly
        ? Object.entries(hourlyMap).sort().map(([k, v]) => ({ label: k, views: v }))
        : Object.entries(dailyMap).map(([k, v]) => ({ label: k, views: v })),
      topPages: Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([page, views]) => ({ page, views })),
      topReferrers: Object.entries(referrerMap).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value })),
      devices: Object.entries(deviceMap).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value })),
      browsers: Object.entries(browserMap).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value })),
      osList: Object.entries(osMap).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value })),
      languages: Object.entries(langMap).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value })),
      totalViews: rows.length,
      uniqueVisitors: visitorSet.size,
      avgDaily: Math.round(rows.length / days),
      todayViews,
      useHourly,
    };
  }, [rows, start, end, preset]);

  const statCards = [
    { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'text-primary' },
    { label: 'Unique Visitors', value: stats.uniqueVisitors, icon: Users, color: 'text-blue-400' },
    { label: 'Avg / Day', value: stats.avgDaily, icon: TrendingUp, color: 'text-green-400' },
    { label: "Today's Views", value: stats.todayViews, icon: Clock, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Analytics</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={preset} onValueChange={(v) => setPreset(v as Preset)}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="14">Last 14 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          {preset === 'custom' && (
            <>
              <Input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="w-[150px]" />
              <Input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="w-[150px]" />
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map(card => (
              <div key={card.label} className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{card.label}</span>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <p className="font-display text-3xl font-bold text-foreground">{card.value.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Traffic */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">
              Traffic {stats.useHourly ? 'by Hour' : 'Over Time'}
            </h3>
            {stats.timeSeries.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                  <XAxis dataKey="label" stroke="hsl(215,15%,55%)" fontSize={11} />
                  <YAxis stroke="hsl(215,15%,55%)" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,15%,18%)', borderRadius: '8px', color: 'hsl(210,20%,95%)' }} />
                  <Line type="monotone" dataKey="views" stroke="hsl(24,95%,53%)" strokeWidth={2} dot={{ fill: 'hsl(24,95%,53%)', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">No data for this period.</p>
            )}
          </div>

          {/* Devices, Browsers, OS */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">Devices</h3>
              {stats.devices.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={stats.devices} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                        {stats.devices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,15%,18%)', borderRadius: '8px', color: 'hsl(210,20%,95%)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {stats.devices.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <DeviceIcon type={d.name} />
                        <span className="text-muted-foreground capitalize flex-1">{d.name}</span>
                        <span className="text-foreground font-medium">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : <p className="text-muted-foreground text-center py-12">No data.</p>}
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">Browsers</h3>
              {stats.browsers.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={stats.browsers} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                    <XAxis type="number" stroke="hsl(215,15%,55%)" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="hsl(215,15%,55%)" fontSize={11} width={70} />
                    <Tooltip contentStyle={{ background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,15%,18%)', borderRadius: '8px', color: 'hsl(210,20%,95%)' }} />
                    <Bar dataKey="value" fill="hsl(200,70%,50%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-muted-foreground text-center py-12">No data.</p>}
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">Operating Systems</h3>
              {stats.osList.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={stats.osList} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                    <XAxis type="number" stroke="hsl(215,15%,55%)" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="hsl(215,15%,55%)" fontSize={11} width={70} />
                    <Tooltip contentStyle={{ background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,15%,18%)', borderRadius: '8px', color: 'hsl(210,20%,95%)' }} />
                    <Bar dataKey="value" fill="hsl(142,71%,45%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-muted-foreground text-center py-12">No data.</p>}
            </div>
          </div>

          {/* Pages + Referrers */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">Top Pages</h3>
              {stats.topPages.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.topPages} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                    <XAxis type="number" stroke="hsl(215,15%,55%)" fontSize={12} />
                    <YAxis dataKey="page" type="category" stroke="hsl(215,15%,55%)" fontSize={11} width={110} />
                    <Tooltip contentStyle={{ background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,15%,18%)', borderRadius: '8px', color: 'hsl(210,20%,95%)' }} />
                    <Bar dataKey="views" fill="hsl(24,95%,53%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-muted-foreground text-center py-12">No page data.</p>}
            </div>

            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">Top Referrers</h3>
              {stats.topReferrers.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={stats.topReferrers} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                        {stats.topReferrers.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,15%,18%)', borderRadius: '8px', color: 'hsl(210,20%,95%)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1 mt-2">
                    {stats.topReferrers.map((r, i) => (
                      <div key={r.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-muted-foreground truncate flex-1">{r.name}</span>
                        <span className="text-foreground font-medium">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : <p className="text-muted-foreground text-center py-12">No referrer data.</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;

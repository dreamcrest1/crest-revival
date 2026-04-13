import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Users, TrendingUp, Clock } from 'lucide-react';

const COLORS = ['hsl(24,95%,53%)', 'hsl(200,70%,50%)', 'hsl(142,71%,45%)', 'hsl(280,60%,50%)', 'hsl(340,70%,50%)'];

const AdminAnalytics = () => {
  const [range, setRange] = useState('7');
  const [data, setData] = useState<{
    dailyViews: any[];
    topPages: any[];
    topReferrers: any[];
    totalViews: number;
    uniqueVisitors: number;
    avgDaily: number;
    todayViews: number;
  }>({
    dailyViews: [], topPages: [], topReferrers: [],
    totalViews: 0, uniqueVisitors: 0, avgDaily: 0, todayViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAnalytics(); }, [range]);

  const loadAnalytics = async () => {
    setLoading(true);
    const days = parseInt(range);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const today = new Date().toISOString().split('T')[0];

    const { data: analytics } = await supabase
      .from('site_analytics')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: true });

    const { count: todayCount } = await supabase
      .from('site_analytics')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today);

    if (!analytics) { setLoading(false); return; }

    // Daily views
    const dailyMap: Record<string, number> = {};
    const pageMap: Record<string, number> = {};
    const referrerMap: Record<string, number> = {};
    const visitorSet = new Set<string>();

    for (const a of analytics) {
      const day = new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMap[day] = (dailyMap[day] || 0) + 1;
      pageMap[a.page_path] = (pageMap[a.page_path] || 0) + 1;
      if (a.referrer) referrerMap[a.referrer] = (referrerMap[a.referrer] || 0) + 1;
      if (a.visitor_id) visitorSet.add(a.visitor_id);
    }

    setData({
      dailyViews: Object.entries(dailyMap).map(([date, views]) => ({ date, views })),
      topPages: Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([page, views]) => ({ page, views })),
      topReferrers: Object.entries(referrerMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value })),
      totalViews: analytics.length,
      uniqueVisitors: visitorSet.size,
      avgDaily: Math.round(analytics.length / days),
      todayViews: todayCount || 0,
    });
    setLoading(false);
  };

  const statCards = [
    { label: 'Total Views', value: data.totalViews, icon: Eye, color: 'text-primary' },
    { label: 'Unique Visitors', value: data.uniqueVisitors, icon: Users, color: 'text-blue-400' },
    { label: 'Avg/Day', value: data.avgDaily, icon: TrendingUp, color: 'text-green-400' },
    { label: "Today's Views", value: data.todayViews, icon: Clock, color: 'text-purple-400' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Analytics</h1>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="14">Last 14 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Traffic Chart */}
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5">
        <h3 className="font-display font-semibold text-foreground mb-4">Traffic Over Time</h3>
        {data.dailyViews.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.dailyViews}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
              <XAxis dataKey="date" stroke="hsl(215,15%,55%)" fontSize={11} />
              <YAxis stroke="hsl(215,15%,55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,15%,18%)', borderRadius: '8px', color: 'hsl(210,20%,95%)' }} />
              <Line type="monotone" dataKey="views" stroke="hsl(24,95%,53%)" strokeWidth={2} dot={{ fill: 'hsl(24,95%,53%)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-center py-12">No data for this period.</p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Top Pages</h3>
          {data.topPages.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topPages} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                <XAxis type="number" stroke="hsl(215,15%,55%)" fontSize={12} />
                <YAxis dataKey="page" type="category" stroke="hsl(215,15%,55%)" fontSize={11} width={100} />
                <Tooltip contentStyle={{ background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,15%,18%)', borderRadius: '8px', color: 'hsl(210,20%,95%)' }} />
                <Bar dataKey="views" fill="hsl(24,95%,53%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-12">No page data.</p>
          )}
        </div>

        {/* Referrers */}
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Top Referrers</h3>
          {data.topReferrers.length > 0 ? (
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={data.topReferrers} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {data.topReferrers.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,15%,18%)', borderRadius: '8px', color: 'hsl(210,20%,95%)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {data.topReferrers.map((r, i) => (
                  <div key={r.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground truncate flex-1">{r.name}</span>
                    <span className="text-foreground font-medium">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">No referrer data.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

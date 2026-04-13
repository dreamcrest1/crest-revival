import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Package, Eye, TrendingUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, pageViews: 0, todayViews: 0, uniqueVisitors: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [topPages, setTopPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    // Get product count
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Get analytics stats
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { count: totalViews } = await supabase
      .from('site_analytics')
      .select('*', { count: 'exact', head: true });

    const { count: todayViews } = await supabase
      .from('site_analytics')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today);

    const { data: uniqueData } = await supabase
      .from('site_analytics')
      .select('visitor_id')
      .not('visitor_id', 'is', null);

    const uniqueVisitors = new Set(uniqueData?.map(d => d.visitor_id) || []).size;

    setStats({
      products: productCount || 0,
      pageViews: totalViews || 0,
      todayViews: todayViews || 0,
      uniqueVisitors,
    });

    // Get daily chart data for last 7 days
    const { data: analytics } = await supabase
      .from('site_analytics')
      .select('created_at, page_path')
      .gte('created_at', weekAgo)
      .order('created_at', { ascending: true });

    if (analytics) {
      const dailyMap: Record<string, number> = {};
      const pageMap: Record<string, number> = {};

      for (const a of analytics) {
        const day = new Date(a.created_at).toLocaleDateString('en-US', { weekday: 'short' });
        dailyMap[day] = (dailyMap[day] || 0) + 1;
        pageMap[a.page_path] = (pageMap[a.page_path] || 0) + 1;
      }

      setChartData(Object.entries(dailyMap).map(([name, views]) => ({ name, views })));
      setTopPages(
        Object.entries(pageMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([page, views]) => ({ page, views }))
      );
    }

    setLoading(false);
  };

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'text-primary' },
    { label: 'Total Page Views', value: stats.pageViews, icon: Eye, color: 'text-blue-400' },
    { label: "Today's Views", value: stats.todayViews, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Unique Visitors', value: stats.uniqueVisitors, icon: Users, color: 'text-purple-400' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>

      {/* Stats Cards */}
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

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Page Views (Last 7 Days)</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                <XAxis dataKey="name" stroke="hsl(215,15%,55%)" fontSize={12} />
                <YAxis stroke="hsl(215,15%,55%)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,15%,18%)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="views" stroke="hsl(24,95%,53%)" strokeWidth={2} dot={{ fill: 'hsl(24,95%,53%)' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-12">No analytics data yet. Views will appear here once visitors start browsing.</p>
          )}
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Top Pages</h3>
          {topPages.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topPages}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,18%)" />
                <XAxis dataKey="page" stroke="hsl(215,15%,55%)" fontSize={11} />
                <YAxis stroke="hsl(215,15%,55%)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(220,18%,10%)', border: '1px solid hsl(220,15%,18%)', borderRadius: '8px' }} />
                <Bar dataKey="views" fill="hsl(24,95%,53%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-12">No page data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

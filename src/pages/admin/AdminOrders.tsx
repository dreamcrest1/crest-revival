import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingBag, RefreshCw, Search, IndianRupee, CheckCircle2, Clock, XCircle, Mail, Phone } from 'lucide-react';

type OrderRow = {
  id: string;
  order_id: string;
  txn_id: string | null;
  amount: number;
  status: 'pending' | 'success' | 'failed' | string;
  items: Array<{ id: string; name: string; price: string; quantity: number }>;
  customer: { firstname?: string; email?: string; phone?: string };
  pay_url: string | null;
  created_at: string;
};

const statusStyles: Record<string, string> = {
  success: 'bg-green-500/10 text-green-500 border-green-500/30',
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  failed:  'bg-red-500/10 text-red-500 border-red-500/30',
};

const AdminOrders = () => {
  const [filter, setFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');
  const [q, setQ] = useState('');

  const { data: orders = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data || []) as OrderRow[];
    },
    refetchInterval: 30_000,
  });

  const stats = useMemo(() => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recent = orders.filter((o) => new Date(o.created_at).getTime() > thirtyDaysAgo);
    return {
      revenue: recent.filter((o) => o.status === 'success').reduce((s, o) => s + Number(o.amount || 0), 0),
      success: recent.filter((o) => o.status === 'success').length,
      pending: recent.filter((o) => o.status === 'pending').length,
      failed: recent.filter((o) => o.status === 'failed').length,
    };
  }, [orders]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== 'all' && o.status !== filter) return false;
      if (!needle) return true;
      return (
        o.order_id?.toLowerCase().includes(needle) ||
        o.txn_id?.toLowerCase().includes(needle) ||
        o.customer?.email?.toLowerCase().includes(needle) ||
        o.customer?.phone?.toLowerCase().includes(needle) ||
        o.customer?.firstname?.toLowerCase().includes(needle)
      );
    });
  }, [orders, filter, q]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" /> Orders
          </h1>
          <p className="text-sm text-muted-foreground">Live PayPur transactions · last 500 orders</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 bg-secondary border border-border rounded-xl px-3 py-2 text-xs font-semibold hover:bg-primary/10 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Revenue (30d)" value={`₹${stats.revenue.toFixed(0)}`} icon={<IndianRupee className="w-4 h-4" />} accent="text-primary" />
        <StatCard label="Successful" value={stats.success} icon={<CheckCircle2 className="w-4 h-4" />} accent="text-green-500" />
        <StatCard label="Pending" value={stats.pending} icon={<Clock className="w-4 h-4" />} accent="text-yellow-500" />
        <StatCard label="Failed" value={stats.failed} icon={<XCircle className="w-4 h-4" />} accent="text-red-500" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(['all', 'success', 'pending', 'failed'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition capitalize ${
              filter === s
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {s}
          </button>
        ))}
        <div className="ml-auto relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search order id, txn, email, phone…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-secondary/40 border border-border rounded-xl pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary w-72 max-w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Order</th>
                <th className="px-4 py-3 text-left font-semibold">Customer</th>
                <th className="px-4 py-3 text-left font-semibold">Items</th>
                <th className="px-4 py-3 text-right font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Txn ID</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">Loading orders…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">No orders found.</td></tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="border-t border-border/60 hover:bg-secondary/30 align-top">
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(o.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{o.order_id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{o.customer?.firstname || '—'}</div>
                      {o.customer?.email && (
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" />{o.customer.email}</div>
                      )}
                      {o.customer?.phone && (
                        <a href={`https://wa.me/91${o.customer.phone}`} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#25D366] hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3" />{o.customer.phone}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {(o.items || []).map((it, idx) => (
                        <div key={idx} className="text-foreground/90 truncate max-w-[260px]">
                          {it.name} <span className="text-muted-foreground">×{it.quantity}</span>
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-right font-display font-bold text-primary whitespace-nowrap">₹{Number(o.amount).toFixed(0)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${statusStyles[o.status] || 'bg-secondary text-muted-foreground border-border'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{o.txn_id || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, accent }: { label: string; value: string | number; icon: React.ReactNode; accent: string }) => (
  <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-4">
    <div className={`flex items-center gap-2 text-xs ${accent} mb-1`}>{icon}<span className="uppercase font-semibold tracking-wider">{label}</span></div>
    <div className="font-display font-bold text-2xl text-foreground">{value}</div>
  </div>
);

export default AdminOrders;

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, LogOut, ExternalLink, Loader2, ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import PageBanner from '@/components/PageBanner';

type OrderRow = {
  id: string;
  order_id: string;
  txn_id: string | null;
  amount: number;
  status: string;
  items: Array<{ name: string; price: string; quantity: number }>;
  created_at: string;
};

const statusStyles: Record<string, string> = {
  success: 'bg-green-500/15 text-green-400 border-green-500/30',
  pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  failed: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const MyOrders = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth', { replace: true, state: { from: '/my-orders' } });
  }, [user, authLoading, navigate]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_id, txn_id, amount, status, items, created_at')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as OrderRow[];
    },
    refetchInterval: 30000,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="My Orders | Dreamcrest" description="View your order history and download details." />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-16 max-w-5xl">
        <PageBanner
          eyebrow="Royal Ledger"
          title="My"
          highlight="Orders"
          subtitle={user?.email ? `Logged in as ${user.email}` : 'Your purchase history'}
        />
        <div className="flex justify-end mb-6">
          <button
            onClick={async () => { await signOut(); navigate('/'); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/40 border border-primary/30 text-sm hover:bg-secondary/60 hover:border-primary/60 transition"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>

        {isLoading || authLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : !orders?.length ? (
          <div className="text-center bg-card/50 border border-border rounded-2xl p-12">
            <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-foreground font-medium">No orders yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Your purchases will appear here.</p>
            <Link to="/products" className="inline-block bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="bg-card/60 backdrop-blur border border-border rounded-2xl p-5 hover:border-primary/40 transition">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground font-mono">{o.order_id}</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] px-2 py-1 rounded-full border font-medium uppercase ${statusStyles[o.status] || 'bg-secondary text-muted-foreground border-border'}`}>
                      {o.status}
                    </span>
                    <span className="font-display font-bold text-primary">₹{Number(o.amount).toFixed(0)}</span>
                  </div>
                </div>
                <div className="space-y-1 mb-2">
                  {o.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-sm text-foreground/90">
                      <span className="truncate pr-2">{it.name} <span className="text-muted-foreground">×{it.quantity}</span></span>
                      <span className="text-muted-foreground">{it.price}</span>
                    </div>
                  ))}
                </div>
                {o.txn_id && <p className="text-[11px] text-muted-foreground font-mono">Txn: {o.txn_id}</p>}
                {o.status === 'success' && (
                  <Link
                    to={`/payment/success?order_id=${encodeURIComponent(o.order_id)}`}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                  >
                    View receipt <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;

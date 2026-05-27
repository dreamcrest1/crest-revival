import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { verifyPaypurOrder, CheckoutItem, CheckoutCustomer } from '@/lib/paypurClient';
import { WhatsAppIcon } from '@/components/SocialIcons';
import { WA_NUMBER } from '@/lib/whatsapp';
import { useCart } from '@/contexts/CartContext';

type Order = {
  order_id: string;
  txn_id: string | null;
  status: string;
  amount: number;
  items: CheckoutItem[];
  customer: CheckoutCustomer;
};

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = params.get('order_id');
    if (!orderId) { setError('Missing order id'); setLoading(false); return; }
    const query: Record<string, string> = { order_id: orderId };
    ['txn_id', 'status', 'amount', 'signature'].forEach((k) => {
      const v = params.get(k);
      if (v) query[k] = v;
    });

    verifyPaypurOrder(query)
      .then((o) => {
        // Fallback to session snapshot if DB items somehow empty
        try {
          const snap = sessionStorage.getItem(`order:${orderId}`);
          if (snap && (!o.items || o.items.length === 0)) {
            const parsed = JSON.parse(snap);
            o.items = parsed.items || [];
            o.customer = parsed.customer || o.customer;
          }
        } catch { /* ignore */ }
        setOrder(o);
        if (o.status === 'success') clearCart();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const success = order?.status === 'success';

  const buildWaMessage = () => {
    if (!order) return '';
    const lines = order.items.map(
      (i) => `• ${i.name} ×${i.quantity} — ${i.price}`,
    );
    return [
      `Hi! I just completed payment for my order ✅`,
      ``,
      ...lines,
      ``,
      `Total Paid: ₹${Number(order.amount).toFixed(0)}`,
      `Order ID: ${order.order_id}`,
      order.txn_id ? `Txn ID: ${order.txn_id}` : '',
      ``,
      `Name: ${order.customer?.firstname || ''}`,
      `Email: ${order.customer?.email || ''}`,
      ``,
      `Please activate my tools 🙏`,
    ].filter(Boolean).join('\n');
  };

  const waHref = order
    ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildWaMessage())}`
    : `https://wa.me/${WA_NUMBER}`;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg bg-card/80 backdrop-blur-md border border-border rounded-3xl p-8 shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center text-center py-10">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Verifying your payment…</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-3" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Verification Error</h1>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Link to="/" className="inline-block bg-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-semibold">Back to Home</Link>
          </div>
        ) : success ? (
          <>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-1">Payment Successful!</h1>
              <p className="text-sm text-muted-foreground">Thanks {order?.customer?.firstname || ''} — your order is confirmed.</p>
            </div>

            <div className="bg-secondary/30 rounded-xl p-4 mb-5 space-y-2">
              {order?.items?.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-foreground/90 truncate pr-2">{i.name} <span className="text-muted-foreground text-xs">×{i.quantity}</span></span>
                  <span className="font-medium">{i.price}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-border/50 pt-2 mt-2">
                <span className="font-semibold">Total Paid</span>
                <span className="font-display font-bold text-primary">₹{Number(order?.amount || 0).toFixed(0)}</span>
              </div>
              <div className="text-[11px] text-muted-foreground/80 pt-1 space-y-0.5">
                <div>Order ID: <span className="font-mono">{order?.order_id}</span></div>
                {order?.txn_id && <div>Txn ID: <span className="font-mono">{order.txn_id}</span></div>}
              </div>
            </div>

            <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl p-4 mb-4">
              <p className="text-sm text-foreground font-medium mb-1">📲 Final Step — Get Your Tools</p>
              <p className="text-xs text-muted-foreground mb-3">Click below to send your order details on WhatsApp. We&apos;ll deliver your tools within minutes.</p>
              <a
                href={waHref} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl py-3 font-semibold text-sm hover:bg-[#1ebe5b] transition-all shadow-lg"
              >
                <WhatsAppIcon className="w-4 h-4" /> Message Us on WhatsApp
              </a>
            </div>

            <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors">← Back to Home</Link>
          </>
        ) : (
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Payment Pending</h1>
            <p className="text-sm text-muted-foreground mb-4">
              Status: <span className="font-mono">{order?.status}</span>. If you&apos;ve paid, please contact us with your order ID.
            </p>
            <div className="text-xs text-muted-foreground mb-6 font-mono">Order ID: {order?.order_id}</div>
            <a
              href={waHref} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white rounded-xl px-5 py-2.5 text-sm font-semibold"
            >
              <WhatsAppIcon className="w-4 h-4" /> Contact Support
            </a>
          </div>
        )}
      </div>
    </main>
  );
};

export default PaymentSuccess;

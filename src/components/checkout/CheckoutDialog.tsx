import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ShieldCheck } from 'lucide-react';
import {
  CheckoutCustomer,
  CheckoutItem,
  initPaypurPayment,
  loadSavedCustomer,
  newOrderId,
  saveCustomer,
} from '@/lib/paypurClient';
import { toast } from '@/hooks/use-toast';

type Props = {
  open: boolean;
  onClose: () => void;
  items: CheckoutItem[];
  totalAmount: number;
};

const CheckoutDialog = ({ open, onClose, items, totalAmount }: Props) => {
  const [customer, setCustomer] = useState<CheckoutCustomer>({ firstname: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const saved = loadSavedCustomer();
      setCustomer({
        firstname: saved.firstname || '',
        email: saved.email || '',
        phone: saved.phone || '',
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.firstname.trim() || !customer.email.trim() || !customer.phone.trim()) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    if (totalAmount <= 0 || !items.length) {
      toast({ title: 'Cart is empty', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      saveCustomer(customer);
      const orderId = newOrderId();
      sessionStorage.setItem(`order:${orderId}`, JSON.stringify({ items, customer, amount: totalAmount }));
      const { pay_url } = await initPaypurPayment({
        orderId,
        amount: totalAmount,
        items,
        customer,
      });
      window.location.href = pay_url;
    } catch (err: any) {
      toast({ title: 'Payment failed to start', description: err.message, variant: 'destructive' });
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] bg-black/70 backdrop-blur-sm"
            onClick={() => !loading && onClose()}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[10002] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl pointer-events-auto relative">
              <button
                onClick={() => !loading && onClose()}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="font-display font-bold text-xl text-foreground mb-1">Complete Payment</h2>
              <p className="text-sm text-muted-foreground mb-4">Pay securely via UPI</p>

              <div className="bg-secondary/30 rounded-xl p-3 mb-4 max-h-40 overflow-y-auto space-y-1">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between text-xs text-foreground/90">
                    <span className="truncate pr-2">{i.name} <span className="text-muted-foreground">×{i.quantity}</span></span>
                    <span className="font-medium">{i.price}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 mt-2 border-t border-border/50">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="font-display font-bold text-primary">₹{totalAmount.toFixed(0)}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text" placeholder="Full Name" required disabled={loading}
                  value={customer.firstname}
                  onChange={(e) => setCustomer({ ...customer, firstname: e.target.value })}
                  className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                />
                <input
                  type="email" placeholder="Email" required disabled={loading}
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                />
                <input
                  type="tel" placeholder="Phone (10 digits)" required disabled={loading}
                  pattern="[0-9]{10}" maxLength={10}
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })}
                  className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                />

                <button
                  type="submit" disabled={loading}
                  className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting…</> : <>Pay ₹{totalAmount.toFixed(0)} via UPI</>}
                </button>

                <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                  <ShieldCheck className="w-3 h-3" /> Secured by PayPur · 100% Safe Checkout
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutDialog;

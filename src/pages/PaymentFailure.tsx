import { Link, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { WhatsAppIcon } from '@/components/SocialIcons';
import { WA_NUMBER } from '@/lib/whatsapp';

const PaymentFailure = () => {
  const [params] = useSearchParams();
  const orderId = params.get('order_id') || '';
  const waMsg = encodeURIComponent(
    `Hi! My payment failed. Order ID: ${orderId}. Please help me complete the order.`,
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-card/80 backdrop-blur-md border border-border rounded-3xl p-8 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
          <XCircle className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Payment Failed</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Your payment didn&apos;t go through. No amount has been charged. Please try again or contact us for help.
        </p>
        {orderId && <div className="text-[11px] text-muted-foreground font-mono mb-4">Order ID: {orderId}</div>}
        <div className="flex flex-col gap-2">
          <Link
            to="/products"
            className="bg-primary text-primary-foreground rounded-xl py-2.5 font-semibold text-sm hover:bg-primary/90 transition-all"
          >
            Try Again
          </Link>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 rounded-xl py-2.5 font-semibold text-sm hover:bg-[#25D366] hover:text-white transition-all"
          >
            <WhatsAppIcon className="w-4 h-4" /> Contact Support
          </a>
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary mt-2">← Back to Home</Link>
        </div>
      </div>
    </main>
  );
};

export default PaymentFailure;

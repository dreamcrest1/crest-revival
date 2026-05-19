import { useState } from 'react';
import { Check, Copy, ExternalLink, Link2 } from 'lucide-react';
import { PAYMENT_URL } from '@/config/payment';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PaymentUrlPanel = () => {
  const [copied, setCopied] = useState(false);
  const isEnvOverride = Boolean(import.meta.env.VITE_PAYMENT_URL);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_URL);
      setCopied(true);
      toast.success('Payment URL copied');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Link2 className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-semibold text-foreground text-sm">Active Payment URL</span>
            <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full font-semibold ${
              isEnvOverride
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-primary/15 text-primary border border-primary/30'
            }`}>
              {isEnvOverride ? 'env override' : 'config default'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Used by every checkout button across products, AI tools, and the cart.
          </p>
          <code className="block mt-2 text-xs font-mono text-foreground bg-muted/40 px-2 py-1.5 rounded border border-border/50 break-all">
            {PAYMENT_URL}
          </code>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={copy}>
          {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={PAYMENT_URL} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-1.5" /> Test
          </a>
        </Button>
      </div>
    </div>
  );
};

export default PaymentUrlPanel;

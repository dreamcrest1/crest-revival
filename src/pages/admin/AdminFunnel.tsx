import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

const RANGES = { '7d': 7, '30d': 30, '90d': 90 } as const;

const AdminFunnel = () => {
  const [range, setRange] = useState<keyof typeof RANGES>('30d');
  const [counts, setCounts] = useState({ visits: 0, productViews: 0, whatsappClicks: 0, checkoutClicks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const since = new Date(Date.now() - RANGES[range] * 86400 * 1000).toISOString();
      const types: Array<keyof typeof counts> = ['visits', 'productViews', 'whatsappClicks', 'checkoutClicks'];
      const eventMap = { visits: 'page_view', productViews: 'product_view', whatsappClicks: 'whatsapp_click', checkoutClicks: 'checkout_click' };
      const next = { visits: 0, productViews: 0, whatsappClicks: 0, checkoutClicks: 0 };
      for (const k of types) {
        const { count } = await supabase
          .from('site_analytics')
          .select('*', { count: 'exact', head: true })
          .eq('event_type', eventMap[k])
          .gte('created_at', since);
        next[k] = count || 0;
      }
      setCounts(next);
      setLoading(false);
    })();
  }, [range]);

  const max = Math.max(counts.visits, 1);
  const pct = (n: number) => Math.max(2, Math.round((n / max) * 100));
  const drop = (a: number, b: number) => a === 0 ? '—' : `${Math.round(((a - b) / a) * 100)}% drop`;

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Filter className="w-6 h-6" /> Conversion funnel</h1>
        <Select value={range} onValueChange={(v) => setRange(v as keyof typeof RANGES)}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? <p className="text-muted-foreground">Loading…</p> : (
        <Card><CardContent className="p-6 space-y-4">
          {[
            { label: 'Page visits', value: counts.visits, drop: '' },
            { label: 'Product views', value: counts.productViews, drop: drop(counts.visits, counts.productViews) },
            { label: 'WhatsApp clicks', value: counts.whatsappClicks, drop: drop(counts.productViews, counts.whatsappClicks) },
            { label: 'Checkout clicks', value: counts.checkoutClicks, drop: drop(counts.productViews, counts.checkoutClicks) },
          ].map((step) => (
            <div key={step.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{step.label}</span>
                <span className="text-muted-foreground">{step.value.toLocaleString()} {step.drop && <span className="text-xs ml-2 text-amber-400">{step.drop}</span>}</span>
              </div>
              <div className="h-3 bg-secondary/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary/60" style={{ width: `${pct(step.value)}%` }} />
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-3 border-t border-border/40">
            Track these events from the storefront to populate the funnel. Visit → product_view → whatsapp_click / checkout_click.
          </p>
        </CardContent></Card>
      )}
    </div>
  );
};

export default AdminFunnel;

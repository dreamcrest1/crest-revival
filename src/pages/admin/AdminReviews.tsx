import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Check, Trash2, RefreshCw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/useProducts';

interface Review {
  id: string; product_id: string; author_name: string; rating: number;
  title: string | null; body: string; language: 'en' | 'hinglish';
  is_approved: boolean; is_featured: boolean; verified_buyer: boolean;
  city: string | null; created_at: string;
}

const AdminReviews = () => {
  const { data: productsData } = useProducts();
  const products = productsData?.products ?? [];
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [productFilter, setProductFilter] = useState<string>('all');

  const productMap = Object.fromEntries(products.map((p) => [p.id, p.name]));

  const load = async () => {
    setLoading(true);
    let q = supabase.from('product_reviews').select('*').order('created_at', { ascending: false }).limit(500);
    if (filter === 'pending') q = q.eq('is_approved', false);
    if (filter === 'approved') q = q.eq('is_approved', true);
    if (productFilter !== 'all') q = q.eq('product_id', productFilter);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    else setReviews((data || []) as Review[]);
    setLoading(false);
  };

  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [filter, productFilter]);

  const approve = async (id: string) => {
    const { error } = await supabase.from('product_reviews').update({ is_approved: true }).eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Approved');
    setReviews((rs) => rs.map((r) => r.id === id ? { ...r, is_approved: true } : r));
  };
  const toggleFeature = async (r: Review) => {
    const { error } = await supabase.from('product_reviews').update({ is_featured: !r.is_featured }).eq('id', r.id);
    if (error) return toast.error(error.message);
    setReviews((rs) => rs.map((x) => x.id === r.id ? { ...x, is_featured: !r.is_featured } : x));
  };
  const remove = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    const { error } = await supabase.from('product_reviews').delete().eq('id', id);
    if (error) return toast.error(error.message);
    setReviews((rs) => rs.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Product Reviews</h1>
        <p className="text-muted-foreground mt-1">Moderate customer reviews. New submissions appear as pending until approved.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
        <Select value={productFilter} onValueChange={setProductFilter}>
          <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
          <SelectContent className="max-h-80">
            <SelectItem value="all">All products</SelectItem>
            {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={load} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></Button>
      </div>

      <div className="space-y-3">
        {!loading && reviews.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">No reviews match this filter.</p>
        )}
        {reviews.map((r) => (
          <Card key={r.id}>
            <CardContent className="pt-6 space-y-2">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground">{r.author_name}</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={14} className={i <= r.rating ? 'fill-primary text-primary' : 'text-muted-foreground/40'} />
                    ))}
                  </div>
                  <Badge variant="outline">{r.language}</Badge>
                  {r.is_approved ? <Badge className="bg-green-600">approved</Badge> : <Badge variant="destructive">pending</Badge>}
                  {r.is_featured && <Badge className="bg-primary"><Sparkles className="h-3 w-3 mr-1" />featured</Badge>}
                  {r.verified_buyer && <Badge variant="secondary">verified</Badge>}
                  {r.city && <Badge variant="outline">{r.city}</Badge>}
                </div>
                <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
              </div>
              <div className="text-xs text-muted-foreground">Product: <span className="font-mono">{productMap[r.product_id] || r.product_id}</span></div>
              {r.title && <h3 className="font-semibold text-sm text-foreground">{r.title}</h3>}
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{r.body}</p>
              <div className="flex gap-2 pt-2">
                {!r.is_approved && <Button size="sm" onClick={() => approve(r.id)}><Check className="h-4 w-4 mr-1" />Approve</Button>}
                <Button size="sm" variant="outline" onClick={() => toggleFeature(r)}><Sparkles className="h-4 w-4 mr-1" />{r.is_featured ? 'Unfeature' : 'Feature'}</Button>
                <Button size="sm" variant="destructive" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;

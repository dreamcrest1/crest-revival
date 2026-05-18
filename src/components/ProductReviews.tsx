import { useMemo, useState } from 'react';
import { Star, CheckCircle2, MapPin } from 'lucide-react';
import { useProductReviews, useRatingStats } from '@/hooks/useProductReviews';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  productId: string;
  productName: string;
}

const Stars = ({ value, size = 16 }: { value: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={i <= Math.round(value) ? 'fill-primary text-primary' : 'text-muted-foreground/40'}
        size={size}
      />
    ))}
  </div>
);

const PAGE_SIZE = 6;

const ProductReviews = ({ productId, productName }: Props) => {
  const { data: reviews = [], isLoading } = useProductReviews(productId);
  const { data: stats } = useRatingStats(productId);
  const qc = useQueryClient();

  const [langFilter, setLangFilter] = useState<'all' | 'en' | 'hinglish'>('all');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ author_name: '', title: '', body: '', rating: 5, language: 'en' as 'en' | 'hinglish' });

  const filtered = useMemo(
    () => (langFilter === 'all' ? reviews : reviews.filter((r) => r.language === langFilter)),
    [reviews, langFilter]
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const shown = filtered.slice(0, page * PAGE_SIZE);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.body.trim().length < 10) {
      toast.error('Please write at least 10 characters');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('product_reviews').insert({
      product_id: productId,
      author_name: form.author_name.trim().slice(0, 60),
      title: form.title.trim().slice(0, 100) || null,
      body: form.body.trim().slice(0, 2000),
      rating: form.rating,
      language: form.language,
      is_approved: false,
      is_featured: false,
    });
    setSubmitting(false);
    if (error) {
      toast.error('Could not submit review: ' + error.message);
      return;
    }
    toast.success('Thanks! Your review will appear once approved.');
    setForm({ author_name: '', title: '', body: '', rating: 5, language: 'en' });
    setShowForm(false);
    qc.invalidateQueries({ queryKey: ['product-reviews', productId] });
  };

  return (
    <section className="mt-12 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Customer Reviews</h2>
          <p className="text-sm text-muted-foreground mt-1">What buyers are saying about {productName}</p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)} variant="outline">
          {showForm ? 'Cancel' : 'Write a review'}
        </Button>
      </div>

      {/* Summary */}
      {stats && stats.review_count > 0 && (
        <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6 grid md:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="text-center md:border-r md:border-border md:pr-6">
            <div className="text-5xl font-bold text-primary">{Number(stats.avg_rating).toFixed(1)}</div>
            <Stars value={Number(stats.avg_rating)} size={20} />
            <p className="text-xs text-muted-foreground mt-1">{stats.review_count} reviews</p>
          </div>
          <div className="space-y-1.5 w-full">
            {[5, 4, 3, 2, 1].map((r) => {
              const c = (stats as unknown as Record<string, number>)[`count_${r}`] || 0;
              const pct = stats.review_count ? (c / stats.review_count) * 100 : 0;
              return (
                <div key={r} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-muted-foreground">{r} star</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-10 text-right text-muted-foreground">{c}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Write-review form */}
      {showForm && (
        <form onSubmit={submit} className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Your name</Label>
              <Input required minLength={2} maxLength={60} value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} />
            </div>
            <div>
              <Label>Rating</Label>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button key={i} type="button" onClick={() => setForm({ ...form, rating: i })}>
                    <Star size={28} className={i <= form.rating ? 'fill-primary text-primary' : 'text-muted-foreground/40'} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Label>Title (optional)</Label>
            <Input maxLength={100} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label>Your review</Label>
            <Textarea required minLength={10} maxLength={2000} rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Share your experience…" />
          </div>
          <div>
            <Label>Language</Label>
            <div className="flex gap-2 mt-2">
              {(['en', 'hinglish'] as const).map((l) => (
                <Button key={l} type="button" size="sm" variant={form.language === l ? 'default' : 'outline'} onClick={() => setForm({ ...form, language: l })}>
                  {l === 'en' ? 'English' : 'Hinglish'}
                </Button>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit review'}</Button>
        </form>
      )}

      {/* Filter tabs */}
      {reviews.length > 0 && (
        <Tabs value={langFilter} onValueChange={(v) => { setLangFilter(v as typeof langFilter); setPage(1); }}>
          <TabsList>
            <TabsTrigger value="all">All ({reviews.length})</TabsTrigger>
            <TabsTrigger value="en">English ({reviews.filter((r) => r.language === 'en').length})</TabsTrigger>
            <TabsTrigger value="hinglish">Hinglish ({reviews.filter((r) => r.language === 'hinglish').length})</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Review list */}
      <div className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading reviews…</p>}
        {!isLoading && reviews.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">No reviews yet. Be the first to review!</p>
        )}
        {shown.map((r) => (
          <article key={r.id} className="rounded-lg border border-border bg-card/40 backdrop-blur-sm p-4 space-y-2">
            <header className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground">{r.author_name}</span>
                {r.verified_buyer && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-500/90 bg-green-500/10 px-2 py-0.5 rounded">
                    <CheckCircle2 className="h-3 w-3" /> Verified Buyer
                  </span>
                )}
                {r.city && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {r.city}
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </header>
            <Stars value={r.rating} />
            {r.title && <h3 className="font-semibold text-foreground">{r.title}</h3>}
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{r.body}</p>
          </article>
        ))}
        {page < pages && (
          <div className="text-center pt-4">
            <Button variant="outline" onClick={() => setPage((p) => p + 1)}>Show more reviews</Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductReviews;

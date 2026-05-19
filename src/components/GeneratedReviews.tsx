import { useMemo, useState } from 'react';
import { Star, CheckCircle2, MapPin, ThumbsUp, ShieldCheck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { generateReviews, computeStats, type GeneratedReview } from '@/lib/generateReviews';

interface Props {
  seed: string;          // stable id (product id / tool id / slug)
  name: string;          // product or tool name
  count?: number;        // how many reviews to generate
  heading?: string;
  subheading?: string;
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

const PAGE_SIZE = 4;

const GeneratedReviews = ({ seed, name, count = 8, heading, subheading }: Props) => {
  const reviews = useMemo(() => generateReviews(seed, name, count), [seed, name, count]);
  const stats = useMemo(() => computeStats(reviews), [reviews]);

  const [lang, setLang] = useState<'all' | 'en' | 'hinglish'>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo<GeneratedReview[]>(
    () => (lang === 'all' ? reviews : reviews.filter((r) => r.language === lang)),
    [reviews, lang],
  );
  const shown = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = shown.length < filtered.length;

  if (!reviews.length) return null;

  return (
    <section className="mt-12 space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          {heading || 'Customer Reviews'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {subheading || `What buyers are saying about ${name}`}
        </p>
      </div>

      {/* Summary card */}
      <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6 grid md:grid-cols-[auto_1fr] gap-6 items-center">
        <div className="text-center md:border-r md:border-border md:pr-6">
          <div className="text-5xl font-bold text-primary">{stats.avg.toFixed(1)}</div>
          <Stars value={stats.avg} size={20} />
          <p className="text-xs text-muted-foreground mt-1">{stats.total} verified reviews</p>
          <div className="mt-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full font-semibold">
            <ShieldCheck className="w-3 h-3" /> Trusted
          </div>
        </div>
        <div className="space-y-1.5 w-full">
          {[5, 4, 3, 2, 1].map((r) => {
            const c = stats.counts[r as 1 | 2 | 3 | 4 | 5] || 0;
            const pct = stats.total ? (c / stats.total) * 100 : 0;
            return (
              <div key={r} className="flex items-center gap-3 text-xs">
                <span className="w-10 text-muted-foreground">{r} star</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right text-muted-foreground">{c}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter */}
      <Tabs value={lang} onValueChange={(v) => { setLang(v as typeof lang); setPage(1); }}>
        <TabsList>
          <TabsTrigger value="all">All ({reviews.length})</TabsTrigger>
          <TabsTrigger value="en">English ({reviews.filter((r) => r.language === 'en').length})</TabsTrigger>
          <TabsTrigger value="hinglish">Hinglish ({reviews.filter((r) => r.language === 'hinglish').length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Review cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        {shown.map((r) => (
          <article
            key={r.id}
            className="rounded-lg border border-border bg-card/40 backdrop-blur-sm p-4 space-y-2 hover:border-primary/30 transition-colors"
          >
            <header className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-8 h-8 rounded-full bg-primary/15 text-primary font-bold text-sm flex items-center justify-center">
                  {r.author_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-foreground text-sm">{r.author_name}</span>
                    {r.verified_buyer && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-medium">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {r.city}
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-muted-foreground">
                {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </header>
            <Stars value={r.rating} />
            <h3 className="font-semibold text-foreground text-sm">{r.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
              <ThumbsUp className="h-3 w-3" /> {r.helpful_count} found this helpful
            </div>
          </article>
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
            Show more reviews
          </Button>
        </div>
      )}
    </section>
  );
};

export default GeneratedReviews;

import { motion } from 'framer-motion';
import { Instagram, CheckCircle2, ArrowUpRight, Sparkles } from 'lucide-react';

const proofs = [
  { emoji: '🎬', name: 'Netflix Premium', city: 'Mumbai', time: '2 min ago' },
  { emoji: '🤖', name: 'ChatGPT Plus', city: 'Delhi', time: '6 min ago' },
  { emoji: '📺', name: 'Prime Video', city: 'Bangalore', time: '11 min ago' },
  { emoji: '🎨', name: 'Canva Pro', city: 'Chennai', time: '18 min ago' },
  { emoji: '🎵', name: 'Spotify Premium', city: 'Pune', time: '22 min ago' },
  { emoji: '🏏', name: 'Hotstar', city: 'Kolkata', time: '27 min ago' },
  { emoji: '🖌️', name: 'Adobe CC', city: 'Hyderabad', time: '34 min ago' },
  { emoji: '▶️', name: 'YouTube Premium', city: 'Ahmedabad', time: '41 min ago' },
  { emoji: '📊', name: 'Microsoft 365', city: 'Jaipur', time: '48 min ago' },
  { emoji: '✍️', name: 'Grammarly', city: 'Lucknow', time: '55 min ago' },
  { emoji: '🔍', name: 'Perplexity AI', city: 'Chandigarh', time: '1 hr ago' },
  { emoji: '📱', name: 'Zee5', city: 'Indore', time: '1 hr ago' },
];

type Proof = (typeof proofs)[number];

const ProofCard = ({ p }: { p: Proof }) => (
  <div className="flex-shrink-0 w-64 relative bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl p-4 group hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10">
    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
      <CheckCircle2 className="w-3 h-3 text-white" />
    </div>
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
        <span className="text-xl">{p.emoji}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-display font-semibold text-foreground text-sm truncate">{p.name}</h4>
        <p className="text-[11px] text-muted-foreground truncate">Customer · {p.city}</p>
      </div>
    </div>
    <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
      <span className="text-[11px] text-emerald-400 font-semibold inline-flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" /> Delivered
      </span>
      <span className="text-[11px] text-muted-foreground">{p.time}</span>
    </div>
  </div>
);

const DeliveryProofs = () => {
  const doubled = [...proofs, ...proofs];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Section glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-primary font-bold bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-4">
            <Sparkles className="w-3 h-3" /> Live delivery feed
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Delivery <span className="text-gradient">Proofs</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Real deliveries. Real customers. Real trust.
          </p>

          {/* Trust stats */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            <span className="text-muted-foreground">
              <span className="font-bold text-foreground">15,000+</span> deliveries
            </span>
            <span className="hidden sm:inline text-muted-foreground/40">•</span>
            <span className="text-muted-foreground">
              <span className="font-bold text-foreground">⭐ 4.9</span> avg rating
            </span>
            <span className="hidden sm:inline text-muted-foreground/40">•</span>
            <span className="text-muted-foreground">
              <span className="font-bold text-foreground">99%</span> delivered in &lt;10 min
            </span>
          </div>
        </motion.div>
      </div>

      {/* Scrolling row 1 */}
      <div className="overflow-hidden mb-5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex gap-4 animate-scroll-left w-max">
          {doubled.map((p, i) => (
            <ProofCard key={`r1-${i}`} p={p} />
          ))}
        </div>
      </div>

      {/* Scrolling row 2 - reversed */}
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex gap-4 animate-scroll-right w-max">
          {[...doubled].reverse().map((p, i) => (
            <ProofCard key={`r2-${i}`} p={p} />
          ))}
        </div>
      </div>

      {/* CTA — pops in when scrolled into view */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ type: 'spring', damping: 14, stiffness: 220, delay: 0.1 }}
          className="text-center mt-12"
        >
          <motion.a
            href="https://www.instagram.com/stories/highlights/17993911780498455/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-sm text-white shadow-2xl shadow-primary/30 overflow-hidden group"
            style={{
              background:
                'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            }}
          >
            {/* Animated shine sweep */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Instagram className="w-5 h-5 relative" />
            <span className="relative">View All Proofs on Instagram</span>
            <ArrowUpRight className="w-4 h-4 relative transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.a>
          <p className="text-xs text-muted-foreground mt-3">
            Daily delivery stories posted on @dreamcrest_solutions
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DeliveryProofs;

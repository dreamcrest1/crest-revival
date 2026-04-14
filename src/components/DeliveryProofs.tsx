import { motion } from 'framer-motion';

const proofs = [
  { emoji: '🎬', name: 'Netflix', city: 'Mumbai' },
  { emoji: '🤖', name: 'ChatGPT Plus', city: 'Delhi' },
  { emoji: '📺', name: 'Prime Video', city: 'Bangalore' },
  { emoji: '🎨', name: 'Canva Pro', city: 'Chennai' },
  { emoji: '🎵', name: 'Spotify Premium', city: 'Pune' },
  { emoji: '🏏', name: 'Hotstar', city: 'Kolkata' },
  { emoji: '🖌️', name: 'Adobe CC', city: 'Hyderabad' },
  { emoji: '▶️', name: 'YouTube Premium', city: 'Ahmedabad' },
  { emoji: '📊', name: 'Microsoft 365', city: 'Jaipur' },
  { emoji: '✍️', name: 'Grammarly', city: 'Lucknow' },
  { emoji: '🔍', name: 'Perplexity AI', city: 'Chandigarh' },
  { emoji: '📱', name: 'Zee5', city: 'Indore' },
];

const DeliveryProofs = () => {
  const doubled = [...proofs, ...proofs];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Section glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Delivery <span className="text-gradient">Proofs</span>
          </h2>
          <p className="text-muted-foreground text-lg">Real deliveries. Real customers. Real trust.</p>
        </motion.div>
      </div>

      {/* Scrolling row 1 */}
      <div className="overflow-hidden mb-5">
        <div className="flex gap-5 animate-scroll-left w-max">
          {doubled.map((p, i) => (
            <div
              key={`r1-${i}`}
              className="flex-shrink-0 w-60 bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl p-5 group hover:border-primary/30 transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                <span className="text-lg">{p.emoji}</span>
              </div>
              <h4 className="font-display font-semibold text-foreground text-sm">{p.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">Customer from {p.city}</p>
              <p className="text-xs text-primary mt-2 font-semibold flex items-center gap-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Delivered Successfully
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling row 2 - reversed */}
      <div className="overflow-hidden">
        <div className="flex gap-5 animate-scroll-right w-max">
          {[...doubled].reverse().map((p, i) => (
            <div
              key={`r2-${i}`}
              className="flex-shrink-0 w-60 bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl p-5 group hover:border-primary/30 transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                <span className="text-lg">{p.emoji}</span>
              </div>
              <h4 className="font-display font-semibold text-foreground text-sm">{p.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">Customer from {p.city}</p>
              <p className="text-xs text-primary mt-2 font-semibold flex items-center gap-1">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Delivered Successfully
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-10">
        <a
          href="https://www.instagram.com/dreamcrest_solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-semibold transition-colors"
        >
          View All Proofs on Instagram
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default DeliveryProofs;

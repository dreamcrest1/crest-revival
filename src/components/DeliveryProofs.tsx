import { Instagram, CheckCircle2, ArrowUpRight } from 'lucide-react';

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

const ProofChip = ({ p }: { p: Proof }) => (
  <div
    className="flex-shrink-0 w-64 p-3 flex items-center gap-3"
    style={{
      background: 'hsl(240 18% 9%)',
      border: '1px solid rgba(201,168,76,0.25)',
      borderRadius: 8,
    }}
  >
    <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: '#C9A84C' }} />
    <div className="flex-1 min-w-0">
      <div className="font-display text-sm font-semibold truncate" style={{ color: '#F0EAD6' }}>
        {p.emoji} {p.name}
      </div>
      <div className="text-[11px] truncate" style={{ color: '#8A8AA0' }}>
        {p.city} · <span style={{ color: '#4A4A60' }}>{p.time}</span>
      </div>
    </div>
  </div>
);

const DeliveryProofs = () => {
  const doubled = [...proofs, ...proofs];

  return (
    <section
      className="py-16 relative"
      style={{
        background: 'hsl(240 20% 13%)',
        borderTop: '1px solid rgba(201,168,76,0.12)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] font-bold px-3 py-1 rounded-full mb-4"
            style={{ color: '#C9A84C', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)' }}
          >
            Live delivery feed
          </span>
          <h2 className="font-display font-bold mb-3">
            <span style={{ color: '#F0EAD6' }}>Delivery </span>
            <span className="text-gradient-gold">Proofs</span>
          </h2>
          <p className="text-base" style={{ color: '#8A8AA0' }}>
            Real deliveries. Real customers. Real trust.
          </p>
        </div>
      </div>

      <div className="overflow-hidden mb-5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex gap-4 animate-scroll-left w-max">
          {doubled.map((p, i) => (
            <ProofChip key={`r1-${i}`} p={p} />
          ))}
        </div>
      </div>

      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex gap-4 animate-scroll-right w-max">
          {[...doubled].reverse().map((p, i) => (
            <ProofChip key={`r2-${i}`} p={p} />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 text-center">
        <a
          href="https://www.instagram.com/stories/highlights/17993911780498455/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold text-sm transition-all hover:shadow-[0_0_24px_rgba(201,168,76,0.45)] active:scale-[0.97]"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', color: '#0A0A0F' }}
        >
          <Instagram className="w-4 h-4" />
          View All Proofs on Instagram
          <ArrowUpRight className="w-4 h-4" />
        </a>
        <p className="text-xs mt-3" style={{ color: '#4A4A60' }}>
          Daily delivery stories posted on @Castletool99
        </p>
      </div>
    </section>
  );
};

export default DeliveryProofs;

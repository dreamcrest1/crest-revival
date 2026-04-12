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
    <section className="py-20">
      <div className="container mx-auto px-4 text-center mb-10">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
          Delivery Proofs
        </h2>
        <p className="text-muted-foreground">Real deliveries. Real customers. Real trust.</p>
      </div>

      {/* Scrolling row 1 */}
      <div className="overflow-hidden mb-4">
        <div className="flex gap-4 animate-scroll-left w-max">
          {doubled.map((p, i) => (
            <div
              key={`r1-${i}`}
              className="flex-shrink-0 w-56 bg-card border border-border rounded-xl p-4"
            >
              <div className="text-2xl mb-2">{p.emoji}</div>
              <h4 className="font-display font-semibold text-foreground text-sm">{p.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">Customer from {p.city}</p>
              <p className="text-xs text-primary mt-1 font-medium">Delivered Successfully ✓</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling row 2 - reversed */}
      <div className="overflow-hidden">
        <div className="flex gap-4 animate-scroll-right w-max">
          {[...doubled].reverse().map((p, i) => (
            <div
              key={`r2-${i}`}
              className="flex-shrink-0 w-56 bg-card border border-border rounded-xl p-4"
            >
              <div className="text-2xl mb-2">{p.emoji}</div>
              <h4 className="font-display font-semibold text-foreground text-sm">{p.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">Customer from {p.city}</p>
              <p className="text-xs text-primary mt-1 font-medium">Delivered Successfully ✓</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <a
          href="https://www.instagram.com/dreamcrest_solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm font-medium"
        >
          View All Proofs on Instagram →
        </a>
      </div>
    </section>
  );
};

export default DeliveryProofs;

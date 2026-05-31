import { Crown, Shield } from 'lucide-react';

const features = [
  'Most Trusted Service Provider',
  'Over 200+ Products Available',
  'Most Responsive Customer Support',
  'Instant Digital Delivery',
];

const stats = [
  { value: '15,000+', label: 'Happy Customers' },
  { value: '4.9★', label: 'Rating' },
  { value: '2021', label: 'Since' },
  { value: '200+', label: 'Products' },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Decorative crown rule */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="flex-1 max-w-xs" style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5))' }} />
          <Crown className="w-6 h-6" style={{ color: '#C9A84C' }} />
          <div className="flex-1 max-w-xs" style={{ height: 1, background: 'linear-gradient(90deg, rgba(201,168,76,0.5), transparent)' }} />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: '#C9A84C' }}>About Us</p>
            <h2 className="font-display font-bold mb-3" style={{ color: '#F0EAD6' }}>
              Castle Tools
            </h2>
            <h3 className="font-display text-lg mb-6" style={{ color: '#8A8AA0' }}>
              Oldest Multiplatform Service Provider
            </h3>
            <p className="mb-8" style={{ color: '#8A8AA0', lineHeight: 1.8 }}>
              Castle Tools is a leading provider of OTT services and group buy tools at discounted
              prices. Founded in 2021, Castle Tools has gained over 15,000+ customers and has expanded its
              reach internationally.
            </p>

            <div className="space-y-3">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <Shield
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: '#C9A84C', fill: 'rgba(201,168,76,0.18)' }}
                  />
                  <span style={{ color: '#F0EAD6' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="text-center p-6 transition-all hover:-translate-y-1"
                style={{
                  background: 'hsl(240 20% 13%)',
                  border: '1px solid hsl(240 26% 18%)',
                  borderRadius: 12,
                  boxShadow: 'inset 0 1px 0 rgba(201,168,76,0.06)',
                }}
              >
                <div className="font-display text-3xl font-bold mb-1" style={{ color: '#C9A84C' }}>
                  {s.value}
                </div>
                <div className="text-sm" style={{ color: '#8A8AA0' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

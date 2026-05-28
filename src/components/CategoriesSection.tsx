import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';

const categoryIcons: Record<string, string> = {
  'AI Tools': '🤖',
  'Writing Tools': '✍️',
  'Video Editing': '🎬',
  'Indian OTT': '📺',
  'International OTT': '🌍',
  'SEO': '🔍',
  'VPN': '🔐',
  'Lead Generation': '👥',
  'Design Tools': '🎨',
  'Cloud Storage': '☁️',
  'Cloud Services': '☁️',
  'Learning': '📚',
  'Music': '🎵',
  'Software': '💻',
};

const CategoriesSection = () => {
  const { data } = useProducts();
  const categories = (data?.categories || []).slice(0, 9);

  if (!categories.length) return null;

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-display mb-3">
            <span style={{ color: '#F0EAD6' }}>Browse </span>
            <span className="text-gradient-gold">Categories</span>
          </h2>
          <p className="text-base" style={{ color: '#8A8AA0' }}>
            Choose your realm — every category, every premium pick.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-5 max-w-4xl mx-auto">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative flex flex-col items-center justify-center text-center transition-all hover:scale-[1.06]"
              style={{
                width: 180,
                height: 200,
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                background:
                  'linear-gradient(160deg, hsl(240 18% 11%), hsl(240 18% 8%))',
                padding: 24,
              }}
            >
              {/* Inner gold-outline hexagon */}
              <div
                aria-hidden
                className="absolute inset-[3px] pointer-events-none transition-all group-hover:opacity-100"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  background:
                    'linear-gradient(160deg, rgba(201,168,76,0.25), rgba(201,168,76,0.6))',
                  opacity: 0.35,
                }}
              />
              <div
                aria-hidden
                className="absolute inset-[4px] pointer-events-none"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  background: 'linear-gradient(160deg, hsl(240 18% 11%), hsl(240 18% 8%))',
                }}
              />

              <div className="relative z-10 flex flex-col items-center">
                <span className="text-5xl mb-3 transition-transform group-hover:scale-110">
                  {categoryIcons[cat.name] || (cat as any).emoji || '✦'}
                </span>
                <h3
                  className="font-display text-sm font-bold leading-tight px-2 mb-1"
                  style={{ color: '#C9A84C' }}
                >
                  {cat.name}
                </h3>
                <p className="text-[11px]" style={{ color: '#4A4A60' }}>
                  {cat.count} Products
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

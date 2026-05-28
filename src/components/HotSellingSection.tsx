import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { useProducts, type Product } from '@/hooks/useProducts';
import { slugify } from '@/lib/productSeo';

const PLACEHOLDER = '/placeholder.svg';
const AUTO_MS = 4000;

type Size = 'mobile' | 'tablet' | 'desktop';
const SIZES: Record<Size, { w: number; h: number; gap: number; stage: number; range: number }> = {
  mobile:  { w: 220, h: 320, gap: 130, stage: 380, range: 1 },
  tablet:  { w: 240, h: 350, gap: 200, stage: 440, range: 2 },
  desktop: { w: 280, h: 400, gap: 260, stage: 500, range: 2 },
};

function useSize(): Size {
  const [size, setSize] = useState<Size>('desktop');
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setSize(w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop');
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

const ShieldArrow = ({ dir, onClick }: { dir: 'l' | 'r'; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={dir === 'l' ? 'Previous' : 'Next'}
    className="group absolute top-1/2 -translate-y-1/2 z-30 transition-transform hover:scale-110"
    style={{ [dir === 'l' ? 'left' : 'right']: 8 } as React.CSSProperties}
  >
    <svg width="48" height="56" viewBox="0 0 48 56">
      <path
        d="M4 4 L44 4 L44 32 Q44 44 24 52 Q4 44 4 32 Z"
        fill="hsl(240 18% 9%)"
        stroke="#C9A84C"
        strokeWidth="1.5"
      />
      {dir === 'l' ? (
        <path d="M28 18 L20 28 L28 38" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M20 18 L28 28 L20 38" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  </button>
);

const HotCard = ({
  product,
  isCenter,
  w,
  h,
  onClick,
}: {
  product: Product;
  isCenter: boolean;
  w: number;
  h: number;
  onClick: () => void;
}) => {
  const body = (
    <div
      className="w-full h-full flex flex-col overflow-hidden transition-all duration-300"
      style={{
        background: 'hsl(240 18% 9%)',
        borderRadius: 12,
        border: isCenter ? '1.5px solid #C9A84C' : '1px solid rgba(201,168,76,0.12)',
        boxShadow: isCenter ? '0 0 28px rgba(201,168,76,0.35)' : '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      <div className="relative bg-white" style={{ aspectRatio: '16/9' }}>
        <img
          src={product.image || PLACEHOLDER}
          alt={product.name}
          loading="lazy"
          draggable={false}
          className="w-full h-full object-contain p-3"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
        />
        {product.category && (
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[11px] font-medium"
            style={{ background: 'hsl(240 26% 18%)', color: '#8A8AA0' }}
          >
            {product.category}
          </div>
        )}
        {/* HOT wax-seal */}
        <div
          className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center font-bold text-[9px] tracking-wider"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #E84A3E, #8B1A14)',
            color: '#FFF7E8',
            boxShadow: '0 2px 8px rgba(192,57,43,0.5), inset 0 -2px 4px rgba(0,0,0,0.3)',
            border: '1.5px solid #5C1410',
            transform: 'rotate(-12deg)',
          }}
        >
          HOT
        </div>
      </div>

      {/* Gold separator */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />

      <div className="flex-1 p-4 flex flex-col justify-between min-h-0">
        <div>
          <h3
            className="font-display text-sm font-bold line-clamp-2 leading-tight mb-2"
            style={{ color: '#F0EAD6' }}
          >
            {product.name}
          </h3>
          {product.category && (
            <span
              className="inline-block px-2 py-0.5 rounded text-[10px] font-medium"
              style={{ background: '#2A1E3F', color: '#9B77D4' }}
            >
              {product.category}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2 mt-2 flex-wrap">
          <span className="font-display font-bold text-lg" style={{ color: '#C9A84C' }}>
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs line-through" style={{ color: '#4A4A60' }}>
              {product.originalPrice}
            </span>
          )}
          {product.discount && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(192,57,43,0.15)', color: '#E84A3E' }}
            >
              {product.discount}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (isCenter) {
    return (
      <Link
        to={`/product/${slugify(product.name)}`}
        onClick={(e) => e.stopPropagation()}
        style={{ width: w, height: h }}
        className="block focus:outline-none"
      >
        {body}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} style={{ width: w, height: h }} className="focus:outline-none">
      {body}
    </button>
  );
};

const Stage = ({ items }: { items: Product[] }) => {
  const size = useSize();
  const { w, h, gap, stage, range } = SIZES[size];
  const [active, setActive] = useState(0);
  const hover = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (!hover.current) setActive((a) => (a + 1) % items.length);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [items.length]);

  const go = (d: number) => setActive((a) => (a + d + items.length) % items.length);

  if (!items.length) return null;

  return (
    <div className="relative">
      <div
        className="relative w-full"
        style={{ height: stage }}
        onMouseEnter={() => (hover.current = true)}
        onMouseLeave={() => (hover.current = false)}
      >
        {/* Bottom spotlight */}
        <div
          className="absolute left-1/2 bottom-2 -translate-x-1/2 pointer-events-none"
          style={{
            width: '70%',
            height: 40,
            background: 'radial-gradient(ellipse, rgba(201,168,76,0.35), transparent 70%)',
            filter: 'blur(20px)',
          }}
        />

        {items.map((p, i) => {
          let offset = i - active;
          if (offset > items.length / 2) offset -= items.length;
          if (offset < -items.length / 2) offset += items.length;
          const abs = Math.abs(offset);
          if (abs > range) return null;

          const x = offset * gap;
          const scale = abs === 0 ? 1 : abs === 1 ? 0.88 : 0.76;
          const opacity = abs === 0 ? 1 : abs === 1 ? 0.7 : 0.45;
          const blur = abs >= 2 ? 1 : 0;
          const isCenter = abs === 0;

          return (
            <div
              key={p.id}
              className="absolute top-1/2 left-1/2"
              style={{
                width: w,
                height: h,
                marginLeft: -w / 2,
                marginTop: -h / 2,
                transform: `translateX(${x}px) scale(${scale})`,
                opacity,
                filter: blur ? `blur(${blur}px)` : undefined,
                zIndex: 10 - abs,
                transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.55s ease',
              }}
            >
              <HotCard product={p} isCenter={isCenter} w={w} h={h} onClick={() => setActive(i)} />
            </div>
          );
        })}

        <ShieldArrow dir="l" onClick={() => go(-1)} />
        <ShieldArrow dir="r" onClick={() => go(1)} />
      </div>

      {/* Diamond dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to ${i + 1}`}
            className="transition-all"
            style={{
              width: 10,
              height: 10,
              transform: 'rotate(45deg)',
              background: i === active ? '#C9A84C' : 'transparent',
              border: '1px solid #C9A84C',
            }}
          />
        ))}
      </div>
    </div>
  );
};

const HotSellingSection = () => {
  const { data, isLoading } = useProducts();
  const hot = (data?.hotSelling || []).slice(0, 10);
  if (!isLoading && hot.length === 0) return null;

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="flex-1 max-w-[200px]" style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5))' }} />
          <Flame className="w-5 h-5 animate-torch-flicker" style={{ color: '#C9A84C' }} />
          <h2 className="font-display text-center whitespace-nowrap">
            <span className="text-gradient-gold">Hot Selling</span>{' '}
            <span style={{ color: '#F0EAD6' }}>Products</span>
          </h2>
          <Flame className="w-5 h-5 animate-torch-flicker" style={{ color: '#C9A84C', animationDelay: '0.3s' }} />
          <div className="flex-1 max-w-[200px]" style={{ height: 1, background: 'linear-gradient(90deg, rgba(201,168,76,0.5), transparent)' }} />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#C9A84C' }} />
          </div>
        ) : (
          <Stage items={hot} />
        )}

        <div className="text-center mt-8">
          <Link to="/products?filter=hot" className="text-sm font-semibold hover:underline" style={{ color: '#C9A84C' }}>
            View all hot products →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HotSellingSection;

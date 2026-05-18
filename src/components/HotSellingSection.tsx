import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts, type Product } from '@/hooks/useProducts';
import { slugify } from '@/lib/productSeo';

const PLACEHOLDER = '/placeholder.svg';
const DRAG_THRESHOLD = 6;
const AUTO_MS = 4500;

type Size = 'mobile' | 'tablet' | 'desktop';

const SIZES: Record<Size, { w: number; h: number; gap: number; stage: number; range: number }> = {
  mobile: { w: 170, h: 240, gap: 95, stage: 380, range: 1 },
  tablet: { w: 210, h: 290, gap: 180, stage: 500, range: 2 },
  desktop: { w: 240, h: 340, gap: 240, stage: 600, range: 2 },
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

const Cover = ({
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
      className={`w-full h-full rounded-2xl overflow-hidden bg-card/60 backdrop-blur-xl border flex flex-col transition-[border-color,box-shadow] duration-300 ${
        isCenter
          ? 'border-primary shadow-[0_30px_80px_-15px_hsl(var(--primary)/0.8)] ring-2 ring-primary/40'
          : 'border-white/10 shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.3)]'
      }`}
    >
      <div className="relative aspect-square bg-white overflow-hidden">
        <img
          src={product.image || PLACEHOLDER}
          alt={product.name}
          loading="lazy"
          draggable={false}
          className="w-full h-full object-contain p-3"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
          }}
        />
        {product.discount && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold tracking-wide shadow">
            {product.discount}
          </div>
        )}
        <div className="absolute top-2 right-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-destructive/90 text-destructive-foreground text-[10px] font-bold uppercase tracking-wider shadow">
          <Flame className="w-2.5 h-2.5" /> Hot
        </div>
      </div>
      <div className="flex-1 p-3 flex flex-col justify-between bg-gradient-to-b from-card/60 to-card/95 min-h-0">
        <h3 className="font-display text-sm font-bold text-foreground line-clamp-2 leading-tight text-left">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-primary font-display font-bold text-base">{product.price}</span>
          {product.originalPrice && (
            <span className="text-[11px] text-muted-foreground line-through">{product.originalPrice}</span>
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
    <button
      type="button"
      onClick={onClick}
      style={{ width: w, height: h }}
      className="focus:outline-none"
    >
      {body}
    </button>
  );
};

const HotSellingCoverflow = ({ items }: { items: Product[] }) => {
  const size = useSize();
  const { w, h, gap, stage, range } = SIZES[size];
  const [active, setActive] = useState(0);
  const hover = useRef(false);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const moved = useRef(0);
  const captured = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(() => {
      if (!hover.current && !dragging.current) {
        setActive((a) => (a + 1) % items.length);
      }
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [items.length]);

  const go = (dir: number) => setActive((a) => (a + dir + items.length) % items.length);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    captured.current = false;
    lastX.current = e.clientX;
    moved.current = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    moved.current += Math.abs(dx);
    if (!captured.current && moved.current > DRAG_THRESHOLD) {
      captured.current = true;
      stageRef.current?.setPointerCapture(e.pointerId);
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (captured.current) {
      try { stageRef.current?.releasePointerCapture(e.pointerId); } catch {}
      const totalDx = e.clientX - lastX.current + 0; // last delta only — use moved sign via clientX diff from start? approximate by velocity
    }
    if (moved.current > 60) {
      const dx = e.clientX - (lastX.current - 0);
      // Use direction of last move accumulated via clientX vs start; fallback to nothing
      go(dx < 0 ? 1 : -1);
    }
    dragging.current = false;
    captured.current = false;
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    const node = stageRef.current;
    node?.addEventListener('keydown', onKey as any);
    return () => node?.removeEventListener('keydown', onKey as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  if (!items.length) return null;

  return (
    <div className="relative">
      <div
        ref={stageRef}
        tabIndex={0}
        className="relative w-full select-none touch-pan-y cursor-grab active:cursor-grabbing focus:outline-none"
        style={{ perspective: '1400px', height: stage }}
        onMouseEnter={() => (hover.current = true)}
        onMouseLeave={() => (hover.current = false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* glow floor */}
        <div className="absolute left-1/2 bottom-8 -translate-x-1/2 w-[80%] max-w-[760px] h-10 rounded-[50%] bg-primary/20 blur-2xl pointer-events-none" />

        {items.map((p, i) => {
          let offset = i - active;
          if (offset > items.length / 2) offset -= items.length;
          if (offset < -items.length / 2) offset += items.length;
          const abs = Math.abs(offset);
          if (abs > range) return null;

          const x = offset * gap;
          const rotY = offset * -45;
          const z = -abs * 120;
          const scale = 1 - abs * 0.12;
          const opacity = abs === 0 ? 1 : abs === 1 ? 0.85 : 0.45;
          const isCenter = abs === 0;

          return (
            <motion.div
              key={p.id}
              className="absolute top-1/2 left-1/2"
              style={{
                width: w,
                height: h,
                marginLeft: -w / 2,
                marginTop: -h / 2,
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
              }}
              animate={{ x, scale, rotateY: rotY, z, opacity, zIndex: 10 - abs }}
              transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            >
              <Cover
                product={p}
                isCenter={isCenter}
                w={w}
                h={h}
                onClick={() => {
                  if (moved.current > 8) return;
                  setActive(i);
                }}
              />
            </motion.div>
          );
        })}

        {/* edge fades */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-background to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-background to-transparent pointer-events-none z-20" />

        {/* arrows */}
        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/70 backdrop-blur border border-white/10 hover:border-primary hover:bg-card flex items-center justify-center text-foreground transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/70 backdrop-blur border border-white/10 hover:border-primary hover:bg-card flex items-center justify-center text-foreground transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* dots */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70'
            }`}
            aria-label={`Go to ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const HotSellingSection = () => {
  const { data, isLoading } = useProducts();
  const hotSelling = data?.hotSelling || [];

  if (!isLoading && hotSelling.length === 0) return null;

  const items = hotSelling.slice(0, 12);

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-destructive/[0.03] to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold mb-3">
              <Flame className="w-3.5 h-3.5" /> Trending Now
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Hot <span className="text-gradient">Selling</span> Products
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Our most loved premium subscriptions — fastest moving picks of the month.
            </p>
          </div>

          <Link
            to="/products?filter=hot"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <HotSellingCoverflow items={items} />
        )}
      </div>
    </section>
  );
};

export default HotSellingSection;

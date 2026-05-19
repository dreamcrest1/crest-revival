import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { motion, useMotionValue, useAnimationFrame, animate } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const categories = data?.categories || [];

  const containerRef = useRef<HTMLDivElement>(null);
  const rotation = useMotionValue(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
  const autoSpinRef = useRef(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const count = categories.length || 1;
  const angleStep = 360 / count;
  // Radius scales with count so cards don't overlap
  const radius = isMobile
    ? Math.max(150, count * 24)
    : Math.max(380, count * 62);
  const cardWidth = isMobile ? 120 : 200;
  const cardHeight = isMobile ? 140 : 220;

  // Auto-rotation + inertia
  useAnimationFrame((_, delta) => {
    if (draggingRef.current) return;
    if (autoSpinRef.current) {
      rotation.set(rotation.get() + (delta / 1000) * 8); // 8 deg/sec
    }
    if (Math.abs(velocityRef.current) > 0.01) {
      rotation.set(rotation.get() + velocityRef.current * (delta / 16));
      velocityRef.current *= 0.94; // friction
    }
  });

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    const deltaDeg = dx * 0.35;
    rotation.set(rotation.get() + deltaDeg);
    velocityRef.current = deltaDeg * 0.5;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    draggingRef.current = false;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  };

  const rotateBy = (deg: number) => {
    autoSpinRef.current = false;
    animate(rotation.get(), rotation.get() + deg, {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => rotation.set(v),
    });
  };

  return (
    <section className="py-20 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Browse <span className="text-gradient">Categories</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Drag to spin · Find what you need from our wide range of premium digital products
          </p>
        </motion.div>

        <div
          ref={containerRef}
          className="relative mx-auto select-none touch-none"
          style={{
            height: isMobile ? 320 : 440,
            perspective: isMobile ? 1100 : 1600,
            cursor: 'grab',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onMouseEnter={() => { autoSpinRef.current = false; }}
          onMouseLeave={() => { autoSpinRef.current = true; }}
        >
          {/* Hyperspace glow underneath */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px] pointer-events-none"
            style={{ width: radius * 1.5, height: radius * 0.6 }}
          />

          <motion.div
            className="absolute left-1/2 top-1/2"
            style={{
              transformStyle: 'preserve-3d',
              rotateY: rotation,
              width: 0,
              height: 0,
              willChange: 'transform',
            }}
          >
            {categories.map((cat, i) => {
              const angle = i * angleStep;
              return (
                <Link
                  key={cat.name}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  draggable={false}
                  onClick={(e) => {
                    // prevent accidental nav while dragging
                    if (Math.abs(velocityRef.current) > 1.5) e.preventDefault();
                  }}
                  className="group absolute block bg-card/80 backdrop-blur-sm border border-border/60 hover:border-primary/60 rounded-2xl text-center overflow-hidden transition-colors"
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    left: -cardWidth / 2,
                    top: -cardHeight / 2,
                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    boxShadow: '0 18px 40px -18px hsl(24 95% 53% / 0.35)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <span className="text-2xl md:text-3xl">{categoryIcons[cat.name] || cat.emoji}</span>
                    </div>
                    <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors text-sm md:text-base px-2">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] md:text-xs text-muted-foreground mt-1 font-medium">
                      {cat.count} Products
                    </p>
                  </div>
                </Link>
              );
            })}
          </motion.div>

          {/* Nav arrows */}
          <button
            type="button"
            aria-label="Previous"
            onClick={() => rotateBy(angleStep)}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/80 backdrop-blur border border-border/60 hover:border-primary/60 hover:bg-primary/10 text-foreground hover:text-primary flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => rotateBy(-angleStep)}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/80 backdrop-blur border border-border/60 hover:border-primary/60 hover:bg-primary/10 text-foreground hover:text-primary flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground/70 mt-4">
          Tip: drag left or right to spin the ring
        </p>
      </div>
    </section>
  );
};

export default CategoriesSection;

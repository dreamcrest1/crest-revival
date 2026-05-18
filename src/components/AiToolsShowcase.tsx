import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useAnimationFrame } from 'framer-motion';
import { Sparkles, ArrowRight, Star, X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAiTools, proxyImage, type AiTool } from '@/hooks/useAiTools';
import { useIsMobile } from '@/hooks/use-mobile';

const COUNT = 12;
const ROTATE_MS = 5000;

function baseKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(\d+\s*(month|months|mo|year|years|yr|day|days|week|weeks))\b/g, '')
    .replace(/\b(pro|plus|premium|basic|standard|lifetime|trial)\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function pickUnique(pool: AiTool[], offset: number, n: number): AiTool[] {
  const seen = new Set<string>();
  const out: AiTool[] = [];
  const len = pool.length;
  if (!len) return out;
  for (let i = 0; i < len && out.length < n; i++) {
    const t = pool[(offset + i) % len];
    const k = baseKey(t.name);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out;
}

/* ---------------- Shared header ---------------- */
const Header = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-8"
  >
    <div>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold mb-3">
        <Sparkles className="w-3.5 h-3.5" /> AI Universe
      </div>
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
        Premium <span className="text-gradient">AI Tools</span> in orbit
      </h2>
      <p className="text-muted-foreground mt-2 max-w-xl text-sm md:text-base">
        Hand-picked AI subscriptions. Lineup refreshes every few seconds.
      </p>
    </div>
    <Link
      to="/ai-tools"
      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
    >
      Explore all AI tools <ArrowRight className="w-4 h-4" />
    </Link>
  </motion.div>
);

/* ---------------- Detail panel ---------------- */
const DetailPanel = ({ tool, onClose }: { tool: AiTool; onClose: () => void }) => (
  <motion.div
    key={tool.id}
    initial={{ opacity: 0, y: 20, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.96 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
    className="mt-6 md:mt-8 max-w-3xl mx-auto rounded-2xl border border-primary/30 bg-card/60 backdrop-blur-xl p-4 md:p-6 shadow-[0_30px_80px_-20px_hsl(var(--primary)/0.5)] relative"
  >
    <button
      type="button"
      onClick={onClose}
      className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 rounded-full bg-background/60 hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Close details"
    >
      <X className="w-4 h-4" />
    </button>
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
      <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-xl bg-white/95 p-2 md:p-3 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
        <img
          src={proxyImage(tool.image, 400)}
          alt={tool.name}
          className="w-full h-full object-contain"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
        />
      </div>
      <div className="flex-1 min-w-0 w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-md bg-primary/90 text-primary-foreground text-[10px] font-bold tracking-wide">
            {tool.symbol}
          </span>
          {tool.trend === 'up' && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-500/90 text-white text-[10px] font-bold">
              <Star className="w-2.5 h-2.5 fill-current" /> {tool.change.toFixed(1)}%
            </span>
          )}
        </div>
        <h3 className="font-display text-lg md:text-2xl font-bold text-foreground">{tool.name}</h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">{tool.validity}</p>
        <div className="flex flex-wrap items-center gap-3 mt-3 md:mt-4">
          <span className="text-xl md:text-3xl font-bold text-primary">₹{tool.price}</span>
          <Link
            to="/ai-tools"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Grab this tool <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

/* ---------------- MOBILE: Curved coverflow ---------------- */
const MobileCoverflow = ({ items }: { items: AiTool[] }) => {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<AiTool | null>(null);
  const startX = useRef<number | null>(null);
  const dx = useRef(0);

  // Auto-advance
  useEffect(() => {
    if (selected) return;
    const id = setInterval(() => setActive((a) => (a + 1) % items.length), 3500);
    return () => clearInterval(id);
  }, [items.length, selected]);

  const go = (dir: number) => setActive((a) => (a + dir + items.length) % items.length);

  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; dx.current = 0; };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    dx.current = e.touches[0].clientX - startX.current;
  };
  const onTouchEnd = () => {
    if (Math.abs(dx.current) > 40) go(dx.current < 0 ? 1 : -1);
    startX.current = null;
    dx.current = 0;
  };

  if (!items.length) return null;

  return (
    <>
      <div
        className="relative h-[340px] w-full overflow-hidden"
        style={{ perspective: '1000px' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {items.map((tool, i) => {
          // signed circular distance
          let offset = i - active;
          if (offset > items.length / 2) offset -= items.length;
          if (offset < -items.length / 2) offset += items.length;
          const abs = Math.abs(offset);
          if (abs > 2) return null; // only render 5 cards
          const x = offset * 95; // px translateX
          const rotY = offset * -22; // deg
          const scale = abs === 0 ? 1 : abs === 1 ? 0.82 : 0.65;
          const z = -abs * 80;
          const opacity = abs === 0 ? 1 : abs === 1 ? 0.7 : 0.35;

          return (
            <motion.button
              key={tool.id}
              type="button"
              onClick={() => (abs === 0 ? setSelected(tool) : setActive(i))}
              className="absolute top-1/2 left-1/2 focus:outline-none"
              style={{ width: 160, height: 230, marginLeft: -80, marginTop: -115, transformStyle: 'preserve-3d' }}
              animate={{ x, scale, rotateY: rotY, z, opacity, zIndex: 10 - abs }}
              transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            >
              <div className={`w-full h-full rounded-2xl overflow-hidden bg-card/50 backdrop-blur-xl border ${abs === 0 ? 'border-primary shadow-[0_30px_80px_-15px_hsl(var(--primary)/0.8)]' : 'border-white/10'} flex flex-col`}>
                <div className="relative aspect-square bg-white/95 overflow-hidden">
                  <img
                    src={proxyImage(tool.image, 400)}
                    alt={tool.name}
                    loading="lazy"
                    draggable={false}
                    className="w-full h-full object-contain p-3"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                  />
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-primary/90 text-primary-foreground text-[9px] font-bold tracking-wide">
                    {tool.symbol}
                  </div>
                </div>
                <div className="flex-1 px-2.5 py-2 flex flex-col justify-between bg-gradient-to-b from-card/60 to-card/90 min-h-0">
                  <h3 className="font-display text-[11px] font-bold text-foreground line-clamp-1 leading-tight text-left">
                    {tool.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-primary font-bold text-xs">₹{tool.price}</span>
                    <span className="text-[9px] text-muted-foreground truncate ml-1">{tool.validity}</span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}

        {/* Edge fades */}
        <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent pointer-events-none z-20" />
      </div>

      {/* Controls + dots */}
      <div className="flex items-center justify-center gap-4 mt-3">
        <button
          type="button"
          onClick={() => go(-1)}
          className="p-2 rounded-full bg-card/60 border border-white/10 text-foreground hover:border-primary/60 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${i === active ? 'w-5 bg-primary' : 'w-1.5 bg-muted-foreground/40'}`}
              aria-label={`Go to ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          className="p-2 rounded-full bg-card/60 border border-white/10 text-foreground hover:border-primary/60 transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {selected && <DetailPanel tool={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
};

/* ---------------- DESKTOP / TABLET: 3D orbit ---------------- */
const DesktopOrbit = ({ items, tablet }: { items: AiTool[]; tablet: boolean }) => {
  const [selected, setSelected] = useState<AiTool | null>(null);
  const radius = tablet ? 320 : 460;
  const cardW = tablet ? 170 : 200;
  const cardH = tablet ? 240 : 280;
  const stageH = tablet ? 500 : 600;

  const rotation = useMotionValue(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const movedSinceDown = useRef(0);
  const AUTO_SPEED = 360 / 48;

  useAnimationFrame((_, delta) => {
    if (dragging.current || selected) return;
    const dt = delta / 1000;
    if (Math.abs(velocity.current) > 0.01) {
      rotation.set(rotation.get() + velocity.current * dt);
      velocity.current *= Math.pow(0.92, delta / 16);
    } else {
      rotation.set(rotation.get() + AUTO_SPEED * dt);
    }
  });

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    velocity.current = 0;
    movedSinceDown.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    movedSinceDown.current += Math.abs(dx);
    const d = dx * 0.4;
    rotation.set(rotation.get() + d);
    velocity.current = d * 60;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <>
      <div
        className="relative w-full select-none touch-none cursor-grab active:cursor-grabbing"
        style={{ perspective: '1600px', height: stageH }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="absolute left-1/2 bottom-6 -translate-x-1/2 w-[760px] max-w-[95vw] h-10 rounded-[50%] bg-primary/20 blur-2xl pointer-events-none" />
        <motion.div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', rotateY: rotation }}>
          {items.map((tool, i) => {
            const angle = (i / items.length) * 360;
            const isSel = selected?.id === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={(e) => {
                  if (movedSinceDown.current > 8) return;
                  e.stopPropagation();
                  setSelected(isSel ? null : tool);
                }}
                className="absolute left-1/2 top-1/2 group focus:outline-none"
                style={{
                  width: cardW,
                  height: cardH,
                  marginLeft: -cardW / 2,
                  marginTop: -cardH / 2,
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0], scale: isSel ? 1.1 : 1 }}
                  whileHover={{ y: 0, scale: isSel ? 1.1 : 1.06 }}
                  transition={{
                    y: { duration: 4 + (i % 5) * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 },
                    scale: { duration: 0.25, ease: 'easeOut' },
                  }}
                  className={`w-full h-full rounded-2xl overflow-hidden bg-card/40 backdrop-blur-xl border shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.4)] transition-[border-color,box-shadow] duration-300 flex flex-col ${
                    isSel
                      ? 'border-primary shadow-[0_30px_80px_-10px_hsl(var(--primary)/0.9)] ring-2 ring-primary/60'
                      : 'border-white/10 group-hover:border-primary/60 group-hover:shadow-[0_30px_80px_-10px_hsl(var(--primary)/0.7)]'
                  }`}
                >
                  <div className="relative aspect-square bg-white/95 overflow-hidden">
                    <img
                      src={proxyImage(tool.image, 400)}
                      alt={tool.name}
                      loading="lazy"
                      draggable={false}
                      className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary/90 text-primary-foreground text-[10px] font-bold tracking-wide">
                      {tool.symbol}
                    </div>
                    {tool.trend === 'up' && (
                      <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-500/90 text-white text-[10px] font-bold">
                        <Star className="w-2.5 h-2.5 fill-current" /> {tool.change.toFixed(1)}%
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-between bg-gradient-to-b from-card/60 to-card/90 min-h-0">
                    <h3 className="font-display text-sm font-bold text-foreground line-clamp-2 leading-tight text-left">
                      {tool.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-primary font-bold text-base">₹{tool.price}</span>
                      <span className="text-[10px] text-muted-foreground truncate ml-1">{tool.validity}</span>
                    </div>
                  </div>
                </motion.div>
              </button>
            );
          })}
        </motion.div>
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none z-20" />
      </div>

      <AnimatePresence>
        {selected && <DetailPanel tool={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
};

/* ---------------- Root ---------------- */
const AiToolsShowcase = () => {
  const { data, isLoading } = useAiTools();
  const isMobile = useIsMobile();
  const [tablet, setTablet] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onResize = () => setTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const pool = data || [];
  const items = useMemo(() => pickUnique(pool, offset, COUNT), [pool, offset]);

  useEffect(() => {
    if (pool.length <= COUNT) return;
    const id = setInterval(() => setOffset((o) => (o + 1) % pool.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [pool.length]);

  if (!isLoading && items.length === 0) return null;

  return (
    <section className="relative py-12 md:py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[80px]" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <Header />
        {isMobile ? <MobileCoverflow items={items} /> : <DesktopOrbit items={items} tablet={tablet} />}
      </div>
    </section>
  );
};

export default AiToolsShowcase;

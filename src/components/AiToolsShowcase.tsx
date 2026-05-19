import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useAnimationFrame } from 'framer-motion';
import { Sparkles, ArrowRight, Star, X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAiTools, type AiTool } from '@/hooks/useAiTools';
import { useIsMobile } from '@/hooks/use-mobile';
import { BrandLogo } from '@/components/ai/BrandLogo';
import { slugifyAiTool } from '@/lib/aiToolSeo';

const COUNT = 12;
const MOBILE_COUNT = 8;
const ROTATE_MS = 9000;
const FADE_S = 1.4;

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

  // Always pin Claude AI Pro Plan (1 Month, ₹1800) first
  const pinned = pool.find(
    (t) =>
      /claude/i.test(t.name) &&
      /pro/i.test(t.name) &&
      /1\s*month/i.test(t.validity) &&
      t.price === 1800,
  );
  if (pinned) {
    out.push(pinned);
    seen.add(baseKey(pinned.name));
  }

  for (let i = 0; i < len && out.length < n; i++) {
    const t = pool[(offset + i) % len];
    if (pinned && t.id === pinned.id) continue;
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
        Premium <span className="text-gradient">AI Tools</span>
      </h2>
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
      <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex items-center justify-center shrink-0 mx-auto sm:mx-0">
        <BrandLogo t={tool} compact />
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
        {tool.activationType && (
          <p className="inline-block mt-2 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/30 text-primary text-[11px] font-semibold">
            {tool.activationType}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3 mt-3 md:mt-4">
          <span className="text-xl md:text-3xl font-bold text-primary">₹{tool.price}</span>
          <Link
            to={`/ai-tool/${slugifyAiTool(tool.name)}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Grab this tool <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

/* ---------------- MOBILE: Touch-driven horizontal wheel ---------------- */
const MobileCoverflow = ({ items }: { items: AiTool[] }) => {
  const [selected, setSelected] = useState<AiTool | null>(null);
  const rotation = useMotionValue(0);
  const dragging = useRef(false);
  const captured = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const moved = useRef(0);

  const len = items.length;

  useAnimationFrame((_, delta) => {
    if (dragging.current) return;
    if (Math.abs(velocity.current) < 0.02) return;
    rotation.set(rotation.get() + velocity.current * (delta / 16));
    velocity.current *= Math.pow(0.94, delta / 16);
  });

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    captured.current = false;
    lastX.current = e.clientX;
    velocity.current = 0;
    moved.current = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    moved.current += Math.abs(dx);
    if (!captured.current && moved.current > 4) {
      captured.current = true;
      stageRef.current?.setPointerCapture(e.pointerId);
    }
    if (!captured.current) return;
    const next = dx * 0.65;
    rotation.set(rotation.get() + next);
    velocity.current = next;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    if (captured.current) {
      try { stageRef.current?.releasePointerCapture(e.pointerId); } catch (error) { void error; }
    }
    captured.current = false;
  };

  if (!len) return null;

  const radius = 185;
  const cardW = 108;
  const cardH = 154;

  return (
    <>
      <div
        ref={stageRef}
        className="relative h-[320px] w-full select-none touch-none overflow-visible cursor-grab active:cursor-grabbing"
        style={{ perspective: '950px' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="absolute left-1/2 top-1/2 h-8 w-[78vw] -translate-x-1/2 translate-y-[110px] rounded-[50%] bg-primary/20 blur-xl pointer-events-none" />
        <motion.div
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            rotateY: rotation,
            willChange: 'transform',
          }}
        >
          {items.map((tool, i) => {
            const angle = (i / len) * 360;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={(e) => {
                  if (moved.current > 8) return;
                  e.stopPropagation();
                  setSelected(tool);
                }}
                className="absolute left-1/2 top-1/2 focus:outline-none"
                style={{
                  width: cardW,
                  height: cardH,
                  marginLeft: -cardW / 2,
                  marginTop: -cardH / 2,
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  contain: 'layout paint',
                }}
              >
                <div className="w-full h-full rounded-xl overflow-hidden bg-card border border-primary/25 shadow-lg flex flex-col">
                  <div className="relative aspect-square overflow-hidden">
                    <BrandLogo t={tool} compact />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-primary/90 text-primary-foreground text-[8px] font-bold tracking-wide">
                      {tool.symbol}
                    </div>
                  </div>
                  <div className="flex-1 px-2 py-1.5 flex flex-col justify-between bg-card min-h-0">
                    <h3 className="font-display text-[10px] font-bold text-foreground line-clamp-1 leading-tight text-left">
                      {tool.name}
                    </h3>
                    <span className="text-primary font-bold text-[11px]">₹{tool.price}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </motion.div>
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

  const captured = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const DRAG_THRESHOLD = 6;

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    captured.current = false;
    lastX.current = e.clientX;
    velocity.current = 0;
    movedSinceDown.current = 0;
    // Do NOT capture immediately — that would swallow card clicks.
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    movedSinceDown.current += Math.abs(dx);
    // Only start capturing once user has actually dragged past threshold.
    if (!captured.current && movedSinceDown.current > DRAG_THRESHOLD) {
      captured.current = true;
      stageRef.current?.setPointerCapture(e.pointerId);
    }
    if (!captured.current) return;
    const d = dx * 0.4;
    rotation.set(rotation.get() + d);
    velocity.current = d * 60;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    if (captured.current) {
      try { stageRef.current?.releasePointerCapture(e.pointerId); } catch (error) { void error; }
    }
    captured.current = false;
  };

  return (
    <>
      <div
        ref={stageRef}
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
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
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
                  <div className="relative aspect-square overflow-hidden">
                    <BrandLogo t={tool} compact />
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
  const count = isMobile ? MOBILE_COUNT : COUNT;
  const items = useMemo(() => pickUnique(pool, offset, count), [pool, offset, count]);

  useEffect(() => {
    if (pool.length <= count) return;
    const step = Math.max(1, count - 1);
    const id = setInterval(() => setOffset((o) => (o + step) % pool.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [pool.length, count]);

  if (!isLoading && items.length === 0) return null;

  return (
    <section className="relative py-12 md:py-24 overflow-hidden">
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[80px]" />
        </div>
      )}
      <div className="container mx-auto px-4 relative z-10">
        <Header />
        <AnimatePresence mode="wait">
          <motion.div
            key={offset}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FADE_S, ease: 'easeInOut' }}
          >
            {isMobile ? <MobileCoverflow items={items} /> : <DesktopOrbit items={items} tablet={tablet} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AiToolsShowcase;

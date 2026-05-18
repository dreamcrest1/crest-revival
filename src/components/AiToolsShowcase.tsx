import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useAnimationFrame, animate } from 'framer-motion';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import { useAiTools, proxyImage, type AiTool } from '@/hooks/useAiTools';
import { useIsMobile } from '@/hooks/use-mobile';

const COUNT = 12;
const ROTATE_MS = 5000;

/** Strip validity-like suffixes so "ElevenLabs 1 Month" and "ElevenLabs 3 Months" collapse. */
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

const AiToolsShowcase = () => {
  const { data, isLoading } = useAiTools();
  const isMobile = useIsMobile();
  const [tablet, setTablet] = useState(false);
  const [offset, setOffset] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () => setTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Responsive sizing
  const radius = isMobile ? 200 : tablet ? 320 : 460;
  const cardW = isMobile ? 130 : tablet ? 170 : 200;
  const cardH = isMobile ? 190 : tablet ? 240 : 280;
  const stageH = isMobile ? 380 : tablet ? 500 : 600;

  const pool = data || [];
  const items = useMemo(() => pickUnique(pool, offset, COUNT), [pool, offset]);

  // Rotate the visible 12 every 5s
  useEffect(() => {
    if (pool.length <= COUNT) return;
    const id = setInterval(() => setOffset((o) => (o + 1) % pool.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [pool.length]);

  // Drag-to-spin with inertia + auto rotation
  const rotation = useMotionValue(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const AUTO_SPEED = 360 / 48; // deg per second, matches old 48s loop

  useAnimationFrame((_, delta) => {
    if (dragging.current) return;
    const dt = delta / 1000;
    // decay flung velocity
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
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    const delta = dx * 0.4; // sensitivity
    rotation.set(rotation.get() + delta);
    velocity.current = delta * 60; // approx deg/sec for inertia
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  if (!isLoading && items.length === 0) return null;

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> AI Universe
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Premium <span className="text-gradient">AI Tools</span> in orbit
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm md:text-base">
              Drag to spin. Tap any card to grab it. Lineup refreshes every few seconds.
            </p>
          </div>
          <Link
            to="/ai-tools"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
          >
            Explore all AI tools <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div
          ref={stageRef}
          className="relative w-full select-none touch-none cursor-grab active:cursor-grabbing"
          style={{ perspective: isMobile ? '900px' : '1600px', height: stageH }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="absolute left-1/2 bottom-6 -translate-x-1/2 w-[760px] max-w-[95vw] h-10 rounded-[50%] bg-primary/20 blur-2xl pointer-events-none" />

          <motion.div
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d', rotateY: rotation }}
          >
            {items.map((tool, i) => {
              const angle = (i / items.length) * 360;
              return (
                <Link
                  key={tool.id}
                  to="/ai-tools"
                  draggable={false}
                  onClick={(e) => {
                    // Suppress click if user was dragging
                    if (Math.abs(velocity.current) > 30) e.preventDefault();
                  }}
                  className="absolute left-1/2 top-1/2 group"
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
                    initial={{ y: 0 }}
                    animate={{ y: [0, -10, 0] }}
                    whileHover={{ y: 0, scale: 1.06 }}
                    transition={{
                      y: {
                        duration: 4 + (i % 5) * 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.15,
                      },
                      scale: { duration: 0.25, ease: 'easeOut' },
                    }}
                    className="w-full h-full rounded-2xl overflow-hidden bg-card/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.4)] group-hover:border-primary/60 group-hover:shadow-[0_30px_80px_-10px_hsl(var(--primary)/0.7)] transition-[border-color,box-shadow] duration-300 flex flex-col"
                  >
                    <div className="relative aspect-square bg-white/95 overflow-hidden">
                      <img
                        src={proxyImage(tool.image, 400)}
                        alt={tool.name}
                        loading="lazy"
                        draggable={false}
                        className="w-full h-full object-contain p-3 md:p-4 transition-transform duration-500 group-hover:scale-110"
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
                    <div className="flex-1 p-2 md:p-3 flex flex-col justify-between bg-gradient-to-b from-card/60 to-card/90">
                      <div>
                        <h3 className="font-display text-xs md:text-sm font-bold text-foreground line-clamp-2 leading-tight">
                          {tool.name}
                        </h3>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{tool.validity}</p>
                      </div>
                      <div className="flex items-end justify-between mt-1 md:mt-2">
                        <span className="text-primary font-bold text-sm md:text-base">₹{tool.price}</span>
                        <span className="text-[10px] text-primary/80 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          View →
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>

          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent pointer-events-none z-20" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent pointer-events-none z-20" />
        </div>
      </div>
    </section>
  );
};

export default AiToolsShowcase;

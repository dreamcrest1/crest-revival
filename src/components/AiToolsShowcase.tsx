import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import { useAiTools, proxyImage, type AiTool } from '@/hooks/useAiTools';
import { useIsMobile } from '@/hooks/use-mobile';

const RADIUS = 460;
const VISIBLE = 12;
const ROTATE_MS = 3000;

const Card = ({ tool }: { tool: AiTool }) => (
  <div className="w-full h-full rounded-2xl overflow-hidden bg-card/50 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.4)] flex flex-col">
    <div className="relative aspect-square bg-white/95 overflow-hidden">
      <img
        src={proxyImage(tool.image, 400)}
        alt={tool.name}
        loading="lazy"
        className="w-full h-full object-contain p-4"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
      />
      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary/90 text-primary-foreground text-[10px] font-bold tracking-wide">
        {tool.symbol}
      </div>
      {tool.trend === 'up' && (
        <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-500/90 text-white text-[10px] font-bold">
          <TrendingUp className="w-2.5 h-2.5" /> {tool.change.toFixed(1)}%
        </div>
      )}
    </div>
    <div className="flex-1 p-3 flex flex-col justify-between bg-gradient-to-b from-card/60 to-card/90">
      <div>
        <h3 className="font-display text-sm font-bold text-foreground line-clamp-2 leading-tight">
          {tool.name}
        </h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">{tool.validity}</p>
      </div>
      <div className="flex items-end justify-between mt-2">
        <span className="text-primary font-bold text-base">₹{tool.price}</span>
        <span className="text-[10px] text-primary/80 font-semibold">View →</span>
      </div>
    </div>
  </div>
);

const AiToolsShowcase = () => {
  const { data, isLoading } = useAiTools();
  const isMobile = useIsMobile();
  const [hovering, setHovering] = useState(false);
  const [offset, setOffset] = useState(0);

  const all = useMemo(() => data || [], [data]);
  const total = all.length;

  // Rotate the visible window every 3s
  useEffect(() => {
    if (total <= VISIBLE) return;
    const id = setInterval(() => setOffset((o) => (o + 1) % total), ROTATE_MS);
    return () => clearInterval(id);
  }, [total]);

  const items = useMemo(() => {
    if (!total) return [];
    return Array.from({ length: Math.min(VISIBLE, total) }, (_, i) => all[(offset + i) % total]);
  }, [all, offset, total]);

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
            <p className="text-muted-foreground mt-2 max-w-xl">
              Hand-picked AI subscriptions, floating through space — refreshed every few seconds.
            </p>
          </div>
          <Link
            to="/ai-tools"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
          >
            Explore all AI tools <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {isMobile ? (
          /* Mobile: 3-card fading stack */
          <MobileShowcase items={items} />
        ) : (
          /* Desktop: 3D orbital ring */
          <div
            className="relative h-[520px] md:h-[600px] w-full select-none"
            style={{ perspective: '1600px' }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <div className="absolute left-1/2 bottom-10 -translate-x-1/2 w-[760px] max-w-[95vw] h-10 rounded-[50%] bg-primary/20 blur-2xl" />

            <motion.div
              className="absolute inset-0"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: hovering ? 0 : 360 }}
              transition={{ duration: 48, ease: 'linear', repeat: Infinity }}
            >
              {items.map((tool, i) => {
                const angle = (i / items.length) * 360;
                return (
                  <Link
                    key={`${offset}-${tool.id}`}
                    to="/ai-tools"
                    className="absolute left-1/2 top-1/2 group"
                    style={{
                      width: 200,
                      height: 280,
                      marginLeft: -100,
                      marginTop: -140,
                      transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                      transition={{
                        opacity: { duration: 0.6 },
                        scale: { duration: 0.6 },
                        y: { duration: 4 + (i % 5) * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 },
                      }}
                      className="w-full h-full group-hover:scale-105 transition-transform"
                    >
                      <Card tool={tool} />
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>

            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none z-20" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none z-20" />
          </div>
        )}
      </div>
    </section>
  );
};

/** Mobile: featured card with smooth fade + small thumbnail strip below */
const MobileShowcase = ({ items }: { items: AiTool[] }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (items.length === 0) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % items.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;
  const current = items[idx];
  const strip = Array.from({ length: 5 }, (_, k) => items[(idx + k) % items.length]);

  return (
    <div className="relative">
      <div className="relative h-[420px] w-full max-w-sm mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.9, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: 30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
            style={{ perspective: '1200px' }}
          >
            <Link to="/ai-tools" className="block w-full h-full">
              <Card tool={current} />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating thumbnails preview */}
      <div className="mt-5 flex justify-center gap-2 overflow-hidden">
        {strip.map((t, k) => (
          <button
            key={`${t.id}-${k}`}
            onClick={() => setIdx((idx + k) % items.length)}
            className={`relative w-12 h-12 rounded-lg overflow-hidden bg-white/90 border transition-all ${
              k === 0 ? 'border-primary scale-110 shadow-[0_0_20px_hsl(var(--primary)/0.5)]' : 'border-white/10 opacity-60'
            }`}
            aria-label={t.name}
          >
            <img src={proxyImage(t.image, 120)} alt="" className="w-full h-full object-contain p-1" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default AiToolsShowcase;

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import { useAiTools, proxyImage } from '@/hooks/useAiTools';

const RADIUS = 460; // px — orbit radius
const COUNT = 12;

const AiToolsShowcase = () => {
  const { data, isLoading } = useAiTools();
  const [hovering, setHovering] = useState(false);

  const items = useMemo(() => (data || []).slice(0, COUNT), [data]);

  if (!isLoading && items.length === 0) return null;

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Ambient glow */}
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
              Twelve hand-picked AI subscriptions, floating through space. Hover to pause, click any card to grab it.
            </p>
          </div>
          <Link
            to="/ai-tools"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
          >
            Explore all AI tools <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Stage */}
        <div
          className="relative h-[520px] md:h-[600px] w-full select-none"
          style={{ perspective: '1600px' }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* Floor reflection ring */}
          <div className="absolute left-1/2 bottom-10 -translate-x-1/2 w-[760px] max-w-[95vw] h-10 rounded-[50%] bg-primary/20 blur-2xl" />

          <motion.div
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: hovering ? 0 : 360 }}
            transition={{
              duration: 48,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            {items.map((tool, i) => {
              const angle = (i / items.length) * 360;
              return (
                <Link
                  key={tool.id}
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
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 4 + (i % 5) * 0.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.15,
                    }}
                    className="w-full h-full rounded-2xl overflow-hidden bg-card/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.4)] group-hover:border-primary/60 group-hover:shadow-[0_30px_80px_-10px_hsl(var(--primary)/0.7)] transition-all duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-white/95 overflow-hidden">
                      <img
                        src={proxyImage(tool.image, 400)}
                        alt={tool.name}
                        loading="lazy"
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
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
                    {/* Meta */}
                    <div className="flex-1 p-3 flex flex-col justify-between bg-gradient-to-b from-card/60 to-card/90">
                      <div>
                        <h3 className="font-display text-sm font-bold text-foreground line-clamp-2 leading-tight">
                          {tool.name}
                        </h3>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{tool.validity}</p>
                      </div>
                      <div className="flex items-end justify-between mt-2">
                        <span className="text-primary font-bold text-base">₹{tool.price}</span>
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

          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none z-20" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none z-20" />
        </div>
      </div>
    </section>
  );
};

export default AiToolsShowcase;

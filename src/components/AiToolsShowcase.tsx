import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useAiTools, type AiTool } from '@/hooks/useAiTools';
import { metaForTool, type ToolMeta } from '@/data/aiToolMeta';
import { popularityFor } from '@/data/aiToolPopularity';
import { slugifyAiTool } from '@/lib/aiToolSeo';

/**
 * Resilient logo image with the same multi-source fallback chain used on the
 * /ai-tools catalog: curated SVG override → Clearbit hi-res → Google favicon
 * → sheet image (weserv proxy) → site logo. Advances on each onError so a
 * single broken source doesn't drop us straight to the placeholder.
 */
function ShowcaseLogo({ tool, meta }: { tool: AiTool; meta: ToolMeta }) {
  const sources = useMemo(() => {
    const out: string[] = [];
    if (meta.logo) out.push(meta.logo);
    if (meta.domain) {
      out.push(`https://logo.clearbit.com/${meta.domain}?size=256`);
      out.push(`https://www.google.com/s2/favicons?domain=${meta.domain}&sz=256`);
    }
    if (tool.image) {
      out.push(
        `https://images.weserv.nl/?url=${encodeURIComponent(tool.image.replace(/^https?:\/\//, ''))}&w=256&h=256&fit=contain&output=webp&q=85`,
      );
    }
    out.push('/logo.png');
    return out;
  }, [tool.image, meta.logo, meta.domain]);

  const [idx, setIdx] = useState(0);
  const src = sources[Math.min(idx, sources.length - 1)];

  return (
    <img
      key={src}
      src={src}
      alt={`${tool.name} logo`}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className="max-w-[78%] max-h-[78%] object-contain"
      onError={() => setIdx((i) => Math.min(i + 1, sources.length - 1))}
    />
  );
}

/**
 * Home-page AI Tools showcase with realtime 3-D parallax: the grid container
 * tracks the cursor and rotates on X/Y axes, individual tiles lift on
 * translateZ on hover. preserve-3d on the container preserves depth so child
 * transforms compound with the parent rotation.
 */
const AiToolsShowcase = () => {
  const { data: tools = [] } = useAiTools();

  const featured = useMemo(() => {
    return [...tools]
      .sort((a, b) => popularityFor(b.name) - popularityFor(a.name))
      .slice(0, 8);
  }, [tools]);

  // Mouse-tracked tilt
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 14, y: -6 });

  const handleMove = (e: React.MouseEvent) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    // Tilt range: ±18° on Y (left/right) and rest at ~10-22° on X (front/back)
    setTilt({ x: 16 - py * 16, y: -px * 22 });
  };
  const handleLeave = () => setTilt({ x: 14, y: -6 });

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Ambient gradient backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[600px] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,hsl(var(--background))_92%)]" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative">
        {/* Heading */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary bg-primary/10 border border-primary/30 px-4 py-1.5 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> New on Dreamcrest
          </div>
          <h2 className="font-display font-black text-4xl md:text-6xl text-foreground mb-4 leading-[1.05]">
            Premium <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">AI Tools</span>
            <br className="hidden md:block" />
            at India's Cheapest Prices
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            ChatGPT Plus, Lovable Pro, Figma, Replit, Gamma, Manus & {tools.length > 0 ? `${Math.max(tools.length - 6, 90)}+` : '90+'} more
            — genuine private subscriptions, delivered instantly.
          </p>
        </div>

        {/* 3-D perspective tile grid — mouse-tracked tilt */}
        <div
          ref={stageRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="relative mb-12 mx-auto max-w-5xl"
          style={{ perspective: '1400px' }}
        >
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 transition-transform duration-300 ease-out will-change-transform"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
          >
            {(featured.length > 0
              ? featured
              : (Array.from({ length: 8 }) as Array<AiTool | null>)
            ).map((t, i) => {
              const meta = t ? metaForTool(t.name) : null;
              const href = t ? `/ai-tool/${slugifyAiTool(t.name)}` : '/ai-tools';
              const delay = `${i * 60}ms`;
              return (
                <Link
                  key={t?.id || `ph-${i}`}
                  to={href}
                  className="group relative aspect-square rounded-2xl bg-card/70 backdrop-blur-md border border-border/60 overflow-hidden hover:border-primary/60 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.5)] animate-fade-in will-change-transform"
                  style={{
                    animationDelay: delay,
                    transformStyle: 'preserve-3d',
                    transform: 'translateZ(0)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform =
                      'translateZ(60px) scale(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = 'translateZ(0) scale(1)';
                  }}
                >
                  {/* Brand color halo */}
                  <div
                    className="absolute inset-0 opacity-40 group-hover:opacity-80 transition-opacity duration-500"
                    style={{
                      background: meta
                        ? `radial-gradient(circle at 50% 40%, ${meta.color}66, transparent 70%)`
                        : 'radial-gradient(circle at 50% 40%, hsl(var(--primary)/0.3), transparent 70%)',
                    }}
                  />
                  {/* Logo */}
                  <div className="absolute inset-0 flex items-center justify-center p-5">
                    {t && meta ? (
                      <div className="w-full h-full rounded-xl bg-white/95 backdrop-blur flex items-center justify-center p-3 shadow-lg">
                        <ShowcaseLogo tool={t} meta={meta} />
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-xl bg-muted/50 animate-pulse" />
                    )}
                  </div>
                  {/* Name pill */}
                  {t && (
                    <div className="absolute bottom-2 left-2 right-2 bg-background/85 backdrop-blur border border-border text-foreground text-[10px] md:text-xs font-semibold px-2 py-1 rounded-md text-center truncate">
                      {t.name}
                    </div>
                  )}
                  {/* Hover shine */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Big CTA */}
        <div className="flex justify-center">
          <Link
            to="/ai-tools"
            className="group relative inline-flex items-center gap-3 md:gap-4 px-8 md:px-12 py-5 md:py-6 rounded-2xl font-display font-black text-base md:text-xl tracking-wider text-primary-foreground bg-gradient-to-r from-primary via-orange-500 to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-700 shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.7)] hover:shadow-[0_30px_80px_-15px_hsl(var(--primary)/0.9)] hover:-translate-y-1 hover:scale-[1.03] active:scale-100"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-orange-400 to-primary opacity-50 blur-xl group-hover:opacity-80 transition-opacity duration-500 -z-10" />
            <Zap className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" />
            EXPLORE LATEST AI TOOLS
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-5">
          Updated weekly · 100+ tools · Instant email delivery · 24/7 WhatsApp support
        </p>
      </div>
    </section>
  );
};

export default AiToolsShowcase;

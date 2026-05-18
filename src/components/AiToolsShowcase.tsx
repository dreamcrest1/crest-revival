import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
    out.push('/logo.png');
    return out;
  }, [meta.logo]);


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
      className="max-w-[92%] max-h-[92%] object-contain"
      onError={() => setIdx((i) => Math.min(i + 1, sources.length - 1))}
    />
  );
}

const FALLBACK_TOOL_NAMES = [
  'ChatGPT Plus',
  'Lovable Pro',
  'Figma Professional',
  'Replit Core',
  'Gamma Pro',
  'Manus AI Pro',
  'Canva Pro',
  'Perplexity Pro',
];

const EMPTY_TOOLS: AiTool[] = [];

function shuffleTools(items: AiTool[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/**
 * Home-page AI Tools showcase with realtime 3-D parallax: the grid container
 * tracks the cursor and rotates on X/Y axes, individual tiles lift on
 * translateZ on hover. preserve-3d on the container preserves depth so child
 * transforms compound with the parent rotation.
 */
const AiToolsShowcase = () => {
  const { data } = useAiTools();
  const tools = data ?? EMPTY_TOOLS;

  const fallbackTools = useMemo<AiTool[]>(
    () =>
      FALLBACK_TOOL_NAMES.map((name, idx) => ({
        id: `fallback-${idx}-${slugifyAiTool(name)}`,
        name,
        validity: '',
        price: 0,
        image: '',
        symbol: name.slice(0, 4).toUpperCase(),
        change: 0,
        trend: 'flat',
        spark: [],
        meta: metaForTool(name),
      })),
    [],
  );

  // Full unique product pool (deduped by name) so every shuffle pulls from all
  // tools while preventing duplicates from showing in the same 8-card instance.
  const pool = useMemo(() => {
    const seen = new Set<string>();
    const unique: AiTool[] = [];
    for (const t of [...tools].sort(
      (a, b) => popularityFor(b.name) - popularityFor(a.name),
    )) {
      const key = t.name.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(t);
    }
    return unique;
  }, [tools]);

  const [isShufflePaused, setIsShufflePaused] = useState(false);
  const [shuffledPool, setShuffledPool] = useState<AiTool[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setShuffledPool(shuffleTools(pool));
    setPage(0);
  }, [pool]);

  useEffect(() => {
    if (pool.length <= 8 || isShufflePaused) return;
    const id = setInterval(() => {
      setPage((currentPage) => {
        const totalPages = Math.max(1, Math.ceil(pool.length / 8));
        const nextPage = (currentPage + 1) % totalPages;
        if (nextPage === 0) setShuffledPool(shuffleTools(pool));
        return nextPage;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [isShufflePaused, pool]);

  const featured = useMemo(() => {
    const activePool = shuffledPool.length > 0 ? shuffledPool : fallbackTools;
    const count = Math.min(8, activePool.length);
    const start = (page * count) % activePool.length;
    return Array.from({ length: count }, (_, i) => activePool[(start + i) % activePool.length]);
  }, [fallbackTools, page, shuffledPool]);

  // ── Realtime 3-D parallax ──
  // Mouse / touch updates a *target* tilt; a requestAnimationFrame loop lerps
  // the *current* tilt toward it each frame and writes it straight to the
  // DOM (transform style). Skipping React state on the hot path eliminates
  // re-render jitter and keeps the motion buttery at 60fps.
  const stageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 14, y: -6 });
  const current = useRef({ x: 14, y: -6 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      // Critically-damped lerp — 0.12 = quick but smooth catch-up
      current.current.x += (target.current.x - current.current.x) * 0.12;
      current.current.y += (target.current.y - current.current.y) * 0.12;
      if (gridRef.current) {
        gridRef.current.style.transform = `rotateX(${current.current.x.toFixed(2)}deg) rotateY(${current.current.y.toFixed(2)}deg)`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const updateFromPoint = (clientX: number, clientY: number) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (clientX - r.left) / r.width - 0.5; // -0.5..0.5
    const py = (clientY - r.top) / r.height - 0.5;
    target.current = { x: 16 - py * 18, y: -px * 24 };
  };

  const handleMove = (e: React.MouseEvent) => updateFromPoint(e.clientX, e.clientY);
  const handleTouch = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    updateFromPoint(t.clientX, t.clientY);
  };
  const handleLeave = () => {
    target.current = { x: 14, y: -6 };
  };

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

        {/* 3-D perspective tile grid — realtime mouse + touch parallax */}
        <div
          ref={stageRef}
          onMouseEnter={() => setIsShufflePaused(true)}
          onMouseMove={handleMove}
          onMouseLeave={() => {
            setIsShufflePaused(false);
            handleLeave();
          }}
          onTouchStart={(e) => {
            setIsShufflePaused(true);
            handleTouch(e);
          }}
          onTouchMove={handleTouch}
          onTouchEnd={() => {
            setIsShufflePaused(false);
            handleLeave();
          }}
          onTouchCancel={() => {
            setIsShufflePaused(false);
            handleLeave();
          }}
          className="relative mb-12 mx-auto max-w-5xl touch-pan-y select-none"
          style={{ perspective: '1400px' }}
        >
          <div
            ref={gridRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 will-change-transform"
            style={{ transformStyle: 'preserve-3d' }}
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
                  key={`slot-${i}-${t?.id ?? 'ph'}`}
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
                  <div className="absolute inset-0 flex items-center justify-center p-3">
                    {t && meta ? (
                      <div className="w-full h-full rounded-xl bg-white/95 backdrop-blur flex items-center justify-center p-1.5 shadow-lg">
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

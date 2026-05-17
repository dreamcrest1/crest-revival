import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAiTools, type AiTool } from '@/hooks/useAiTools';
import { metaForTool, type ToolMeta } from '@/data/aiToolMeta';
import { popularityFor } from '@/data/aiToolPopularity';
import { slugifyAiTool } from '@/lib/aiToolSeo';

/* ────────────────────────────────────────────────────────────────────────
 * Resilient logo with the same multi-source chain as the catalog:
 * curated SVG → Clearbit → Google favicon → sheet image (weserv proxy)
 * → site logo. Advances on each onError.
 * ──────────────────────────────────────────────────────────────────────── */
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
      className="max-w-[88%] max-h-[88%] object-contain"
      onError={() => setIdx((i) => Math.min(i + 1, sources.length - 1))}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Globe layout: N tiles distributed evenly on a sphere via the Fibonacci
 * lattice. Each tile is positioned with `rotateY(lon) rotateX(lat)
 * translateZ(R)` so it faces outward. The parent group continuously spins
 * via requestAnimationFrame; pointer drag adds delta rotation, and the
 * spin smoothly resumes from where the user let go.
 * ──────────────────────────────────────────────────────────────────────── */
const TILE_COUNT = 28;

const AiToolsShowcase = () => {
  const { data: tools = [] } = useAiTools();

  // Deduped pool of top-popularity tools, padded to TILE_COUNT by recycling.
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

  // Shuffle visible-window every 3s for the "live catalog" feel.
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (pool.length <= TILE_COUNT) return;
    const id = setInterval(() => setOffset((o) => (o + 1) % pool.length), 3000);
    return () => clearInterval(id);
  }, [pool.length]);

  const featured = useMemo(() => {
    if (pool.length === 0) return [];
    return Array.from({ length: TILE_COUNT }, (_, i) => pool[(offset + i) % pool.length]);
  }, [pool, offset]);

  // ── Fibonacci sphere positions (lat/lon in degrees) ──
  const positions = useMemo(() => {
    const out: { lat: number; lon: number }[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < TILE_COUNT; i++) {
      const y = 1 - (i / (TILE_COUNT - 1)) * 2; // 1 → -1
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const lat = (Math.asin(y) * 180) / Math.PI;     // -90..90
      const lon = (Math.atan2(x, z) * 180) / Math.PI; // -180..180
      out.push({ lat, lon });
    }
    return out;
  }, []);

  // ── Continuous auto-spin + pointer drag ──
  const sphereRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rot = useRef({ x: -15, y: 0 });           // current rotation (deg)
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const autoSpin = useRef(0.18);                  // deg per frame on Y axis
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      if (!dragging.current) {
        rot.current.y += autoSpin.current;
        // Slow easing of X back toward -15 when not dragging
        rot.current.x += (-15 - rot.current.x) * 0.04;
      }
      if (sphereRef.current) {
        sphereRef.current.style.transform = `rotateX(${rot.current.x.toFixed(2)}deg) rotateY(${rot.current.y.toFixed(2)}deg)`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const onDown = (clientX: number, clientY: number) => {
    dragging.current = true;
    last.current = { x: clientX, y: clientY };
  };
  const onMove = (clientX: number, clientY: number) => {
    if (!dragging.current) return;
    const dx = clientX - last.current.x;
    const dy = clientY - last.current.y;
    rot.current.y += dx * 0.35;
    rot.current.x = Math.max(-70, Math.min(70, rot.current.x - dy * 0.35));
    last.current = { x: clientX, y: clientY };
  };
  const onUp = () => {
    dragging.current = false;
  };

  // Globe radius scales with viewport; sized at runtime via ResizeObserver
  const [radius, setRadius] = useState(280);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      setRadius(Math.max(180, Math.min(360, w * 0.34)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const tileSize = Math.round(radius * 0.42);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Ambient backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[700px] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,hsl(var(--background))_92%)]" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative">
        {/* Heading */}
        <div className="text-center mb-10 animate-fade-in">
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
          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground/70">
            Drag the globe · auto-rotates · {pool.length || '100+'} tools in orbit
          </p>
        </div>

        {/* 3-D Globe stage */}
        <div
          ref={stageRef}
          className="relative mx-auto mb-12 select-none touch-none cursor-grab active:cursor-grabbing"
          style={{
            width: 'min(720px, 92vw)',
            height: 'min(720px, 92vw)',
            perspective: '1400px',
          }}
          onMouseDown={(e) => onDown(e.clientX, e.clientY)}
          onMouseMove={(e) => onMove(e.clientX, e.clientY)}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={(e) => {
            const t = e.touches[0];
            if (t) onDown(t.clientX, t.clientY);
          }}
          onTouchMove={(e) => {
            const t = e.touches[0];
            if (t) onMove(t.clientX, t.clientY);
          }}
          onTouchEnd={onUp}
        >
          {/* Equator glow ring */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.25),transparent_55%)] blur-2xl pointer-events-none" />
          {/* Subtle planet shell */}
          <div className="absolute inset-[8%] rounded-full border border-primary/15 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.08),transparent_70%)] pointer-events-none" />

          {/* Spinning sphere */}
          <div
            ref={sphereRef}
            className="absolute inset-0 will-change-transform"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {(featured.length > 0
              ? featured
              : (Array.from({ length: TILE_COUNT }) as Array<AiTool | null>)
            ).map((t, i) => {
              const meta = t ? metaForTool(t.name) : null;
              const { lat, lon } = positions[i];
              const href = t ? `/ai-tool/${slugifyAiTool(t.name)}` : '/ai-tools';
              return (
                <Link
                  key={`slot-${i}-${t?.id ?? 'ph'}`}
                  to={href}
                  onClick={(e) => {
                    // Suppress click if the user actually dragged the globe
                    if (Math.abs(rot.current.y) > 0 && dragging.current) e.preventDefault();
                  }}
                  className="group absolute top-1/2 left-1/2 animate-fade-in"
                  style={{
                    width: tileSize,
                    height: tileSize,
                    marginLeft: -tileSize / 2,
                    marginTop: -tileSize / 2,
                    transform: `rotateY(${lon}deg) rotateX(${-lat}deg) translateZ(${radius}px)`,
                    transformStyle: 'preserve-3d',
                    animationDelay: `${i * 35}ms`,
                  }}
                >
                  {/* Brand halo */}
                  <div
                    className="absolute -inset-2 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: meta
                        ? `radial-gradient(circle at 50% 50%, ${meta.color}99, transparent 70%)`
                        : 'radial-gradient(circle at 50% 50%, hsl(var(--primary)/0.5), transparent 70%)',
                    }}
                  />
                  {/* White logo card */}
                  <div className="relative w-full h-full rounded-2xl bg-white border border-white/40 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-110">
                    {t && meta ? (
                      <ShowcaseLogo tool={t} meta={meta} />
                    ) : (
                      <div className="w-full h-full bg-muted/50 animate-pulse rounded-xl" />
                    )}
                  </div>
                  {/* Name pill — only visible on hover so the globe stays clean */}
                  {t && (
                    <span
                      className="absolute left-1/2 -translate-x-1/2 -bottom-7 whitespace-nowrap text-[10px] uppercase font-bold tracking-[0.15em] text-foreground bg-background/90 backdrop-blur border border-border px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                    >
                      {t.name}
                    </span>
                  )}
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

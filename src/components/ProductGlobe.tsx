import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useAiTools } from '@/hooks/useAiTools';
import { popularityFor } from '@/data/aiToolPopularity';
import { metaForTool } from '@/data/aiToolMeta';
import { slugifyAiTool } from '@/lib/aiToolSeo';

const iconify = (slug: string, color: string) => `https://api.iconify.design/simple-icons/${slug}.svg?color=%23${color}`;

const GLOBE_ICON_OVERRIDES: Record<string, string> = {
  'adobe.com': iconify('adobecreativecloud', 'DA1F26'),
  'clickup.com': iconify('clickup', '7B68EE'),
  'figma.com': iconify('figma', 'F24E1E'),
  'flutterflow.io': iconify('flutter', '02569B'),
  'intercom.com': iconify('intercom', '1F8DED'),
  'linear.app': iconify('linear', '5E6AD2'),
  'loom.com': iconify('loom', '625DF5'),
  'miro.com': iconify('miro', 'FFD02F'),
  'mongodb.com': iconify('mongodb', '47A248'),
  'notion.so': iconify('notion', '000000'),
  'perplexity.ai': iconify('perplexity', '1FB8CD'),
  'posthog.com': iconify('posthog', 'FF5C00'),
  'replit.com': iconify('replit', 'F26207'),
  'supabase.com': iconify('supabase', '3ECF8E'),
  'webflow.com': iconify('webflow', '146EF5'),
};

/** Proxy any url through weserv as a clean square — CORS-safe + crisp for WebGL textures. */
function weservSquare(src: string, size = 512): string {
  if (!src) return '';
  const stripped = src.replace(/^https?:\/\//, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(stripped)}&w=${size}&h=${size}&fit=contain&output=webp&q=90`;
}

/** Same multi-source fallback chain as the /ai-tools BrandLogo, proxied for WebGL. */
function logoSourcesForTool(name: string, image: string): string[] {
  const meta = metaForTool(name);
  const raw: string[] = [];
  const override = meta.domain ? GLOBE_ICON_OVERRIDES[meta.domain] : '';
  if (override) raw.push(override);
  if (meta.logo) raw.push(meta.logo);
  if (meta.domain) {
    raw.push(`https://logo.clearbit.com/${meta.domain}?size=512`);
    raw.push(`https://www.google.com/s2/favicons?domain=${meta.domain}&sz=256`);
  }
  if (image) raw.push(image);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of raw) {
    if (!u || seen.has(u)) continue;
    seen.add(u);
    out.push(weservSquare(u, 512));
  }
  return out;
}

const GlobeCanvas = lazy(() => import('./ProductGlobeCanvas'));

export type GlobeItem = {
  name: string;
  images: string[];
  href: string;
};

function useGlobeItems(isMobile: boolean): GlobeItem[] {
  const { data: aiTools } = useAiTools();

  return useMemo(() => {
    const seenName = new Set<string>();
    const out: GlobeItem[] = [];

    const tools = [...(aiTools ?? [])].sort((a, b) => popularityFor(b.name) - popularityFor(a.name));
    for (const t of tools) {
      const nameKey = t.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!nameKey || seenName.has(nameKey)) continue;
      const images = logoSourcesForTool(t.name, t.image);
      if (images.length === 0) continue;
      seenName.add(nameKey);
      out.push({
        name: t.name.trim(),
        images,
        href: `/ai-tool/${slugifyAiTool(t.name)}`,
      });
    }

    return out.slice(0, isMobile ? 48 : 96);
  }, [aiTools, isMobile]);
}

const ProductGlobe = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const { ref, inView } = useInView({ rootMargin: '200px', triggerOnce: false });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMq = () => setIsMobile(mq.matches);
    const updateRm = () => setReduced(rm.matches);
    updateMq();
    updateRm();
    mq.addEventListener('change', updateMq);
    rm.addEventListener('change', updateRm);
    return () => {
      mq.removeEventListener('change', updateMq);
      rm.removeEventListener('change', updateRm);
    };
  }, []);

  const items = useGlobeItems(isMobile);

  const handleSelect = (href: string) => navigate(href);

  return (
    <section
      ref={ref}
      className="relative w-full pt-28 sm:pt-32 pb-12 sm:pb-16 overflow-hidden"
      aria-label="Explore Our Universe of Tools"
    >
      <div className="text-center mb-6 sm:mb-10 px-4">
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground">
          Explore Our <span className="text-primary">Universe of Tools</span>
        </h2>
      </div>

      <div
        className="relative w-full mx-auto"
        style={{ height: isMobile ? 285 : 560, maxWidth: 1100 }}
      >
        {/* Radial backdrop to dim background bleed-through */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, hsl(var(--background) / 0.85) 0%, hsl(var(--background) / 0.55) 45%, transparent 75%)',
          }}
        />
        <div className="relative w-full h-full">
        {reduced || items.length === 0 ? (
          <GlobeSkeleton />
        ) : inView ? (
          <Suspense fallback={<GlobeSkeleton />}>
            <motion.div
              key="globe"
              className="w-full h-full"
              initial={{ opacity: 0, scale: 0.85, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlobeCanvas
                items={items}
                isMobile={isMobile}
                onSelect={handleSelect}
              />
            </motion.div>
          </Suspense>
        ) : (
          <GlobeSkeleton />
        )}
        </div>
      </div>

      <div className="flex justify-center mt-6 sm:mt-8 px-4">
        <button
          onClick={() => navigate('/ai-tools')}
          className="group relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm sm:text-base shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
        >
          <span>Explore AI Tools</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </section>
  );
};

const GlobeSkeleton = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-48 h-48 sm:w-64 sm:h-64">
      <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse" />
      <div className="absolute inset-4 rounded-full border border-primary/10" />
      <div className="absolute inset-8 rounded-full border border-primary/5" />
      <div className="absolute inset-0 rounded-full bg-primary/5 blur-2xl" />
    </div>
  </div>
);

export default ProductGlobe;

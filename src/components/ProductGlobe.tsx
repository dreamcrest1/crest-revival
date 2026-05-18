import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useAiTools } from '@/hooks/useAiTools';
import { popularityFor } from '@/data/aiToolPopularity';
import { metaForTool } from '@/data/aiToolMeta';
import { slugifyAiTool } from '@/lib/aiToolSeo';

const GLOBE_ICON_OVERRIDES: Record<string, string> = {
  'adobe.com': 'https://cdn.simpleicons.org/adobecreativecloud/DA1F26',
  'clickup.com': 'https://cdn.simpleicons.org/clickup/7B68EE',
  'figma.com': 'https://cdn.simpleicons.org/figma/F24E1E',
  'flutterflow.io': 'https://cdn.simpleicons.org/flutter/02569B',
  'intercom.com': 'https://cdn.simpleicons.org/intercom/1F8DED',
  'linear.app': 'https://cdn.simpleicons.org/linear/5E6AD2',
  'loom.com': 'https://cdn.simpleicons.org/loom/625DF5',
  'miro.com': 'https://cdn.simpleicons.org/miro/FFD02F',
  'mongodb.com': 'https://cdn.simpleicons.org/mongodb/47A248',
  'notion.so': 'https://cdn.simpleicons.org/notion/000000',
  'perplexity.ai': 'https://cdn.simpleicons.org/perplexity/1FB8CD',
  'posthog.com': 'https://cdn.simpleicons.org/posthog/FF5C00',
  'replit.com': 'https://cdn.simpleicons.org/replit/F26207',
  'roboform.com': 'https://cdn.simpleicons.org/roboform/0079FF',
  'supabase.com': 'https://cdn.simpleicons.org/supabase/3ECF8E',
  'webflow.com': 'https://cdn.simpleicons.org/webflow/146EF5',
};

/** WebGL needs CORS-safe logo textures; keep the same source order as /ai-tools. */
function proxiedSquareLogo(src: string, size = 256): string {
  if (!src) return '';
  const stripped = src.replace(/^https?:\/\//, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(stripped)}&w=${size}&h=${size}&fit=contain&output=webp&q=85`;
}

function logoSourcesForTool(name: string): string[] {
  const meta = metaForTool(name);
  const sources: string[] = [];
  if (meta.logo) {
    sources.push(meta.logo);
    if (/^https?:\/\//.test(meta.logo)) sources.push(proxiedSquareLogo(meta.logo, 256));
  }
  if (meta.domain) {
    if (GLOBE_ICON_OVERRIDES[meta.domain]) sources.unshift(GLOBE_ICON_OVERRIDES[meta.domain]);
    sources.push(proxiedSquareLogo(`https://${meta.domain}/favicon.svg`, 256));
    sources.push(proxiedSquareLogo(`https://www.google.com/s2/favicons?domain=${meta.domain}&sz=256`, 256));
    sources.push(proxiedSquareLogo(`https://${meta.domain}/apple-touch-icon.png`, 256));
  }
  return Array.from(new Set(sources.filter(Boolean)));
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
    const seenImg = new Set<string>();
    const out: GlobeItem[] = [];
    const push = (it: GlobeItem) => {
      const nameKey = it.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const imgKey = it.images[0]?.toLowerCase().trim() ?? '';
      if (!nameKey || !imgKey) return;
      if (seenName.has(nameKey) || seenImg.has(imgKey)) return;
      seenName.add(nameKey);
      seenImg.add(imgKey);
      out.push(it);
    };

    const tools = [...(aiTools ?? [])].sort((a, b) => popularityFor(b.name) - popularityFor(a.name));
    tools.forEach((t) =>
      push({
        name: t.name.trim(),
        images: logoSourcesForTool(t.name),
        href: `/ai-tool/${slugifyAiTool(t.name)}`,
      }),
    );

    return out.slice(0, isMobile ? 30 : 60);
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
        <p className="text-muted-foreground text-sm sm:text-base mt-2">
          Drag to spin · Tap a logo to open
        </p>
      </div>

      <div
        className="relative w-full mx-auto"
        style={{ height: isMobile ? 380 : 560, maxWidth: 1100 }}
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
            <GlobeCanvas
              items={items}
              isMobile={isMobile}
              onSelect={handleSelect}
            />
          </Suspense>
        ) : (
          <GlobeSkeleton />
        )}
        </div>
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

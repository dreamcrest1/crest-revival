import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useAiTools } from '@/hooks/useAiTools';
import { slugifyAiTool } from '@/lib/aiToolSeo';
import { GLOBE_LOGOS, type GlobeLogo } from '@/data/globeLogos';

const GlobeCanvas = lazy(() => import('./ProductGlobeCanvas'));

export type GlobeItem = {
  name: string;
  image: string;
  meta: GlobeLogo;
};

const ProductGlobe = () => {
  const navigate = useNavigate();
  const { data: aiTools } = useAiTools();
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

  const items: GlobeItem[] = useMemo(
    () => GLOBE_LOGOS.map((m) => ({ name: m.name, image: m.image, meta: m })),
    [],
  );

  /** Resolve the destination href for a clicked logo. */
  const resolveHref = (logo: GlobeLogo): string => {
    if (logo.kind === 'ott') {
      return logo.productSlug ? `/product/${logo.productSlug}` : '/products';
    }
    // AI / SaaS — find a matching tool name in the live sheet
    if (aiTools && aiTools.length) {
      const candidates = [logo.name, ...(logo.aliases ?? [])].map((c) => c.toLowerCase());
      const match = aiTools.find((t) => {
        const n = t.name.toLowerCase();
        return candidates.some((c) => n === c || n.includes(c) || c.includes(n));
      });
      if (match) return `/ai-tool/${slugifyAiTool(match.name)}`;
    }
    return '/ai-tools';
  };

  const handleSelect = (logo: GlobeLogo) => navigate(resolveHref(logo));

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
        className="relative mx-auto flex items-center justify-center"
        style={{ height: isMobile ? 320 : 620, width: '100%', maxWidth: 1100 }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {reduced || items.length === 0 ? (
            <GlobeSkeleton />
          ) : inView ? (
            <Suspense fallback={<GlobeSkeleton />}>
              <motion.div
                key="globe"
                className="w-full h-full"
                style={{ transformOrigin: '50% 50%' }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
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
            <path d="M5 12h14M13 5l7 7-7 7" />
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

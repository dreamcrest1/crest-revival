import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const GlobeCanvas = lazy(() => import('./ProductGlobeCanvas'));

export type GlobeItem = {
  name: string;
  images: string[];
  href: string;
};

// Uploaded brand logos placed in /public/globe-logos
const LOGO_FILES = [
  '2.png','3.png','4.png','5.png','6.png','7.png','8.png','9.png','10.png',
  '11.png','12.png','13.png','14.png','15.png','16.png','17.png','18.png',
  '20.png','21.png','23.png','24.png','25.png','26.png','27.png','28.png',
  '30.png','31.png','32.png','33.png','34.png','35.png','36.png','37.png',
  '38.png','39.png',
  'chatgpt.png','replit logo.png','supabase.png','wondershare filmora.png','youtube.png',
];

function useGlobeItems(isMobile: boolean): GlobeItem[] {
  return useMemo(() => {
    const items: GlobeItem[] = LOGO_FILES.map((f) => ({
      name: f.replace(/\.png$/i, ''),
      images: [`/globe-logos/${encodeURIComponent(f)}`],
      href: '/ai-tools',
    }));
    return isMobile ? items.slice(0, 30) : items;
  }, [isMobile]);
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

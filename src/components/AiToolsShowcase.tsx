import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, Star } from 'lucide-react';
import { useAiTools, type AiTool } from '@/hooks/useAiTools';
import { BrandLogo } from '@/components/ai/BrandLogo';
import { slugifyAiTool } from '@/lib/aiToolSeo';

function baseKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(\d+\s*(month|months|mo|year|years|yr|day|days|week|weeks))\b/g, '')
    .replace(/\b(pro|plus|premium|basic|standard|lifetime|trial)\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function pickUnique(pool: AiTool[], n: number): AiTool[] {
  const seen = new Set<string>();
  const out: AiTool[] = [];
  const pinned = pool.find(
    (t) => /claude/i.test(t.name) && /pro/i.test(t.name) && /1\s*month/i.test(t.validity) && t.price === 1800,
  );
  if (pinned) {
    out.push(pinned);
    seen.add(baseKey(pinned.name));
  }
  for (const t of pool) {
    if (out.length >= n) break;
    if (pinned && t.id === pinned.id) continue;
    const k = baseKey(t.name);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out;
}

const AiCard = ({ tool }: { tool: AiTool }) => (
  <Link
    to={`/ai-tool/${slugifyAiTool(tool.name)}`}
    className="group relative shrink-0 snap-start flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
    style={{
      width: 240,
      background:
        'linear-gradient(180deg, hsl(240 18% 9%) 0%, rgba(26,16,38,0.9) 100%)',
      borderRadius: 12,
      border: '1px solid rgba(201,168,76,0.15)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    }}
  >
    {/* Scroll ribbon corner */}
    <div
      className="absolute top-0 right-0 w-12 h-12 flex items-start justify-end pt-1 pr-1"
      style={{
        background:
          'linear-gradient(225deg, #C9A84C 50%, transparent 50%)',
        clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
      }}
    >
      <Star className="w-3 h-3 fill-current" style={{ color: '#0A0A0F' }} />
    </div>

    {/* Logo with gold ring */}
    <div className="pt-8 pb-4 flex justify-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-white"
        style={{ border: '2px solid #C9A84C', boxShadow: '0 0 16px rgba(201,168,76,0.25)' }}
      >
        <BrandLogo t={tool} compact />
      </div>
    </div>

    <div className="px-4 pb-4 flex-1 flex flex-col items-center text-center">
      <h3 className="font-display text-base font-bold mb-2 line-clamp-2 min-h-[44px]" style={{ color: '#F0EAD6' }}>
        {tool.name}
      </h3>
      <span
        className="inline-block px-2 py-0.5 rounded text-[10px] font-medium mb-3"
        style={{ background: '#2A1E3F', color: '#9B77D4' }}
      >
        {tool.symbol}
      </span>
      <div className="flex-1" />
      <div className="font-display text-2xl font-bold mb-1" style={{ color: '#C9A84C' }}>
        ₹{tool.price}
      </div>
      <p className="text-xs mb-4" style={{ color: '#8A8AA0' }}>{tool.validity}</p>

      <div
        className="w-full text-center text-xs font-semibold py-2 rounded transition-all group-hover:bg-[#C9A84C] group-hover:text-[#0A0A0F]"
        style={{
          background: 'transparent',
          border: '1px solid #C9A84C',
          color: '#C9A84C',
        }}
      >
        View Deal
      </div>
    </div>
  </Link>
);

const AiToolsShowcase = () => {
  const { data, isLoading } = useAiTools();
  const items = pickUnique(data || [], 14);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    scrollerRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  if (!isLoading && items.length === 0) return null;

  return (
    <section className="py-16 md:py-20 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 animate-torch-flicker" style={{ color: '#C9A84C' }} />
            <h2 className="font-display">
              <span style={{ color: '#F0EAD6' }}>Premium</span>{' '}
              <span className="text-gradient-gold">AI Tools</span>
            </h2>
          </div>
          <Link to="/ai-tools" className="hidden md:inline text-sm font-semibold hover:underline" style={{ color: '#C9A84C' }}>
            Explore all →
          </Link>
        </div>

        <div className="relative">
          {/* Prev/Next */}
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full items-center justify-center transition-all hover:bg-[rgba(201,168,76,0.1)]"
            style={{ border: '1px solid #C9A84C', color: '#C9A84C', background: 'hsl(240 22% 5%)' }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full items-center justify-center transition-all hover:bg-[rgba(201,168,76,0.1)]"
            style={{ border: '1px solid #C9A84C', color: '#C9A84C', background: 'hsl(240 22% 5%)' }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
          >
            {items.map((t) => (
              <AiCard key={t.id} tool={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiToolsShowcase;

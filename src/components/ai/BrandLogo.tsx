import { useState } from 'react';
import { metaForTool } from '@/data/aiToolMeta';
import type { AiTool } from '@/hooks/useAiTools';

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

interface BrandLogoProps {
  t: AiTool;
  compact?: boolean;
}

/**
 * Branded logo tile: brand color background + logo from a fallback chain.
 * Shared between the AI Tools page and the homepage showcase.
 */
export function BrandLogo({ t, compact = false }: BrandLogoProps) {
  const meta = metaForTool(t.name);
  const sources: string[] = [];
  if (meta.logo) sources.push(meta.logo);
  if (meta.domain) {
    sources.push(`https://logo.clearbit.com/${meta.domain}?size=256`);
    sources.push(`https://www.google.com/s2/favicons?domain=${meta.domain}&sz=256`);
  }
  if (t.image) {
    sources.push(
      `https://images.weserv.nl/?url=${encodeURIComponent(t.image.replace(/^https?:\/\//, ''))}&w=400&h=400&fit=contain&output=webp&q=85`,
    );
  }

  const [idx, setIdx] = useState(0);
  const { r, g, b } = hexToRgb(meta.color);
  const bg = {
    background: `radial-gradient(circle at 30% 20%, rgba(${r},${g},${b},0.95), rgba(${r},${g},${b},0.55) 60%, rgba(${r},${g},${b},0.35))`,
  };
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const onDark = luma < 0.55;
  const exhausted = idx >= sources.length;

  return (
    <div
      className={`w-full h-full flex items-center justify-center relative ${compact ? 'p-2' : 'p-6'}`}
      style={bg}
    >
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '14px 14px',
          color: onDark ? '#fff' : '#000',
        }}
      />

      {exhausted ? (
        <span
          className={`font-display font-bold drop-shadow-lg ${onDark ? 'text-white' : 'text-black'} ${compact ? 'text-2xl' : 'text-6xl'}`}
        >
          {t.symbol}
        </span>
      ) : (
        <div
          className={`relative rounded-2xl flex items-center justify-center bg-white/95 backdrop-blur-sm border border-white/40 shadow-sm ${compact ? 'w-[88%] h-[88%]' : 'w-3/4 h-3/4'}`}
        >
          <img
            key={sources[idx]}
            src={sources[idx]}
            alt={`${t.name} logo`}
            width={220}
            height={220}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            draggable={false}
            className="max-w-[80%] max-h-[80%] object-contain"
            onError={() => setIdx((i) => i + 1)}
          />
        </div>
      )}

      {!compact && (
        <div
          className={`absolute bottom-2 left-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur ${
            onDark ? 'bg-white/15 text-white border border-white/20' : 'bg-black/10 text-black/80 border border-black/15'
          }`}
        >
          {meta.category}
        </div>
      )}
    </div>
  );
}

export default BrandLogo;

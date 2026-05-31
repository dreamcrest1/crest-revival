import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AiTool } from '@/hooks/useAiTools';
import { BrandLogo } from '@/components/ai/BrandLogo';
import { slugifyAiTool } from '@/lib/aiToolSeo';

/**
 * "Hanging" tool grid inspired by oimo.io/works.
 *
 * Each tile is a square thumbnail suspended from two thin strings that
 * converge at an "×" anchor above it. The wrapper (strings + tile)
 * rotates together with `transform-origin: top center` so the whole
 * unit swings as one body. Purely CSS — no canvas, no physics engine.
 */

// Stable per-tile randomness so SSR/CSR match and animations don't reseed
// every render. We hash the tool id into a 0..1 float used to derive
// duration + delay for the idle sway.
function hashFloat(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return (h % 1000) / 1000;
}

interface HangingTileProps {
  tool: AiTool;
}

function HangingTile({ tool }: HangingTileProps) {
  const navigate = useNavigate();
  const seed = hashFloat(tool.id);
  // Idle sway: 5.5s – 9s; delay 0 – 4s
  const duration = (5.5 + seed * 3.5).toFixed(2);
  const delay = (seed * 4).toFixed(2);

  return (
    <div className="flex flex-col items-center select-none">
      {/* Anchor × */}
      <div
        aria-hidden="true"
        className="font-mono text-[14px] leading-none text-foreground/45 mb-1"
      >
        ×
      </div>

      {/* Swinging unit: strings + tile rotate together */}
      <div
        className="group relative origin-top animate-sway-idle hover:animate-sway-hover"
        style={{
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      >
        {/* Strings: two diagonal lines from anchor point down to tile corners */}
        <svg
          className="absolute left-1/2 -top-[26px] -translate-x-1/2 pointer-events-none text-foreground/40"
          width="100%"
          height="28"
          viewBox="0 0 100 28"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line x1="50" y1="0" x2="2" y2="28" stroke="currentColor" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
          <line x1="50" y1="0" x2="98" y2="28" stroke="currentColor" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Tile */}
        <button
          type="button"
          onClick={() => navigate(`/ai-tool/${slugifyAiTool(tool.name)}`)}
          className="relative block w-full aspect-square rounded-md overflow-hidden border border-border/70 bg-card shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)] transition-shadow duration-300 group-hover:shadow-[0_14px_36px_-10px_rgba(0,0,0,0.65)] focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={`${tool.name} — open details`}
        >
          <div className="absolute inset-0">
            <BrandLogo t={tool} compact />
          </div>
        </button>

        {/* Caption */}
        <div className="mt-2 text-center">
          <div className="text-[11px] font-semibold text-foreground line-clamp-1">{tool.name}</div>
          <div className="text-[10px] text-muted-foreground tabular-nums">
            {tool.price > 0 ? `₹${tool.price.toLocaleString('en-IN')} / ${tool.validity.toLowerCase()}` : tool.validity}
          </div>
        </div>
      </div>
    </div>
  );
}

interface HangingToolsGridProps {
  tools: AiTool[];
}

export default function HangingToolsGrid({ tools }: HangingToolsGridProps) {
  const items = useMemo(() => tools, [tools]);

  if (items.length === 0) return null;

  return (
    <div className="relative w-full py-6">
      <div
        className="grid gap-x-4 gap-y-12 sm:gap-x-5 sm:gap-y-14 md:gap-x-6 md:gap-y-16"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        }}
      >
        {items.map((t) => (
          <HangingTile key={t.id} tool={t} />
        ))}
      </div>
    </div>
  );
}

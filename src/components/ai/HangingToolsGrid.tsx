import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AiTool } from '@/hooks/useAiTools';
import { BrandLogo } from '@/components/ai/BrandLogo';
import { slugifyAiTool } from '@/lib/aiToolSeo';

/**
 * "Hanging" tool grid inspired by oimo.io/works.
 *
 * Each tile is a square thumbnail suspended from TWO strings. Each string
 * has its own "×" anchor positioned directly above one of the tile's top
 * corners — strings go straight down (no crossing). The whole unit
 * (anchors + strings + tile) rotates as one with `transform-origin: top
 * center` so it swings like a picture frame on two nails.
 *
 * Idle: a tiny randomized sway. Hover: a bigger swing that settles.
 * Purely CSS — no canvas, no physics.
 */

// Stable per-tile randomness so animations don't reseed every render.
function hashFloat(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return (h % 1000) / 1000;
}

// String column = ~28% of the tile height. Drawn with one SVG that spans
// the full tile width so the two strings line up with the tile's corners
// regardless of column width.
const STRING_HEIGHT_PCT = 28;

interface HangingTileProps {
  tool: AiTool;
}

function HangingTile({ tool }: HangingTileProps) {
  const navigate = useNavigate();
  const seed = hashFloat(tool.id);
  // Idle sway: 6 – 9.5s with up to a 5s phase offset → grid feels organic.
  const duration = (6 + seed * 3.5).toFixed(2);
  const delay = (seed * 5).toFixed(2);

  const open = () => navigate(`/ai-tool/${slugifyAiTool(tool.name)}`);

  return (
    <div className="flex flex-col items-stretch select-none">
      {/* Swinging unit: anchors + strings + tile rotate together */}
      <div
        className="group relative animate-sway-idle hover:animate-sway-hover"
        style={{
          transformOrigin: '50% 0%',
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          paddingTop: `${STRING_HEIGHT_PCT}%`,
        }}
      >
        {/* Two × anchors positioned over the tile's top corners.
            Offsets nudge them slightly inward to match the oimo look. */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-[6%] -translate-x-1/2 -translate-y-1/2 font-mono text-[13px] leading-none text-foreground/55"
        >
          ×
        </div>
        <div
          aria-hidden="true"
          className="absolute top-0 right-[6%] translate-x-1/2 -translate-y-1/2 font-mono text-[13px] leading-none text-foreground/55"
        >
          ×
        </div>

        {/* Strings: two vertical lines from each × down to the tile corners */}
        <svg
          className="absolute top-0 left-0 w-full pointer-events-none text-foreground/45"
          style={{ height: `${STRING_HEIGHT_PCT}%` }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Left × (x=6) → top-left corner (x=0). Tiny inward lean. */}
          <line x1="6" y1="0" x2="0.5" y2="100" stroke="currentColor" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          {/* Right × (x=94) → top-right corner (x=100). */}
          <line x1="94" y1="0" x2="99.5" y2="100" stroke="currentColor" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Tile — full click target */}
        <button
          type="button"
          onClick={open}
          className="relative block w-full aspect-square overflow-hidden border border-border/70 bg-card shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)] transition-shadow duration-300 group-hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)] focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={`${tool.name} — open details`}
        >
          <div className="absolute inset-0">
            <BrandLogo t={tool} compact />
          </div>
        </button>
      </div>

      {/* Caption below the swinging unit (does not swing — like oimo) */}
      <div className="mt-2 text-center px-0.5">
        <div className="text-[11px] font-semibold text-foreground line-clamp-1">{tool.name}</div>
        <div className="text-[10px] text-muted-foreground tabular-nums">
          {tool.price > 0 ? `₹${tool.price.toLocaleString('en-IN')}` : tool.validity}
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
    <div className="relative w-full py-2">
      <div
        // Tight horizontal gap (oimo tiles nearly touch), generous vertical
        // gap so the next row's anchors + strings have room.
        className="grid gap-x-2 gap-y-10 sm:gap-x-3 sm:gap-y-12 md:gap-x-3 md:gap-y-14"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
        }}
      >
        {items.map((t) => (
          <HangingTile key={t.id} tool={t} />
        ))}
      </div>
    </div>
  );
}

import { useMemo } from 'react';

/**
 * Global castle environment rendered once behind every page.
 * Pure CSS/SVG — no canvas, no external assets.
 */
const CastleBackground = () => {
  // 32 floating embers with randomized timing/position
  const embers = useMemo(
    () =>
      Array.from({ length: 32 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 8 + Math.random() * 12,
        drift: `${(Math.random() - 0.5) * 80}px`,
        size: Math.random() < 0.3 ? 3 : 2,
      })),
    []
  );

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0, background: 'hsl(240 22% 5%)' }}
    >
      {/* Bottom torchlight glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,168,76,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Distant tower silhouettes (deepest layer) */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: '28vh', opacity: 0.9 }}
        viewBox="0 0 1600 400"
        preserveAspectRatio="none"
      >
        <path
          d="M0,400 L0,260 L80,260 L80,200 L120,200 L120,260 L200,260 L200,180 L240,180 L240,260 L340,260 L340,220 L380,220 L380,260 L500,260 L500,200 L540,200 L540,260 L700,260 L700,240 L900,240 L900,260 L1080,260 L1080,200 L1120,200 L1120,260 L1240,260 L1240,220 L1280,220 L1280,260 L1400,260 L1400,180 L1440,180 L1440,260 L1520,260 L1520,200 L1560,200 L1560,260 L1600,260 L1600,400 Z"
          fill="#0E0E1A"
        />
      </svg>

      {/* Main castle silhouette */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: '38vh' }}
        viewBox="0 0 1600 500"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="castle-window-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(201,168,76,0.9)" />
            <stop offset="100%" stopColor="rgba(201,168,76,0)" />
          </radialGradient>
        </defs>

        {/* Castle body */}
        <g fill="#141420">
          {/* Left flanking tower */}
          <polygon points="180,180 240,80 300,180" />
          <rect x="180" y="180" width="120" height="320" />
          {/* Left battlements */}
          <path d="M180,180 L180,160 L200,160 L200,180 L220,180 L220,160 L240,160 L240,180 L260,180 L260,160 L280,160 L280,180 L300,180 Z" />

          {/* Right flanking tower */}
          <polygon points="1300,180 1360,80 1420,180" />
          <rect x="1300" y="180" width="120" height="320" />
          <path d="M1300,180 L1300,160 L1320,160 L1320,180 L1340,180 L1340,160 L1360,160 L1360,180 L1380,180 L1380,160 L1400,160 L1400,180 L1420,180 Z" />

          {/* Central keep */}
          <rect x="500" y="200" width="600" height="300" />
          {/* Keep battlements */}
          <path d="M500,200 L500,170 L540,170 L540,200 L580,200 L580,170 L620,170 L620,200 L660,200 L660,170 L700,170 L700,200 L740,200 L740,170 L780,170 L780,200 L820,200 L820,170 L860,170 L860,200 L900,200 L900,170 L940,170 L940,200 L980,200 L980,170 L1020,170 L1020,200 L1060,200 L1060,170 L1100,170 L1100,200 Z" />

          {/* Central tallest tower with conical roof */}
          <polygon points="720,200 800,40 880,200" />
          <rect x="720" y="200" width="160" height="300" />
          <path d="M720,200 L720,180 L745,180 L745,200 L770,200 L770,180 L795,180 L795,200 L820,200 L820,180 L845,180 L845,200 L870,200 L870,180 L880,180 L880,200 Z" />

          {/* Connecting walls */}
          <rect x="300" y="260" width="200" height="240" />
          <rect x="1100" y="260" width="200" height="240" />

          {/* Portcullis arch (cut into central tower) */}
          <path d="M770,500 L770,420 Q770,380 800,380 Q830,380 830,420 L830,500 Z" fill="#08080E" />
        </g>

        {/* Arched glowing windows — pulsing */}
        <g className="animate-window-flicker">
          {/* central tower */}
          <ellipse cx="800" cy="260" rx="10" ry="18" fill="url(#castle-window-glow)" />
          <ellipse cx="800" cy="320" rx="8" ry="14" fill="url(#castle-window-glow)" />
          {/* keep windows */}
          <ellipse cx="600" cy="280" rx="8" ry="14" fill="url(#castle-window-glow)" />
          <ellipse cx="680" cy="280" rx="8" ry="14" fill="url(#castle-window-glow)" />
          <ellipse cx="920" cy="280" rx="8" ry="14" fill="url(#castle-window-glow)" />
          <ellipse cx="1000" cy="280" rx="8" ry="14" fill="url(#castle-window-glow)" />
          {/* side towers */}
          <ellipse cx="240" cy="280" rx="7" ry="12" fill="url(#castle-window-glow)" />
          <ellipse cx="240" cy="360" rx="7" ry="12" fill="url(#castle-window-glow)" />
          <ellipse cx="1360" cy="280" rx="7" ry="12" fill="url(#castle-window-glow)" />
          <ellipse cx="1360" cy="360" rx="7" ry="12" fill="url(#castle-window-glow)" />
        </g>
      </svg>

      {/* Decorative floating medieval icons */}
      <svg
        className="absolute top-[8%] left-[6%] animate-slow-drift"
        width="90"
        height="90"
        viewBox="0 0 64 64"
        fill="none"
        stroke="rgba(201,168,76,0.12)"
        strokeWidth="1.5"
        style={{ opacity: 0.7 }}
      >
        {/* Great helm */}
        <path d="M16 22 Q16 12 32 12 Q48 12 48 22 L48 48 Q48 54 32 54 Q16 54 16 48 Z" />
        <line x1="20" y1="28" x2="44" y2="28" />
        <line x1="28" y1="36" x2="36" y2="36" />
      </svg>

      <svg
        className="absolute top-[10%] right-[8%] animate-slow-drift"
        width="80"
        height="80"
        viewBox="0 0 64 64"
        fill="none"
        stroke="rgba(201,168,76,0.12)"
        strokeWidth="1.5"
        style={{ opacity: 0.7, animationDelay: '2s' }}
      >
        {/* Shield with quadrant */}
        <path d="M32 6 L54 14 L54 32 Q54 50 32 60 Q10 50 10 32 L10 14 Z" />
        <line x1="32" y1="6" x2="32" y2="60" />
        <line x1="10" y1="30" x2="54" y2="30" />
      </svg>

      <svg
        className="absolute top-[40%] left-[4%] animate-slow-drift"
        width="70"
        height="70"
        viewBox="0 0 64 64"
        fill="none"
        stroke="rgba(201,168,76,0.1)"
        strokeWidth="1.5"
        style={{ opacity: 0.6, animationDelay: '4s' }}
      >
        {/* Battle axe */}
        <line x1="32" y1="8" x2="32" y2="58" />
        <path d="M32 18 Q14 22 12 32 Q14 42 32 38 Z" />
      </svg>

      <svg
        className="absolute top-[44%] right-[5%] animate-slow-drift"
        width="80"
        height="80"
        viewBox="0 0 64 64"
        fill="none"
        stroke="rgba(201,168,76,0.1)"
        strokeWidth="1.5"
        style={{ opacity: 0.6, animationDelay: '6s' }}
      >
        {/* Crossed swords */}
        <line x1="8" y1="8" x2="56" y2="56" />
        <line x1="56" y1="8" x2="8" y2="56" />
        <circle cx="8" cy="8" r="3" />
        <circle cx="56" cy="8" r="3" />
      </svg>

      {/* Crown near top center */}
      <svg
        className="absolute top-[6%] left-1/2 -translate-x-1/2 animate-slow-drift"
        width="100"
        height="60"
        viewBox="0 0 100 60"
        fill="none"
        stroke="rgba(201,168,76,0.12)"
        strokeWidth="1.5"
        style={{ opacity: 0.6 }}
      >
        <path d="M10 50 L10 20 L25 35 L40 10 L50 30 L60 10 L75 35 L90 20 L90 50 Z" />
        <line x1="10" y1="50" x2="90" y2="50" />
      </svg>

      {/* Fleur-de-lis scattered */}
      {[
        { top: '25%', left: '20%' },
        { top: '55%', left: '85%' },
        { top: '70%', left: '15%' },
        { top: '30%', left: '70%' },
      ].map((pos, i) => (
        <svg
          key={i}
          className="absolute animate-slow-drift"
          style={{ ...pos, opacity: 0.5, animationDelay: `${i * 1.5}s` }}
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          stroke="rgba(201,168,76,0.12)"
          strokeWidth="1.2"
        >
          <path d="M20 4 Q15 14 20 22 Q25 14 20 4 Z" />
          <path d="M8 18 Q14 22 20 22 Q26 22 32 18 Q28 26 20 28 Q12 26 8 18 Z" />
          <line x1="20" y1="22" x2="20" y2="34" />
          <line x1="14" y1="34" x2="26" y2="34" />
        </svg>
      ))}

      {/* Rising embers */}
      {embers.map((e, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={
            {
              left: `${e.left}%`,
              bottom: '-10px',
              width: `${e.size}px`,
              height: `${e.size}px`,
              background: 'rgba(201,168,76,0.5)',
              boxShadow: '0 0 6px rgba(201,168,76,0.6)',
              animation: `ember-rise ${e.duration}s linear ${e.delay}s infinite`,
              '--drift': e.drift,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Top vignette for nav readability */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: '120px',
          background:
            'linear-gradient(to bottom, rgba(10,10,15,0.9), transparent)',
        }}
      />
    </div>
  );
};

export default CastleBackground;

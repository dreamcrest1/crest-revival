import React from 'react';

/**
 * StoryBackground (simplified, performance-first)
 * A single static castle silhouette with a full moon.
 * No scroll listeners, no particles, no parallax — just CSS + one SVG.
 */
const StoryBackground: React.FC = React.memo(() => {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, hsl(230 40% 12%) 0%, hsl(230 50% 6%) 60%, hsl(230 60% 3%) 100%)',
      }}
    >
      {/* Full moon */}
      <div
        className="absolute"
        style={{
          top: '12%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(38vh, 32vw)',
          height: 'min(38vh, 32vw)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 38% 38%, #fdf6d8 0%, #f1e6a8 45%, #d9c97a 75%, #b8a55a 100%)',
          boxShadow:
            '0 0 80px 20px rgba(253,246,216,0.25), 0 0 160px 60px rgba(253,246,216,0.12)',
        }}
      />

      {/* Castle silhouette */}
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 w-full h-[70vh]"
        style={{ filter: 'drop-shadow(0 -8px 30px rgba(0,0,0,0.6))' }}
      >
        <defs>
          <linearGradient id="castleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0a14" />
            <stop offset="100%" stopColor="#000" />
          </linearGradient>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#05050a" />
            <stop offset="100%" stopColor="#000" />
          </linearGradient>
        </defs>

        {/* Ground */}
        <rect x="0" y="780" width="1600" height="120" fill="url(#groundGrad)" />

        {/* Castle body */}
        <g fill="url(#castleGrad)">
          {/* Outer wall */}
          <rect x="200" y="550" width="1200" height="260" />

          {/* Crenellations on outer wall */}
          {Array.from({ length: 24 }, (_, i) => (
            <rect key={i} x={200 + i * 50} y="530" width="30" height="30" />
          ))}

          {/* Left tower */}
          <rect x="240" y="380" width="140" height="430" />
          <polygon points="240,380 310,290 380,380" />
          {/* Right tower */}
          <rect x="1220" y="380" width="140" height="430" />
          <polygon points="1220,380 1290,290 1360,380" />

          {/* Central keep */}
          <rect x="640" y="280" width="320" height="530" />
          {/* Keep crenellations */}
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={`k${i}`} x={640 + i * 46} y="260" width="28" height="28" />
          ))}
          {/* Central spire */}
          <rect x="760" y="140" width="80" height="160" />
          <polygon points="760,140 800,40 840,140" />

          {/* Gate */}
          <path d="M740 810 L740 680 Q800 600 860 680 L860 810 Z" fill="#000" />
        </g>

        {/* Window glows */}
        <g fill="#f5b342" opacity="0.85">
          <rect x="690" y="420" width="14" height="22" rx="3" />
          <rect x="780" y="420" width="14" height="22" rx="3" />
          <rect x="890" y="420" width="14" height="22" rx="3" />
          <rect x="290" y="500" width="12" height="20" rx="3" />
          <rect x="320" y="500" width="12" height="20" rx="3" />
          <rect x="1268" y="500" width="12" height="20" rx="3" />
          <rect x="1298" y="500" width="12" height="20" rx="3" />
          <rect x="788" y="200" width="14" height="22" rx="3" />
        </g>
      </svg>

      {/* Bottom vignette for legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
});

StoryBackground.displayName = 'StoryBackground';

export default StoryBackground;

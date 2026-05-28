import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useScrollStory, chapterOpacity, lerp } from '@/hooks/useScrollStory';

/**
 * StoryBackground
 * Scroll-driven parallax cinematic background that tells a 5-chapter
 * medieval kingdom story as the user scrolls top -> bottom.
 *
 * Architecture:
 *  - Fixed full-viewport container behind all content (z-0, pointer-events:none).
 *  - Each layer translates upward at its own multiplier of total page travel.
 *  - Chapter opacities are envelope-driven and applied inline.
 *  - Ambient particles + lightning + fog are generated once.
 */

const GOLD = 'rgba(201,168,76,1)';

// ---------- generators (memo-once) ----------
const makeStars = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 60,
    size: Math.random() < 0.15 ? 2.4 : 1.4,
    delay: Math.random() * 5,
    dur: 2 + Math.random() * 4,
  }));

const makeEmbers = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 2 + Math.random() * 2.5,
    dur: 10 + Math.random() * 15,
    delay: Math.random() * 20,
    drift: -30 + Math.random() * 60,
  }));

// ---------- subcomponents (visual chapters) ----------

const SkyChapter: React.FC<{ opacity: number; p: number; stars: ReturnType<typeof makeStars> }> = ({
  opacity,
  p,
  stars,
}) => (
  <div
    className="absolute inset-0"
    style={{
      opacity,
      transform: `translateY(calc(var(--scroll-p) * -5vh))`,
      background:
        'linear-gradient(to bottom, #08080F 0%, #0E0A1F 55%, #1A1030 100%)',
    }}
  >
    {/* horizon golden glow */}
    <div
      className="absolute inset-x-0 bottom-0 h-[40vh] pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(201,168,76,0.10), transparent 70%)',
      }}
    />
    {/* stars */}
    {stars.map((s) => (
      <span
        key={s.id}
        className="absolute rounded-full bg-white animate-star-twinkle"
        style={{
          left: `${s.left}%`,
          top: `${s.top}%`,
          width: s.size,
          height: s.size,
          opacity: 0.4,
          animationDelay: `${s.delay}s`,
          animationDuration: `${s.dur}s`,
        }}
      />
    ))}
    {/* drifting clouds */}
    {[0, 1, 2, 3].map((i) => (
      <svg
        key={i}
        className="absolute"
        style={{
          left: `${-10 + i * 25}%`,
          top: `${10 + i * 9}%`,
          width: 420,
          height: 80,
          animation: `cloud-drift ${80 + i * 25}s linear infinite`,
          animationDelay: `${-i * 20}s`,
        }}
        viewBox="0 0 420 80"
      >
        <ellipse cx="210" cy="40" rx="200" ry="22" fill="rgba(255,255,255,0.04)" />
      </svg>
    ))}
    {/* moon */}
    <svg
      className="absolute"
      style={{
        right: `${lerp(8, 18, p)}vw`,
        top: '8vh',
        width: 120,
        height: 120,
        filter: 'drop-shadow(0 0 24px rgba(201,168,76,0.35))',
      }}
      viewBox="0 0 120 120"
    >
      <defs>
        <radialGradient id="moonHalo" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(201,168,76,0.35)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="55" fill="url(#moonHalo)" className="animate-moon-halo" />
      <path
        d="M 75 22 A 42 42 0 1 0 75 98 A 32 32 0 1 1 75 22 Z"
        fill="#F0EAD6"
        stroke="#C9A84C"
        strokeWidth="1"
      />
    </svg>
    {/* far hills */}
    <svg
      className="absolute inset-x-0 bottom-0"
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      style={{ height: '22vh' }}
    >
      <path
        d="M0 200 L0 130 C 180 80, 320 110, 480 95 C 640 80, 800 130, 980 105 C 1160 80, 1280 120, 1440 95 L1440 200 Z"
        fill="#0D0D1E"
      />
      {/* tiny trees */}
      {[150, 320, 520, 760, 980, 1180, 1340].map((x, i) => (
        <g key={i} fill="#111124" transform={`translate(${x} ${100 + (i % 3) * 6})`}>
          <polygon points="0,0 -5,12 5,12" />
          <polygon points="10,2 4,14 16,14" />
          <polygon points="-8,3 -14,15 -2,15" />
        </g>
      ))}
    </svg>
  </div>
);

const VillageChapter: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    className="absolute inset-x-0 bottom-0"
    style={{
      opacity,
      height: '70vh',
      transform: 'translateY(calc(var(--scroll-p) * -12vh))',
    }}
  >
    <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYEnd slice" className="w-full h-full">
      {/* ground */}
      <path d="M0 600 L0 460 C 200 430, 600 470, 900 450 C 1180 430, 1300 460, 1440 445 L1440 600 Z" fill="#0F0F1C" />
      {/* trees */}
      {[80, 1350].map((x, i) => (
        <g key={i} transform={`translate(${x} 380)`} fill="#1A1030">
          <rect x="-3" y="0" width="6" height="60" />
          <path d="M0 0 C -25 -20 -25 -55 0 -70 C 25 -55 25 -20 0 0 Z" />
        </g>
      ))}
      {/* cottages */}
      {[
        { x: 180, w: 110, h: 80, win: true },
        { x: 360, w: 90, h: 70 },
        { x: 520, w: 130, h: 95, win: true },
        { x: 720, w: 100, h: 75 },
        { x: 880, w: 120, h: 85, win: true },
        { x: 1080, w: 95, h: 72 },
        { x: 1220, w: 110, h: 80, win: true },
      ].map((c, i) => (
        <g key={i} transform={`translate(${c.x} ${460 - c.h})`}>
          <rect width={c.w} height={c.h} fill="#1A1020" stroke="#0A0610" />
          <polygon
            points={`${-8},0 ${c.w + 8},0 ${c.w / 2},${-c.h * 0.55}`}
            fill="#2A0E1A"
            stroke="#160508"
          />
          {/* window glow */}
          <rect
            x={c.w / 2 - 8}
            y={c.h / 2 - 4}
            width="16"
            height="18"
            fill={GOLD}
            opacity="0.55"
            className="animate-window-flicker"
            style={{ animationDelay: `${i * 0.7}s` }}
          />
          {/* chimney smoke */}
          {c.win && (
            <g transform={`translate(${c.w * 0.7} ${-c.h * 0.4})`}>
              <path
                d="M 0 0 Q -4 -20 2 -40 Q -4 -60 0 -80"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="3"
                fill="none"
              >
                <animate attributeName="opacity" values="0.25;0.05;0.25" dur="4s" repeatCount="indefinite" />
              </path>
            </g>
          )}
        </g>
      ))}
      {/* well */}
      <g transform="translate(680 440)">
        <ellipse cx="0" cy="10" rx="30" ry="8" fill="#1E1E2E" />
        <rect x="-2" y="-30" width="4" height="30" fill="#2A1A0A" />
        <rect x="-22" y="-32" width="44" height="4" fill="#2A1A0A" />
      </g>
      {/* fence */}
      <g stroke="#2A1A0A" strokeWidth="2">
        <line x1="0" y1="475" x2="1440" y2="475" />
        <line x1="0" y1="485" x2="1440" y2="485" />
        {Array.from({ length: 60 }, (_, i) => (
          <line key={i} x1={i * 24} y1="465" x2={i * 24} y2="495" />
        ))}
      </g>
    </svg>
  </div>
);

const ArmyChapter: React.FC<{ opacity: number }> = ({ opacity }) => {
  const rows = [
    { y: 440, count: 30, scale: 0.6, mul: 0.13, delayBase: 0 },
    { y: 480, count: 24, scale: 0.85, mul: 0.18, delayBase: 0.2 },
    { y: 520, count: 18, scale: 1.1, mul: 0.28, delayBase: 0.5 },
  ];
  return (
    <div
      className="absolute inset-x-0 bottom-0"
      style={{ opacity, height: '70vh', transform: 'translateY(calc(var(--scroll-p) * -18vh))' }}
    >
      <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYEnd slice" className="w-full h-full">
        {/* battlefield */}
        <path d="M0 600 L0 440 Q 720 420 1440 440 L1440 600 Z" fill="#0C1208" />
        {/* siege engines */}
        <g transform="translate(80 400)" fill="#0C0C18">
          <rect x="0" y="0" width="60" height="20" />
          <circle cx="10" cy="22" r="10" />
          <circle cx="50" cy="22" r="10" />
          <line x1="20" y1="0" x2="60" y2="-40" stroke="#0C0C18" strokeWidth="4" />
        </g>
        <g transform="translate(1280 400)" fill="#0C0C18">
          <rect x="0" y="0" width="80" height="18" />
          <rect x="10" y="-20" width="60" height="20" />
          <circle cx="15" cy="20" r="8" />
          <circle cx="65" cy="20" r="8" />
        </g>
        {/* banners */}
        {[300, 700, 1100].map((x, i) => (
          <g key={i} transform={`translate(${x} 380)`}>
            <line x1="0" y1="0" x2="0" y2="60" stroke="#C9A84C" strokeWidth="2" />
            <polygon
              points="0,0 30,8 0,20"
              fill="#6B0F1A"
              className="animate-banner-wave"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          </g>
        ))}
        {/* soldier rows */}
        {rows.map((r, ri) =>
          Array.from({ length: r.count }, (_, i) => {
            const x = (1440 / r.count) * i + (ri % 2 ? 12 : 0);
            return (
              <g key={`${ri}-${i}`} transform={`translate(${x} ${r.y}) scale(${r.scale})`} fill="#1A1020">
                <circle cx="0" cy="-12" r="2.2" />
                <rect x="-2.5" y="-10" width="5" height="8" />
                <rect
                  x="-2.5"
                  y="-2"
                  width="2"
                  height="5"
                  style={{
                    animation: `soldier-walk 0.6s ease-in-out infinite`,
                    animationDelay: `${(i * 0.07 + r.delayBase) % 1}s`,
                    transformOrigin: 'top',
                  }}
                />
                <rect
                  x="0.5"
                  y="-2"
                  width="2"
                  height="5"
                  style={{
                    animation: `soldier-walk 0.6s ease-in-out infinite`,
                    animationDelay: `${(i * 0.07 + r.delayBase + 0.3) % 1}s`,
                    transformOrigin: 'top',
                  }}
                />
                <line x1="3" y1="-12" x2="3" y2="-22" stroke="rgba(201,168,76,0.6)" strokeWidth="0.6" />
                <polygon points="3,-22 1.5,-19 4.5,-19" fill="rgba(201,168,76,0.6)" />
              </g>
            );
          }),
        )}
        {/* foreground debris */}
        <g fill="#0C0C18">
          <ellipse cx="120" cy="560" rx="60" ry="14" />
          <ellipse cx="1320" cy="555" rx="80" ry="16" />
          <circle cx="900" cy="555" r="22" fill="none" stroke="#0C0C18" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
};

const CastleChapter: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    className="absolute inset-0"
    style={{ opacity, transform: 'translateY(calc(var(--scroll-p) * -10vh))' }}
  >
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <defs>
        <radialGradient id="winGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(255,180,80,0.9)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* back towers */}
      <g fill="#0E0E18">
        <rect x="280" y="280" width="60" height="380" />
        <polygon points="280,280 340,280 310,240" fill="#1A0606" />
        <rect x="1100" y="290" width="60" height="370" />
        <polygon points="1100,290 1160,290 1130,250" fill="#1A0606" />
      </g>

      {/* curtain wall */}
      <rect x="200" y="500" width="1040" height="200" fill="#141422" />
      {Array.from({ length: 26 }, (_, i) => (
        <rect key={i} x={200 + i * 40} y="480" width="22" height="22" fill="#141422" />
      ))}

      {/* central keep */}
      <rect x="600" y="220" width="240" height="480" fill="#141422" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={600 + i * 40} y="200" width="22" height="22" fill="#141422" />
      ))}

      {/* keep windows */}
      {[0, 1].map((floor) =>
        [0, 1, 2].map((c) => {
          const x = 640 + c * 60;
          const y = 320 + floor * 110;
          const idx = floor * 3 + c;
          return (
            <g key={`${floor}-${c}`}>
              <circle cx={x + 10} cy={y + 10} r="22" fill="url(#winGlow)" />
              <path
                d={`M ${x} ${y + 28} L ${x} ${y + 10} A 10 10 0 0 1 ${x + 20} ${y + 10} L ${x + 20} ${y + 28} Z`}
                fill="#FFB347"
                opacity="0.55"
                className="animate-window-flicker"
                style={{ animationDelay: `${idx * 0.5}s` }}
              />
            </g>
          );
        }),
      )}

      {/* flanking towers */}
      {[{ x: 480 }, { x: 880 }].map((t, i) => (
        <g key={i}>
          <rect x={t.x} y="280" width="100" height="420" fill="#141422" />
          <polygon points={`${t.x},280 ${t.x + 100},280 ${t.x + 50},220`} fill="#1E0A0A" />
          {[0, 1].map((wf) => (
            <g key={wf}>
              <circle cx={t.x + 50} cy={360 + wf * 100} r="18" fill="url(#winGlow)" />
              <rect x={t.x + 42} y={350 + wf * 100} width="16" height="22" fill="#FFB347" opacity="0.6" className="animate-window-flicker" />
            </g>
          ))}
          {/* banner */}
          <line x1={t.x + 50} y1="220" x2={t.x + 50} y2="200" stroke="#C9A84C" strokeWidth="2" />
          <polygon points={`${t.x + 50},200 ${t.x + 80},208 ${t.x + 50},220`} fill="#6B0F1A" className="animate-banner-wave" />
        </g>
      ))}

      {/* portcullis arch */}
      <path d="M 660 700 L 660 600 A 60 60 0 0 1 780 600 L 780 700 Z" fill="#08080F" />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={665 + i * 16} y1="605" x2={665 + i * 16} y2="700" stroke="rgba(201,168,76,0.35)" strokeWidth="2" />
      ))}
      <line x1="660" y1="640" x2="780" y2="640" stroke="rgba(201,168,76,0.3)" strokeWidth="2" />

      {/* drawbridge */}
      <rect x="660" y="700" width="120" height="14" fill="#2A1A0A" />

      {/* moat */}
      <rect x="0" y="714" width="1440" height="28" fill="#08101A" />
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1="0"
          y1={720 + i * 6}
          x2="1440"
          y2={720 + i * 6}
          stroke="rgba(120,160,200,0.15)"
          strokeWidth="0.8"
          strokeDasharray="20 30"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="50" dur={`${6 + i * 2}s`} repeatCount="indefinite" />
        </line>
      ))}

      {/* approach road & lanterns */}
      <polygon points="600,900 840,900 780,742 660,742" fill="#141422" />
      {[{ x: 600, y: 820 }, { x: 840, y: 820 }, { x: 640, y: 760 }, { x: 800, y: 760 }].map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y})`}>
          <rect x="-1.5" y="0" width="3" height="30" fill="#0C0C18" />
          <rect x="-6" y="-10" width="12" height="12" fill="rgba(201,168,76,0.7)" className="animate-torch-flicker" />
        </g>
      ))}

      {/* foreground trees */}
      {[{ x: 80, s: 1 }, { x: 1360, s: 1.1 }].map((t, i) => (
        <g key={i} transform={`translate(${t.x} 900) scale(${t.s})`} fill="#0C0C18">
          <path d="M 0 0 L -4 -200 L -2 -200 L -2 -120 L -25 -160 L -3 -110 L -3 -60 L -22 -90 L 0 -50 Z" />
          <path d="M 0 0 L 4 -210 L 2 -210 L 2 -130 L 28 -170 L 3 -120 L 3 -70 L 24 -100 L 0 -55 Z" />
        </g>
      ))}
    </svg>
  </div>
);

const ThroneChapter: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    className="absolute inset-0"
    style={{ opacity, transform: 'translateY(calc(var(--scroll-p) * -8vh))' }}
  >
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <defs>
        <pattern id="brickTiny" width="40" height="20" patternUnits="userSpaceOnUse">
          <rect width="40" height="20" fill="#0F0F1A" />
          <path d="M0 10 H40 M20 0 V10 M0 20 V10" stroke="rgba(201,168,76,0.04)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="1440" height="900" fill="url(#brickTiny)" />

      {/* columns */}
      {[180, 1180].map((x, i) => (
        <g key={i} fill="#141420" stroke="rgba(201,168,76,0.15)">
          <rect x={x} y="100" width="80" height="700" />
          <rect x={x - 10} y="100" width="100" height="20" />
          <rect x={x - 10} y="780" width="100" height="20" />
          {/* torch */}
          <rect x={x + 30} y="280" width="20" height="6" fill="#2A1A0A" />
          <ellipse cx={x + 40} cy="270" rx="10" ry="14" fill="rgba(255,160,60,0.7)" className="animate-torch-flicker" />
        </g>
      ))}

      {/* shield emblems */}
      {[320, 1080].map((x, i) => (
        <g key={i} transform={`translate(${x} 400)`} fill="rgba(201,168,76,0.12)" stroke="rgba(201,168,76,0.3)">
          <path d="M 0 0 L 60 0 L 60 50 Q 30 90 0 50 Z" />
          <path d="M 30 -10 L 22 -2 L 38 -2 Z" />
        </g>
      ))}

      {/* red carpet */}
      <polygon points="640,900 800,900 780,300 660,300" fill="#2A0808" stroke="rgba(201,168,76,0.4)" strokeWidth="1" />

      {/* throne */}
      <g transform="translate(720 280)">
        <rect x="-90" y="0" width="180" height="160" fill="#0E0E18" stroke="rgba(201,168,76,0.3)" />
        <path d="M -70 0 L -70 -120 Q 0 -200 70 -120 L 70 0 Z" fill="#0E0E18" stroke="rgba(201,168,76,0.4)" />
        <rect x="-110" y="40" width="20" height="100" fill="#0E0E18" />
        <rect x="90" y="40" width="20" height="100" fill="#0E0E18" />
        {/* crown */}
        <g transform="translate(0 -210)" fill="rgba(201,168,76,0.75)">
          <path d="M -40 0 L -30 -25 L -15 -8 L 0 -30 L 15 -8 L 30 -25 L 40 0 Z" />
          <circle cx="0" cy="-30" r="3" fill="#E8D5A3" />
        </g>
      </g>

      {/* candelabra */}
      {[80, 1340].map((x, i) => (
        <g key={i} transform={`translate(${x} 600)`}>
          <rect x="-2" y="0" width="4" height="140" fill="#0C0C18" />
          {[-20, 0, 20].map((dx, j) => (
            <g key={j} transform={`translate(${dx} -10)`}>
              <rect x="-1.5" y="0" width="3" height="14" fill="#E8D5A3" />
              <ellipse cx="0" cy="-4" rx="3" ry="6" fill="rgba(255,170,70,0.85)" className="animate-torch-flicker" />
            </g>
          ))}
        </g>
      ))}
    </svg>
  </div>
);

// ---------- root ----------

const StoryBackgroundInner: React.FC = () => {
  const p = useScrollStory();
  const stars = useMemo(() => makeStars(70), []);
  const embers = useMemo(() => makeEmbers(35), []);
  const fogBlobs = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        left: i * 22 - 10,
        top: 60 + Math.random() * 30,
        rx: 380 + Math.random() * 220,
        dur: 12 + Math.random() * 10,
        delay: -Math.random() * 10,
      })),
    [],
  );

  const skyO = p < 0.7 ? 1 : Math.max(0, 1 - (p - 0.7) / 0.15);
  const villageO = chapterOpacity(0.10, 0.20, 0.30, 0.45, p);
  const armyO = chapterOpacity(0.28, 0.38, 0.52, 0.62, p);
  const castleO = chapterOpacity(0.50, 0.60, 0.80, 0.92, p);
  const throneO = chapterOpacity(0.75, 0.88, 1.0, 1.0, p);
  const fogO = Math.min(1, villageO + armyO);

  // color temperature
  const hue = lerp(0, 5, Math.min(1, p / 0.35)) + lerp(0, -15, Math.max(0, (p - 0.35) / 0.65));
  const bright = p < 0.35 ? lerp(1.0, 0.85, p / 0.35) : p < 0.65 ? lerp(0.85, 0.9, (p - 0.35) / 0.3) : lerp(0.9, 0.75, (p - 0.65) / 0.35);

  // lightning
  const [flash, setFlash] = useState(0);
  const pRef = useRef(p);
  pRef.current = p;
  useEffect(() => {
    let cancelled = false;
    const trigger = () => {
      if (cancelled) return;
      const cur = pRef.current;
      if (cur >= 0.32 && cur <= 0.55) {
        setFlash(0.08);
        setTimeout(() => setFlash(0), 120);
        setTimeout(() => setFlash(0.04), 320);
        setTimeout(() => setFlash(0), 400);
      }
      const next = 18000 + Math.random() * 12000;
      setTimeout(trigger, next);
    };
    const t = setTimeout(trigger, 8000);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 overflow-hidden pointer-events-none"
        style={{
          zIndex: 0,
          filter: `hue-rotate(${hue.toFixed(2)}deg) brightness(${bright.toFixed(3)})`,
          transition: 'filter 0.4s linear',
          background: '#08080F',
        }}
      >
        <SkyChapter opacity={skyO} p={p} stars={stars} />
        <VillageChapter opacity={villageO} />
        <ArmyChapter opacity={armyO} />
        <CastleChapter opacity={castleO} />
        <ThroneChapter opacity={throneO} />

        {/* drifting ground fog */}
        <div className="absolute inset-0" style={{ opacity: fogO * 0.9 }}>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYEnd slice" className="w-full h-full">
            {fogBlobs.map((f) => (
              <ellipse
                key={f.id}
                cx={f.left * 14.4 + 200}
                cy={f.top * 9}
                rx={f.rx}
                ry={40}
                fill="rgba(255,255,255,0.025)"
                style={{
                  animation: `fog-drift ${f.dur}s ease-in-out infinite alternate`,
                  animationDelay: `${f.delay}s`,
                }}
              />
            ))}
          </svg>
        </div>

        {/* ambient embers */}
        {embers.map((e) => (
          <span
            key={e.id}
            className="absolute rounded-full"
            style={{
              left: `${e.left}%`,
              bottom: '-10px',
              width: e.size,
              height: e.size,
              background: 'rgba(201,168,76,0.55)',
              boxShadow: '0 0 6px rgba(201,168,76,0.6)',
              animation: `story-ember ${e.dur}s linear infinite`,
              animationDelay: `${e.delay}s`,
              ['--drift' as any]: `${e.drift}px`,
            }}
          />
        ))}

        {/* vignette for legibility, deepens toward throne */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)',
            opacity: lerp(0.5, 1, p),
          }}
        />
      </div>

      {/* lightning flash (above background, below content) */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: 'white',
          opacity: flash,
          transition: 'opacity 100ms linear',
          mixBlendMode: 'screen',
        }}
      />

      {/* once-only keyframes */}
      <style>{`
        @keyframes story-ember {
          0%   { transform: translate(0, 0) scale(1); opacity: 0; }
          10%  { opacity: 0.9; }
          90%  { opacity: 0.5; }
          100% { transform: translate(var(--drift, 20px), -110vh) scale(0.6); opacity: 0; }
        }
        @keyframes fog-drift {
          from { transform: translateX(-40px); }
          to   { transform: translateX(40px); }
        }
        @keyframes soldier-walk {
          0%, 100% { transform: scaleY(1); }
          50%      { transform: scaleY(0.55); }
        }
      `}</style>
    </>
  );
};

const StoryBackground = React.memo(StoryBackgroundInner);
export default StoryBackground;

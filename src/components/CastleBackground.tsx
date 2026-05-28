import { useMemo } from 'react';

/**
 * Global castle environment rendered once behind every page.
 * Layers (back→front):
 *   1. Night sky gradient + nebula
 *   2. Twinkling starfield + crescent moon with halo
 *   3. Drifting clouds
 *   4. Distant mountain ridges (3 layers, parallax depth via opacity)
 *   5. Far tower silhouettes
 *   6. Main intricate castle (keeps, towers, banners, gate, bridge)
 *   7. Floating heraldic glyphs (helms, shields, axes, fleur-de-lis)
 *   8. Bats, lightning flash, rising torch embers
 *   9. Top + bottom vignettes for chrome readability
 * Pure SVG/CSS — no canvas, no external assets.
 */
const CastleBackground = () => {
  // Twinkling stars
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 55,
        r: Math.random() < 0.15 ? 1.6 : Math.random() < 0.5 ? 1 : 0.6,
        delay: Math.random() * 4,
        dur: 2 + Math.random() * 4,
      })),
    []
  );

  // Rising embers
  const embers = useMemo(
    () =>
      Array.from({ length: 38 }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 8 + Math.random() * 12,
        drift: `${(Math.random() - 0.5) * 100}px`,
        size: Math.random() < 0.3 ? 3 : 2,
      })),
    []
  );

  // Bats — drift across the sky on stagger
  const bats = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, i) => ({
        top: 10 + Math.random() * 25,
        delay: i * 6 + Math.random() * 4,
        duration: 22 + Math.random() * 14,
        scale: 0.7 + Math.random() * 0.5,
      })),
    []
  );

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* 1. Night sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 50% 10%, hsl(245 35% 12%) 0%, hsl(245 30% 8%) 35%, hsl(240 22% 5%) 70%, hsl(240 25% 3%) 100%)',
        }}
      />

      {/* Purple/gold nebula wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 35% at 22% 18%, rgba(123,94,167,0.22), transparent 70%), radial-gradient(ellipse 45% 30% at 82% 12%, rgba(201,168,76,0.10), transparent 70%)',
        }}
      />

      {/* 2. Starfield */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r / 10}
            fill="#F0EAD6"
            className="animate-star-twinkle"
            style={{ animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }}
          />
        ))}
        {/* A few warm gold stars */}
        {[[12, 8], [78, 6], [55, 14], [30, 22], [88, 28], [8, 30]].map(([x, y], i) => (
          <circle key={`g${i}`} cx={x} cy={y} r={0.18} fill="#C9A84C" className="animate-star-twinkle" style={{ animationDelay: `${i * 0.7}s` }} />
        ))}
      </svg>

      {/* Crescent moon with halo */}
      <div className="absolute" style={{ top: '8%', right: '12%', width: 140, height: 140 }}>
        <div
          className="absolute inset-0 rounded-full animate-moon-halo"
          style={{
            background:
              'radial-gradient(circle, rgba(240,234,214,0.35) 0%, rgba(201,168,76,0.15) 35%, transparent 70%)',
            filter: 'blur(6px)',
          }}
        />
        <svg viewBox="0 0 100 100" className="relative w-full h-full">
          <defs>
            <radialGradient id="moon-grad" cx="42%" cy="42%" r="60%">
              <stop offset="0%" stopColor="#FBF6E4" />
              <stop offset="70%" stopColor="#E8D5A3" />
              <stop offset="100%" stopColor="#A8915A" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="28" fill="url(#moon-grad)" />
          {/* Crescent shadow */}
          <circle cx="62" cy="46" r="26" fill="hsl(245 30% 8%)" />
          {/* Craters */}
          <circle cx="42" cy="58" r="2.5" fill="rgba(0,0,0,0.18)" />
          <circle cx="48" cy="52" r="1.6" fill="rgba(0,0,0,0.18)" />
          <circle cx="38" cy="48" r="1.2" fill="rgba(0,0,0,0.18)" />
        </svg>
      </div>

      {/* Lightning flash overlay */}
      <div
        className="absolute inset-0 animate-lightning"
        style={{
          background:
            'linear-gradient(to bottom, rgba(220,225,255,0.85), rgba(180,170,220,0.15) 30%, transparent 55%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* 3. Drifting clouds */}
      <svg
        className="absolute top-[14%] left-0 w-full animate-cloud-drift"
        style={{ height: '14vh', opacity: 0.35 }}
        viewBox="0 0 1600 200"
        preserveAspectRatio="none"
      >
        <g fill="rgba(60,60,90,0.55)">
          <ellipse cx="160" cy="120" rx="180" ry="22" />
          <ellipse cx="480" cy="80" rx="220" ry="18" />
          <ellipse cx="900" cy="110" rx="260" ry="24" />
          <ellipse cx="1340" cy="70" rx="200" ry="20" />
        </g>
      </svg>
      <svg
        className="absolute top-[22%] left-0 w-full animate-cloud-drift"
        style={{ height: '10vh', opacity: 0.25, animationDuration: '180s', animationDirection: 'reverse' }}
        viewBox="0 0 1600 200"
        preserveAspectRatio="none"
      >
        <g fill="rgba(80,70,110,0.5)">
          <ellipse cx="260" cy="100" rx="260" ry="14" />
          <ellipse cx="780" cy="60" rx="200" ry="12" />
          <ellipse cx="1240" cy="100" rx="320" ry="16" />
        </g>
      </svg>

      {/* 4. Mountain ridges — three layers */}
      <svg className="absolute left-0 w-full" style={{ bottom: '32vh', height: '22vh', opacity: 0.7 }} viewBox="0 0 1600 300" preserveAspectRatio="none">
        <path d="M0,300 L0,180 L120,80 L240,150 L380,40 L520,140 L640,90 L800,170 L960,70 L1120,160 L1280,90 L1440,150 L1600,80 L1600,300 Z" fill="#0B0B16" />
      </svg>
      <svg className="absolute left-0 w-full" style={{ bottom: '30vh', height: '18vh', opacity: 0.85 }} viewBox="0 0 1600 300" preserveAspectRatio="none">
        <path d="M0,300 L0,210 L160,120 L320,200 L460,110 L600,200 L760,140 L920,210 L1080,130 L1240,200 L1400,150 L1600,210 L1600,300 Z" fill="#0A0A12" />
      </svg>
      <svg className="absolute left-0 w-full" style={{ bottom: '28vh', height: '14vh' }} viewBox="0 0 1600 300" preserveAspectRatio="none">
        <path d="M0,300 L0,240 L200,180 L400,240 L600,190 L800,250 L1000,200 L1200,250 L1400,210 L1600,250 L1600,300 Z" fill="#08080F" />
      </svg>

      {/* 5. Distant towers */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: '32vh', opacity: 0.9 }}
        viewBox="0 0 1600 400"
        preserveAspectRatio="none"
      >
        <path
          d="M0,400 L0,260 L80,260 L80,200 L120,200 L120,260 L200,260 L200,180 L240,180 L240,260 L340,260 L340,220 L380,220 L380,260 L500,260 L500,200 L540,200 L540,260 L700,260 L700,240 L900,240 L900,260 L1080,260 L1080,200 L1120,200 L1120,260 L1240,260 L1240,220 L1280,220 L1280,260 L1400,260 L1400,180 L1440,180 L1440,260 L1520,260 L1520,200 L1560,200 L1560,260 L1600,260 L1600,400 Z"
          fill="#0E0E1A"
        />
        {/* Distant tiny glowing windows */}
        <g fill="rgba(201,168,76,0.55)" className="animate-window-flicker">
          <rect x="108" y="220" width="2" height="4" />
          <rect x="228" y="200" width="2" height="4" />
          <rect x="528" y="220" width="2" height="4" />
          <rect x="1108" y="220" width="2" height="4" />
          <rect x="1428" y="200" width="2" height="4" />
        </g>
      </svg>

      {/* 6. Main intricate castle */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: '46vh' }}
        viewBox="0 0 1600 560"
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="castle-window-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(201,168,76,0.95)" />
            <stop offset="100%" stopColor="rgba(201,168,76,0)" />
          </radialGradient>
          <radialGradient id="torch-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,170,60,0.9)" />
            <stop offset="60%" stopColor="rgba(201,80,30,0.25)" />
            <stop offset="100%" stopColor="rgba(201,80,30,0)" />
          </radialGradient>
          <linearGradient id="banner-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8C2A2A" />
            <stop offset="100%" stopColor="#4A0E0E" />
          </linearGradient>
          <linearGradient id="banner-grad-2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3A4A8C" />
            <stop offset="100%" stopColor="#1A1E4A" />
          </linearGradient>
          <pattern id="brick" x="0" y="0" width="22" height="11" patternUnits="userSpaceOnUse">
            <rect width="22" height="11" fill="#141420" />
            <path d="M0 11 L22 11 M11 0 L11 5.5 M0 5.5 L22 5.5 M0 5.5 L0 0 M22 5.5 L22 0" stroke="rgba(255,255,255,0.025)" strokeWidth="0.6" />
          </pattern>
        </defs>

        {/* Outer curtain wall (back) */}
        <g fill="url(#brick)">
          <rect x="0" y="320" width="1600" height="240" />
          {/* Wall battlements */}
          <path d="M0,320 L0,300 L40,300 L40,320 L80,320 L80,300 L120,300 L120,320 L160,320 L160,300 L200,300 L200,320 L240,320 L240,300 L280,300 L280,320 L320,320 L320,300 L360,300 L360,320 L400,320 L400,300 L440,300 L440,320 L480,320 L480,300 L520,300 L520,320 L560,320 L560,300 L600,300 L600,320 L640,320 L640,300 L680,300 L680,320 L720,320 L720,300 L760,300 L760,320 L800,320 L800,300 L840,300 L840,320 L880,320 L880,300 L920,300 L920,320 L960,320 L960,300 L1000,300 L1000,320 L1040,320 L1040,300 L1080,300 L1080,320 L1120,320 L1120,300 L1160,300 L1160,320 L1200,320 L1200,300 L1240,300 L1240,320 L1280,320 L1280,300 L1320,300 L1320,320 L1360,320 L1360,300 L1400,300 L1400,320 L1440,320 L1440,300 L1480,300 L1480,320 L1520,320 L1520,300 L1560,300 L1560,320 L1600,320 L1600,320 Z" />
        </g>

        {/* Castle body */}
        <g>
          {/* Far-left corner tower */}
          <polygon points="80,200 130,90 180,200" fill="#5A1E1E" />
          <rect x="80" y="200" width="100" height="360" fill="url(#brick)" />
          <path d="M80,200 L80,180 L100,180 L100,200 L120,200 L120,180 L140,180 L140,200 L160,200 L160,180 L180,180 L180,200 Z" fill="#141420" />
          {/* Banner */}
          <g className="animate-banner-wave" style={{ transformOrigin: '130px 200px' }}>
            <rect x="120" y="200" width="20" height="60" fill="url(#banner-grad-2)" />
            <polygon points="120,260 130,250 140,260" fill="url(#banner-grad-2)" />
          </g>

          {/* Left flanking tower */}
          <polygon points="220,180 280,60 340,180" fill="#5A1E1E" />
          <circle cx="280" cy="100" r="6" fill="#C9A84C" />
          <rect x="220" y="180" width="120" height="380" fill="url(#brick)" />
          <path d="M220,180 L220,158 L240,158 L240,180 L260,180 L260,158 L280,158 L280,180 L300,180 L300,158 L320,158 L320,180 L340,180 Z" fill="#141420" />

          {/* Left wall section with crenellations */}
          <rect x="340" y="260" width="200" height="300" fill="url(#brick)" />
          <path d="M340,260 L340,240 L370,240 L370,260 L400,260 L400,240 L430,240 L430,260 L460,260 L460,240 L490,240 L490,260 L520,260 L520,240 L540,240 L540,260 Z" fill="#141420" />

          {/* Central keep — massive */}
          <rect x="540" y="200" width="520" height="360" fill="url(#brick)" />
          <path d="M540,200 L540,170 L580,170 L580,200 L620,200 L620,170 L660,170 L660,200 L700,200 L700,170 L740,170 L740,200 L780,200 L780,170 L820,170 L820,200 L860,200 L860,170 L900,170 L900,200 L940,200 L940,170 L980,170 L980,200 L1020,200 L1020,170 L1060,170 L1060,200 Z" fill="#141420" />

          {/* Central tallest spire with conical roof + flag */}
          <polygon points="740,200 800,20 860,200" fill="#5A1E1E" />
          <line x1="800" y1="20" x2="800" y2="-15" stroke="#C9A84C" strokeWidth="2" />
          <g className="animate-banner-wave" style={{ transformOrigin: '800px 0px' }}>
            <polygon points="800,0 830,8 800,20" fill="url(#banner-grad)" />
          </g>
          <rect x="740" y="200" width="120" height="360" fill="url(#brick)" />
          <path d="M740,200 L740,180 L760,180 L760,200 L780,200 L780,180 L800,180 L800,200 L820,200 L820,180 L840,180 L840,200 L860,200 L860,180 Z" fill="#141420" />

          {/* Arched gate (portcullis) */}
          <path d="M770,560 L770,440 Q770,400 800,400 Q830,400 830,440 L830,560 Z" fill="#08080E" />
          {/* Portcullis grid bars */}
          <g stroke="rgba(201,168,76,0.25)" strokeWidth="1.5">
            <line x1="780" y1="430" x2="780" y2="560" />
            <line x1="790" y1="420" x2="790" y2="560" />
            <line x1="800" y1="416" x2="800" y2="560" />
            <line x1="810" y1="420" x2="810" y2="560" />
            <line x1="820" y1="430" x2="820" y2="560" />
            <line x1="770" y1="450" x2="830" y2="450" />
            <line x1="770" y1="480" x2="830" y2="480" />
            <line x1="770" y1="510" x2="830" y2="510" />
            <line x1="770" y1="540" x2="830" y2="540" />
          </g>
          {/* Drawbridge chains */}
          <line x1="770" y1="440" x2="740" y2="500" stroke="rgba(201,168,76,0.35)" strokeWidth="1.2" strokeDasharray="3 2" />
          <line x1="830" y1="440" x2="860" y2="500" stroke="rgba(201,168,76,0.35)" strokeWidth="1.2" strokeDasharray="3 2" />

          {/* Side smaller spires on the keep */}
          <polygon points="600,200 640,110 680,200" fill="#5A1E1E" />
          <polygon points="920,200 960,110 1000,200" fill="#5A1E1E" />
          <circle cx="640" cy="125" r="4" fill="#C9A84C" />
          <circle cx="960" cy="125" r="4" fill="#C9A84C" />

          {/* Right wall section */}
          <rect x="1060" y="260" width="200" height="300" fill="url(#brick)" />
          <path d="M1060,260 L1060,240 L1090,240 L1090,260 L1120,260 L1120,240 L1150,240 L1150,260 L1180,260 L1180,240 L1210,240 L1210,260 L1240,260 L1240,240 L1260,240 L1260,260 Z" fill="#141420" />

          {/* Right flanking tower */}
          <polygon points="1260,180 1320,60 1380,180" fill="#5A1E1E" />
          <circle cx="1320" cy="100" r="6" fill="#C9A84C" />
          <rect x="1260" y="180" width="120" height="380" fill="url(#brick)" />
          <path d="M1260,180 L1260,158 L1280,158 L1280,180 L1300,180 L1300,158 L1320,158 L1320,180 L1340,180 L1340,158 L1360,158 L1360,180 L1380,180 Z" fill="#141420" />

          {/* Far-right corner tower */}
          <polygon points="1420,200 1470,90 1520,200" fill="#5A1E1E" />
          <rect x="1420" y="200" width="100" height="360" fill="url(#brick)" />
          <path d="M1420,200 L1420,180 L1440,180 L1440,200 L1460,200 L1460,180 L1480,180 L1480,200 L1500,200 L1500,180 L1520,180 L1520,200 Z" fill="#141420" />
          <g className="animate-banner-wave" style={{ transformOrigin: '1470px 200px' }}>
            <rect x="1460" y="200" width="20" height="60" fill="url(#banner-grad)" />
            <polygon points="1460,260 1470,250 1480,260" fill="url(#banner-grad)" />
          </g>
        </g>

        {/* Glowing arched windows — pulsing */}
        <g className="animate-window-flicker">
          {/* central spire */}
          <ellipse cx="800" cy="250" rx="9" ry="16" fill="url(#castle-window-glow)" />
          <ellipse cx="800" cy="310" rx="7" ry="12" fill="url(#castle-window-glow)" />
          <ellipse cx="800" cy="370" rx="7" ry="12" fill="url(#castle-window-glow)" />
          {/* keep windows two rows */}
          {[580, 640, 700, 880, 940, 1000].map((x) => (
            <ellipse key={`w1-${x}`} cx={x} cy="270" rx="7" ry="13" fill="url(#castle-window-glow)" />
          ))}
          {[580, 640, 700, 880, 940, 1000].map((x) => (
            <ellipse key={`w2-${x}`} cx={x} cy="340" rx="6" ry="11" fill="url(#castle-window-glow)" />
          ))}
          {/* flanking towers */}
          <ellipse cx="280" cy="260" rx="6" ry="11" fill="url(#castle-window-glow)" />
          <ellipse cx="280" cy="330" rx="6" ry="11" fill="url(#castle-window-glow)" />
          <ellipse cx="280" cy="400" rx="6" ry="11" fill="url(#castle-window-glow)" />
          <ellipse cx="1320" cy="260" rx="6" ry="11" fill="url(#castle-window-glow)" />
          <ellipse cx="1320" cy="330" rx="6" ry="11" fill="url(#castle-window-glow)" />
          <ellipse cx="1320" cy="400" rx="6" ry="11" fill="url(#castle-window-glow)" />
          {/* corner towers */}
          <ellipse cx="130" cy="310" rx="5" ry="10" fill="url(#castle-window-glow)" />
          <ellipse cx="130" cy="390" rx="5" ry="10" fill="url(#castle-window-glow)" />
          <ellipse cx="1470" cy="310" rx="5" ry="10" fill="url(#castle-window-glow)" />
          <ellipse cx="1470" cy="390" rx="5" ry="10" fill="url(#castle-window-glow)" />
        </g>

        {/* Torch glows beside the gate */}
        <g className="animate-torch-flicker">
          <circle cx="745" cy="450" r="20" fill="url(#torch-glow)" />
          <circle cx="855" cy="450" r="20" fill="url(#torch-glow)" />
        </g>
      </svg>

      {/* 7. Floating heraldic glyphs */}
      <svg className="absolute top-[10%] left-[5%] animate-slow-drift" width="100" height="100" viewBox="0 0 64 64" fill="none" stroke="rgba(201,168,76,0.14)" strokeWidth="1.5" style={{ opacity: 0.7 }}>
        <path d="M16 22 Q16 12 32 12 Q48 12 48 22 L48 48 Q48 54 32 54 Q16 54 16 48 Z" />
        <line x1="20" y1="28" x2="44" y2="28" />
        <line x1="28" y1="36" x2="36" y2="36" />
      </svg>

      <svg className="absolute top-[34%] left-[3%] animate-slow-drift" width="80" height="80" viewBox="0 0 64 64" fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="1.5" style={{ opacity: 0.6, animationDelay: '3s' }}>
        <line x1="32" y1="6" x2="32" y2="58" />
        <path d="M32 16 Q12 22 10 32 Q12 42 32 38 Z" />
      </svg>

      <svg className="absolute top-[48%] left-[7%] animate-slow-drift" width="76" height="76" viewBox="0 0 64 64" fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="1.5" style={{ opacity: 0.5, animationDelay: '5s' }}>
        <line x1="8" y1="8" x2="56" y2="56" />
        <line x1="56" y1="8" x2="8" y2="56" />
        <circle cx="8" cy="8" r="3" />
        <circle cx="56" cy="8" r="3" />
      </svg>

      {/* Right-side glyphs */}
      <svg className="absolute top-[18%] right-[6%] animate-slow-drift" width="90" height="90" viewBox="0 0 64 64" fill="none" stroke="rgba(201,168,76,0.13)" strokeWidth="1.5" style={{ opacity: 0.65, animationDelay: '2s' }}>
        <path d="M32 6 L54 14 L54 32 Q54 50 32 60 Q10 50 10 32 L10 14 Z" />
        <line x1="32" y1="6" x2="32" y2="60" />
        <line x1="10" y1="30" x2="54" y2="30" />
      </svg>

      <svg className="absolute top-[42%] right-[4%] animate-slow-drift" width="70" height="70" viewBox="0 0 64 64" fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="1.5" style={{ opacity: 0.6, animationDelay: '4s' }}>
        <circle cx="32" cy="32" r="22" />
        <path d="M32 10 L36 30 L56 32 L36 34 L32 54 L28 34 L8 32 L28 30 Z" />
      </svg>

      {/* Scattered fleur-de-lis */}
      {[
        { top: '28%', left: '24%', d: 0 },
        { top: '58%', left: '88%', d: 1.5 },
        { top: '38%', left: '60%', d: 3 },
        { top: '20%', left: '78%', d: 4.5 },
        { top: '48%', left: '42%', d: 6 },
      ].map((p, i) => (
        <svg
          key={i}
          className="absolute animate-slow-drift"
          style={{ top: p.top, left: p.left, opacity: 0.5, animationDelay: `${p.d}s` }}
          width="42"
          height="42"
          viewBox="0 0 40 40"
          fill="none"
          stroke="rgba(201,168,76,0.13)"
          strokeWidth="1.2"
        >
          <path d="M20 4 Q15 14 20 22 Q25 14 20 4 Z" />
          <path d="M8 18 Q14 22 20 22 Q26 22 32 18 Q28 26 20 28 Q12 26 8 18 Z" />
          <line x1="20" y1="22" x2="20" y2="34" />
          <line x1="14" y1="34" x2="26" y2="34" />
        </svg>
      ))}

      {/* 8. Bats */}
      {bats.map((b, i) => (
        <div
          key={`bat-${i}`}
          className="absolute"
          style={{
            top: `${b.top}%`,
            left: '-6%',
            animation: `bat-fly ${b.duration}s linear ${b.delay}s infinite`,
            transform: `scale(${b.scale})`,
          }}
        >
          <svg width="28" height="14" viewBox="0 0 28 14" fill="rgba(10,10,15,0.85)" className="animate-bat-flap">
            <path d="M14 7 Q10 0 4 2 Q8 5 6 8 Q10 6 14 8 Q18 6 22 8 Q20 5 24 2 Q18 0 14 7 Z" />
          </svg>
        </div>
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
              background: 'rgba(255,170,60,0.6)',
              boxShadow: '0 0 8px rgba(255,140,40,0.7)',
              animation: `ember-rise ${e.duration}s linear ${e.delay}s infinite`,
              '--drift': e.drift,
            } as React.CSSProperties
          }
        />
      ))}

      {/* 9. Vignettes */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: 140, background: 'linear-gradient(to bottom, rgba(10,10,15,0.92), transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: 80, background: 'linear-gradient(to top, rgba(10,10,15,0.75), transparent)' }}
      />
      {/* Side vignettes */}
      <div
        className="absolute inset-y-0 left-0"
        style={{ width: 160, background: 'linear-gradient(to right, rgba(10,10,15,0.55), transparent)' }}
      />
      <div
        className="absolute inset-y-0 right-0"
        style={{ width: 160, background: 'linear-gradient(to left, rgba(10,10,15,0.55), transparent)' }}
      />
      {/* Bottom torchlight glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 40% at 50% 100%, rgba(201,168,76,0.10) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};

export default CastleBackground;

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { GLOBE_LOGOS } from '@/data/globeLogos';

const stats = [
  { value: '15,000+', label: 'Customers' },
  { value: '200+', label: 'Products' },
  { value: '2021', label: 'Since' },
  { value: '4.9★', label: 'Rating' },
];

const trust = [
  { icon: '✓', text: '100% Genuine' },
  { icon: '⚡', text: 'Instant Delivery' },
  { icon: '🕐', text: '24/7 Support' },
];

const LOGOS = GLOBE_LOGOS.map((l) => ({ name: l.name, src: l.image }));

/**
 * Two-sided spinning coin medallion.
 * Front: rotating brand logo (changes every full spin).
 * Back: large "AI" engraving.
 */
const Medallion = () => {
  const [angle, setAngle] = useState(0);
  const [paused, setPaused] = useState(false);
  const [logoIdx, setLogoIdx] = useState(() => Math.floor(Math.random() * LOGOS.length));
  const dragging = useRef(false);
  const lastX = useRef(0);
  const rafSpin = useRef<number | null>(null);
  const auto = useRef(true);
  const lastSpinMark = useRef(0); // tracks completed half-spins for logo swap

  useEffect(() => {
    let last = performance.now();
    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      if (auto.current && !dragging.current) {
        setAngle((a) => {
          const next = a + (dt / 1000) * 33; // 33 deg/sec (50% faster)
          // Swap logo each time the back faces the viewer (every 360°, when front returns)
          const mark = Math.floor(next / 360);
          if (mark !== lastSpinMark.current) {
            lastSpinMark.current = mark;
            setLogoIdx((i) => (i + 1) % LOGOS.length);
          }
          return next;
        });
      }
      rafSpin.current = requestAnimationFrame(loop);
    };
    rafSpin.current = requestAnimationFrame(loop);
    return () => {
      if (rafSpin.current) cancelAnimationFrame(rafSpin.current);
    };
  }, []);

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    auto.current = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    setAngle((a) => {
      const next = a + dx * 0.6;
      const mark = Math.floor(Math.abs(next) / 360);
      if (mark !== lastSpinMark.current) {
        lastSpinMark.current = mark;
        setLogoIdx((i) => (i + 1) % LOGOS.length);
      }
      return next;
    });
  };
  const onUp = (e: React.PointerEvent) => {
    dragging.current = false;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  };

  const currentLogo = LOGOS[logoIdx];

  // Shared SVG defs for both faces
  const coinFace = (children: React.ReactNode, key: string) => (
    <svg
      key={key}
      viewBox="0 0 380 380"
      width="380"
      height="380"
      style={{ display: 'block' }}
    >
      <defs>
        <radialGradient id={`disk-${key}`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#E8D5A3" />
          <stop offset="55%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#6F5520" />
        </radialGradient>
        <linearGradient id={`rim-${key}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0E3B6" />
          <stop offset="100%" stopColor="#7A5C24" />
        </linearGradient>
      </defs>
      <circle cx="190" cy="190" r="185" fill={`url(#rim-${key})`} />
      <circle cx="190" cy="190" r="175" fill="#0A0A0F" />
      <circle cx="190" cy="190" r="170" fill={`url(#disk-${key})`} />
      {Array.from({ length: 32 }).map((_, i) => {
        const a = (i / 32) * Math.PI * 2;
        const x = 190 + Math.cos(a) * 158;
        const y = 190 + Math.sin(a) * 158;
        return <circle key={i} cx={x} cy={y} r="2.4" fill="#3A2A0E" />;
      })}
      <circle cx="190" cy="190" r="140" fill="none" stroke="#3A2A0E" strokeWidth="2" />
      <circle cx="190" cy="190" r="134" fill="none" stroke="rgba(58,42,14,0.5)" strokeWidth="1" />
      {children}
    </svg>
  );

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{ perspective: '1200px' }}
      onMouseEnter={() => { auto.current = false; setPaused(true); }}
      onMouseLeave={() => { if (!dragging.current) auto.current = true; setPaused(false); }}
    >
      <div
        className="absolute"
        style={{
          width: 460,
          height: 460,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.06) 35%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
      <div
        className="relative cursor-grab active:cursor-grabbing select-none touch-none"
        style={{
          width: 380,
          height: 380,
          transformStyle: 'preserve-3d',
          transform: `rotateY(${angle}deg)`,
          transition: dragging.current ? 'none' : 'transform 0.05s linear',
          filter: paused
            ? 'drop-shadow(0 0 28px rgba(201,168,76,0.55))'
            : 'drop-shadow(0 0 16px rgba(201,168,76,0.28))',
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {/* FRONT — rotating logo */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {coinFace(
            <>
              {/* White logo plate so PNGs read against gold */}
              <circle cx="190" cy="190" r="92" fill="#FAF6E8" stroke="#3A2A0E" strokeWidth="2" />
              <image
                href={currentLogo.src}
                x="110"
                y="110"
                width="160"
                height="160"
                preserveAspectRatio="xMidYMid meet"
                style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }}
              />
              <path id="med-arc-front" d="M 60 190 A 130 130 0 0 1 320 190" fill="none" />
              <text fill="#2A1E08" fontFamily="'Times New Roman', serif" fontWeight="700" fontSize="14" letterSpacing="6">
                <textPath href="#med-arc-front" startOffset="50%" textAnchor="middle">
                  CASTLE TOOLS
                </textPath>
              </text>
              <path id="med-arc-front-bot" d="M 60 200 A 130 130 0 0 0 320 200" fill="none" />
              <text fill="#2A1E08" fontFamily="'Times New Roman', serif" fontWeight="700" fontSize="11" letterSpacing="5">
                <textPath href="#med-arc-front-bot" startOffset="50%" textAnchor="middle">
                  ★ {currentLogo.name.toUpperCase()} ★
                </textPath>
              </text>
            </>,
            'front'
          )}
        </div>

        {/* BACK — "AI" engraving */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {coinFace(
            <>
              <text
                x="190"
                y="225"
                textAnchor="middle"
                fill="#2A1E08"
                fontFamily="'Times New Roman', serif"
                fontWeight="900"
                fontSize="140"
                letterSpacing="8"
              >
                AI
              </text>
              <path id="med-arc-back" d="M 60 190 A 130 130 0 0 1 320 190" fill="none" />
              <text fill="#2A1E08" fontFamily="'Times New Roman', serif" fontWeight="700" fontSize="14" letterSpacing="6">
                <textPath href="#med-arc-back" startOffset="50%" textAnchor="middle">
                  CASTLE TOOLS
                </textPath>
              </text>
              <path id="med-arc-back-bot" d="M 60 200 A 130 130 0 0 0 320 200" fill="none" />
              <text fill="#2A1E08" fontFamily="'Times New Roman', serif" fontWeight="700" fontSize="11" letterSpacing="5">
                <textPath href="#med-arc-back-bot" startOffset="50%" textAnchor="middle">
                  ★ EST · 2021 ★
                </textPath>
              </text>
            </>,
            'back'
          )}
        </div>
      </div>
      <p className="mt-5 text-xs" style={{ color: '#4A4A60' }}>Drag to spin</p>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16">
      <div className="container mx-auto px-4 relative z-10">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT */}
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
              style={{
                border: '1px solid rgba(201,168,76,0.4)',
                background: 'rgba(201,168,76,0.08)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: '#C9A84C' }} />
              <span className="text-[13px] font-medium" style={{ color: '#C9A84C', letterSpacing: '0.04em' }}>
                The Castle Tools Armoury
              </span>
            </div>

            <h1 className="font-display font-bold mb-6" style={{ color: '#F0EAD6' }}>
              Unlock the <span className="text-gradient-gold">Royal Vault</span> of Digital Tools
            </h1>

            <p className="text-base md:text-lg mb-8 max-w-xl" style={{ color: '#8A8AA0', lineHeight: 1.7 }}>
              Castle Tools is India's friendly little keep for genuine AI subscriptions, OTT plans, SEO suites, VPNs and pro software — handed over instantly at prices that quietly slash up to 80% off retail.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-md px-3 py-1.5 flex items-baseline gap-1.5"
                  style={{
                    background: 'hsl(240 18% 9%)',
                    border: '1px solid rgba(201,168,76,0.18)',
                  }}
                >
                  <span className="font-display text-sm font-bold" style={{ color: '#C9A84C' }}>
                    {s.value}
                  </span>
                  <span className="text-xs" style={{ color: '#8A8AA0' }}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-md transition-all hover:shadow-[0_0_20px_rgba(201,168,76,0.4)] active:scale-[0.97]"
                style={{ background: '#C9A84C', color: '#0A0A0F' }}
              >
                Explore Products <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/919773453978"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-md transition-all"
                style={{
                  background: 'transparent',
                  border: '1px solid #C9A84C',
                  color: '#C9A84C',
                }}
              >
                Contact Us
              </a>
            </div>

            <div className="flex flex-wrap gap-5 text-[13px]" style={{ color: '#8A8AA0' }}>
              {trust.map((t) => (
                <span key={t.text} className="inline-flex items-center gap-1.5">
                  <span style={{ color: '#C9A84C' }}>{t.icon}</span> {t.text}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center justify-center">
            <Medallion />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

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

/**
 * Castle-crest medallion — CSS 3D preserve-3d, draggable spin, glow bloom.
 */
const Medallion = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const rafSpin = useRef<number | null>(null);
  const auto = useRef(true);

  useEffect(() => {
    let last = performance.now();
    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      if (auto.current && !dragging.current) {
        setAngle((a) => a + (dt / 1000) * 18); // 18 deg/sec
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
    setAngle((a) => a + dx * 0.5);
  };
  const onUp = (e: React.PointerEvent) => {
    dragging.current = false;
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{ perspective: '1200px' }}
      onMouseEnter={() => { auto.current = false; setPaused(true); }}
      onMouseLeave={() => { if (!dragging.current) auto.current = true; setPaused(false); }}
    >
      {/* Bloom */}
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
        ref={wrapRef}
        className="relative cursor-grab active:cursor-grabbing select-none touch-none"
        style={{
          width: 380,
          height: 380,
          transformStyle: 'preserve-3d',
          transform: `rotateY(${angle}deg)`,
          transition: dragging.current ? 'none' : 'transform 0.05s linear',
          boxShadow: paused
            ? '0 0 60px rgba(201,168,76,0.45)'
            : '0 0 28px rgba(201,168,76,0.22)',
          borderRadius: '50%',
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {/* Medallion face */}
        <svg
          viewBox="0 0 380 380"
          width="380"
          height="380"
          style={{
            display: 'block',
            transformStyle: 'preserve-3d',
            transform: paused ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s ease',
          }}
        >
          <defs>
            <radialGradient id="med-disk" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#E8D5A3" />
              <stop offset="55%" stopColor="#C9A84C" />
              <stop offset="100%" stopColor="#6F5520" />
            </radialGradient>
            <linearGradient id="med-rim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F0E3B6" />
              <stop offset="100%" stopColor="#7A5C24" />
            </linearGradient>
          </defs>

          {/* Outer rim */}
          <circle cx="190" cy="190" r="185" fill="url(#med-rim)" />
          <circle cx="190" cy="190" r="175" fill="#0A0A0F" />
          {/* Inner gold disk */}
          <circle cx="190" cy="190" r="170" fill="url(#med-disk)" />
          {/* Ornamental ring of dots */}
          {Array.from({ length: 32 }).map((_, i) => {
            const a = (i / 32) * Math.PI * 2;
            const x = 190 + Math.cos(a) * 158;
            const y = 190 + Math.sin(a) * 158;
            return <circle key={i} cx={x} cy={y} r="2.4" fill="#3A2A0E" />;
          })}
          {/* Inner ring */}
          <circle cx="190" cy="190" r="140" fill="none" stroke="#3A2A0E" strokeWidth="2" />
          <circle cx="190" cy="190" r="134" fill="none" stroke="rgba(58,42,14,0.5)" strokeWidth="1" />

          {/* Castle crest engraving */}
          <g fill="#2A1E08" stroke="#2A1E08" strokeWidth="1">
            {/* Main tower */}
            <rect x="170" y="160" width="40" height="100" />
            <polygon points="170,160 190,130 210,160" />
            <path d="M170,160 L170,150 L178,150 L178,160 L186,160 L186,150 L194,150 L194,160 L202,160 L202,150 L210,150 L210,160 Z" />
            {/* Left flanking tower */}
            <rect x="140" y="190" width="26" height="70" />
            <polygon points="140,190 153,170 166,190" />
            <path d="M140,190 L140,182 L147,182 L147,190 L153,190 L153,182 L160,182 L160,190 L166,190 Z" />
            {/* Right flanking tower */}
            <rect x="214" y="190" width="26" height="70" />
            <polygon points="214,190 227,170 240,190" />
            <path d="M214,190 L214,182 L221,182 L221,190 L227,190 L227,182 L234,182 L234,190 L240,190 Z" />
            {/* Arched door */}
            <path d="M183,260 L183,235 Q183,225 190,225 Q197,225 197,235 L197,260 Z" fill="#0A0A0F" stroke="none" />
            {/* Windows */}
            <ellipse cx="190" cy="195" rx="3" ry="6" fill="#0A0A0F" stroke="none" />
            <ellipse cx="152" cy="220" rx="2.5" ry="5" fill="#0A0A0F" stroke="none" />
            <ellipse cx="227" cy="220" rx="2.5" ry="5" fill="#0A0A0F" stroke="none" />
          </g>

          {/* "DREAMCREST" banner text */}
          <path id="med-arc" d="M 60 190 A 130 130 0 0 1 320 190" fill="none" />
          <text fill="#2A1E08" fontFamily="'Cinzel Decorative', serif" fontWeight="700" fontSize="14" letterSpacing="6">
            <textPath href="#med-arc" startOffset="50%" textAnchor="middle">
              DREAMCREST
            </textPath>
          </text>
          <path id="med-arc-bot" d="M 60 200 A 130 130 0 0 0 320 200" fill="none" />
          <text fill="#2A1E08" fontFamily="'Cinzel Decorative', serif" fontWeight="700" fontSize="11" letterSpacing="5">
            <textPath href="#med-arc-bot" startOffset="50%" textAnchor="middle">
              ★ EST · 2021 ★
            </textPath>
          </text>
        </svg>
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
                Premium Digital Marketplace
              </span>
            </div>

            <h1 className="font-display font-bold mb-6" style={{ color: '#F0EAD6' }}>
              Explore Our <span className="text-gradient-gold">Universe</span> of Tools
            </h1>

            <p className="text-base md:text-lg mb-8 max-w-xl" style={{ color: '#8A8AA0', lineHeight: 1.7 }}>
              India's most trusted store for premium AI tools, OTT subscriptions, SEO tools, VPN & software at up to 80% off. 15,000+ happy customers delivered since 2021.
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
                href="https://wa.me/916357998730"
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

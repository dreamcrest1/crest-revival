import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { UsersIcon, BoxIcon, CalendarIcon, ShieldCheckIcon } from '@/components/icons/BrandIcons';

const stats = [
  { value: '15,000+', label: 'Loyal Patrons', Icon: UsersIcon },
  { value: '200+', label: 'Wares in Armoury', Icon: BoxIcon },
  { value: 'Since 2021', label: 'Years of Honour', Icon: CalendarIcon },
  { value: '24/7', label: 'Sentry on Duty', Icon: ShieldCheckIcon },
];

// Crossed swords divider
const SwordDivider = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 320 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4">
    <line x1="0" y1="12" x2="120" y2="12" strokeOpacity="0.5" />
    <line x1="200" y1="12" x2="320" y2="12" strokeOpacity="0.5" />
    <g transform="translate(160 12)" strokeOpacity="0.95">
      <path d="M-20 -10 L20 10" />
      <path d="M-20 10 L20 -10" />
      <circle r="3" fill="currentColor" />
    </g>
  </svg>
);

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-16 overflow-hidden">
      {/* Castle silhouette skyline */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none" aria-hidden>
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="w-full h-full opacity-90">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(28 25% 8%)" stopOpacity="0" />
              <stop offset="100%" stopColor="hsl(28 25% 4%)" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect width="1440" height="400" fill="url(#sky)" />
          <g fill="hsl(28 30% 5%)">
            <path d="M0 400 L0 240 L80 240 L80 200 L120 200 L120 240 L200 240 L200 180 L240 180 L240 140 L260 140 L260 100 L300 100 L300 140 L320 140 L320 180 L360 180 L360 220 L420 220 L420 260 L520 260 L520 200 L560 200 L560 160 L580 160 L580 120 L620 120 L620 160 L640 160 L640 200 L700 200 L700 240 L820 240 L820 180 L860 180 L860 220 L920 220 L920 260 L1020 260 L1020 200 L1060 200 L1060 160 L1100 160 L1100 200 L1140 200 L1140 240 L1220 240 L1220 280 L1320 280 L1320 220 L1360 220 L1360 260 L1440 260 L1440 400 Z" />
          </g>
          <g fill="hsl(43 79% 46%)" opacity="0.18">
            <circle cx="280" cy="120" r="2" /><circle cx="600" cy="140" r="2" /><circle cx="850" cy="200" r="2" /><circle cx="1080" cy="180" r="2" />
          </g>
        </svg>
      </div>

      {/* Drifting fog */}
      <div className="absolute inset-x-0 bottom-1/3 h-32 opacity-40 pointer-events-none animate-mist" aria-hidden>
        <div className="w-[200%] h-full bg-[radial-gradient(ellipse_at_center,hsl(36_30%_60%/0.25),transparent_60%)]" />
      </div>

      {/* Side pillars */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[hsl(28_25%_4%)] via-[hsl(28_22%_10%)] to-transparent border-r border-primary/15" aria-hidden />
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[hsl(28_25%_4%)] via-[hsl(28_22%_10%)] to-transparent border-l border-primary/15" aria-hidden />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Banner flag */}
            <div className="inline-block mb-8 origin-left animate-flag-wave">
              <div className="bg-destructive text-vellum border border-primary/60 px-5 py-2 pennant shadow-lg">
                <span className="flex items-center gap-2 text-xs font-display tracking-[0.2em] uppercase">
                  <Zap className="w-3.5 h-3.5 text-primary" /> Up to 80% Off the Royal Wares
                </span>
              </div>
            </div>

            <SwordDivider className="text-primary mb-4 w-72 torch-flicker" />

            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] leading-[1.1] mb-5 text-gold-glow tracking-wide">
              Buy Premium Digital Wares{' '}
              <span className="block text-vellum">at a Pauper's Price</span>
              <span className="block text-gradient">in the Realm of India</span>
            </h1>

            <SwordDivider className="text-primary mb-7 w-72" />

            <p className="font-script text-vellum/80 text-lg md:text-xl mb-10 max-w-lg leading-relaxed italic">
              The realm's most trusted storehouse for AI relics, OTT scrolls, SEO sigils, VPN cloaks &amp; sovereign software — up to 80% off. 15,000+ loyal patrons served since the year 2021.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Button size="lg" asChild>
                <Link to="/products">
                  ⚜ Explore the Armoury <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://wa.me/916357998730" target="_blank" rel="noopener noreferrer">
                  Send a Raven
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-vellum/70">
              <span className="flex items-center gap-2.5 font-script italic">
                <Shield className="w-4 h-4 text-primary" /> 100% Genuine Steel
              </span>
              <span className="flex items-center gap-2.5 font-script italic">
                <Zap className="w-4 h-4 text-primary" /> Instant Courier
              </span>
              <span className="flex items-center gap-2.5 font-script italic">
                <Clock className="w-4 h-4 text-primary" /> Sentry 24/7
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-5"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="group relative stone-tablet p-7 text-center card-hover overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-primary/[0.1] to-transparent pointer-events-none" />
                {/* corner flourishes */}
                <span className="absolute top-1 left-1 text-primary/60 text-xs">⚜</span>
                <span className="absolute top-1 right-1 text-primary/60 text-xs">⚜</span>
                <span className="absolute bottom-1 left-1 text-primary/60 text-xs">⚜</span>
                <span className="absolute bottom-1 right-1 text-primary/60 text-xs">⚜</span>
                <div className="relative z-10">
                  <stat.Icon className="w-8 h-8 mx-auto mb-3 text-primary torch-flicker" />
                  <div className="font-display text-2xl md:text-3xl font-bold text-gold-glow mb-1">{stat.value}</div>
                  <div className="text-sm text-vellum/70 font-script italic">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

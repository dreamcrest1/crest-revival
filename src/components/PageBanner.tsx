import { ReactNode } from 'react';

type Props = {
  eyebrow?: string;
  title: ReactNode;
  highlight?: string;
  subtitle?: string;
  children?: ReactNode;
};

/**
 * Medieval parchment-scroll page banner: crown crest, gold rules, and
 * Cinzel display heading. Used as the unified hero for inner pages.
 */
const PageBanner = ({ eyebrow, title, highlight, subtitle, children }: Props) => {
  return (
    <div className="text-center mb-10 relative">
      {/* Crown crest */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <svg viewBox="0 0 64 48" className="w-14 h-10 text-primary drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)]" fill="currentColor" aria-hidden="true">
            <path d="M4 14 L14 30 L24 10 L32 32 L40 10 L50 30 L60 14 L56 42 L8 42 Z" opacity=".9" />
            <circle cx="14" cy="10" r="3" />
            <circle cx="32" cy="6" r="3.5" />
            <circle cx="50" cy="10" r="3" />
          </svg>
        </div>
      </div>

      {eyebrow && (
        <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary bg-primary/10 border border-primary/30 px-3 py-1 rounded-full mb-4">
          ✦ {eyebrow} ✦
        </div>
      )}

      <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-3 tracking-wide">
        {title}{' '}
        {highlight && <span className="text-primary italic">{highlight}</span>}
      </h1>

      {/* Gold rule */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-primary/60" />
        <span className="text-primary text-xs">❖</span>
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-primary/60" />
      </div>

      {subtitle && (
        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      )}

      {children}
    </div>
  );
};

export default PageBanner;

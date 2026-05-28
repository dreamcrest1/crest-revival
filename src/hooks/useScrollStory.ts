import { useEffect, useState } from 'react';

/**
 * Tracks document scroll progress as a 0..1 value and writes it to
 * the CSS custom property `--scroll-p` on <html>, throttled via rAF.
 * Also returns the live progress for components that want to read it in JS.
 */
export function useScrollStory() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    let last = -1;

    const update = () => {
      const scrollTop = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(scrollTop / max, 0), 1) : 0;
      if (Math.abs(p - last) > 0.0005) {
        last = p;
        document.documentElement.style.setProperty('--scroll-p', p.toFixed(4));
        setProgress(p);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return progress;
}

export const chapterOpacity = (
  start: number,
  peak: number,
  fade: number,
  end: number,
  p: number,
) => {
  if (p < start) return 0;
  if (p < peak) return (p - start) / (peak - start);
  if (p < fade) return 1;
  if (p < end) return 1 - (p - fade) / (end - fade);
  return 0;
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

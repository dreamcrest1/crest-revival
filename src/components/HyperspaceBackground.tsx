import { useEffect, useRef } from 'react';

const HyperspaceBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: { x: number; y: number; z: number; px: number; py: number }[] = [];
    const STAR_COUNT = 400;
    const SPEED = 1.8;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: (Math.random() - 0.5) * canvas.width * 2,
        y: (Math.random() - 0.5) * canvas.height * 2,
        z: Math.random() * canvas.width,
        px: 0,
        py: 0,
      });
    }

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Fade trail - use background color, NOT black
      ctx.fillStyle = 'rgba(13, 15, 25, 0.18)';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const sx = (s.x / s.z) * w + cx;
        const sy = (s.y / s.z) * h + cy;
        const size = Math.max(0, (1 - s.z / w) * 2.5);

        if (s.px !== 0 && s.py !== 0) {
          const opacity = Math.max(0, 1 - s.z / w);
          const distFromCenter = Math.sqrt((sx - cx) ** 2 + (sy - cy) ** 2);
          const maxDist = Math.sqrt(cx ** 2 + cy ** 2);
          const ratio = distFromCenter / maxDist;

          if (ratio < 0.3) {
            ctx.strokeStyle = `rgba(245, 158, 66, ${opacity * 0.5})`;
          } else if (ratio < 0.6) {
            ctx.strokeStyle = `rgba(180, 195, 240, ${opacity * 0.3})`;
          } else {
            ctx.strokeStyle = `rgba(140, 160, 210, ${opacity * 0.2})`;
          }

          ctx.lineWidth = size * 0.8;
          ctx.beginPath();
          ctx.moveTo(s.px, s.py);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        }

        // Draw star point - subtle glow
        ctx.fillStyle = `rgba(200, 215, 255, ${Math.max(0, 1 - s.z / w) * 0.5})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size * 0.4, 0, Math.PI * 2);
        ctx.fill();

        s.px = sx;
        s.py = sy;
        s.z -= SPEED;

        if (s.z <= 0 || sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) {
          s.x = (Math.random() - 0.5) * w * 2;
          s.y = (Math.random() - 0.5) * h * 2;
          s.z = w;
          s.px = 0;
          s.py = 0;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'hsl(225, 25%, 7%)' }}
    />
  );
};

export default HyperspaceBackground;

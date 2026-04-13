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
    const STAR_COUNT = 600;
    const SPEED = 2.5;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize stars
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

      // Fade trail
      ctx.fillStyle = 'rgba(8, 10, 18, 0.15)';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Project
        const sx = (s.x / s.z) * w + cx;
        const sy = (s.y / s.z) * h + cy;

        // Size based on depth
        const size = Math.max(0, (1 - s.z / w) * 3);

        // Draw streak
        if (s.px !== 0 && s.py !== 0) {
          const opacity = Math.max(0, 1 - s.z / w);
          // Orange-tinted stars near center, white/blue elsewhere
          const distFromCenter = Math.sqrt((sx - cx) ** 2 + (sy - cy) ** 2);
          const maxDist = Math.sqrt(cx ** 2 + cy ** 2);
          const ratio = distFromCenter / maxDist;

          if (ratio < 0.3) {
            ctx.strokeStyle = `rgba(245, 158, 66, ${opacity * 0.8})`;
          } else if (ratio < 0.6) {
            ctx.strokeStyle = `rgba(200, 210, 255, ${opacity * 0.6})`;
          } else {
            ctx.strokeStyle = `rgba(150, 170, 220, ${opacity * 0.4})`;
          }

          ctx.lineWidth = size;
          ctx.beginPath();
          ctx.moveTo(s.px, s.py);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        }

        // Draw star point
        ctx.fillStyle = `rgba(220, 230, 255, ${Math.max(0, 1 - s.z / w) * 0.8})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        s.px = sx;
        s.py = sy;

        // Move star closer
        s.z -= SPEED;

        // Reset if past camera
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
      style={{ background: 'hsl(220, 20%, 6%)' }}
    />
  );
};

export default HyperspaceBackground;

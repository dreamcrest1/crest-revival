import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  alpha: number;
  size: number;
  vx: number;
  vy: number;
}

const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      // Spawn particles
      for (let i = 0; i < 2; i++) {
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          alpha: 1,
          size: Math.random() * 3 + 1.5,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter(p => p.alpha > 0.01);

      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha *= 0.94;
        p.size *= 0.97;

        // Orange glow trail matching brand
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, `rgba(245, 158, 66, ${p.alpha})`);
        gradient.addColorStop(0.5, `rgba(245, 120, 40, ${p.alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(245, 100, 30, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Keep particles manageable
      if (particles.current.length > 150) {
        particles.current = particles.current.slice(-150);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
    />
  );
};

export default CursorTrail;

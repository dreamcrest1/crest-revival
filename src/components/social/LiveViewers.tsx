import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

// Deterministic per-product viewer count that jitters every ~30s.
// Seed = product id + current hour bucket → reproducible across users.

const hashSeed = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const calcViewers = (productId: string): number => {
  const bucket = Math.floor(Date.now() / (60 * 60 * 1000)); // hour bucket
  const seed = hashSeed(`${productId}:${bucket}`);
  // 4 to 37 range
  return 4 + (seed % 34);
};

const LiveViewers = ({ productId }: { productId: string }) => {
  const [n, setN] = useState(() => calcViewers(productId));

  useEffect(() => {
    setN(calcViewers(productId));
    const tick = () => {
      // small ±2 jitter to feel alive
      setN((prev) => {
        const target = calcViewers(productId);
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(3, target + delta);
      });
    };
    const id = setInterval(tick, 25000 + Math.random() * 15000);
    return () => clearInterval(id);
  }, [productId]);

  return (
    <div className="inline-flex items-center gap-2 text-xs text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
      </span>
      <Eye className="w-3 h-3" />
      <span className="font-medium">{n} people viewing this now</span>
    </div>
  );
};

export default LiveViewers;

import { Star } from 'lucide-react';

interface Props {
  rating: number;
  count: number;
  size?: 'sm' | 'md';
  className?: string;
}

const StarBadge = ({ rating, count, size = 'sm', className = '' }: Props) => {
  if (!count) return null;
  const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  return (
    <div className={`inline-flex items-center gap-1 text-amber-400 ${className}`}>
      <Star className={`${starSize} fill-current`} />
      <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
      <span className="text-[10px] text-muted-foreground">({count})</span>
    </div>
  );
};

export default StarBadge;

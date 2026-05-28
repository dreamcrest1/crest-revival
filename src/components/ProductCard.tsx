import { type Product } from '@/hooks/useProducts';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useImageValid, isLikelyValidLink } from '@/hooks/useImageValid';
import { slugify } from '@/lib/productSeo';

const PLACEHOLDER = '/placeholder.svg';

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const imgState = useImageValid(product.image);
  const linkOk = isLikelyValidLink(product.buyLink);

  if (imgState === false && !linkOk) return null;

  const safeImage = imgState === false ? PLACEHOLDER : product.image;
  const detailHref = `/product/${slugify(product.name)}`;

  return (
    <Link
      to={detailHref}
      className="group relative block stone-tablet overflow-hidden card-hover"
      style={{ borderRadius: '2px' }}
    >
      {/* Corner flourishes */}
      <span className="absolute top-1 left-1 text-primary/70 text-xs z-20 pointer-events-none torch-flicker">⚜</span>
      <span className="absolute top-1 right-1 text-primary/70 text-xs z-20 pointer-events-none torch-flicker">⚜</span>
      <span className="absolute bottom-1 left-1 text-primary/70 text-xs z-20 pointer-events-none">⚜</span>
      <span className="absolute bottom-1 right-1 text-primary/70 text-xs z-20 pointer-events-none">⚜</span>

      {/* Golden halo on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-primary/[0.12] via-transparent to-transparent pointer-events-none z-10" />

      {/* Stained-glass / gothic arch image frame */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-[hsl(28_22%_8%)] to-[hsl(28_22%_4%)] m-2 border border-primary/30 gothic-arch">
        <img
          src={safeImage}
          alt={`${product.name} – cheap ${product.category} group buy in India`}
          width="400"
          height="400"
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
          style={{ filter: 'drop-shadow(0 0 12px hsl(43 79% 46% / 0.15))' }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
        />
        {/* warm stained-glass overlay */}
        <div className="absolute inset-0 mix-blend-overlay opacity-30 bg-gradient-to-tr from-primary/40 via-transparent to-destructive/30 pointer-events-none" />

        {/* Discount pennant */}
        {product.discount && (
          <span className="absolute top-0 left-3 bg-destructive text-vellum text-[10px] font-display tracking-wider px-2.5 pt-1 pb-3 pennant shadow-lg z-20">
            {product.discount}
          </span>
        )}
        {product.isHotSelling && (
          <span className="absolute top-0 right-3 bg-[hsl(120_30%_25%)] text-vellum text-[10px] font-display tracking-wider px-2.5 pt-1 pb-3 pennant shadow-lg z-20">
            🔥 HOT
          </span>
        )}

        {/* Wax-seal price */}
        <span className="absolute -bottom-3 right-3 w-14 h-14 wax-seal rounded-full flex flex-col items-center justify-center text-[11px] font-display font-bold leading-tight z-20">
          {product.price}
        </span>
      </div>

      {/* Parchment ribbon name banner */}
      <div className="relative mx-2 -mt-1 parchment px-3 py-2 border border-[hsl(28_50%_25%/0.5)]" style={{ clipPath: 'polygon(4% 0, 96% 0, 100% 50%, 96% 100%, 4% 100%, 0 50%)' }}>
        <h3 className="font-display font-semibold text-[hsl(var(--ink))] text-xs leading-tight line-clamp-2 text-center">
          {product.name}
        </h3>
      </div>

      {/* Content */}
      <div className="p-3 pt-3 relative z-10">
        <p className="text-[10px] text-vellum/50 font-script italic truncate mb-2 text-center tracking-wider uppercase">{product.category}</p>

        {product.originalPrice && (
          <p className="text-center text-[11px] text-vellum/40 line-through mb-2 font-script">
            {product.originalPrice}
          </p>
        )}

        <div className="flex gap-2">
          {/* Shield-shape Claim button */}
          <div className="flex-1 relative h-10">
            <div className="absolute inset-0 shield-shape bg-gradient-to-b from-destructive to-[hsl(0_100%_18%)] border border-primary/60 flex items-center justify-center text-vellum text-[11px] font-display tracking-[0.15em] uppercase group-hover:shadow-[0_0_18px_hsl(43_79%_46%/0.6)] transition-shadow">
              ⚔ Claim
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
            aria-label={`Add ${product.name} to cart`}
            className="w-10 h-10 flex items-center justify-center bg-primary text-[hsl(var(--ink))] rounded-sm border border-primary/80 hover:shadow-[0_0_14px_hsl(43_79%_46%/0.7)] transition-all shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

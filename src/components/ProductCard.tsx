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

  // Hide the product entirely when its image is confirmed broken AND the buy link
  // is also unusable — this keeps shelves looking clean during outages.
  if (imgState === false && !linkOk) return null;

  const safeImage = imgState === false ? PLACEHOLDER : product.image;
  const detailHref = `/product/${slugify(product.name)}`;

  return (
    <Link
      to={detailHref}
      className="group relative block bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none z-10" />

      {/* Product image */}
      <div className="relative bg-secondary/20 overflow-hidden aspect-square">
        <img
          src={safeImage}
          alt={`${product.name} – cheap ${product.category} group buy in India`}
          width="400"
          height="400"
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
        />
        {product.discount && (
          <span className="absolute top-2.5 left-2.5 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
            {product.discount}
          </span>
        )}
        {product.isHotSelling && (
          <span className="absolute top-2.5 right-2.5 bg-destructive text-destructive-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
            🔥 HOT
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 relative z-10">
        <h3 className="font-display font-semibold text-foreground text-sm leading-tight mb-1 line-clamp-2 min-h-[36px]">
          {product.name}
        </h3>
        <p className="text-[11px] text-muted-foreground/60 font-medium truncate mb-2">{product.category}</p>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-display font-bold text-lg text-primary">{product.price}</span>
          {product.originalPrice && (
            <span className="text-[11px] text-muted-foreground line-through">{product.originalPrice}</span>
          )}
        </div>

        <div className="flex gap-2">
          <span className="flex-1 text-center bg-primary/10 text-primary border border-primary/20 rounded-xl py-2 text-xs font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            View Details
          </span>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
            aria-label={`Add ${product.name} to cart`}
            className="w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground rounded-xl hover:bg-primary/80 transition-all duration-300 shrink-0"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

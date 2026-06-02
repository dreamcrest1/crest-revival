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
      className="group relative block overflow-hidden rounded-xl border border-primary/15 bg-card/70 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_0_28px_hsl(var(--primary)/0.35),0_0_60px_hsl(var(--accent)/0.18)]"
    >
      {/* Image */}
      <div
        className="relative overflow-hidden aspect-square"
        style={{
          background:
            'linear-gradient(135deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)',
        }}
      >
        <img
          src={safeImage}
          alt={`${product.name} – cheap ${product.category} group buy in India`}
          width="400"
          height="400"
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            if (img.src.indexOf(PLACEHOLDER) === -1) img.src = PLACEHOLDER;
          }}
        />
        {product.discount && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[11px] font-bold bg-background/85 text-primary border border-primary/30">
            {product.discount}
          </span>
        )}
        {product.isHotSelling && (
          <span
            className="absolute -top-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center font-bold text-[9px] tracking-wider"
            style={{
              background: 'radial-gradient(circle at 35% 35%, hsl(var(--primary)), hsl(var(--secondary)))',
              color: 'hsl(var(--primary-foreground))',
              boxShadow:
                '0 2px 12px hsl(var(--primary)/0.55), inset 0 -2px 4px rgba(0,0,0,0.3)',
              border: '1.5px solid hsl(var(--primary))',
              transform: 'rotate(-12deg)',
            }}
          >
            HOT
          </span>
        )}
      </div>

      {/* Neon separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent" />

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-[15px] font-bold leading-tight mb-2 line-clamp-2 min-h-[40px] text-foreground">
          {product.name}
        </h3>
        {product.category && (
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium mb-2 bg-secondary/25 text-secondary-foreground border border-secondary/30">
            {product.category}
          </span>
        )}

        <div className="flex items-baseline gap-2 mb-3 flex-wrap">
          <span className="font-display font-bold text-lg text-primary">
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs line-through text-muted-foreground">
              {product.originalPrice}
            </span>
          )}
          {product.discount && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/15 text-accent">
              {product.discount}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <span className="flex-1 text-center rounded text-xs font-semibold py-2 border border-primary text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
            View Details
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            aria-label={`Add ${product.name} to cart`}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_16px_hsl(var(--primary)/0.6)]"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

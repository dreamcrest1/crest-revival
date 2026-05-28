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
      className="group relative block overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'hsl(240 18% 9%)',
        border: '1px solid rgba(201,168,76,0.12)',
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      <style>{`
        .castle-product-card:hover { border-color: rgba(201,168,76,0.5); box-shadow: 0 0 24px rgba(201,168,76,0.2); }
      `}</style>
      <div className="castle-product-card absolute inset-0 rounded-[12px] pointer-events-none transition-all" />

      {/* Image */}
      <div className="relative bg-white overflow-hidden aspect-square">
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
        {product.validity && (
          <span
            className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[11px] font-medium"
            style={{ background: 'rgba(34,34,58,0.92)', color: '#8A8AA0' }}
          >
            {product.validity}
          </span>
        )}
        {product.isHotSelling && (
          <span
            className="absolute -top-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center font-bold text-[9px] tracking-wider"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #E84A3E, #8B1A14)',
              color: '#FFF7E8',
              boxShadow: '0 2px 8px rgba(192,57,43,0.5), inset 0 -2px 4px rgba(0,0,0,0.3)',
              border: '1.5px solid #5C1410',
              transform: 'rotate(-12deg)',
            }}
          >
            HOT
          </span>
        )}
      </div>

      {/* Gold separator */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-display text-[15px] font-bold leading-tight mb-2 line-clamp-2 min-h-[40px]"
          style={{ color: '#F0EAD6' }}
        >
          {product.name}
        </h3>
        {product.category && (
          <span
            className="inline-block px-2 py-0.5 rounded text-[10px] font-medium mb-2"
            style={{ background: '#2A1E3F', color: '#9B77D4' }}
          >
            {product.category}
          </span>
        )}

        <div className="flex items-baseline gap-2 mb-3 flex-wrap">
          <span className="font-display font-bold text-lg" style={{ color: '#C9A84C' }}>
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs line-through" style={{ color: '#4A4A60' }}>
              {product.originalPrice}
            </span>
          )}
          {product.discount && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(192,57,43,0.15)', color: '#E84A3E' }}
            >
              {product.discount}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <span
            className="flex-1 text-center rounded text-xs font-semibold py-2 transition-all group-hover:bg-[#C9A84C] group-hover:text-[#0A0A0F]"
            style={{ border: '1px solid #C9A84C', color: '#C9A84C', borderRadius: 6 }}
          >
            View Details
          </span>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
            aria-label={`Add ${product.name} to cart`}
            className="w-9 h-9 flex items-center justify-center transition-all hover:scale-105"
            style={{ background: '#C9A84C', color: '#0A0A0F', borderRadius: '50%' }}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

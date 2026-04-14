import { type Product } from '@/data/products';

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group relative bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl overflow-hidden card-hover">
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none z-10" />

      {/* Product image */}
      <div className="relative bg-secondary/30 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[180px] object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.discount && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_12px_hsl(24_95%_53%/0.3)]">
            {product.discount}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 relative z-10">
        <h3 className="font-display font-semibold text-foreground text-sm leading-tight mb-1.5 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2 min-h-[32px] leading-relaxed">
          {product.description}
        </p>
        <p className="text-xs text-muted-foreground/60 mb-3 font-medium">{product.category}</p>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-display font-bold text-xl text-primary">{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">{product.originalPrice}</span>
          )}
        </div>

        <a
          href="https://superprofile.bio/vp/dreamcrest-payments"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-primary/10 text-primary border border-primary/20 rounded-xl py-2.5 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-[0_0_20px_hsl(24_95%_53%/0.25)]"
        >
          Buy Now
        </a>
      </div>
    </div>
  );
};

export default ProductCard;

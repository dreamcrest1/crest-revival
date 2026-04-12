import { type Product } from '@/data/products';

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden card-hover group">
      {/* Header with emoji and discount */}
      <div className="relative bg-secondary/50 p-6 flex items-center justify-center min-h-[120px]">
        <span className="text-5xl">{product.emoji}</span>
        {product.discount && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
            {product.discount}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground text-sm leading-tight mb-1 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-3">{product.category}</p>

        <div className="flex items-baseline gap-2">
          <span className="font-display font-bold text-lg text-primary">{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">{product.originalPrice}</span>
          )}
        </div>

        <a
          href="https://wa.me/916357998730"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block w-full text-center bg-primary/10 text-primary border border-primary/20 rounded-lg py-2 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
        >
          Buy Now
        </a>
      </div>
    </div>
  );
};

export default ProductCard;

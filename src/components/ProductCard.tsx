import { type Product } from '@/data/products';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Tag, Shield } from 'lucide-react';
import { WhatsAppIcon } from '@/components/SocialIcons';

const ProductCard = ({ product }: { product: Product }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="group relative bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 cursor-pointer"
      >
        {/* Hover glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none z-10" />

        {/* Product image - centered for any size */}
        <div className="relative bg-secondary/20 overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.discount && (
            <span className="absolute top-2.5 left-2.5 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
              {product.discount}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 relative z-10">
          <h3 className="font-display font-semibold text-foreground text-sm leading-tight mb-1 line-clamp-2 min-h-[36px]">
            {product.name}
          </h3>
          <p className="text-[11px] text-muted-foreground/60 mb-2 font-medium">{product.category}</p>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-display font-bold text-lg text-primary">{product.price}</span>
            {product.originalPrice && (
              <span className="text-[11px] text-muted-foreground line-through">{product.originalPrice}</span>
            )}
          </div>

          <button className="w-full text-center bg-primary/10 text-primary border border-primary/20 rounded-xl py-2 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            View Details
          </button>
        </div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-card border border-border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-card/80 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image */}
              <div className="relative bg-secondary/20 overflow-hidden rounded-t-2xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-contain object-center"
                />
                {product.discount && (
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                    {product.discount}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="p-6">
                <span className="text-[10px] uppercase tracking-wider text-primary font-semibold bg-primary/10 px-2.5 py-1 rounded-full">
                  {product.emoji} {product.category}
                </span>

                <h2 className="font-display font-bold text-foreground text-xl mt-3 mb-2">{product.name}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{product.description}</p>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="font-display font-bold text-3xl text-primary">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                  )}
                </div>

                {/* Trust badges */}
                <div className="flex gap-4 mb-5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-primary" /> 100% Genuine</span>
                  <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5 text-primary" /> Best Price</span>
                </div>

                {/* CTA buttons */}
                <div className="flex gap-3">
                  <a
                    href="https://superprofile.bio/vp/dreamcrest-payments"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    <ExternalLink className="w-4 h-4" /> Buy Now
                  </a>
                  <a
                    href={`https://wa.me/916357998730?text=${encodeURIComponent(`Hi! I'm interested in ${product.name} (${product.price}). Please share details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;

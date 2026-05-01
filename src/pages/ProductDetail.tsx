import { useParams, Link } from 'react-router-dom';
import { ExternalLink, ShoppingCart, Shield, Tag, ArrowLeft } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { findProductBySlug, buildProductSeo } from '@/lib/productSeo';
import { useImageValid } from '@/hooks/useImageValid';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEOHead from '@/components/SEOHead';
import { WhatsAppIcon } from '@/components/SocialIcons';

const PLACEHOLDER = '/placeholder.svg';

const ProductDetail = () => {
  const { slug = '' } = useParams();
  const { data, isLoading } = useProducts();
  const { addToCart } = useCart();
  const products = data?.products || [];
  const product = findProductBySlug(products, slug);

  const imgState = useImageValid(product?.image);
  const safeImage = imgState === false ? PLACEHOLDER : product?.image || PLACEHOLDER;

  if (isLoading) {
    return (
      <div className="min-h-screen relative z-10">
        <Navbar />
        <div className="pt-28 pb-16 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen relative z-10">
        <SEOHead title="Product Not Found | Dreamcrest Solutions" noindex />
        <Navbar />
        <div className="pt-28 pb-16 container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">Product not found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or was removed.</p>
          <Link to="/products" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to all products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const seo = buildProductSeo(product);

  return (
    <div className="min-h-screen relative z-10">
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonical={seo.canonical}
        ogImage={product.image}
        ogType="product"
        jsonLd={seo.jsonLd}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: product.category, url: `/products?category=${product.category}` },
          { name: product.name, url: `/product/${seo.slug}` },
        ]}
      />
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to products
          </Link>

          <div className="grid md:grid-cols-2 gap-8 bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl overflow-hidden p-6 md:p-8">
            {/* Image */}
            <div className="bg-secondary/20 rounded-xl overflow-hidden aspect-square">
              <img
                src={safeImage}
                alt={`${product.name} – Cheap ${product.name} India at ${product.price}`}
                className="w-full h-full object-contain object-center"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
              />
            </div>

            {/* Details */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-primary font-semibold bg-primary/10 px-2.5 py-1 rounded-full">
                {product.emoji} {product.category}
              </span>

              <h1 className="font-display font-bold text-foreground text-2xl md:text-3xl mt-3 mb-2">{product.name}</h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {product.description || `Premium ${product.name} at the most affordable group buy price in India. Genuine subscription with full warranty.`}
              </p>

              <div className="flex items-baseline gap-3 mb-5">
                <span className="font-display font-bold text-3xl text-primary">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                )}
                {product.discount && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">{product.discount}</span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mb-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-primary" /> 100% Genuine</span>
                <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5 text-primary" /> Lowest Price India</span>
                <span className="flex items-center gap-1">⚡ Instant Delivery</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={product.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <ExternalLink className="w-4 h-4" /> Buy Now
                </a>
                <button
                  onClick={() => addToCart(product)}
                  className="flex items-center justify-center gap-2 bg-secondary border border-border rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <a
                  href={`https://wa.me/916357998730?text=${encodeURIComponent(`Hi! I'm interested in ${product.name} (${product.price}). Please share details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4" /> WhatsApp
                </a>
              </div>

              {/* SEO content block — visible & crawlable */}
              <div className="mt-8 pt-6 border-t border-border/60">
                <h2 className="font-display font-semibold text-foreground text-lg mb-2">
                  Why buy {product.name} from Dreamcrest?
                </h2>
                <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
                  <li>Cheapest {product.name} group buy price in India — only {product.price}.</li>
                  <li>100% genuine {product.category} subscription with warranty.</li>
                  <li>Instant WhatsApp delivery within minutes of payment.</li>
                  <li>Trusted by 15,000+ customers since 2021.</li>
                  <li>24/7 customer support for any issues or replacements.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetail;

import { useParams, Link } from 'react-router-dom';
import { ExternalLink, ShoppingCart, Shield, Tag, ArrowLeft, Zap, Clock, RefreshCw, Headphones, CheckCircle2, Star } from 'lucide-react';
import { useProducts, type Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { findProductBySlug, buildProductSeo, slugify } from '@/lib/productSeo';
import { useImageValid } from '@/hooks/useImageValid';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEOHead from '@/components/SEOHead';
import { WhatsAppIcon } from '@/components/SocialIcons';
import ProductReviews from '@/components/ProductReviews';
import { useRatingStats } from '@/hooks/useProductReviews';
import LiveViewers from '@/components/social/LiveViewers';
import { waLink } from '@/lib/whatsapp';
import { trackEvent } from '@/lib/eventTracker';
import { useEffect } from 'react';

const PLACEHOLDER = '/placeholder.svg';

// ---------- Category-specific content ----------
const categoryFeatures: Record<string, string[]> = {
  'AI Tools': [
    'Full access to all premium AI features',
    'Unlimited prompts & generations (as per plan)',
    'Latest models & updates included',
    'Priority API access where available',
  ],
  'Writing Tools': [
    'Unlimited AI-assisted writing',
    'Plagiarism & grammar checking included',
    'Long-form content generation',
    'Multi-language support',
  ],
  'Video Editing': [
    'Full premium editing suite',
    'Stock library & effects unlocked',
    'No watermark on exports',
    '4K / HD rendering enabled',
  ],
  'Indian OTT': [
    'Premium HD/4K streaming quality',
    'Watch on multiple devices',
    'Ad-free experience (where applicable)',
    'All shows, movies & live TV included',
  ],
  'International OTT': [
    'Premium UHD/4K streaming',
    'Full library — movies, series & originals',
    'Multi-device & offline downloads',
    'Family-friendly profiles',
  ],
  'SEO': [
    'Complete keyword & rank tracking',
    'Backlink analysis & site audits',
    'Competitor research tools unlocked',
    'Daily data refreshes',
  ],
  'VPN': [
    'Unlimited bandwidth & speed',
    'Servers across 90+ countries',
    'No-log policy & AES-256 encryption',
    'Works on Android, iOS, Windows, Mac',
  ],
  'Lead Generation': [
    'Verified B2B contact data',
    'Email finder & verifier included',
    'CRM integrations available',
    'Bulk export support',
  ],
  'Cloud Services': [
    'Premium storage & compute access',
    'Reliable 99.9% uptime SLA',
    'Secure encrypted environment',
    'Cross-platform sync',
  ],
  'Design Tools': [
    'Full design suite unlocked',
    'Premium templates & assets',
    'Brand kit & team collaboration',
    'High-resolution exports',
  ],
  'Software': [
    'Genuine licensed activation',
    'Lifetime / subscription validity as listed',
    'Free updates within plan period',
    'Works on all major platforms',
  ],
  'Other': [
    'Premium plan access',
    'Genuine subscription with warranty',
    'Instant delivery via WhatsApp',
    '24/7 customer support',
  ],
};

const categoryHowItWorks: Record<string, string> = {
  'Indian OTT': 'You receive login credentials or a profile invite for the streaming service. Sign in on your device and start watching instantly.',
  'International OTT': 'You get a private profile or shared account login. Stream on any device — TV, mobile, laptop or tablet.',
  'AI Tools': 'You get access via a shared workspace or dedicated login. Use the tool exactly as a regular paid user would.',
  'Writing Tools': 'Login credentials are shared after payment. Access the full writing suite directly from your browser.',
  'SEO': 'Group buy access is provided through a secure shared dashboard. Run audits, track keywords and analyse backlinks.',
  'VPN': 'You receive your own dedicated VPN credentials. Install the app, log in and connect to any server.',
  'Design Tools': 'You get a workspace invite or shared login. Use all premium features as if it were your personal account.',
};

// ---------- Helpers ----------
function StarRow({ rating = 4.9 }: { rating?: number }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < full ? 'fill-primary text-primary' : 'text-muted-foreground/40'}`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating} (127 reviews)</span>
    </div>
  );
}

function RelatedProducts({ all, current }: { all: Product[]; current: Product }) {
  const related = all
    .filter((p) => p.category === current.category && p.id !== current.id)
    .slice(0, 4);
  if (related.length === 0) return null;
  return (
    <div className="mt-12">
      <h2 className="font-display font-bold text-foreground text-xl mb-4">
        More from {current.category}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((p) => (
          <Link
            key={p.id}
            to={`/product/${slugify(p.name)}`}
            className="group bg-card/60 backdrop-blur-sm border border-border/60 rounded-xl overflow-hidden hover:border-primary/40 transition-all"
          >
            <div className="aspect-square bg-secondary/20 overflow-hidden">
              <img
                src={p.image || PLACEHOLDER}
                alt={`${p.name} — cheap ${p.category} group buy India`}
                className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
              />
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-foreground text-xs leading-tight line-clamp-2 mb-1 min-h-[32px]">
                {p.name}
              </h3>
              <span className="font-display font-bold text-primary text-sm">{p.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

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

  const { data: ratingStats } = useRatingStats(product.id);
  const seo = buildProductSeo(product, ratingStats);
  const features = categoryFeatures[product.category] || categoryFeatures.Other;
  const howItWorks =
    categoryHowItWorks[product.category] ||
    'After payment, you receive your access details directly on WhatsApp within minutes. Follow the simple instructions to log in and start using your subscription.';

  const waHref = waLink({ name: product.name, price: product.price, slug: slugify(product.name), category: product.category }, 'product-detail');

  useEffect(() => { void trackEvent('product_view', { product_id: product.id, name: product.name }); }, [product.id, product.name]);

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
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb */}
          <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5 flex-wrap">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary">Products</Link>
            <span>/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-primary">{product.category}</Link>
            <span>/</span>
            <span className="text-foreground/80 line-clamp-1">{product.name}</span>
          </nav>

          {/* Hero card */}
          <div className="grid md:grid-cols-2 gap-8 bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl overflow-hidden p-6 md:p-8">
            {/* Image */}
            <div className="bg-secondary/20 rounded-xl overflow-hidden aspect-square">
              <img
                src={safeImage}
                alt={`${product.name} – cheapest ${product.category} group buy in India at ${product.price}`}
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

              <div className="mb-3"><StarRow /></div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {product.description || `Get premium ${product.name} at the cheapest group buy price in India. Genuine subscription with full warranty, instant delivery and 24/7 support — exclusively from Dreamcrest Solutions.`}
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

              <div className="grid grid-cols-2 gap-2 mb-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-primary" /> 100% Genuine</span>
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-primary" /> Instant Delivery</span>
                <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 text-primary" /> Replacement Warranty</span>
                <span className="flex items-center gap-1.5"><Headphones className="w-3.5 h-3.5 text-primary" /> 24/7 Support</span>
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
                  href={waHref}
                  onClick={() => void trackEvent('whatsapp_click', { product_id: product.id })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4" /> WhatsApp
                </a>
              </div>
              <div className="mt-4"><LiveViewers productId={product.id} /></div>
            </div>
          </div>

          {/* Info grid: Features + How it works */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-6">
              <h2 className="font-display font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" /> What's included
              </h2>
              <ul className="space-y-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-6">
              <h2 className="font-display font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" /> How it works
              </h2>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">1</span><span>Click <strong className="text-foreground">Buy Now</strong> or message us on WhatsApp.</span></li>
                <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">2</span><span>Complete the secure payment via UPI, card or net banking.</span></li>
                <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">3</span><span>{howItWorks}</span></li>
                <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">4</span><span>Enjoy your subscription with our full replacement warranty.</span></li>
              </ol>
            </div>
          </div>

          {/* Specs / quick facts */}
          <div className="mt-6 bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-6">
            <h2 className="font-display font-semibold text-foreground text-lg mb-4">Product details</h2>
            <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div className="flex justify-between border-b border-border/50 pb-2"><dt className="text-muted-foreground">Category</dt><dd className="text-foreground font-medium">{product.category}</dd></div>
              <div className="flex justify-between border-b border-border/50 pb-2"><dt className="text-muted-foreground">Price</dt><dd className="text-foreground font-medium">{product.price}</dd></div>
              {product.originalPrice && (
                <div className="flex justify-between border-b border-border/50 pb-2"><dt className="text-muted-foreground">MRP</dt><dd className="text-foreground font-medium line-through">{product.originalPrice}</dd></div>
              )}
              {product.discount && (
                <div className="flex justify-between border-b border-border/50 pb-2"><dt className="text-muted-foreground">Discount</dt><dd className="text-primary font-semibold">{product.discount}</dd></div>
              )}
              <div className="flex justify-between border-b border-border/50 pb-2"><dt className="text-muted-foreground">Delivery</dt><dd className="text-foreground font-medium flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Within 5–30 mins</dd></div>
              <div className="flex justify-between border-b border-border/50 pb-2"><dt className="text-muted-foreground">Warranty</dt><dd className="text-foreground font-medium">Full replacement warranty</dd></div>
              <div className="flex justify-between border-b border-border/50 pb-2"><dt className="text-muted-foreground">Payment</dt><dd className="text-foreground font-medium">UPI / Card / Net Banking</dd></div>
              <div className="flex justify-between border-b border-border/50 pb-2"><dt className="text-muted-foreground">Support</dt><dd className="text-foreground font-medium">24/7 WhatsApp</dd></div>
            </dl>
          </div>

          {/* FAQ */}
          <div className="mt-6 bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-6">
            <h2 className="font-display font-semibold text-foreground text-lg mb-4">Frequently asked questions</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Is {product.name} genuine?</h3>
                <p className="text-muted-foreground">Yes — every {product.name} subscription we sell is 100% genuine and comes with a full replacement warranty.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">How fast is the delivery?</h3>
                <p className="text-muted-foreground">Delivery is instant — usually within 5 to 30 minutes after payment confirmation, sent directly on WhatsApp.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Why is {product.name} so cheap here?</h3>
                <p className="text-muted-foreground">We offer it as a group buy. Multiple users share the cost of premium plans, which lets us pass on huge savings while keeping full premium access.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">What if my access stops working?</h3>
                <p className="text-muted-foreground">Just message us on WhatsApp — we'll replace or fix your access immediately under our warranty.</p>
              </div>
            </div>
          </div>

          {/* SEO content */}
          <div className="mt-6 bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-6">
            <h2 className="font-display font-semibold text-foreground text-lg mb-2">
              Why buy {product.name} from Dreamcrest Solutions?
            </h2>
            <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
              <li>Cheapest {product.name} group buy price in India — only {product.price}.</li>
              <li>100% genuine {product.category} subscription with replacement warranty.</li>
              <li>Instant WhatsApp delivery within minutes of payment.</li>
              <li>Trusted by 15,000+ customers since 2021.</li>
              <li>24/7 customer support for any issues or replacements.</li>
            </ul>
          </div>

          {/* Reviews */}
          <ProductReviews productId={product.id} productName={product.name} />

          {/* Related */}
          <RelatedProducts all={products} current={product} />
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ProductDetail;

import { useState, useMemo } from 'react';
import { useTrackSearch } from '@/hooks/useTrackSearch';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEOHead from '@/components/SEOHead';
import PageBanner from '@/components/PageBanner';
import { slugify } from '@/lib/productSeo';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  useTrackSearch(search, 'products');
  const activeCategory = searchParams.get('category') || 'All';
  const filterParam = searchParams.get('filter');
  const isHotFilter = filterParam === 'hot';
  const { data, isLoading } = useProducts();

  const products = data?.products || [];
  const categories = data?.categories || [];
  const hotSellingCount = products.filter((p) => p.isHotSelling).length;

  const filtered = useMemo(() => {
    let result = products;
    if (isHotFilter) {
      result = result.filter((p) => p.isHotSelling);
    } else if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    // When viewing "All", surface hot-selling products first
    if (!isHotFilter && activeCategory === 'All') {
      result = [...result].sort((a, b) => Number(b.isHotSelling) - Number(a.isHotSelling));
    }
    return result;
  }, [activeCategory, search, products, isHotFilter]);

  const setCategory = (cat: string) => {
    searchParams.delete('filter');
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const setHotFilter = () => {
    searchParams.delete('category');
    searchParams.set('filter', 'hot');
    setSearchParams(searchParams);
  };

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Dreamcrest Solutions Premium Digital Products',
    numberOfItems: filtered.length,
    itemListElement: filtered.slice(0, 30).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://dreamcrest.net/product/${slugify(p.name)}`,
      item: {
        '@type': 'Product',
        name: p.name,
        image: p.image,
        description: p.description || p.name,
        category: p.category,
        url: `https://dreamcrest.net/product/${slugify(p.name)}`,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: p.price.replace(/[^\d.]/g, ''),
          availability: 'https://schema.org/InStock',
          url: `https://dreamcrest.net/product/${slugify(p.name)}`,
        },
      },
    })),
  };

  const dynamicSeo = isHotFilter
    ? {
        title: 'Hot Selling Products – Trending Premium Tools & OTT | Dreamcrest Solutions',
        description: `Shop our ${hotSellingCount} hottest-selling premium digital products including Netflix, Prime Video, Hotstar, ChatGPT & more. Trending picks at up to 80% off with instant delivery.`,
      }
    : activeCategory !== 'All'
    ? {
        title: `${activeCategory} – Premium ${activeCategory} at Best Prices | Dreamcrest Solutions`,
        description: `Browse premium ${activeCategory} products at unbeatable prices in India. Verified, genuine subscriptions & licenses with instant WhatsApp delivery and 24/7 support.`,
      }
    : {};

  return (
    <div className="min-h-screen relative z-10">
      <SEOHead
        {...dynamicSeo}
        jsonLd={itemListLd}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          ...(activeCategory !== 'All' ? [{ name: activeCategory, url: `/products?category=${activeCategory}` }] : []),
        ]}
      />
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
              All <span className="text-gradient">Products</span>
            </h1>
            <p className="text-muted-foreground">
              Browse our complete collection of {products.length}+ premium digital products
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button
              onClick={setHotFilter}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border inline-flex items-center gap-1.5 ${
                isHotFilter
                  ? 'bg-destructive text-destructive-foreground border-destructive'
                  : 'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20'
              }`}
            >
              🔥 Hot Selling ({hotSellingCount})
            </button>
            <button
              onClick={() => setCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                activeCategory === 'All' && !isHotFilter
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              All ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === cat.name && !isHotFilter
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                {cat.emoji} {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          {/* Count */}
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filtered.length} of {products.length} products
          </p>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          )}

          {/* Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No products found.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Products;

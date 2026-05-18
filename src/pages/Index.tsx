import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import HotSellingSection from '@/components/HotSellingSection';
import ProductGlobe from '@/components/ProductGlobe';
import CategoriesSection from '@/components/CategoriesSection';
import AboutSection from '@/components/AboutSection';
import DeliveryProofs from '@/components/DeliveryProofs';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEOHead from '@/components/SEOHead';

const Index = () => {
  return (
    <div className="min-h-screen relative z-10">
      <SEOHead
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Dreamcrest Solutions',
          url: 'https://dreamcrest.net',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://dreamcrest.net/products?search={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <Navbar />
      <ProductGlobe />
      <HeroSection />
      <HotSellingSection />
      <CategoriesSection />
      <AboutSection />
      <DeliveryProofs />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;

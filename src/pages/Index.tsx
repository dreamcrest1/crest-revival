import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import AboutSection from '@/components/AboutSection';
import DeliveryProofs from '@/components/DeliveryProofs';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEOHead from '@/components/SEOHead';

const Index = () => {
  return (
    <div className="min-h-screen relative z-10">
      <SEOHead />
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <AboutSection />
      <DeliveryProofs />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;

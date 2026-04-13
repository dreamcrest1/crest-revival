import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import AboutSection from '@/components/AboutSection';
import DeliveryProofs from '@/components/DeliveryProofs';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import HyperspaceBackground from '@/components/HyperspaceBackground';
import CursorTrail from '@/components/CursorTrail';

const Index = () => {
  return (
    <div className="min-h-screen bg-transparent relative">
      <HyperspaceBackground />
      <CursorTrail />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <CategoriesSection />
        <AboutSection />
        <DeliveryProofs />
        <Footer />
        <WhatsAppButton />
      </div>
    </div>
  );
};

export default Index;

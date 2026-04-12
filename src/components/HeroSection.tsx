import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const stats = [
  { value: '15,000+', label: 'Happy Customers', icon: '👥' },
  { value: '200+', label: 'Products', icon: '📦' },
  { value: 'Since 2021', label: 'Trusted', icon: '📅' },
  { value: '24/7', label: 'Support', icon: '⭐' },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      {/* Gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Up to 80% OFF on All Products</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              India's Most{' '}
              <span className="text-gradient">Trusted</span>{' '}
              Digital Product Store
            </h1>

            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Get premium AI tools, OTT subscriptions, software & more at unbeatable prices. Serving 15,000+ happy customers since 2021.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" asChild>
                <Link to="/products">
                  Explore Products <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary" asChild>
                <a href="https://wa.me/916357998730" target="_blank" rel="noopener noreferrer">
                  Contact Us
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> 100% Genuine</span>
              <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Instant Delivery</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> 24/7 Support</span>
            </div>
          </motion.div>

          {/* Right - Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-6 text-center card-hover"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="font-display text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

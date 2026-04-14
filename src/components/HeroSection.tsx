import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { UsersIcon, BoxIcon, CalendarIcon, ShieldCheckIcon } from '@/components/icons/BrandIcons';

const stats = [
  { value: '15,000+', label: 'Happy Customers', Icon: UsersIcon },
  { value: '200+', label: 'Products', Icon: BoxIcon },
  { value: 'Since 2021', label: 'Years of Trust', Icon: CalendarIcon },
  { value: '24/7', label: 'Support', Icon: ShieldCheckIcon },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px]" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 bg-primary/[0.08] border border-primary/20 rounded-full px-5 py-2 mb-8 backdrop-blur-sm"
            >
              <ZapIcon className="w-4 h-4" />
              <span className="text-sm font-semibold text-primary tracking-wide">Up to 80% OFF on All Products</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold leading-[1.1] mb-7 tracking-tight">
              India's Most{' '}
              <span className="text-gradient">Trusted</span>{' '}
              Digital Product Store
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
              Get premium AI tools, OTT subscriptions, software & more at unbeatable prices. Serving 15,000+ happy customers since 2021.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 py-6 text-base rounded-xl shadow-[0_0_30px_hsl(24_95%_53%/0.25)] hover:shadow-[0_0_40px_hsl(24_95%_53%/0.35)] transition-all duration-300"
                asChild
              >
                <Link to="/products">
                  Explore Products <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border/60 text-foreground hover:bg-secondary/80 px-8 py-6 text-base rounded-xl backdrop-blur-sm"
                asChild
              >
                <a href="https://wa.me/916357998730" target="_blank" rel="noopener noreferrer">
                  Contact Us
                </a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2.5">
                <ShieldIcon className="w-4 h-4" />
                <span className="font-medium">100% Genuine</span>
              </span>
              <span className="flex items-center gap-2.5">
                <ZapIcon className="w-4 h-4" />
                <span className="font-medium">Instant Delivery</span>
              </span>
              <span className="flex items-center gap-2.5">
                <ClockIcon className="w-4 h-4" />
                <span className="font-medium">24/7 Support</span>
              </span>
            </div>
          </motion.div>

          {/* Right - Premium Stat Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-5"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="group relative bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl p-7 text-center card-hover overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-primary/[0.06] to-transparent" />
                <div className="relative z-10">
                  <stat.Icon className="w-8 h-8 mx-auto mb-3" />
                  <div className="font-display text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

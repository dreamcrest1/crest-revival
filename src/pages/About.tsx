import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { motion } from 'framer-motion';
import { Zap, Shield, Tag, HeadphonesIcon, Award, Globe, TrendingUp, Star, ChevronRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import PageBanner from '@/components/PageBanner';

const stats = [
  { value: '15,000+', label: 'Happy Customers', icon: '👥' },
  { value: '200+', label: 'Digital Products', icon: '📦' },
  { value: 'Since 2021', label: 'Years of Trust', icon: '📅' },
  { value: '100%', label: 'Genuine Products', icon: '✅' },
];

const timeline = [
  { year: '2021', text: 'Dreamcrest Solutions founded in Chennai', highlight: 'Founded' },
  { year: '2022', text: 'Launched Dreamtools.in for group buy services', highlight: 'Expansion' },
  { year: '2023', text: 'Crossed 10,000 happy customers milestone', highlight: '10K Users' },
  { year: '2024', text: 'Expanded catalog to 200+ premium products', highlight: '200+ Tools' },
  { year: '2025', text: 'Serving 15,000+ customers across India', highlight: '15K+ Users' },
];

const whyUs = [
  { icon: Zap, title: 'Instant Delivery', desc: 'Digital products delivered within minutes of purchase. No waiting.' },
  { icon: Shield, title: 'Genuine Products', desc: '100% authentic subscriptions and licenses from authorized sources.' },
  { icon: Tag, title: 'Best Prices', desc: 'Up to 80% off on premium digital products and subscriptions.' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Round-the-clock customer support with hassle-free replacements.' },
  { icon: Award, title: 'Trusted Brand', desc: 'India\'s most trusted & oldest multi-platform service provider.' },
  { icon: Globe, title: 'Pan-India Service', desc: 'Serving customers in every state with seamless digital delivery.' },
];

const brands = [
  { name: 'Dreamtools', desc: 'Group Buy SEO & Premium Tools', url: 'https://dreamtools.in/', tag: 'Group Buy' },
  { name: 'Dreamstar Solutions', desc: 'Digital Products & Services', url: 'https://dreamstarsolution.com/', tag: 'E-Commerce' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const About = () => {
  return (
    <div className="min-h-screen relative z-10">
      <SEOHead breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }]} />
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4">

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20 max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 mb-6"
            >
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">India's Most Trusted Platform</span>
            </motion.div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              About <span className="text-gradient">Dreamcrest</span>
              <br />
              <span className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-normal">Solutions</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              India's oldest & most trusted multi-platform digital service provider. Making premium tools accessible since 2021.
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-24 max-w-5xl mx-auto"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={itemVariants}
                className="group relative bg-card/60 backdrop-blur-md border border-border/60 rounded-2xl p-6 md:p-8 text-center overflow-hidden hover:border-primary/30 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <span className="text-3xl mb-3 block">{s.icon}</span>
                  <div className="font-display text-2xl md:text-3xl font-bold text-primary mb-1">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Story + Timeline */}
          <div className="max-w-6xl mx-auto mb-24">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Our Story */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-1 bg-primary rounded-full" />
                  <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Story</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
                  From a Vision to <span className="text-gradient">India's #1</span> Digital Marketplace
                </h2>
                <div className="space-y-5 text-muted-foreground leading-relaxed text-[15px]">
                  <p>
                    Dreamcrest Solutions was founded in 2021 with a simple yet powerful mission: to make premium digital products accessible to everyone at prices that don't break the bank.
                  </p>
                  <p>
                    What started as a small venture in Chennai has grown into India's most trusted digital product marketplace, serving over 15,000 happy customers across every state.
                  </p>
                  <p>
                    We specialize in providing genuine subscriptions for AI tools, OTT platforms, software licenses, SEO tools, and cloud services at discounts of up to 80% off retail prices.
                  </p>
                  <p>
                    Our commitment to authenticity, instant delivery, and exceptional customer support has made us the go-to destination for digital products in India.
                  </p>
                </div>

                {/* Key metrics inline */}
                <div className="mt-8 flex gap-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-sm text-foreground font-medium">80% Savings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="text-sm text-foreground font-medium">Pan-India</span>
                  </div>
                </div>
              </motion.div>

              {/* Timeline */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-1 bg-primary rounded-full" />
                  <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Journey</span>
                </div>

                <div className="relative">
                  <div className="absolute left-[22px] top-4 bottom-4 w-px bg-gradient-to-b from-primary via-primary/30 to-transparent" />

                  <div className="space-y-5">
                    {timeline.map((t, i) => (
                      <motion.div
                        key={t.year}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        className="flex gap-5 items-start group"
                      >
                        <div className="relative z-10 flex-shrink-0 w-11 h-11 rounded-full bg-primary/15 border-2 border-primary/40 group-hover:border-primary flex items-center justify-center transition-colors duration-300 shadow-[0_0_15px_hsl(24,95%,53%,0.15)]">
                          <span className="text-primary font-display font-bold text-[11px]">{t.year}</span>
                        </div>
                        <div className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-xl p-4 flex-1 group-hover:border-primary/20 transition-colors duration-300">
                          <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">{t.highlight}</span>
                          <p className="text-foreground text-sm mt-1">{t.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="max-w-6xl mx-auto mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-1 bg-primary rounded-full" />
                <span className="text-primary font-medium text-sm uppercase tracking-wider">Why Us</span>
                <div className="w-10 h-1 bg-primary rounded-full" />
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
                Why Choose <span className="text-gradient">Dreamcrest?</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                We're committed to providing the best digital products experience in India
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {whyUs.map((item) => (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="group relative bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-7 overflow-hidden hover:border-primary/30 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-foreground text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Our Brands */}
          <div className="max-w-4xl mx-auto mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-1 bg-primary rounded-full" />
                <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Brands</span>
                <div className="w-10 h-1 bg-primary rounded-full" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                Part of a Growing <span className="text-gradient">Family</span>
              </h2>
              <p className="text-muted-foreground">Dreamcrest is part of a growing family of digital service brands.</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-5">
              {brands.map((brand, i) => (
                <motion.a
                  key={brand.name}
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-8 overflow-hidden hover:border-primary/30 transition-all duration-500 block"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <span className="text-[10px] uppercase tracking-wider text-primary font-semibold bg-primary/10 px-2.5 py-1 rounded-full">{brand.tag}</span>
                    <h3 className="font-display font-bold text-foreground text-xl mt-4 mb-1 group-hover:text-primary transition-colors">{brand.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{brand.desc}</p>
                    <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Visit <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default About;

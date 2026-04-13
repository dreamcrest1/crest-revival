import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { motion } from 'framer-motion';
import { Zap, Shield, Tag, HeadphonesIcon } from 'lucide-react';

const stats = [
  { value: '15,000+', label: 'Happy Customers' },
  { value: '200+', label: 'Products' },
  { value: 'Since 2021', label: 'Years of Trust' },
  { value: '100%', label: 'Genuine Products' },
];

const timeline = [
  { year: '2021', text: 'Dreamcrest Solutions founded in Chennai' },
  { year: '2022', text: 'Launched Dreamtools.in for group buy services' },
  { year: '2023', text: 'Crossed 10,000 happy customers' },
  { year: '2024', text: 'Expanded product catalog to 200+ products' },
  { year: '2025', text: 'Serving 15,000+ customers across India' },
];

const whyUs = [
  { icon: Zap, title: 'Instant Delivery', desc: 'Get your digital products delivered within minutes of purchase.' },
  { icon: Shield, title: 'Genuine Products', desc: '100% authentic subscriptions and licenses from authorized sources.' },
  { icon: Tag, title: 'Best Prices', desc: 'Up to 80% off on premium digital products and subscriptions.' },
  { icon: HeadphonesIcon, title: 'Customer First', desc: '24/7 support and hassle-free replacement guarantee.' },
];

const About = () => {
  return (
    <div className="min-h-screen relative z-10">
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
              About <span className="text-gradient">Dreamcrest</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              India's Most Trusted & Oldest Multi Platform Service Provider
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 text-center"
              >
                <div className="font-display text-2xl md:text-3xl font-bold text-primary">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Our Story */}
          <div className="grid md:grid-cols-2 gap-12 items-start mb-20 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Dreamcrest Solutions was founded in 2021 with a simple mission: to make premium digital products accessible to everyone at affordable prices.
                </p>
                <p>
                  What started as a small venture in Chennai has grown into India's most trusted digital product marketplace, serving over 15,000 happy customers across the country.
                </p>
                <p>
                  We specialize in providing genuine subscriptions for AI tools, OTT platforms, software licenses, and cloud services at discounts of up to 80% off retail prices.
                </p>
                <p>
                  Our commitment to authenticity, instant delivery, and exceptional customer support has made us the go-to destination for digital products in India.
                </p>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">Our Journey</h2>
              {timeline.map((t, i) => (
                <div key={t.year} className="flex gap-4 items-start">
                  <div className="bg-primary text-primary-foreground font-display font-bold text-sm px-3 py-1.5 rounded-lg flex-shrink-0">
                    {t.year}
                  </div>
                  <p className="text-muted-foreground pt-1">{t.text}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Why Choose Us */}
          <div className="max-w-5xl mx-auto mb-20">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
              Why Choose Us?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {whyUs.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 text-center"
                >
                  <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Our Brands */}
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              Our Brands
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              Dreamcrest is part of a growing family of digital service brands.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="https://dreamtools.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card border border-border rounded-xl p-6 text-center card-hover block"
              >
                <h3 className="font-display font-semibold text-foreground text-lg">Dreamtools</h3>
                <p className="text-sm text-muted-foreground mt-1">Group Buy Tools</p>
              </a>
              <a
                href="https://dreamstarsolution.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card border border-border rounded-xl p-6 text-center card-hover block"
              >
                <h3 className="font-display font-semibold text-foreground text-lg">Dreamstar Solutions</h3>
                <p className="text-sm text-muted-foreground mt-1">Digital Services</p>
              </a>
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

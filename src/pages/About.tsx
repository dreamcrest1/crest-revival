import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import IndiaMap from '@/components/IndiaMap';
import { motion } from 'framer-motion';
import { Zap, Shield, Tag, HeadphonesIcon } from 'lucide-react';
import { UsersIcon, BoxIcon, CalendarIcon, ShieldCheckIcon } from '@/components/icons/BrandIcons';

const stats = [
  { value: '15,000+', label: 'Happy Customers', Icon: UsersIcon },
  { value: '200+', label: 'Products', Icon: BoxIcon },
  { value: 'Since 2021', label: 'Years of Trust', Icon: CalendarIcon },
  { value: '100%', label: 'Genuine Products', Icon: ShieldCheckIcon },
];

const timeline = [
  { year: "'21", text: 'Dreamcrest Solutions founded in Chennai' },
  { year: "'22", text: 'Launched Dreamtools.in for group buy services' },
  { year: "'23", text: 'Crossed 10,000 happy customers' },
  { year: "'24", text: 'Expanded product catalog to 200+ products' },
  { year: "'25", text: 'Serving 15,000+ customers across India' },
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
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
              About <span className="text-gradient">Dreamcrest</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              India's Most Trusted & Oldest Multi Platform Service Provider
            </p>
          </motion.div>

          {/* Stats with icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20 max-w-5xl mx-auto">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="group relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8 text-center card-hover overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-primary/5 to-transparent" />
                <div className="relative z-10">
                  <s.Icon className="w-8 h-8 mx-auto mb-3" />
                  <div className="font-display text-2xl md:text-3xl font-bold text-primary mb-1">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Our Story + India Map + Timeline */}
          <div className="relative mb-20 max-w-6xl mx-auto">
            {/* India map background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div className="w-[600px] h-[600px] opacity-60">
                <IndiaMap />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start relative z-10">
              {/* Our Story */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">Our Story</h2>
                <div className="space-y-5 text-muted-foreground leading-relaxed">
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
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">Our Journey</h2>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />

                  <div className="space-y-6">
                    {timeline.map((t, i) => (
                      <motion.div
                        key={t.year}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15, duration: 0.4 }}
                        className="flex gap-5 items-start"
                      >
                        {/* Circle with number */}
                        <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shadow-[0_0_12px_hsl(24,95%,53%,0.3)]">
                          <span className="text-primary font-display font-bold text-xs">{t.year}</span>
                        </div>
                        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 flex-1">
                          <p className="text-foreground font-medium">{t.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="max-w-5xl mx-auto mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-4"
            >
              Why Choose <span className="text-gradient">Us?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
            >
              We're committed to providing the best digital products experience in India
            </motion.p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {whyUs.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-7 text-center card-hover overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-primary/8 to-transparent" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-2 text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Our Brands */}
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-4"
            >
              Our <span className="text-gradient">Brands</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center text-muted-foreground mb-10"
            >
              Dreamcrest is part of a growing family of digital service brands.
            </motion.p>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { name: 'Dreamtools', desc: 'Group Buy Tools', url: 'https://dreamtools.in/' },
                { name: 'Dreamstar Solutions', desc: 'Digital Services', url: 'https://dreamstarsolution.com/' },
              ].map((brand, i) => (
                <motion.a
                  key={brand.name}
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 text-center card-hover block overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-primary/5 to-transparent" />
                  <div className="relative z-10">
                    <h3 className="font-display font-bold text-foreground text-xl mb-1">{brand.name}</h3>
                    <p className="text-sm text-muted-foreground">{brand.desc}</p>
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

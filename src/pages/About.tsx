import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { motion } from 'framer-motion';
import { Zap, Shield, Tag, HeadphonesIcon, Award, Globe, TrendingUp, Star, ChevronRight } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import PageBanner from '@/components/PageBanner';

const stats = [
  { value: 'Pan-India', label: 'Shipped digitally', icon: '🇮🇳' },
  { value: '200+', label: 'Tools in the vault', icon: '🗝️' },
  { value: 'Minutes', label: 'Average delivery', icon: '⚡' },
  { value: '100%', label: 'Genuine keys only', icon: '✅' },
];

const timeline = [
  { year: '2021', text: 'A small Indian shop opens its doors as Castle Tools', highlight: 'Day One' },
  { year: '2022', text: 'Catalog grows beyond OTT into AI, SEO and creator suites', highlight: 'New Wings' },
  { year: '2023', text: 'Group-buy panels added so creators pay even less', highlight: 'Group Buy' },
  { year: '2024', text: 'Crossed 200+ tools and rolled out 24×7 WhatsApp desk', highlight: '200+ Tools' },
  { year: '2025', text: 'Quietly serving customers in every Indian state', highlight: 'Nationwide' },
];

const whyUs = [
  { icon: Zap, title: 'Delivery in minutes', desc: 'Your key, login or activation lands as soon as we see the payment — no overnight waits.' },
  { icon: Shield, title: 'Only genuine keys', desc: 'Every subscription is sourced from official panels and group buys, never cracked or pirated.' },
  { icon: Tag, title: 'Honest pricing', desc: 'You usually save 60–80% versus buying direct, with the savings clearly shown up front.' },
  { icon: HeadphonesIcon, title: 'Real human help', desc: 'A small team on WhatsApp that actually replies — not a recycled chatbot script.' },
  { icon: Award, title: 'Treated like a person', desc: 'Replacements, refunds and odd questions handled politely, the same day where possible.' },
  { icon: Globe, title: 'Built for India', desc: 'UPI, INR pricing, Hindi/English support and timezones that match your day.' },
];

const brands = [
  { name: 'Castle Tools Store', desc: 'Premium subscriptions, instantly delivered', url: 'https://castletools.in/', tag: 'Marketplace' },
  { name: 'Castle Tools Group Buy', desc: 'SEO suites & creator panels at split cost', url: 'https://castletools.in/', tag: 'Group Buy' },
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

          <PageBanner
            eyebrow="Inside the Keep"
            title="Meet"
            highlight="Castle Tools"
            subtitle="A small, friendly Indian shop quietly handing genuine digital keys to creators, students and small businesses — at prices that finally feel fair."
          />



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
                    Castle Tools was founded in 2021 with a simple yet powerful mission: to make premium digital products accessible to everyone at prices that don't break the bank.
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
                Why Choose <span className="text-gradient">Castle Tools?</span>
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
              <p className="text-muted-foreground">Castle Tools is part of a growing family of digital service brands.</p>
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

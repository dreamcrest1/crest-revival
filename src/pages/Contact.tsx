import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { WhatsAppIcon } from '@/components/SocialIcons';
import { motion } from 'framer-motion';
import { StarIcon, RocketIcon, WrenchIcon, CameraIcon, PlayIcon, PhoneIcon, GlobeIcon } from '@/components/icons/BrandIcons';
import SEOHead from '@/components/SEOHead';
import PageBanner from '@/components/PageBanner';

const dreamcrestNumbers = [
  { label: '+91 97123 01164', link: 'https://wa.me/919712301164' },
  { label: '+91 63579 98730', link: 'https://wa.me/916357998730' },
];

const dreamstarNumbers = [
  { label: '+91 99914 83279', link: 'https://wa.me/919991483279' },
  { label: '+91 97292 13279', link: 'https://wa.me/919729213279' },
  { label: '+91 91769 00944', link: 'https://wa.me/919176900944' },
  { label: '+91 80030 78749', link: 'https://wa.me/918003078749' },
];

const brands = [
  { name: 'Dreamcrest', desc: 'Premier OTT & Cloud Services', url: 'https://dreamcrest.net/', Icon: StarIcon },
  { name: 'Dreamstar Solution', desc: 'Our Second Firm', url: 'https://dreamstarsolution.com/', Icon: RocketIcon },
  { name: 'Dreamtools.in', desc: 'Group Buy Tools Panel', url: 'https://dreamtools.in/', Icon: WrenchIcon },
  { name: 'Delivery Proofs', desc: 'Instagram Showcase', url: 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTkzOTExNzgwNDk4NDU1?igshid=YmMyMTA2M2Y=', Icon: CameraIcon },
  { name: 'YouTube Channel', desc: 'Product Demos', url: 'https://www.youtube.com/channel/UCbqBFmu4oZ3PpcwEdMVDDcw', Icon: PlayIcon },
];

const Contact = () => {
  return (
    <div className="min-h-screen relative z-10">
      <SEOHead
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact' }]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Dreamcrest Solutions',
          url: 'https://dreamcrest.net/contact',
          contactPoint: [
            { '@type': 'ContactPoint', telephone: '+91-6357998730', contactType: 'customer service', availableLanguage: ['English', 'Hindi'] },
            { '@type': 'ContactPoint', telephone: '+91-9712301164', contactType: 'sales', availableLanguage: ['English', 'Hindi'] },
          ],
        }}
      />
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
              Contact <span className="text-gradient">Us</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              We're here to help! Reach out to us through any of our channels below.
            </p>
          </motion.div>

          {/* Brands & Channels */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-14">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2 text-center">
              ✨ Our Brands & Channels ✨
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
              {brands.map((brand, i) => (
                <motion.a
                  key={brand.name}
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="group relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 text-center card-hover block overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-primary/8 to-transparent" />
                  <div className="relative z-10">
                    <brand.Icon className="w-8 h-8 mx-auto mb-3" />
                    <h3 className="font-display font-semibold text-foreground text-sm">{brand.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{brand.desc}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Phone Numbers */}
          <div className="grid md:grid-cols-2 gap-6 mb-14">
            {/* Dreamcrest */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-7"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <GlobeIcon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg">Dreamcrest Solutions</h3>
              </div>
              <div className="space-y-3">
                {dreamcrestNumbers.map(n => (
                  <a
                    key={n.label}
                    href={n.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 bg-secondary/50 hover:bg-secondary border border-border rounded-xl px-5 py-4 transition-all duration-300 hover:border-primary/30"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                      <PhoneIcon className="w-4 h-4 text-[#25D366]" />
                    </div>
                    <span className="font-medium text-foreground">{n.label}</span>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Dreamstar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-7"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <RocketIcon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg">Dreamstar Solutions</h3>
              </div>
              <div className="space-y-3">
                {dreamstarNumbers.map(n => (
                  <a
                    key={n.label}
                    href={n.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 bg-secondary/50 hover:bg-secondary border border-border rounded-xl px-5 py-4 transition-all duration-300 hover:border-primary/30"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                      <PhoneIcon className="w-4 h-4 text-[#25D366]" />
                    </div>
                    <span className="font-medium text-foreground">{n.label}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-7 mb-14"
          >
            <h3 className="font-display font-bold text-foreground text-lg mb-5 text-center">📧 Email Us</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:dreamcrestsolutions@gmail.com"
                className="group bg-secondary/50 hover:bg-secondary text-foreground border border-border hover:border-primary/30 px-6 py-3.5 rounded-xl font-medium transition-all duration-300 text-center text-sm"
              >
                dreamcrestsolutions@gmail.com
              </a>
              <a
                href="mailto:dreamstarott@gmail.com"
                className="group bg-secondary/50 hover:bg-secondary text-foreground border border-border hover:border-primary/30 px-6 py-3.5 rounded-xl font-medium transition-all duration-300 text-center text-sm"
              >
                dreamstarott@gmail.com
              </a>
            </div>
          </motion.div>

          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-7 mb-14 text-center"
          >
            <h3 className="font-display font-bold text-foreground text-lg mb-3">📍 Our Address</h3>
            <p className="text-muted-foreground">🏢 D-18 Richmond Heights, Sector 37, Gandhinagar, GJ 382010</p>
          </motion.div>

          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-primary/10 to-transparent border border-primary/30 rounded-2xl p-10 text-center backdrop-blur-sm"
          >
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h3 className="font-display font-bold text-foreground text-2xl mb-3">⚡ Fastest Response on WhatsApp!</h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Get instant replies and support via WhatsApp. We typically respond within minutes.
              </p>
              <a
                href="https://wa.me/916357998730"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#25D366] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#22c55e] transition-all duration-300 shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)]"
              >
                <WhatsAppIcon className="w-5 h-5" /> Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;

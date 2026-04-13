import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { motion } from 'framer-motion';

const dreamcrestNumbers = [
  { label: '+91 97123 01164', link: 'https://wa.me/919712301164' },
  { label: '+91 63579 98730', link: 'https://wa.me/916357998730' },
  { label: '+91 63579 98724', link: 'https://wa.me/916357998724' },
];

const dreamstarNumbers = [
  { label: '+91 99914 83279', link: 'https://wa.me/919991483279' },
  { label: '+91 97292 13279', link: 'https://wa.me/919729213279' },
  { label: '+91 91769 00944', link: 'https://wa.me/919176900944' },
  { label: '+91 80030 78749', link: 'https://wa.me/918003078749' },
];

const brands = [
  { name: 'Dreamcrest', desc: 'Premier OTT & Cloud Services', url: 'https://dreamcrest.net/' },
  { name: 'Dreamstar Solution', desc: 'Our Second Firm', url: 'https://dreamstarsolution.com/' },
  { name: 'Dreamtools.in', desc: 'Group Buy Tools Panel', url: 'https://dreamtools.in/' },
  { name: 'Delivery Proofs', desc: 'Instagram Showcase', url: 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTkzOTExNzgwNDk4NDU1?igshid=YmMyMTA2M2Y=' },
  { name: 'YouTube Channel', desc: 'Product Demos', url: 'https://www.youtube.com/channel/UCbqBFmu4oZ3PpcwEdMVDDcw' },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
              Contact <span className="text-gradient">Us</span>
            </h1>
            <p className="text-muted-foreground">
              We're here to help! Reach out to us through any of our channels below.
            </p>
          </motion.div>

          {/* Our Brands & Channels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="font-display text-xl font-bold text-foreground mb-6 text-center">Our Brands & Channels</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {brands.map(brand => (
                <a
                  key={brand.name}
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-card border border-border rounded-xl p-5 text-center card-hover block"
                >
                  <h3 className="font-display font-semibold text-foreground">{brand.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{brand.desc}</p>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Phone Numbers */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="font-display font-semibold text-foreground text-lg mb-4">Dreamcrest Solutions</h3>
              <div className="space-y-3">
                {dreamcrestNumbers.map(n => (
                  <a
                    key={n.label}
                    href={n.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="text-lg">💬</span>
                    <span className="font-medium">{n.label}</span>
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="font-display font-semibold text-foreground text-lg mb-4">Dreamstar Solutions</h3>
              <div className="space-y-3">
                {dreamstarNumbers.map(n => (
                  <a
                    key={n.label}
                    href={n.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="text-lg">💬</span>
                    <span className="font-medium">{n.label}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-xl p-6 mb-12"
          >
            <h3 className="font-display font-semibold text-foreground text-lg mb-4 text-center">📧 Email Us</h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:dreamcrestsolutions@gmail.com"
                className="bg-card text-primary border border-primary/30 px-5 py-2.5 rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors text-center text-sm"
              >
                dreamcrestsolutions@gmail.com
              </a>
              <a
                href="mailto:dreamstarott@gmail.com"
                className="bg-card text-primary border border-primary/30 px-5 py-2.5 rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors text-center text-sm"
              >
                dreamstarott@gmail.com
              </a>
            </div>
          </motion.div>

          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-xl p-6 mb-12 text-center"
          >
            <h3 className="font-display font-semibold text-foreground text-lg mb-3">📍 Our Address</h3>
            <p className="text-muted-foreground">
              🏢 D-18 Richmond Heights, Sector 37, Gandhinagar, GJ 382010
            </p>
          </motion.div>

          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-primary/10 border border-primary/30 rounded-xl p-8 text-center"
          >
            <h3 className="font-display font-semibold text-foreground text-xl mb-2">⚡ Fastest Response on WhatsApp!</h3>
            <p className="text-muted-foreground text-sm mb-5">
              Get instant replies and support via WhatsApp. We typically respond within minutes.
            </p>
            <a
              href="https://wa.me/916357998730"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              💬 Chat on WhatsApp
            </a>
          </motion.div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;

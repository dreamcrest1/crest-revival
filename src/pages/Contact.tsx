import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { WhatsAppIcon, InstagramIcon, EmailIcon } from '@/components/SocialIcons';
import { motion } from 'framer-motion';
import { PhoneIcon, GlobeIcon } from '@/components/icons/BrandIcons';
import SEOHead from '@/components/SEOHead';
import PageBanner from '@/components/PageBanner';

const channels = [
  {
    name: 'WhatsApp',
    desc: 'Quickest replies, day or night',
    url: 'https://wa.me/919773453978',
    handle: '+91 97734 53978',
    Icon: WhatsAppIcon,
    color: 'text-[#25D366]',
  },
  {
    name: 'Instagram',
    desc: 'Behind-the-scenes & daily proofs',
    url: 'https://instagram.com/Castletool99',
    handle: '@Castletool99',
    Icon: InstagramIcon,
    color: 'text-[#E4405F]',
  },
  {
    name: 'Facebook',
    desc: 'Updates, drops & reviews',
    url: 'https://www.facebook.com/share/18fxQZhomn/',
    handle: 'Castle Tools Page',
    Icon: GlobeIcon,
    color: 'text-[#1877F2]',
  },
  {
    name: 'Email',
    desc: 'For invoices & bulk queries',
    url: 'mailto:Castletool99@gmail.com',
    handle: 'Castletool99@gmail.com',
    Icon: EmailIcon,
    color: 'text-primary',
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen relative z-10">
      <SEOHead
        breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact' }]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Talk to Castle Tools',
          url: 'https://castletools.in/contact',
          contactPoint: [
            { '@type': 'ContactPoint', telephone: '+91-9773453978', contactType: 'customer service', availableLanguage: ['English', 'Hindi'] },
          ],
        }}
      />
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <PageBanner
            eyebrow="Open the Gates"
            title="Reach"
            highlight="Castle Tools"
            subtitle="Pick whichever channel suits you best — our gatekeepers reply fast on every one of them."
          />

          {/* Channels grid */}
          <div className="grid sm:grid-cols-2 gap-5 mt-10 mb-12">
            {channels.map((c, i) => (
              <motion.a
                key={c.name}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.06 }}
                className="group bg-card/80 backdrop-blur-sm border border-border hover:border-primary/40 rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/60 border border-border flex items-center justify-center shrink-0">
                  <c.Icon className={`w-6 h-6 ${c.color}`} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
                  <p className="text-sm text-primary mt-1 truncate">{c.handle}</p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Direct phone block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-7 mb-10 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <PhoneIcon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-foreground text-lg">Call or message us</h3>
            </div>
            <a
              href="https://wa.me/919773453978"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-display font-bold text-primary hover:underline"
            >
              +91 97734 53978
            </a>
            <p className="text-sm text-muted-foreground mt-2">Available 7 days a week · English & Hindi</p>
          </motion.div>

          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-primary/10 to-transparent border border-primary/30 rounded-2xl p-10 text-center backdrop-blur-sm"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h3 className="font-display font-bold text-foreground text-2xl mb-3">⚡ Quickest replies on WhatsApp</h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Drop us a message and a real human from the Castle Tools desk usually pings back within minutes.
              </p>
              <a
                href="https://wa.me/919773453978"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#25D366] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#22c55e] transition-all duration-300 shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)]"
              >
                <WhatsAppIcon className="w-5 h-5" /> Open WhatsApp Chat
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

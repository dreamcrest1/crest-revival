import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
              Contact <span className="text-gradient">Us</span>
            </h1>
            <p className="text-muted-foreground">
              We'd love to hear from you. Reach out to us anytime!
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <h3 className="font-display font-semibold text-foreground text-lg mb-2">💬 WhatsApp</h3>
              <p className="text-muted-foreground text-sm mb-4">Our primary support channel. We reply instantly!</p>
              <a
                href="https://wa.me/916357998730"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <h3 className="font-display font-semibold text-foreground text-lg mb-2">📸 Instagram</h3>
              <p className="text-muted-foreground text-sm mb-4">Follow us for updates, offers, and delivery proofs.</p>
              <a
                href="https://www.instagram.com/dreamcrest_solutions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-card text-primary border border-primary/30 px-6 py-2.5 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Follow on Instagram
              </a>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <h3 className="font-display font-semibold text-foreground text-lg mb-2">📧 Email</h3>
              <p className="text-muted-foreground text-sm mb-4">For business inquiries and partnerships.</p>
              <a
                href="mailto:support@dreamcrest.net"
                className="inline-block bg-card text-primary border border-primary/30 px-6 py-2.5 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                support@dreamcrest.net
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

export default Contact;

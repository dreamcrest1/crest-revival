import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEOHead from '@/components/SEOHead';
import PageBanner from '@/components/PageBanner';

const Terms = () => {
  return (
    <div className="min-h-screen relative z-10">
      <SEOHead breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Terms', url: '/terms' }]} />
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <PageBanner
            eyebrow="Code of the Realm"
            title="Terms of"
            highlight="Castle Tools"
          />


          <div className="prose prose-invert max-w-none space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-display font-semibold text-foreground text-xl mb-3">The basics</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                When you place an order with Castle Tools, you agree to the points laid out on this page. Everything we sell is a digital good — handed over by email, WhatsApp or instant activation, never as a physical parcel.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-display font-semibold text-foreground text-xl mb-3">Money back</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You can request a refund up to 7 days after buying, as long as the key has not been used or activated. Once login details are shared and consumed, refunds aren't possible. Drop us a WhatsApp message and we'll guide you through it.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-display font-semibold text-foreground text-xl mb-3">How fast we deliver</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Most orders go out in 5 to 30 minutes. On the occasional slow day it can stretch up to 24 hours. Either way, you'll get your access on WhatsApp or email and we'll keep you posted.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-display font-semibold text-foreground text-xl mb-3">Warranty &amp; help</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Every plan ships with a warranty for the validity mentioned on its page. If something stops working inside that window, message us and we'll replace it free — no fine print.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-display font-semibold text-foreground text-xl mb-3">Your information</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The details you share with Castle Tools are used only to fulfil and support your order. Nothing is rented, sold or handed to third-party advertisers — privacy is taken seriously here.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Terms;

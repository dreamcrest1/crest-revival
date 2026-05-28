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
            title="Terms &"
            highlight="Conditions"
          />


          <div className="prose prose-invert max-w-none space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-display font-semibold text-foreground text-xl mb-3">General Terms</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                By purchasing from Dreamcrest Solutions, you agree to our terms and conditions. All products sold are digital goods and services delivered instantly via email or direct activation.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-display font-semibold text-foreground text-xl mb-3">Refund Policy</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Refunds are provided within 7 days of purchase if the product has not been activated or used. Once a product is activated or credentials are shared, refunds cannot be processed. Contact us on WhatsApp for refund requests.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-display font-semibold text-foreground text-xl mb-3">Delivery</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                All products are delivered digitally. Most orders are delivered within 5-30 minutes. In rare cases, delivery may take up to 24 hours. You will receive your credentials or activation link via WhatsApp or email.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-display font-semibold text-foreground text-xl mb-3">Warranty & Support</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                All products come with a warranty for the specified duration. If you face any issues with your product during the warranty period, we will provide a replacement at no extra cost. Our 24/7 support team is available on WhatsApp.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-display font-semibold text-foreground text-xl mb-3">Privacy</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We respect your privacy. Your personal information is used only for order processing and communication. We do not share your data with third parties.
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

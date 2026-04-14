import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { motion } from 'framer-motion';
import SEOHead from '@/components/SEOHead';

const policies = [
  {
    number: '1',
    title: 'All Sales Are Final',
    content: 'All purchases are final. We do not offer refunds under any circumstances, except as specifically mentioned in this policy.',
  },
  {
    number: '2',
    title: 'Replacement for Non-Functional Services',
    content: 'If any OTT service is not working, we will provide a replacement or an alternative OTT service of similar value.',
  },
  {
    number: '3',
    title: 'No Refund After Order or Delivery',
    content: 'Once the service is ordered, taken, or delivered, we reserve the right to refuse any kind of refund request.',
  },
  {
    number: '4',
    title: 'Warranty on Lifetime Services',
    content: 'Services labeled as "lifetime" come with a 1-year warranty. If the service stops working after the warranty period (e.g., after 1.5 years), we will not be able to offer support or replacement.',
  },
  {
    number: '5',
    title: 'Annual Maintenance Charges (AMC)',
    content: 'Some lifetime services may include an AMC (Annual Maintenance Charge) to keep our operations sustainable. The AMC will range from 25% to 30% of the original service price.',
  },
  {
    number: '6',
    title: 'Refund Eligibility',
    content: 'Refunds are only applicable if: The product/service is not delivered to you, or the product/service is out of stock.',
  },
  {
    number: '7',
    title: 'OEM Policy Dependency',
    content: 'We are service providers, not developers or OEMs (Original Equipment Manufacturers). Our policies may change in accordance with OEM policy updates.',
  },
  {
    number: '8',
    title: 'Mass Service Disruptions',
    content: 'In the event of mass bans or service disruptions (e.g., Prime Video, Netflix), we will provide free replacements wherever applicable.',
  },
  {
    number: '9',
    title: 'Technical Downtime Compensation',
    content: 'If a service is non-functional due to technical or backend issues, we will compensate by extending your service validity to cover the downtime experienced.',
  },
  {
    number: '10',
    title: 'Policy Updates',
    content: 'We reserve the right to modify this policy at any time, based on business needs or external conditions.',
  },
  {
    number: '11',
    title: 'Affordable Pricing & Service Quality',
    content: 'As we offer services at a fraction of the original price, minor issues may occasionally occur. However, we are committed to delivering the best possible service experience and timely support.',
  },
];

const Refunds = () => {
  return (
    <div className="min-h-screen relative z-10">
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
              Refund & <span className="text-gradient">Return Policy</span>
            </h1>
            <p className="text-muted-foreground">
              Effective for: Dreamcrest Solutions & Dreamstar Solutions
            </p>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-primary/10 border border-primary/30 rounded-xl p-6 mb-8"
          >
            <h3 className="font-display font-semibold text-primary text-lg mb-2">⚠️ Important Notice</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              By purchasing or subscribing to any of our services, you agree to the terms outlined below. Since we deal in digital products, most delivered items are <strong className="text-foreground">non-refundable</strong> once activated.
            </p>
          </motion.div>

          <div className="space-y-4">
            {policies.map((policy, i) => (
              <motion.div
                key={policy.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h2 className="font-display font-semibold text-foreground text-lg mb-2">
                  <span className="text-primary mr-2">{policy.number}.</span>
                  {policy.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{policy.content}</p>
              </motion.div>
            ))}
          </div>

          {/* Support CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 bg-card border border-border rounded-xl p-8 text-center"
          >
            <h2 className="font-display font-semibold text-foreground text-xl mb-3">
              Need Support or Have Questions?
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Contact us with your order details. We'll review your request and get back to you within 24-48 hours. WhatsApp is the fastest way to reach us!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/916357998730?text=Hi,%20I%20have%20a%20query%20regarding%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                💬 Chat on WhatsApp
              </a>
              <a
                href="mailto:dreamcrestsolutions@gmail.com?subject=Refund/Support%20Request"
                className="inline-block bg-card text-primary border border-primary/30 px-6 py-2.5 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                📧 Email Us
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

export default Refunds;

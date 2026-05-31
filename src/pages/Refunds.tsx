import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { motion } from 'framer-motion';
import SEOHead from '@/components/SEOHead';
import PageBanner from '@/components/PageBanner';

const policies = [
  {
    number: '1',
    title: 'Most digital sales are final',
    content: 'Because what we ship are digital keys and accounts, all orders are treated as final unless a clause below clearly applies to your case.',
  },
  {
    number: '2',
    title: 'Free replacement when an OTT plan breaks',
    content: 'If an OTT subscription stops working before its validity ends, we either repair the same plan or hand you an equivalent one at no extra cost.',
  },
  {
    number: '3',
    title: 'Already activated? Refunds close',
    content: 'Once the credentials are delivered, the key is activated, or the service has been used even once, the order moves out of the refund window.',
  },
  {
    number: '4',
    title: 'Lifetime plans come with a 1-year care window',
    content: 'Anything sold as "lifetime" is covered by a 12-month warranty from purchase. After the window closes, we cannot guarantee fixes or swaps on that key.',
  },
  {
    number: '5',
    title: 'Small upkeep fee on long-life plans',
    content: 'A few lifetime services may carry an Annual Maintenance Charge of roughly 25%–30% of the original price to keep the underlying account healthy.',
  },
  {
    number: '6',
    title: 'When you do qualify for a refund',
    content: 'Refunds are granted only when we are unable to deliver your order, or when the stock you paid for has run out and an alternative is not acceptable to you.',
  },
  {
    number: '7',
    title: 'We follow the upstream rules',
    content: 'Castle Tools is a reseller — not the maker of these tools. If an OEM changes its terms or pricing mid-cycle, our policy follows their lead.',
  },
  {
    number: '8',
    title: 'Large-scale platform bans',
    content: 'If a whole platform (think Netflix, Prime Video, etc.) freezes or bans accounts in bulk, we replace impacted plans free, wherever a fix is possible from our end.',
  },
  {
    number: '9',
    title: 'Downtime is added back to your plan',
    content: 'When a tool is down due to backend hiccups, we extend your validity to cover the lost days, so you do not pay for time you could not use.',
  },
  {
    number: '10',
    title: 'This page may evolve',
    content: 'We may tune this policy from time to time. Major changes will reflect on this page, and your continued use of Castle Tools means you accept them.',
  },
  {
    number: '11',
    title: 'Fair price, fair expectations',
    content: 'Because plans here are priced at a fraction of retail, occasional hiccups are part of the deal — but we work fast to keep your experience smooth.',
  },
];

const Refunds = () => {
  return (
    <div className="min-h-screen relative z-10">
      <SEOHead breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Refunds', url: '/refunds' }]} />
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <PageBanner
            eyebrow="The Royal Decree"
            title="Refunds &"
            highlight="Replacements"
            subtitle="How Castle Tools handles money-back requests, warranty fixes and the unusual edge cases."
          />


          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-primary/10 border border-primary/30 rounded-xl p-6 mb-8"
          >
            <h3 className="font-display font-semibold text-primary text-lg mb-2">⚠️ Heads-up</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              By placing an order on Castle Tools you accept the points below. Since most items are delivered as digital keys, anything <strong className="text-foreground">already activated</strong> usually cannot be refunded — but we'll always try to make things right.
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
                href="https://wa.me/919773453978?text=Hi,%20I%20have%20a%20query%20regarding%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                💬 Chat on WhatsApp
              </a>
              <a
                href="mailto:Castletool99@gmail.com?subject=Refund/Support%20Request"
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

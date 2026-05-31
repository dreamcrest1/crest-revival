import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SEOHead from '@/components/SEOHead';
import PageBanner from '@/components/PageBanner';

const faqs = [
  {
    q: 'Which payment options work on Castle Tools?',
    a: 'You can pay using UPI, Google Pay, PhonePe, Paytm, net banking or any Visa / Mastercard / RuPay card through our secured checkout.',
  },
  {
    q: 'How do I actually get the tool after paying?',
    a: 'Everything is digital. Once the payment lands, we send your login, key or activation link on WhatsApp and email, usually within 5 to 30 minutes.',
  },
  {
    q: 'Are the subscriptions you sell genuine?',
    a: 'Yes — every plan is sourced from official panels or licensed group buys. No cracks, no pirated builds, nothing dodgy.',
  },
  {
    q: 'What if I change my mind after ordering?',
    a: 'If the product has not been used or activated, ping us on WhatsApp within 7 days and we will arrange a refund. Once credentials are shared and used, refunds are not possible.',
  },
  {
    q: 'Something stopped working mid-plan — what now?',
    a: 'Every order ships with a warranty for the listed period. If anything breaks inside that window, message us and we replace it free, no long forms.',
  },
  {
    q: 'How quickly will I get my order?',
    a: 'Most orders go out in under half an hour. On very rare days it can stretch to 24 hours, and we keep you posted on WhatsApp till it lands.',
  },
  {
    q: 'Can I share the account with my team?',
    a: 'It depends on the plan. Some are strictly single-device, others happily handle a small team. The product page mentions it, and we will gladly clarify on chat.',
  },
  {
    q: 'Do you give discounts for bulk or reseller orders?',
    a: 'Yes. If you need many seats or want to resell, drop us a WhatsApp message and we will put together custom pricing.',
  },
  {
    q: 'How safe is the information I share?',
    a: 'We only use your details to process the order and talk to you about it. Nothing is sold, leaked or shared with third parties.',
  },
  {
    q: 'Where do I get help?',
    a: 'WhatsApp is the fastest at +91 97734 53978. You can also email Castletool99@gmail.com or DM @Castletool99 on Instagram.',
  },
];

const FAQ = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return (
    <div className="min-h-screen relative z-10">
      <SEOHead
        jsonLd={faqJsonLd}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'FAQ', url: '/faq' },
        ]}
      />
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <PageBanner
            eyebrow="The Royal Scrolls"
            title="Frequently Asked"
            highlight="Questions"
            subtitle="Everything you need to know about our products and services"
          />


          <div className="bg-card border border-border rounded-xl p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-foreground font-medium">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default FAQ;

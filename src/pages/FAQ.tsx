import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SEOHead from '@/components/SEOHead';

const faqs = [
  {
    q: 'What payment methods do you accept?',
    a: 'We accept UPI, Google Pay, PhonePe, Paytm, bank transfers, and all major debit/credit cards via our secure payment gateway.',
  },
  {
    q: 'How will I receive my product after purchase?',
    a: 'All products are delivered digitally. You will receive your credentials, activation link, or product access via WhatsApp or email within 5–30 minutes of payment confirmation.',
  },
  {
    q: 'Are these products genuine and legal?',
    a: 'Yes, all our products are 100% genuine. We are authorized resellers and group-buy partners for the tools and subscriptions we offer.',
  },
  {
    q: 'What is your refund policy?',
    a: 'Refunds are provided within 7 days of purchase if the product has not been activated or used. Once a product is activated or credentials are shared, refunds cannot be processed. Contact us on WhatsApp for refund requests.',
  },
  {
    q: 'What if my product stops working during the warranty period?',
    a: 'All products come with a warranty for the specified duration. If you face any issues during the warranty period, we will provide a free replacement. Contact our 24/7 WhatsApp support.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Most orders are delivered within 5–30 minutes. In rare cases, delivery may take up to 24 hours. You will be notified via WhatsApp once your order is ready.',
  },
  {
    q: 'Can I share my account with others?',
    a: 'Sharing depends on the product type. Some subscriptions are single-user, while others support multiple devices. Check the product description or ask us on WhatsApp for details.',
  },
  {
    q: 'Do you offer bulk or reseller pricing?',
    a: 'Yes! We offer special pricing for bulk orders and resellers. Contact us on WhatsApp to discuss custom pricing for your needs.',
  },
  {
    q: 'Is my personal information safe?',
    a: 'Absolutely. We respect your privacy. Your personal information is used only for order processing and communication. We do not share your data with third parties.',
  },
  {
    q: 'How can I contact support?',
    a: 'Our 24/7 support team is available on WhatsApp at +91 6357998730. You can also reach us via email or Instagram @dreamcrest_solutions.',
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen relative z-10">
      <SEOHead />
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h1>
            <p className="text-muted-foreground">
              Everything you need to know about our products and services
            </p>
          </div>

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

import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  'Most Trusted Service Provider',
  'Over 200+ Products Available',
  'Most Responsive Customer Support',
  'Instant Digital Delivery',
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary font-medium text-sm uppercase tracking-wider mb-2">About Us</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Dreamcrest Solutions
            </h2>
            <h3 className="font-display text-xl text-muted-foreground mb-6">
              Oldest Multiplatform Service Provider
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Dreamcrest Group is a leading provider of OTT services and group buy tools at discounted prices. Founded in 2021, Dreamcrest has gained over 15,000+ customers and has expanded its reach internationally.
            </p>

            <div className="space-y-3">
              {features.map(f => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="font-display text-3xl font-bold text-primary">15,000+</div>
              <div className="text-sm text-muted-foreground mt-1">Happy Customers</div>
              <div className="text-xs text-muted-foreground mt-1">& Growing Every Day</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="font-display text-3xl font-bold text-primary">⭐ 4.9</div>
              <div className="text-sm text-muted-foreground mt-1">Rating</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="font-display text-3xl font-bold text-primary">🚀 2021</div>
              <div className="text-sm text-muted-foreground mt-1">Since</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="font-display text-3xl font-bold text-primary">200+</div>
              <div className="text-sm text-muted-foreground mt-1">Products</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

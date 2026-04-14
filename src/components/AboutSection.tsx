import { motion } from 'framer-motion';
import { UsersIcon, BoxIcon, CalendarIcon, ShieldCheckIcon } from '@/components/icons/BrandIcons';
import { CheckCircle } from 'lucide-react';

const features = [
  'Most Trusted Service Provider',
  'Over 200+ Products Available',
  'Most Responsive Customer Support',
  'Instant Digital Delivery',
];

const stats = [
  { value: '15,000+', label: 'Happy Customers', sub: '& Growing Every Day', Icon: UsersIcon },
  { value: '⭐ 4.9', label: 'Rating', Icon: ShieldCheckIcon },
  { value: '🚀 2021', label: 'Since', Icon: CalendarIcon },
  { value: '200+', label: 'Products', Icon: BoxIcon },
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
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-card border border-border rounded-2xl p-6 text-center card-hover overflow-hidden"
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-primary/5 to-transparent" />
                <div className="relative z-10">
                  <div className="font-display text-3xl font-bold text-primary">{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                  {s.sub && <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

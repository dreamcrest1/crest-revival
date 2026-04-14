import { Link } from 'react-router-dom';
import { categories } from '@/data/products';
import { motion } from 'framer-motion';

const categoryIcons: Record<string, string> = {
  'AI Tools': '🤖',
  'Writing Tools': '✍️',
  'Video Editing': '🎬',
  'Indian OTT': '📺',
  'International OTT': '🌍',
  'SEO': '🔍',
  'VPN': '🔐',
  'Lead Generation': '👥',
  'Design Tools': '🎨',
  'Cloud Storage': '☁️',
  'Learning': '📚',
  'Music': '🎵',
};

const CategoriesSection = () => {
  return (
    <section className="py-24 relative">
      {/* Subtle section glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Browse <span className="text-gradient">Categories</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find what you need from our wide range of premium digital products
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group relative block bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl p-7 text-center card-hover overflow-hidden"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-primary/[0.06] to-transparent" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">{categoryIcons[cat.name] || cat.emoji}</span>
                  </div>
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors duration-300 text-sm md:text-base">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 font-medium">{cat.count} Products</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

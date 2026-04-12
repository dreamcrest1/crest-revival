import { Link } from 'react-router-dom';
import { categories } from '@/data/products';
import { motion } from 'framer-motion';

const CategoriesSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Browse Categories
          </h2>
          <p className="text-muted-foreground">Find what you need from our wide range</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="block bg-card border border-border rounded-xl p-6 text-center card-hover group"
              >
                <div className="text-3xl mb-3">{cat.emoji}</div>
                <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{cat.count} Products</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

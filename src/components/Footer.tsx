import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-border bg-card/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold font-display text-lg">D</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Dream<span className="text-primary">crest</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              India's most trusted digital product store. Serving 15,000+ happy customers since 2021.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">Products</Link></li>
              <li><a href="/#about" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="/#faq" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products?category=AI+Tools" className="hover:text-primary transition-colors">AI Tools</Link></li>
              <li><Link to="/products?category=Indian+OTT" className="hover:text-primary transition-colors">Indian OTT</Link></li>
              <li><Link to="/products?category=Software" className="hover:text-primary transition-colors">Software</Link></li>
              <li><Link to="/products?category=Writing+Tools" className="hover:text-primary transition-colors">Writing Tools</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://wa.me/916357998730" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  💬 WhatsApp
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/dreamcrest_solutions" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  📸 Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Dreamcrest Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

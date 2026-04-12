import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Contact', path: '/contact' },
  { label: 'Terms', path: '/terms' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      {/* Top banner */}
      <div className="bg-primary/10 border-b border-primary/20 py-1.5 text-center">
        <p className="text-xs font-medium tracking-wider text-primary uppercase">
          Instant Delivery of All Digital Products
        </p>
      </div>

      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold font-display text-lg">D</span>
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            Dream<span className="text-primary">crest</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.path ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            asChild
          >
            <Link to="/products">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Shop Now
            </Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button size="sm" className="w-full bg-primary text-primary-foreground" asChild>
            <Link to="/products" onClick={() => setIsOpen(false)}>Shop Now</Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

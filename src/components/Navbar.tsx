import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import logo from '@/assets/logo.png';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'All Tools', path: '/alltools' },
  { label: 'About', path: '/about' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Refunds', path: '/refunds' },
  { label: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const cart = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/60 backdrop-blur-xl">
      <div className="bg-primary/10 border-b border-primary/20 py-1.5 text-center">
        <p className="text-xs font-medium tracking-wider text-primary uppercase">
          Instant Delivery of All Digital Products
        </p>
      </div>

      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Dreamcrest" className="w-8 h-8 rounded-lg object-contain" />
          <span className="font-display font-bold text-xl text-foreground">
            Dream<span className="text-primary">crest</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-5">
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

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => cart.setIsOpen(true)}
            className="relative w-9 h-9 rounded-full bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            {cart.totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
                {cart.totalItems}
              </span>
            )}
          </button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" asChild>
            <Link to="/products">
              Shop Now
            </Link>
          </Button>
          <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10" asChild>
            <Link to="/admin">
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Link>
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/90 backdrop-blur-xl px-4 py-4 space-y-3">
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

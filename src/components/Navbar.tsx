import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ShoppingCart, Shield, User, Package, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo.png';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'AI Tools', path: '/ai-tools' },
  { label: 'All Tools', path: '/alltools' },
  { label: 'About', path: '/about' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Refunds', path: '/refunds' },
  { label: 'Contact', path: '/contact' },
];

// Portcullis icon
const PortcullisIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="2" y="3" width="20" height="18" rx="0.5" />
    <path d="M6 3v18M10 3v18M14 3v18M18 3v18" />
    <path d="M2 9h20M2 15h20" />
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const cart = useCart();
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[hsl(28_25%_8%/0.85)] border-b border-primary/30 shadow-[0_4px_20px_hsl(0_0%_0%/0.6)]">
      {/* Crenellated top */}
      <div className="h-3 bg-gradient-to-b from-primary/40 to-transparent crenellated-top" aria-hidden />

      <div className="bg-destructive/20 border-y border-primary/30 py-1.5 text-center">
        <p className="text-xs font-display tracking-[0.25em] text-primary uppercase">
          ⚜ Instant Delivery of All Digital Wares ⚜
        </p>
      </div>

      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Heraldic shield logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-12 shield-shape bg-gradient-to-b from-destructive to-[hsl(0_100%_16%)] border border-primary/60 flex items-center justify-center shadow-[0_2px_8px_hsl(0_0%_0%/0.6)] torch-flicker">
            <img src={logo} alt="Dreamcrest" className="w-6 h-6 object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-xl text-vellum tracking-wide engraved">
              Dream<span className="text-gold-glow">crest</span>
            </span>
            <span className="text-[9px] tracking-[0.4em] text-primary/70 font-script uppercase mt-0.5">— Royal Storehouse —</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`group relative text-[12px] font-display tracking-[0.15em] uppercase px-3 py-2 transition-all stone-tablet rounded-sm ${
                  active ? 'text-primary shadow-[0_0_14px_hsl(43_79%_46%/0.5)]' : 'text-vellum/80 hover:text-primary'
                }`}
              >
                <Swords className="inline w-3 h-3 mr-1.5 -mt-0.5 text-primary/70 group-hover:text-primary" />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => cart.setIsOpen(true)}
            className="relative w-10 h-10 rounded-sm stone-tablet text-primary hover:text-vellum transition-colors flex items-center justify-center torch-flicker"
            aria-label="Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {cart.totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 wax-seal text-[10px] font-bold rounded-full flex items-center justify-center">
                {cart.totalItems}
              </span>
            )}
          </button>
          <Button size="sm" asChild>
            <Link to="/products">⚔ Shop</Link>
          </Button>
          {user ? (
            <Button size="sm" variant="secondary" asChild>
              <Link to="/my-orders"><Package className="w-4 h-4" /> Orders</Link>
            </Button>
          ) : (
            <Button size="sm" variant="secondary" asChild>
              <Link to="/auth"><User className="w-4 h-4" /> Enter</Link>
            </Button>
          )}
          <Button size="sm" variant="secondary" asChild>
            <Link to="/admin"><Shield className="w-4 h-4" /> Keep</Link>
          </Button>
        </div>

        <button
          className="md:hidden text-primary hover:text-vellum transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? <X className="w-7 h-7" /> : <PortcullisIcon className="w-7 h-7" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-primary/30 bg-[hsl(28_25%_6%/0.96)] backdrop-blur-xl px-4 py-4 space-y-2 animate-emerge">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="block text-sm font-display tracking-[0.18em] uppercase text-vellum/90 hover:text-primary transition-colors py-2 border-b border-primary/10"
              onClick={() => setIsOpen(false)}
            >
              <Swords className="inline w-3 h-3 mr-2 text-primary/70" />
              {link.label}
            </Link>
          ))}
          <Link
            to={user ? '/my-orders' : '/auth'}
            className="block text-sm font-display tracking-[0.18em] uppercase text-primary py-2"
            onClick={() => setIsOpen(false)}
          >
            ⚜ {user ? 'My Orders' : 'Enter the Keep'}
          </Link>
          <Button size="sm" className="w-full" asChild>
            <Link to="/products" onClick={() => setIsOpen(false)}>⚔ Shop Now</Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

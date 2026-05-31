import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Shield, User, Package, Crown, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const cart = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(8,8,14,0.95)' : 'rgba(12,12,20,0.85)',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(12px)',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(12px)',
        borderBottom: '1px solid rgba(201,168,76,0.15)',
      }}
    >
      {/* Announcement banner */}
      <div
        className="py-1.5 text-center flex items-center justify-center gap-3"
        style={{
          background: 'linear-gradient(90deg, #1A0E00, #2A1800, #1A0E00)',
          borderBottom: '1px solid rgba(201,168,76,0.3)',
        }}
      >
        <Flame className="w-3 h-3 text-gold animate-torch-flicker" style={{ color: '#C9A84C' }} />
        <p className="text-[11px] font-medium uppercase" style={{ color: '#C9A84C', letterSpacing: '0.15em' }}>
          Instant Delivery of All Digital Products
        </p>
        <Flame className="w-3 h-3 text-gold animate-torch-flicker" style={{ color: '#C9A84C', animationDelay: '0.4s' }} />
      </div>

      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Crown className="w-6 h-6" style={{ color: '#C9A84C' }} />
          <span className="font-display font-bold text-xl">
            <span style={{ color: '#F0EAD6' }}>Castle</span>
            <span style={{ color: '#C9A84C' }}> Tools</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {navLinks.map(link => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`group relative text-sm font-medium transition-colors ${
                  active ? 'text-gold' : 'text-muted-foreground hover:text-gold'
                }`}
                style={active ? { color: '#C9A84C' } : undefined}
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100"
                  style={{ background: '#C9A84C', transformOrigin: 'left', transform: active ? 'scaleX(1)' : undefined }}
                />
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => cart.setIsOpen(true)}
            className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:text-gold"
            style={{
              background: 'hsl(240 20% 13%)',
              border: '1px solid hsl(240 26% 18%)',
              color: '#8A8AA0',
            }}
            aria-label="Open cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {cart.totalItems > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]"
                style={{ background: '#C9A84C', color: '#0A0A0F' }}
              >
                {cart.totalItems}
              </span>
            )}
          </button>
          <Button
            size="sm"
            className="font-semibold transition-all"
            style={{ background: '#C9A84C', color: '#0A0A0F', borderRadius: 6 }}
            asChild
          >
            <Link to="/products">Shop Now</Link>
          </Button>
          {user ? (
            <Button
              size="sm"
              variant="outline"
              style={{ borderColor: '#C9A84C', color: '#C9A84C', background: 'transparent', borderRadius: 6 }}
              asChild
            >
              <Link to="/my-orders">
                <Package className="w-4 h-4 mr-2" />
                My Orders
              </Link>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              style={{ borderColor: '#C9A84C', color: '#C9A84C', background: 'transparent', borderRadius: 6 }}
              asChild
            >
              <Link to="/auth">
                <User className="w-4 h-4 mr-2" />
                Login
              </Link>
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            style={{
              background: 'hsl(240 20% 13%)',
              borderColor: 'hsl(240 26% 18%)',
              color: '#8A8AA0',
              borderRadius: 6,
            }}
            asChild
          >
            <Link to="/admin">
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Link>
          </Button>
        </div>

        <button className="md:hidden" style={{ color: '#F0EAD6' }} onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div
          className="md:hidden px-4 py-4 space-y-3"
          style={{
            background: 'rgba(8,8,14,0.96)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(201,168,76,0.15)',
          }}
        >
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="block text-sm font-medium transition-colors hover:text-gold"
              style={{ color: '#8A8AA0' }}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to={user ? '/my-orders' : '/auth'}
            className="block text-sm font-medium"
            style={{ color: '#C9A84C' }}
            onClick={() => setIsOpen(false)}
          >
            {user ? 'My Orders' : 'Login / Sign Up'}
          </Link>
          <Button
            size="sm"
            className="w-full font-semibold"
            style={{ background: '#C9A84C', color: '#0A0A0F', borderRadius: 6 }}
            asChild
          >
            <Link to="/products" onClick={() => setIsOpen(false)}>
              Shop Now
            </Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

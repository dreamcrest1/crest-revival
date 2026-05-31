import { Link } from 'react-router-dom';
import { WhatsAppIcon, InstagramIcon, EmailIcon } from './SocialIcons';
import { GlobeIcon } from './icons/BrandIcons';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer id="contact" className="relative z-10 border-t border-primary/30 bg-card/60 backdrop-blur-sm py-12 mt-12">
      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Castle Tools" className="w-9 h-9 rounded-lg object-contain ring-1 ring-primary/40" />
              <span className="font-display font-bold text-xl text-foreground tracking-wide">
                Castle <span className="text-primary italic">Tools</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              The kingdom's trusted vault for premium digital tools, OTT plans and AI subscriptions — looking after happy customers since day one.
            </p>
            {/* Social icons row */}
            <div className="flex items-center gap-3">
              <a href="https://wa.me/919773453978" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#25D366] transition-colors">
                <WhatsAppIcon className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/Castletool99" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#E4405F] transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/share/18fxQZhomn/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#1877F2] transition-colors" aria-label="Facebook">
                <GlobeIcon className="w-5 h-5" />
              </a>
              <a href="mailto:Castletool99@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                <EmailIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">Products</Link></li>
              <li><Link to="/alltools" className="hover:text-primary transition-colors">All Tools</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Policies</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/refunds" className="hover:text-primary transition-colors">Refund Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="https://wa.me/919773453978" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#25D366] transition-colors">
                  <WhatsAppIcon className="w-4 h-4" /> WhatsApp
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/Castletool99" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#E4405F] transition-colors">
                  <InstagramIcon className="w-4 h-4" /> Instagram
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/share/18fxQZhomn/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#1877F2] transition-colors">
                  <GlobeIcon className="w-4 h-4" /> Facebook
                </a>
              </li>
              <li>
                <a href="mailto:Castletool99@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <EmailIcon className="w-4 h-4" /> Castletool99@gmail.com
                </a>
              </li>
              <li className="text-xs pt-1">📞 +91 97734 53978</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-primary">❖</span>
            <span>Powered by Castle Tools & Castle Tools | © {new Date().getFullYear()} All rights reserved.</span>
            <span className="text-primary">❖</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

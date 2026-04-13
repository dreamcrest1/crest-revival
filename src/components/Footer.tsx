import { Link } from 'react-router-dom';
import { WhatsAppIcon, InstagramIcon, EmailIcon, YouTubeIcon } from './SocialIcons';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer id="contact" className="relative z-10 border-t border-border bg-card/50 backdrop-blur-sm py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Dreamcrest" className="w-8 h-8 rounded-lg object-contain" />
              <span className="font-display font-bold text-xl text-foreground">
                Dream<span className="text-primary">crest</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              India's most trusted digital product store. Serving 15,000+ happy customers since 2021.
            </p>
            {/* Social icons row */}
            <div className="flex items-center gap-3">
              <a href="https://wa.me/916357998730" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#25D366] transition-colors">
                <WhatsAppIcon className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/dreamcrest_solutions" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#E4405F] transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/channel/UCbqBFmu4oZ3PpcwEdMVDDcw" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#FF0000] transition-colors">
                <YouTubeIcon className="w-5 h-5" />
              </a>
              <a href="mailto:dreamcrestsolutions@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
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
                <a href="https://wa.me/916357998730" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#25D366] transition-colors">
                  <WhatsAppIcon className="w-4 h-4" /> WhatsApp
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/dreamcrest_solutions" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#E4405F] transition-colors">
                  <InstagramIcon className="w-4 h-4" /> Instagram
                </a>
              </li>
              <li>
                <a href="mailto:dreamcrestsolutions@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <EmailIcon className="w-4 h-4" /> Email
                </a>
              </li>
              <li className="text-xs pt-1">🏢 D-18 Richmond Heights, Sector 37, Gandhinagar, GJ 382010</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>Powered by Dreamcrest & Dreamstar | © {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

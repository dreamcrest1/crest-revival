import { Link } from 'react-router-dom';
import { WhatsAppIcon, InstagramIcon, EmailIcon, YouTubeIcon } from './SocialIcons';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer id="contact" className="relative z-10 mt-16">
      {/* Rampart silhouette top edge */}
      <div className="h-4 bg-[hsl(28_25%_4%)] ramparts-top -mb-px" aria-hidden />

      <div
        className="bg-[hsl(28_25%_4%)] border-t border-primary/30 pt-12 pb-6 px-4"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='80'><defs><filter id='n'><feTurbulence baseFrequency='0.7' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.04  0 0 0 0 0.03  0 0 0 0 0.02  0 0 0 0.5 0'/></filter></defs><rect width='160' height='80' fill='%23080604'/><g filter='url(%23n)'><rect width='160' height='80'/></g><g fill='none' stroke='%23000' stroke-opacity='0.6'><path d='M0 40 H160 M0 80 H160 M0 0 V40 M55 0 V40 M110 0 V40 M160 0 V40 M30 40 V80 M85 40 V80 M140 40 V80'/></g></svg>\")",
          backgroundRepeat: 'repeat',
        }}
      >
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-1 mb-3 text-destructive">
                <span className="text-lg">⚜</span><span className="h-px flex-1 bg-primary/30" />
              </div>
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-11 shield-shape bg-gradient-to-b from-destructive to-[hsl(0_100%_16%)] border border-primary/60 flex items-center justify-center">
                  <img src={logo} alt="Dreamcrest" className="w-5 h-5 object-contain" />
                </div>
                <span className="font-display font-bold text-xl text-vellum engraved">
                  Dream<span className="text-gold-glow">crest</span>
                </span>
              </Link>
              <p className="text-sm text-vellum/70 mb-4 font-script italic leading-relaxed">
                The realm's most trusted digital storehouse. Serving 15,000+ loyal patrons since the year 2021.
              </p>
              <div className="flex items-center gap-3">
                <a href="https://wa.me/916357998730" target="_blank" rel="noopener noreferrer" className="w-9 h-9 stone-tablet flex items-center justify-center text-vellum/80 hover:text-[#25D366] transition-colors">
                  <WhatsAppIcon className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/dreamcrest_solutions" target="_blank" rel="noopener noreferrer" className="w-9 h-9 stone-tablet flex items-center justify-center text-vellum/80 hover:text-[#E4405F] transition-colors">
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a href="https://www.youtube.com/channel/UCbqBFmu4oZ3PpcwEdMVDDcw" target="_blank" rel="noopener noreferrer" className="w-9 h-9 stone-tablet flex items-center justify-center text-vellum/80 hover:text-[#FF0000] transition-colors">
                  <YouTubeIcon className="w-4 h-4" />
                </a>
                <a href="mailto:dreamcrestsolutions@gmail.com" className="w-9 h-9 stone-tablet flex items-center justify-center text-vellum/80 hover:text-primary transition-colors">
                  <EmailIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1 mb-3 text-primary"><span className="text-lg">⚜</span><span className="h-px flex-1 bg-primary/30" /></div>
              <h4 className="font-display font-bold text-vellum mb-4 tracking-[0.15em] uppercase text-sm">Quick Paths</h4>
              <ul className="space-y-2 text-sm text-vellum/70 font-script">
                <li><Link to="/" className="hover:text-primary transition-colors">⚔ Home</Link></li>
                <li><Link to="/products" className="hover:text-primary transition-colors">⚔ Products</Link></li>
                <li><Link to="/alltools" className="hover:text-primary transition-colors">⚔ All Tools</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">⚔ About</Link></li>
                <li><Link to="/faq" className="hover:text-primary transition-colors">⚔ FAQ</Link></li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-1 mb-3 text-accent"><span className="text-lg">⚜</span><span className="h-px flex-1 bg-primary/30" /></div>
              <h4 className="font-display font-bold text-vellum mb-4 tracking-[0.15em] uppercase text-sm">Royal Decrees</h4>
              <ul className="space-y-2 text-sm text-vellum/70 font-script">
                <li><Link to="/refunds" className="hover:text-primary transition-colors">⚔ Refund Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">⚔ Terms & Conditions</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">⚔ Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-1 mb-3 text-destructive"><span className="text-lg">⚜</span><span className="h-px flex-1 bg-primary/30" /></div>
              <h4 className="font-display font-bold text-vellum mb-4 tracking-[0.15em] uppercase text-sm">Send a Raven</h4>
              <ul className="space-y-3 text-sm text-vellum/70 font-script">
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
                <li className="text-xs pt-1 italic">🏰 D-18 Richmond Heights, Sector 37, Gandhinagar, GJ 382010</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary/20 mt-10 pt-5 text-center text-sm">
            <p className="font-display italic text-vellum/60 tracking-wider">
              <span className="text-primary mr-2">⚜</span>
              Powered by Dreamcrest &amp; Dreamstar · © {new Date().getFullYear()} All rights reserved
              <span className="text-primary ml-2">⚜</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

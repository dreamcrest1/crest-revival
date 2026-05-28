import { WhatsAppIcon } from './SocialIcons';
import { waLink } from '@/lib/whatsapp';

const WhatsAppButton = () => {
  return (
    <a
      href={waLink(undefined, 'footer')}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 bg-gold text-[hsl(240_22%_5%)] font-semibold shadow-lg transition-all hover:shadow-[0_0_24px_rgba(201,168,76,0.55)] hover:scale-[1.03]"
      aria-label="Chat on WhatsApp"
      style={{ backgroundColor: 'hsl(45 53% 54%)' }}
    >
      <WhatsAppIcon className="w-5 h-5" />
      <span className="text-sm hidden sm:inline transition-all">
        <span className="sm:hidden md:inline">Chat on WhatsApp</span>
        <span className="hidden sm:inline md:hidden">Chat Now</span>
      </span>
    </a>
  );
};

export default WhatsAppButton;

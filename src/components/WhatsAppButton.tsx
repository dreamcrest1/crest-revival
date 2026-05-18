import { WhatsAppIcon } from './SocialIcons';
import { waLink } from '@/lib/whatsapp';

const WhatsAppButton = () => {
  return (
    <a
      href={waLink(undefined, 'footer')}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-[#fff] rounded-full px-5 py-3 shadow-lg hover:shadow-xl transition-all hover:scale-105"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon className="w-5 h-5" />
      <span className="text-sm font-semibold hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;

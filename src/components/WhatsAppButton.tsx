import { WhatsAppIcon } from './SocialIcons';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/916357998730"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-[#fff] rounded-full px-5 py-3 shadow-lg hover:shadow-xl transition-all hover:scale-105"
    >
      <WhatsAppIcon className="w-5 h-5" />
      <span className="text-sm font-semibold hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;

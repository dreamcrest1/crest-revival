// Maps product/tool names to the user's uploaded square PNG logos in /public/logos.
// Only the 40 logos shipped under /public/logos are referenced.
// Order matters — list more-specific names BEFORE shorter substrings.

type LogoEntry = { match: string; file: string };

const ENTRIES: LogoEntry[] = [
  // OTT
  { match: 'jiohotstar', file: 'jiohotstar.png' },
  { match: 'jio hotstar', file: 'jiohotstar.png' },
  { match: 'disney+ hotstar', file: 'jiohotstar.png' },
  { match: 'disney+', file: 'jiohotstar.png' },
  { match: 'hotstar', file: 'jiohotstar.png' },
  { match: 'netflix', file: 'netflix.png' },
  { match: 'amazon prime', file: 'prime-video.png' },
  { match: 'prime video', file: 'prime-video.png' },
  { match: 'hbo max', file: 'hbo-max.png' },
  { match: 'hbo', file: 'hbo-max.png' },
  { match: 'crunchyroll', file: 'crunchyroll.png' },
  { match: 'zee5', file: 'zee5.png' },
  { match: 'sonyliv', file: 'sonyliv.png' },
  { match: 'sony liv', file: 'sonyliv.png' },
  { match: 'hoichoi', file: 'hoichoi.png' },
  { match: 'chaupal', file: 'chaupal.png' },
  { match: 'iptv', file: 'iptv.png' },
  { match: 'youtube', file: 'youtube.png' },

  // Productivity / office
  { match: 'microsoft 365', file: 'office365.png' },
  { match: 'office 365', file: 'office365.png' },
  { match: 'office365', file: 'office365.png' },
  { match: 'notion', file: 'notion.png' },
  { match: 'linkedin', file: 'linkedin.png' },
  { match: 'coursera', file: 'coursera.png' },
  { match: 'datacamp', file: 'datacamp.png' },
  { match: 'quillbot', file: 'quillbot.png' },
  { match: 'turnitin', file: 'turnitin.png' },
  { match: 'nord vpn', file: 'nordvpn.png' },
  { match: 'nordvpn', file: 'nordvpn.png' },
  { match: 'semrush', file: 'semrush.png' },

  // Design / video
  { match: 'canva', file: 'canva.png' },
  { match: 'adobe', file: 'adobe.png' },
  { match: 'figma', file: 'figma.png' },
  { match: 'envato', file: 'envato.png' },
  { match: 'heygen', file: 'heygen.png' },
  { match: 'eleven labs', file: 'elevenlabs.png' },
  { match: 'elevenlabs', file: 'elevenlabs.png' },
  { match: 'runway', file: 'runway.png' },
  { match: 'gamma', file: 'gamma.png' },
  { match: 'wondershare', file: 'filmora.png' },
  { match: 'filmora', file: 'filmora.png' },

  // AI / coding
  { match: 'chatgpt', file: 'chatgpt.png' },
  { match: 'gemini', file: 'gemini.png' },
  { match: 'perplexity', file: 'perplexity.png' },
  { match: 'claude', file: 'claude.png' },
  { match: 'jasper', file: 'jasper.png' },
  { match: 'deepgram', file: 'deepgram.png' },
  { match: 'firecrawl', file: 'firecrawl.png' },
  { match: 'lovable', file: 'lovable.png' },
  { match: 'bolt', file: 'bolt.png' },
  { match: 'replit', file: 'replit.png' },
  { match: 'supabase', file: 'supabase.png' },
];

function norm(s: string) {
  return (s || '').toLowerCase();
}

/** Returns absolute path to the user-uploaded logo for a tool/product name, or null. */
export function userLogoFor(name: string): string | null {
  const n = norm(name);
  for (const e of ENTRIES) {
    if (n.includes(e.match)) return `/logos/${e.file}`;
  }
  return null;
}

/** The fixed 40 logos shown on the homepage globe. */
export const GLOBE_LOGOS: { name: string; file: string; href: string }[] = [
  // AI / coding
  { name: 'ChatGPT', file: 'chatgpt.png', href: '/ai-tools' },
  { name: 'Gemini', file: 'gemini.png', href: '/ai-tools' },
  { name: 'Perplexity', file: 'perplexity.png', href: '/ai-tools' },
  { name: 'Claude', file: 'claude.png', href: '/ai-tools' },
  { name: 'Jasper', file: 'jasper.png', href: '/ai-tools' },
  { name: 'Deepgram', file: 'deepgram.png', href: '/ai-tools' },
  { name: 'Firecrawl', file: 'firecrawl.png', href: '/ai-tools' },
  { name: 'Lovable', file: 'lovable.png', href: '/ai-tools' },
  { name: 'Bolt', file: 'bolt.png', href: '/ai-tools' },
  { name: 'Replit', file: 'replit.png', href: '/ai-tools' },
  { name: 'Supabase', file: 'supabase.png', href: '/ai-tools' },
  // Design / video
  { name: 'Canva', file: 'canva.png', href: '/ai-tools' },
  { name: 'Adobe', file: 'adobe.png', href: '/ai-tools' },
  { name: 'Figma', file: 'figma.png', href: '/ai-tools' },
  { name: 'Envato', file: 'envato.png', href: '/ai-tools' },
  { name: 'HeyGen', file: 'heygen.png', href: '/ai-tools' },
  { name: 'ElevenLabs', file: 'elevenlabs.png', href: '/ai-tools' },
  { name: 'Runway', file: 'runway.png', href: '/ai-tools' },
  { name: 'Gamma', file: 'gamma.png', href: '/ai-tools' },
  { name: 'Filmora', file: 'filmora.png', href: '/ai-tools' },
  // Productivity
  { name: 'Office 365', file: 'office365.png', href: '/ai-tools' },
  { name: 'Notion', file: 'notion.png', href: '/ai-tools' },
  { name: 'LinkedIn', file: 'linkedin.png', href: '/ai-tools' },
  { name: 'Coursera', file: 'coursera.png', href: '/ai-tools' },
  { name: 'DataCamp', file: 'datacamp.png', href: '/ai-tools' },
  { name: 'QuillBot', file: 'quillbot.png', href: '/ai-tools' },
  { name: 'Turnitin', file: 'turnitin.png', href: '/ai-tools' },
  { name: 'NordVPN', file: 'nordvpn.png', href: '/ai-tools' },
  { name: 'SEMrush', file: 'semrush.png', href: '/ai-tools' },
  // OTT
  { name: 'Netflix', file: 'netflix.png', href: '/' },
  { name: 'Prime Video', file: 'prime-video.png', href: '/' },
  { name: 'JioHotstar', file: 'jiohotstar.png', href: '/' },
  { name: 'SonyLIV', file: 'sonyliv.png', href: '/' },
  { name: 'Zee5', file: 'zee5.png', href: '/' },
  { name: 'HBO Max', file: 'hbo-max.png', href: '/' },
  { name: 'Crunchyroll', file: 'crunchyroll.png', href: '/' },
  { name: 'Hoichoi', file: 'hoichoi.png', href: '/' },
  { name: 'Chaupal', file: 'chaupal.png', href: '/' },
  { name: 'IPTV', file: 'iptv.png', href: '/' },
  { name: 'YouTube', file: 'youtube.png', href: '/' },
];

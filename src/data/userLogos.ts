// Maps product/tool names to the user's uploaded square PNG logos in /public/logos.
// Order matters — list more-specific names BEFORE shorter substrings.

type LogoEntry = { match: string; file: string };

const ENTRIES: LogoEntry[] = [
  // OTT
  { match: 'jiohotstar', file: 'hotstar.png' },
  { match: 'disney+ hotstar', file: 'hotstar.png' },
  { match: 'disney+', file: 'hotstar.png' },
  { match: 'hotstar', file: 'hotstar.png' },
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

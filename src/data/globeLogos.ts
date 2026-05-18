// Static logo set displayed on the homepage globe.
// Each entry knows how to resolve to a destination route — either a specific
// OTT product detail page, or an AI tool detail page (looked up by name in the
// live sheet at click time, with a safe fallback to /ai-tools).

import jasper from '@/assets/globe-logos/jasper.png';
import deepgram from '@/assets/globe-logos/deepgram.png';
import gemini from '@/assets/globe-logos/gemini.png';
import perplexity from '@/assets/globe-logos/perplexity.png';
import claude from '@/assets/globe-logos/claude.png';
import boltNew from '@/assets/globe-logos/bolt-new.png';
import lovable from '@/assets/globe-logos/lovable.png';
import netflix from '@/assets/globe-logos/netflix.png';
import primeVideo from '@/assets/globe-logos/prime-video.png';
import zee5 from '@/assets/globe-logos/zee5.png';
import sonyliv from '@/assets/globe-logos/sonyliv.png';
import jiohotstar from '@/assets/globe-logos/jiohotstar.png';
import hoichoi from '@/assets/globe-logos/hoichoi.png';
import chaupal from '@/assets/globe-logos/chaupal.png';
import iptv from '@/assets/globe-logos/iptv.png';
import hboMax from '@/assets/globe-logos/hbo-max.png';
import crunchyroll from '@/assets/globe-logos/crunchyroll.png';
import firecrawl from '@/assets/globe-logos/firecrawl.png';
import canva from '@/assets/globe-logos/canva.png';
import adobeCc from '@/assets/globe-logos/adobe-cc.png';
import figma from '@/assets/globe-logos/figma.png';
import envatoElements from '@/assets/globe-logos/envato-elements.png';
import heygen from '@/assets/globe-logos/heygen.png';
import elevenlabs from '@/assets/globe-logos/elevenlabs.png';
import runway from '@/assets/globe-logos/runway.png';
import gamma from '@/assets/globe-logos/gamma.png';
import semrush from '@/assets/globe-logos/semrush.png';
import office365 from '@/assets/globe-logos/office-365.png';
import notionPlus from '@/assets/globe-logos/notion-plus.png';
import linkedin from '@/assets/globe-logos/linkedin.png';
import quillbot from '@/assets/globe-logos/quillbot.png';
import coursera from '@/assets/globe-logos/coursera.png';
import datacamp from '@/assets/globe-logos/datacamp.png';
import nordvpn from '@/assets/globe-logos/nordvpn.png';
import turnitin from '@/assets/globe-logos/turnitin.png';
import chatgpt from '@/assets/globe-logos/chatgpt.png';
import supabase from '@/assets/globe-logos/supabase.png';
import replit from '@/assets/globe-logos/replit.png';
import wondershareFilmora from '@/assets/globe-logos/wondershare-filmora.png';
import youtube from '@/assets/globe-logos/youtube.png';

export type GlobeLogo = {
  /** Display name + search key for AI tool lookup */
  name: string;
  /** Bundled PNG asset */
  image: string;
  /** 'ott' → links to /product/<slug>; 'ai' → /ai-tool/<resolved-from-sheet> */
  kind: 'ott' | 'ai';
  /** Hard-coded product slug for OTTs (matches src/data/staticProducts.ts) */
  productSlug?: string;
  /** Alternative names to try when matching against the AI tools sheet */
  aliases?: string[];
};

export const GLOBE_LOGOS: GlobeLogo[] = [
  // ---------- OTT / streaming → /product/<slug> ----------
  { name: 'Netflix',      image: netflix,      kind: 'ott', productSlug: 'netflix-4k-uhd-3-months' },
  { name: 'Prime Video',  image: primeVideo,   kind: 'ott', productSlug: 'prime-video-yearly-5-devices' },
  { name: 'JioHotstar',   image: jiohotstar,   kind: 'ott', productSlug: 'disney-hotstar-premium-4k-uhd-12-months' },
  { name: 'SonyLIV',      image: sonyliv,      kind: 'ott', productSlug: 'sony-liv-premium-1-year-4k-on-your-number-activation' },
  { name: 'Zee5',         image: zee5,         kind: 'ott', productSlug: 'zee5-premium' },
  { name: 'Hoichoi',      image: hoichoi,      kind: 'ott', productSlug: 'hoichoi-12-months' },
  { name: 'HBO Max',      image: hboMax,       kind: 'ott', productSlug: 'hbo-max-1-year' },
  { name: 'YouTube Premium', image: youtube,   kind: 'ott', productSlug: 'youtube-premium-12-months' },
  { name: 'IPTV',         image: iptv,         kind: 'ott', productSlug: 'iptv-worldwide-plan' },
  { name: 'Crunchyroll',  image: crunchyroll,  kind: 'ott' /* no matching product → falls through to /products */ },
  { name: 'Chaupal',      image: chaupal,      kind: 'ott' },

  // ---------- AI / SaaS tools → /ai-tool/<slug from sheet> ----------
  { name: 'ChatGPT',          image: chatgpt,           kind: 'ai', aliases: ['ChatGPT Plus', 'OpenAI'] },
  { name: 'Claude',           image: claude,            kind: 'ai', aliases: ['Anthropic Claude'] },
  { name: 'Gemini',           image: gemini,            kind: 'ai', aliases: ['Google Gemini', 'Gemini Advanced'] },
  { name: 'Perplexity',       image: perplexity,        kind: 'ai', aliases: ['Perplexity Pro', 'Perplexity AI'] },
  { name: 'Jasper',           image: jasper,            kind: 'ai', aliases: ['Jasper AI'] },
  { name: 'Bolt.new',         image: boltNew,           kind: 'ai', aliases: ['Bolt'] },
  { name: 'Lovable',          image: lovable,           kind: 'ai' },
  { name: 'Firecrawl',        image: firecrawl,         kind: 'ai' },
  { name: 'Canva',            image: canva,             kind: 'ai', aliases: ['Canva Pro'] },
  { name: 'Adobe Creative Cloud', image: adobeCc,       kind: 'ai', aliases: ['Adobe CC', 'Adobe'] },
  { name: 'Figma',            image: figma,             kind: 'ai' },
  { name: 'Envato Elements',  image: envatoElements,    kind: 'ai', aliases: ['Envato'] },
  { name: 'HeyGen',           image: heygen,            kind: 'ai' },
  { name: 'ElevenLabs',       image: elevenlabs,        kind: 'ai', aliases: ['Eleven Labs'] },
  { name: 'Runway',           image: runway,            kind: 'ai', aliases: ['RunwayML', 'Runway ML'] },
  { name: 'Gamma',            image: gamma,             kind: 'ai', aliases: ['Gamma App'] },
  { name: 'Deepgram',         image: deepgram,          kind: 'ai' },
  { name: 'Semrush',          image: semrush,           kind: 'ai', aliases: ['SEMrush'] },
  { name: 'Office 365',       image: office365,         kind: 'ai', aliases: ['Microsoft 365', 'MS Office'] },
  { name: 'Notion',           image: notionPlus,        kind: 'ai', aliases: ['Notion Plus', 'Notion Pro'] },
  { name: 'LinkedIn Premium', image: linkedin,          kind: 'ai', aliases: ['LinkedIn'] },
  { name: 'QuillBot',         image: quillbot,          kind: 'ai' },
  { name: 'Coursera',         image: coursera,          kind: 'ai', aliases: ['Coursera Plus'] },
  { name: 'DataCamp',         image: datacamp,          kind: 'ai' },
  { name: 'NordVPN',          image: nordvpn,           kind: 'ai', aliases: ['Nord VPN'] },
  { name: 'Turnitin',         image: turnitin,          kind: 'ai' },
  { name: 'Supabase',         image: supabase,          kind: 'ai' },
  { name: 'Replit',           image: replit,            kind: 'ai' },
  { name: 'Wondershare Filmora', image: wondershareFilmora, kind: 'ai', aliases: ['Filmora'] },
];

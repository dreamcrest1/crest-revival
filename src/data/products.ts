export type Product = {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  category: string;
  emoji: string;
};

function categorize(name: string): { category: string; emoji: string } {
  const n = name.toLowerCase();
  // AI Tools
  if (['chatgpt', 'cursor ai', 'bolt.new', 'perplexity', 'jasper', 'leonardo', 'creaitor', 'one ai', 'riku ai', 'jenni ai', 'writecream', 'supermachine'].some(k => n.includes(k)))
    return { category: 'AI Tools', emoji: '🤖' };
  // Writing Tools
  if (['grammarly', 'quillbot', 'wordtune', 'wordhero', 'texta', 'linguix', 'copymatic', 'bramework', 'nichesss', 'writehuman', 'writerzen', 'hix ai', 'paperpal', 'turnitin', 'ref-n-write', 'quetext', 'scispace'].some(k => n.includes(k)))
    return { category: 'Writing Tools', emoji: '✍️' };
  // Video Editing
  if (['filmora', 'flex clip', 'invideo', 'pictory', 'lumen5', 'create studio', 'vyond', 'vidtoon', 'toonly', 'doodly', 'doodle', 'wideo', 'offeo', 'design beast', 'avatar builder', 'people creator', 'photovibrance', 'sketch', 'video creator', 'screen to video', 'vidscribe', 'beautiful.ai', 'designrr', 'speechelo', 'voicely', 'vocal clone'].some(k => n.includes(k)))
    return { category: 'Video Editing', emoji: '🎬' };
  // Indian OTT
  if (['hotstar', 'jiocinema', 'sony liv', 'zee5', 'aha ', 'eros now', 'hoichoi', 'klikk', 'sunnxt', 'sun nxt', 'manorama', 'magzter'].some(k => n.includes(k)))
    return { category: 'Indian OTT', emoji: '📺' };
  // International OTT
  if (['netflix', 'prime video', 'amazon prime', 'hbo', 'hulu', 'disney+', 'apple tv', 'paramount', 'curiosity', 'espn', 'mubi', 'showtime', 'movie box', 'youtube premium', 'spotify', 'iptv'].some(k => n.includes(k)))
    return { category: 'International OTT', emoji: '🌍' };
  // Lead Generation
  if (['ahrefs', 'semrush', 'helium', 'leadrocks', 'leads gorilla', 'outscraper', 'useartemis', 'link chest', 'moz pro', 'ubersuggest', 'keyword search', 'instantly', 'whatsapp pilot'].some(k => n.includes(k)))
    return { category: 'Lead Generation', emoji: '👥' };
  // Cloud Services
  if (['microsoft', 'office', 'google', 'azure', 'tableau', 'tally', 'loom', 'figma', 'flutterflow', 'skillshare'].some(k => n.includes(k)))
    return { category: 'Cloud Services', emoji: '☁️' };
  // Software
  if (['adobe', 'autodesk', 'canva', 'envato', 'freepik', 'pngtree', 'windows', 'winrar', 'idm', 'avast', 'expressvpn', 'nordvpn', 'purevpn', 'ipvanish', 'coolnew', 'wondershare', 'tipard', 'xbox', 'scopus'].some(k => n.includes(k)))
    return { category: 'Software', emoji: '💻' };
  return { category: 'Software', emoji: '💻' };
}

const rawProducts = [
  { name: "Adobe CC Official Yearly", price: "₹ 4,500", originalPrice: "₹ 24,999", discount: "82% OFF" },
  { name: "Adobe Creative Cloud For Windows Lifetime", price: "₹ 7,500", originalPrice: "₹ 14,999", discount: "50% OFF" },
  { name: "Aha GOLD 12 Months", price: "₹ 349", originalPrice: "₹ 399", discount: "13% OFF" },
  { name: "Aha Tamil+Telugu 12 Months", price: "₹ 249", originalPrice: "", discount: "" },
  { name: "Aha Telugu 12 Months", price: "₹ 249", originalPrice: "", discount: "" },
  { name: "Ahrefs Lite Plan", price: "₹ 350", originalPrice: "₹ 999", discount: "65% OFF" },
  { name: "Amazon Prime All Benefits Yearly", price: "₹ 1,150", originalPrice: "₹ 1,499", discount: "23% OFF" },
  { name: "Apple TV 12 Months", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF" },
  { name: "AUTODESK All Access Pass", price: "₹ 2,599", originalPrice: "₹ 3,500", discount: "26% OFF" },
  { name: "Avast Premium Antivirus", price: "₹ 299", originalPrice: "", discount: "" },
  { name: "Avatar Builder", price: "₹ 599", originalPrice: "₹ 1,999", discount: "70% OFF" },
  { name: "Beautiful.ai Pro Plan", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF" },
  { name: "Bolt.new AI (Yearly)", price: "₹ 4,500", originalPrice: "₹ 15,000", discount: "70% OFF" },
  { name: "Bramework Tier 2", price: "₹ 1,499", originalPrice: "", discount: "" },
  { name: "Canva Pro 1 Year", price: "₹ 650", originalPrice: "₹ 1,999", discount: "67% OFF" },
  { name: "ChatGPT Plus With GPT 4o", price: "₹ 699", originalPrice: "₹ 1,800", discount: "61% OFF" },
  { name: "CoolNew PDF Lifetime", price: "₹ 750", originalPrice: "₹ 999", discount: "25% OFF" },
  { name: "Copymatic Pro (one month)", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF" },
  { name: "Creaitor AI Unlimited Plan", price: "₹ 750", originalPrice: "", discount: "" },
  { name: "Create Studio Pro Lifetime", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF" },
  { name: "Curiosity Stream 12 Months", price: "₹ 599", originalPrice: "₹ 799", discount: "25% OFF" },
  { name: "Cursor AI", price: "₹ 11,999", originalPrice: "₹ 19,000", discount: "37% OFF" },
  { name: "Design Beast Lifetime", price: "₹ 899", originalPrice: "₹ 1,999", discount: "55% OFF" },
  { name: "Designrr Lifetime", price: "₹ 500", originalPrice: "₹ 799", discount: "37% OFF" },
  { name: "Disney+ Hotstar Premium 4k UHD No Ads 12 Months", price: "₹ 1,299", originalPrice: "", discount: "" },
  { name: "Disney+ Hotstar Super FHD 12 Months", price: "₹ 799", originalPrice: "", discount: "" },
  { name: "Disney+ International", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF" },
  { name: "Doodle Maker Lifetime", price: "₹ 599", originalPrice: "", discount: "" },
  { name: "Doodle Stanza Lifetime", price: "₹ 599", originalPrice: "₹ 799", discount: "25% OFF" },
  { name: "Doodly (Enterprise+Rainbow)", price: "₹ 1,599", originalPrice: "", discount: "" },
  { name: "Doodly Standard Lifetime", price: "₹ 599", originalPrice: "", discount: "" },
  { name: "Envato Elements 1 Year", price: "₹ 2,499", originalPrice: "₹ 14,000", discount: "82% OFF" },
  { name: "Eros Now 12 Months", price: "₹ 199", originalPrice: "₹ 299", discount: "33% OFF" },
  { name: "ESPN+ 12 Months", price: "₹ 899", originalPrice: "₹ 999", discount: "10% OFF" },
  { name: "ExpressVPN Premium", price: "₹ 2,599", originalPrice: "₹ 3,599", discount: "28% OFF" },
  { name: "Figma Professional 1 & 2 Year Plans", price: "₹ 999", originalPrice: "₹ 1,999", discount: "50% OFF" },
  { name: "Flex Clip Premium", price: "₹ 1,299", originalPrice: "₹ 3,999", discount: "68% OFF" },
  { name: "FlutterFlow Premium 1 Year", price: "₹ 1,399", originalPrice: "₹ 1,999", discount: "30% OFF" },
  { name: "Freepik Premium 1 Year", price: "₹ 2,499", originalPrice: "₹ 4,999", discount: "50% OFF" },
  { name: "Grammarly Premium", price: "₹ 799", originalPrice: "₹ 1,999", discount: "60% OFF" },
  { name: "HBO Max 1 Year", price: "₹ 899", originalPrice: "", discount: "" },
  { name: "Helium 10 Platinum (one month)", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF" },
  { name: "HIX AI Bypass Humanizer (one month)", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF" },
  { name: "Hoichoi 12 Months (1 User)", price: "₹ 299", originalPrice: "₹ 399", discount: "25% OFF" },
  { name: "Hulu 12 Months", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF" },
  { name: "IDM Lifetime (Internet Download Manager)", price: "₹ 599", originalPrice: "", discount: "" },
  { name: "Instantly AI Growth Plan Yearly", price: "₹ 3,999", originalPrice: "₹ 4,999", discount: "20% OFF" },
  { name: "Invideo 1 Year", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF" },
  { name: "IPTV Worldwide Plan", price: "₹ 1,800", originalPrice: "₹ 2,999", discount: "40% OFF" },
  { name: "IPVanish VPN Premium", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF" },
  { name: "Jasper AI Unlimited (one month)", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF" },
  { name: "Jenni AI Unlimited (1 Year)", price: "₹ 1,999", originalPrice: "₹ 2,999", discount: "33% OFF" },
  { name: "JioCinema Premium 1 Year", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF" },
  { name: "Keyword Search YouTube Seo Lifetime", price: "₹ 1,099", originalPrice: "₹ 1,999", discount: "45% OFF" },
  { name: "Klikk 12 Months", price: "₹ 199", originalPrice: "₹ 299", discount: "33% OFF" },
  { name: "Leadrocks 1 Year", price: "₹ 999", originalPrice: "₹ 1,999", discount: "50% OFF" },
  { name: "Leads Gorilla 1.0", price: "₹ 499", originalPrice: "", discount: "" },
  { name: "Leads Gorilla 2.0 Lifetime", price: "₹ 650", originalPrice: "₹ 1,999", discount: "67% OFF" },
  { name: "Leonardo AI Unlimited (one month)", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF" },
  { name: "Linguix Lifetime", price: "₹ 599", originalPrice: "₹ 1,999", discount: "70% OFF" },
  { name: "Link Chest by SeoBuddy", price: "₹ 1,450", originalPrice: "₹ 1,999", discount: "27% OFF" },
  { name: "Loom Premium 1 Year", price: "₹ 1,299", originalPrice: "₹ 1,999", discount: "35% OFF" },
  { name: "Lumen5 Premium", price: "₹ 999", originalPrice: "₹ 1,999", discount: "50% OFF" },
  { name: "Magzter Gold 12 Months", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF" },
  { name: "Manorama Max 12 Months", price: "₹ 349", originalPrice: "₹ 399", discount: "13% OFF" },
  { name: "Microsoft Azure Subscription 12 Months", price: "₹ 999", originalPrice: "", discount: "" },
  { name: "Microsoft Office 365 5 Device Lifetime", price: "₹ 799", originalPrice: "₹ 6,500", discount: "88% OFF" },
  { name: "Movie Box Pro", price: "₹ 899", originalPrice: "₹ 1,999", discount: "55% OFF" },
  { name: "Moz Pro (one month)", price: "₹ 250", originalPrice: "", discount: "" },
  { name: "Mubi 4 Months", price: "₹ 399", originalPrice: "₹ 599", discount: "33% OFF" },
  { name: "Netflix 4K UHD 3 Months (TV Plan)", price: "₹ 450", originalPrice: "₹ 799", discount: "44% OFF" },
  { name: "Netflix 6 Months (1 Device)", price: "₹ 799", originalPrice: "₹ 3,000", discount: "73% OFF" },
  { name: "Netflix Yearly (1 Device)", price: "₹ 1,499", originalPrice: "₹ 5,000", discount: "70% OFF" },
  { name: "Nichesss Lifetime", price: "₹ 700", originalPrice: "₹ 1,999", discount: "65% OFF" },
  { name: "NordVPN Premium", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF" },
  { name: "OFFEO Premium AI Video Ad Creator", price: "₹ 1,099", originalPrice: "₹ 1,999", discount: "45% OFF" },
  { name: "Office 2016 Lifetime Key (Windows)", price: "₹ 199", originalPrice: "₹ 599", discount: "67% OFF" },
  { name: "Office 2019 Lifetime Key (Windows)", price: "₹ 399", originalPrice: "₹ 1,000", discount: "60% OFF" },
  { name: "Office 2021 Lifetime Key (Windows)", price: "₹ 1,599", originalPrice: "₹ 15,000", discount: "89% OFF" },
  { name: "One AI (9 in 1) Model Plan", price: "₹ 899", originalPrice: "₹ 999", discount: "10% OFF" },
  { name: "Outscraper 1 Year", price: "₹ 899", originalPrice: "₹ 1,999", discount: "55% OFF" },
  { name: "Paperpal Prime", price: "₹ 399", originalPrice: "₹ 799", discount: "50% OFF" },
  { name: "Paramount+ 12 Months", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF" },
  { name: "People Creator", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF" },
  { name: "Perplexity AI Pro", price: "₹ 1,499", originalPrice: "₹ 1,999", discount: "25% OFF" },
  { name: "Photovibrance Lifetime", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF" },
  { name: "Pictory Premium", price: "₹ 999", originalPrice: "₹ 1,999", discount: "50% OFF" },
  { name: "PNGTREE", price: "₹ 1,399", originalPrice: "₹ 1,999", discount: "30% OFF" },
  { name: "Prime Video 6 Months (5 Device)", price: "₹ 350", originalPrice: "₹ 999", discount: "65% OFF" },
  { name: "Prime Video Yearly (5 Devices)", price: "₹ 650", originalPrice: "₹ 1,500", discount: "57% OFF" },
  { name: "Pure VPN", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF" },
  { name: "Quetext Premium (one month)", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF" },
  { name: "Quillbot Premium", price: "₹ 799", originalPrice: "", discount: "" },
  { name: "Ref-N-Write Lifetime License", price: "₹ 299", originalPrice: "₹ 799", discount: "63% OFF" },
  { name: "Riku AI Pro Builder Plan", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF" },
  { name: "Scispace Premium Plan (one month)", price: "₹ 750", originalPrice: "₹ 999", discount: "25% OFF" },
  { name: "Scopus Web Of Science", price: "₹ 599", originalPrice: "₹ 1,999", discount: "70% OFF" },
  { name: "Screen To Video Lifetime", price: "₹ 599", originalPrice: "", discount: "" },
  { name: "Scribd Premium (yearly)", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF" },
  { name: "Semrush Guru Plan", price: "₹ 350", originalPrice: "₹ 999", discount: "65% OFF" },
  { name: "Showtime 12 Months", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF" },
  { name: "Sketch Genius Lifetime", price: "₹ 599", originalPrice: "", discount: "" },
  { name: "Sketch Wow Lifetime", price: "₹ 599", originalPrice: "", discount: "" },
  { name: "Skillshare Premium (Yearly)", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF" },
  { name: "Sony LIV Premium 1 Year", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF" },
  { name: "SonyLiv Premium 12 Months (Activated On Your Number)", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF" },
  { name: "SpeechELO Deluxe", price: "₹ 599", originalPrice: "", discount: "" },
  { name: "Spotify Premium 1 Year", price: "₹ 599", originalPrice: "₹ 1,199", discount: "50% OFF" },
  { name: "SunNXT Premium (FOR TV)", price: "₹ 450", originalPrice: "", discount: "" },
  { name: "SUPERMACHINE Lifetime", price: "₹ 999", originalPrice: "₹ 1,999", discount: "50% OFF" },
  { name: "Tableau 1 Year", price: "₹ 999", originalPrice: "₹ 1,999", discount: "50% OFF" },
  { name: "Tally Prime With GST", price: "₹ 4,500", originalPrice: "₹ 8,999", discount: "50% OFF" },
  { name: "Texta AI Lifetime", price: "₹ 700", originalPrice: "₹ 1,999", discount: "65% OFF" },
  { name: "Tipard 1 Year", price: "₹ 500", originalPrice: "₹ 999", discount: "50% OFF" },
  { name: "Toonly Standard Lifetime", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF" },
  { name: "Turnitin Instructor With AI Check (1 Year)", price: "₹ 2,999", originalPrice: "₹ 3,999", discount: "25% OFF" },
  { name: "Turnitin Student (one year)", price: "₹ 999", originalPrice: "", discount: "" },
  { name: "Ubersuggest Business Plan", price: "₹ 299", originalPrice: "", discount: "" },
  { name: "Ultimate E Books Bundle", price: "₹ 399", originalPrice: "₹ 599", discount: "33% OFF" },
  { name: "useArtemis Scale Plan", price: "₹ 999", originalPrice: "₹ 1,999", discount: "50% OFF" },
  { name: "Video Creator", price: "₹ 599", originalPrice: "₹ 1,999", discount: "70% OFF" },
  { name: "VidScribe Pro", price: "₹ 799", originalPrice: "", discount: "" },
  { name: "Vidtoon 2.1 Lifetime", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF" },
  { name: "Vocal Clone Unlimited", price: "₹ 699", originalPrice: "", discount: "" },
  { name: "Voicely Lifetime", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF" },
  { name: "Vyond Premium", price: "₹ 1,299", originalPrice: "₹ 2,999", discount: "57% OFF" },
  { name: "WhatsApp Pilot Lifetime", price: "₹ 399", originalPrice: "₹ 599", discount: "33% OFF" },
  { name: "Wideo Pro (one month)", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF" },
  { name: "Wideo Pro Lifetime", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF" },
  { name: "Windows 10/11 Pro Lifetime Key", price: "₹ 500", originalPrice: "₹ 1,200", discount: "58% OFF" },
  { name: "WinRAR Lifetime", price: "₹ 299", originalPrice: "₹ 899", discount: "67% OFF" },
  { name: "Wondershare Filmora 14 AI Lifetime", price: "₹ 1,850", originalPrice: "₹ 1,999", discount: "7% OFF" },
  { name: "Wondershare PDFelement Lifetime", price: "₹ 1,299", originalPrice: "₹ 1,999", discount: "35% OFF" },
  { name: "Wordhero AI Writer", price: "₹ 1,599", originalPrice: "", discount: "" },
  { name: "Wordtune Premium", price: "₹ 799", originalPrice: "₹ 1,999", discount: "60% OFF" },
  { name: "Writecream AI-Powered Content Creation Tool", price: "₹ 1,250", originalPrice: "", discount: "" },
  { name: "WriteHuman AI (one month)", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF" },
  { name: "Writerzen Lifetime", price: "₹ 999", originalPrice: "₹ 1,999", discount: "50% OFF" },
  { name: "Xbox Game Pass Ultimate + EA Play 12 Months", price: "₹ 2,999", originalPrice: "₹ 9,600", discount: "69% OFF" },
  { name: "YouTube Premium 12 Months", price: "₹ 1,250", originalPrice: "", discount: "" },
  { name: "Zee5 Premium", price: "₹ 550", originalPrice: "₹ 899", discount: "39% OFF" },
];

export const products: Product[] = rawProducts.map((p, i) => {
  const { category, emoji } = categorize(p.name);
  return { id: i + 1, ...p, category, emoji };
});

export const categories = [
  { name: 'AI Tools', emoji: '🤖', count: 0 },
  { name: 'Video Editing', emoji: '🎬', count: 0 },
  { name: 'Indian OTT', emoji: '📺', count: 0 },
  { name: 'International OTT', emoji: '🌍', count: 0 },
  { name: 'Writing Tools', emoji: '✍️', count: 0 },
  { name: 'Cloud Services', emoji: '☁️', count: 0 },
  { name: 'Lead Generation', emoji: '👥', count: 0 },
  { name: 'Software', emoji: '💻', count: 0 },
];

// Count products per category
categories.forEach(cat => {
  cat.count = products.filter(p => p.category === cat.name).length;
});

export type Product = {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  category: string;
  emoji: string;
  image: string;
};

function categorize(name: string): { category: string; emoji: string } {
  const n = name.toLowerCase();
  if (['chatgpt', 'cursor ai', 'bolt.new', 'perplexity', 'jasper', 'leonardo', 'creaitor', 'one ai', 'riku ai', 'jenni ai', 'writecream', 'supermachine'].some(k => n.includes(k)))
    return { category: 'AI Tools', emoji: '🤖' };
  if (['grammarly', 'quillbot', 'wordtune', 'wordhero', 'texta', 'linguix', 'copymatic', 'bramework', 'nichesss', 'writehuman', 'writerzen', 'hix ai', 'paperpal', 'turnitin', 'ref-n-write', 'quetext', 'scispace'].some(k => n.includes(k)))
    return { category: 'Writing Tools', emoji: '✍️' };
  if (['filmora', 'flex clip', 'invideo', 'pictory', 'lumen5', 'create studio', 'vyond', 'vidtoon', 'toonly', 'doodly', 'doodle', 'wideo', 'offeo', 'design beast', 'avatar builder', 'people creator', 'photovibrance', 'sketch', 'video creator', 'screen to video', 'vidscribe', 'beautiful.ai', 'designrr', 'speechelo', 'voicely', 'vocal clone'].some(k => n.includes(k)))
    return { category: 'Video Editing', emoji: '🎬' };
  if (['hotstar', 'jiocinema', 'sony liv', 'zee5', 'aha ', 'eros now', 'hoichoi', 'klikk', 'sunnxt', 'sun nxt', 'manorama', 'magzter'].some(k => n.includes(k)))
    return { category: 'Indian OTT', emoji: '📺' };
  if (['netflix', 'prime video', 'amazon prime', 'hbo', 'hulu', 'disney+', 'apple tv', 'paramount', 'curiosity', 'espn', 'mubi', 'showtime', 'movie box', 'youtube premium', 'spotify', 'iptv'].some(k => n.includes(k)))
    return { category: 'International OTT', emoji: '🌍' };
  if (['ahrefs', 'semrush', 'helium', 'leadrocks', 'leads gorilla', 'outscraper', 'useartemis', 'link chest', 'moz pro', 'ubersuggest', 'keyword search', 'instantly', 'whatsapp pilot'].some(k => n.includes(k)))
    return { category: 'Lead Generation', emoji: '👥' };
  if (['microsoft', 'office', 'google', 'azure', 'tableau', 'tally', 'loom', 'figma', 'flutterflow', 'skillshare'].some(k => n.includes(k)))
    return { category: 'Cloud Services', emoji: '☁️' };
  if (['adobe', 'autodesk', 'canva', 'envato', 'freepik', 'pngtree', 'windows', 'winrar', 'idm', 'avast', 'expressvpn', 'nordvpn', 'purevpn', 'ipvanish', 'coolnew', 'wondershare', 'tipard', 'xbox', 'scopus'].some(k => n.includes(k)))
    return { category: 'Software', emoji: '💻' };
  return { category: 'Software', emoji: '💻' };
}

const rawProducts = [
  { name: "Adobe CC Official Yearly", price: "₹ 4,500", originalPrice: "₹ 24,999", discount: "82% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-10-1.jpg" },
  { name: "Adobe Creative Cloud For Windows Lifetime", price: "₹ 7,500", originalPrice: "₹ 14,999", discount: "50% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/175-1.jpg" },
  { name: "Aha GOLD 12 Months", price: "₹ 349", originalPrice: "₹ 399", discount: "13% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/76-1.jpg" },
  { name: "Aha Tamil+Telugu 12 Months", price: "₹ 249", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/77-1.jpg" },
  { name: "Aha Telugu 12 Months", price: "₹ 249", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/77-1.jpg" },
  { name: "Ahrefs Lite Plan", price: "₹ 350", originalPrice: "₹ 999", discount: "65% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/28-1.jpg" },
  { name: "Amazon Prime All Benefits Yearly", price: "₹ 1,150", originalPrice: "₹ 1,499", discount: "23% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-2-1-1.jpg" },
  { name: "Apple TV 12 Months", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/72-1.jpg" },
  { name: "AUTODESK All Access Pass", price: "₹ 2,599", originalPrice: "₹ 3,500", discount: "26% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/175-1.jpg" },
  { name: "Avast Premium Antivirus", price: "₹ 299", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/24-1.jpg" },
  { name: "Avatar Builder", price: "₹ 599", originalPrice: "₹ 1,999", discount: "70% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/91-1.jpg" },
  { name: "Beautiful.ai Pro Plan", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/42-1.jpg" },
  { name: "Bolt.new AI (Yearly)", price: "₹ 4,500", originalPrice: "₹ 15,000", discount: "70% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-21-1.jpg" },
  { name: "Bramework Tier 2", price: "₹ 1,499", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/92-1.jpg" },
  { name: "Canva Pro 1 Year", price: "₹ 650", originalPrice: "₹ 1,999", discount: "67% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/93-1.jpg" },
  { name: "ChatGPT Plus With GPT 4o", price: "₹ 699", originalPrice: "₹ 1,800", discount: "61% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/32-1.jpg" },
  { name: "CoolNew PDF Lifetime", price: "₹ 750", originalPrice: "₹ 999", discount: "25% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/95-1.jpg" },
  { name: "Copymatic Pro (one month)", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/47-1.jpg" },
  { name: "Creaitor AI Unlimited Plan", price: "₹ 750", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-23.jpg" },
  { name: "Create Studio Pro Lifetime", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-6-2.jpg" },
  { name: "Curiosity Stream 12 Months", price: "₹ 599", originalPrice: "₹ 799", discount: "25% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/85-1.jpg" },
  { name: "Cursor AI", price: "₹ 11,999", originalPrice: "₹ 19,000", discount: "37% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-20-1.jpg" },
  { name: "Design Beast Lifetime", price: "₹ 899", originalPrice: "₹ 1,999", discount: "55% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/96-1.jpg" },
  { name: "Designrr Lifetime", price: "₹ 500", originalPrice: "₹ 799", discount: "37% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-13-1.jpg" },
  { name: "Disney+ Hotstar Premium 4k UHD No Ads 12 Months", price: "₹ 1,299", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/69-1.jpg" },
  { name: "Disney+ Hotstar Super FHD 12 Months", price: "₹ 799", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/71-1-1.jpg" },
  { name: "Disney+ International", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/80-1.jpg" },
  { name: "Doodle Maker Lifetime", price: "₹ 599", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/97-1.jpg" },
  { name: "Doodle Stanza Lifetime", price: "₹ 599", originalPrice: "₹ 799", discount: "25% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/180-2.jpg" },
  { name: "Doodly (Enterprise+Rainbow)", price: "₹ 1,599", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/98-1.jpg" },
  { name: "Doodly Standard Lifetime", price: "₹ 599", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/99-1.jpg" },
  { name: "Envato Elements 1 Year", price: "₹ 2,499", originalPrice: "₹ 14,000", discount: "82% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-14-1.jpg" },
  { name: "Eros Now 12 Months", price: "₹ 199", originalPrice: "₹ 299", discount: "33% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/66-1.jpg" },
  { name: "ESPN+ 12 Months", price: "₹ 899", originalPrice: "₹ 999", discount: "10% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-5-2.jpg" },
  { name: "ExpressVPN Premium", price: "₹ 2,599", originalPrice: "₹ 3,599", discount: "28% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/28-1.jpg" },
  { name: "Figma Professional 1 & 2 Year Plans", price: "₹ 999", originalPrice: "₹ 1,999", discount: "50% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/14-1.jpg" },
  { name: "Flex Clip Premium", price: "₹ 1,299", originalPrice: "₹ 3,999", discount: "68% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-12-1.jpg" },
  { name: "FlutterFlow Premium 1 Year", price: "₹ 1,399", originalPrice: "₹ 1,999", discount: "30% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/15-1.jpg" },
  { name: "Freepik Premium 1 Year", price: "₹ 2,499", originalPrice: "₹ 4,999", discount: "50% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-3-1.png" },
  { name: "Grammarly Premium", price: "₹ 799", originalPrice: "₹ 1,999", discount: "60% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-16-1.jpg" },
  { name: "HBO Max 1 Year", price: "₹ 899", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/79-1.jpg" },
  { name: "Helium 10 Platinum (one month)", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/41-1.jpg" },
  { name: "HIX AI Bypass Humanizer (one month)", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/46-1.jpg" },
  { name: "Hoichoi 12 Months (1 User)", price: "₹ 299", originalPrice: "₹ 399", discount: "25% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-4.png" },
  { name: "Hulu 12 Months", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/82-1.jpg" },
  { name: "IDM Lifetime (Internet Download Manager)", price: "₹ 599", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/29-1.jpg" },
  { name: "Instantly AI Growth Plan Yearly", price: "₹ 3,999", originalPrice: "₹ 4,999", discount: "20% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/30-1.jpg" },
  { name: "Invideo 1 Year", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/107-1.jpg" },
  { name: "IPTV Worldwide Plan", price: "₹ 1,800", originalPrice: "₹ 2,999", discount: "40% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/20-1.jpg" },
  { name: "IPVanish VPN Premium", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/119-1.jpg" },
  { name: "Jasper AI Unlimited (one month)", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/52-1.jpg" },
  { name: "Jenni AI Unlimited (1 Year)", price: "₹ 1,999", originalPrice: "₹ 2,999", discount: "33% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-4-2.jpg" },
  { name: "JioCinema Premium 1 Year", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/jiocinema-1.jpg" },
  { name: "Keyword Search YouTube Seo Lifetime", price: "₹ 1,099", originalPrice: "₹ 1,999", discount: "45% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/137-1.jpg" },
  { name: "Klikk 12 Months", price: "₹ 199", originalPrice: "₹ 299", discount: "33% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/65-1.jpg" },
  { name: "Leadrocks 1 Year", price: "₹ 999", originalPrice: "₹ 1,999", discount: "50% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/148-1.jpg" },
  { name: "Leads Gorilla 1.0", price: "₹ 499", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/144-1.jpg" },
  { name: "Leads Gorilla 2.0 Lifetime", price: "₹ 650", originalPrice: "₹ 1,999", discount: "67% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Leads-Gorilla-2.0-AI-Powered-1.jpg" },
  { name: "Leonardo AI Unlimited (one month)", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/34-1.jpg" },
  { name: "Linguix Lifetime", price: "₹ 599", originalPrice: "₹ 1,999", discount: "70% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/101-1.jpg" },
  { name: "Link Chest by SeoBuddy", price: "₹ 1,450", originalPrice: "₹ 1,999", discount: "27% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/26-1.jpg" },
  { name: "Loom Premium 1 Year", price: "₹ 1,299", originalPrice: "₹ 1,999", discount: "35% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/12-2.jpg" },
  { name: "Lumen5 Premium", price: "₹ 999", originalPrice: "₹ 1,999", discount: "50% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/113-1.jpg" },
  { name: "Magzter Gold 12 Months", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/58-1.jpg" },
  { name: "Manorama Max 12 Months", price: "₹ 349", originalPrice: "₹ 399", discount: "13% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/75-1.jpg" },
  { name: "Microsoft Azure Subscription 12 Months", price: "₹ 999", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/17-1.jpg" },
  { name: "Microsoft Office 365 5 Device Lifetime", price: "₹ 799", originalPrice: "₹ 6,500", discount: "88% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Office-Windows-5.jpg" },
  { name: "Movie Box Pro", price: "₹ 899", originalPrice: "₹ 1,999", discount: "55% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/moviebox-1.jpg" },
  { name: "Moz Pro (one month)", price: "₹ 250", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-1-1-1.jpg" },
  { name: "Mubi 4 Months", price: "₹ 399", originalPrice: "₹ 599", discount: "33% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/87-1.jpg" },
  { name: "Netflix 4K UHD 3 Months (TV Plan)", price: "₹ 450", originalPrice: "₹ 799", discount: "44% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/56-1.jpg" },
  { name: "Netflix 6 Months (1 Device)", price: "₹ 799", originalPrice: "₹ 3,000", discount: "73% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-1-2-1.jpg" },
  { name: "Netflix Yearly (1 Device)", price: "₹ 1,499", originalPrice: "₹ 5,000", discount: "70% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-22-1.jpg" },
  { name: "Nichesss Lifetime", price: "₹ 700", originalPrice: "₹ 1,999", discount: "65% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/49-1.jpg" },
  { name: "NordVPN Premium", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/130-1.jpg" },
  { name: "OFFEO Premium AI Video Ad Creator", price: "₹ 1,099", originalPrice: "₹ 1,999", discount: "45% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/156-1.jpg" },
  { name: "Office 2016 Lifetime Key (Windows)", price: "₹ 199", originalPrice: "₹ 599", discount: "67% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Office-Windows-3-1.jpg" },
  { name: "Office 2019 Lifetime Key (Windows)", price: "₹ 399", originalPrice: "₹ 1,000", discount: "60% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Office-Windows-2-1.jpg" },
  { name: "Office 2021 Lifetime Key (Windows)", price: "₹ 1,599", originalPrice: "₹ 15,000", discount: "89% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Office-Windows-1-1.jpg" },
  { name: "One AI (9 in 1) Model Plan", price: "₹ 899", originalPrice: "₹ 999", discount: "10% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/18-1.jpg" },
  { name: "Outscraper 1 Year", price: "₹ 899", originalPrice: "₹ 1,999", discount: "55% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/154-1.jpg" },
  { name: "Paperpal Prime", price: "₹ 399", originalPrice: "₹ 799", discount: "50% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-17-1.jpg" },
  { name: "Paramount+ 12 Months", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/84-1.jpg" },
  { name: "People Creator", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/40-1.jpg" },
  { name: "Perplexity AI Pro", price: "₹ 1,499", originalPrice: "₹ 1,999", discount: "25% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/43-1.jpg" },
  { name: "Photovibrance Lifetime", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-9-1.jpg" },
  { name: "Pictory Premium", price: "₹ 999", originalPrice: "₹ 1,999", discount: "50% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/108-1.jpg" },
  { name: "PNGTREE", price: "₹ 1,399", originalPrice: "₹ 1,999", discount: "30% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/114-1.jpg" },
  { name: "Prime Video 6 Months (5 Device)", price: "₹ 350", originalPrice: "₹ 999", discount: "65% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-15-1.jpg" },
  { name: "Prime Video Yearly (5 Devices)", price: "₹ 650", originalPrice: "₹ 1,500", discount: "57% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-3-1-1.jpg" },
  { name: "Pure VPN", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/10-2.jpg" },
  { name: "Quetext Premium (one month)", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/44-1.jpg" },
  { name: "Quillbot Premium", price: "₹ 799", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/116-1.jpg" },
  { name: "Ref-N-Write Lifetime License", price: "₹ 299", originalPrice: "₹ 799", discount: "63% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/50-1.jpg" },
  { name: "Riku AI Pro Builder Plan", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/37-1.jpg" },
  { name: "Scispace Premium Plan (one month)", price: "₹ 750", originalPrice: "₹ 999", discount: "25% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/19-1.jpg" },
  { name: "Scopus Web Of Science", price: "₹ 599", originalPrice: "₹ 1,999", discount: "70% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-18-1.jpg" },
  { name: "Screen To Video Lifetime", price: "₹ 599", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/115-1.jpg" },
  { name: "Scribd Premium (yearly)", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/46-1.jpg" },
  { name: "Semrush Guru Plan", price: "₹ 350", originalPrice: "₹ 999", discount: "65% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/27-1.jpg" },
  { name: "Showtime 12 Months", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/83-1.jpg" },
  { name: "Sketch Genius Lifetime", price: "₹ 599", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/104-1.jpg" },
  { name: "Sketch Wow Lifetime", price: "₹ 599", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/102-1.jpg" },
  { name: "Skillshare Premium (Yearly)", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/31-1.jpg" },
  { name: "Sony LIV Premium 1 Year", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/sonyliv-1.jpg" },
  { name: "SonyLiv Premium 12 Months (Activated On Your Number)", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-1-1.png" },
  { name: "SpeechELO Deluxe", price: "₹ 599", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/109-1.jpg" },
  { name: "Spotify Premium 1 Year", price: "₹ 599", originalPrice: "₹ 1,199", discount: "50% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/spotify-1.jpg" },
  { name: "SunNXT Premium (FOR TV)", price: "₹ 450", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-7-2.jpg" },
  { name: "SUPERMACHINE Lifetime", price: "₹ 999", originalPrice: "₹ 1,999", discount: "50% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/125-1.jpg" },
  { name: "Tableau 1 Year", price: "₹ 999", originalPrice: "₹ 1,999", discount: "50% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/13-1.jpg" },
  { name: "Tally Prime With GST", price: "₹ 4,500", originalPrice: "₹ 8,999", discount: "50% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/21-1.jpg" },
  { name: "Texta AI Lifetime", price: "₹ 700", originalPrice: "₹ 1,999", discount: "65% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/48-1.jpg" },
  { name: "Tipard 1 Year", price: "₹ 500", originalPrice: "₹ 999", discount: "50% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/11-2.jpg" },
  { name: "Toonly Standard Lifetime", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/100-1.jpg" },
  { name: "Turnitin Instructor With AI Check (1 Year)", price: "₹ 2,999", originalPrice: "₹ 3,999", discount: "25% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/163-1.jpg" },
  { name: "Turnitin Student (one year)", price: "₹ 999", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/162-1-1.jpg" },
  { name: "Ubersuggest Business Plan", price: "₹ 299", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-1-3.jpg" },
  { name: "Ultimate E Books Bundle", price: "₹ 399", originalPrice: "₹ 599", discount: "33% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Discover-The-Ultimate-eBooks-Bundle-300000-eBooks-500-Genres-1.jpg" },
  { name: "useArtemis Scale Plan", price: "₹ 999", originalPrice: "₹ 1,999", discount: "50% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/153-1.jpg" },
  { name: "Video Creator", price: "₹ 599", originalPrice: "₹ 1,999", discount: "70% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/168-1.jpg" },
  { name: "VidScribe Pro", price: "₹ 799", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/111-1.jpg" },
  { name: "Vidtoon 2.1 Lifetime", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/134-1.jpg" },
  { name: "Vocal Clone Unlimited", price: "₹ 699", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/110-1.jpg" },
  { name: "Voicely Lifetime", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-19-1.jpg" },
  { name: "Vyond Premium", price: "₹ 1,299", originalPrice: "₹ 2,999", discount: "57% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/112-1.jpg" },
  { name: "WhatsApp Pilot Lifetime", price: "₹ 399", originalPrice: "₹ 599", discount: "33% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-3-2.jpg" },
  { name: "Wideo Pro (one month)", price: "₹ 699", originalPrice: "₹ 999", discount: "30% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/45-1.jpg" },
  { name: "Wideo Pro Lifetime", price: "₹ 599", originalPrice: "₹ 999", discount: "40% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-2-1.png" },
  { name: "Windows 10/11 Pro Lifetime Key", price: "₹ 500", originalPrice: "₹ 1,200", discount: "58% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Office-Windows-4-1.jpg" },
  { name: "WinRAR Lifetime", price: "₹ 299", originalPrice: "₹ 899", discount: "67% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/157-1.jpg" },
  { name: "Wondershare Filmora 14 AI Lifetime", price: "₹ 1,850", originalPrice: "₹ 1,999", discount: "7% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-8-1.jpg" },
  { name: "Wondershare PDFelement Lifetime", price: "₹ 1,299", originalPrice: "₹ 1,999", discount: "35% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/109-1.jpg" },
  { name: "Wordhero AI Writer", price: "₹ 1,599", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/139.jpg" },
  { name: "Wordtune Premium", price: "₹ 799", originalPrice: "₹ 1,999", discount: "60% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/142-1.jpg" },
  { name: "Writecream AI-Powered Content Creation Tool", price: "₹ 1,250", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/161-1.jpg" },
  { name: "WriteHuman AI (one month)", price: "₹ 799", originalPrice: "₹ 999", discount: "20% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-2-2.jpg" },
  { name: "Writerzen Lifetime", price: "₹ 999", originalPrice: "₹ 1,999", discount: "50% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/140-1.jpg" },
  { name: "Xbox Game Pass Ultimate + EA Play 12 Months", price: "₹ 2,999", originalPrice: "₹ 9,600", discount: "69% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/Website-Poster-11-1.jpg" },
  { name: "YouTube Premium 12 Months", price: "₹ 1,250", originalPrice: "", discount: "", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/62-1.jpg" },
  { name: "Zee5 Premium", price: "₹ 550", originalPrice: "₹ 899", discount: "39% OFF", image: "https://dreamstarsolution.com/wp-content/uploads/2025/04/9-2.jpg" },
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

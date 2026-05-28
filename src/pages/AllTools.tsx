import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import { WhatsAppIcon } from '@/components/SocialIcons';
import { Search, X, ExternalLink, Flame } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import PageBanner from '@/components/PageBanner';
import { useProducts } from '@/hooks/useProducts';
import { useAiTools } from '@/hooks/useAiTools';
import { trackEvent } from '@/lib/eventTracker';
import { useTrackSearch } from '@/hooks/useTrackSearch';
import { popularityFor } from '@/data/aiToolPopularity';

type ToolCategory = {
  emoji: string;
  name: string;
  tools: string[];
};

const toolCategories: ToolCategory[] = [
  { emoji: '📚', name: 'Learning Tools', tools: ['Skillshare', 'Scribd Premium', 'Trading View Premium', 'Magzter Gold', 'Udemy Business', 'Tinder Plus', 'Coursera Premium', 'Edx Premium', 'Duolingo', 'Datacamp', 'Grammarly Premium', 'Quillbot Premium', 'Wordtune Premium', 'Turnitin Student', 'Turnitin Instructor', 'Quetext', 'Scopus', 'Paperpal', 'Scispace', 'Tableau', 'RefnWrite', 'PyCharm', 'Flutterflow', 'Figma', 'Loom', 'Linguix Premium', 'Notion Pro', 'Consensus AI'] },
  { emoji: '✍️', name: 'AI Bypass & Writers', tools: ['Writehuman AI', 'Hix AI Bypass', 'Stealth Writer', 'AI Humanizer.io', 'Jasper AI', 'Jenni AI', 'Wordhero AI', 'Bramework', 'Writecream', 'Designrr (Ebook Maker)', 'Creaitor AI', 'Scriptelo', 'Texta AI', 'Nichesss', 'Rytr AI'] },
  { emoji: '🤖', name: 'AI & Image Gen', tools: ['ChatGPT Pro', 'You.com (Multiple AI Models)', 'Perplexity (Multi-AI Models)', 'Bolt.new (AI website/app builder)', 'One AI', 'Midjourney', 'Leonardo AI', 'Open AI Sora', 'Beautiful AI', 'Gamma AI', 'Riku AI', 'Supermachine AI', 'Ocoya AI (Post Scheduler)', 'Gemini Pro', 'Gemini Ultra', 'Heygen AI', 'RunwayML', 'Hailuo AI', 'Microsoft Co-Pilot', 'Eleven Labs'] },
  { emoji: '📈', name: 'SEO Tools', tools: ['Ahrefs', 'Moz Pro', 'Helium 10', 'Writerzen', 'SEMrush', 'Link Chest by SEO Buddy', 'Keyword Search', 'Screpy', 'Ubersuggest', 'Jungle Scout'] },
  { emoji: '🖼️', name: 'Stock Assets', tools: ['Freepik Premium', 'Envato Elements', 'Storyblocks', 'Artlist.io', 'Pngtree'] },
  { emoji: '🎥', name: 'Video & Graphics', tools: ['Adobe Creative Cloud', 'Autodesk Collection', 'Corel Draw', 'Wondershare Filmora', 'Democreator', 'Recoverit', 'Canva Pro', 'Invideo Studio', 'Sketchwow', 'Sketchgenius', 'Doodle Maker', 'Doodly Standard & Enterprise', 'Toonly', 'Create Studio', 'Wideoco', 'PhotoVibrance', 'Flexclip', 'Design Beast', 'Voicely', 'Murf AI', 'Video Creator', 'Avatar Builder', 'Videtoon 2.1', 'Offeo Premium', 'Doodle Stanza', 'People Creator', 'Remini AI', 'Eleven Labs'] },
  { emoji: '🎯', name: 'Lead Generation', tools: ['Leadrocks', 'LeadsGorilla', 'Instantly', 'WhatsCRM', 'Pabbly Connect', 'Useartemis', 'Outscraper', 'Leadscrape'] },
  { emoji: '☁️', name: 'Cloud & Services', tools: ['Tally Prime', 'IBM SPSS', 'Microsoft Azure', 'GitHub Student Pack', 'WhatsApp Contact Saver', 'WinRAR License', 'Zoom Premium', 'LinkedIn Premium', 'Epic Games', 'Xbox Game Pass Ultimate', 'Windows 10/11 Keys', 'Windows Server Key', 'Microsoft Office (2016/2019/2021/2024/365)', 'Coolnewpdf', 'Wondershare PDF Elements', 'Adobe Acrobat DC Pro', 'Screentovideo Recorder', 'IDM (Internet Download Manager)', 'Avast', 'Bitdefender', 'McAfee', 'Avira', 'Wondershare Recover it', 'Data Recovery Tools', 'Tinder Plus', 'Magzter Gold'] },
  { emoji: '🔐', name: 'VPN Services', tools: ['NordVPN', 'StarVPN', 'IPVanish VPN', 'CyberGhost VPN', 'Express VPN', 'PureVPN', 'HMA', 'Surfshark'] },
  { emoji: '🔥', name: 'Hotsellers', tools: ['Lovable Pro', 'n8n (1 Year)', 'Gamma Pro', 'Descript Creator', 'Bolt.new', 'Replit Core', 'Warp Pro', 'Mobbin Pro', 'Magic Pattern', 'Wispr Flow', 'ChatPRD Pro', 'Linear Business', 'Raycast Pro', 'Superhuman Starter'] },
];

type StreamingDeal = { name: string; pricing: string };

const streamingDeals: StreamingDeal[] = [
  { name: 'WATCHO ULTRA PLAN - 13 OTTs Combo', pricing: '₹300 – 6 Months (5 Devices). Works on TV & Mobile.' },
  { name: 'NETFLIX UHD 4K Premium Plan', pricing: '₹450 – 3 Months | ₹799 – 6 Months | ₹1499 – 1 Year' },
  { name: 'PRIME VIDEO (Private)', pricing: '₹350 – 6 Months (5 Devices) | ₹650 – 1 Year' },
  { name: 'ZEE5 PREMIUM', pricing: '₹750 – 1 Year (Full HD, 5 Devices)' },
  { name: 'SONYLIV PREMIUM', pricing: '₹850 – 1 Year (4K, 5 Devices)' },
  { name: 'YOUTUBE PREMIUM', pricing: '₹1200 – 12 Months (Existing ID)' },
  { name: 'HOTSTAR Premium 4K', pricing: '₹1250 – 1 Year (Premium 4K Plan)' },
];

const getWhatsAppLink = (toolName: string) =>
  `https://wa.me/916357998730?text=${encodeURIComponent(`Hi Dreamcrest Solutions! I'm interested in ${toolName}. Please share price and details.`)}`;

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

type UnifiedTool = { name: string; category: string; emoji: string; popularity: number };

const INITIAL_DISPLAY = 48;
const LOAD_MORE_INCREMENT = 24;

const AllTools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  useTrackSearch(searchQuery, 'all-tools');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY);
  const { data: productsData } = useProducts();
  const { data: aiTools = [] } = useAiTools();

  const unified = useMemo<UnifiedTool[]>(() => {
    const seen = new Set<string>();
    const out: UnifiedTool[] = [];
    const add = (name: string, category: string, emoji: string) => {
      const n = (name || '').trim();
      if (!n) return;
      const key = normalize(n);
      if (!key || seen.has(key)) return;
      seen.add(key);
      out.push({ name: n, category, emoji, popularity: popularityFor(n) });
    };
    toolCategories.forEach((cat) => cat.tools.forEach((t) => add(t, cat.name, cat.emoji)));
    (productsData?.products || []).forEach((p) => add(p.name, p.category, p.emoji || '📦'));
    (aiTools || []).forEach((t) => add(t.name, 'AI Tools', '🤖'));
    return out.sort((a, b) => b.popularity - a.popularity);
  }, [productsData, aiTools]);

  const categories = useMemo(() => {
    const set = new Map<string, string>();
    unified.forEach((t) => { if (!set.has(t.category)) set.set(t.category, t.emoji); });
    return Array.from(set.entries()).map(([name, emoji]) => ({ name, emoji }));
  }, [unified]);

  const isSearching = searchQuery.trim().length > 0;

  const handleSetFilter = useCallback((filter: string) => {
    setActiveFilter(filter);
    setDisplayCount(INITIAL_DISPLAY);
  }, []);

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    setDisplayCount(INITIAL_DISPLAY);
  }, []);

  const filteredTools = useMemo(() => {
    let list = unified;
    if (activeFilter !== 'All') list = list.filter((t) => t.category === activeFilter);
    if (isSearching) {
      const q = searchQuery.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(q));
    }
    return list;
  }, [unified, activeFilter, isSearching, searchQuery]);

  const visibleTools = filteredTools.slice(0, displayCount);
  const hasMore = displayCount < filteredTools.length;

  const trendingCount = Math.min(12, filteredTools.length);

  return (
    <div className="min-h-screen relative z-10">
      <SEOHead breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'All Tools', url: '/alltools' }]} />
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 mb-5"
            >
              <span className="text-sm font-medium text-primary">🚀 {unified.length}+ Premium Tools Available</span>
            </motion.div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
              All <span className="text-gradient">Tools</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              Browse our complete catalog, sorted by what's trending on Google. Tap any tool to chat on WhatsApp.
            </p>
            <a
              href="https://chat.whatsapp.com/HAygGmjN7cNLePOWBtrPjc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Join WhatsApp Group
            </a>
          </motion.div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-card/60 backdrop-blur-sm border border-border/60 rounded-xl pl-11 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
              />
              {searchQuery && (
                <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 justify-center mb-10">
            <button
              onClick={() => handleSetFilter('All')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeFilter === 'All'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-card/60 backdrop-blur-sm border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/30'
              }`}
            >
              ✨ All ({unified.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => handleSetFilter(cat.name)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeFilter === cat.name
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'bg-card/60 backdrop-blur-sm border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/30'
                }`}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </motion.div>

          {/* Tools Grid */}
          <div className="mb-20">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                  <Flame className="w-5 h-5 text-primary" />
                  {isSearching ? 'Search Results' : activeFilter === 'All' ? 'Top Trending on Google' : `${activeFilter}`}
                </h2>
                <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
                  {filteredTools.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">Tap to chat on WhatsApp</p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeFilter}-${isSearching ? searchQuery : 'browse'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
              >
                {visibleTools.map((tool, i) => {
                  const isTrending = !isSearching && activeFilter === 'All' && i < trendingCount;
                  return (
                    <motion.a
                      key={tool.name}
                      href={getWhatsAppLink(tool.name)}
                      onClick={() => void trackEvent('tool_whatsapp_click', { tool_name: tool.name, category: tool.category })}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Math.min(i * 0.01, 0.4) }}
                      className={`group relative bg-card/60 backdrop-blur-sm border rounded-xl p-4 text-center overflow-hidden transition-all duration-300 flex flex-col items-center gap-2.5 ${
                        isTrending
                          ? 'border-primary/40 ring-1 ring-primary/30 shadow-lg shadow-primary/10'
                          : 'border-border/60 hover:border-primary/30'
                      }`}
                    >
                      {isTrending && (
                        <span className="absolute top-1.5 right-1.5 text-[9px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5" /> #{i + 1}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors text-base">
                          {tool.emoji}
                        </div>
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                          {tool.name}
                        </span>
                      </div>
                    </motion.a>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setDisplayCount((c) => c + LOAD_MORE_INCREMENT)}
                  className="px-6 py-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/60 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-all duration-300"
                >
                  Load more ({filteredTools.length - displayCount} remaining)
                </button>
              </div>
            )}
          </div>

          {/* Streaming Deals */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-1 bg-primary rounded-full" />
                <span className="text-primary font-medium text-sm uppercase tracking-wider">Streaming</span>
                <div className="w-10 h-1 bg-primary rounded-full" />
              </div>
              <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-2">
                📺 Streaming <span className="text-gradient">Deals</span>
              </h2>
              <p className="text-sm text-muted-foreground">Premium OTT subscriptions at unbeatable prices</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {streamingDeals.map((deal, i) => (
                <motion.a
                  key={deal.name}
                  href={getWhatsAppLink(deal.name)}
                  onClick={() => void trackEvent('tool_whatsapp_click', { tool_name: deal.name, category: 'Streaming' })}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative bg-card/60 backdrop-blur-sm border border-border/60 rounded-xl p-5 overflow-hidden hover:border-primary/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <span className="text-[10px] uppercase tracking-wider text-primary font-semibold bg-primary/10 px-2.5 py-1 rounded-full">OTT Deal</span>
                    <h3 className="font-display font-bold text-foreground mt-3 mb-2 group-hover:text-primary transition-colors leading-tight">
                      {deal.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{deal.pricing}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-primary text-xs font-semibold">
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>Chat Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default AllTools;

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

type ToolCategory = {
  emoji: string;
  name: string;
  tools: string[];
};

const toolCategories: ToolCategory[] = [
  {
    emoji: '📚',
    name: 'Learning Tools',
    tools: ['Skillshare', 'Scribd Premium', 'Trading View Premium', 'Magzter Gold', 'Udemy Business', 'Tinder Plus', 'Coursera Premium', 'Edx Premium', 'Duolingo', 'Datacamp', 'Grammarly Premium', 'Quillbot Premium', 'Wordtune Premium', 'Turnitin Student', 'Turnitin Instructor', 'Quetext', 'Scopus', 'Paperpal', 'Scispace', 'Tableau', 'RefnWrite', 'PyCharm', 'Flutterflow', 'Figma', 'Loom', 'Linguix Premium', 'Notion Pro', 'Consensus AI'],
  },
  {
    emoji: '✍️',
    name: 'AI Bypass & AI Writers',
    tools: ['Writehuman AI', 'Hix AI Bypass', 'Stealth Writer', 'AI Humanizer.io', 'Jasper AI', 'Jenni AI', 'Wordhero AI', 'Bramework', 'Writecream', 'Designrr (Ebook Maker)', 'Creaitor AI', 'Scriptelo', 'Texta AI', 'Nichesss', 'Rytr AI'],
  },
  {
    emoji: '🤖',
    name: 'AI & Image Generation',
    tools: ['ChatGPT Pro', 'You.com (Multiple AI Models)', 'Perplexity (Multi-AI Models)', 'Bolt.new (AI website/app builder)', 'One AI', 'Midjourney', 'Leonardo AI', 'Open AI Sora', 'Beautiful AI', 'Gamma AI', 'Riku AI', 'Supermachine AI', 'Ocoya AI (Post Scheduler)', 'Gemini Pro', 'Gemini Ultra', 'Heygen AI', 'RunwayML', 'Hailuo AI', 'Microsoft Co-Pilot', 'Eleven Labs'],
  },
  {
    emoji: '📈',
    name: 'SEO Tools',
    tools: ['Ahrefs', 'Moz Pro', 'Helium 10', 'Writerzen', 'SEMrush', 'Link Chest by SEO Buddy', 'Keyword Search', 'Screpy', 'Ubersuggest', 'Jungle Scout'],
  },
  {
    emoji: '🖼️',
    name: 'Stock Assets',
    tools: ['Freepik Premium', 'Envato Elements', 'Storyblocks', 'Artlist.io', 'Pngtree'],
  },
  {
    emoji: '🎥',
    name: 'Video & Graphics Editing',
    tools: ['Adobe Creative Cloud', 'Autodesk Collection', 'Corel Draw', 'Wondershare Filmora', 'Democreator', 'Recoverit', 'Canva Pro', 'Invideo Studio', 'Sketchwow', 'Sketchgenius', 'Doodle Maker', 'Doodly Standard & Enterprise', 'Toonly', 'Create Studio', 'Wideoco', 'PhotoVibrance', 'Flexclip', 'Design Beast', 'Voicely', 'Murf AI', 'Video Creator', 'Avatar Builder', 'Videtoon 2.1', 'Offeo Premium', 'Doodle Stanza', 'People Creator', 'Remini AI', 'Eleven Labs'],
  },
  {
    emoji: '🎯',
    name: 'Lead Generation',
    tools: ['Leadrocks', 'LeadsGorilla', 'Instantly', 'WhatsCRM', 'Pabbly Connect', 'Useartemis', 'Outscraper', 'Leadscrape'],
  },
  {
    emoji: '☁️',
    name: 'Cloud & Other Services',
    tools: ['Tally Prime', 'IBM SPSS', 'Microsoft Azure', 'GitHub Student Pack', 'WhatsApp Contact Saver', 'WinRAR License', 'Zoom Premium', 'LinkedIn Premium', 'Epic Games', 'Xbox Game Pass Ultimate', 'Windows 10/11 Keys', 'Windows Server Key', 'Microsoft Office (2016/2019/2021/2024/365)', 'Coolnewpdf', 'Wondershare PDF Elements', 'Adobe Acrobat DC Pro', 'Screentovideo Recorder', 'IDM (Internet Download Manager)', 'Avast', 'Bitdefender', 'McAfee', 'Avira', 'Wondershare Recover it', 'Data Recovery Tools', 'Tinder Plus', 'Magzter Gold'],
  },
  {
    emoji: '🔐',
    name: 'VPN Services',
    tools: ['NordVPN', 'StarVPN', 'IPVanish VPN', 'CyberGhost VPN', 'Express VPN', 'PureVPN', 'HMA', 'Surfshark'],
  },
  {
    emoji: '🔥',
    name: 'Hotsellers',
    tools: ['Lovable Pro', 'n8n (1 Year)', 'Gamma Pro', 'Descript Creator', 'Bolt.new', 'Replit Core', 'Warp Pro', 'Mobbin Pro', 'Magic Pattern', 'Wispr Flow', 'ChatPRD Pro', 'Linear Business', 'Raycast Pro', 'Superhuman Starter'],
  },
];

type StreamingDeal = {
  name: string;
  pricing: string;
};

const streamingDeals: StreamingDeal[] = [
  { name: 'WATCHO ULTRA PLAN - 13 OTTs Combo', pricing: '₹300 – 6 Months (5 Devices). Works on TV & Mobile. Activated on your number.' },
  { name: 'NETFLIX UHD 4K Premium Plan', pricing: '₹450 – 3 Months (1 Device) | ₹799 – 6 Months | ₹1499 – 1 Year' },
  { name: 'PRIME VIDEO (Private)', pricing: '₹350 – 6 Months (5 Devices) | ₹650 – 1 Year (5 Devices)' },
  { name: 'ZEE5 PREMIUM (Your Number Activation)', pricing: '₹750 – 1 Year (Full HD, 5 Devices)' },
  { name: 'SONYLIV PREMIUM (Your Number Activation)', pricing: '₹850 – 1 Year (4K, 5 Devices)' },
  { name: 'YOUTUBE PREMIUM', pricing: '₹1200 – 12 Months (Existing ID)' },
  { name: 'HOTSTAR (Your Number Activation)', pricing: '₹1250 – 1 Year (Premium 4K Plan)' },
];

const getWhatsAppLink = (toolName: string) =>
  `https://wa.me/916357998730?text=${encodeURIComponent(`Hi Dreamcrest Solutions! I'm interested in ${toolName}. Please share price and details.`)}`;

const AllTools = () => {
  const [activeCategory, setActiveCategory] = useState(toolCategories[0].name);
  const totalTools = toolCategories.reduce((sum, cat) => sum + cat.tools.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <p className="text-muted-foreground text-sm mb-1">Dreamcrest Solutions</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
              All <span className="text-gradient">Tools</span>
            </h1>
            <a
              href="https://chat.whatsapp.com/HAygGmjN7cNLePOWBtrPjc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary/10 text-primary border border-primary/30 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors mb-2"
            >
              Join WhatsApp Group
            </a>
            <p className="text-muted-foreground text-sm">+91 6357998730 • <span className="text-primary font-semibold">{totalTools}</span> tools available</p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {toolCategories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat.name
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:text-primary'
                }`}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          {toolCategories
            .filter(cat => cat.name === activeCategory)
            .map(cat => (
              <div key={cat.name} className="mb-16">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                    {cat.emoji} {cat.name}
                  </h2>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {cat.tools.length} tools
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Tap a tool to open WhatsApp chat.</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {cat.tools.map((tool, i) => (
                    <motion.a
                      key={tool}
                      href={getWhatsAppLink(tool)}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="bg-card border border-border rounded-xl p-4 text-center card-hover group flex flex-col items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                        {tool}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>
            ))}

          {/* Streaming Deals */}
          <div className="mt-16">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2 text-center">
              📺 Streaming Deals
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-8">Tap any deal to chat on WhatsApp.</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {streamingDeals.map((deal, i) => (
                <motion.a
                  key={deal.name}
                  href={getWhatsAppLink(deal.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-xl p-5 card-hover group"
                >
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Streaming</span>
                  <h3 className="font-display font-semibold text-foreground mt-3 mb-2 group-hover:text-primary transition-colors">
                    {deal.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{deal.pricing}</p>
                  <div className="mt-3 text-xs text-primary font-medium flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" /> WhatsApp
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

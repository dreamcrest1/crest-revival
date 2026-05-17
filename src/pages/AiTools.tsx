import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Search, Mail, Shield, Zap, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEOHead from '@/components/SEOHead';
import { WhatsAppIcon } from '@/components/SocialIcons';
import { useAiTools, type AiTool } from '@/hooks/useAiTools';
import { metaForTool } from '@/data/aiToolMeta';

const COSMOFEED_URL = 'https://superprofile.bio/vp/dreamcrest-payments';
const WHATSAPP_NUMBER = '916357998730';

const waLink = (t: AiTool) => {
  const meta = t.meta ?? metaForTool(t.name);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi! I'm interested in *${t.name}* (${t.validity}) at ₹${t.price}.\n\n${meta.tagline}\n\nPlease share details on how to purchase.`,
  )}`;
};

// Convert brand hex into a soft gradient background pair
function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

// Branded logo tile: brand color background + logo from a fallback chain.
function BrandLogo({ t }: { t: AiTool }) {
  const meta = t.meta ?? metaForTool(t.name);
  // Build the source chain — first valid source is used; on error advance.
  const sources: string[] = [];
  if (meta.domain) {
    sources.push(`https://logo.clearbit.com/${meta.domain}?size=256`);
    sources.push(`https://www.google.com/s2/favicons?domain=${meta.domain}&sz=128`);
    sources.push(`https://icons.duckduckgo.com/ip3/${meta.domain}.ico`);
  }
  if (t.image) {
    sources.push(
      `https://images.weserv.nl/?url=${encodeURIComponent(t.image.replace(/^https?:\/\//, ''))}&w=400&h=400&fit=contain&output=webp&q=85`,
    );
  }

  const [idx, setIdx] = useState(0);
  const { r, g, b } = hexToRgb(meta.color);
  const bg = {
    background: `radial-gradient(circle at 30% 20%, rgba(${r},${g},${b},0.95), rgba(${r},${g},${b},0.55) 60%, rgba(${r},${g},${b},0.35))`,
  };
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const onDark = luma < 0.55;
  const exhausted = idx >= sources.length;

  return (
    <div className="w-full h-full flex items-center justify-center p-6 relative" style={bg}>
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '14px 14px', color: onDark ? '#fff' : '#000' }} />

      {exhausted ? (
        <span className={`font-display font-bold text-6xl drop-shadow-lg ${onDark ? 'text-white' : 'text-black'}`}>{t.symbol}</span>
      ) : (
        <div className={`relative w-3/4 h-3/4 rounded-2xl flex items-center justify-center backdrop-blur-sm ${onDark ? 'bg-white/95' : 'bg-black/5'}`}>
          <img
            key={sources[idx]}
            src={sources[idx]}
            alt={`${t.name} logo`}
            width={220}
            height={220}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="max-w-[80%] max-h-[80%] object-contain"
            onError={() => setIdx((i) => i + 1)}
          />
        </div>
      )}

      <div className={`absolute bottom-2 left-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur ${onDark ? 'bg-white/15 text-white border border-white/20' : 'bg-black/10 text-black/80 border border-black/15'}`}>
        {meta.category}
      </div>
    </div>
  );
}

function ToolCard({ t }: { t: AiTool }) {
  const meta = t.meta ?? metaForTool(t.name);
  return (
    <div className="group relative bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl overflow-hidden hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
      <div className="relative aspect-square overflow-hidden">
        <BrandLogo t={t} />
        <div className="absolute top-2.5 right-2.5 bg-background/85 backdrop-blur border border-border text-foreground text-[10px] font-mono px-2 py-0.5 rounded-full">
          {t.validity}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2.5 relative z-10 flex-1">
        <h3 className="font-display font-semibold text-foreground text-sm leading-tight line-clamp-2 min-h-[36px]">{t.name}</h3>
        <p className="text-[11px] text-muted-foreground line-clamp-2 min-h-[30px]">{meta.tagline}</p>

        <ul className="text-[10.5px] text-muted-foreground space-y-0.5">
          {meta.features.slice(0, 2).map((f) => (
            <li key={f} className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-primary shrink-0 mt-0.5" />
              <span className="line-clamp-1">{f}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-display font-bold text-2xl text-primary tabular-nums">
            ₹{t.price.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-muted-foreground">/ {t.validity.toLowerCase()}</span>
        </div>

        <div className="flex gap-2 mt-auto pt-1">
          <a
            href={COSMOFEED_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground rounded-xl py-2.5 text-xs font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Zap className="w-3.5 h-3.5" /> Buy Now
          </a>
          <a
            href={waLink(t)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp about ${t.name}`}
            className="flex items-center justify-center bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 rounded-xl px-3 py-2.5 text-xs font-semibold hover:bg-[#25D366] hover:text-white transition-all"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

const AiTools = () => {
  const { data: tools = [], isLoading, isFetching, dataUpdatedAt, error } = useAiTools();
  const qc = useQueryClient();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const filtered = useMemo(() => {
    let list = tools.filter((t) => t.name.toLowerCase().includes(q.toLowerCase()));
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [tools, q, sort]);

  const lastSync = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString('en-IN') : '—';

  return (
    <div className="min-h-screen relative z-10">
      <SEOHead
        title="AI Tools – Cheap AI Subscriptions India | Dreamcrest"
        description="Premium AI subscriptions — ChatGPT Plus, Eleven Labs, Lovable, Replit, Figma, Manus, Gamma & more at the cheapest prices in India. Private accounts, instant email delivery."
        keywords="cheap AI tools India, ChatGPT Plus cheap, Eleven Labs group buy, Lovable Pro cheap, Replit Core India, Figma cheap, AI subscription India"
        canonical="https://dreamcrest.net/ai-tools"
      />
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Premium AI Subscriptions
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-3">
              AI <span className="text-primary">Tools</span> Collection
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Genuine premium subscriptions at the most affordable prices in India.
              Private accounts delivered instantly to your email after payment.
            </p>
          </div>

          {/* Trust strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { icon: Shield, label: '100% Genuine' },
              { icon: Mail, label: 'Email Delivery' },
              { icon: Clock, label: 'Instant Access' },
              { icon: CheckCircle2, label: 'Full Warranty' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="bg-card/40 backdrop-blur border border-border/60 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>

          {/* Search + controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search ChatGPT, Lovable, Figma…"
                className="w-full pl-9 pr-3 py-2.5 bg-card/60 backdrop-blur border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
              />
            </div>
            <div className="flex gap-2">
              {([
                ['default', 'Featured'],
                ['price-asc', 'Price ↑'],
                ['price-desc', 'Price ↓'],
              ] as const).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setSort(k)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
                    sort === k
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card/60 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => qc.invalidateQueries({ queryKey: ['ai-tools-sheet-v2'] })}
                disabled={isFetching}
                title={`Last synced: ${lastSync}`}
                className="inline-flex items-center gap-1.5 bg-card/60 border border-border hover:border-primary/40 text-foreground text-xs font-medium px-3 py-2.5 rounded-xl transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                Sync
              </button>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-muted-foreground">
              Could not load products.
              <button onClick={() => qc.invalidateQueries({ queryKey: ['ai-tools-sheet-v2'] })} className="text-primary underline ml-1">Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No tools match "{q}".</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((t) => <ToolCard key={t.id} t={t} />)}
            </div>
          )}

          {/* Footer note */}
          <div className="mt-10 bg-card/40 backdrop-blur border border-border/60 rounded-2xl p-6 text-center">
            <Mail className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-sm text-foreground font-semibold">All AI tools are private subscriptions delivered directly to your registered email after payment.</p>
            <p className="text-xs text-muted-foreground mt-1.5">For more information, contact us on WhatsApp: <span className="text-primary font-semibold">+91 6357998730</span></p>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default AiTools;

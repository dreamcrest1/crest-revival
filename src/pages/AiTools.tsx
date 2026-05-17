import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowDownRight, ArrowUpRight, Minus, RefreshCw, Search, Mail, TrendingUp, Activity, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEOHead from '@/components/SEOHead';
import { WhatsAppIcon } from '@/components/SocialIcons';
import { useAiTools, proxyImage, type AiTool } from '@/hooks/useAiTools';

const COSMOFEED_URL = 'https://superprofile.bio/vp/dreamcrest-payments';
const WHATSAPP_NUMBER = '916357998730';

const waLink = (t: AiTool) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi! I'm interested in *${t.name}* (${t.validity}) priced at ₹${t.price}. Please share details on how to purchase.`,
  )}`;

// ---------- Sparkline ----------
function Sparkline({ data, trend }: { data: number[]; trend: AiTool['trend'] }) {
  const w = 100, h = 28;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ');
  const color = trend === 'up' ? 'hsl(142 70% 50%)' : trend === 'down' ? 'hsl(0 75% 60%)' : 'hsl(var(--muted-foreground))';
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ---------- Ticker tape ----------
function TickerTape({ tools }: { tools: AiTool[] }) {
  if (!tools.length) return null;
  const row = [...tools, ...tools]; // duplicate for seamless scroll
  return (
    <div className="relative overflow-hidden border-y border-primary/20 bg-black/40 backdrop-blur">
      <div className="flex gap-8 py-2.5 animate-[ticker_90s_linear_infinite] whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-2 text-xs font-mono">
            <span className="text-muted-foreground">{t.symbol}</span>
            <span className="text-foreground font-semibold">₹{t.price.toLocaleString('en-IN')}</span>
            <span className={t.trend === 'up' ? 'text-emerald-400' : t.trend === 'down' ? 'text-red-400' : 'text-muted-foreground'}>
              {t.trend === 'up' ? '▲' : t.trend === 'down' ? '▼' : '■'} {Math.abs(t.change)}%
            </span>
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}

// ---------- Product card ----------
function ToolCard({ t }: { t: AiTool }) {
  const [imgFailed, setImgFailed] = useState(false);
  const trendColor =
    t.trend === 'up' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
    : t.trend === 'down' ? 'text-red-400 border-red-400/30 bg-red-400/10'
    : 'text-muted-foreground border-border bg-secondary/40';
  const TrendIcon = t.trend === 'up' ? ArrowUpRight : t.trend === 'down' ? ArrowDownRight : Minus;

  return (
    <div className="group relative bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 flex flex-col">
      {/* glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-primary/[0.06] to-transparent pointer-events-none" />

      {/* image */}
      <div className="relative bg-gradient-to-br from-secondary/40 to-secondary/10 aspect-square overflow-hidden">
        {!imgFailed && t.image ? (
          <img
            src={proxyImage(t.image, 600)}
            alt={`${t.name} – ${t.validity} subscription`}
            width={600}
            height={600}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="font-display font-bold text-4xl text-primary/80">{t.symbol}</span>
          </div>
        )}
        {/* Ticker symbol overlay */}
        <div className="absolute top-2.5 left-2.5 font-mono text-[10px] bg-black/60 backdrop-blur text-primary border border-primary/30 px-2 py-0.5 rounded">
          {t.symbol}
        </div>
        {/* Live badge */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
        </div>
      </div>

      {/* body */}
      <div className="p-4 flex flex-col gap-3 relative z-10 flex-1">
        <div>
          <h3 className="font-display font-semibold text-foreground text-sm leading-tight line-clamp-2 min-h-[36px]">{t.name}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono uppercase tracking-wider">{t.validity}</p>
        </div>

        {/* Price + change */}
        <div className="flex items-end justify-between">
          <div>
            <span className="font-display font-bold text-2xl text-foreground tabular-nums">
              ₹{t.price.toLocaleString('en-IN')}
            </span>
            <div className={`mt-1 inline-flex items-center gap-1 text-[11px] font-mono border px-1.5 py-0.5 rounded ${trendColor}`}>
              <TrendIcon className="w-3 h-3" />
              {t.change > 0 ? '+' : ''}{t.change}%
            </div>
          </div>
          <Sparkline data={t.spark} trend={t.trend} />
        </div>

        {/* Description */}
        <div className="text-[11px] text-muted-foreground border-t border-border/60 pt-2.5 space-y-1">
          <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-primary shrink-0" /> Private subscription · delivered to your email</p>
          <p>For more info, contact on WhatsApp: <span className="text-primary font-semibold">+91 6357998730</span></p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
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
            className="flex items-center justify-center gap-1.5 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 rounded-xl px-3 py-2.5 text-xs font-semibold hover:bg-[#25D366] hover:text-white transition-all"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ---------- Page ----------
const AiTools = () => {
  const { data: tools = [], isLoading, isFetching, dataUpdatedAt, error } = useAiTools();
  const qc = useQueryClient();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'default' | 'price-asc' | 'price-desc' | 'gainers' | 'losers'>('default');

  const filtered = useMemo(() => {
    let list = tools.filter((t) => t.name.toLowerCase().includes(q.toLowerCase()));
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'gainers') list = [...list].sort((a, b) => b.change - a.change);
    if (sort === 'losers') list = [...list].sort((a, b) => a.change - b.change);
    return list;
  }, [tools, q, sort]);

  const stats = useMemo(() => {
    if (!tools.length) return { up: 0, down: 0, vol: 0, avg: 0 };
    const up = tools.filter((t) => t.trend === 'up').length;
    const down = tools.filter((t) => t.trend === 'down').length;
    const vol = tools.reduce((s, t) => s + t.price, 0);
    const avg = Math.round(vol / tools.length);
    return { up, down, vol, avg };
  }, [tools]);

  const lastSync = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString('en-IN') : '—';

  return (
    <div className="min-h-screen relative z-10">
      <SEOHead
        title="AI Tools Live Market – Cheap AI Subscriptions India | Dreamcrest"
        description="Live AI tools marketplace — ChatGPT Plus, Eleven Labs, Lovable, Replit, Figma, Manus, Gamma & more at the cheapest group buy prices in India. Live pricing, instant email delivery."
        keywords="cheap AI tools India, ChatGPT Plus cheap, Eleven Labs group buy, Lovable Pro cheap, Replit Core India, Figma cheap, AI subscription India, group buy AI tools"
        canonical="https://dreamcrest.net/ai-tools"
      />
      <Navbar />

      <div className="pt-20">
        {/* Ticker tape */}
        <TickerTape tools={tools} />

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-3">
                <Activity className="w-3 h-3" /> Live Market · NSE-Style
              </div>
              <h1 className="font-display font-bold text-3xl md:text-5xl text-foreground">
                AI Tools <span className="text-primary">Exchange</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                Real-time pricing for premium AI subscriptions, synced directly from our master sheet. Private accounts delivered straight to your email.
              </p>
            </div>

            <button
              onClick={() => qc.invalidateQueries({ queryKey: ['ai-tools-sheet'] })}
              disabled={isFetching}
              className="self-start md:self-end inline-flex items-center gap-2 bg-secondary/60 border border-border hover:border-primary/40 text-foreground text-xs font-mono uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Syncing…' : 'Sync Now'}
              <span className="text-muted-foreground/60 normal-case ml-1">· {lastSync}</span>
            </button>
          </div>

          {/* Market stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-card/60 backdrop-blur border border-border/60 rounded-xl p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Listed</div>
              <div className="font-display font-bold text-2xl text-foreground mt-1">{tools.length}</div>
            </div>
            <div className="bg-card/60 backdrop-blur border border-emerald-400/20 rounded-xl p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Gainers</div>
              <div className="font-display font-bold text-2xl text-emerald-400 mt-1 flex items-center gap-1"><ArrowUpRight className="w-5 h-5" />{stats.up}</div>
            </div>
            <div className="bg-card/60 backdrop-blur border border-red-400/20 rounded-xl p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-red-400">Losers</div>
              <div className="font-display font-bold text-2xl text-red-400 mt-1 flex items-center gap-1"><ArrowDownRight className="w-5 h-5" />{stats.down}</div>
            </div>
            <div className="bg-card/60 backdrop-blur border border-primary/20 rounded-xl p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-primary">Avg Price</div>
              <div className="font-display font-bold text-2xl text-foreground mt-1">₹{stats.avg.toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* Search + sort */}
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
            <div className="flex gap-1.5 overflow-x-auto">
              {([
                ['default', 'All'],
                ['gainers', '▲ Gainers'],
                ['losers', '▼ Losers'],
                ['price-asc', '₹ Low→High'],
                ['price-desc', '₹ High→Low'],
              ] as const).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setSort(k)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider whitespace-nowrap border transition-all ${
                    sort === k
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card/60 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-muted-foreground">
              Could not load live prices. <button onClick={() => qc.invalidateQueries({ queryKey: ['ai-tools-sheet'] })} className="text-primary underline ml-1">Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No tools match "{q}".</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((t) => <ToolCard key={t.id} t={t} />)}
            </div>
          )}

          {/* Footer note */}
          <div className="mt-10 bg-card/40 backdrop-blur border border-border/60 rounded-2xl p-5 text-center">
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-sm text-foreground font-semibold">Prices sync live from our master sheet.</p>
            <p className="text-xs text-muted-foreground mt-1">All AI tools are private subscriptions delivered directly to your registered email after payment.</p>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default AiTools;

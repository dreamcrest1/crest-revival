import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, Mail, Shield, Sparkles, Zap, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEOHead from '@/components/SEOHead';
import { WhatsAppIcon } from '@/components/SocialIcons';
import { BrandLogo } from '@/components/ai/BrandLogo';
import { useAiTools } from '@/hooks/useAiTools';
import { metaForTool } from '@/data/aiToolMeta';
import { buildAiToolSeo, findAiToolBySlug, slugifyAiTool } from '@/lib/aiToolSeo';
import { trackEvent } from '@/lib/eventTracker';
import CheckoutDialog from '@/components/checkout/CheckoutDialog';

const WHATSAPP_NUMBER = '919773453978';



const AiToolDetail = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { data: tools = [], isLoading } = useAiTools();
  const [checkoutOpen, setCheckoutOpen] = useState(false);


  const tool = useMemo(() => findAiToolBySlug(tools, slug), [tools, slug]);
  const seo = useMemo(() => (tool ? buildAiToolSeo(tool) : null), [tool]);

  // Related: same category bucket, up to 6
  const related = useMemo(() => {
    if (!tool) return [];
    const cat = metaForTool(tool.name).category;
    return tools
      .filter((t) => t.id !== tool.id && metaForTool(t.name).category === cat)
      .slice(0, 6);
  }, [tools, tool]);

  if (isLoading) {
    return (
      <div className="min-h-screen relative z-10">
        <Navbar />
        <div className="pt-32 pb-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!tool || !seo) {
    return (
      <div className="min-h-screen relative z-10">
        <SEOHead title="AI Tool not found | Castle Tools" noindex />
        <Navbar />
        <div className="pt-32 pb-20 container mx-auto px-4 max-w-3xl text-center">
          <h1 className="font-display font-bold text-3xl text-foreground mb-3">AI tool not found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find an AI tool matching "{slug}". It may have been renamed or removed.
          </p>
          <Link
            to="/ai-tools"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to AI Tools
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const meta = metaForTool(tool.name);
  const waText = encodeURIComponent(
    `Hi! I'm interested in *${tool.name}* (${tool.validity}) at ₹${tool.price}.\n\n${meta.tagline}\n\nPlease share details on how to purchase.`,
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

  return (
    <div className="min-h-screen relative z-10">
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        canonical={seo.url}
        ogImage={seo.ogImage}
        ogType="product"
        jsonLd={seo.jsonLd}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'AI Tools', url: '/ai-tools' },
          { name: tool.name, url: `/ai-tool/${seo.slug}` },
        ]}
      />
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb */}
          <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/ai-tools" className="hover:text-primary">AI Tools</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{tool.name}</span>
          </nav>

          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 items-start">
            {/* Logo / image card — matches the AI Tools listing tile */}
            <div className="border-2 border-primary/30 rounded-2xl aspect-square relative overflow-hidden shadow-[0_0_32px_hsl(var(--primary)/0.15)]">
              <BrandLogo t={tool} />
              <div className="absolute top-3 right-3 bg-background/85 backdrop-blur border border-primary/40 text-primary text-[10px] font-mono px-2 py-0.5 rounded-full z-10">
                {tool.validity}
              </div>
              {/* Corner ornaments */}
              <span className="absolute top-2 left-2 text-primary/60 text-sm z-10">❖</span>
              <span className="absolute bottom-2 right-2 text-primary/60 text-sm z-10">❖</span>
            </div>

            {/* Details */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Group Buy India
              </div>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
                <span className="text-primary">{tool.name}</span>
              </h1>
              {/personal email/i.test(tool.name) && (
                <div className="flex items-start gap-2 bg-primary/10 border border-primary/20 text-foreground rounded-xl px-3 py-2.5 mb-4 text-sm">
                  <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>
                    <span className="font-semibold text-primary">Activated on your personal email</span>
                    {' '}— share your email at checkout and we'll activate the plan directly on your own Claude account.
                  </span>
                </div>
              )}
              {tool.activationType && (
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold">
                  <Sparkles className="w-3 h-3" />
                  {tool.activationType}
                </div>
              )}
              <p className="text-muted-foreground mb-5">{meta.description || meta.tagline}</p>

              <div className="flex items-baseline gap-3 mb-5">
                {tool.price > 0 ? (
                  <>
                    <span className="font-display font-bold text-4xl text-primary tabular-nums">
                      ₹{tool.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-muted-foreground">/ {tool.validity.toLowerCase()}</span>
                  </>
                ) : (
                  <span className="font-display font-semibold text-2xl text-primary">Contact for pricing</span>
                )}
              </div>

              {meta.features?.length ? (
                <ul className="grid sm:grid-cols-2 gap-2 mb-6">
                  {meta.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="flex gap-2 mb-6">
                {tool.price > 0 ? (
                  <button
                    onClick={() => { void trackEvent('checkout_click', { tool_name: tool.name, category: meta.category, price: tool.price, image: tool.image }); setCheckoutOpen(true); }}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    <CreditCard className="w-4 h-4" /> Buy Now ₹{tool.price}
                  </button>
                ) : (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => void trackEvent('tool_whatsapp_click', { tool_name: tool.name, category: meta.category, price: tool.price, image: tool.image })}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    <Zap className="w-4 h-4" /> Enquire
                  </a>
                )}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => void trackEvent('tool_whatsapp_click', { tool_name: tool.name, category: meta.category, price: tool.price, image: tool.image })}
                  className="flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-[#25D366] hover:text-white transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4" /> WhatsApp
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { icon: Shield, label: '100% Genuine' },
                  { icon: Mail, label: 'Email Delivery' },
                  { icon: Clock, label: 'Instant Access' },
                  { icon: CheckCircle2, label: 'Full Warranty' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="bg-card/40 backdrop-blur border border-border/60 rounded-xl p-2.5 flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                    <span className="font-medium text-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ — mirrors FAQPage JSON-LD for human readers */}
          {(() => {
            const faqBlock = seo.jsonLd.find((b) => b?.['@type'] === 'FAQPage') as
              | { mainEntity?: Array<{ name?: string; acceptedAnswer?: { text?: string } }> }
              | undefined;
            const faqs = Array.isArray(faqBlock?.mainEntity) ? faqBlock!.mainEntity! : [];
            if (!faqs.length) return null;
            return (
              <section className="mt-12 bg-card/40 backdrop-blur border border-border/60 rounded-2xl p-6">
                <h2 className="font-display font-bold text-xl text-foreground mb-4">
                  Frequently asked about {tool.name}
                </h2>
                <div className="space-y-4">
                  {faqs.map((q, i) => (
                    <div key={q?.name ?? i}>
                      <h3 className="font-semibold text-foreground text-sm mb-1">{q?.name}</h3>
                      <p className="text-sm text-muted-foreground">{q?.acceptedAnswer?.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })()}


          {/* Related tools */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display font-bold text-xl text-foreground mb-4">
                Other {metaForTool(tool.name).category} tools
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to={`/ai-tool/${slugifyAiTool(r.name)}`}
                    className="bg-card/60 backdrop-blur border border-border/60 hover:border-primary/40 rounded-xl p-3 text-center transition-all"
                  >
                    <div className="text-xs font-semibold text-foreground line-clamp-2 mb-1">{r.name}</div>
                    <div className="text-[10px] text-primary tabular-nums">
                      {r.price > 0 ? `₹${r.price.toLocaleString('en-IN')}` : 'Enquire'}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <WhatsAppButton />
      <Footer />
      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={[{ id: `tool-${slugifyAiTool(tool.name)}`, name: `${tool.name} (${tool.validity})`, price: `₹${tool.price}`, quantity: 1 }]}
        totalAmount={tool.price}
      />
    </div>
  );
};

export default AiToolDetail;

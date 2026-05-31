// @ts-nocheck
// Storefront AI chatbot — streams OpenAI-compatible SSE from Lovable AI Gateway.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function fetchCatalog() {
  const { data } = await supabase
    .from('products')
    .select('name, price, original_price, category, description, is_hot_selling')
    .eq('is_active', true)
    .limit(300);
  return (data || []).map((p) => ({
    name: p.name,
    price: `₹${p.price}`,
    original: p.original_price ? `₹${p.original_price}` : null,
    cat: p.category,
    hot: p.is_hot_selling || undefined,
    desc: (p.description || '').slice(0, 140),
  }));
}

const SYSTEM = (catalog: unknown[]) => `You are the Castle Tools storefront assistant — a friendly Indian shopping concierge for premium software, AI tools, OTT subscriptions and SEO/VPN tools at unbeatable group-buy prices.

RULES:
- Only recommend tools that EXIST in the catalog below. NEVER invent products or prices.
- When suggesting, mention the price in ₹ and 1-line value.
- For ordering, always say: "Tap the green WhatsApp button to chat with our team on +91 63579 98730 and get your activation in minutes." Do NOT make up checkout URLs.
- Be concise (≤4 short paragraphs). Use bullet points for lists of 3+ items.
- Respond in the user's language (English / Hinglish if they mix).
- If asked about something not in the catalog, suggest the closest match.

CATALOG (JSON):
${JSON.stringify(catalog)}`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'messages array required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const catalog = await fetchCatalog();
    const payload = {
      model: 'google/gemini-3-flash-preview',
      stream: true,
      messages: [
        { role: 'system', content: SYSTEM(catalog) },
        ...messages.slice(-20).map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
      ],
    };

    const upstream = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify(payload),
    });

    if (upstream.status === 429 || upstream.status === 402) {
      return new Response(JSON.stringify({ error: 'AI rate/quota error' }), { status: upstream.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (!upstream.ok || !upstream.body) {
      const t = await upstream.text();
      return new Response(JSON.stringify({ error: t }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(upstream.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

// @ts-nocheck
// Auto image alt-text generator via Lovable AI Gateway vision.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { image_url, product_name } = await req.json();
    if (!image_url || typeof image_url !== 'string') {
      return new Response(JSON.stringify({ error: 'image_url required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const upstream = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: `Write a concise, SEO-friendly alt text (8-14 words) for this product image. Product name: "${product_name || 'unknown'}". Describe what's visually shown and include the product name naturally. Output ONLY the alt text, no quotes.` },
            { type: 'image_url', image_url: { url: image_url } },
          ],
        }],
      }),
    });

    if (!upstream.ok) {
      const t = await upstream.text();
      return new Response(JSON.stringify({ error: t }), { status: upstream.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const j = await upstream.json();
    const alt = (j?.choices?.[0]?.message?.content || '').trim().replace(/^["']|["']$/g, '');
    return new Response(JSON.stringify({ alt }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

// @ts-nocheck
// AI product copy generator — JSON output via Lovable AI Gateway.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json();
    const { product_name, category, key_features } = body as { product_name?: string; category?: string; key_features?: string[] };
    if (!product_name || product_name.length < 2 || product_name.length > 200) {
      return new Response(JSON.stringify({ error: 'product_name required (2-200 chars)' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const prompt = `Write product copy for an Indian premium tools reseller called Castle Tools.

Product: ${product_name}
Category: ${category || 'Software'}
${key_features?.length ? `Key features: ${key_features.join(', ')}` : ''}

Return ONLY a JSON object with these exact keys:
- description: 2-3 sentences, friendly Indian English, ~280 chars max, mention "best price in India" or "group buy" naturally.
- seo_title: ≤60 chars, includes product name and "India" or "Cheap" benefit
- seo_description: ≤160 chars, includes price benefit and call-to-action
- keywords: comma-separated list of 6-10 keywords (product + variants + Indian terms)`;

    const upstream = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      }),
    });

    if (upstream.status === 429 || upstream.status === 402) {
      return new Response(JSON.stringify({ error: 'AI quota error' }), { status: upstream.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (!upstream.ok) {
      const t = await upstream.text();
      return new Response(JSON.stringify({ error: t }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const j = await upstream.json();
    const content = j?.choices?.[0]?.message?.content || '{}';
    let parsed;
    try { parsed = JSON.parse(content); } catch { parsed = { raw: content }; }
    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

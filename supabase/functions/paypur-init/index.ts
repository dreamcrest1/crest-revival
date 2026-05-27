import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const API_KEY = Deno.env.get('PAYPUR_API_KEY')!;
const SIGNING_SECRET = Deno.env.get('PAYPUR_SIGNING_SECRET')!;
const PAYPUR_BASE = 'https://upi.paypur.in';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json();
    const {
      orderId,
      amount,
      items = [],
      customer = {},
      origin,
    } = body as {
      orderId?: string;
      amount?: number | string;
      items?: Array<{ name: string; price: string; quantity: number }>;
      customer?: { firstname?: string; email?: string; phone?: string };
      origin?: string;
    };

    if (!orderId || !amount) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing orderId or amount' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const amountStr = Number(amount).toFixed(2);
    const baseOrigin = origin || req.headers.get('origin') || '';
    const surl = `${baseOrigin}/payment/success?order_id=${encodeURIComponent(orderId)}`;
    const furl = `${baseOrigin}/payment/failure?order_id=${encodeURIComponent(orderId)}`;

    const firstname = (customer.firstname || 'Customer').slice(0, 60);
    const email = (customer.email || 'noreply@dreamcrest.net').slice(0, 120);
    const phone = (customer.phone || '9999999999').replace(/\D/g, '').slice(-10) || '9999999999';
    const productinfo = items.length
      ? items.map((i) => `${i.name} x${i.quantity}`).join(', ').slice(0, 200)
      : 'Dreamcrest Order';

    // Persist pending order
    const { error: insErr } = await supabase.from('orders').insert({
      order_id: orderId,
      amount: Number(amountStr),
      status: 'pending',
      items,
      customer: { firstname, email, phone },
    });
    if (insErr && !insErr.message.includes('duplicate')) {
      console.error('insert order failed', insErr);
    }

    const signature = await hmacSha256Hex(
      [orderId, amountStr, surl, furl].join('|'),
      SIGNING_SECRET,
    );

    const payload = {
      order_id: orderId,
      amount: amountStr,
      surl,
      furl,
      productinfo,
      firstname,
      email,
      phone,
      signature,
    };

    const res = await fetch(`${PAYPUR_BASE}/api/merchant/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-PAYPUR-KEY': API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data: any = null;
    try { data = JSON.parse(text); } catch { /* ignore */ }

    if (!res.ok || !data?.ok || !data?.pay_url) {
      console.error('PayPur init failed', res.status, text);
      return new Response(
        JSON.stringify({ ok: false, error: data?.error || `PayPur init failed (${res.status})`, raw: text }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    await supabase
      .from('orders')
      .update({ pay_url: data.pay_url, txn_id: data.txn_id ?? null })
      .eq('order_id', orderId);

    return new Response(
      JSON.stringify({ ok: true, pay_url: data.pay_url, order_id: orderId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    console.error('paypur-init error', e);
    return new Response(JSON.stringify({ ok: false, error: String(e?.message || e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

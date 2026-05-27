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

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) res |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return res === 0;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json();
    const {
      order_id,
      txn_id,
      status,
      amount,
      signature,
    } = body as Record<string, string | undefined>;

    if (!order_id) {
      return new Response(JSON.stringify({ ok: false, error: 'order_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let verifiedStatus = status || 'pending';
    let verifiedTxn = txn_id || null;
    let verifiedAmount: number | null = amount ? Number(amount) : null;

    // If we got callback params, verify the signature
    if (txn_id && status && amount && signature) {
      const expected = await hmacSha256Hex(
        [txn_id, order_id, status, amount].join('|'),
        SIGNING_SECRET,
      );
      if (!timingSafeEqual(expected, signature)) {
        console.warn('signature mismatch', { order_id, expected, signature });
        return new Response(JSON.stringify({ ok: false, error: 'Invalid signature' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      // No callback signature — fall back to status API using txn_id from DB
      const { data: row } = await supabase
        .from('orders')
        .select('txn_id')
        .eq('order_id', order_id)
        .maybeSingle();
      const tid = row?.txn_id;
      if (tid) {
        try {
          const res = await fetch(`${PAYPUR_BASE}/api/merchant/status?txn_id=${encodeURIComponent(tid)}`, {
            headers: { 'X-PAYPUR-KEY': API_KEY },
          });
          if (res.ok) {
            const sdata = await res.json();
            verifiedStatus = sdata.status || verifiedStatus;
            verifiedAmount = sdata.amount ? Number(sdata.amount) : verifiedAmount;
            verifiedTxn = tid;
          }
        } catch (e) {
          console.warn('status fetch failed', e);
        }
      }
    }

    const normalized =
      verifiedStatus?.toLowerCase() === 'success' || verifiedStatus?.toLowerCase() === 'paid'
        ? 'success'
        : verifiedStatus?.toLowerCase() === 'failed' || verifiedStatus?.toLowerCase() === 'failure'
        ? 'failed'
        : 'pending';

    const update: Record<string, unknown> = { status: normalized };
    if (verifiedTxn) update.txn_id = verifiedTxn;
    if (verifiedAmount != null) update.amount = verifiedAmount;

    await supabase.from('orders').update(update).eq('order_id', order_id);

    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', order_id)
      .maybeSingle();

    return new Response(JSON.stringify({ ok: true, order }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('paypur-verify error', e);
    return new Response(JSON.stringify({ ok: false, error: String(e?.message || e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

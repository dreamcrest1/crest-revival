// Edge function to record a visit with real client IP + geo from request headers.
// CORS-enabled, public (no JWT). Uses service role to insert into site_analytics.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const detectDevice = (ua: string): string => {
  if (!ua) return "desktop";
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone|iPod|Opera Mini|IEMobile/i.test(ua)) return "mobile";
  return "desktop";
};
const detectBrowser = (ua: string): string => {
  if (!ua) return "Other";
  if (/Edg\//i.test(ua)) return "Edge";
  if (/OPR\/|Opera/i.test(ua)) return "Opera";
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return "Chrome";
  if (/Firefox\//i.test(ua)) return "Firefox";
  if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
  if (/MSIE|Trident/i.test(ua)) return "IE";
  return "Other";
};
const detectOS = (ua: string): string => {
  if (!ua) return "Other";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Mac OS X/i.test(ua)) return "macOS";
  if (/Linux/i.test(ua)) return "Linux";
  return "Other";
};

const lookupGeo = async (ip: string) => {
  if (!ip || ip === "127.0.0.1" || ip.startsWith("::")) return {};
  // ip-api.com is server-friendly, no key required, generous limits for server IPs
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,regionName,city`,
      { signal: ctrl.signal }
    );
    clearTimeout(t);
    if (res.ok) {
      const j = await res.json();
      if (j.status === "success") {
        return { country: j.country, region: j.regionName, city: j.city };
      }
    }
  } catch {}
  // fallback
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(`https://ipwho.is/${ip}`, { signal: ctrl.signal });
    clearTimeout(t);
    if (res.ok) {
      const j = await res.json();
      if (j.success !== false) {
        return { country: j.country, region: j.region, city: j.city };
      }
    }
  } catch {}
  return {};
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const {
      page_path,
      visitor_id,
      referrer,
      screen_width,
      language,
    } = body || {};

    if (!page_path) {
      return new Response(JSON.stringify({ error: "page_path required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ua = req.headers.get("user-agent") || "";
    const xff = req.headers.get("x-forwarded-for") || "";
    const ip =
      xff.split(",")[0].trim() ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      "";

    const geo = await lookupGeo(ip);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase.from("site_analytics").insert({
      page_path,
      event_type: "page_view",
      visitor_id: visitor_id || null,
      user_agent: ua,
      referrer: referrer || null,
      device_type: detectDevice(ua),
      browser: detectBrowser(ua),
      os: detectOS(ua),
      screen_width: screen_width || null,
      language: language || null,
      ip_address: ip || null,
      country: geo.country || null,
      city: geo.city || null,
      region: geo.region || null,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, ip }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

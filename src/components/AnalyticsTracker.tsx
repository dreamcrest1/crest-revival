import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const getVisitorId = () => {
  try {
    let id = localStorage.getItem('dc_visitor_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('dc_visitor_id', id);
    }
    return id;
  } catch {
    return null;
  }
};

const detectDevice = (ua: string): string => {
  if (!ua) return 'desktop';
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return 'tablet';
  if (/Mobi|Android|iPhone|iPod|Opera Mini|IEMobile/i.test(ua)) return 'mobile';
  return 'desktop';
};

const detectBrowser = (ua: string): string => {
  if (!ua) return 'Other';
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/OPR\/|Opera/i.test(ua)) return 'Opera';
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return 'Chrome';
  if (/Firefox\//i.test(ua)) return 'Firefox';
  if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
  if (/MSIE|Trident/i.test(ua)) return 'IE';
  return 'Other';
};

const detectOS = (ua: string): string => {
  if (!ua) return 'Other';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Mac OS X/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Other';
};

// Fetch IP/geo with hard timeout. Returns {} on any failure. Never throws.
const fetchGeoSafe = async (): Promise<{ ip?: string; country?: string; city?: string; region?: string }> => {
  try {
    const cached = sessionStorage.getItem('dc_geo');
    if (cached) return JSON.parse(cached);
  } catch {}

  const sources = [
    {
      url: 'https://ipapi.co/json/',
      map: (j: any) => ({ ip: j.ip, country: j.country_name, city: j.city, region: j.region }),
    },
    {
      url: 'https://ipwho.is/',
      map: (j: any) => (j.success === false ? {} : { ip: j.ip, country: j.country, city: j.city, region: j.region }),
    },
  ];

  for (const src of sources) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 2500);
      const res = await fetch(src.url, { cache: 'no-store', signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) continue;
      const j = await res.json();
      const out = src.map(j);
      if (out && out.ip) {
        try { sessionStorage.setItem('dc_geo', JSON.stringify(out)); } catch {}
        return out;
      }
    } catch {
      // try next source
    }
  }
  return {};
};

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    const track = async () => {
      const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';

      // Compute device info synchronously — never depends on network.
      const basePayload = {
        page_path: location.pathname,
        event_type: 'page_view',
        visitor_id: getVisitorId(),
        user_agent: ua,
        referrer: (typeof document !== 'undefined' && document.referrer) || null,
        device_type: detectDevice(ua),
        browser: detectBrowser(ua),
        os: detectOS(ua),
        screen_width: (typeof window !== 'undefined' && window.screen?.width) || null,
        language: (typeof navigator !== 'undefined' && navigator.language) || null,
      };

      // Try geo with 2.5s timeout; if it fails we still insert with device info.
      const geo = await fetchGeoSafe();

      try {
        await supabase.from('site_analytics').insert({
          ...basePayload,
          ip_address: geo.ip || null,
          country: geo.country || null,
          city: geo.city || null,
          region: geo.region || null,
        });
      } catch {
        // Last-resort: insert minimal payload to ensure visit is recorded
        try {
          await supabase.from('site_analytics').insert(basePayload);
        } catch {
          // Silently fail — analytics shouldn't break the site
        }
      }
    };

    track();
  }, [location.pathname]);

  return null;
};

export default AnalyticsTracker;

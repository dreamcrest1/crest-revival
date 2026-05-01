import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const getVisitorId = () => {
  let id = localStorage.getItem('dc_visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('dc_visitor_id', id);
  }
  return id;
};

const detectDevice = (ua: string): string => {
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return 'tablet';
  if (/Mobi|Android|iPhone|iPod|Opera Mini|IEMobile/i.test(ua)) return 'mobile';
  return 'desktop';
};

const detectBrowser = (ua: string): string => {
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/OPR\/|Opera/i.test(ua)) return 'Opera';
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return 'Chrome';
  if (/Firefox\//i.test(ua)) return 'Firefox';
  if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
  if (/MSIE|Trident/i.test(ua)) return 'IE';
  return 'Other';
};

const detectOS = (ua: string): string => {
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Mac OS X/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Other';
};

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    const track = async () => {
      try {
        const ua = navigator.userAgent;

        // Try to fetch IP + geo (cached per session). Non-blocking failures are fine.
        let geo: { ip?: string; country?: string; city?: string; region?: string } = {};
        try {
          const cached = sessionStorage.getItem('dc_geo');
          if (cached) {
            geo = JSON.parse(cached);
          } else {
            const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
            if (res.ok) {
              const j = await res.json();
              geo = {
                ip: j.ip,
                country: j.country_name,
                city: j.city,
                region: j.region,
              };
              sessionStorage.setItem('dc_geo', JSON.stringify(geo));
            }
          }
        } catch {
          // ignore geo errors
        }

        await supabase.from('site_analytics').insert({
          page_path: location.pathname,
          event_type: 'page_view',
          visitor_id: getVisitorId(),
          user_agent: ua,
          referrer: document.referrer || null,
          device_type: detectDevice(ua),
          browser: detectBrowser(ua),
          os: detectOS(ua),
          screen_width: window.screen?.width || null,
          language: navigator.language || null,
          ip_address: geo.ip || null,
          country: geo.country || null,
          city: geo.city || null,
          region: geo.region || null,
        });
      } catch (e) {
        // Silently fail - analytics shouldn't break the site
      }
    };

    track();
  }, [location.pathname]);

  return null;
};

export default AnalyticsTracker;

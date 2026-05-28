import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GoogleAnalytics = () => {
  const [gaId, setGaId] = useState<string | null>(null);
  const location = useLocation();

  // Load GA id from site_settings
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'google_analytics')
          .maybeSingle();
        const id = (data?.value as any)?.measurement_id?.trim();
        if (active && id) setGaId(id);
      } catch {
        // ignore
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Inject gtag script once
  useEffect(() => {
    if (!gaId) return;
    if (document.getElementById('ga-script')) return;

    const s = document.createElement('script');
    s.id = 'ga-script';
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaId, { send_page_view: false });
  }, [gaId]);

  // Track route changes
  useEffect(() => {
    if (!gaId || typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [gaId, location.pathname, location.search]);

  return null;
};

export default GoogleAnalytics;

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

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    const track = async () => {
      try {
        await supabase.functions.invoke('track-visit', {
          body: {
            page_path: location.pathname,
            visitor_id: getVisitorId(),
            referrer: (typeof document !== 'undefined' && document.referrer) || null,
            screen_width: (typeof window !== 'undefined' && window.screen?.width) || null,
            language: (typeof navigator !== 'undefined' && navigator.language) || null,
          },
        });
      } catch {
        // analytics must never break the site
      }
    };

    track();
  }, [location.pathname]);

  return null;
};

export default AnalyticsTracker;

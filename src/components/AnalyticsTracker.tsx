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

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Don't track admin pages
    if (location.pathname.startsWith('/admin')) return;

    const track = async () => {
      try {
        await supabase.from('site_analytics').insert({
          page_path: location.pathname,
          event_type: 'page_view',
          visitor_id: getVisitorId(),
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
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

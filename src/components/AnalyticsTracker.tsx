import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const getVisitorId = () => {
  try {
    let id = localStorage.getItem('dc_visitor_id');
    if (!id) {
      id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem('dc_visitor_id', id);
    }
    return id;
  } catch {
    return null;
  }
};

const detectDevice = (ua: string, width: number | null, touchPoints: number): string => {
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return 'tablet';
  if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return 'tablet';
  if (/Mobi|Android|iPhone|iPod|Opera Mini|IEMobile/i.test(ua)) return 'mobile';
  if (/Macintosh/i.test(ua) && touchPoints > 1) return 'tablet';
  if (width !== null && width < 768 && touchPoints > 0) return 'mobile';
  return 'desktop';
};

const detectBrowser = (ua: string): string => {
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/OPR\/|Opera/i.test(ua)) return 'Opera';
  if (/CriOS|Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return 'Chrome';
  if (/FxiOS|Firefox\//i.test(ua)) return 'Firefox';
  if (/Safari\//i.test(ua) && !/Chrome|CriOS|Android/i.test(ua)) return 'Safari';
  return 'Other';
};

const detectOS = (ua: string): string => {
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Macintosh/i.test(ua) && typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1) return 'iPadOS';
  if (/Windows/i.test(ua)) return 'Windows';
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
        const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
        const screenWidth = (typeof window !== 'undefined' && window.screen?.width) || null;
        const touchPoints = (typeof navigator !== 'undefined' && navigator.maxTouchPoints) || 0;

        await supabase.functions.invoke('track-visit', {
          body: {
            page_path: location.pathname,
            visitor_id: getVisitorId(),
            referrer: (typeof document !== 'undefined' && document.referrer) || null,
            screen_width: screenWidth,
            language: (typeof navigator !== 'undefined' && navigator.language) || null,
            user_agent: ua,
            device_type: detectDevice(ua, screenWidth, touchPoints),
            browser: detectBrowser(ua),
            os: detectOS(ua),
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

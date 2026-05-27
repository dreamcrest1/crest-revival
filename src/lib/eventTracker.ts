// Lightweight client-side tracker for analytics events that bypass the edge function.
// Used for product views, WhatsApp clicks, checkout clicks, and search queries.

import { supabase } from '@/integrations/supabase/client';

const getVisitorId = (): string | null => {
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

const getUtm = (): Record<string, string> => {
  try {
    const raw = sessionStorage.getItem('dc_utm');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// Capture UTM params once per session (call from main.tsx)
export const captureUtmFromUrl = () => {
  try {
    const url = new URL(window.location.href);
    const utm: Record<string, string> = {};
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
      const v = url.searchParams.get(key);
      if (v) utm[key] = v.slice(0, 80);
    }
    if (Object.keys(utm).length) {
      sessionStorage.setItem('dc_utm', JSON.stringify(utm));
    }
  } catch { /* ignore */ }
};

export type TrackedEvent =
  | 'product_view'
  | 'whatsapp_click'
  | 'checkout_click'
  | 'add_to_cart'
  | 'tool_view'
  | 'tool_whatsapp_click'
  | 'search_query';

export const trackEvent = async (
  eventType: TrackedEvent,
  extra: Record<string, unknown> = {},
) => {
  try {
    const metadata = { ...getUtm(), ...extra };
    await supabase.from('site_analytics').insert([{
      event_type: eventType,
      page_path: window.location.pathname,
      visitor_id: getVisitorId() ?? undefined,
      metadata: metadata as Record<string, string>,
    }]);
  } catch { /* never break */ }
};

// Click tracking — 100% sampling so the heatmap actually has data to render.
let _lastClick = 0;
export const initClickTracking = () => {
  if (typeof window === 'undefined') return;
  const handler = (e: PointerEvent | MouseEvent) => {
    const now = Date.now();
    if (now - _lastClick < 250) return; // debounce
    _lastClick = now;
    if (window.location.pathname.startsWith('/admin')) return;
    const target = e.target as HTMLElement;
    if (!target) return;
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    const xPct = Math.round((e.clientX / w) * 10000) / 100;
    const yPct = Math.round((e.clientY / h) * 10000) / 100;
    void supabase.from('click_events').insert([{
      page_path: window.location.pathname,
      x_pct: xPct,
      y_pct: yPct,
      element_tag: target.tagName?.toLowerCase().slice(0, 16) || null,
      element_text: (target.textContent || '').trim().slice(0, 80) || null,
      viewport_w: window.innerWidth,
      visitor_id: getVisitorId() ?? undefined,
    }]);
  };
  window.addEventListener('pointerdown', handler, { passive: true });
};

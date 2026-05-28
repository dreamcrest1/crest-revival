import { useEffect } from 'react';
import { trackEvent } from '@/lib/eventTracker';

/**
 * Debounced tracker for search inputs. Fires a `search_query` analytics
 * event ~800ms after the user stops typing, so we capture intent without
 * spamming a row per keystroke.
 */
export const useTrackSearch = (query: string, source: string, delay = 800) => {
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const t = setTimeout(() => {
      void trackEvent('search_query', { query: q.slice(0, 120), source });
    }, delay);
    return () => clearTimeout(t);
  }, [query, source, delay]);
};

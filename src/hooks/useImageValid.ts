import { useEffect, useState } from 'react';

// Module-level cache so we don't re-test the same URL across renders/components.
const cache = new Map<string, boolean>();
const inflight = new Map<string, Promise<boolean>>();

function isValidUrl(u: string | null | undefined): u is string {
  if (!u) return false;
  try {
    const parsed = new URL(u, window.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function testImage(url: string): Promise<boolean> {
  if (cache.has(url)) return Promise.resolve(cache.get(url)!);
  if (inflight.has(url)) return inflight.get(url)!;

  const p = new Promise<boolean>((resolve) => {
    const img = new Image();
    let done = false;
    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      cache.set(url, ok);
      inflight.delete(url);
      resolve(ok);
    };
    img.onload = () => finish(img.naturalWidth > 0 && img.naturalHeight > 0);
    img.onerror = () => finish(false);
    // Safety timeout (8s)
    setTimeout(() => finish(false), 8000);
    img.src = url;
  });

  inflight.set(url, p);
  return p;
}

/**
 * Returns true while we don't yet know, then true/false once the image
 * either successfully decodes or errors out. Invalid URLs return false immediately.
 */
export function useImageValid(url: string | null | undefined) {
  const valid = isValidUrl(url);
  const cached = valid ? cache.get(url!) : false;
  const [state, setState] = useState<boolean | null>(
    !valid ? false : cached === undefined ? null : cached
  );

  useEffect(() => {
    if (!valid) {
      setState(false);
      return;
    }
    let mounted = true;
    testImage(url!).then((ok) => {
      if (mounted) setState(ok);
    });
    return () => {
      mounted = false;
    };
  }, [url, valid]);

  return state; // null = checking, true = good, false = broken
}

export function isLikelyValidLink(u: string | null | undefined) {
  return isValidUrl(u);
}

import { supabase } from '@/integrations/supabase/client';

type Payload = {
  error_type: string;
  message: string;
  stack?: string;
  page_url?: string;
  source?: string;
  line_no?: number;
  col_no?: number;
  user_agent?: string;
  visitor_id?: string;
  metadata?: Record<string, unknown>;
};

const queue: Payload[] = [];
let flushTimer: number | null = null;
const seen = new Map<string, number>();
const DEDUPE_MS = 30_000;

function visitorId(): string {
  try {
    let v = localStorage.getItem('dc_visitor_id');
    if (!v) {
      v = crypto.randomUUID();
      localStorage.setItem('dc_visitor_id', v);
    }
    return v;
  } catch { return 'unknown'; }
}

function shouldSkip(p: Payload): boolean {
  const key = `${p.error_type}|${p.message}|${p.source || ''}|${p.line_no || ''}`;
  const now = Date.now();
  const last = seen.get(key) || 0;
  if (now - last < DEDUPE_MS) return true;
  seen.set(key, now);
  if (seen.size > 200) {
    for (const [k, t] of seen) if (now - t > DEDUPE_MS * 4) seen.delete(k);
  }
  return false;
}

async function flush() {
  flushTimer = null;
  if (!queue.length) return;
  const batch = queue.splice(0, queue.length);
  try {
    await supabase.from('error_logs').insert(batch);
  } catch {
    // best-effort, do not throw
  }
}

function report(p: Payload) {
  p.page_url ||= location.href;
  p.user_agent ||= navigator.userAgent;
  p.visitor_id ||= visitorId();
  if (shouldSkip(p)) return;
  queue.push(p);
  if (queue.length > 25) void flush();
  else if (!flushTimer) flushTimer = window.setTimeout(() => void flush(), 2500);
}

let installed = false;

export function installErrorReporter() {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  window.addEventListener('error', (e) => {
    if ((e as ErrorEvent).error || (e as ErrorEvent).message) {
      report({
        error_type: 'window_error',
        message: String((e as ErrorEvent).message || 'Unknown error').slice(0, 2000),
        stack: ((e as ErrorEvent).error as Error | undefined)?.stack?.slice(0, 4000),
        source: (e as ErrorEvent).filename,
        line_no: (e as ErrorEvent).lineno,
        col_no: (e as ErrorEvent).colno,
      });
    }
  });

  window.addEventListener('unhandledrejection', (e) => {
    const r = (e as PromiseRejectionEvent).reason;
    const msg = r instanceof Error ? r.message : typeof r === 'string' ? r : JSON.stringify(r ?? 'unknown');
    report({
      error_type: 'unhandled_rejection',
      message: String(msg).slice(0, 2000),
      stack: r instanceof Error ? r.stack?.slice(0, 4000) : undefined,
    });
  });

  // Wrap console.error
  const origErr = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    try {
      const msg = args.map((a) => (a instanceof Error ? `${a.message}\n${a.stack}` : typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
      if (msg && !msg.includes('[hmr]') && !msg.includes('React DevTools')) {
        report({ error_type: 'console_error', message: msg.slice(0, 2000) });
      }
    } catch {}
    origErr(...args);
  };

  // WebGL context loss detection (delegated)
  window.addEventListener('webglcontextlost', (e) => {
    const tgt = e.target as HTMLCanvasElement | null;
    report({
      error_type: 'webgl_context_lost',
      message: 'WebGL context lost',
      metadata: { tag: tgt?.tagName, width: tgt?.width, height: tgt?.height },
    });
  }, true);

  window.addEventListener('webglcontextrestored', () => {
    report({ error_type: 'webgl_context_restored', message: 'WebGL context restored' });
  }, true);

  window.addEventListener('beforeunload', () => { void flush(); });
}

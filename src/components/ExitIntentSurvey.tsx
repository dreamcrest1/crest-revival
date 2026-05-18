import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';

const TRIGGER_PATHS = ['/products', '/all-tools', '/alltools', '/ai-tools'];
const KEY = 'dc_exit_shown';

const ExitIntentSurvey = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const armed = useRef(false);

  useEffect(() => {
    armed.current = TRIGGER_PATHS.some(p => pathname.startsWith(p));
    let shown = false;
    try { shown = sessionStorage.getItem(KEY) === '1'; } catch { /* */ }
    if (shown) armed.current = false;

    const onLeave = (e: MouseEvent) => {
      if (!armed.current) return;
      if (e.clientY > 0) return;
      armed.current = false;
      try { sessionStorage.setItem(KEY, '1'); } catch { /* */ }
      setOpen(true);
    };
    document.addEventListener('mouseout', onLeave);
    return () => document.removeEventListener('mouseout', onLeave);
  }, [pathname]);

  const submit = async () => {
    const m = message.trim();
    if (m.length < 2) return;
    try {
      await supabase.from('exit_feedback').insert([{ page_path: pathname, message: m.slice(0, 1000), visitor_id: localStorage.getItem('dc_visitor_id') }]);
      setSent(true);
      setTimeout(() => setOpen(false), 1400);
    } catch { setOpen(false); }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/70 backdrop-blur-sm animate-in fade-in" role="dialog">
      <div className="relative w-full max-w-md bg-card border border-primary/30 rounded-2xl shadow-2xl p-6">
        <button onClick={() => setOpen(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
        {sent ? (
          <div className="text-center py-4">
            <p className="font-display text-lg font-semibold">Thanks for telling us!</p>
            <p className="text-sm text-muted-foreground mt-1">We read every reply.</p>
          </div>
        ) : (
          <>
            <h3 className="font-display text-lg font-bold mb-1">Before you go…</h3>
            <p className="text-sm text-muted-foreground mb-4">What were you looking for? One line is enough — it really helps us add the right tools.</p>
            <textarea
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={400}
              placeholder="e.g. lifetime Notion plan under ₹500"
              className="w-full bg-background/60 border border-border rounded-lg p-3 text-sm focus:border-primary outline-none resize-none"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">No thanks</button>
              <button onClick={submit} disabled={message.trim().length < 2} className="px-4 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50">Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExitIntentSurvey;

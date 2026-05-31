import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Msg { role: 'user' | 'assistant'; content: string }

const LS_KEY = 'dc_chatbot_history_v1';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const StorefrontChatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as Msg[]) : [];
    } catch { return []; }
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify(msgs.slice(-50))); }, [msgs]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [msgs, open]);

  // hide on admin
  if (location.pathname.startsWith('/admin')) return null;

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const next = [...msgs, { role: 'user' as const, content: text }];
    setMsgs(next);
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/storefront-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      if (res.status === 429) throw new Error('Too many messages — please slow down a bit.');
      if (res.status === 402) throw new Error('AI quota reached. Please contact us on WhatsApp instead.');
      if (!res.ok) throw new Error('Chat failed. Please try again.');
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      setMsgs((m) => [...m, { role: 'assistant', content: '' }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split('\n')) {
          const data = line.startsWith('data: ') ? line.slice(6) : '';
          if (!data || data === '[DONE]') continue;
          try {
            const j = JSON.parse(data);
            const delta = j?.choices?.[0]?.delta?.content;
            if (delta) {
              assistantText += delta;
              setMsgs((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: 'assistant', content: assistantText };
                return copy;
              });
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong.';
      setMsgs((m) => [...m, { role: 'assistant', content: `⚠️ ${msg}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
          aria-label="Open AI chat"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-8rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
              <div>
                <div className="text-sm font-semibold">Castle Tools AI</div>
                <div className="text-[10px] text-emerald-400">● Online</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground" aria-label="Close"><X className="w-4 h-4" /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {msgs.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-8">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-primary/40" />
                Hi! Ask me about any tool, plan, or price.
                <div className="mt-3 space-y-1">
                  {['Cheapest AI writer?', 'Best Netflix plan?', 'What about Canva Pro?'].map((q) => (
                    <button key={q} onClick={() => setInput(q)} className="block w-full text-xs px-3 py-1.5 rounded-lg bg-secondary/40 hover:bg-secondary/70">{q}</button>
                  ))}
                </div>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block max-w-[85%] px-3 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-foreground'}`}>
                  {m.role === 'assistant' ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-a:text-primary">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content || '…'}</ReactMarkdown>
                    </div>
                  ) : m.content}
                </div>
              </div>
            ))}
            {loading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          </div>

          <div className="p-3 border-t border-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Type your question…"
              className="flex-1 bg-secondary/40 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button onClick={send} disabled={loading || !input.trim()} className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StorefrontChatbot;

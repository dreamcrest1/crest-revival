import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MousePointerClick, Camera, Flame, AlertTriangle } from 'lucide-react';

interface ClickRow { x_pct: number; y_pct: number; element_tag: string | null; element_text: string | null; viewport_w: number | null; visitor_id: string | null; created_at: string }

type Device = 'all' | 'desktop' | 'mobile';
const RANGES = { '7d': 7, '30d': 30, '90d': 90 } as const;
type RangeKey = keyof typeof RANGES;

const SCREENSHOT_KEY = (path: string) => `dc_admin_screen:${path}`;

const DEFAULT_PATHS = ['/', '/products', '/alltools', '/ai-tools', '/blog', '/about', '/contact', '/faq', '/terms', '/refunds'];

const renderHeatmap = (canvas: HTMLCanvasElement, clicks: ClickRow[]) => {
  const w = canvas.width, h = canvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);

  // Stamp soft radial gradient per click into alpha channel
  const stamp = document.createElement('canvas');
  const R = Math.max(24, Math.round(Math.min(w, h) * 0.04));
  stamp.width = stamp.height = R * 2;
  const sctx = stamp.getContext('2d')!;
  const grad = sctx.createRadialGradient(R, R, 0, R, R, R);
  grad.addColorStop(0, 'rgba(0,0,0,0.35)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, R * 2, R * 2);

  const acc = document.createElement('canvas');
  acc.width = w; acc.height = h;
  const actx = acc.getContext('2d')!;
  for (const c of clicks) {
    const x = (c.x_pct / 100) * w - R;
    const y = (c.y_pct / 100) * h - R;
    actx.drawImage(stamp, x, y);
  }

  const img = actx.getImageData(0, 0, w, h);
  const pixels = img.data;
  // Color map blue → green → yellow → red based on alpha
  for (let i = 0; i < pixels.length; i += 4) {
    const a = pixels[i + 3];
    if (a === 0) continue;
    const t = Math.min(1, a / 220);
    let r: number, g: number, b: number;
    if (t < 0.33) { const k = t / 0.33; r = 0; g = Math.round(120 + k * 135); b = Math.round(255 - k * 100); }
    else if (t < 0.66) { const k = (t - 0.33) / 0.33; r = Math.round(k * 255); g = 255; b = Math.round(155 - k * 155); }
    else { const k = (t - 0.66) / 0.34; r = 255; g = Math.round(255 - k * 220); b = 0; }
    pixels[i] = r; pixels[i + 1] = g; pixels[i + 2] = b;
    pixels[i + 3] = Math.min(220, a + 20);
  }
  ctx.putImageData(img, 0, 0);
};

const AdminHeatmap = () => {
  const [paths, setPaths] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [device, setDevice] = useState<Device>('all');
  const [range, setRange] = useState<RangeKey>('30d');
  const [clicks, setClicks] = useState<ClickRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('click_events')
        .select('page_path')
        .gte('created_at', new Date(Date.now() - RANGES[range] * 86400000).toISOString())
        .limit(5000);
      const set = new Set<string>(DEFAULT_PATHS);
      for (const r of (data as { page_path: string }[]) || []) set.add(r.page_path);
      const arr = [...set];
      setPaths(arr);
      setSelected((prev) => prev || arr[0] || '');
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  useEffect(() => {
    if (!selected) return;
    (async () => {
      const { data } = await supabase
        .from('click_events')
        .select('x_pct, y_pct, element_tag, element_text, viewport_w, visitor_id, created_at')
        .eq('page_path', selected)
        .gte('created_at', new Date(Date.now() - RANGES[range] * 86400000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5000);
      setClicks((data as ClickRow[]) || []);
    })();
    try { setScreenshot(localStorage.getItem(SCREENSHOT_KEY(selected))); } catch { setScreenshot(null); }
  }, [selected, range]);

  const filteredClicks = useMemo(() => {
    if (device === 'all') return clicks;
    return clicks.filter(c => {
      const w = c.viewport_w ?? 0;
      if (device === 'mobile') return w > 0 && w < 768;
      return w >= 768;
    });
  }, [clicks, device]);

  useEffect(() => {
    if (canvasRef.current) renderHeatmap(canvasRef.current, filteredClicks);
  }, [filteredClicks]);

  const topElements = useMemo(() => {
    const m: Record<string, { count: number; tag: string }> = {};
    for (const c of filteredClicks) {
      const text = (c.element_text || '').trim();
      if (!text) continue;
      const k = text.slice(0, 60);
      m[k] = { count: (m[k]?.count || 0) + 1, tag: c.element_tag || '' };
    }
    return Object.entries(m).sort((a, b) => b[1].count - a[1].count).slice(0, 15);
  }, [filteredClicks]);

  const rageClicks = useMemo(() => {
    // Same visitor, same element_text, ≥3 events within 1.2 s window
    const byVisitor: Record<string, ClickRow[]> = {};
    for (const c of filteredClicks) {
      if (!c.visitor_id) continue;
      (byVisitor[c.visitor_id] ||= []).push(c);
    }
    const hits: Record<string, number> = {};
    for (const list of Object.values(byVisitor)) {
      const sorted = [...list].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
      for (let i = 0; i < sorted.length - 2; i++) {
        const a = sorted[i], c = sorted[i + 2];
        if (a.element_text && a.element_text === c.element_text) {
          const ms = +new Date(c.created_at) - +new Date(a.created_at);
          if (ms <= 1200) hits[a.element_text.slice(0, 60)] = (hits[a.element_text.slice(0, 60)] || 0) + 1;
        }
      }
    }
    return Object.entries(hits).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [filteredClicks]);

  const captureScreenshot = async () => {
    if (!selected) return;
    setCapturing(true);
    try {
      // Lazy-load html2canvas only inside admin
      const { default: html2canvas } = await import('html2canvas');
      // Open the page in a hidden iframe, wait for load, capture
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;left:-10000px;top:0;width:1280px;height:900px;border:0;';
      const sep = selected.includes('?') ? '&' : '?';
      iframe.src = `${selected}${sep}nopreload=1`;
      document.body.appendChild(iframe);
      await new Promise<void>((res) => { iframe.onload = () => setTimeout(res, 3500); });
      const doc = iframe.contentDocument!;
      try { iframe.contentWindow?.scrollTo(0, 0); } catch { /* ignore */ }
      const canvas = await html2canvas(doc.body, { width: 1280, height: 900, scale: 0.7, backgroundColor: '#0f1014', useCORS: true });
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      try { localStorage.setItem(SCREENSHOT_KEY(selected), dataUrl); } catch { /* quota */ }
      setScreenshot(dataUrl);
      document.body.removeChild(iframe);
    } catch (e) {
      console.error('Screenshot failed', e);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><MousePointerClick className="w-6 h-6" /> Click heatmap</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={device} onValueChange={(v) => setDevice(v as Device)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All devices</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
            </SelectContent>
          </Select>
          <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="w-72"><SelectValue placeholder="Select a page" /></SelectTrigger>
            <SelectContent>
              {paths.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2"><CardContent className="p-4">
          {loading ? <p className="text-muted-foreground">Loading…</p> : paths.length === 0 ? (
            <p className="text-muted-foreground text-sm">No click events yet — they start appearing once visitors click around the site.</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{filteredClicks.length} clicks on <span className="text-foreground font-mono">{selected}</span></p>
                <Button size="sm" variant="outline" onClick={captureScreenshot} disabled={capturing}>
                  <Camera className="w-3.5 h-3.5 mr-1.5" /> {capturing ? 'Capturing…' : screenshot ? 'Refresh screenshot' : 'Capture page'}
                </Button>
              </div>
              <div className="relative w-full bg-secondary/20 rounded-lg overflow-hidden border border-border" style={{ aspectRatio: '16 / 11' }}>
                {screenshot && (
                  <img src={screenshot} alt="" className="absolute inset-0 w-full h-full object-cover object-top opacity-60" />
                )}
                <canvas
                  ref={canvasRef}
                  width={1280}
                  height={880}
                  className="absolute inset-0 w-full h-full mix-blend-screen"
                />
              </div>
            </>
          )}
        </CardContent></Card>

        <div className="space-y-4">
          {rageClicks.length > 0 && (
            <Card className="border-rose-500/40"><CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2 text-rose-400"><AlertTriangle className="w-4 h-4" /> Rage clicks detected</h3>
              <ul className="text-xs space-y-1">
                {rageClicks.map(([text, n]) => (
                  <li key={text} className="flex justify-between gap-2"><span className="truncate">{text}</span><span className="text-rose-400 font-semibold">{n}</span></li>
                ))}
              </ul>
              <p className="text-[10px] text-muted-foreground mt-2">Same visitor clicked the same element ≥3 times in 1.2 s — usually a broken or unresponsive control.</p>
            </CardContent></Card>
          )}

          <Card><CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Flame className="w-4 h-4 text-primary" /> Top clicked elements</h3>
            {topElements.length === 0 ? <p className="text-xs text-muted-foreground">No labelled clicks yet.</p> : (
              <ul className="text-xs space-y-1.5 max-h-[440px] overflow-y-auto">
                {topElements.map(([text, info]) => (
                  <li key={text} className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-mono bg-secondary/40 px-1 rounded">{info.tag || '?'}</span>
                    <span className="flex-1 truncate" title={text}>{text}</span>
                    <span className="text-primary font-semibold tabular-nums">{info.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent></Card>
        </div>
      </div>
    </div>
  );
};

export default AdminHeatmap;

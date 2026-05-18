import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MousePointerClick } from 'lucide-react';

interface ClickRow { x_pct: number; y_pct: number; element_tag: string | null; element_text: string | null }

const AdminHeatmap = () => {
  const [paths, setPaths] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [clicks, setClicks] = useState<ClickRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('click_events')
        .select('page_path')
        .gte('created_at', new Date(Date.now() - 30 * 86400 * 1000).toISOString())
        .limit(5000);
      const set = new Set<string>();
      for (const r of (data as { page_path: string }[]) || []) set.add(r.page_path);
      const arr = [...set];
      setPaths(arr);
      if (arr.length && !selected) setSelected(arr[0]);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selected) return;
    (async () => {
      const { data } = await supabase
        .from('click_events')
        .select('x_pct, y_pct, element_tag, element_text')
        .eq('page_path', selected)
        .order('created_at', { ascending: false })
        .limit(2000);
      setClicks((data as ClickRow[]) || []);
    })();
  }, [selected]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><MousePointerClick className="w-6 h-6" /> Click heatmap</h1>
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="w-72"><SelectValue placeholder="Select a page" /></SelectTrigger>
          <SelectContent>
            {paths.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card><CardContent className="p-4">
        {loading ? <p className="text-muted-foreground">Loading…</p> : paths.length === 0 ? (
          <p className="text-muted-foreground text-sm">No click events yet — they start appearing once visitors click around the site.</p>
        ) : (
          <>
            <div className="relative w-full aspect-video bg-secondary/20 rounded-lg overflow-hidden border border-border">
              {clicks.map((c, i) => (
                <div
                  key={i}
                  className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/30 border border-red-400/50"
                  style={{ left: `${c.x_pct}%`, top: `${c.y_pct}%` }}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">{clicks.length} clicks tracked on this path</p>
          </>
        )}
      </CardContent></Card>
    </div>
  );
};

export default AdminHeatmap;

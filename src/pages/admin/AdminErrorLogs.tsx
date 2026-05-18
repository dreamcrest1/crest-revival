import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ErrorLog {
  id: string;
  created_at: string;
  error_type: string;
  message: string;
  stack: string | null;
  page_url: string | null;
  source: string | null;
  line_no: number | null;
  col_no: number | null;
  user_agent: string | null;
  visitor_id: string | null;
}

const TYPE_COLORS: Record<string, string> = {
  window_error: 'destructive',
  unhandled_rejection: 'destructive',
  console_error: 'secondary',
  webgl_context_lost: 'destructive',
  webgl_context_restored: 'default',
};

const AdminErrorLogs = () => {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    let q = supabase.from('error_logs').select('*').order('created_at', { ascending: false }).limit(500);
    if (filter !== 'all') q = q.eq('error_type', filter);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    else setLogs((data || []) as ErrorLog[]);
    setLoading(false);
  };

  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [filter]);

  useEffect(() => {
    const ch = supabase.channel('error_logs_live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'error_logs' }, (payload) => {
        setLogs((prev) => [payload.new as ErrorLog, ...prev].slice(0, 500));
      })
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, []);

  const clearAll = async () => {
    if (!confirm('Delete ALL error logs?')) return;
    const { error } = await supabase.from('error_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) toast.error(error.message);
    else { toast.success('Cleared'); void load(); }
  };

  const counts = logs.reduce((acc, l) => { acc[l.error_type] = (acc[l.error_type] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Client Error Logs</h1>
          <p className="text-muted-foreground mt-1">Realtime errors from visitors' browsers (window errors, promise rejections, console errors, WebGL context loss).</p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="window_error">Window errors</SelectItem>
              <SelectItem value="unhandled_rejection">Unhandled rejections</SelectItem>
              <SelectItem value="console_error">Console errors</SelectItem>
              <SelectItem value="webgl_context_lost">WebGL context lost</SelectItem>
              <SelectItem value="webgl_context_restored">WebGL restored</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={load} disabled={loading}><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></Button>
          <Button variant="outline" size="icon" onClick={clearAll}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{logs.length}</div><p className="text-xs text-muted-foreground">Showing</p></CardContent></Card>
        {Object.entries(counts).slice(0, 4).map(([t, c]) => (
          <Card key={t}><CardContent className="pt-6"><div className="text-2xl font-bold">{c}</div><p className="text-xs text-muted-foreground">{t}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Recent errors</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {logs.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground py-6 text-center">No errors logged. (That's a good thing!)</p>
          )}
          {logs.map((l) => (
            <div key={l.id} className="border border-border/50 rounded-md p-3 hover:bg-muted/30 transition-colors">
              <button onClick={() => setOpenId(openId === l.id ? null : l.id)} className="w-full text-left">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                    <Badge variant={(TYPE_COLORS[l.error_type] || 'secondary') as 'default' | 'destructive' | 'secondary'}>{l.error_type}</Badge>
                    <span className="text-sm font-mono truncate">{l.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{new Date(l.created_at).toLocaleString()}</span>
                </div>
                {l.page_url && <div className="text-xs text-muted-foreground mt-1 truncate">{l.page_url}</div>}
              </button>
              {openId === l.id && (
                <div className="mt-3 pt-3 border-t border-border/50 space-y-2 text-xs">
                  {l.source && <div><span className="text-muted-foreground">Source:</span> <span className="font-mono">{l.source}{l.line_no ? `:${l.line_no}` : ''}{l.col_no ? `:${l.col_no}` : ''}</span></div>}
                  {l.stack && <pre className="bg-muted p-2 rounded overflow-auto font-mono whitespace-pre-wrap max-h-60">{l.stack}</pre>}
                  {l.user_agent && <div className="text-muted-foreground break-all">{l.user_agent}</div>}
                  {l.visitor_id && <div className="text-muted-foreground">visitor: {l.visitor_id}</div>}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminErrorLogs;

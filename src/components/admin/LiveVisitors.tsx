import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Smartphone, Monitor, Tablet, Globe, MapPin, Wifi } from 'lucide-react';

type Visit = {
  id: string;
  page_path: string;
  visitor_id: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  ip_address: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  referrer: string | null;
  language: string | null;
  user_agent: string | null;
  created_at: string;
};

const DeviceIcon = ({ type }: { type: string | null }) => {
  if (type === 'mobile') return <Smartphone className="w-4 h-4" />;
  if (type === 'tablet') return <Tablet className="w-4 h-4" />;
  if (type === 'desktop') return <Monitor className="w-4 h-4" />;
  return <Globe className="w-4 h-4" />;
};

const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

// Fallbacks derived from user_agent for legacy rows that didn't store these fields
const deviceFromUA = (ua: string | null): string => {
  if (!ua) return 'unknown';
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return 'tablet';
  if (/Mobi|Android|iPhone|iPod|Opera Mini|IEMobile/i.test(ua)) return 'mobile';
  return 'desktop';
};
const browserFromUA = (ua: string | null): string => {
  if (!ua) return '—';
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/OPR\/|Opera/i.test(ua)) return 'Opera';
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return 'Chrome';
  if (/Firefox\//i.test(ua)) return 'Firefox';
  if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
  return 'Other';
};
const osFromUA = (ua: string | null): string => {
  if (!ua) return '—';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Mac OS X/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Other';
};

const LiveVisitors = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('site_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      setVisits((data as Visit[]) || []);
    };
    load();

    const channel = supabase
      .channel('live-analytics')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'site_analytics' },
        (payload) => {
          setVisits((prev) => [payload.new as Visit, ...prev].slice(0, 50));
        }
      )
      .subscribe();

    const interval = setInterval(() => setTick((t) => t + 1), 15000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  // active = unique visitors in last 5 min
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  const activeVisitors = new Set(
    visits
      .filter((v) => new Date(v.created_at).getTime() > fiveMinAgo)
      .map((v) => v.visitor_id)
      .filter(Boolean)
  ).size;

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-display font-semibold text-foreground">Live Visitors</h3>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            {activeVisitors} active now
          </span>
        </div>
        <span className="text-xs text-muted-foreground">Last 50 visits · realtime</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-muted-foreground border-b border-border">
              <th className="py-2 pr-3 font-medium">Time</th>
              <th className="py-2 pr-3 font-medium">Page</th>
              <th className="py-2 pr-3 font-medium">Device</th>
              <th className="py-2 pr-3 font-medium">Browser / OS</th>
              <th className="py-2 pr-3 font-medium">Location</th>
              <th className="py-2 pr-3 font-medium">IP</th>
              <th className="py-2 pr-3 font-medium">Referrer</th>
            </tr>
          </thead>
          <tbody>
            {visits.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                  Waiting for visitors…
                </td>
              </tr>
            ) : (
              visits.map((v) => {
                const isLive = Date.now() - new Date(v.created_at).getTime() < 5 * 60 * 1000;
                let refHost = 'Direct';
                if (v.referrer) {
                  try { refHost = new URL(v.referrer).hostname; } catch { refHost = v.referrer; }
                }
                const loc = [v.city, v.region, v.country].filter(Boolean).join(', ') || '—';
                return (
                  <tr key={v.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-2 pr-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {isLive && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                        <span className="text-muted-foreground">{timeAgo(v.created_at)}</span>
                      </div>
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs text-foreground max-w-[180px] truncate" title={v.page_path}>
                      {v.page_path}
                    </td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-1.5 text-foreground capitalize">
                        <DeviceIcon type={v.device_type} />
                        {v.device_type || 'unknown'}
                      </div>
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground">
                      {v.browser || '—'} <span className="opacity-50">·</span> {v.os || '—'}
                    </td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground" title={loc}>
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="max-w-[160px] truncate">{loc}</span>
                      </div>
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Wifi className="w-3.5 h-3.5" />
                        {v.ip_address || '—'}
                      </div>
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground max-w-[140px] truncate" title={refHost}>
                      {refHost}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveVisitors;

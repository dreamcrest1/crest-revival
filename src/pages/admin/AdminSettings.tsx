import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, BarChart3 } from 'lucide-react';

const AdminSettings = () => {
  const [gaId, setGaId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'google_analytics')
        .maybeSingle();
      setGaId(((data?.value as any)?.measurement_id as string) || '');
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    const trimmed = gaId.trim();
    if (trimmed && !/^(G|UA|AW|DC)-[A-Z0-9-]+$/i.test(trimmed)) {
      toast.error('Invalid Measurement ID. Expected format: G-XXXXXXXXXX');
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .upsert(
        {
          key: 'google_analytics',
          value: { measurement_id: trimmed },
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' },
      );
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(trimmed ? 'Google Analytics enabled' : 'Google Analytics disabled');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage site-wide integrations.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Google Analytics
          </CardTitle>
          <CardDescription>
            Paste your GA4 Measurement ID to enable tracking site-wide. Leave empty to disable.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ga-id">Measurement ID</Label>
            <Input
              id="ga-id"
              placeholder="G-XXXXXXXXXX"
              value={gaId}
              onChange={(e) => setGaId(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Find this in Google Analytics → Admin → Data Streams → your web stream.
            </p>
          </div>
          <Button onClick={save} disabled={loading || saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;

ALTER TABLE public.site_analytics
  ADD COLUMN IF NOT EXISTS ip_address text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS region text;

ALTER PUBLICATION supabase_realtime ADD TABLE public.site_analytics;
ALTER TABLE public.site_analytics REPLICA IDENTITY FULL;
ALTER TABLE public.site_analytics
  ADD COLUMN IF NOT EXISTS device_type text,
  ADD COLUMN IF NOT EXISTS browser text,
  ADD COLUMN IF NOT EXISTS os text,
  ADD COLUMN IF NOT EXISTS screen_width integer,
  ADD COLUMN IF NOT EXISTS language text,
  ADD COLUMN IF NOT EXISTS country text;

CREATE INDEX IF NOT EXISTS idx_analytics_device ON public.site_analytics (device_type);
CREATE INDEX IF NOT EXISTS idx_analytics_visitor ON public.site_analytics (visitor_id);
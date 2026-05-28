CREATE INDEX IF NOT EXISTS idx_site_analytics_event_type ON public.site_analytics (event_type);
CREATE INDEX IF NOT EXISTS idx_site_analytics_created_at ON public.site_analytics (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_analytics_event_type_created_at ON public.site_analytics (event_type, created_at DESC);
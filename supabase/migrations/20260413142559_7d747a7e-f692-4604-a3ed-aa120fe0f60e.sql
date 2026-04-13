
DROP POLICY "Anyone can insert analytics" ON public.site_analytics;

CREATE POLICY "Anyone can insert analytics with valid data"
  ON public.site_analytics FOR INSERT
  WITH CHECK (page_path IS NOT NULL AND page_path != '');

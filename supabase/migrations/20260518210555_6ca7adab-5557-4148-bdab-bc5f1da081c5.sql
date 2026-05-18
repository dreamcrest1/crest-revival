
CREATE TABLE IF NOT EXISTS public.daily_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  for_date DATE NOT NULL UNIQUE,
  summary_md TEXT NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.daily_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view daily insights" ON public.daily_insights FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert daily insights" ON public.daily_insights FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete daily insights" ON public.daily_insights FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.exit_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  message TEXT NOT NULL,
  visitor_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.exit_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit exit feedback" ON public.exit_feedback FOR INSERT TO public WITH CHECK (length(message) BETWEEN 2 AND 1000 AND length(page_path) < 500);
CREATE POLICY "Admins can view exit feedback" ON public.exit_feedback FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete exit feedback" ON public.exit_feedback FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.product_reviews
  ADD COLUMN IF NOT EXISTS sentiment TEXT,
  ADD COLUMN IF NOT EXISTS sentiment_summary TEXT;

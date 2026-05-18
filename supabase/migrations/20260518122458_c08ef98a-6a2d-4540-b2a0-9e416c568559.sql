CREATE TABLE public.error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  error_type text NOT NULL DEFAULT 'error',
  message text NOT NULL,
  stack text,
  page_url text,
  source text,
  line_no integer,
  col_no integer,
  user_agent text,
  visitor_id text,
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX idx_error_logs_created_at ON public.error_logs(created_at DESC);
CREATE INDEX idx_error_logs_type ON public.error_logs(error_type);

ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert error logs"
  ON public.error_logs FOR INSERT TO public
  WITH CHECK (message IS NOT NULL AND length(message) > 0 AND length(message) < 5000);

CREATE POLICY "Admins can view error logs"
  ON public.error_logs FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete error logs"
  ON public.error_logs FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
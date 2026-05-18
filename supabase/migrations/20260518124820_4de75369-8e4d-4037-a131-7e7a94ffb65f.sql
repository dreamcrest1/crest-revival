
-- blog_posts
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  body_markdown text NOT NULL DEFAULT '',
  cover_image_url text,
  seo_title text,
  seo_description text,
  og_image_url text,
  tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published posts" ON public.blog_posts
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can view all posts" ON public.blog_posts
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert posts" ON public.blog_posts
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update posts" ON public.blog_posts
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete posts" ON public.blog_posts
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- click_events
CREATE TABLE public.click_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path text NOT NULL,
  x_pct numeric(5,2) NOT NULL,
  y_pct numeric(5,2) NOT NULL,
  element_tag text,
  element_text text,
  viewport_w integer,
  visitor_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_click_events_path_time ON public.click_events(page_path, created_at DESC);
ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert click events" ON public.click_events
  FOR INSERT WITH CHECK (
    page_path IS NOT NULL AND length(page_path) < 500
    AND x_pct >= 0 AND x_pct <= 100
    AND y_pct >= 0 AND y_pct <= 100
    AND (element_text IS NULL OR length(element_text) < 300)
  );
CREATE POLICY "Admins can view click events" ON public.click_events
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- product SEO columns
ALTER TABLE public.products
  ADD COLUMN seo_title text,
  ADD COLUMN seo_description text,
  ADD COLUMN seo_keywords text,
  ADD COLUMN og_image_url text,
  ADD COLUMN image_alt text;

-- analytics metadata
ALTER TABLE public.site_analytics
  ADD COLUMN metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

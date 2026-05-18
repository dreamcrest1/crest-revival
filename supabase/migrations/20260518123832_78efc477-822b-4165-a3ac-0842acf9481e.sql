CREATE TABLE public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  body text NOT NULL,
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en','hinglish')),
  is_approved boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  verified_buyer boolean NOT NULL DEFAULT false,
  city text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_reviews_product ON public.product_reviews(product_id);
CREATE INDEX idx_product_reviews_approved ON public.product_reviews(is_approved, created_at DESC);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews"
  ON public.product_reviews FOR SELECT TO public
  USING (is_approved = true);

CREATE POLICY "Admins can view all reviews"
  ON public.product_reviews FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can submit a review"
  ON public.product_reviews FOR INSERT TO public
  WITH CHECK (
    length(author_name) BETWEEN 2 AND 60
    AND length(body) BETWEEN 10 AND 2000
    AND rating BETWEEN 1 AND 5
    AND is_approved = false
    AND is_featured = false
  );

CREATE POLICY "Admins can update reviews"
  ON public.product_reviews FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete reviews"
  ON public.product_reviews FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_product_reviews_updated_at
  BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE VIEW public.product_rating_stats
WITH (security_invoker = true)
AS
SELECT
  product_id,
  COUNT(*)::int AS review_count,
  ROUND(AVG(rating)::numeric, 2) AS avg_rating,
  COUNT(*) FILTER (WHERE rating = 5)::int AS count_5,
  COUNT(*) FILTER (WHERE rating = 4)::int AS count_4,
  COUNT(*) FILTER (WHERE rating = 3)::int AS count_3,
  COUNT(*) FILTER (WHERE rating = 2)::int AS count_2,
  COUNT(*) FILTER (WHERE rating = 1)::int AS count_1
FROM public.product_reviews
WHERE is_approved = true
GROUP BY product_id;

GRANT SELECT ON public.product_rating_stats TO anon, authenticated;
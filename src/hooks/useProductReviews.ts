import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProductReview {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string;
  language: 'en' | 'hinglish';
  is_approved: boolean;
  is_featured: boolean;
  verified_buyer: boolean;
  city: string | null;
  created_at: string;
}

export interface RatingStats {
  product_id: string;
  review_count: number;
  avg_rating: number;
  count_5: number;
  count_4: number;
  count_3: number;
  count_2: number;
  count_1: number;
}

export const useProductReviews = (productId: string | undefined) =>
  useQuery({
    queryKey: ['product-reviews', productId],
    enabled: !!productId,
    queryFn: async (): Promise<ProductReview[]> => {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId!)
        .eq('is_approved', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as ProductReview[];
    },
  });

export const useRatingStats = (productId: string | undefined) =>
  useQuery({
    queryKey: ['product-rating-stats', productId],
    enabled: !!productId,
    queryFn: async (): Promise<RatingStats | null> => {
      const { data, error } = await supabase
        .from('product_rating_stats' as never)
        .select('*')
        .eq('product_id', productId!)
        .maybeSingle();
      if (error) throw error;
      return (data || null) as RatingStats | null;
    },
  });

export const useAllRatingStats = () =>
  useQuery({
    queryKey: ['all-rating-stats'],
    staleTime: 60_000,
    queryFn: async (): Promise<Record<string, RatingStats>> => {
      const { data, error } = await supabase
        .from('product_rating_stats' as never)
        .select('*');
      if (error) throw error;
      const map: Record<string, RatingStats> = {};
      for (const r of (data || []) as RatingStats[]) map[r.product_id] = r;
      return map;
    },
  });

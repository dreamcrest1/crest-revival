import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  discount: string;
  category: string;
  emoji: string;
  image: string;
  buyLink: string;
  isHotSelling?: boolean;
};

export type CategoryInfo = {
  name: string;
  emoji: string;
  count: number;
};

const categoryEmojis: Record<string, string> = {
  'AI Tools': '🤖',
  'Writing Tools': '✍️',
  'Video Editing': '🎬',
  'Indian OTT': '📺',
  'International OTT': '🌍',
  'SEO': '🔍',
  'VPN': '🔐',
  'Lead Generation': '👥',
  'Cloud Services': '☁️',
  'Design Tools': '🎨',
  'Software': '💻',
  'Other': '📦',
};

function calcDiscount(price: number, original: number | null): string {
  if (!original || original <= price) return '';
  const pct = Math.round(((original - price) / original) * 100);
  return `${pct}% OFF`;
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      const products: Product[] = (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        price: `₹${p.price}`,
        originalPrice: p.original_price ? `₹${p.original_price}` : '',
        discount: calcDiscount(p.price, p.original_price),
        category: p.category,
        emoji: categoryEmojis[p.category] || '📦',
        image: p.image_url || '/placeholder.svg',
        buyLink: p.buy_link,
        isHotSelling: (p as { is_hot_selling?: boolean }).is_hot_selling ?? false,
      }));

      // Build categories from actual data
      const catMap = new Map<string, number>();
      products.forEach((p) => {
        catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
      });
      const categories: CategoryInfo[] = Array.from(catMap.entries()).map(([name, count]) => ({
        name,
        emoji: categoryEmojis[name] || '📦',
        count,
      }));

      const hotSelling = products.filter((p) => p.isHotSelling);

      return { products, categories, hotSelling };
    },
  });
}

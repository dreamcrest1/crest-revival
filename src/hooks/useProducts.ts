import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { staticProducts, type StaticProductRow } from '@/data/staticProducts';
import { PAYMENT_URL } from '@/config/payment';

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

type RawRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  image_url: string | null;
  buy_link: string;
  is_hot_selling?: boolean;
};

function mapRows(rows: RawRow[]) {
  const products: Product[] = rows.map((p) => ({
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
    isHotSelling: p.is_hot_selling ?? false,
  }));

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
}

function buildFallback() {
  const rows: RawRow[] = staticProducts.map((p: StaticProductRow) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    original_price: p.original_price,
    category: p.category,
    image_url: p.image_url,
    buy_link: p.buy_link,
    is_hot_selling: p.is_hot_selling,
  }));
  return { ...mapRows(rows), source: 'fallback' as const };
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    retry: 2,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        if (!data || data.length === 0) {
          return buildFallback();
        }

        return { ...mapRows(data as RawRow[]), source: 'live' as const };
      } catch (err) {
        console.warn('[useProducts] Falling back to static snapshot:', err);
        return buildFallback();
      }
    },
  });
}

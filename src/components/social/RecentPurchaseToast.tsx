import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/useProducts';
import { CheckCircle2 } from 'lucide-react';

const NAMES = [
  'Rohit', 'Priya', 'Aman', 'Sneha', 'Karan', 'Pooja', 'Rahul', 'Ananya',
  'Vikram', 'Neha', 'Arjun', 'Riya', 'Siddharth', 'Tanvi', 'Aditya', 'Ishita',
  'Manish', 'Kavya', 'Yash', 'Meera', 'Harsh', 'Divya', 'Nikhil', 'Sara',
  'Aakash', 'Anjali', 'Dev', 'Simran', 'Ravi', 'Aisha', 'Sahil', 'Bhavya',
  'Gaurav', 'Naina', 'Mohit', 'Tara', 'Sameer', 'Zara', 'Varun', 'Khushi',
];

const CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata',
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Surat', 'Indore', 'Nagpur', 'Chandigarh',
  'Bhopal', 'Patna', 'Vadodara', 'Coimbatore', 'Kochi', 'Visakhapatnam',
  'Noida', 'Gurgaon', 'Faridabad', 'Thane', 'Ranchi',
];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const RecentPurchaseToast = () => {
  const { data } = useProducts();
  const products = data?.products ?? [];
  const location = useLocation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = location.pathname.startsWith('/admin');
  }, [location.pathname]);

  useEffect(() => {
    if (products.length === 0) return;

    const fire = () => {
      if (pausedRef.current || document.hidden) {
        schedule(20000);
        return;
      }
      const name = pick(NAMES);
      const city = pick(CITIES);
      const product = pick(products);
      const minsAgo = 1 + Math.floor(Math.random() * 8);
      toast(
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            {name[0]}
          </div>
          <div className="text-xs leading-tight">
            <div className="font-semibold text-foreground">
              {name} from {city}
            </div>
            <div className="text-muted-foreground">
              just ordered <span className="text-primary font-medium">{product.name}</span>
            </div>
            <div className="text-[10px] text-muted-foreground/70 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {minsAgo} min ago · Verified
            </div>
          </div>
        </div>,
        { duration: 5000, position: 'bottom-left' },
      );
      schedule(35000 + Math.random() * 55000);
    };

    const schedule = (ms: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(fire, ms);
    };

    schedule(18000); // first toast after 18s
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [products]);

  return null;
};

export default RecentPurchaseToast;

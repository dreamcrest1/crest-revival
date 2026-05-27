import { supabase } from '@/integrations/supabase/client';

export type CheckoutItem = {
  id: string;
  name: string;
  price: string;
  quantity: number;
};

export type CheckoutCustomer = {
  firstname: string;
  email: string;
  phone: string;
};

export const newOrderId = () =>
  'order_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export async function initPaypurPayment(args: {
  orderId: string;
  amount: number;
  items: CheckoutItem[];
  customer: CheckoutCustomer;
}): Promise<{ pay_url: string; order_id: string }> {
  const { data, error } = await supabase.functions.invoke('paypur-init', {
    body: { ...args, origin: window.location.origin },
  });
  if (error) throw new Error(error.message || 'Payment init failed');
  if (!data?.ok || !data?.pay_url) throw new Error(data?.error || 'Payment init failed');
  return { pay_url: data.pay_url, order_id: data.order_id };
}

export async function verifyPaypurOrder(query: Record<string, string>) {
  const { data, error } = await supabase.functions.invoke('paypur-verify', { body: query });
  if (error) throw new Error(error.message || 'Verification failed');
  if (!data?.ok) throw new Error(data?.error || 'Verification failed');
  return data.order as {
    order_id: string;
    txn_id: string | null;
    status: string;
    amount: number;
    items: CheckoutItem[];
    customer: CheckoutCustomer;
  };
}

const CUSTOMER_KEY = 'dc_customer';
export const loadSavedCustomer = (): Partial<CheckoutCustomer> => {
  try {
    return JSON.parse(localStorage.getItem(CUSTOMER_KEY) || '{}');
  } catch {
    return {};
  }
};
export const saveCustomer = (c: CheckoutCustomer) => {
  try { localStorage.setItem(CUSTOMER_KEY, JSON.stringify(c)); } catch { /* ignore */ }
};

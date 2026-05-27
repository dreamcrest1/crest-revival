
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id text NOT NULL UNIQUE,
  txn_id text,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  customer jsonb NOT NULL DEFAULT '{}'::jsonb,
  pay_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_order_id ON public.orders(order_id);

GRANT SELECT, INSERT ON public.orders TO anon;
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert orders"
ON public.orders FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'pending');

CREATE POLICY "Anyone can view orders by id"
ON public.orders FOR SELECT
TO anon, authenticated
USING (true);

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

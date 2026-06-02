-- Fix: remove broad public SELECT on orders, add admin SELECT, tighten has_role exposure

-- 1. Orders: remove the policy that lets anyone read every order
DROP POLICY IF EXISTS "Anyone can view orders by id" ON public.orders;

-- Allow admins to view all orders (used by AdminOrders page)
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Tighten the SECURITY DEFINER helper so anon/authenticated can't call it via RPC.
--    RLS policy expressions still evaluate it (postgres role), so existing policies keep working.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
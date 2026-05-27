CREATE OR REPLACE FUNCTION public._tmp_admin_email() RETURNS text
LANGUAGE sql SECURITY DEFINER SET search_path = auth, public AS $$
  SELECT email FROM auth.users WHERE id = '0325d0c2-f071-435c-bac4-e370e505159f'
$$;
REVOKE ALL ON FUNCTION public._tmp_admin_email() FROM public, anon, authenticated;
DO $$ BEGIN RAISE NOTICE 'ADMIN_EMAIL=%', public._tmp_admin_email(); END $$;
DROP FUNCTION public._tmp_admin_email();
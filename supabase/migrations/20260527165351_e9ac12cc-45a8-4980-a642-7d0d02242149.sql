-- Reset password for the admin user to a known temporary value.
-- Uses pgcrypto's crypt() with bcrypt, matching how Supabase Auth stores passwords.
UPDATE auth.users
SET
  encrypted_password = crypt('Dreamcrest@2026', gen_salt('bf')),
  updated_at = now()
WHERE id = '0325d0c2-f071-435c-bac4-e370e505159f';

-- Surface admin email so the user knows which account was reset.
DO $$
DECLARE
  v_email text;
BEGIN
  SELECT email INTO v_email FROM auth.users WHERE id = '0325d0c2-f071-435c-bac4-e370e505159f';
  RAISE NOTICE 'Admin email reset: %', v_email;
END $$;
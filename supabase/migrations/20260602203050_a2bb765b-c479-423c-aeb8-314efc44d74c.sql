-- Public direct-URL reads continue to work because the bucket is marked public
-- (that path bypasses RLS). The broad SELECT policy was only needed for the
-- listing/browse API, which is the exact thing the linter is warning about.
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;

-- Allow admins to list/manage objects via the API
CREATE POLICY "Admins can list product images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
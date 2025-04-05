-- Fix storage permissions for image uploads
-- This SQL script fixes the "new row violates row-level security policy" error

-- First, make sure the storage objects table has RLS enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they're causing issues
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;

-- Create a policy that allows authenticated users to upload any file
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create a policy that allows authenticated users to update their uploaded files
CREATE POLICY "Allow authenticated updates" 
ON storage.objects FOR UPDATE
TO authenticated
USING (true);

-- Create a policy that allows authenticated users to delete their uploaded files
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (true);

-- Create a policy that allows public read access to all files
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (true);

-- Create a policy specifically for the company-profiles path
CREATE POLICY "Allow company profile image uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public' AND (storage.foldername(name))[1] = 'company-profiles');

-- Log info about current policies
SELECT 
  policname,
  tablename,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM 
  pg_policies
WHERE 
  tablename = 'objects'
  AND schemaname = 'storage'; 
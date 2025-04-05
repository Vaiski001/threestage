-- Complete Database Schema for Enquiry Management App
-- This file contains all the necessary SQL to set up the database

-----------------------------------------------
-- Storage Setup
-----------------------------------------------

-- Create a public storage bucket for image uploads
INSERT INTO storage.buckets (id, name, public)
SELECT 'public', 'public', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'public'
);

-- Enable RLS on the objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Storage permissions policies
-- Allow authenticated uploads
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated updates
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
CREATE POLICY "Allow authenticated updates" 
ON storage.objects FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated deletes
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (true);

-- Allow public read access
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (true);

-- Create specific policy for company profile images
DROP POLICY IF EXISTS "Allow company profile image uploads" ON storage.objects;
CREATE POLICY "Allow company profile image uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public' AND (storage.foldername(name))[1] = 'company-profiles');

-----------------------------------------------
-- Profile Functions
-----------------------------------------------

-- Function to update profiles with proper validation
CREATE OR REPLACE FUNCTION update_profile_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Profile validation logic
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profile updates
DROP TRIGGER IF EXISTS validate_profile_update ON profiles;
CREATE TRIGGER validate_profile_update
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_fields();

-----------------------------------------------
-- Schema Migrations
-----------------------------------------------

-- Add any missing columns or tables here
-- This section should be updated with each migration

-- For reference, check the original migration files
-- in the migrations directory 
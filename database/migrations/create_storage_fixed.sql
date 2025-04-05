-- Create a public storage bucket if it doesn't exist
DO $$
BEGIN
  -- Check if the bucket already exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'public'
  ) THEN
    -- Create the bucket
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('public', 'public', true);
  END IF;
END $$;

-- Add RLS policies for the bucket
BEGIN;
  -- Allow authenticated uploads
  CREATE POLICY "Allow authenticated uploads"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'public');
  
  -- Allow authenticated deletes of own files
  CREATE POLICY "Allow authenticated deletes"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'public');
  
  -- Allow public read access
  CREATE POLICY "Allow public read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'public');
COMMIT; 
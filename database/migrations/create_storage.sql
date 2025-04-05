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
    
    -- Set a policy to allow authenticated users to upload files
    INSERT INTO storage.policies (name, bucket_id, operation, definition)
    VALUES 
      ('Allow authenticated uploads', 'public', 'INSERT', 
       '(auth.role() = ''authenticated'')'),
      ('Allow authenticated deletes', 'public', 'DELETE', 
       '(auth.role() = ''authenticated'')'),
      ('Allow public read', 'public', 'SELECT', 
       'true');
  END IF;
END $$; 
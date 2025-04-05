-- First, check the current column structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public';

-- Add profile_description if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'profile_description' AND table_schema = 'public'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_description TEXT;
  END IF;
END $$;

-- Add profile_branding if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'profile_branding' AND table_schema = 'public'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_branding JSONB;
  END IF;
END $$; 
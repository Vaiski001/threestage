-- Step 1: Let's check which columns actually exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public';

-- Step 2: Add missing columns if needed
DO $$ 
BEGIN
  -- Add profile_description if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'profile_description' AND table_schema = 'public'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_description TEXT;
  END IF;
END $$;

-- Step 3: Update our function to only deal with columns that actually exist
CREATE OR REPLACE FUNCTION patch_company_profile(
  user_id UUID,
  company_name TEXT DEFAULT NULL,
  industry TEXT DEFAULT NULL,
  profile_text TEXT DEFAULT NULL,  -- Using different parameter name to avoid confusion
  branding_json TEXT DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
  has_profile_description BOOLEAN;
BEGIN
  -- Check if profile_description column exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'profile_description' AND table_schema = 'public'
  ) INTO has_profile_description;

  -- Update only existing columns
  UPDATE profiles 
  SET
    company_name = COALESCE(company_name, profiles.company_name),
    industry = COALESCE(industry, profiles.industry),
    profile_branding = COALESCE(branding_json, profiles.profile_branding)
  WHERE 
    id = user_id;
    
  -- Handle profile_description separately if it exists
  IF has_profile_description AND profile_text IS NOT NULL THEN
    EXECUTE 'UPDATE profiles SET profile_description = $1 WHERE id = $2'
    USING profile_text, user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
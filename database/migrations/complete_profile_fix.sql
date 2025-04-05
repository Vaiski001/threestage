-- First, let's check the current column structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public';

-- Add all potentially missing columns
DO $$ 
BEGIN
  -- Add profile_description if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'profile_description' AND table_schema = 'public'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_description TEXT;
  END IF;

  -- Add profile_branding if it doesn't exist (for storing logo and banner)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'profile_branding' AND table_schema = 'public'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_branding JSONB;
  END IF;
  
  -- Add other columns that might be referenced in the code
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'profile_color_scheme' AND table_schema = 'public'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_color_scheme TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'profile_social_links' AND table_schema = 'public'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_social_links JSONB;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'profile_contact_info' AND table_schema = 'public'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_contact_info JSONB;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'profile_services_json' AND table_schema = 'public'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_services_json TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'profile_services' AND table_schema = 'public'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_services JSONB;
  END IF;
END $$;

-- Create a simplified, robust function for updating profiles
CREATE OR REPLACE FUNCTION update_company_profile(
  user_id UUID,
  p_data JSONB
) RETURNS JSONB AS $$
DECLARE
  columns_exist JSONB;
  update_columns TEXT[];
  update_values TEXT[];
  update_query TEXT;
  result JSONB;
BEGIN
  -- Get existing column information
  SELECT jsonb_object_agg(column_name, TRUE)
  FROM information_schema.columns
  WHERE table_name = 'profiles' AND table_schema = 'public'
  INTO columns_exist;
  
  -- Start building the update query
  update_query := 'UPDATE profiles SET ';
  
  -- Handle each potential field if it exists in the input and in the database
  FOR key, val IN SELECT * FROM jsonb_each(p_data)
  LOOP
    IF columns_exist ? key THEN
      update_columns := array_append(update_columns, key);
      update_values := array_append(update_values, val#>>'{}');
    END IF;
  END LOOP;
  
  -- Build the SET clause
  FOR i IN 1..array_length(update_columns, 1)
  LOOP
    IF i > 1 THEN
      update_query := update_query || ', ';
    END IF;
    update_query := update_query || update_columns[i] || ' = $' || i;
  END LOOP;
  
  -- Add WHERE clause
  update_query := update_query || ' WHERE id = $' || (array_length(update_columns, 1) + 1);
  update_values := array_append(update_values, user_id::text);
  
  -- Execute the query
  EXECUTE update_query USING VARIADIC update_values;
  
  -- Return success with updated field names
  SELECT jsonb_build_object(
    'success', TRUE, 
    'updated_fields', to_jsonb(update_columns)
  ) INTO result;
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', FALSE, 
    'error', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a specific function for the branding tab
CREATE OR REPLACE FUNCTION update_company_branding(
  user_id UUID,
  company_name TEXT DEFAULT NULL,
  industry TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  branding_json TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  data JSONB;
BEGIN
  -- Create a JSON object with all the provided data
  data := jsonb_build_object();
  
  IF company_name IS NOT NULL THEN
    data := data || jsonb_build_object('company_name', company_name);
  END IF;
  
  IF industry IS NOT NULL THEN
    data := data || jsonb_build_object('industry', industry);
  END IF;
  
  IF description IS NOT NULL THEN
    data := data || jsonb_build_object('profile_description', description);
  END IF;
  
  IF branding_json IS NOT NULL THEN
    data := data || jsonb_build_object('profile_branding', branding_json);
  END IF;
  
  -- Call the general update function
  RETURN update_company_profile(user_id, data);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
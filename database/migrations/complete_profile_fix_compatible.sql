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

-- Create a simpler function that works with older PostgreSQL versions
CREATE OR REPLACE FUNCTION update_company_branding(
  user_id UUID,
  company_name TEXT DEFAULT NULL,
  industry TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  branding_json TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  update_values TEXT[];
  update_query TEXT;
  columns_updated TEXT[];
  result JSONB;
BEGIN
  -- Build column updates only for non-null values
  update_query := 'UPDATE profiles SET ';
  
  IF company_name IS NOT NULL THEN
    update_query := update_query || 'company_name = $1, ';
    update_values := array_append(update_values, company_name);
    columns_updated := array_append(columns_updated, 'company_name');
  END IF;
  
  IF industry IS NOT NULL THEN
    update_query := update_query || 'industry = $' || (array_length(update_values, 1) + 1) || ', ';
    update_values := array_append(update_values, industry);
    columns_updated := array_append(columns_updated, 'industry');
  END IF;
  
  IF description IS NOT NULL THEN
    update_query := update_query || 'profile_description = $' || (array_length(update_values, 1) + 1) || ', ';
    update_values := array_append(update_values, description);
    columns_updated := array_append(columns_updated, 'profile_description');
  END IF;
  
  IF branding_json IS NOT NULL THEN
    update_query := update_query || 'profile_branding = $' || (array_length(update_values, 1) + 1) || ', ';
    update_values := array_append(update_values, branding_json);
    columns_updated := array_append(columns_updated, 'profile_branding');
  END IF;
  
  -- Remove trailing comma and space
  update_query := substring(update_query, 1, length(update_query) - 2);
  
  -- Add WHERE clause
  update_query := update_query || ' WHERE id = $' || (array_length(update_values, 1) + 1);
  update_values := array_append(update_values, user_id::text);
  
  -- Execute query if we have columns to update
  IF array_length(update_values, 1) > 1 THEN
    EXECUTE update_query USING VARIADIC update_values;
    
    -- Build success result
    SELECT jsonb_build_object(
      'success', TRUE,
      'updated_fields', to_jsonb(columns_updated)
    ) INTO result;
  ELSE
    -- No fields to update
    SELECT jsonb_build_object(
      'success', TRUE,
      'updated_fields', '[]'::jsonb,
      'message', 'No fields provided for update'
    ) INTO result;
  END IF;
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', FALSE,
    'error', SQLERRM,
    'query', update_query
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
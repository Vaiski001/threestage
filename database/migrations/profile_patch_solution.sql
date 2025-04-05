-- Create a function to update profile without using profile_banner
CREATE OR REPLACE FUNCTION patch_company_profile(
  user_id UUID,
  company_name TEXT DEFAULT NULL,
  industry TEXT DEFAULT NULL,
  profile_description TEXT DEFAULT NULL,
  branding_json TEXT DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
  update_query TEXT;
  update_values TEXT[];
BEGIN
  -- Start building the update query
  update_query := 'UPDATE profiles SET ';
  
  -- Add each non-null parameter to the query
  IF company_name IS NOT NULL THEN
    update_query := update_query || 'company_name = $1, ';
    update_values := array_append(update_values, company_name);
  END IF;
  
  IF industry IS NOT NULL THEN
    update_query := update_query || 'industry = $' || array_length(update_values, 1) + 1 || ', ';
    update_values := array_append(update_values, industry);
  END IF;
  
  IF profile_description IS NOT NULL THEN
    update_query := update_query || 'profile_description = $' || array_length(update_values, 1) + 1 || ', ';
    update_values := array_append(update_values, profile_description);
  END IF;
  
  IF branding_json IS NOT NULL THEN
    update_query := update_query || 'profile_branding = $' || array_length(update_values, 1) + 1 || ', ';
    update_values := array_append(update_values, branding_json);
  END IF;
  
  -- Remove the trailing comma and space
  update_query := substring(update_query, 1, length(update_query) - 2);
  
  -- Add the WHERE clause
  update_query := update_query || ' WHERE id = $' || array_length(update_values, 1) + 1;
  update_values := array_append(update_values, user_id::text);
  
  -- Execute the query
  EXECUTE update_query USING VARIADIC update_values;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
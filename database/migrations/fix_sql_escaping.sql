-- Create an improved update function for company branding
CREATE OR REPLACE FUNCTION update_company_branding(
  user_id UUID,
  company_name TEXT DEFAULT NULL,
  industry TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  branding_json TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  update_cols TEXT := '';
  fields_updated TEXT[];
  result JSONB;
BEGIN
  -- Start with empty arrays
  fields_updated := ARRAY[]::TEXT[];
  
  -- Build the fields list with parameters instead of string concatenation
  IF company_name IS NOT NULL THEN
    update_cols := update_cols || 'company_name = $1, ';
    fields_updated := array_append(fields_updated, 'company_name');
  END IF;
  
  IF industry IS NOT NULL THEN
    update_cols := update_cols || 'industry = $2, ';
    fields_updated := array_append(fields_updated, 'industry');
  END IF;
  
  IF description IS NOT NULL THEN
    update_cols := update_cols || 'profile_description = $3, ';
    fields_updated := array_append(fields_updated, 'profile_description');
  END IF;
  
  IF branding_json IS NOT NULL THEN
    update_cols := update_cols || 'profile_branding = $4::jsonb, ';
    fields_updated := array_append(fields_updated, 'profile_branding');
  END IF;
  
  -- If we have fields to update
  IF length(update_cols) > 0 THEN
    -- Remove trailing comma and space
    update_cols := substring(update_cols, 1, length(update_cols) - 2);
    
    -- Directly execute the update with parameters
    EXECUTE 'UPDATE profiles SET ' || update_cols || ' WHERE id = $5'
    USING 
      company_name,
      industry,
      description,
      branding_json,
      user_id;
    
    -- Return success result
    SELECT jsonb_build_object(
      'success', TRUE,
      'updated_fields', to_jsonb(fields_updated)
    ) INTO result;
    
    RETURN result;
  ELSE
    -- No fields to update
    RETURN jsonb_build_object(
      'success', TRUE,
      'message', 'No fields provided for update'
    );
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Return error details
  RETURN jsonb_build_object(
    'success', FALSE,
    'error', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
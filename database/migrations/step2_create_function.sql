-- Create a simpler update function for company branding
CREATE OR REPLACE FUNCTION update_company_branding(
  user_id UUID,
  company_name TEXT DEFAULT NULL,
  industry TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  branding_json TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  update_query TEXT;
  fields_updated TEXT[];
BEGIN
  -- Start the update query
  update_query := 'UPDATE profiles SET ';
  fields_updated := ARRAY[]::TEXT[];
  
  -- Only include non-null fields
  IF company_name IS NOT NULL THEN
    update_query := update_query || 'company_name = ''' || company_name || ''', ';
    fields_updated := array_append(fields_updated, 'company_name');
  END IF;
  
  IF industry IS NOT NULL THEN
    update_query := update_query || 'industry = ''' || industry || ''', ';
    fields_updated := array_append(fields_updated, 'industry');
  END IF;
  
  IF description IS NOT NULL THEN
    update_query := update_query || 'profile_description = ''' || description || ''', ';
    fields_updated := array_append(fields_updated, 'profile_description');
  END IF;
  
  IF branding_json IS NOT NULL THEN
    update_query := update_query || 'profile_branding = ''' || branding_json || '''::jsonb, ';
    fields_updated := array_append(fields_updated, 'profile_branding');
  END IF;
  
  -- Remove trailing comma and space
  IF array_length(fields_updated, 1) > 0 THEN
    update_query := substring(update_query, 1, length(update_query) - 2);
    update_query := update_query || ' WHERE id = ''' || user_id || '''';
    
    -- Execute the update
    EXECUTE update_query;
    
    RETURN jsonb_build_object(
      'success', TRUE,
      'updated_fields', to_jsonb(fields_updated)
    );
  ELSE
    -- No fields to update
    RETURN jsonb_build_object(
      'success', TRUE,
      'message', 'No fields to update'
    );
  END IF;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', FALSE,
    'error', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
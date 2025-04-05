-- Create a function to update profile without using profile_banner (compatible with older PostgreSQL)
CREATE OR REPLACE FUNCTION patch_company_profile(
  user_id UUID,
  company_name TEXT DEFAULT NULL,
  industry TEXT DEFAULT NULL,
  profile_description TEXT DEFAULT NULL,
  branding_json TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  -- Only update the specified fields
  UPDATE profiles 
  SET
    company_name = COALESCE(company_name, profiles.company_name),
    industry = COALESCE(industry, profiles.industry),
    profile_description = COALESCE(profile_description, profiles.profile_description),
    profile_branding = COALESCE(branding_json, profiles.profile_branding)
  WHERE 
    id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
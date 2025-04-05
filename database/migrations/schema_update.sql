-- SQL script to add profile_branding column
-- Run this in Supabase SQL editor

-- First check if column already exists to avoid errors
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'profile_branding'
    ) THEN
        -- Add the column if it doesn't exist
        ALTER TABLE profiles 
        ADD COLUMN profile_branding JSONB DEFAULT NULL;
        
        -- Update any existing rows to initialize the profile_branding field
        -- based on existing logo and banner values
        UPDATE profiles
        SET profile_branding = jsonb_build_object(
            'logo', profile_logo,
            'banner', profile_banner
        )
        WHERE profile_logo IS NOT NULL OR profile_banner IS NOT NULL;
    END IF;
END
$$; 
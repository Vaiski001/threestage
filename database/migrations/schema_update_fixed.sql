-- SQL script to add profile_branding column (simplified)
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
    END IF;
END
$$; 
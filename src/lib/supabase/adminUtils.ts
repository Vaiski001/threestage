import { supabase } from "./index";

/**
 * Admin-only utility functions for Supabase
 * 
 * IMPORTANT: These functions should only be used by administrators
 * with proper Supabase credentials in server-side code or secure
 * admin-only routes.
 */

/**
 * Run a SQL query directly on Supabase (requires admin rights)
 * @param sql The SQL query to execute
 * @returns Result of the query or error message
 */
export const runAdminSQL = async (sql: string): Promise<{success: boolean, result?: any, error?: string}> => {
  try {
    // This uses the rpc method that should be defined in Supabase SQL editor:
    // CREATE OR REPLACE FUNCTION run_admin_sql(query text) RETURNS json AS $$
    // BEGIN
    //   RETURN (SELECT json_agg(t) FROM (EXECUTE query) t);
    // EXCEPTION WHEN OTHERS THEN
    //   RETURN json_build_object('error', SQLERRM);
    // END;
    // $$ LANGUAGE plpgsql SECURITY DEFINER;
    const { data, error } = await supabase.rpc("run_admin_sql", { query: sql });
    
    if (error) {
      console.error("Error running admin SQL:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, result: data };
  } catch (err: any) {
    console.error("Exception running admin SQL:", err);
    return { success: false, error: err.message };
  }
};

/**
 * Create the storage bucket and policies in Supabase
 * @returns Success/failure status with details
 */
export const createStorageBucketAndPolicies = async (): Promise<{success: boolean, message: string}> => {
  try {
    const sql = `
-- Step 1: Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'public', 'public', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'public'
);

-- Step 2: Enable RLS on the objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 3: Create permissive storage policies
-- Allow authenticated uploads
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated updates
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
CREATE POLICY "Allow authenticated updates" 
ON storage.objects FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated deletes
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (true);

-- Allow public read access
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (true);

-- Create specific policy for company profile images
DROP POLICY IF EXISTS "Allow company profile image uploads" ON storage.objects;
CREATE POLICY "Allow company profile image uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public' AND (storage.foldername(name))[1] = 'company-profiles');

SELECT id, name, public FROM storage.buckets WHERE id = 'public';
`;

    const result = await runAdminSQL(sql);
    
    if (!result.success) {
      return {
        success: false,
        message: `Failed to create storage bucket: ${result.error}`
      };
    }
    
    return {
      success: true,
      message: "Storage bucket and policies created successfully"
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Exception creating storage bucket: ${err.message}`
    };
  }
};

/**
 * List all storage buckets
 * @returns List of storage buckets or error message
 */
export const listStorageBuckets = async (): Promise<{success: boolean, buckets?: any[], error?: string}> => {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error listing buckets:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, buckets: data };
  } catch (err: any) {
    console.error("Exception listing buckets:", err);
    return { success: false, error: err.message };
  }
}; 
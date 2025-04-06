import { supabase } from "./index";

/**
 * Checks if the 'public' storage bucket exists in Supabase
 * @returns {Promise<boolean>} True if bucket exists, false otherwise
 */
export const checkStorageBucket = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.getBucket('public');
    if (error) {
      console.error("Storage bucket check failed:", error.message);
      return false;
    }
    return !!data;
  } catch (err: any) {
    console.error("Storage bucket check exception:", err.message);
    return false;
  }
};

/**
 * Creates the 'public' storage bucket in Supabase if it doesn't exist
 * Note: This requires admin privileges and may not work in client-side code
 * depending on your Supabase setup.
 * 
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export const createStorageBucket = async (): Promise<boolean> => {
  try {
    // First check if bucket already exists
    const bucketExists = await checkStorageBucket();
    if (bucketExists) {
      console.log("Storage bucket already exists");
      return true;
    }

    // Create the bucket
    const { data, error } = await supabase.storage.createBucket('public', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/*']
    });

    if (error) {
      console.error("Failed to create storage bucket:", error.message);
      return false;
    }

    console.log("Storage bucket created successfully");
    return true;
  } catch (err: any) {
    console.error("Storage bucket creation exception:", err.message);
    return false;
  }
};

/**
 * Run this on app initialization to check and create storage bucket if needed
 * Note: May require admin privileges
 */
export const ensureStorageBucketExists = async (): Promise<void> => {
  const bucketExists = await checkStorageBucket();
  
  if (!bucketExists) {
    console.warn("Storage bucket 'public' does not exist, attempting to create it");
    const created = await createStorageBucket();
    
    if (!created) {
      console.error(
        "Could not create storage bucket. " +
        "You'll need to create it manually in the Supabase dashboard with SQL."
      );
    }
  }
}; 
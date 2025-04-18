import { createClient } from '@supabase/supabase-js';
import { SupabaseDatabase } from './types';

// Initialize Supabase client with typed interface
// Use a more TypeScript-friendly approach for environment variables
// This uses string literals directly which will be replaced by Vite at build time
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Track fixed URLs to avoid duplicate console warnings
const fixedUrls = new Set<string>();

// Custom fetch function to ensure URLs always have proper https:// scheme
const customFetch = (url: RequestInfo | URL, init?: RequestInit) => {
  // If url is a string and missing proper https:// scheme, fix it
  if (typeof url === 'string' && !url.match(/^https?:\/\//)) {
    // Only log in development mode and only once per unique URL
    const isDev = import.meta.env.DEV;
    
    // Fix URL
    let fixedUrl = url;
    if (url.startsWith('ttps://')) {
      fixedUrl = 'https://' + url.substring(7);
    } else if (!url.includes('://')) {
      fixedUrl = 'https://' + url;
    }
    
    // Log only in dev mode and only for new URLs
    if (isDev && !fixedUrls.has(url)) {
      fixedUrls.add(url);
      console.warn('Fixing malformed URL:', url);
    }
    
    return fetch(fixedUrl, init);
  }
  
  return fetch(url, init);
};

// Function to create and return a new Supabase client
export const createSupabaseClient = () => {
  return createClient<SupabaseDatabase>(
    supabaseUrl || 'https://placeholder-url.supabase.co', 
    supabaseAnonKey || 'placeholder-key',
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
      global: {
        fetch: customFetch
      }
    }
  );
};

// Create client with types
export const supabase = createSupabaseClient();

// Helper function to check if Supabase is available
export const isSupabaseAvailable = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey;
};

// Display a warning in development, but don't crash the app
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anonymous Key is missing in environment variables. Some features may not work correctly.');
}

// Helper function to get service status
export const getServiceStatus = async (): Promise<{
  isAvailable: boolean;
  message: string;
}> => {
  // Track if we've already checked service status to avoid duplicate calls
  if ((getServiceStatus as any).hasChecked) {
    return (getServiceStatus as any).lastResult;
  }
  
  try {
    // Simplified health check - just try to get a user session from Supabase
    const { data, error } = await supabase.auth.getSession();
    
    const result = {
      isAvailable: !error,
      message: error ? `Service unavailable: ${error.message}` : 'Service is available'
    };
    
    // Cache the result to avoid repeated checks
    (getServiceStatus as any).hasChecked = true;
    (getServiceStatus as any).lastResult = result;
    
    return result;
  } catch (error) {
    console.error('Error checking service status:', error);
    const result = {
      isAvailable: false,
      message: 'Cannot connect to service'
    };
    
    // Cache the result
    (getServiceStatus as any).hasChecked = true;
    (getServiceStatus as any).lastResult = result;
    
    return result;
  }
};

// Helper function to get authenticated user
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
  
  return data?.session?.user ?? null;
};

// Helper function to get user profile with role
export const getCurrentProfile = async () => {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};

// Helper for checking if user is authenticated
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user;
};

// Helper for checking user role
export const getUserRole = async () => {
  const profile = await getCurrentProfile();
  return profile?.role;
};

// Helper to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Storage helper for file uploads
export const getStorageUrl = (bucket: string, path: string) => {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

// Helper to upload file to storage
export const uploadFile = async (
  bucket: string, 
  path: string, 
  file: File,
  onProgress?: (progress: number) => void
) => {
  // If no progress callback is provided, use the simple Supabase upload
  if (!onProgress) {
    return supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
  }
  
  // For progress tracking, we need to use fetch directly
  const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${path}`;
  const supabaseKey = supabaseAnonKey;
  
  // Create a new AbortController instance for the fetch request
  const controller = new AbortController();
  const { signal } = controller;
  
  try {
    // Report start of upload
    onProgress(0);
    
    // Create a ReadableStream from the file
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadUrl, true);
    xhr.setRequestHeader('apikey', supabaseKey);
    xhr.setRequestHeader('Authorization', `Bearer ${supabaseKey}`);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.setRequestHeader('x-upsert', 'true');
    xhr.setRequestHeader('Cache-Control', '3600');
    
    // Set up progress tracking
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    };
    
    // Create a promise to handle the XHR response
    const uploadPromise = new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ data: { path }, error: null });
        } else {
          reject({ 
            error: { 
              message: `Upload failed with status ${xhr.status}`,
              status: xhr.status 
            }, 
            data: null 
          });
        }
      };
      
      xhr.onerror = () => {
        reject({ 
          error: { 
            message: 'Network error occurred during upload',
            status: 0 
          }, 
          data: null 
        });
      };
    });
    
    // Start the upload
    xhr.send(file);
    
    return uploadPromise;
  } catch (error) {
    return { data: null, error };
  }
};

// Helper to delete file from storage
export const deleteFile = async (bucket: string, path: string) => {
  return supabase.storage.from(bucket).remove([path]);
};

export default supabase;

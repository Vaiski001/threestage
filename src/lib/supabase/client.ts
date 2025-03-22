
import { createClient } from '@supabase/supabase-js';

// For local development, use environment variables
// In a production environment, these values should be properly configured as environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Validate if we're using placeholder credentials
if (supabaseUrl === 'https://placeholder-project.supabase.co' || supabaseAnonKey === 'placeholder-key') {
  console.warn(
    'Using placeholder Supabase credentials. The app will function, but authentication features will not work.\n' +
    'To enable authentication:\n' +
    '1. Create a Supabase project at https://supabase.com\n' +
    '2. Add your project URL and anon key to a .env file:\n' +
    '   VITE_SUPABASE_URL=your-project-url\n' +
    '   VITE_SUPABASE_ANON_KEY=your-anon-key\n' +
    '3. Restart your development server'
  );
}

console.log("Supabase configuration:", {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
});

// Use a singleton pattern to ensure only one instance is created
let supabaseInstance: ReturnType<typeof createClient> | null = null;

// Function to get the Supabase client instance
const getSupabaseClient = () => {
  if (!supabaseInstance) {
    console.log('Creating new Supabase client instance');
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true, // Enable automatic session detection
        storageKey: `sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token`,
      },
      global: {
        fetch: (url: RequestInfo | URL, init?: RequestInit) => {
          return fetch(url, init).catch(err => {
            console.error('Fetch error in Supabase client:', err);
            throw err;
          });
        }
      }
    });
  }
  return supabaseInstance;
};

// Export the singleton instance
export const supabase = getSupabaseClient();

// Export a function to get a fresh client with different options if needed
// This should be used very sparingly and only for specific use cases
export const createSupabaseClient = (options = {}) => {
  console.warn('Creating a secondary Supabase client. This should be used with caution.');
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true, // Enable automatic session detection
      ...options
    }
  });
};


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

// Create a single supabase client instance for the entire application
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // We'll handle this manually
    storageKey: `sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token`
  }
});

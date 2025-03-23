
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
let connectionError: Error | null = null;
let lastServiceCheck = 0;
const serviceStatusTypes = ['available', 'degraded', 'unavailable'] as const;
type ServiceStatusType = typeof serviceStatusTypes[number];
let serviceStatus: ServiceStatusType = 'available';
let consecutiveErrors = 0;

// Function to get the Supabase client instance
const getSupabaseClient = () => {
  if (connectionError) {
    console.warn('Using Supabase client despite previous connection error:', connectionError.message);
  }
  
  if (!supabaseInstance) {
    console.log('Creating new Supabase client instance');
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          storageKey: 'supabase_auth_token',
          storage: {
            getItem: (key) => {
              try {
                const itemStr = localStorage.getItem(key);
                return itemStr;
              } catch (e) {
                console.error('Error accessing localStorage:', e);
                return null;
              }
            },
            setItem: (key, value) => {
              try {
                localStorage.setItem(key, value);
              } catch (e) {
                console.error('Error writing to localStorage:', e);
              }
            },
            removeItem: (key) => {
              try {
                localStorage.removeItem(key);
              } catch (e) {
                console.error('Error removing from localStorage:', e);
              }
            }
          }
        },
        global: {
          fetch: (url: RequestInfo | URL, init?: RequestInit) => {
            return fetch(url, init)
              .then(response => {
                if (response.ok) {
                  // Reset consecutive errors counter on successful requests
                  consecutiveErrors = 0;
                  if (serviceStatus !== 'available') {
                    console.log('Supabase service recovered');
                    serviceStatus = 'available';
                  }
                }
                return response;
              })
              .catch(err => {
                console.error('Fetch error in Supabase client:', err);
                connectionError = err;
                consecutiveErrors++;
                
                // After multiple consecutive errors, mark service as degraded or unavailable
                if (consecutiveErrors > 2) {
                  serviceStatus = 'degraded';
                }
                if (consecutiveErrors > 5) {
                  serviceStatus = 'unavailable';
                }
                
                throw err;
              });
          }
        }
      });
      
      // Test connection by making a simple request
      supabaseInstance.auth.getSession()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error getting session:', error);
            connectionError = error;
            serviceStatus = 'degraded';
          } else if (data.session) {
            console.log('Valid session found in storage:', data.session.user.id);
            serviceStatus = 'available';
          } else {
            console.log('No active session found in storage');
          }
        })
        .catch(err => {
          console.error('Error connecting to Supabase:', err);
          connectionError = err;
          consecutiveErrors++;
          serviceStatus = 'degraded';
        });
        
    } catch (err) {
      console.error('Error creating Supabase client:', err);
      connectionError = err instanceof Error ? err : new Error(String(err));
      serviceStatus = 'unavailable';
      // Create a dummy client that will handle errors gracefully
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    }
  }
  return supabaseInstance;
};

// Export the singleton instance
export const supabase = getSupabaseClient();

// Export service status information
export const getServiceStatus = () => {
  return {
    status: serviceStatus,
    lastCheck: lastServiceCheck,
    consecutiveErrors
  };
};

// Export a check function to verify if Supabase is currently available
export const isSupabaseAvailable = async (): Promise<boolean> => {
  try {
    // Only run a full check if it's been more than 20 seconds since the last check
    const now = Date.now();
    
    if (now - lastServiceCheck < 20000) {
      // If we've checked recently, just return based on current status
      return serviceStatus === 'available';
    }
    
    // If it's been more than 20 seconds, perform a new check
    lastServiceCheck = now;
    
    // First check if there's an active session
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session) {
      console.log('Active session found during availability check');
      consecutiveErrors = 0;
      serviceStatus = 'available';
      return true;
    }
    
    // If no session, try a lightweight query with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    try {
      const { error } = await supabase.from('profiles').select('id').limit(1);
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Error during availability check:', error);
        consecutiveErrors++;
        if (consecutiveErrors > 2) serviceStatus = 'degraded';
        if (consecutiveErrors > 5) serviceStatus = 'unavailable';
        return false;
      }
      
      // Reset consecutive errors counter on successful requests
      consecutiveErrors = 0;
      serviceStatus = 'available';
      return true;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.error('Supabase availability check timed out');
        consecutiveErrors++;
        serviceStatus = 'degraded';
        return false;
      }
      throw error;
    }
  } catch (error) {
    console.error('Supabase availability check failed:', error);
    consecutiveErrors++;
    if (consecutiveErrors > 2) {
      serviceStatus = 'degraded';
    }
    return false;
  }
};

// Export a function to get a fresh client with different options if needed
// This should be used very sparingly and only for specific use cases
export const createSupabaseClient = (options = {}) => {
  console.warn('Creating a secondary Supabase client. This should be used with caution.');
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      ...options
    }
  });
};

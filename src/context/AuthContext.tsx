import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, UserProfile, forceSignOut, handleOAuthSignIn, ensureProfilesTableExists } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  resetAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: false,
  isAuthenticated: false,
  resetAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize database tables if needed
  useEffect(() => {
    const initializeTables = async () => {
      try {
        const success = await ensureProfilesTableExists();
        if (!success) {
          console.warn("Could not ensure profiles table exists. Some functionality may not work correctly.");
          
          // Show toast to notify user about potential issue
          toast({
            title: "Setup Notice",
            description: "Some database tables might need to be created in your Supabase project.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error initializing tables:", error);
      }
    };
    
    initializeTables();
  }, [toast]);

  // Check for session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          return;
        }
        
        if (data.session?.user) {
          console.log("Found existing session for user:", data.session.user.id);
          setUser(data.session.user);
          // We'll fetch profile data in a separate effect
        } else {
          console.log("No active session found");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Fetch profile when user changes
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log("Fetching profile for user:", user.id);
        
        // Ensure profiles table exists first
        const tableExists = await ensureProfilesTableExists();
        if (!tableExists) {
          console.warn("Profiles table may not exist. Will attempt to create profile anyway.");
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          
          // If profile doesn't exist yet, try to create one based on OAuth data
          if (error.code === 'PGRST116') { // Not found
            try {
              // Get role from localStorage if it exists (from OAuth process)
              const role = localStorage.getItem('oauth_role') as UserProfile['role'] || 'customer';
              
              const createdProfile = await handleOAuthSignIn(user, role);
              if (createdProfile) {
                console.log("Created new profile during fetch:", createdProfile);
                setProfile(createdProfile);
                return;
              } else {
                console.error("Failed to create profile during fetch");
              }
            } catch (createError) {
              console.error("Error creating profile during fetch:", createError);
            }
          }
          return;
        }

        if (!data) {
          console.log("No profile found for user:", user.id);
          return;
        }
        
        console.log("Profile data received:", data);
        
        // Create profile with proper type casting
        const profileData: UserProfile = {
          id: data.id as string,
          email: data.email as string,
          role: data.role as UserProfile["role"],
          name: data.name as string,
          created_at: data.created_at as string,
        };
        
        // Add optional fields if they exist
        if (data.company_name) profileData.company_name = data.company_name as string;
        if (data.phone) profileData.phone = data.phone as string;
        if (data.industry) profileData.industry = data.industry as string;
        if (data.website) profileData.website = data.website as string;
        if (data.integrations) profileData.integrations = data.integrations as string[] || [];

        setProfile(profileData);
      } catch (error) {
        console.error("Error in profile fetch:", error);
      }
    };

    fetchProfile();
  }, [user]);

  const resetAuth = async () => {
    try {
      setLoading(true);
      await forceSignOut();
      setUser(null);
      setProfile(null);
      console.log("Auth state reset");
    } catch (error) {
      console.error('Error resetting auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        toast({
          title: "Signed in",
          description: "You have been signed in successfully"
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        console.log("User signed out");
      } else if (event === 'USER_UPDATED' && session) {
        setUser(session.user);
      }
    });

    // Clean up the listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      isAuthenticated: !!user,
      resetAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

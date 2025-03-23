
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, UserProfile, forceSignOut, handleOAuthSignIn, ensureProfilesTableExists } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  resetAuth: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: false,
  isAuthenticated: false,
  resetAuth: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
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

  // Check for session on initial load and set up listeners
  useEffect(() => {
    let mounted = true;
    
    const checkSession = async () => {
      try {
        console.log("Checking for existing session...");
        setLoading(true);
        
        // First attempt to get session from storage
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          if (mounted) {
            setLoading(false);
            setSessionChecked(true);
          }
          return;
        }
        
        if (data.session?.user) {
          console.log("Found existing session for user:", data.session.user.id);
          if (mounted) {
            setUser(data.session.user);
            // Profile will be fetched in a separate effect
          }
        } else {
          console.log("No active session found");
        }
        
        if (mounted) {
          setLoading(false);
          setSessionChecked(true);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        if (mounted) {
          setLoading(false);
          setSessionChecked(true);
        }
      }
    };

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("Sign in detected, setting user");
        setUser(session.user);
        // Profile will be fetched in useEffect that depends on user
        
        // Optionally show a success toast
        toast({
          title: "Signed in",
          description: "You have been signed in successfully"
        });
      } 
      else if (event === 'SIGNED_OUT') {
        console.log("Sign out detected, clearing user and profile");
        setUser(null);
        setProfile(null);
      } 
      else if (event === 'TOKEN_REFRESHED' && session) {
        console.log("Token refreshed, updating user");
        setUser(session.user);
      }
      else if (event === 'USER_UPDATED' && session) {
        console.log("User updated, refreshing data");
        setUser(session.user);
        if (profile) {
          // Refresh profile if we already have one
          fetchProfileData(session.user.id);
        }
      }
    });

    // Check session on mount
    checkSession();
    
    // Clean up on unmount
    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [toast]);

  // Fetch profile data function that can be called programmatically
  const fetchProfileData = async (userId: string) => {
    try {
      console.log("Explicitly fetching profile for user:", userId);
      setProfileLoading(true);
      
      // Ensure profiles table exists
      await ensureProfilesTableExists();
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        
        // Handle not found case
        if (error.code === 'PGRST116') { // Not found
          try {
            // Get role from localStorage if it exists (from OAuth process)
            const role = localStorage.getItem('oauth_role') as UserProfile['role'] || 'customer';
            
            const createdProfile = await handleOAuthSignIn(user!, role);
            if (createdProfile) {
              console.log("Created new profile during fetch:", createdProfile);
              setProfile(createdProfile);
            } else {
              console.error("Failed to create profile during fetch");
            }
          } catch (createError) {
            console.error("Error creating profile during fetch:", createError);
          }
        }
        return null;
      }

      if (!data) {
        console.log("No profile found for user:", userId);
        return null;
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

      console.log("Processed profile data with role:", profileData.role);
      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error("Error in profile fetch:", error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  // Function to refresh profile data manually
  const refreshProfile = async () => {
    if (!user) return;
    console.log("Manually refreshing profile for user:", user.id);
    await fetchProfileData(user.id);
  };

  // Fetch profile when user changes
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    const getProfile = async () => {
      await fetchProfileData(user.id);
    };

    getProfile();
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading: (loading || profileLoading) && !sessionChecked, // Only show loading until session is checked
      isAuthenticated: !!user,
      resetAuth,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

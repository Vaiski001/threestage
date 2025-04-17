import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, UserProfile, forceSignOut, handleOAuthSignIn, ensureProfilesTableExists, isSupabaseAvailable } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { validateRole } from "@/lib/supabase/roleUtils";

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

  // Check if Supabase is available
  const supabaseAvailable = isSupabaseAvailable();

  useEffect(() => {
    // Skip if Supabase credentials are not available
    if (!supabaseAvailable) {
      setLoading(false);
      setSessionChecked(true);
      return;
    }

    const initializeTables = async () => {
      try {
        const success = await ensureProfilesTableExists();
        if (!success) {
          console.warn("Could not ensure profiles table exists. Some functionality may not work correctly.");
          
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
  }, [toast, supabaseAvailable]);

  useEffect(() => {
    // Skip if Supabase credentials are not available
    if (!supabaseAvailable) {
      setLoading(false);
      setSessionChecked(true);
      return;
    }

    let mounted = true;
    
    const checkSession = async () => {
      try {
        console.log("Checking for existing session...");
        setLoading(true);
        
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

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("Sign in detected, setting user");
        setUser(session.user);
        
        if (session.user.user_metadata?.role) {
          localStorage.setItem('supabase.auth.user_role', session.user.user_metadata.role);
          console.log("Stored user role in localStorage from auth change:", session.user.user_metadata.role);
        }
        
        toast({
          title: "Signed in",
          description: "You have been signed in successfully"
        });
      } 
      else if (event === 'SIGNED_OUT') {
        console.log("Sign out detected, clearing user and profile");
        setUser(null);
        setProfile(null);
        localStorage.removeItem('supabase.auth.user_role');
      } 
      else if (event === 'TOKEN_REFRESHED' && session) {
        console.log("Token refreshed, updating user");
        setUser(session.user);
      }
      else if (event === 'USER_UPDATED' && session) {
        console.log("User updated, refreshing data");
        setUser(session.user);
        if (profile) {
          fetchProfileData(session.user.id);
        }
      }
    });

    checkSession();
    
    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe?.();
    };
  }, [toast, supabaseAvailable]);

  const fetchProfileData = async (userId: string) => {
    try {
      console.log("Explicitly fetching profile for user:", userId);
      setProfileLoading(true);
      
      await ensureProfilesTableExists();
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        
        if (error.code === 'PGRST116') {
          const storedRole = localStorage.getItem('supabase.auth.user_role') || 
                            localStorage.getItem('oauth_role');
          const validatedRole = validateRole(storedRole) || 'customer';
          
          console.log("Using role from localStorage for profile creation:", validatedRole);
          
          const createdProfile = await handleOAuthSignIn(user!, validatedRole);
          if (createdProfile) {
            console.log("Created new profile during fetch:", createdProfile);
            setProfile(createdProfile);
            localStorage.setItem('supabase.auth.user_role', validatedRole);
          } else {
            console.error("Failed to create profile during fetch");
          }
        }
        return null;
      }

      if (!data) {
        console.log("No profile found for user:", userId);
        return null;
      }
      
      const profileData: UserProfile = {
        id: data.id as string,
        email: data.email as string,
        role: data.role as UserProfile["role"],
        name: data.name as string,
        created_at: data.created_at as string,
      };
      
      if (data.company_name) profileData.company_name = data.company_name as string;
      if (data.phone) profileData.phone = data.phone as string;
      if (data.industry) profileData.industry = data.industry as string;
      if (data.website) profileData.website = data.website as string;
      if (data.integrations) profileData.integrations = data.integrations as string[] || [];

      console.log("Processed profile data with role:", profileData.role);
      setProfile(profileData);
      
      localStorage.setItem('supabase.auth.user_role', profileData.role);
      
      return profileData;
    } catch (error) {
      console.error("Error in profile fetch:", error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    console.log("Manually refreshing profile for user:", user.id);
    await fetchProfileData(user.id);
  };

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
      loading: supabaseAvailable ? (loading || profileLoading) && !sessionChecked : false,
      isAuthenticated: supabaseAvailable ? !!user : true, // Consider authenticated in demo mode
      resetAuth,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

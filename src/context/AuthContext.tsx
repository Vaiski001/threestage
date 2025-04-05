import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, forceSignOut, handleOAuthSignIn, ensureProfilesTableExists } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { validateRole } from "@/lib/supabase/roleUtils";
import { UserProfile, UserRole } from "@/lib/supabase/types";
import { ProfileWithRole } from "@/types/profile";

interface AuthContextType {
  user: User | null;
  profile: ProfileWithRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  resetAuth: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setUserRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileWithRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
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
  }, [toast]);

  useEffect(() => {
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
            setHasActiveSession(false);
          }
          return;
        }
        
        if (data.session?.user) {
          console.log("Found existing session for user:", data.session.user.id);
          setHasActiveSession(true);
          if (mounted) {
            setUser(data.session.user);
          }
        } else {
          console.log("No active session found");
          setHasActiveSession(false);
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
          setHasActiveSession(false);
        }
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("Sign in detected, setting user");
        setUser(session.user);
        setHasActiveSession(true);
        
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
        setHasActiveSession(false);
        localStorage.removeItem('supabase.auth.user_role');
      } 
      else if (event === 'TOKEN_REFRESHED' && session) {
        console.log("Token refreshed, updating user");
        setUser(session.user);
        setHasActiveSession(true);
      }
      else if (event === 'USER_UPDATED' && session) {
        console.log("User updated, refreshing data");
        setUser(session.user);
        setHasActiveSession(true);
        if (profile) {
          fetchProfileData(session.user.id);
        }
      }
    });

    checkSession();
    
    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [toast]);

  const setUserRole = (role: string) => {
    if (!role) return;
    
    const validatedRole = role === 'company' ? 'company' : 'customer';
    
    localStorage.setItem('supabase.auth.user_role', validatedRole);
    
    if (profile) {
      setProfile({
        ...profile,
        role: validatedRole
      });
    }
    
    console.log(`User role set to: ${validatedRole}`);
  };

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
      
      const profileData: ProfileWithRole = {
        id: data.id as string,
        email: data.email as string,
        role: data.role as ProfileWithRole["role"],
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
      loading: (loading || profileLoading) && !sessionChecked,
      isAuthenticated: !!user || hasActiveSession,
      resetAuth,
      refreshProfile,
      setUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

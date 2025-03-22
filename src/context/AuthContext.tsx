
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, UserProfile, getCurrentUser, getUserProfile, forceSignOut } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
  resetAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
  refreshProfile: async () => {},
  resetAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      console.log("Refreshing profile for user:", user.id);
      const profile = await getUserProfile(user.id);
      
      if (!profile) {
        // If profile doesn't exist, user might have been deleted from Supabase
        console.warn("Profile not found during refresh, resetting auth state");
        await resetAuth();
        return;
      }
      
      setProfile(profile);
      console.log("Profile refreshed successfully:", profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const resetAuth = async () => {
    try {
      await forceSignOut();
      setUser(null);
      setProfile(null);
      console.log("Auth state reset due to invalid session or missing profile");
    } catch (error) {
      console.error('Error resetting auth state:', error);
    }
  };

  const validateSession = async () => {
    try {
      // Check if user session is still valid
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        // Session is invalid, reset auth state
        console.log("No current user found during validation");
        await resetAuth();
        return false;
      }
      
      // Verify profile exists
      const userProfile = await getUserProfile(currentUser.id);
      if (!userProfile) {
        // Profile doesn't exist, reset auth state
        console.log("No profile found during validation");
        await resetAuth();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating session:', error);
      await resetAuth();
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth context");
        // Get current session
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("Session found during initialization");
          // Validate that user still exists in Supabase
          const isValid = await validateSession();
          
          if (isValid) {
            setUser(data.session.user);
            const profile = await getUserProfile(data.session.user.id);
            setProfile(profile);
            console.log("Auth initialized with user:", data.session.user.id);
          } else {
            console.log("Session validation failed during initialization");
          }
        } else {
          console.log("No session found during initialization");
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast({
          title: "Authentication Error",
          description: "There was a problem with authentication. Please try again.",
          variant: "destructive"
        });
        await resetAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        const isValid = await validateSession();
        
        if (isValid) {
          setUser(session.user);
          const profile = await getUserProfile(session.user.id);
          setProfile(profile);
          console.log("User signed in successfully:", session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        console.log("User signed out");
      } else if (event === 'USER_UPDATED' && session) {
        setUser(session.user);
        refreshProfile();
        console.log("User updated:", session.user.id);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Validate the refreshed token
        await validateSession();
        console.log("Token refreshed for user:", session.user.id);
      }
    });

    return () => {
      console.log("Cleaning up auth listener");
      authListener.subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      isAuthenticated: !!user && !!profile,
      refreshProfile,
      resetAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

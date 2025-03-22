
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
      const profile = await getUserProfile(user.id);
      if (!profile) {
        // If profile doesn't exist, user might have been deleted from Supabase
        await resetAuth();
        return;
      }
      setProfile(profile);
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
        await resetAuth();
        return false;
      }
      
      // Verify profile exists
      const userProfile = await getUserProfile(currentUser.id);
      if (!userProfile) {
        // Profile doesn't exist, reset auth state
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
        // Get current session
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // Validate that user still exists in Supabase
          const isValid = await validateSession();
          
          if (isValid) {
            setUser(data.session.user);
            const profile = await getUserProfile(data.session.user.id);
            setProfile(profile);
          }
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
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      } else if (event === 'USER_UPDATED' && session) {
        setUser(session.user);
        refreshProfile();
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Validate the refreshed token
        await validateSession();
      }
    });

    return () => {
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

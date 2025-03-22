
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, UserProfile, forceSignOut } from '@/lib/supabase';
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

  // Check for session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUser(data.session.user);
          // We'll fetch profile data in a separate effect
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
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        setProfile(data as UserProfile);
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

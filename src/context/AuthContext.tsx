
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, UserProfile, forceSignOut, handleOAuthSignIn } from '@/lib/supabase';
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

  // Handle OAuth callback
  useEffect(() => {
    // Parse the hash from the URL if it exists
    const handleOAuthCallback = async () => {
      // Check if we have a hash in the URL (this indicates an OAuth callback)
      if (window.location.hash && window.location.hash.includes('access_token')) {
        console.log("Detected OAuth callback");
        
        try {
          // The hash will be automatically handled by Supabase auth
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error retrieving session after OAuth:", error);
            toast({
              title: "Authentication Error",
              description: "There was an error logging in with your social account.",
              variant: "destructive",
            });
            return;
          }
          
          if (data.session?.user) {
            console.log("OAuth login successful for user:", data.session.user.id);
            
            // Get the role that was stored before the OAuth flow
            const role = localStorage.getItem('oauth_role') || 'customer';
            
            // Handle the OAuth sign-in (create profile if necessary)
            const profile = await handleOAuthSignIn(data.session.user, role as UserProfile['role']);
            
            if (profile) {
              setUser(data.session.user);
              setProfile(profile);
              
              toast({
                title: "Login successful",
                description: `Welcome${profile.name ? ', ' + profile.name : ''}!`,
              });
              
              // Clean up the OAuth data
              localStorage.removeItem('oauth_role');
              localStorage.removeItem('oauth_provider');
              localStorage.removeItem('oauth_timestamp');
            }
          }
        } catch (error) {
          console.error("Error processing OAuth callback:", error);
        }
      }
    };
    
    handleOAuthCallback();
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
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
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

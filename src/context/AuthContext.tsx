
import { createContext, useContext, useState, ReactNode } from 'react';
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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const resetAuth = async () => {
    try {
      await forceSignOut();
      setUser(null);
      setProfile(null);
      console.log("Auth state reset");
    } catch (error) {
      console.error('Error resetting auth state:', error);
    }
  };

  // Preserving auth listener setup for Google Auth
  supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth state changed:", event);
    
    if (event === 'SIGNED_IN' && session) {
      setUser(session.user);
      console.log("User signed in via Google Auth:", session.user.id);
      toast({
        title: "Signed in",
        description: "You have been signed in via Google Auth"
      });
    } else if (event === 'SIGNED_OUT') {
      setUser(null);
      setProfile(null);
      console.log("User signed out");
    }
  });

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

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile, forceSignOut, handleOAuthSignIn, ensureProfilesTableExists, isSupabaseAvailable } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { validateRole } from "@/lib/supabase/roleUtils";
import React from 'react';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const { toast } = useToast();

  // Check if Supabase is available
  const supabaseAvailable = isSupabaseAvailable();
  
  // Track if we've already initialized tables to avoid duplicate calls
  const tablesInitialized = React.useRef(false);

  useEffect(() => {
    // Skip if Supabase credentials are not available
    if (!supabaseAvailable || tablesInitialized.current) {
      setLoading(false);
      setSessionChecked(true);
      return;
    }

    const initializeTables = async () => {
      try {
        tablesInitialized.current = true;
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
        if (process.env.NODE_ENV === 'development') {
          console.log("Checking for existing session...");
        }
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
          if (process.env.NODE_ENV === 'development') {
            console.log("Found existing session for user:", data.session.user.id);
          }
          if (mounted) {
            setUser(data.session.user);
          }
        } else if (process.env.NODE_ENV === 'development') {
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
      if (process.env.NODE_ENV === 'development') {
        console.log("Auth state changed:", event);
      }
      
      if (event === 'SIGNED_IN' && session) {
        if (process.env.NODE_ENV === 'development') {
          console.log("Sign in detected, setting user");
        }
        setUser(session.user);
        
        if (session.user.user_metadata?.role) {
          localStorage.setItem('supabase.auth.user_role', session.user.user_metadata.role);
          if (process.env.NODE_ENV === 'development') {
            console.log("Stored user role in localStorage from auth change:", session.user.user_metadata.role);
          }
        }
        
        toast({
          title: "Signed in",
          description: "You have been signed in successfully"
        });
      } 
      else if (event === 'SIGNED_OUT') {
        if (process.env.NODE_ENV === 'development') {
          console.log("Sign out detected, clearing user and profile");
        }
        setUser(null);
        setProfile(null);
        localStorage.removeItem('supabase.auth.user_role');
      } 
      else if (event === 'TOKEN_REFRESHED' && session) {
        if (process.env.NODE_ENV === 'development') {
          console.log("Token refreshed, updating user");
        }
        setUser(session.user);
      }
      else if (event === 'USER_UPDATED' && session) {
        if (process.env.NODE_ENV === 'development') {
          console.log("User updated, refreshing data");
        }
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

  // Cache profile data to reduce redundant API calls
  const profileCache = React.useRef(new Map<string, Profile>());

  const fetchProfileData = async (userId: string) => {
    try {
      // Check cache first
      if (profileCache.current.has(userId)) {
        const cachedProfile = profileCache.current.get(userId);
        if (process.env.NODE_ENV === 'development') {
          console.log("Using cached profile data for user:", userId);
        }
        setProfile(cachedProfile);
        return cachedProfile;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Explicitly fetching profile for user:", userId);
      }
      setProfileLoading(true);
      
      if (!tablesInitialized.current) {
        await ensureProfilesTableExists();
        tablesInitialized.current = true;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          const storedRole = localStorage.getItem('supabase.auth.user_role') || 
                            localStorage.getItem('oauth_role');
          const validatedRole = validateRole(storedRole) || 'customer';
          
          if (process.env.NODE_ENV === 'development') {
            console.log("Using role from localStorage for profile creation:", validatedRole);
          }
          
          const createdProfile = await handleOAuthSignIn(user!, validatedRole);
          if (createdProfile) {
            if (process.env.NODE_ENV === 'development') {
              console.log("Created new profile during fetch:", createdProfile);
            }
            setProfile(createdProfile);
            localStorage.setItem('supabase.auth.user_role', validatedRole);
            
            // Cache the profile
            profileCache.current.set(userId, createdProfile);
            
            return createdProfile;
          } else {
            console.error("Failed to create profile during fetch");
          }
        } else {
          console.error("Error fetching profile:", error);
        }
        return null;
      }

      if (!data) {
        if (process.env.NODE_ENV === 'development') {
          console.log("No profile found for user:", userId);
        }
        return null;
      }
      
      const profileData: Profile = {
        id: data.id as string,
        email: data.email as string,
        role: data.role as Profile["role"],
        name: data.name as string,
        created_at: data.created_at as string,
        company_name: data.company_name as string || null,
        phone: data.phone as string || null,
        industry: data.industry as string || null,
        website: data.website as string || null,
        integrations: data.integrations || null,
        profile_banner: data.profile_banner || null,
        profile_logo: data.profile_logo || null,
        profile_description: data.profile_description || null,
        profile_color_scheme: data.profile_color_scheme || null,
        profile_social_links: data.profile_social_links || null,
        profile_contact_info: data.profile_contact_info || null,
        profile_featured_images: data.profile_featured_images || null,
        profile_services_json: data.profile_services_json || null,
        profile_services: data.profile_services || null,
        inquiry_form_enabled: data.inquiry_form_enabled || false,
        inquiry_form_fields: data.inquiry_form_fields || null,
        inquiry_form_settings: data.inquiry_form_settings || null,
        updated_at: data.updated_at as string
      };
  
      if (process.env.NODE_ENV === 'development') {
        console.log("Processed profile data with role:", profileData.role);
      }
      setProfile(profileData);
      
      localStorage.setItem('supabase.auth.user_role', profileData.role);
      
      // Cache the profile
      profileCache.current.set(userId, profileData);
      
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

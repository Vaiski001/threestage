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

// Check if admin role exists in any storage location
const isAdminInStorage = () => {
  const localStorage1 = localStorage.getItem('supabase.auth.user_role') === 'admin';
  const localStorage2 = localStorage.getItem('userRole') === 'admin';
  const sessionStorage1 = sessionStorage.getItem('userRole') === 'admin';
  
  console.log("🔍 Checking for admin role in storage:", {
    'localStorage.supabase.auth.user_role': localStorage1,
    'localStorage.userRole': localStorage2,
    'sessionStorage.userRole': sessionStorage1
  });
  
  return localStorage1 || localStorage2 || sessionStorage1;
};

// Helper to save role to all storage locations
const saveRoleToStorage = (role: string) => {
  console.log(`Saving role to all storage: ${role}`);
  try {
    localStorage.setItem('supabase.auth.user_role', role);
    localStorage.setItem('userRole', role);
    sessionStorage.setItem('userRole', role);
  } catch (error) {
    console.warn('Could not save role to storage:', error);
  }
};

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

  // Clear potentially stale role data on initialization
  useEffect(() => {
    console.log('AuthProvider mounted - checking for role mismatches');
    
    // Check for admin role in any storage location
    if (isAdminInStorage()) {
      console.log('🔴 Admin role found in storage - ensuring consistency across all storage');
      saveRoleToStorage('admin');
    } else {
      // Check for other role mismatches
      const storedRole = localStorage.getItem('supabase.auth.user_role');
      
      if (storedRole === 'company' && window.location.pathname.startsWith('/customer/') || 
          storedRole === 'customer' && window.location.pathname.startsWith('/company/') ||
          storedRole === 'admin' && !window.location.pathname.startsWith('/admin/')) {
        // Clear potentially incorrect localStorage role to force a fresh fetch
        console.log("Potential role mismatch detected. Clearing cached role data.");
        localStorage.removeItem('supabase.auth.user_role');
        localStorage.removeItem('userRole');
        sessionStorage.removeItem('userRole');
      }
    }
  }, []);

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

  // Cache profile data to reduce redundant API calls but keep it short-lived
  const profileCache = React.useRef(new Map<string, {profile: Profile, timestamp: number}>());
  const CACHE_TTL = 30 * 1000; // 30 seconds

  const fetchProfileData = async (userId: string) => {
    console.log("Fetching profile data for user:", userId);
    try {
      // Check if we have the data in sessionStorage to prevent unnecessary fetches
      const cachedProfileData = sessionStorage.getItem(`profile_${userId}`);
      
      if (cachedProfileData) {
        console.log("Using cached profile data from sessionStorage");
        const cachedProfile = JSON.parse(cachedProfileData);
        
        // Add additional log for role validation
        console.log("Cached profile role:", cachedProfile.role);
        
        // Explicitly check and log the admin role
        if (cachedProfile.role === 'admin') {
          console.log("🔴 ADMIN ROLE DETECTED in cached profile - ensuring proper storage");
          saveRoleToStorage('admin');
          
          // Force check localStorage to ensure it was properly set
          console.log("Verifying storage after admin role detection:", {
            'localStorage.supabase.auth.user_role': localStorage.getItem('supabase.auth.user_role'),
            'localStorage.userRole': localStorage.getItem('userRole'),
            'sessionStorage.userRole': sessionStorage.getItem('userRole')
          });
        } else {
          // For non-admin roles, ensure role is saved consistently
          saveRoleToStorage(cachedProfile.role);
        }
        
        // Validate the role and log the result
        const validatedRole = validateRole(cachedProfile.role);
        console.log("Validated role result:", validatedRole);
        
        setProfile(cachedProfile);
        return cachedProfile;
      }
      
      console.log("No cached profile found, fetching from database");
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile data:", profileError);
        throw profileError;
      }
      
      if (!profileData) {
        console.warn("No profile found for user ID:", userId);
        return null;
      }

      console.log("Profile data fetched successfully:", profileData);
      console.log("User role from database:", profileData.role);
      
      // For admin role, ensure it's properly set in all storage mechanisms
      if (profileData.role === 'admin') {
        console.log("🔴 ADMIN ROLE DETECTED in database profile - forcing storage consistency");
        
        // Force clear any conflicting role first
        try {
          localStorage.removeItem('supabase.auth.user_role');
          localStorage.removeItem('userRole');
          sessionStorage.removeItem('userRole');
          
          // Then set admin role
          localStorage.setItem('supabase.auth.user_role', 'admin');
          localStorage.setItem('userRole', 'admin');
          sessionStorage.setItem('userRole', 'admin');
          
          // Verify storage
          console.log("Verifying admin role storage after database fetch:", {
            'localStorage.supabase.auth.user_role': localStorage.getItem('supabase.auth.user_role'),
            'localStorage.userRole': localStorage.getItem('userRole'),
            'sessionStorage.userRole': sessionStorage.getItem('userRole')
          });
        } catch (e) {
          console.warn("Error setting admin role in storage:", e);
        }
        
        // Also update sessionStorage to ensure consistency
        sessionStorage.setItem(`profile_${userId}`, JSON.stringify(profileData));
      } else {
        // For non-admin roles, normal storage
        sessionStorage.setItem(`profile_${userId}`, JSON.stringify(profileData));
        saveRoleToStorage(profileData.role);
      }
      
      // Validate the role and log the result
      const validatedRole = validateRole(profileData.role);
      console.log("Validated role result after database fetch:", validatedRole);
      
      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error("Error in fetchProfileData:", error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    console.log("Manually refreshing profile for user:", user.id);
    setProfileLoading(true);
    try {
      // Force refresh to bypass cache
      const refreshedProfile = await fetchProfileData(user.id);
      
      // Special handling for admin roles (critical!)
      if (refreshedProfile?.role === 'admin') {
        console.log("🔴 ADMIN ROLE found during refresh - ensuring it's properly saved");
        saveRoleToStorage('admin');
      }
      
      return refreshedProfile;
    } catch (error) {
      console.error("Error refreshing profile:", error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  const resetAuth = async () => {
    console.log("Resetting auth state...");
    // Reset all auth state
    setUser(null);
    setProfile(null);
    profileCache.current.clear();
    
    // Clear profile cache
    try {
      localStorage.removeItem('supabase.auth.user_role');
      localStorage.removeItem('userRole');
      sessionStorage.removeItem('userRole');
      
      // Clear any profile data in sessionStorage
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('profile_')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn("Could not clear profile cache:", e);
    }
    
    await forceSignOut();
  };

  // Authentication state change listener
  useEffect(() => {
    // Add a debounce flag to prevent multiple profile fetches
    let isProcessingAuth = false;
    let lastAuthTimestamp = 0;
    
    const getProfile = async () => {
      try {
        // Prevent concurrent profile fetch operations
        if (isProcessingAuth) {
          console.log("Skipping duplicate profile fetch - already in progress");
          return;
        }
        
        // Prevent rapid successive profile fetches (debounce)
        const now = Date.now();
        if (now - lastAuthTimestamp < 1000) { // 1 second debounce
          console.log("Skipping rapid profile fetch - debounced");
          return;
        }
        
        isProcessingAuth = true;
        lastAuthTimestamp = now;
        
        console.log("Getting user profile...");
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Error getting user:", error);
          setUser(null);
          setProfile(null);
          setLoading(false);
          isProcessingAuth = false;
          return;
        }
        
        if (!data?.user) {
          console.log("No user found");
          setUser(null);
          setProfile(null);
          setLoading(false);
          isProcessingAuth = false;
          return;
        }
        
        setUser(data.user);
        
        // Check for admin role in storage first
        if (isAdminInStorage()) {
          console.log("🔴 Admin role found in storage during auth state change");
          saveRoleToStorage('admin');
        }
        
        // Get profile data - only if not already fetched recently
        const profile = await fetchProfileData(data.user.id);
        
        // Special handling for admin roles
        if (profile?.role === 'admin') {
          console.log("🔴 Admin role from database - ensuring it's properly saved");
          saveRoleToStorage('admin');
        }
        
        isProcessingAuth = false;
      } catch (error) {
        console.error("Error in getProfile:", error);
        isProcessingAuth = false;
      } finally {
        setLoading(false);
      }
    };
    
    // The first time our component is mounted
    if (!sessionChecked) {
      const checkSession = async () => {
        try {
          console.log("Checking session...");
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error getting session:", error);
            setSessionChecked(true);
            setLoading(false);
            return;
          }
          
          if (data.session) {
            console.log("Session found");
            await getProfile();
          } else {
            console.log("No session found");
            setLoading(false);
          }
          
          setSessionChecked(true);
        } catch (error) {
          console.error("Error checking session:", error);
          setSessionChecked(true);
          setLoading(false);
        }
      };
      
      checkSession();
    }
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        // Prevent multiple rapid profile fetches by checking timestamp
        const now = Date.now();
        if (now - lastAuthTimestamp < 1000) {
          console.log("Skipping auth event due to debounce:", event);
          return;
        }
        
        if (event === "SIGNED_IN" && session) {
          console.log("User signed in");
          setUser(session.user);
          
          if (session.user) {
            // Special case for oauth sign in
            if (localStorage.getItem('oauth_timestamp')) {
              console.log("OAuth sign in detected - handling special profile creation");
              const oauthRole = localStorage.getItem('oauth_role');
              
              // Check specially for admin role in oauth flow
              if (oauthRole === 'admin') {
                console.log("🔴 ADMIN ROLE detected in OAuth flow");
                saveRoleToStorage('admin');
              }
              
              // Process user profile and role
              const profile = await handleOAuthSignIn(
                session.user, 
                oauthRole as any
              );
              
              // Clear OAuth temp data
              localStorage.removeItem('oauth_timestamp');
              localStorage.removeItem('oauth_role');
              localStorage.removeItem('oauth_provider');
            } else {
              // Regular sign in - fetch profile with debounce
              await getProfile();
            }
          }
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
          setUser(null);
          setProfile(null);
          
          // Clear any stored roles to prevent role conflicts
          localStorage.removeItem('supabase.auth.user_role');
          localStorage.removeItem('userRole');
          sessionStorage.removeItem('userRole');
        } else if (session?.user) {
          // Other auth events with session - make sure user state is updated
          setUser(session.user);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [sessionChecked]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        resetAuth,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

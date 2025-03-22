import { createClient, User, Session } from '@supabase/supabase-js';

// For local development, use environment variables
// In a production environment, these values should be properly configured as environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Validate if we're using placeholder credentials
if (supabaseUrl === 'https://placeholder-project.supabase.co' || supabaseAnonKey === 'placeholder-key') {
  console.warn(
    'Using placeholder Supabase credentials. The app will function, but authentication features will not work.\n' +
    'To enable authentication:\n' +
    '1. Create a Supabase project at https://supabase.com\n' +
    '2. Add your project URL and anon key to a .env file:\n' +
    '   VITE_SUPABASE_URL=your-project-url\n' +
    '   VITE_SUPABASE_ANON_KEY=your-anon-key\n' +
    '3. Restart your development server'
  );
}

// Create a single supabase client instance for the entire application
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // We'll handle this manually
    storageKey: `sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token`
  }
});

// Define types for auth
export type UserRole = 'customer' | 'company';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  company_name?: string;
  phone?: string;
  industry?: string;
  website?: string;
  integrations?: string[];
  created_at: string;
}

// Helper functions for authentication
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  userData: Omit<UserProfile, 'id' | 'created_at'>
) => {
  try {
    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: userData.role,
          name: userData.name,
          company_name: userData.company_name,
        }
      }
    });

    if (authError) throw authError;
    
    if (authData.user) {
      // Create profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          ...userData,
          created_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;
      
      return { user: authData.user, session: authData.session };
    }
    
    return authData;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signInWithOAuth = async (provider: 'google' | 'facebook' | 'linkedin', role: UserRole = 'customer') => {
  try {
    // Get the current domain for the redirect URL
    // We need to make sure this matches EXACTLY what's configured in Supabase
    const domain = window.location.origin;
    // Use the exact path that's configured in Supabase
    const redirectPath = '/auth/callback';
    const redirectTo = `${domain}${redirectPath}?role=${role}`;
    
    console.log(`OAuth sign-in initiated with ${provider}`);
    console.log(`Redirect URL: ${redirectTo}`);
    console.log(`Current domain: ${domain}`);
    
    // Store the role in local storage so we can retrieve it after redirect
    localStorage.setItem('oauth_role', role);
    localStorage.setItem('oauth_provider', provider);
    localStorage.setItem('oauth_timestamp', Date.now().toString());
    
    // Clear any existing hash fragment to prevent conflicts
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
    if (error) throw error;
    
    console.log("OAuth redirect initiated successfully");
    return data;
  } catch (error: any) {
    console.error(`Error signing in with ${provider}:`, error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    // Sign out from Supabase Auth
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) throw error;
    
    // Clear all auth-related localStorage items
    clearAuthStorage();
    
    console.log("User has been successfully signed out and all credentials cleared");
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// New function to force clear all auth data from localStorage and supabase client
export const forceSignOut = async () => {
  try {
    console.log("Force sign out initiated");
    
    // Clear Supabase auth
    await supabase.auth.signOut({ scope: 'global' });
    
    // Clear all auth-related localStorage items
    clearAuthStorage();
    
    console.log("Force sign out completed");
    return true;
  } catch (error) {
    console.error('Error during force sign out:', error);
    throw error;
  }
};

// Helper to clear all auth-related localStorage items
const clearAuthStorage = () => {
  console.log("Clearing auth storage");
  
  // Clear OAuth related items
  localStorage.removeItem('oauth_role');
  localStorage.removeItem('oauth_provider');
  localStorage.removeItem('oauth_timestamp');
  localStorage.removeItem('manual_login_attempted');
  
  // Clear any supabase items
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('supabase.') || key.startsWith('sb-'))) {
      localStorage.removeItem(key);
      console.log(`Removed item: ${key}`);
    }
  }
  
  // Force a session clear
  try {
    supabase.auth.signOut({ scope: 'global' });
  } catch (error) {
    console.error("Error in force session clear:", error);
  }
  
  console.log("Auth storage cleared completely");
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Enhanced Google OAuth sign-in function
export const signInWithGoogle = async (role: UserRole = 'customer') => {
  return signInWithOAuth('google', role);
};

// Helper to handle the OAuth callback and create/update profile
export const handleOAuthSignIn = async (user: User, role: UserRole = 'customer') => {
  if (!user) return null;
  
  try {
    console.log(`Handling OAuth sign-in for user ${user.id} with role ${role}`);
    
    // Check if profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      // If it's not a "not found" error, log and throw it
      console.error('Error checking existing profile:', profileError);
      throw profileError;
    }
    
    if (!existingProfile) {
      console.log('No existing profile found, creating new profile');
      // Create new profile if it doesn't exist
      const newProfile: Partial<UserProfile> = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        role: role,
        created_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .insert(newProfile);
        
      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }
      
      console.log('New profile created successfully');
      return newProfile as UserProfile;
    }
    
    console.log('Existing profile found:', existingProfile);
    return existingProfile as UserProfile;
  } catch (error) {
    console.error('Error handling OAuth sign-in:', error);
    return null;
  }
};

// Function to process access token from hash fragment
export const processAccessToken = async (accessToken: string, refreshToken: string | null) => {
  try {
    console.log('Processing access token from hash fragment');
    
    // First, clear all auth data to start fresh
    console.log('Clearing previous auth state');
    await forceSignOut();
    
    // Wait longer to ensure everything is cleared
    console.log('Waiting to ensure clean state');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Setting new session with token');
    // Set the session using the access token
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || '',
    });
    
    if (error) {
      console.error('Error setting session from access token:', error);
      throw error;
    }
    
    if (!data.session) {
      console.error('No session returned after setting access token');
      throw new Error('Failed to create session from access token');
    }
    
    // Add delay after setting session to allow Supabase to process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify the session was set correctly
    const { data: verifyData, error: verifyError } = await supabase.auth.getSession();
    
    if (verifyError) {
      console.error('Error verifying session:', verifyError);
      throw verifyError;
    }
    
    if (!verifyData.session) {
      console.error('Session verification failed - no session found after setting');
      throw new Error('Session verification failed');
    }
    
    console.log('Session verified successfully:', verifyData.session.user.id);
    
    return data.session;
  } catch (error) {
    console.error('Error processing access token:', error);
    throw error;
  }
};

// Function to check if user has complete profile
export const hasCompleteProfile = async (user: User, role: UserRole): Promise<boolean> => {
  try {
    const profile = await getUserProfile(user.id);
    
    if (!profile) return false;
    
    if (role === 'customer') {
      return !!profile.name;
    } else if (role === 'company') {
      return !!profile.company_name;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking profile completeness:', error);
    return false;
  }
};

// Function to delete a user account
export const deleteUserAccount = async (userId: string) => {
  try {
    console.log(`Attempting to delete user account with ID: ${userId}`);
    
    // First, delete the user's profile from the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    if (profileError) {
      console.error("Error deleting user profile:", profileError);
      // Continue with deletion even if profile deletion fails
    } else {
      console.log("Successfully deleted user profile");
    }
    
    // Then try to delete from auth.users using admin privileges
    // Note: This might fail if you don't have admin rights, but that's okay
    // The user can always create a new account with the same email
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    
    if (authError) {
      console.error("Error deleting user from auth:", authError);
      
      // Fallback: Sign the user out and remove from local storage
      await forceSignOut();
      
      // If we can't delete the user directly, at least clear all their data
      // This allows them to sign up again with the same account
      return false;
    }
    
    console.log("Successfully deleted user account");
    return true;
  } catch (error) {
    console.error("Error in deleteUserAccount:", error);
    throw error;
  }
};

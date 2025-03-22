
import { createClient, User } from '@supabase/supabase-js';

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

// Create the supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    // Get the current origin for the redirect URL
    // Use window.location.origin to ensure it matches exactly where the app is hosted
    const redirectTo = `${window.location.origin}/auth/callback?role=${role}`;
    
    console.log(`OAuth sign-in initiated with ${provider}`);
    console.log(`Redirect URL: ${redirectTo}`);
    
    // Store the role in local storage so we can retrieve it after redirect
    localStorage.setItem('oauth_role', role);
    localStorage.setItem('oauth_provider', provider);
    localStorage.setItem('oauth_timestamp', Date.now().toString());
    
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
    
    // The user will be redirected to the OAuth provider here,
    // so we won't actually reach the code below until they return
    console.log("OAuth redirect initiated successfully");
    return data;
  } catch (error: any) {
    console.error(`Error signing in with ${provider}:`, error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
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
    // Set the session using the access token
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || '',
    });
    
    if (error) {
      console.error('Error setting session from access token:', error);
      throw error;
    }
    
    console.log('Session set successfully from access token');
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

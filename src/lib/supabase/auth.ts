
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './client';
import { UserRole, UserProfile } from './types';
import { getUserProfile } from './profiles';
import { clearAuthStorage } from './signout';

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

// Enhanced Google OAuth sign-in function
export const signInWithGoogle = async (role: UserRole = 'customer') => {
  return signInWithOAuth('google', role);
};

// Improved processAccessToken with retry mechanism and better error handling
export const processAccessToken = async (accessToken: string, refreshToken: string | null) => {
  let retryCount = 0;
  const maxRetries = 3;
  const initialBackoff = 200; // Start with 200ms backoff
  
  const attemptTokenProcessing = async (): Promise<Session> => {
    try {
      console.log(`Processing access token attempt ${retryCount + 1}/${maxRetries + 1}`);
      
      // Clear previous auth state
      console.log('Clearing previous auth state');
      clearAuthStorage();
      
      // Force sign out but don't wait for it to complete
      supabase.auth.signOut({ scope: 'global' }).catch(e => 
        console.error("Non-blocking error during force sign out:", e)
      );
      
      // Gradually increase wait time between operations based on retry count
      const waitTime = Math.min(100 * Math.pow(2, retryCount), 1000);
      console.log(`Waiting ${waitTime}ms before setting session`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      console.log('Setting new session with token');
      // Set the session using the access token with a shorter, adaptive timeout
      const timeoutDuration = 3000 + (retryCount * 1000); // Increase timeout with each retry
      
      const { data, error } = await Promise.race([
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error(`Session setup timed out after ${timeoutDuration/1000} seconds`)), 
          timeoutDuration)
        )
      ]);
      
      if (error) {
        console.error(`Error setting session (attempt ${retryCount + 1}):`, error);
        throw error;
      }
      
      if (!data.session) {
        console.error(`No session returned after setting access token (attempt ${retryCount + 1})`);
        throw new Error('Failed to create session from access token');
      }
      
      // Shorter verification delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Verify the session was set correctly with a shorter timeout
      console.log('Verifying session');
      const { data: verifyData, error: verifyError } = await Promise.race([
        supabase.auth.getSession(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error("Session verification timed out after 2 seconds")), 2000)
        )
      ]);
      
      if (verifyError) {
        console.error('Error verifying session:', verifyError);
        throw verifyError;
      }
      
      if (!verifyData.session) {
        console.error('Session verification failed - no session found after setting');
        throw new Error('Session verification failed');
      }
      
      console.log('Session verified successfully:', verifyData.session.user.id);
      
      return verifyData.session;
    } catch (error: any) {
      // Determine if we should retry based on the error and retry count
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying token processing (${retryCount}/${maxRetries}). Error: ${error.message}`);
        
        // Exponential backoff
        const backoffTime = initialBackoff * Math.pow(2, retryCount - 1);
        console.log(`Waiting ${backoffTime}ms before retry`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        
        return attemptTokenProcessing();
      }
      
      console.error('Maximum retries reached. Giving up token processing.');
      throw error;
    }
  };
  
  try {
    return await attemptTokenProcessing();
  } catch (error) {
    console.error('Final error processing access token after all retries:', error);
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

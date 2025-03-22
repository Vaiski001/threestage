
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './client';
import { UserRole, UserProfile } from './types';
import { getUserProfile } from './profiles';
import { clearAuthStorage } from './signout';

export const signUpWithEmail = async (
  email: string, 
  password: string, 
  userData: Record<string, unknown>
) => {
  try {
    console.log("Starting signUpWithEmail process with:", email);
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

    if (authError) {
      console.error("Auth error during signup:", authError);
      throw authError;
    }
    
    if (authData.user) {
      console.log("Auth successful, creating profile for:", authData.user.id);
      
      // Create the profile record with proper shape for Supabase
      const profileData: Record<string, unknown> = {
        id: authData.user.id,
        email,
        ...userData,
        created_at: new Date().toISOString(),
      };
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData);

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw profileError;
      }
      
      console.log("Profile created successfully");
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
    const domain = window.location.origin;
    const redirectPath = '/auth/callback';
    const redirectTo = `${domain}${redirectPath}?role=${role}`;
    
    console.log(`OAuth sign-in initiated with ${provider}`);
    console.log(`Redirect URL: ${redirectTo}`);
    console.log(`Current domain: ${domain}`);
    
    localStorage.setItem('oauth_role', role);
    localStorage.setItem('oauth_provider', provider);
    localStorage.setItem('oauth_timestamp', Date.now().toString());
    
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

export const signInWithGoogle = async (role: UserRole = 'customer') => {
  return signInWithOAuth('google', role);
};

export const processAccessToken = async (accessToken: string, refreshToken: string | null) => {
  let retryCount = 0;
  const maxRetries = 4;
  const initialBackoff = 150;
  
  const attemptTokenProcessing = async (): Promise<Session> => {
    try {
      console.log(`Processing access token attempt ${retryCount + 1}/${maxRetries + 1}`);
      
      clearAuthStorage();
      
      supabase.auth.signOut({ scope: 'local' }).catch(e => 
        console.error("Non-blocking error during force sign out:", e)
      );
      
      const waitTime = Math.min(50 * Math.pow(1.5, retryCount), 500);
      console.log(`Waiting ${waitTime}ms before setting session`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      console.log('Setting new session with token');
      const timeoutDuration = 1500 + (retryCount * 500);
      
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
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { data: verifyData, error: verifyError } = await Promise.race([
        supabase.auth.getSession(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error("Session verification timed out after 1 second")), 1000)
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
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying token processing (${retryCount}/${maxRetries}). Error: ${error.message}`);
        
        const backoffTime = initialBackoff * Math.pow(1.5, retryCount - 1);
        console.log(`Waiting ${backoffTime}ms before retry`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        
        clearAuthStorage();
        
        return attemptTokenProcessing();
      }
      
      console.error('Maximum retries reached. Giving up token processing.');
      
      try {
        localStorage.setItem('supabase_manual_token', JSON.stringify({
          access_token: accessToken,
          refresh_token: refreshToken,
          timestamp: Date.now()
        }));
        console.log('Stored token data for manual login fallback');
      } catch (e) {
        console.error('Failed to store token data for fallback:', e);
      }
      
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

export const handleOAuthSignIn = async (user: User, role: UserRole = 'customer') => {
  if (!user) return null;
  
  try {
    console.log(`Handling OAuth sign-in for user ${user.id} with role ${role}`);
    
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking existing profile:', profileError);
      throw profileError;
    }
    
    if (!existingProfile) {
      console.log('No existing profile found, creating new profile');
      // Create object as Record<string, unknown> to satisfy TypeScript
      const newProfileData: Record<string, unknown> = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        role: role,
        created_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .insert(newProfileData);
        
      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }
      
      console.log('New profile created successfully');
      
      // Return constructed UserProfile with validated fields
      const newProfile: UserProfile = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        role: role,
        created_at: new Date().toISOString(),
      };
      
      return newProfile;
    }
    
    // Check if the returned data has the expected shape of a UserProfile
    if (existingProfile && 
        typeof existingProfile === 'object' &&
        'id' in existingProfile && 
        'email' in existingProfile && 
        'role' in existingProfile && 
        'name' in existingProfile && 
        'created_at' in existingProfile) {
      
      console.log('Existing profile found:', existingProfile);
      
      // Safely construct UserProfile with validated fields
      const profile: UserProfile = {
        id: existingProfile.id as string,
        email: existingProfile.email as string,
        role: existingProfile.role as UserProfile['role'],
        name: existingProfile.name as string,
        created_at: existingProfile.created_at as string,
      };
      
      // Add optional fields if they exist
      if ('company_name' in existingProfile) {
        profile.company_name = existingProfile.company_name as string;
      }
      if ('phone' in existingProfile) {
        profile.phone = existingProfile.phone as string;
      }
      if ('industry' in existingProfile) {
        profile.industry = existingProfile.industry as string;
      }
      if ('website' in existingProfile) {
        profile.website = existingProfile.website as string;
      }
      if ('integrations' in existingProfile) {
        profile.integrations = existingProfile.integrations as string[];
      }
      
      return profile;
    }
    
    console.error('Retrieved profile data is missing required fields:', existingProfile);
    return null;
  } catch (error) {
    console.error('Error handling OAuth sign-in:', error);
    return null;
  }
};

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

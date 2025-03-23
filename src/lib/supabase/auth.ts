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
  console.log("📝 Starting signUpWithEmail process:", { email, userData });
  
  try {
    // First, check if the user already exists to avoid unnecessary triggers
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (existingProfile) {
      throw new Error("This email is already registered. Please use a different email or try logging in.");
    }
    
    // Create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: userData.role,
          name: userData.name,
          company_name: userData.company_name,
        },
        // No hCaptcha options
      }
    });

    if (authError) {
      console.error("❌ Auth error during signup:", authError);
      throw authError;
    }
    
    if (!authData.user) {
      console.error("❌ No user returned from auth signup");
      throw new Error("Failed to create user account");
    }
    
    console.log("✅ Auth signup successful for:", authData.user.id);
    
    // Create a profile record
    const profileData: Record<string, unknown> = {
      id: authData.user.id,
      email,
      role: userData.role,
      name: userData.name || "",
      created_at: new Date().toISOString(),
    };
    
    // Add optional fields if they exist and are not undefined
    if (userData.company_name) profileData.company_name = userData.company_name;
    if (userData.phone) profileData.phone = userData.phone;
    if (userData.industry) profileData.industry = userData.industry;
    if (userData.website) profileData.website = userData.website;
    if (userData.integrations) profileData.integrations = userData.integrations;
    
    console.log("📝 Creating profile with data:", profileData);
    
    const { error: profileError } = await supabase
      .from('profiles')
      .insert(profileData);

    if (profileError) {
      console.error("❌ Profile creation error:", profileError);
      throw profileError;
    }
    
    console.log("✅ Profile created successfully");
    return { user: authData.user, session: authData.session };
  } catch (error) {
    console.error('❌ Error signing up:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    console.log("Signing in with email:", email);
    
    // Add additional logging for debugging
    console.log("Auth state before sign in:", 
      await supabase.auth.getSession().then(res => 
        `Has session: ${!!res.data.session}, Error: ${res.error ? res.error.message : 'none'}`
      )
    );
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error signing in with email:', error);
      return { error };
    }
    
    // Additional verification that we got valid data
    if (!data?.user) {
      console.error('No user returned from auth.signInWithPassword');
      return { 
        error: { message: "Authentication failed - no user returned" } 
      };
    }
    
    console.log("Sign in successful:", data.user.id);
    
    // Verify the session was created properly
    const sessionCheck = await supabase.auth.getSession();
    console.log("Session after login:", 
      `Has session: ${!!sessionCheck.data.session}, ` +
      `User ID: ${sessionCheck.data.session?.user?.id || 'none'}, ` +
      `Error: ${sessionCheck.error ? sessionCheck.error.message : 'none'}`
    );
    
    return { data };
  } catch (error: any) {
    console.error('Exception during sign in:', error);
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
    
    localStorage.setItem('oauth_role', role);
    localStorage.setItem('oauth_provider', provider);
    localStorage.setItem('oauth_timestamp', Date.now().toString());
    
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
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

export const handleOAuthSignIn = async (user: User, role: UserProfile['role'] = 'customer'): Promise<UserProfile | null> => {
  try {
    console.log("Handling OAuth sign-in for user:", user.id, "with role:", role);
    
    // Check if profile already exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error("Error checking profile:", profileError);
      
      if (profileError.code === 'PGRST116') {
        console.log("Profile doesn't exist, creating new one");
        
        // Extract name from user metadata if available
        const firstName = user.user_metadata?.first_name as string || '';
        const lastName = user.user_metadata?.last_name as string || '';
        let name = '';
        
        if (firstName || lastName) {
          name = [firstName, lastName].filter(Boolean).join(' ');
        } else if (user.user_metadata?.full_name) {
          name = user.user_metadata.full_name as string;
        } else if (user.user_metadata?.name) {
          name = user.user_metadata.name as string;
        }
        
        // Create profile record with proper typing
        const newProfileData: Record<string, unknown> = {
          id: user.id,
          email: user.email || '',
          role: role,
          name: name,
          created_at: new Date().toISOString()
        };
        
        console.log("Creating profile with data:", newProfileData);
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .insert(newProfileData)
            .select('*')
            .single();
          
          if (error) {
            console.error("Error creating profile:", error);
            return null;
          }
          
          console.log("Profile created successfully:", data);
          
          // Convert to UserProfile type
          const createdProfile: UserProfile = {
            id: data.id as string,
            email: data.email as string,
            role: data.role as UserRole,
            name: data.name as string,
            created_at: data.created_at as string
          };
          
          return createdProfile;
        } catch (error) {
          console.error("Error handling profile creation:", error);
          return null;
        }
      }
      
      return null;
    }
    
    if (existingProfile) {
      console.log("Existing profile found:", existingProfile);
      
      // Convert to UserProfile type
      const profile: UserProfile = {
        id: existingProfile.id as string,
        email: existingProfile.email as string,
        role: existingProfile.role as UserRole,
        name: existingProfile.name as string,
        created_at: existingProfile.created_at as string
      };
      
      // Add optional fields if they exist
      if (existingProfile.company_name) profile.company_name = existingProfile.company_name as string;
      if (existingProfile.phone) profile.phone = existingProfile.phone as string;
      if (existingProfile.industry) profile.industry = existingProfile.industry as string;
      if (existingProfile.website) profile.website = existingProfile.website as string;
      if (existingProfile.integrations) profile.integrations = existingProfile.integrations as string[] || [];
      
      return profile;
    }
    
    return null;
  } catch (error) {
    console.error("Error in handleOAuthSignIn:", error);
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

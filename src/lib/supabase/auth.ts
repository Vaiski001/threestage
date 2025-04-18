import { User, Session } from '@supabase/supabase-js';
import { supabase } from './client';
import { UserRole, Profile } from './types';
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
    
    // IMPORTANT FIX: Ensure role is properly set in user metadata
    console.log("Setting explicit role in auth metadata:", userData.role);
    
    const role = userData.role as UserRole;
    const accountType = role; // Make account_type match role for consistency
    
    // Create redirect URL with role and account_type - ensure it has a full proper URL
    // Using a full absolute URL to avoid any protocol issues
    const origin = window.location.origin;
    const secureOrigin = origin.startsWith('https://') ? origin : origin.replace('http://', 'https://');
    const redirectUrl = `${secureOrigin}/auth/callback?role=${role}&account_type=${accountType}`;
    
    console.log("Setting email verification redirect URL:", redirectUrl);
    
    // Create the auth user - ENSURE EMAIL CONFIRMATION IS ENABLED
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role, // Explicitly set role
          name: userData.name,
          company_name: userData.company_name,
          // Include all other necessary fields
          ...(userData.industry && { industry: userData.industry }),
          ...(userData.website && { website: userData.website }),
          ...(userData.phone && { phone: userData.phone }),
        },
        emailRedirectTo: redirectUrl
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
    console.log("📧 Verification email should be sent to:", email);
    console.log("📧 Email confirmation status:", {
      isEmailConfirmed: authData.user.email_confirmed_at,
      identities: authData.user.identities,
      providerToken: authData.session?.provider_token || "none"
    });
    
    // Create a profile record
    const profileData: Record<string, unknown> = {
      id: authData.user.id,
      email,
      role: role,
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
    const secureOrigin = domain.startsWith('https://') ? domain : domain.replace('http://', 'https://');
    const redirectPath = '/auth/callback';
    const redirectTo = `${secureOrigin}${redirectPath}?role=${role}&account_type=${role}`;
    
    console.log(`OAuth sign-in initiated with ${provider} for role: ${role}`);
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
          // Include role in query params to ensure it's passed through the OAuth flow
          role: role
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

export const handleOAuthSignIn = async (user: User, role?: Profile['role']): Promise<Profile | null> => {
  console.log(`Creating/verifying profile for OAuth user with role: ${role}`);
  
  // Helper function to save role to all storage locations
  const saveRoleToAllStorage = (role: string) => {
    console.log(`🔐 Saving role to all storage locations: ${role}`);
    try {
      localStorage.setItem('supabase.auth.user_role', role);
      localStorage.setItem('userRole', role);
      sessionStorage.setItem('userRole', role);
    } catch (e) {
      console.warn('Failed to save role to storage:', e);
    }
  };
  
  // Validate role to ensure it's a valid option
  let validatedRole: Profile['role'] = 'customer';
  if (role === 'admin' || role === 'company') {
    console.log(`Valid specialized role detected: ${role}`);
    validatedRole = role;
  }
  
  // Additional logging for admin role
  if (role === 'admin') {
    console.log(`🔴 ADMIN ROLE being processed in handleOAuthSignIn for user ${user.id}`);
    // Save admin role to all storage immediately for quick access
    saveRoleToAllStorage('admin');
  }
  
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (existingProfile) {
      console.log(`Profile already exists for user ${user.id} with role: ${existingProfile.role}`);
      
      // Save the existing role to all storage locations for consistent access
      saveRoleToAllStorage(existingProfile.role);
      
      // Special handling for admin - if admin in profile or requested, ensure admin role
      if (validatedRole === 'admin' || existingProfile.role === 'admin') {
        console.log(`🔴 Admin role found - ensuring profile has admin role`);
        
        // If profile already has admin role, just save it to storage and return
        if (existingProfile.role === 'admin') {
          console.log('Profile already has admin role - ensuring storage consistency');
          saveRoleToAllStorage('admin');
          return existingProfile as Profile;
        }
        
        // Otherwise update the profile to admin role
        console.log(`🔴 Updating existing profile from ${existingProfile.role} to admin role`);
        
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin', updated_at: new Date().toISOString() })
          .eq('id', user.id)
          .select()
          .single();
          
        if (updateError) {
          console.error(`Error updating profile to admin: ${updateError.message}`);
          return existingProfile as Profile;
        }
        
        console.log('Profile successfully updated to admin role');
        saveRoleToAllStorage('admin');
        return updatedProfile as Profile;
      }
      
      return existingProfile as Profile;
    }
    
    // Create new profile
    const newProfile: Profile = {
      id: user.id,
      email: user.email || '',
      role: validatedRole,
      name: user.user_metadata?.full_name || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      company_name: null,
      phone: null,
      industry: null,
      website: null,
      integrations: null,
      profile_banner: null,
      profile_logo: null,
      profile_description: null,
      profile_color_scheme: null,
      profile_social_links: null,
      profile_contact_info: null,
      profile_featured_images: null,
      profile_services_json: null,
      profile_services: null,
      inquiry_form_enabled: false,
      inquiry_form_fields: null,
      inquiry_form_settings: null
    };
    
    console.log(`Creating new profile with role: ${validatedRole}`);
    
    // Log the profile being created
    if (validatedRole === 'admin') {
      console.log(`🔴 Creating new admin profile for user ${user.id}`);
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();
    
    if (error) {
      console.error(`Error creating profile: ${error.message}`);
      return null;
    }
    
    console.log(`Successfully created profile for user ${user.id} with role: ${validatedRole}`);
    
    // Set role in all storage for immediate access
    saveRoleToAllStorage(validatedRole);
    
    return data as Profile;
  } catch (error) {
    console.error('Error in handleOAuthSignIn:', error);
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

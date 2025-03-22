
import { supabase } from './client';

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
export const clearAuthStorage = () => {
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

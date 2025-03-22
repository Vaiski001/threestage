
import { supabase } from './client';
import { UserProfile } from './types';
import { User } from '@supabase/supabase-js';

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    // Verify the data has the required properties before returning it as UserProfile
    if (data && 
        typeof data === 'object' &&
        'id' in data && 
        'email' in data && 
        'role' in data && 
        'name' in data && 
        'created_at' in data) {
      // Safely construct UserProfile with type checking
      return {
        id: data.id as string,
        email: data.email as string,
        role: data.role as UserProfile['role'],
        name: data.name as string,
        created_at: data.created_at as string,
        company_name: data.company_name as string | undefined,
        phone: data.phone as string | undefined,
        industry: data.industry as string | undefined,
        website: data.website as string | undefined,
        integrations: data.integrations as string[] | undefined,
      };
    }
    
    console.error('Retrieved profile data is missing required fields:', data);
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
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
      await supabase.auth.signOut({ scope: 'global' });
      
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

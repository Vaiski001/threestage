
import { supabase } from './client';
import { UserProfile } from './types';

export const getUserProfile = async (userId: string) => {
  try {
    console.log('Getting user profile for:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
    
    if (!data) {
      console.log('No profile found for user:', userId);
      return null;
    }
    
    // Convert the data to a proper UserProfile object
    const profile: UserProfile = {
      id: data.id as string,
      email: data.email as string,
      role: data.role as UserProfile['role'],
      name: data.name as string,
      created_at: data.created_at as string,
    };
    
    // Add optional fields if they exist
    if ('company_name' in data && data.company_name) profile.company_name = data.company_name as string;
    if ('phone' in data && data.phone) profile.phone = data.phone as string;
    if ('industry' in data && data.industry) profile.industry = data.industry as string;
    if ('website' in data && data.website) profile.website = data.website as string;
    if ('integrations' in data && data.integrations) profile.integrations = data.integrations as string[];
    
    console.log('Profile retrieved successfully:', profile);
    return profile;
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
    } else {
      console.log("Successfully deleted user profile");
    }
    
    // Then try to delete from auth.users using admin privileges
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    
    if (authError) {
      console.error("Error deleting user from auth:", authError);
      
      // Fallback: Sign the user out and remove from local storage
      await supabase.auth.signOut({ scope: 'global' });
      
      return false;
    }
    
    console.log("Successfully deleted user account");
    return true;
  } catch (error) {
    console.error("Error in deleteUserAccount:", error);
    throw error;
  }
};

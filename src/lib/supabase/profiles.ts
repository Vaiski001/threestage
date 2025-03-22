
import { supabase } from './client';
import { UserProfile, UserRole } from './types';

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
    
    // Convert the data to a properly typed UserProfile object
    const profile: UserProfile = {
      id: data.id as string,
      email: data.email as string,
      role: data.role as UserRole,
      name: data.name as string,
      created_at: data.created_at as string,
    };
    
    // Add optional fields if they exist
    if (data.company_name) profile.company_name = data.company_name as string;
    if (data.phone) profile.phone = data.phone as string;
    if (data.industry) profile.industry = data.industry as string;
    if (data.website) profile.website = data.website as string;
    if (data.integrations) profile.integrations = data.integrations as string[] || [];
    
    console.log('Profile retrieved successfully:', profile);
    return profile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Function to create a user profile
export const createUserProfile = async (profileData: Partial<UserProfile>) => {
  try {
    console.log('Creating user profile with data:', profileData);
    
    if (!profileData.id) {
      throw new Error('User ID is required to create a profile');
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
    
    console.log('Profile created successfully:', data);
    
    // Return a properly typed profile
    const createdProfile: UserProfile = {
      id: data.id as string,
      email: data.email as string,
      role: data.role as UserRole,
      name: data.name as string, 
      created_at: data.created_at as string,
    };
    
    // Add optional fields if they exist
    if (data.company_name) createdProfile.company_name = data.company_name as string;
    if (data.phone) createdProfile.phone = data.phone as string;
    if (data.industry) createdProfile.industry = data.industry as string;
    if (data.website) createdProfile.website = data.website as string;
    if (data.integrations) createdProfile.integrations = data.integrations as string[] || [];
    
    return createdProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Function to update a user profile
export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  try {
    console.log('Updating profile for user:', userId, 'with data:', profileData);
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    console.log('Profile updated successfully:', data);
    
    // Return a properly typed profile
    const updatedProfile: UserProfile = {
      id: data.id as string,
      email: data.email as string,
      role: data.role as UserRole,
      name: data.name as string,
      created_at: data.created_at as string,
    };
    
    // Add optional fields if they exist
    if (data.company_name) updatedProfile.company_name = data.company_name as string;
    if (data.phone) updatedProfile.phone = data.phone as string;
    if (data.industry) updatedProfile.industry = data.industry as string;
    if (data.website) updatedProfile.website = data.website as string;
    if (data.integrations) updatedProfile.integrations = data.integrations as string[] || [];
    
    return updatedProfile;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
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

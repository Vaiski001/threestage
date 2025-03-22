
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
      id: data.id,
      email: data.email,
      role: data.role,
      name: data.name,
      created_at: data.created_at,
    };
    
    // Add optional fields if they exist
    if (data.company_name) profile.company_name = data.company_name;
    if (data.phone) profile.phone = data.phone;
    if (data.industry) profile.industry = data.industry;
    if (data.website) profile.website = data.website;
    if (data.integrations) profile.integrations = data.integrations;
    
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
    return data;
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
    return data;
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

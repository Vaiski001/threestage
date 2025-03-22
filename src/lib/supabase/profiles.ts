
import { supabase } from './client';
import { UserProfile, UserRole } from './types';

// Function to ensure profiles table exists
export const ensureProfilesTableExists = async () => {
  try {
    console.log('Checking if profiles table exists...');
    
    // Check if table exists by trying to select from it
    const { error } = await supabase
      .from('profiles')
      .select('count(*)', { count: 'exact', head: true });
    
    if (error && error.code === '42P01') { // Table doesn't exist
      console.log('Profiles table does not exist, creating it...');
      
      // Create profiles table
      const { error: createError } = await supabase.rpc('create_profiles_table');
      
      if (createError) {
        console.error('Error creating profiles table:', createError);
        console.log('Attempting alternative table creation...');
        
        // Alternative approach if RPC doesn't exist
        await supabase.auth.admin.createUser({
          email: 'temp@example.com',
          password: 'temporary_password',
          user_metadata: { isTemporary: true }
        });
        
        console.log('Profiles table should now be created by Supabase auth');
      } else {
        console.log('Profiles table created successfully');
      }
    } else if (error) {
      console.error('Error checking profiles table:', error);
    } else {
      console.log('Profiles table exists');
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring profiles table exists:', error);
    return false;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    // Make sure profiles table exists
    await ensureProfilesTableExists();
    
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
    // Make sure profiles table exists
    await ensureProfilesTableExists();
    
    console.log('Creating user profile with data:', profileData);
    
    if (!profileData.id) {
      throw new Error('User ID is required to create a profile');
    }
    
    // Convert UserProfile to Record<string, unknown>
    const profileRecord: Record<string, unknown> = {};
    
    // Add each property to the record
    Object.entries(profileData).forEach(([key, value]) => {
      profileRecord[key] = value;
    });
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileRecord)
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
    // Make sure profiles table exists
    await ensureProfilesTableExists();
    
    console.log('Updating profile for user:', userId, 'with data:', profileData);
    
    // Convert UserProfile to Record<string, unknown>
    const profileRecord: Record<string, unknown> = {};
    
    // Add each property to the record
    Object.entries(profileData).forEach(([key, value]) => {
      profileRecord[key] = value;
    });
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profileRecord)
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

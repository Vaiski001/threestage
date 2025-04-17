// Export the client
export { supabase, createSupabaseClient, isSupabaseAvailable } from './client';

// Export types properly with 'export type'
export type { UserRole, Profile } from './types';

// Export authentication functions
export {
  signUpWithEmail,
  signInWithEmail,
  signInWithOAuth,
  signInWithGoogle,
  getCurrentUser,
  resetPassword,
  updatePassword,
  processAccessToken,
  handleOAuthSignIn,
  hasCompleteProfile
} from './auth';

// Export role utility functions
export {
  validateRole,
  determineUserRole,
  getDashboardPathForRole
} from './roleUtils';

// Export sign-out functions
export {
  signOut,
  forceSignOut,
  clearAuthStorage
} from './signout';

// Export profile functions
export {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserAccount,
  ensureProfilesTableExists
} from './profiles';

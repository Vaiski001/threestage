
// Export the client
export { supabase, createSupabaseClient } from './client';

// Export types properly with 'export type'
export type { UserRole, UserProfile } from './types';

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

// Export sign-out functions
export {
  signOut,
  forceSignOut,
  clearAuthStorage
} from './signout';

// Export profile functions
export {
  getUserProfile,
  deleteUserAccount
} from './profiles';

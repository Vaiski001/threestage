
// Export the client
export { supabase } from './client';

// Export types
export { UserRole, UserProfile } from './types';

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

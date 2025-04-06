import { UserProfile, UserRole } from '@/lib/supabase/types';

/**
 * ProfileWithRole extends UserProfile with stronger role typing to ensure
 * we have proper type safety when working with user roles for navigation/permissions
 */
export type ProfileWithRole = UserProfile & {
  // Enforce role to be present (not optional) and strictly typed
  role: UserRole;
}; 
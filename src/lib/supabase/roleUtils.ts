import { UserRole } from './types';

/**
 * Utility functions for handling user roles
 */

/**
 * Validates if the provided role is a valid user role
 * @param role - Role to validate
 * @returns The validated role as lowercase string, or null if invalid
 */
export function validateRole(role: unknown): UserRole | null {
  // Check if role is a string
  if (typeof role !== 'string') {
    console.warn('Invalid role type:', typeof role);
    return null;
  }
  
  // Normalize to lowercase
  const normalizedRole = role.toLowerCase();
  
  // Special handling for admin role to ensure it's always recognized
  if (normalizedRole === 'admin') {
    console.log('Admin role validated successfully');
    // Ensure it's properly stored in localStorage for future checks
    try {
      localStorage.setItem('supabase.auth.user_role', 'admin');
      localStorage.setItem('userRole', 'admin');
      sessionStorage.setItem('userRole', 'admin');
    } catch (e) {
      // Ignore storage errors in case of incognito mode
      console.warn('Could not store admin role in localStorage:', e);
    }
    return 'admin';
  }
  
  // Check if it's a valid role
  if (normalizedRole === 'customer' || normalizedRole === 'company') {
    return normalizedRole as UserRole;
  }
  
  console.warn('Unknown role detected:', normalizedRole);
  return null;
}

/**
 * Determines the user role from multiple possible sources
 * Prioritizes URL params, then user_metadata, then localStorage
 * @param params - URL search params
 * @param user_metadata - User metadata from auth
 * @returns The validated user role, or null if no valid role found
 */
export function determineUserRole(
  params: URLSearchParams | null,
  user_metadata: Record<string, any> | null
): UserRole | null {
  // First priority: Check URL params
  const roleParam = params?.get('role');
  if (roleParam) {
    const validatedRole = validateRole(roleParam);
    if (validatedRole) return validatedRole;
  }

  // Second priority: Check user metadata
  if (user_metadata?.role) {
    const validatedRole = validateRole(user_metadata.role);
    if (validatedRole) return validatedRole;
  }

  // Third priority: Check localStorage
  const storedRole = localStorage.getItem('userRole');
  if (storedRole) {
    const validatedRole = validateRole(storedRole);
    if (validatedRole) return validatedRole;
  }

  // Default to customer if no valid role found
  return 'customer';
}

/**
 * Returns the appropriate dashboard path based on user role
 * @param role - The user role
 * @returns The dashboard path for the specified role
 */
export function getDashboardPathForRole(role: UserRole): string {
  switch (role) {
    case 'customer':
      return '/customer/dashboard';
    case 'company':
      return '/company/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/customer/dashboard';
  }
}

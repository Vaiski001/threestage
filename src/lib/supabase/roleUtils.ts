
import { UserRole } from './types';

/**
 * Validates and normalizes a role string to ensure it's a valid UserRole
 * @param roleString The role string to validate
 * @returns A valid UserRole ('customer' or 'company') or undefined if invalid
 */
export function validateRole(roleString: unknown): UserRole | undefined {
  if (typeof roleString !== 'string') return undefined;
  
  const normalizedRole = roleString.toLowerCase().trim();
  
  if (normalizedRole === 'customer' || normalizedRole === 'company') {
    return normalizedRole as UserRole;
  }
  
  return undefined;
}

/**
 * Determines the user role from various sources with priority
 * @param urlRole Role from URL parameters
 * @param metadataRole Role from user metadata
 * @param localStorageRole Role from localStorage
 * @returns The validated user role with priority: URL > metadata > localStorage > default ('customer')
 */
export function determineUserRole(
  urlRole?: string | null,
  metadataRole?: unknown,
  localStorageRole?: string | null
): UserRole {
  // Check URL query parameters first (highest priority)
  const validUrlRole = urlRole ? validateRole(urlRole) : undefined;
  if (validUrlRole) return validUrlRole;
  
  // Check user metadata second
  const validMetadataRole = validateRole(metadataRole);
  if (validMetadataRole) return validMetadataRole;
  
  // Check localStorage third
  const validLocalStorageRole = localStorageRole ? validateRole(localStorageRole) : undefined;
  if (validLocalStorageRole) return validLocalStorageRole;
  
  // Default fallback
  return 'customer';
}

/**
 * Gets the appropriate redirect path based on user role
 * @param role The validated user role
 * @returns The path to redirect to for dashboard access
 */
export function getDashboardPathForRole(role: UserRole): string {
  return role === 'company' ? '/company/dashboard' : '/customer/dashboard';
}

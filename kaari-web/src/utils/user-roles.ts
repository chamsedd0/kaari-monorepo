import { User } from '../backend/entities';

export type UserRole = 'admin' | 'advertiser' | 'regular';

/**
 * Determines the user's role based on their user object
 * @param user The user object from the auth context or store
 * @returns A string representing the user's role
 */
export const getUserRole = (user: User | null): UserRole => {
  if (!user) return 'regular';
  
  // Check for admin role
  if (user.role === 'admin') {
    return 'admin';
  }
  
  // Check for advertiser role
  if (user.role === 'advertiser') {
    return 'advertiser';
  }
  
  // Default to regular user
  return 'regular';
};

/**
 * Check if the user is an admin
 * @param user The user object from the auth context or store
 * @returns Boolean indicating if the user is an admin
 */
export const isAdmin = (user: User | null): boolean => {
  return getUserRole(user) === 'admin';
};

/**
 * Check if the user is an advertiser
 * @param user The user object from the auth context or store
 * @returns Boolean indicating if the user is an advertiser
 */
export const isAdvertiser = (user: User | null): boolean => {
  return getUserRole(user) === 'advertiser';
};

/**
 * Check if the user is a regular user (not admin or advertiser)
 * @param user The user object from the auth context or store
 * @returns Boolean indicating if the user is a regular user
 */
export const isRegularUser = (user: User | null): boolean => {
  return getUserRole(user) === 'regular';
}; 
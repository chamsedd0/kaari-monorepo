import { User } from 'firebase/auth';

// Enable this flag during development to see access control logs
const DEBUG_MODE = true;

// List of admin/developer emails that should have full access
const ADMIN_EMAILS = [
  // Add your admin/developer emails here
  'lhouijchams@gmail.com',
  // Add more as needed
];

// List of restricted paths that require special access before launch
const RESTRICTED_PATHS = [
  '/dashboard/advertiser',
  '/dashboards/advertiser-dashboard',
  '/photoshoot-booking',
  '/dashboard/admin',
  '/dashboards/admin-dashboard',
  // Add more restricted paths as needed
];

/**
 * Check if a user has admin access
 * @param user The current user object
 * @returns boolean indicating if user has admin access
 */
export const hasAdminAccess = (user: User | null): boolean => {
  if (!user || !user.email) {
    if (DEBUG_MODE) console.log('Access denied: No user or email');
    return false;
  }
  
  const userEmail = user.email.toLowerCase();
  const hasAccess = ADMIN_EMAILS.includes(userEmail);
  
  if (DEBUG_MODE) {
    console.log(`Access check for email: ${userEmail}`);
    console.log(`Admin access: ${hasAccess ? 'GRANTED' : 'DENIED'}`);
  }
  
  return hasAccess;
};

/**
 * Check if a path is restricted before launch
 * @param path The current path
 * @returns boolean indicating if the path is restricted
 */
export const isRestrictedPath = (path: string): boolean => {
  const isRestricted = RESTRICTED_PATHS.some(restrictedPath => path.startsWith(restrictedPath));
  
  if (DEBUG_MODE) {
    console.log(`Path check: ${path}`);
    console.log(`Path restricted: ${isRestricted ? 'YES' : 'NO'}`);
  }
  
  return isRestricted;
};

/**
 * Check if a user can access a specific path
 * @param user The current user object
 * @param path The path to check
 * @returns boolean indicating if the user can access the path
 */
export const canAccessPath = (user: User | null, path: string): boolean => {
  // If path is not restricted, allow access
  if (!isRestrictedPath(path)) {
    if (DEBUG_MODE) console.log(`Path ${path} is not restricted, access GRANTED`);
    return true;
  }
  
  // For restricted paths, check if user has admin access
  const hasAccess = hasAdminAccess(user);
  
  if (DEBUG_MODE) {
    console.log(`Access to restricted path ${path}: ${hasAccess ? 'GRANTED' : 'DENIED'}`);
  }
  
  return hasAccess;
};

/**
 * Get the redirect path for unauthorized users
 * @returns The path to redirect to
 */
export const getRedirectPath = (): string => {
  return '/static/coming-soon';
}; 
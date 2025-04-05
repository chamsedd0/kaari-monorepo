'use server';

import { User } from '../entities';
import { 
  getDocumentById, 
  createDocumentWithId, 
  updateDocument, 
  deleteDocument, 
  getDocuments,
  getDocumentsByField
} from '../firebase/firestore';
import { getCurrentUserProfile } from '../firebase/auth';

// Collection name for users
const USERS_COLLECTION = 'users';

/**
 * Fetch a user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    return await getDocumentById<User>(USERS_COLLECTION, userId);
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
}

/**
 * Create a new user
 */
export async function createUser(
  userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, 
  userId?: string
): Promise<User> {
  try {
    if (userId) {
      // Create user data with timestamps
      const fullUserData = {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // If a userId is provided, create a document with that ID
      return await createDocumentWithId<User>(
        USERS_COLLECTION, 
        userId, 
        fullUserData as Omit<User, 'id'>
      );
    } else {
      throw new Error('User ID is required to create a user document');
    }
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

/**
 * Update an existing user
 */
export async function updateUser(userId: string, userData: Partial<User>): Promise<User> {
  try {
    return await updateDocument<User>(USERS_COLLECTION, userId, userData);
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

/**
 * Delete a user
 */
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    return await deleteDocument(USERS_COLLECTION, userId);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}

/**
 * Get all users (with optional pagination and filtering)
 */
export async function getUsers(options?: { 
  limit?: number; 
  page?: number; 
  role?: User['role'];
}): Promise<User[]> {
  try {
    const filters: Array<{
      field: string;
      operator: '==' | '!=' | '>' | '>=' | '<' | '<=';
      value: any;
    }> = [];
    
    if (options?.role) {
      filters.push({
        field: 'role',
        operator: '==',
        value: options.role
      });
    }
    
    // Calculate startAfterId based on pagination
    let startAfterId;
    if (options?.page && options.page > 1 && options.limit) {
      // This is a simplified approach - in a real app you'd use cursor-based pagination
      // by storing the last document ID from the previous page
      const skipCount = (options.page - 1) * options.limit;
      const allUsers = await getDocuments<User>(USERS_COLLECTION, {
        filters,
        orderByField: 'createdAt',
        orderDirection: 'desc'
      });
      
      if (allUsers.length > skipCount) {
        startAfterId = allUsers[skipCount - 1].id;
      }
    }
    
    return await getDocuments<User>(USERS_COLLECTION, {
      filters,
      orderByField: 'createdAt',
      orderDirection: 'desc',
      limit: options?.limit,
      startAfterId
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

/**
 * Get the current authenticated user's profile
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    return await getCurrentUserProfile();
  } catch (error) {
    console.error('Error getting current user:', error);
    throw new Error('Failed to get current user');
  }
}

/**
 * Get users by role
 */
export async function getUsersByRole(role: User['role']): Promise<User[]> {
  try {
    return await getDocumentsByField<User>(USERS_COLLECTION, 'role', role);
  } catch (error) {
    console.error('Error fetching users by role:', error);
    throw new Error('Failed to fetch users by role');
  }
} 
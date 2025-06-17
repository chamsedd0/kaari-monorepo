'use server';

import { updateDocument } from '../firebase/firestore';
import { User } from '../entities';
import { getCurrentUserProfile } from '../firebase/auth';

// Collection name for users
const USERS_COLLECTION = 'users';

/**
 * Update user document information
 */
export async function updateUserDocument(
  userId: string,
  documentType: 'rules' | 'other',
  documentUrl: string
): Promise<User> {
  try {
    // Get current user for authorization
    const currentUser = await getCurrentUserProfile();
    if (!currentUser || currentUser.id !== userId) {
      throw new Error('User not authenticated or unauthorized');
    }

    // Create documents object if it doesn't exist
    const documents = currentUser.documents || {};
    
    // Update the specific document type
    documents[documentType] = documentUrl;

    // Update user document with document information
    return await updateDocument<User>(USERS_COLLECTION, userId, {
      documents,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error(`Error updating ${documentType} document:`, error);
    throw new Error(`Failed to update ${documentType} document`);
  }
} 
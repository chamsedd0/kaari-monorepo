'use server';

import { Review, Property, Request } from '../entities';
import { 
  getDocumentById, 
  updateDocument, 
  getDocuments,
  getDocumentsByField,
  createDocument
} from '../firebase/firestore';
import { getCurrentUserProfile } from '../firebase/auth';

// Collection names
const REVIEWS_COLLECTION = 'reviews';
const PROPERTIES_COLLECTION = 'properties';
const REQUESTS_COLLECTION = 'requests';
const REVIEW_PROMPTS_COLLECTION = 'review_prompts';

/**
 * Add a review ID to the property's reviews array
 */
export async function addReviewToProperty(propertyId: string, reviewId: string): Promise<void> {
  try {
    // Get the property
    const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, propertyId);
    if (!property) {
      throw new Error('Property not found');
    }
    
    // Add the review ID to the property's reviews array
    const reviews = property.reviews || [];
    
    // Check if review is already in the array to avoid duplicates
    if (!reviews.includes(reviewId)) {
      reviews.push(reviewId);
      
      // Update the property with the new reviews array
      await updateDocument<Property>(PROPERTIES_COLLECTION, propertyId, {
        reviews,
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error adding review to property:', error);
    throw new Error('Failed to add review to property');
  }
}

/**
 * Create a review prompt record when a user moves in
 */
export async function createReviewPrompt(
  userId: string,
  propertyId: string,
  requestId: string
): Promise<void> {
  try {
    // Check if a prompt already exists for this user and property
    const existingPrompts = await getDocuments(REVIEW_PROMPTS_COLLECTION, {
      filters: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'propertyId', operator: '==', value: propertyId },
        { field: 'completed', operator: '==', value: false }
      ]
    });
    
    // If a prompt already exists, don't create another one
    if (existingPrompts.length > 0) {
      return;
    }
    
    // Create a new prompt
    await createDocument(REVIEW_PROMPTS_COLLECTION, {
      userId,
      propertyId,
      requestId,
      createdAt: new Date(),
      updatedAt: new Date(),
      promptedAt: null, // Will be set when the prompt is shown to the user
      completed: false,  // Will be set to true when the user writes a review
      dismissed: false   // Will be set to true if the user dismisses the prompt
    });
  } catch (error) {
    console.error('Error creating review prompt:', error);
    // Don't throw here - this is a background process
  }
}

/**
 * Check if a user should see a review prompt
 * This will be called when the user logs in or refreshes the app
 */
export async function checkUserShouldSeeReviewPrompt(): Promise<{
  shouldShowPrompt: boolean;
  propertyId?: string;
  propertyName?: string;
  promptId?: string;
}> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      return { shouldShowPrompt: false };
    }
    
    // Calculate the timestamp for 3 hours ago - REMOVED TIME RESTRICTION
    // const threeHoursAgo = new Date();
    // threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);
    
    // Get all review prompts for this user that haven't been completed or dismissed
    const prompts = await getDocuments(REVIEW_PROMPTS_COLLECTION, {
      filters: [
        { field: 'userId', operator: '==', value: currentUser.id },
        { field: 'completed', operator: '==', value: false },
        { field: 'dismissed', operator: '==', value: false }
      ]
    });
    
    // If no prompts, return false
    if (prompts.length === 0) {
      return { shouldShowPrompt: false };
    }
    
    // REMOVED TIME RESTRICTION - Get all prompts
    // const eligiblePrompts = prompts.filter(prompt => 
    //   new Date(prompt.createdAt).getTime() <= threeHoursAgo.getTime()
    // );
    
    // if (eligiblePrompts.length === 0) {
    //   return { shouldShowPrompt: false };
    // }
    
    // Get the oldest prompt
    const prompt = prompts.sort((a, b) => 
      a.createdAt.getTime() - b.createdAt.getTime()
    )[0];
    
    // Get the property details
    const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, prompt.propertyId);
    if (!property) {
      // If property doesn't exist anymore, mark the prompt as dismissed
      await updateDocument(REVIEW_PROMPTS_COLLECTION, prompt.id, {
        dismissed: true,
        updatedAt: new Date()
      });
      return { shouldShowPrompt: false };
    }
    
    // Mark the prompt as having been shown to the user
    await updateDocument(REVIEW_PROMPTS_COLLECTION, prompt.id, {
      promptedAt: new Date(),
      updatedAt: new Date()
    });
    
    // Return that the user should see a prompt, along with property details
    return {
      shouldShowPrompt: true,
      propertyId: property.id,
      propertyName: property.title,
      promptId: prompt.id
    };
  } catch (error) {
    console.error('Error checking if user should see review prompt:', error);
    return { shouldShowPrompt: false };
  }
}

/**
 * Mark a review prompt as completed when a user writes a review
 */
export async function markReviewPromptCompleted(
  promptId: string,
  reviewId: string
): Promise<void> {
  try {
    await updateDocument(REVIEW_PROMPTS_COLLECTION, promptId, {
      completed: true,
      reviewId,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error marking review prompt as completed:', error);
    // Don't throw here - this is a background process
  }
}

/**
 * Mark a review prompt as dismissed when a user dismisses the prompt
 */
export async function dismissReviewPrompt(promptId: string): Promise<void> {
  try {
    // Check if the prompt exists
    const prompt = await getDocumentById(REVIEW_PROMPTS_COLLECTION, promptId);
    if (!prompt) {
      return;
    }
    
    await updateDocument(REVIEW_PROMPTS_COLLECTION, promptId, {
      dismissed: true,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error dismissing review prompt:', error);
    // Don't throw here - this is a background process
  }
}

/**
 * This function should be called when a user marks themselves as moved in
 * It will create a review prompt for the user
 */
export async function scheduleReviewPromptAfterMoveIn(
  requestId: string
): Promise<void> {
  try {
    // Get the request
    const request = await getDocumentById<Request>(REQUESTS_COLLECTION, requestId);
    if (!request || !request.propertyId || !request.userId) {
      return;
    }
    
    // Create a review prompt
    await createReviewPrompt(request.userId, request.propertyId, requestId);
  } catch (error) {
    console.error('Error scheduling review prompt:', error);
    // Don't throw here - this is a background process
  }
}

/**
 * Get all active review prompts for the current user
 * These are prompts that haven't been completed or dismissed
 */
export async function getActiveReviewPrompts(): Promise<{
  id: string;
  propertyId: string;
}[]> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      return [];
    }
    
    // Get all review prompts for this user that haven't been completed or dismissed
    const prompts = await getDocuments(REVIEW_PROMPTS_COLLECTION, {
      filters: [
        { field: 'userId', operator: '==', value: currentUser.id },
        { field: 'completed', operator: '==', value: false },
        { field: 'dismissed', operator: '==', value: false }
      ]
    });
    
    // Map prompts to the format needed for the UI
    return prompts.map(prompt => ({
      id: prompt.id,
      propertyId: prompt.propertyId
    }));
  } catch (error) {
    console.error('Error getting active review prompts:', error);
    return [];
  }
} 
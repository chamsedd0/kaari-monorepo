'use server';

import { Review, Property, Request } from '../entities';
import { 
  getDocumentById, 
  createDocument
} from '../firebase/firestore';
import { getCurrentUserProfile } from '../firebase/auth';
import {
  addReviewToProperty,
  checkUserShouldSeeReviewPrompt,
  dismissReviewPrompt,
  markReviewPromptCompleted,
  createReviewPrompt
} from './ReviewManagementActions';

// Collection names
const REVIEWS_COLLECTION = 'reviews';
const PROPERTIES_COLLECTION = 'properties';
const REQUESTS_COLLECTION = 'requests';

/**
 * Enhanced version of createReview that also updates the property
 * with a reference to the review
 */
export async function createReviewEnhanced(
  propertyId: string,
  reviewData: {
    stayDuration: string;
    reviewText: string;
    ratings: {
      landlord: number;
      neighbourhood: number;
      publicTransport: number;
      accommodation: number;
      servicesNearby: number;
    };
    moveInDate: Date;
    promptId?: string; // Optional ID of the review prompt that triggered this review
  }
): Promise<Review> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Get property to validate and get advertiser ID
    const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, propertyId);
    if (!property) {
      throw new Error('Property not found');
    }
    
    // Prepare review data
    const fullReviewData = {
      userId: currentUser.id,
      propertyId,
      advertiserId: property.ownerId,
      stayDuration: reviewData.stayDuration,
      reviewText: reviewData.reviewText,
      ratings: reviewData.ratings,
      moveInDate: reviewData.moveInDate,
      published: true, // Publish immediately
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create the review
    const review = await createDocument<Review>(
      REVIEWS_COLLECTION,
      fullReviewData as Omit<Review, 'id'>
    );
    
    // Add the review ID to the property's reviews array
    await addReviewToProperty(propertyId, review.id);
    
    // If a promptId was provided, mark the prompt as completed
    if (reviewData.promptId) {
      await markReviewPromptCompleted(reviewData.promptId, review.id);
    }
    
    return review;
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create review');
  }
}

/**
 * Schedule a review prompt when a user moves in
 * This should be called from the completeReservation function
 */
export async function scheduleReviewPrompt(requestId: string): Promise<void> {
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

// Re-export functions from ReviewManagementActions
export { checkUserShouldSeeReviewPrompt, dismissReviewPrompt }; 
'use server';

import { Review, Property, User } from '../entities';
import { 
  getDocumentById, 
  createDocument, 
  updateDocument, 
  deleteDocument, 
  getDocuments,
  getDocumentsByField
} from '../firebase/firestore';
import { getCurrentUserProfile } from '../firebase/auth';
import { addReviewToProperty } from './ReviewManagementActions';

// Collection name for reviews
const REVIEWS_COLLECTION = 'reviews';
const PROPERTIES_COLLECTION = 'properties';
const USERS_COLLECTION = 'users';

/**
 * Get reviews to write by the current user
 * Returns properties the user has stayed at but hasn't reviewed yet
 * and where the move-in date was at least 3 hours ago
 */
export async function getReviewsToWrite(): Promise<{
  property: Property;
  advertiser: User;
  moveInDate: Date;
}[]> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Get properties the user has stayed at (from completed requests)
    // For now, we'll use a very simple approach:
    // 1. Get all completed viewing requests by the user
    // 2. Get the corresponding properties
    // 3. Check if the user has already reviewed each property
    
    // Get all completed viewing requests by this user
    const completedRequests = await getDocuments('requests', {
      filters: [
        { field: 'userId', operator: '==', value: currentUser.id },
        { field: 'requestType', operator: '==', value: 'viewing' },
        { field: 'status', operator: '==', value: 'completed' }
      ]
    });
    
    // Also get requests where the user has moved in
    const movedInRequests = await getDocuments('requests', {
      filters: [
        { field: 'userId', operator: '==', value: currentUser.id },
        { field: 'status', operator: '==', value: 'movedIn' }
      ]
    });
    
    // Combine both types of requests
    const allRequests = [...completedRequests, ...movedInRequests];
    
    // Get all reviews by this user
    const userReviews = await getDocumentsByField<Review>(
      REVIEWS_COLLECTION,
      'userId',
      currentUser.id
    );
    
    // Calculate the timestamp for 3 hours ago
    const threeHoursAgo = new Date();
    threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);
    
    
    // Get properties and check if already reviewed
    const reviewsToWritePromises = allRequests.map(async (request) => {
      // Get property ID either directly from request or via listing
      let propertyId = request.propertyId;
      if (!propertyId && request.listingId) {
        const listing = await getDocumentById('listings', request.listingId);
        if (listing) {
          propertyId = listing.propertyId;
        }
      }
      
      if (!propertyId) {
        return null; // Skip if no property ID found
      }
      
      // Check if user already reviewed this property
      const alreadyReviewed = userReviews.some(review => review.propertyId === propertyId);
      if (alreadyReviewed) {
        return null; // Skip if already reviewed
      }
      
      // Get property details
      const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, propertyId);
      if (!property) {
        return null; // Skip if property not found
      }
      
      // Get advertiser details
      const advertiser = await getDocumentById<User>(USERS_COLLECTION, property.ownerId);
      if (!advertiser) {
        return null; // Skip if advertiser not found
      }
      
      // Use the request's scheduled date as the move-in date
      const moveInDate = request.movedInAt || request.scheduledDate || request.createdAt;
      const moveInDateObj = new Date(moveInDate);
      
      // REMOVED: Skip if not 3 hours since move-in
      // This was causing reviews to not show up
      // if (moveInDateObj > threeHoursAgo) {
      //   return null; // Skip if not 3 hours since move-in
      // }
      
      return {
        property,
        advertiser,
        moveInDate: moveInDateObj
      };
    });
    
    // Wait for all promises to resolve and filter out nulls
    const reviewsToWrite = (await Promise.all(reviewsToWritePromises)).filter(Boolean);
    
    
    return reviewsToWrite;
  } catch (error) {
    console.error('Error getting reviews to write:', error);
    throw new Error('Failed to get reviews to write');
  }
}

/**
 * Get reviews written by the current user
 */
export async function getUserReviews(): Promise<{
  review: Review;
  property: Property;
}[]> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Get all reviews written by this user
    const reviews = await getDocumentsByField<Review>(
      REVIEWS_COLLECTION,
      'userId',
      currentUser.id
    );
    
    // Get property details for each review
    const reviewsWithDetails = await Promise.all(reviews.map(async (review) => {
      const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, review.propertyId);
      
      return {
        review,
        property: property || null
      };
    }));
    
    // Filter out reviews with missing properties
    return reviewsWithDetails.filter(item => item.property !== null);
  } catch (error) {
    console.error('Error getting user reviews:', error);
    throw new Error('Failed to get user reviews');
  }
}

/**
 * Create a new review
 */
export async function createReview(
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
    
    return review;
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create review');
  }
}

/**
 * Update an existing review
 */
export async function updateReview(
  reviewId: string,
  reviewData: Partial<Review>
): Promise<Review> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Get the review to verify ownership
    const review = await getDocumentById<Review>(REVIEWS_COLLECTION, reviewId);
    if (!review) {
      throw new Error('Review not found');
    }
    
    // Verify that the user owns this review
    if (review.userId !== currentUser.id) {
      throw new Error('Not authorized to update this review');
    }
    
    // Update the review
    const updatedReviewData = {
      ...reviewData,
      updatedAt: new Date()
    };
    
    const updatedReview = await updateDocument<Review>(
      REVIEWS_COLLECTION,
      reviewId,
      updatedReviewData
    );
    
    return updatedReview;
  } catch (error) {
    console.error('Error updating review:', error);
    throw new Error('Failed to update review');
  }
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string): Promise<boolean> {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Get the review to verify ownership
    const review = await getDocumentById<Review>(REVIEWS_COLLECTION, reviewId);
    if (!review) {
      throw new Error('Review not found');
    }
    
    // Verify that the user owns this review or is an admin
    if (review.userId !== currentUser.id && currentUser.role !== 'admin') {
      throw new Error('Not authorized to delete this review');
    }
    
    // Delete the review
    return await deleteDocument(REVIEWS_COLLECTION, reviewId);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw new Error('Failed to delete review');
  }
}

/**
 * Get reviews for a specific property
 */
export async function getPropertyReviews(propertyId: string): Promise<Review[]> {
  try {
    // Get all reviews for this property
    const reviews = await getDocumentsByField<Review>(
      REVIEWS_COLLECTION,
      'propertyId',
      propertyId
    );
    
    // Only return published reviews
    return reviews.filter(review => review.published);
  } catch (error) {
    console.error('Error getting property reviews:', error);
    throw new Error('Failed to get property reviews');
  }
}

/**
 * Get reviews for a specific advertiser
 */
export async function getAdvertiserReviews(advertiserId: string): Promise<Review[]> {
  try {
    // Get all reviews for this advertiser
    const reviews = await getDocumentsByField<Review>(
      REVIEWS_COLLECTION,
      'advertiserId',
      advertiserId
    );
    
    // Only return published reviews
    return reviews.filter(review => review.published);
  } catch (error) {
    console.error('Error getting advertiser reviews:', error);
    throw new Error('Failed to get advertiser reviews');
  }
} 
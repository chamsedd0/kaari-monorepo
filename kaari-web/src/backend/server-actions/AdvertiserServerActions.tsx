'use server';

import { 
  User, 
  Property, 
  Request,
  Review
} from '../entities';
import { 
  getDocumentById, 
  createDocument,
  updateDocument, 
  getDocumentsByField
} from '../firebase/firestore';
import { getCurrentUserProfile } from '../firebase/auth';
import {
  uploadMultipleFiles
} from '../firebase/storage';
import { getProperties } from './PropertyServerActions';
import { userNotifications } from '../../utils/notification-helpers';

// Collection names
const USERS_COLLECTION = 'users';
const PROPERTIES_COLLECTION = 'properties';

// Define Inquiry interface
interface Inquiry {
  id: string;
  userId: string;
  propertyId: string;
  message: string;
  status: 'pending' | 'answered' | 'rejected';
  response?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a new property
 */
export async function createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
  try {
    // Check if user is authenticated and an advertiser
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.role !== 'advertiser') {
      throw new Error('Only advertisers can create properties');
    }
    
    // Set owner ID to current user
    const propertyWithOwner = {
      ...propertyData,
      ownerId: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create the property using createDocument instead of createDocumentWithId
    const property = await createDocument<Property>(
      PROPERTIES_COLLECTION,
      propertyWithOwner as Omit<Property, 'id'>
    );
    
    // Add property to user's properties array
    const userProperties = currentUser.properties || [];
    await updateDocument<User>(USERS_COLLECTION, currentUser.id, {
      properties: [...userProperties, property.id]
    });
    
    return property;
  } catch (error) {
    console.error('Error creating property:', error);
    throw new Error('Failed to create property');
  }
}

/**
 * Upload property images
 */
export async function uploadPropertyImages(
  propertyId: string,
  images: File[]
): Promise<string[]> {
  try {
    // Check if user is authenticated and authorized
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Verify property exists and belongs to user
    const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, propertyId);
    if (!property) {
      throw new Error('Property not found');
    }
    
    if (property.ownerId !== currentUser.id) {
      throw new Error('Not authorized to update this property');
    }
    
    // Upload all images
    const imageUrls = await uploadMultipleFiles(
      images,
      `properties/${propertyId}/images`,
      'property_'
    );
    
    // Update property with new images
    await updateDocument<Property>(PROPERTIES_COLLECTION, propertyId, {
      images: [...(property.images || []), ...imageUrls],
      updatedAt: new Date()
    });
    
    return imageUrls;
  } catch (error) {
    console.error('Error uploading property images:', error);
    throw new Error('Failed to upload property images');
  }
}

/**
 * Get advertiser properties
 */
export async function getAdvertiserProperties(): Promise<Property[]> {
  try {
    // Check if user is authenticated and an advertiser
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.role !== 'advertiser') {
      throw new Error('Only advertisers can access their properties');
    }
    
    // Get all properties owned by this user with showAllStatuses set to true
    // to override the default filtering that only shows available properties
    const properties = await getProperties({
      ownerId: currentUser.id,
      showAllStatuses: true
    });
    
    return properties;
  } catch (error) {
    console.error('Error fetching advertiser properties:', error);
    throw new Error('Failed to fetch advertiser properties');
  }
}

/**
 * Get advertiser dashboard statistics
 */
export async function getAdvertiserStatistics(): Promise<{
  totalProperties: number;
  pendingReservations: number;
  photoshootsScheduled: number;
  inquiriesCount: number;
}> {
  try {
    // Check if user is authenticated and an advertiser
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.role !== 'advertiser') {
      throw new Error('Only advertisers can access their dashboard statistics');
    }
    
    // Get properties owned by this user
    const properties = await getDocumentsByField<Property>(
      PROPERTIES_COLLECTION,
      'ownerId',
      currentUser.id
    );
    
    // Get requests/inquiries for this advertiser's listings
    const requests = await getAdvertiserRequests();
    const pendingReservations = requests.filter(req => 
      req.requestType === 'rent' && req.status === 'pending'
    ).length;
    
    const inquiriesCount = requests.length;
    
    // Get scheduled photoshoots
    const photoshoots = await getAdvertiserPhotoshoots();
    const photoshootsScheduled = photoshoots.length;
    
    return {
      totalProperties: properties.length,
      pendingReservations,
      photoshootsScheduled,
      inquiriesCount
    };
  } catch (error) {
    console.error('Error getting advertiser statistics:', error);
    throw new Error('Failed to get advertiser statistics');
  }
}

// Define Photoshoot interface
export interface Photoshoot {
  id: string;
  propertyId: string;
  date: Date;
  time: string;
  photographerId: string;
  photographerName: string;
  photographerInfo: string;
  photographerImage: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get all photoshoots for the advertiser's properties
 */
export async function getAdvertiserPhotoshoots(): Promise<Photoshoot[]> {
  try {
    // Check if user is authenticated and an advertiser
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.role !== 'advertiser') {
      throw new Error('Only advertisers can access their photoshoots');
    }
    
    // Get properties owned by this user
    const properties = await getDocumentsByField<Property>(
      PROPERTIES_COLLECTION,
      'ownerId',
      currentUser.id
    );
    
    // Get all photoshoots for these properties
    const propertyIds = properties.map(property => property.id);
    const photoshoots: Photoshoot[] = [];
    
    // For each property, get its photoshoots
    for (const propertyId of propertyIds) {
      const propertyPhotoshoots = await getDocumentsByField<Photoshoot>(
        'photoshoots',
        'propertyId',
        propertyId
      );
      photoshoots.push(...propertyPhotoshoots);
    }
    
    return photoshoots;
  } catch (error) {
    console.error('Error fetching advertiser photoshoots:', error);
    throw new Error('Failed to fetch advertiser photoshoots');
  }
}

/**
 * Get all requests for the advertiser's listings
 */
export async function getAdvertiserRequests(): Promise<Request[]> {
  try {
    // Check if user is authenticated and an advertiser
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.role !== 'advertiser') {
      throw new Error('Only advertisers can access their requests');
    }
    
    // Get all requests for these listings
    const requests: Request[] = [];
    
    // Get property-specific requests too
    const properties = await getDocumentsByField<Property>(
      PROPERTIES_COLLECTION,
      'ownerId',
      currentUser.id
    );
    
    const propertyIds = properties.map(property => property.id);
    
    for (const propertyId of propertyIds) {
      const propertyRequests = await getDocumentsByField<Request>(
        'requests',
        'propertyId',
        propertyId
      );
      
      // Filter out duplicates (requests that were already counted under listings)
      const uniqueRequests = propertyRequests.filter(
        req => !requests.some(r => r.id === req.id)
      );
      
      requests.push(...uniqueRequests);
    }
    
    return requests;
  } catch (error) {
    console.error('Error fetching advertiser requests:', error);
    throw new Error('Failed to fetch advertiser requests');
  }
}

/**
 * Get all reservation requests for the advertiser's properties
 */
export async function getAdvertiserReservationRequests(): Promise<{
  reservation: Request;
  property?: Property | null;
  client?: User | null;
}[]> {
  try {
    // Check if user is authenticated and an advertiser
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.role !== 'advertiser') {
      throw new Error('Only advertisers can access their reservation requests');
    }
    
    // Get properties owned by this user
    const properties = await getDocumentsByField<Property>(
      PROPERTIES_COLLECTION,
      'ownerId',
      currentUser.id
    );
    
    // Get all requests for these properties
    const propertyIds = properties.map(property => property.id);
    const requests: Request[] = [];
    
    // For each property, get its requests
    for (const propertyId of propertyIds) {
      const propertyRequests = await getDocumentsByField<Request>(
        'requests',
        'propertyId',
        propertyId
      );
      requests.push(...propertyRequests);
    }
    
    // For each request, get associated listing, property, and client info
    const reservationsWithDetails = await Promise.all(
      requests.map(async (request) => {
        let property = null;
        let client = null;
        
        // Get the client info
        client = await getDocumentById<User>(USERS_COLLECTION, request.userId);
        
        if (request.propertyId) {
          property = await getDocumentById<Property>(PROPERTIES_COLLECTION, request.propertyId);
        }
        
        return {
          reservation: request,
          property,
          client
        };
      })
    );
    
    return reservationsWithDetails;
  } catch (error) {
    console.error('Error fetching advertiser reservation requests:', error);
    throw new Error('Failed to fetch advertiser reservation requests');
  }
}

/**
 * Approve a reservation request
 */
export async function approveReservationRequest(requestId: string): Promise<boolean> {
  try {
    // Check if user is authenticated and an advertiser
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.role !== 'advertiser') {
      throw new Error('Only advertisers can approve reservation requests');
    }
    
    // Get the request
    const request = await getDocumentById<Request>('requests', requestId);
    if (!request) {
      throw new Error('Request not found');
    }
    
    // Verify that the request is for a property owned by this advertiser
    let isAuthorized = false;
    let property = null;
    
    if (request.propertyId) {
      property = await getDocumentById<Property>(PROPERTIES_COLLECTION, request.propertyId);
      if (property && property.ownerId === currentUser.id) {
        isAuthorized = true;
      }
    }
    
    if (!isAuthorized) {
      throw new Error('Not authorized to approve this request');
    }
    
    // Update the request status to accepted
    await updateDocument<Request>('requests', requestId, {
      status: 'accepted',
      updatedAt: new Date()
    });
    
    // Property status should already be 'occupied' at this point, but let's ensure it
    if (request.propertyId) {
      await updateDocument<Property>(PROPERTIES_COLLECTION, request.propertyId, {
        status: 'occupied',
        updatedAt: new Date()
      });
    }
    
    // Send notification to client about approved reservation
    try {
      if (property) {
        // Get user details for more personalized notifications
        const client = await getDocumentById<User>(USERS_COLLECTION, request.userId);
        
        // Create a reservation object for the notification
        const reservationForNotification = {
          id: request.id,
          propertyId: request.propertyId,
          propertyTitle: property.title || 'Property',
          startDate: request.scheduledDate || new Date(),
          endDate: null,
          clientId: request.userId,
          clientName: client ? `${client.name} ${client.surname}`.trim() : 'Client',
          advertiserName: `${currentUser.name} ${currentUser.surname}`.trim()
        };
        
        // Send notification using userNotifications helper
        await userNotifications.reservationAccepted(
          request.userId,
          reservationForNotification as any
        );
        
      }
    } catch (error) {
      console.error('Error sending reservation accepted notification:', error);
      // Don't throw error here so the main action can still succeed
    }
    
    return true;
  } catch (error) {
    console.error('Error approving reservation request:', error);
    throw new Error('Failed to approve reservation request');
  }
}

/**
 * Reject a reservation request
 */
export async function rejectReservationRequest(requestId: string): Promise<boolean> {
  try {
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.role !== 'advertiser') {
      throw new Error('Only advertisers can reject reservation requests');
    }
    
    // Get the request
    const request = await getDocumentById<Request>('requests', requestId);
    if (!request) {
      throw new Error('Request not found');
    }
    
    // Verify that the request is for a property owned by this advertiser
    let isAuthorized = false;
    let property = null;
    
    if (request.propertyId) {
      property = await getDocumentById<Property>(PROPERTIES_COLLECTION, request.propertyId);
      if (property && property.ownerId === currentUser.id) {
        isAuthorized = true;
      }
    }
    
    if (!isAuthorized) {
      throw new Error('Not authorized to reject this request');
    }
    
    // Update the request status to rejected
    await updateDocument<Request>('requests', requestId, {
      status: 'rejected',
      updatedAt: new Date()
    });
    
    // Change property status back to 'available' when reservation is rejected
    if (request.propertyId) {
      await updateDocument<Property>(PROPERTIES_COLLECTION, request.propertyId, {
        status: 'available',
        updatedAt: new Date()
      });
    }
    
    // Send notification to client about rejected reservation
    try {
      if (property) {
        // Get user details for more personalized notifications
        const client = await getDocumentById<User>(USERS_COLLECTION, request.userId);
        
        // Create a reservation object for the notification
        const reservationForNotification = {
          id: request.id,
          propertyId: request.propertyId,
          propertyTitle: property.title || 'Property',
          startDate: request.scheduledDate || new Date(),
          endDate: null,
          clientId: request.userId,
          clientName: client ? `${client.name} ${client.surname}`.trim() : 'Client',
          advertiserName: `${currentUser.name} ${currentUser.surname}`.trim()
        };
        
        // Optional reason for rejection
        const reason = request.message || 'No specific reason provided by advertiser.';
        
        // Send notification using userNotifications helper
        await userNotifications.reservationRejected(
          request.userId,
          reservationForNotification as any,
          reason
        );
        
      }
    } catch (error) {
      console.error('Error sending reservation rejected notification:', error);
      // Don't throw error here so the main action can still succeed
    }
    
    return true;
  } catch (error) {
    console.error('Error rejecting reservation request:', error);
    throw new Error('Failed to reject reservation request');
  }
}

/**
 * Check if a property has active reservations
 * @returns An object with hasActiveReservations flag and reason
 */
export async function checkPropertyHasActiveReservations(propertyId: string): Promise<{
  hasActiveReservations: boolean;
  reason: 'none' | 'completed' | 'pending' | 'accepted' | 'paid' | 'movedIn';
}> {
  try {
    // Check if user is authenticated and an advertiser
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.role !== 'advertiser') {
      throw new Error('Only advertisers can access their reservation data');
    }
    
    // Get all requests for this property
    const REQUESTS_COLLECTION = 'requests';
    const requests = await getDocumentsByField<Request>(
      REQUESTS_COLLECTION,
      'propertyId',
      propertyId
    );
    
    // Log the requests for debugging purposes
    
    // Check for moved-in tenants first (highest priority)
    const hasMovedInTenant = requests.some(req => 
      req.requestType === 'rent' && req.status === 'movedIn'
    );
    
    if (hasMovedInTenant) {
      return { hasActiveReservations: true, reason: 'movedIn' };
    }
    
    // Check for paid reservations
    const hasPaidReservation = requests.some(req => 
      req.requestType === 'rent' && req.status === 'paid'
    );
    
    if (hasPaidReservation) {
      return { hasActiveReservations: true, reason: 'paid' };
    }
    
    // Check for completed reservations
    const hasCompletedReservation = requests.some(req => 
      req.requestType === 'rent' && req.status === 'movedIn'
    );
    
    if (hasCompletedReservation) {
      return { hasActiveReservations: true, reason: 'completed' };
    }
    
    // Check for accepted reservations
    const hasAcceptedReservation = requests.some(req => 
      (req.requestType === 'rent' ) && req.status === 'accepted'
    );
    
    if (hasAcceptedReservation) {
      return { hasActiveReservations: true, reason: 'accepted' };
    }
    
    // Check for pending reservations
    const hasPendingReservation = requests.some(req => 
      (req.requestType === 'rent' ) && req.status === 'pending'
    );
    
    if (hasPendingReservation) {
      return { hasActiveReservations: true, reason: 'pending' };
    }
    
    // No active reservations
    return { hasActiveReservations: false, reason: 'none' };
  } catch (error) {
    console.error('Error checking if property has active reservations:', error);
    throw new Error('Failed to check property reservations');
  }
}

/**
 * Get all reviews for properties owned by the current advertiser
 */
export async function getAdvertiserPropertyReviews(): Promise<{
  review: Review;
  property: Property;
  reviewer: User | null;
}[]> {
  try {
    // Check if user is authenticated and an advertiser
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.role !== 'advertiser') {
      throw new Error('Only advertisers can access their property reviews');
    }
    
    // Get all properties owned by this advertiser
    const properties = await getDocumentsByField<Property>(
      PROPERTIES_COLLECTION,
      'ownerId',
      currentUser.id
    );
    
    // If no properties, return empty array
    if (!properties || properties.length === 0) {
      return [];
    }
    
    let allReviews: {
      review: Review;
      property: Property;
      reviewer: User | null;
    }[] = [];
    
    // For each property, get its reviews
    for (const property of properties) {
      // Skip properties without reviews
      if (!property.reviews || property.reviews.length === 0) {
        continue;
      }
      
      // Fetch each review by ID
      for (const reviewId of property.reviews) {
        const review = await getDocumentById<Review>('reviews', reviewId);
        
        if (review && review.published) {
          // Get reviewer information
          let reviewer = null;
          if (review.userId) {
            reviewer = await getDocumentById<User>(USERS_COLLECTION, review.userId);
          }
          
          allReviews.push({
            review,
            property,
            reviewer
          });
        }
      }
    }
    
    // Sort reviews by creation date (newest first)
    allReviews.sort((a, b) => {
      return new Date(b.review.createdAt).getTime() - new Date(a.review.createdAt).getTime();
    });
    
    return allReviews;
  } catch (error) {
    console.error('Error getting advertiser property reviews:', error);
    throw new Error('Failed to get advertiser property reviews');
  }
}

/**
 * Responds to a property inquiry from a client
 */
export async function respondToPropertyInquiry(
  inquiryId: string, 
  response: string, 
  status: 'answered' | 'rejected' = 'answered'
): Promise<boolean> {
  try {
    // Check if user is authenticated and an advertiser
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.role !== 'advertiser') {
      throw new Error('Only advertisers can respond to inquiries');
    }
    
    // Get the inquiry
    const inquiry = await getDocumentById<any>('inquiries', inquiryId);
    if (!inquiry) {
      throw new Error('Inquiry not found');
    }
    
    // Verify that the inquiry is for a property owned by this advertiser
    let isAuthorized = false;
    let property = null;
    
    if (inquiry.propertyId) {
      property = await getDocumentById<Property>(PROPERTIES_COLLECTION, inquiry.propertyId);
      if (property && property.ownerId === currentUser.id) {
        isAuthorized = true;
      }
    }
    
    if (!isAuthorized) {
      throw new Error('Not authorized to respond to this inquiry');
    }
    
    // Update the inquiry
    await updateDocument<Inquiry>('inquiries', inquiryId, {
      status: status,
      response: response,
      respondedAt: new Date(),
      updatedAt: new Date()
    });
    
    // Send notification to client about the response
    try {
      if (property) {
        // Get the client info
        const client = await getDocumentById<User>(USERS_COLLECTION, inquiry.userId);
        
        // Import NotificationService dynamically to avoid circular dependencies
        const NotificationService = (await import('../../services/NotificationService')).default;
        
        // Send notification
        await NotificationService.createNotification(
          inquiry.userId,
          'user',
          'inquiry_response' as any,
          status === 'answered' ? 'You Have a Response' : 'Inquiry Rejected',
          status === 'answered' 
            ? `Your inquiry about ${property.title} has been answered. Check your messages for the response.`
            : `Your inquiry about ${property.title} was rejected by the advertiser.`,
          `/dashboard/user/properties/${property.id}`,
          { 
            inquiryId,
            propertyId: property.id,
            response
          }
        );
        
      }
    } catch (error) {
      console.error('Error sending inquiry response notification:', error);
      // Don't throw error here so the main action can still succeed
    }
    
    return true;
  } catch (error) {
    console.error('Error responding to inquiry:', error);
    throw new Error('Failed to respond to inquiry');
  }
}

/**
 * Update property availability
 */
export async function updatePropertyAvailability(
  propertyId: string,
  isAvailable: boolean
): Promise<boolean> {
  try {
    // Check if user is authenticated and an advertiser
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.role !== 'advertiser') {
      throw new Error('Only advertisers can update property availability');
    }
    
    // Get the property
    const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, propertyId);
    if (!property) {
      throw new Error('Property not found');
    }
    
    // Verify ownership
    if (property.ownerId !== currentUser.id) {
      throw new Error('Not authorized to update this property');
    }
    
    // Check if property has reservations before making it unavailable
    if (!isAvailable) {
      const { hasActiveReservations } = await checkPropertyHasActiveReservations(propertyId);
      if (hasActiveReservations) {
        throw new Error('Cannot make property unavailable while it has active reservations');
      }
    }
    
    // Update property status
    await updateDocument<Property>(PROPERTIES_COLLECTION, propertyId, {
      status: isAvailable ? 'available' : 'occupied',
      updatedAt: new Date()
    });
    
    // Notify users who have this property in their favorites or have viewed it recently
    try {
      // Get users who have favorited this property
      const usersWithFavorite = await getDocumentsByField<User>(
        USERS_COLLECTION,
        'favorites',
        propertyId
      );
      
      if (usersWithFavorite.length > 0) {
        // Create notifications for these users about property availability change
        for (const user of usersWithFavorite) {
          // Only notify if the property status changed in a relevant way
          if ((!isAvailable && property.status === 'available') || 
              (isAvailable && property.status !== 'available')) {
                
            // Import NotificationService dynamically to avoid circular dependencies
            const NotificationService = (await import('../../services/NotificationService')).default;
            
            await NotificationService.createNotification(
              user.id,
              'user',
              'property_availability' as any,
              isAvailable ? 'Property Now Available' : 'Property No Longer Available',
              isAvailable 
                ? `A property you favorited, "${property.title}", is now available for booking.`
                : `A property you favorited, "${property.title}", is no longer available for booking.`,
              `/properties/${propertyId}`,
              { propertyId }
            );
            
          }
        }
      }
    } catch (error) {
      console.error('Error sending property availability notifications:', error);
      // Don't throw error here so the main action can still succeed
    }
    
    return true;
  } catch (error) {
    console.error('Error updating property availability:', error);
    throw new Error('Failed to update property availability');
  }
} 
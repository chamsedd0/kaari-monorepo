'use server';

import { User, Property } from '../entities';
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

// Collection names
const USERS_COLLECTION = 'users';
const PROPERTIES_COLLECTION = 'properties';
const LISTINGS_COLLECTION = 'listings';

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
 * Create a listing for a property
 */
export async function createListing(
  propertyId: string,
  listingData: Omit<Listing, 'id' | 'propertyId' | 'agentId' | 'createdAt' | 'updatedAt' | 'viewCount' | 'contactCount'>
): Promise<Listing> {
  try {
    // Check if user is authenticated and an advertiser
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.role !== 'advertiser') {
      throw new Error('Only advertisers can create listings');
    }
    
    // Verify property exists and belongs to user
    const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, propertyId);
    if (!property) {
      throw new Error('Property not found');
    }
    
    if (property.ownerId !== currentUser.id) {
      throw new Error('Not authorized to create listing for this property');
    }
    
    // Prepare listing data
    const fullListingData = {
      ...listingData,
      propertyId,
      agentId: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      contactCount: 0
    };
    
    // Create the listing using createDocument instead of createDocumentWithId
    const listing = await createDocument<Listing>(
      LISTINGS_COLLECTION,
      fullListingData as Omit<Listing, 'id'>
    );
    
    // Update property with listing reference
    await updateDocument<Property>(PROPERTIES_COLLECTION, propertyId, {
      listingId: listing.id,
      updatedAt: new Date()
    });
    
    // Add listing to user's listings array
    const userListings = currentUser.listings || [];
    await updateDocument<User>(USERS_COLLECTION, currentUser.id, {
      listings: [...userListings, listing.id]
    });
    
    return listing;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw new Error('Failed to create listing');
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
 * Get advertiser listings
 */
export async function getAdvertiserListings(): Promise<Listing[]> {
  try {
    // Check if user is authenticated and an advertiser
    const currentUser = await getCurrentUserProfile();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser.role !== 'advertiser') {
      throw new Error('Only advertisers can access their listings');
    }
    
    // Get all listings created by this user
    const listings = await getDocumentsByField<Listing>(
      LISTINGS_COLLECTION,
      'agentId',
      currentUser.id
    );
    
    return listings;
  } catch (error) {
    console.error('Error fetching advertiser listings:', error);
    throw new Error('Failed to fetch advertiser listings');
  }
}

/**
 * Get advertiser dashboard statistics
 */
export async function getAdvertiserStatistics(): Promise<{
  totalProperties: number;
  activeListings: number;
  pendingReservations: number;
  viewsCount: number;
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
    
    // Get listings created by this user
    const listings = await getDocumentsByField<Listing>(
      LISTINGS_COLLECTION,
      'agentId',
      currentUser.id
    );
    
    // Get active listings count
    const activeListings = listings.filter(listing => listing.status === 'active').length;
    
    // Get total view count across all listings
    const viewsCount = listings.reduce((total, listing) => total + (listing.viewCount || 0), 0);
    
    // Get requests/inquiries for this advertiser's listings
    const requests = await getAdvertiserRequests();
    const pendingReservations = requests.filter(req => 
      req.requestType === 'viewing' && req.status === 'pending'
    ).length;
    
    const inquiriesCount = requests.length;
    
    // Get scheduled photoshoots
    const photoshoots = await getAdvertiserPhotoshoots();
    const photoshootsScheduled = photoshoots.length;
    
    return {
      totalProperties: properties.length,
      activeListings,
      pendingReservations,
      viewsCount,
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

// Define Request interface if not already defined
export interface Request {
  id: string;
  userId: string;
  listingId?: string;
  propertyId?: string;
  requestType: 'viewing' | 'information' | 'offer' | 'general';
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  offerAmount?: number;
  createdAt: Date;
  updatedAt: Date;
  scheduledDate?: Date;
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
    
    // Get listings created by this user
    const listings = await getDocumentsByField<Listing>(
      LISTINGS_COLLECTION,
      'agentId',
      currentUser.id
    );
    
    // Get all requests for these listings
    const listingIds = listings.map(listing => listing.id);
    const requests: Request[] = [];
    
    // For each listing, get its requests
    for (const listingId of listingIds) {
      const listingRequests = await getDocumentsByField<Request>(
        'requests',
        'listingId',
        listingId
      );
      requests.push(...listingRequests);
    }
    
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
  listing?: Listing | null;
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
    
    // Get listing-specific requests too
    const listings = await getDocumentsByField<Listing>(
      LISTINGS_COLLECTION,
      'agentId',
      currentUser.id
    );
    
    const listingIds = listings.map(listing => listing.id);
    
    for (const listingId of listingIds) {
      const listingRequests = await getDocumentsByField<Request>(
        'requests',
        'listingId',
        listingId
      );
      
      // Filter out duplicates (requests that were already counted under properties)
      const uniqueRequests = listingRequests.filter(
        req => !requests.some(r => r.id === req.id)
      );
      
      requests.push(...uniqueRequests);
    }
    
    // For each request, get associated listing, property, and client info
    const reservationsWithDetails = await Promise.all(
      requests.map(async (request) => {
        let listing = null;
        let property = null;
        let client = null;
        
        // Get the client info
        client = await getDocumentById<User>(USERS_COLLECTION, request.userId);
        
        // If request has a listing ID, get the listing
        if (request.listingId) {
          listing = await getDocumentById<Listing>(LISTINGS_COLLECTION, request.listingId);
          
          // If listing found, get the property
          if (listing) {
            property = await getDocumentById<Property>(PROPERTIES_COLLECTION, listing.propertyId);
          }
        } 
        // If request has a property ID but no listing ID, get the property directly
        else if (request.propertyId) {
          property = await getDocumentById<Property>(PROPERTIES_COLLECTION, request.propertyId);
        }
        
        return {
          reservation: request,
          listing,
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
    
    if (request.propertyId) {
      const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, request.propertyId);
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
    
    if (request.propertyId) {
      const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, request.propertyId);
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
  reason: 'none' | 'completed' | 'pending' | 'accepted';
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
    
    // Check for completed reservations first (highest priority - tenant has moved in)
    const hasCompletedReservation = requests.some(req => 
      req.requestType === 'viewing' && req.status === 'completed'
    );
    
    if (hasCompletedReservation) {
      return { hasActiveReservations: true, reason: 'completed' };
    }
    
    // Check for accepted reservations
    const hasAcceptedReservation = requests.some(req => 
      req.requestType === 'viewing' && req.status === 'accepted'
    );
    
    if (hasAcceptedReservation) {
      return { hasActiveReservations: true, reason: 'accepted' };
    }
    
    // Check for pending reservations
    const hasPendingReservation = requests.some(req => 
      req.requestType === 'viewing' && req.status === 'pending'
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
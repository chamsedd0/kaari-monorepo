'use server';

import { Listing } from '../entities';
import { 
  getDocumentById, 
  createDocument, 
  updateDocument, 
  deleteDocument, 
  getDocuments,
  getDocumentsByField
} from '../firebase/firestore';
import { db } from '../firebase/config';
import { doc, increment, updateDoc } from 'firebase/firestore';

// Collection name for listings
const LISTINGS_COLLECTION = 'listings';

/**
 * Fetch a listing by ID
 */
export async function getListingById(listingId: string): Promise<Listing | null> {
  try {
    return await getDocumentById<Listing>(LISTINGS_COLLECTION, listingId);
  } catch (error) {
    console.error('Error fetching listing:', error);
    throw new Error('Failed to fetch listing');
  }
}

/**
 * Create a new listing
 */
export async function createListing(
  listingData: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'contactCount'>
): Promise<Listing> {
  try {
    // Create listing data with all required fields including timestamps
    const fullListingData = {
      ...listingData,
      viewCount: 0,
      contactCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Call createDocument with the right type and omit patterns
    return await createDocument<Listing>(
      LISTINGS_COLLECTION, 
      fullListingData as Omit<Listing, 'id'>
    );
  } catch (error) {
    console.error('Error creating listing:', error);
    throw new Error('Failed to create listing');
  }
}

/**
 * Update an existing listing
 */
export async function updateListing(listingId: string, listingData: Partial<Listing>): Promise<Listing> {
  try {
    return await updateDocument<Listing>(LISTINGS_COLLECTION, listingId, listingData);
  } catch (error) {
    console.error('Error updating listing:', error);
    throw new Error('Failed to update listing');
  }
}

/**
 * Delete a listing
 */
export async function deleteListing(listingId: string): Promise<boolean> {
  try {
    return await deleteDocument(LISTINGS_COLLECTION, listingId);
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw new Error('Failed to delete listing');
  }
}

/**
 * Get all listings (with optional pagination and filtering)
 */
export async function getListings(options?: { 
  limit?: number; 
  page?: number; 
  agentId?: string;
  listingType?: Listing['listingType'];
  status?: Listing['status'];
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Listing[]> {
  try {
    const filters: Array<{
      field: string;
      operator: '==' | '!=' | '>' | '>=' | '<' | '<=';
      value: unknown;
    }> = [];
    
    // Add filters based on options
    if (options?.agentId) {
      filters.push({
        field: 'agentId',
        operator: '==',
        value: options.agentId
      });
    }
    
    if (options?.listingType) {
      filters.push({
        field: 'listingType',
        operator: '==',
        value: options.listingType
      });
    }
    
    if (options?.status) {
      filters.push({
        field: 'status',
        operator: '==',
        value: options.status
      });
    }
    
    if (options?.featured !== undefined) {
      filters.push({
        field: 'featured',
        operator: '==',
        value: options.featured
      });
    }
    
    if (options?.minPrice) {
      filters.push({
        field: 'price',
        operator: '>=',
        value: options.minPrice
      });
    }
    
    if (options?.maxPrice) {
      filters.push({
        field: 'price',
        operator: '<=',
        value: options.maxPrice
      });
    }
    
    // Calculate startAfterId based on pagination
    let startAfterId;
    if (options?.page && options.page > 1 && options.limit) {
      const skipCount = (options.page - 1) * options.limit;
      const allListings = await getDocuments<Listing>(LISTINGS_COLLECTION, {
        filters,
        orderByField: 'createdAt',
        orderDirection: 'desc'
      });
      
      if (allListings.length > skipCount) {
        startAfterId = allListings[skipCount - 1].id;
      }
    }
    
    return await getDocuments<Listing>(LISTINGS_COLLECTION, {
      filters,
      orderByField: 'createdAt',
      orderDirection: 'desc',
      limit: options?.limit,
      startAfterId
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw new Error('Failed to fetch listings');
  }
}

/**
 * Get listings by agent
 */
export async function getListingsByAgent(agentId: string): Promise<Listing[]> {
  try {
    return await getDocumentsByField<Listing>(LISTINGS_COLLECTION, 'agentId', agentId);
  } catch (error) {
    console.error('Error fetching listings by agent:', error);
    throw new Error('Failed to fetch listings by agent');
  }
}

/**
 * Increment view count for a listing
 */
export async function incrementListingViewCount(listingId: string): Promise<void> {
  try {
    const listingRef = doc(db, LISTINGS_COLLECTION, listingId);
    await updateDoc(listingRef, {
      viewCount: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing listing view count:', error);
    throw new Error('Failed to increment listing view count');
  }
}

/**
 * Increment contact count for a listing
 */
export async function incrementListingContactCount(listingId: string): Promise<void> {
  try {
    const listingRef = doc(db, LISTINGS_COLLECTION, listingId);
    await updateDoc(listingRef, {
      contactCount: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing listing contact count:', error);
    throw new Error('Failed to increment listing contact count');
  }
} 
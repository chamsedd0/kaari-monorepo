'use server';

import { Request } from '../entities';
import { 
  getDocumentById, 
  createDocument, 
  updateDocument, 
  deleteDocument, 
  getDocuments,
  getDocumentsByField
} from '../firebase/firestore';

// Collection name for requests
const REQUESTS_COLLECTION = 'requests';

/**
 * Fetch a request by ID
 */
export async function getRequestById(requestId: string): Promise<Request | null> {
  try {
    return await getDocumentById<Request>(REQUESTS_COLLECTION, requestId);
  } catch (error) {
    console.error('Error fetching request:', error);
    throw new Error('Failed to fetch request');
  }
}

/**
 * Create a new request
 */
export async function createRequest(
  requestData: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Request> {
  try {
    // Create request data with timestamps
    const fullRequestData = {
      ...requestData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Call createDocument with the right type and omit patterns
    return await createDocument<Request>(
      REQUESTS_COLLECTION, 
      fullRequestData as Omit<Request, 'id'>
    );
  } catch (error) {
    console.error('Error creating request:', error);
    throw new Error('Failed to create request');
  }
}

/**
 * Update an existing request
 */
export async function updateRequest(requestId: string, requestData: Partial<Request>): Promise<Request> {
  try {
    return await updateDocument<Request>(REQUESTS_COLLECTION, requestId, requestData);
  } catch (error) {
    console.error('Error updating request:', error);
    throw new Error('Failed to update request');
  }
}

/**
 * Delete a request
 */
export async function deleteRequest(requestId: string): Promise<boolean> {
  try {
    return await deleteDocument(REQUESTS_COLLECTION, requestId);
  } catch (error) {
    console.error('Error deleting request:', error);
    throw new Error('Failed to delete request');
  }
}

/**
 * Get all requests (with optional pagination and filtering)
 */
export async function getRequests(options?: { 
  limit?: number; 
  page?: number; 
  userId?: string;
  listingId?: string;
  propertyId?: string;
  requestType?: Request['requestType'];
  status?: Request['status'];
}): Promise<Request[]> {
  try {
    const filters: Array<{
      field: string;
      operator: '==' | '!=' | '>' | '>=' | '<' | '<=';
      value: unknown;
    }> = [];
    
    // Add filters based on options
    if (options?.userId) {
      filters.push({
        field: 'userId',
        operator: '==',
        value: options.userId
      });
    }
    
    if (options?.listingId) {
      filters.push({
        field: 'listingId',
        operator: '==',
        value: options.listingId
      });
    }
    
    if (options?.propertyId) {
      filters.push({
        field: 'propertyId',
        operator: '==',
        value: options.propertyId
      });
    }
    
    if (options?.requestType) {
      filters.push({
        field: 'requestType',
        operator: '==',
        value: options.requestType
      });
    }
    
    if (options?.status) {
      filters.push({
        field: 'status',
        operator: '==',
        value: options.status
      });
    }
    
    // Calculate startAfterId based on pagination
    let startAfterId;
    if (options?.page && options.page > 1 && options.limit) {
      const skipCount = (options.page - 1) * options.limit;
      const allRequests = await getDocuments<Request>(REQUESTS_COLLECTION, {
        filters,
        orderByField: 'createdAt',
        orderDirection: 'desc'
      });
      
      if (allRequests.length > skipCount) {
        startAfterId = allRequests[skipCount - 1].id;
      }
    }
    
    return await getDocuments<Request>(REQUESTS_COLLECTION, {
      filters,
      orderByField: 'createdAt',
      orderDirection: 'desc',
      limit: options?.limit,
      startAfterId
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw new Error('Failed to fetch requests');
  }
}

/**
 * Get requests by user
 */
export async function getRequestsByUser(userId: string): Promise<Request[]> {
  try {
    return await getDocumentsByField<Request>(REQUESTS_COLLECTION, 'userId', userId);
  } catch (error) {
    console.error('Error fetching requests by user:', error);
    throw new Error('Failed to fetch requests by user');
  }
}

/**
 * Get requests for a specific listing
 */
export async function getRequestsByListing(listingId: string): Promise<Request[]> {
  try {
    return await getDocumentsByField<Request>(REQUESTS_COLLECTION, 'listingId', listingId);
  } catch (error) {
    console.error('Error fetching requests by listing:', error);
    throw new Error('Failed to fetch requests by listing');
  }
}

/**
 * Update the status of a request
 */
export async function updateRequestStatus(requestId: string, status: Request['status']): Promise<Request> {
  try {
    return await updateDocument<Request>(REQUESTS_COLLECTION, requestId, { status });
  } catch (error) {
    console.error('Error updating request status:', error);
    throw new Error('Failed to update request status');
  }
} 
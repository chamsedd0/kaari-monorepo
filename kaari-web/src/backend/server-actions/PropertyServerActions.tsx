'use server';

import { Property } from '../entities';
import { 
  getDocumentById, 
  createDocument, 
  updateDocument, 
  deleteDocument, 
  getDocuments,
  getDocumentsByField
} from '../firebase/firestore';

// Collection name for properties
const PROPERTIES_COLLECTION = 'properties';

/**
 * Fetch a property by ID
 */
export async function getPropertyById(propertyId: string): Promise<Property | null> {
  try {
    return await getDocumentById<Property>(PROPERTIES_COLLECTION, propertyId);
  } catch (error) {
    console.error('Error fetching property:', error);
    throw new Error('Failed to fetch property');
  }
}

/**
 * Create a new property
 */
export async function createProperty(
  propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Property> {
  try {
    // Create property data with timestamps
    const fullPropertyData = {
      ...propertyData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Call createDocument with the right type and omit patterns
    return await createDocument<Property>(
      PROPERTIES_COLLECTION, 
      fullPropertyData as Omit<Property, 'id'>
    );
  } catch (error) {
    console.error('Error creating property:', error);
    throw new Error('Failed to create property');
  }
}

/**
 * Update an existing property
 */
export async function updateProperty(propertyId: string, propertyData: Partial<Property>): Promise<Property> {
  try {
    return await updateDocument<Property>(PROPERTIES_COLLECTION, propertyId, propertyData);
  } catch (error) {
    console.error('Error updating property:', error);
    throw new Error('Failed to update property');
  }
}

/**
 * Delete a property
 */
export async function deleteProperty(propertyId: string): Promise<boolean> {
  try {
    return await deleteDocument(PROPERTIES_COLLECTION, propertyId);
  } catch (error) {
    console.error('Error deleting property:', error);
    throw new Error('Failed to delete property');
  }
}

/**
 * Get all properties (with optional pagination and filtering)
 */
export async function getProperties(options?: { 
  limit?: number; 
  page?: number; 
  ownerId?: string;
  propertyType?: Property['propertyType'];
  status?: Property['status'];
  minPrice?: number;
  maxPrice?: number;
}): Promise<Property[]> {
  try {
    const filters: Array<{
      field: string;
      operator: '==' | '!=' | '>' | '>=' | '<' | '<=';
      value: any;
    }> = [];
    
    // Add filters based on options
    if (options?.ownerId) {
      filters.push({
        field: 'ownerId',
        operator: '==',
        value: options.ownerId
      });
    }
    
    if (options?.propertyType) {
      filters.push({
        field: 'propertyType',
        operator: '==',
        value: options.propertyType
      });
    }
    
    if (options?.status) {
      filters.push({
        field: 'status',
        operator: '==',
        value: options.status
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
      const allProperties = await getDocuments<Property>(PROPERTIES_COLLECTION, {
        filters,
        orderByField: 'createdAt',
        orderDirection: 'desc'
      });
      
      if (allProperties.length > skipCount) {
        startAfterId = allProperties[skipCount - 1].id;
      }
    }
    
    return await getDocuments<Property>(PROPERTIES_COLLECTION, {
      filters,
      orderByField: 'createdAt',
      orderDirection: 'desc',
      limit: options?.limit,
      startAfterId
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw new Error('Failed to fetch properties');
  }
}

/**
 * Get properties owned by a specific user
 */
export async function getPropertiesByOwner(ownerId: string): Promise<Property[]> {
  try {
    return await getDocumentsByField<Property>(PROPERTIES_COLLECTION, 'ownerId', ownerId);
  } catch (error) {
    console.error('Error fetching properties by owner:', error);
    throw new Error('Failed to fetch properties by owner');
  }
} 
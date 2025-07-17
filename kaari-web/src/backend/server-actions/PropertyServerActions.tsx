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
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  createPropertyRefreshReminderNotification,
  createPropertyRefreshWarningNotification,
  createMultiplePropertiesRefreshNotification
} from '../../utils/notification-helpers';
import { getDaysSinceLastRefresh } from '../../utils/property-refresh-utils';

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
      updatedAt: new Date(),
      // Initialize new fields with default values if not provided
      housingPreference: propertyData.housingPreference || '',
      petsAllowed: propertyData.petsAllowed || false,
      smokingAllowed: propertyData.smokingAllowed || false,

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
  showAllStatuses?: boolean; // New option to override default filtering
}): Promise<Property[]> {
  try {
    const filters: Array<{
      field: string;
      operator: '==' | '!=' | '>' | '>=' | '<' | '<=';
      value: unknown;
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
    
    // If a specific status filter is provided, use it
    if (options?.status) {
      filters.push({
        field: 'status',
        operator: '==',
        value: options.status
      });
    } 
    // Otherwise, by default only show available properties unless showAllStatuses is true
    else if (!options?.showAllStatuses) {
      filters.push({
        field: 'status',
        operator: '==',
        value: 'available'
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

/**
 * Get properties by advertiser ID for the Advertiser Moderation page
 */
export async function getPropertiesByAdvertiserId(advertiserId: string): Promise<any[]> {
  try {
    // Properties use ownerId, not advertiserId
    const properties = await getDocumentsByField<Property>(PROPERTIES_COLLECTION, 'ownerId', advertiserId);
    
    return properties.map(property => {
      // Format next availability date
      let nextAvailability = 'Not specified';
      if (property.availableFrom) {
        const date = property.availableFrom instanceof Date 
          ? property.availableFrom 
          : new Date(property.availableFrom);
        nextAvailability = date.toLocaleDateString();
      }
      
      return {
        id: property.id,
        title: property.title || 'Untitled Property',
        city: property.address?.city || 'Unknown',
        // Status is 'available' in the database, but we display as 'live' or 'hidden'
        status: property.status === 'available' ? 'live' : 'hidden',
        nextAvailability
      };
    });
  } catch (error) {
    console.error('Error fetching properties by advertiser ID:', error);
    throw new Error('Failed to fetch properties by advertiser ID');
  }
}

/**
 * Initialize sample property data for development
 */
export async function initializeSampleData(): Promise<string[]> {
  try {
    const propertyIds: string[] = [];
    
    const sampleProperties: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        ownerId: 'user123',
        title: 'Luxury Villa',
        description: 'Beautiful oceanfront villa with amazing views',
        address: {
          street: 'Ocean Drive',
          city: 'Miami',
          state: 'FL',
          zipCode: '33139',
          country: 'USA',
        },
        propertyType: 'house',
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        price: 1250000,
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
          'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83',
        ],
        amenities: ['Pool', 'Garage', 'Garden', 'Security System'],
        features: ['Ocean View', 'Private Beach Access', 'Modern Kitchen'],
        status: 'available',
      },
      {
        ownerId: 'user456',
        title: 'Downtown Apartment',
        description: 'Modern apartment in the heart of the city',
        address: {
          street: 'Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        propertyType: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        price: 750000,
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
          'https://images.unsplash.com/photo-1565182999561-f25ce4782591',
        ],
        amenities: ['Gym', 'Doorman', 'Elevator', 'Rooftop Deck'],
        features: ['City View', 'Hardwood Floors', 'Stainless Steel Appliances'],
        status: 'available',
      },
      {
        ownerId: 'user789',
        title: 'Cozy Condo',
        description: 'Well-maintained condo in a quiet neighborhood',
        address: {
          street: 'Park Avenue',
          city: 'Boston',
          state: 'MA',
          zipCode: '02108',
          country: 'USA',
        },
        propertyType: 'condo',
        bedrooms: 1,
        bathrooms: 1,
        area: 800,
        price: 450000,
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
        ],
        amenities: ['Parking', 'Storage', 'Laundry'],
        features: ['Updated Kitchen', 'New Appliances', 'Walk-in Closet'],
        status: 'available',
      },
      {
        ownerId: 'user123',
        title: 'Commercial Space',
        description: 'Prime commercial property in business district',
        address: {
          street: 'Business Blvd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA',
        },
        propertyType: 'commercial',
        area: 3000,
        price: 2000000,
        images: [
          'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
          'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
        ],
        amenities: ['Parking', 'Security', 'Loading Dock', 'HVAC'],
        features: ['Corner Lot', 'High Visibility', 'Recently Renovated'],
        status: 'available',
      },
      {
        ownerId: 'user456',
        title: 'Vacant Land',
        description: 'Beautiful plot ready for development',
        address: {
          street: 'Country Road',
          city: 'Austin',
          state: 'TX',
          zipCode: '78701',
          country: 'USA',
        },
        propertyType: 'land',
        area: 10000,
        price: 350000,
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
          'https://images.unsplash.com/photo-1473448912268-2022ce9509d8',
        ],
        amenities: ['Utilities Available', 'Road Access'],
        features: ['Mountain View', 'Creek', 'Wooded'],
        status: 'available',
      }
    ];
    
    for (const property of sampleProperties) {
      // Create property with timestamps
      const fullPropertyData = {
        ...property,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const newProperty = await createDocument<Property>(
        PROPERTIES_COLLECTION, 
        fullPropertyData as Omit<Property, 'id'>
      );
      
      propertyIds.push(newProperty.id);
    }
    
    return propertyIds;
  } catch (error) {
    console.error('Error initializing sample property data:', error);
    throw error;
  }
}

/**
 * Remove all sample property data
 */
export async function removeSampleData(): Promise<{ count: number }> {
  try {
    // The owner IDs used in the sample data
    const sampleOwnerIds = ['user123', 'user456', 'user789'];
    let deletedCount = 0;
    
    // Create queries for each sample owner ID
    for (const ownerId of sampleOwnerIds) {
      const properties = await getDocumentsByField<Property>(PROPERTIES_COLLECTION, 'ownerId', ownerId);
      
      if (properties.length === 0) {
        console.log(`No sample properties found for owner ${ownerId}`);
        continue;
      }
      
      console.log(`Deleting ${properties.length} sample properties for owner ${ownerId}`);
      
      // Delete all properties for this owner
      for (const property of properties) {
        await deleteDocument(PROPERTIES_COLLECTION, property.id);
        deletedCount++;
      }
    }
    
    return { count: deletedCount };
  } catch (error) {
    console.error('Error removing sample property data:', error);
    throw error;
  }
}

/**
 * Refresh property availability - updates the lastAvailabilityRefresh timestamp
 */
export const refreshPropertyAvailability = async (propertyId: string): Promise<void> => {
  try {
    const propertyRef = doc(db, PROPERTIES_COLLECTION, propertyId);
    
    await updateDoc(propertyRef, {
      lastAvailabilityRefresh: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log(`Property ${propertyId} availability refreshed successfully`);
  } catch (error) {
    console.error(`Error refreshing property ${propertyId} availability:`, error);
    throw error;
  }
};

/**
 * Check all properties and send refresh notifications to advertisers
 * This function should be called daily by a scheduled job
 */
export async function checkAndSendPropertyRefreshNotifications(): Promise<void> {
  try {
    console.log('Starting property refresh notification check...');
    
    // Get all properties
    const properties = await getDocuments<Property>(PROPERTIES_COLLECTION, {
      filters: [
        { field: 'status', operator: '==', value: 'available' }
      ]
    });
    
    // Group properties by advertiser
    const propertiesByAdvertiser = new Map<string, Property[]>();
    
    for (const property of properties) {
      if (!propertiesByAdvertiser.has(property.ownerId)) {
        propertiesByAdvertiser.set(property.ownerId, []);
      }
      propertiesByAdvertiser.get(property.ownerId)!.push(property);
    }
    
    // Check each advertiser's properties
    for (const [advertiserId, advertiserProperties] of propertiesByAdvertiser) {
      const propertiesNeedingReminder: Property[] = [];
      const propertiesNeedingWarning: Property[] = [];
      
      for (const property of advertiserProperties) {
        const daysSinceRefresh = getDaysSinceLastRefresh(property);
        
        // Check if property needs warning (14+ days)
        if (daysSinceRefresh >= 14) {
          propertiesNeedingWarning.push(property);
        }
        // Check if property needs reminder (7+ days but less than 14)
        else if (daysSinceRefresh >= 7) {
          propertiesNeedingReminder.push(property);
        }
      }
      
      // Send notifications based on what's needed
      if (propertiesNeedingWarning.length > 0) {
        // Send warning notifications for urgent properties
        if (propertiesNeedingWarning.length === 1) {
          const property = propertiesNeedingWarning[0];
          const daysSinceRefresh = getDaysSinceLastRefresh(property);
          await createPropertyRefreshWarningNotification(
            advertiserId,
            property.title,
            property.id,
            daysSinceRefresh
          );
        } else {
          // Multiple urgent properties
          await createMultiplePropertiesRefreshNotification(
            advertiserId,
            propertiesNeedingWarning.length + propertiesNeedingReminder.length,
            propertiesNeedingWarning.length
          );
        }
      } else if (propertiesNeedingReminder.length > 0) {
        // Send reminder notifications for properties needing refresh
        if (propertiesNeedingReminder.length === 1) {
          const property = propertiesNeedingReminder[0];
          const daysSinceRefresh = getDaysSinceLastRefresh(property);
          await createPropertyRefreshReminderNotification(
            advertiserId,
            property.title,
            property.id,
            daysSinceRefresh
          );
        } else {
          // Multiple properties need reminder
          await createMultiplePropertiesRefreshNotification(
            advertiserId,
            propertiesNeedingReminder.length,
            0
          );
        }
      }
      
      // Log what was sent
      if (propertiesNeedingWarning.length > 0 || propertiesNeedingReminder.length > 0) {
        console.log(`Sent notifications to advertiser ${advertiserId}: ${propertiesNeedingWarning.length} warnings, ${propertiesNeedingReminder.length} reminders`);
      }
    }
    
    console.log('Property refresh notification check completed');
  } catch (error) {
    console.error('Error checking and sending property refresh notifications:', error);
    throw error;
  }
}

/**
 * Test function to manually trigger property refresh notifications
 * This can be called from the admin dashboard for testing
 */
export async function testPropertyRefreshNotifications(): Promise<{ 
  success: boolean; 
  message: string; 
  details: any 
}> {
  try {
    console.log('Testing property refresh notifications...');
    
    // Get all properties
    const properties = await getDocuments<Property>(PROPERTIES_COLLECTION, {
      filters: [
        { field: 'status', operator: '==', value: 'available' }
      ]
    });
    
    // Group properties by advertiser
    const propertiesByAdvertiser = new Map<string, Property[]>();
    
    for (const property of properties) {
      if (!propertiesByAdvertiser.has(property.ownerId)) {
        propertiesByAdvertiser.set(property.ownerId, []);
      }
      propertiesByAdvertiser.get(property.ownerId)!.push(property);
    }
    
    const results = {
      totalAdvertisers: propertiesByAdvertiser.size,
      totalProperties: properties.length,
      notificationsSent: 0,
      details: [] as any[]
    };
    
    // Check each advertiser's properties
    for (const [advertiserId, advertiserProperties] of propertiesByAdvertiser) {
      const propertiesNeedingReminder: Property[] = [];
      const propertiesNeedingWarning: Property[] = [];
      
      for (const property of advertiserProperties) {
        const daysSinceRefresh = getDaysSinceLastRefresh(property);
        
        // For testing, lower the thresholds to see results
        if (daysSinceRefresh >= 3) { // Test: 3+ days for warning (normally 14)
          propertiesNeedingWarning.push(property);
        } else if (daysSinceRefresh >= 1) { // Test: 1+ days for reminder (normally 7)
          propertiesNeedingReminder.push(property);
        }
      }
      
      // Send notifications if needed
      if (propertiesNeedingWarning.length > 0 || propertiesNeedingReminder.length > 0) {
        // Send test notifications
        if (propertiesNeedingWarning.length > 0) {
          if (propertiesNeedingWarning.length === 1) {
            const property = propertiesNeedingWarning[0];
            const daysSinceRefresh = getDaysSinceLastRefresh(property);
            await createPropertyRefreshWarningNotification(
              advertiserId,
              property.title,
              property.id,
              daysSinceRefresh
            );
          } else {
            await createMultiplePropertiesRefreshNotification(
              advertiserId,
              propertiesNeedingWarning.length + propertiesNeedingReminder.length,
              propertiesNeedingWarning.length
            );
          }
        } else if (propertiesNeedingReminder.length > 0) {
          if (propertiesNeedingReminder.length === 1) {
            const property = propertiesNeedingReminder[0];
            const daysSinceRefresh = getDaysSinceLastRefresh(property);
            await createPropertyRefreshReminderNotification(
              advertiserId,
              property.title,
              property.id,
              daysSinceRefresh
            );
          } else {
            await createMultiplePropertiesRefreshNotification(
              advertiserId,
              propertiesNeedingReminder.length,
              0
            );
          }
        }
        
        results.notificationsSent++;
        results.details.push({
          advertiserId,
          propertiesTotal: advertiserProperties.length,
          propertiesNeedingReminder: propertiesNeedingReminder.length,
          propertiesNeedingWarning: propertiesNeedingWarning.length
        });
      }
    }
    
    return {
      success: true,
      message: `Test completed. Sent notifications to ${results.notificationsSent} advertisers.`,
      details: results
    };
  } catch (error) {
    console.error('Error testing property refresh notifications:', error);
    return {
      success: false,
      message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: null
    };
  }
} 
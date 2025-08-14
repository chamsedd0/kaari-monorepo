import { Property } from '../../backend/entities';
import { getDocumentById, createDocument, updateDocument, deleteDocument, getDocuments, getDocumentsByField } from '../firebase/firestore';

const PROPERTIES_COLLECTION = 'properties';

export async function getPropertyById(propertyId: string): Promise<Property | null> {
  return await getDocumentById<Property>(PROPERTIES_COLLECTION, propertyId);
}

export async function createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
  const payload = {
    ...propertyData,
    createdAt: new Date(),
    updatedAt: new Date(),
    housingPreference: propertyData.housingPreference || '',
    petsAllowed: propertyData.petsAllowed ?? false,
    smokingAllowed: propertyData.smokingAllowed ?? false
  } as any;
  return await createDocument<Property>(PROPERTIES_COLLECTION, payload);
}

export async function updateProperty(propertyId: string, partial: Partial<Property>): Promise<Property> {
  return await updateDocument<Property>(PROPERTIES_COLLECTION, propertyId, partial);
}

export async function deleteProperty(propertyId: string): Promise<boolean> {
  return await deleteDocument(PROPERTIES_COLLECTION, propertyId);
}

export async function getProperties(options?: {
  ownerId?: string;
  propertyType?: Property['propertyType'];
  status?: Property['status'];
  minPrice?: number;
  maxPrice?: number;
  showAllStatuses?: boolean;
  requireActiveListing?: boolean;
  limit?: number;
}): Promise<Property[]> {
  const filters: Array<{ field: string; operator: any; value: unknown }> = [];
  if (options?.ownerId) filters.push({ field: 'ownerId', operator: '==', value: options.ownerId });
  if (options?.propertyType) filters.push({ field: 'propertyType', operator: '==', value: options.propertyType });
  if (options?.status) filters.push({ field: 'status', operator: '==', value: options.status });
  else if (!options?.showAllStatuses) filters.push({ field: 'status', operator: '==', value: 'available' });
  if (options?.requireActiveListing) filters.push({ field: 'listingStatus', operator: '==', value: 'active' });
  if (options?.minPrice) filters.push({ field: 'price', operator: '>=', value: options.minPrice });
  if (options?.maxPrice) filters.push({ field: 'price', operator: '<=', value: options.maxPrice });

  return await getDocuments<Property>(PROPERTIES_COLLECTION, {
    filters,
    orderByField: 'createdAt',
    orderDirection: 'desc',
    limit: options?.limit
  });
}

export async function getPropertiesByOwner(ownerId: string): Promise<Property[]> {
  return await getDocumentsByField<Property>(PROPERTIES_COLLECTION, 'ownerId', ownerId);
}



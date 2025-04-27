'use server';

import { createDocument, getDocumentById, getDocumentsByField, updateDocument } from '../firebase/firestore';
import { getCurrentUserProfile } from '../firebase/auth';
import { User } from '../entities';
import { EditRequestFormData } from '../../components/skeletons/constructed/modals/property-edit-request-modal';

// Define edit request interface
export interface PropertyEditRequest {
  id: string;
  propertyId: string;
  requesterId: string;
  requesterName: string;
  propertyTitle: string;
  additionalAmenities: string[];
  includedFees: string[];
  additionalComments: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  adminResponse?: string;
}

// Collection name
const PROPERTY_EDIT_REQUESTS_COLLECTION = 'property-edit-requests';

/**
 * Submit a property edit request
 */
export async function submitPropertyEditRequest(
  formData: EditRequestFormData & { propertyTitle: string }
): Promise<PropertyEditRequest> {
  try {
    // Get current user
    const currentUser = await getCurrentUserProfile();
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const { propertyId, additionalAmenities, includedFees, additionalComments, propertyTitle } = formData;
    
    // Create request data
    const requestData = {
      propertyId,
      requesterId: currentUser.id,
      requesterName: currentUser.name || 'Unknown user',
      propertyTitle,
      additionalAmenities,
      includedFees,
      additionalComments,
      status: 'pending' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create document
    const request = await createDocument<PropertyEditRequest>(
      PROPERTY_EDIT_REQUESTS_COLLECTION,
      requestData as Omit<PropertyEditRequest, 'id'>
    );
    
    return request;
  } catch (error) {
    console.error('Error submitting property edit request:', error);
    throw new Error('Failed to submit property edit request');
  }
}

/**
 * Get all edit requests for a property
 */
export async function getPropertyEditRequests(propertyId: string): Promise<PropertyEditRequest[]> {
  try {
    return await getDocumentsByField<PropertyEditRequest>(
      PROPERTY_EDIT_REQUESTS_COLLECTION,
      'propertyId',
      propertyId
    );
  } catch (error) {
    console.error('Error fetching property edit requests:', error);
    throw new Error('Failed to fetch property edit requests');
  }
}

/**
 * Get all edit requests by a user
 */
export async function getUserEditRequests(): Promise<PropertyEditRequest[]> {
  try {
    const currentUser = await getCurrentUserProfile();
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    return await getDocumentsByField<PropertyEditRequest>(
      PROPERTY_EDIT_REQUESTS_COLLECTION,
      'requesterId',
      currentUser.id
    );
  } catch (error) {
    console.error('Error fetching user edit requests:', error);
    throw new Error('Failed to fetch user edit requests');
  }
}

/**
 * Get all pending edit requests (admin function)
 */
export async function getAllPendingEditRequests(): Promise<PropertyEditRequest[]> {
  try {
    const currentUser = await getCurrentUserProfile();
    
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Not authorized to access admin functions');
    }
    
    return await getDocumentsByField<PropertyEditRequest>(
      PROPERTY_EDIT_REQUESTS_COLLECTION,
      'status',
      'pending'
    );
  } catch (error) {
    console.error('Error fetching pending edit requests:', error);
    throw new Error('Failed to fetch pending edit requests');
  }
}

/**
 * Approve or reject an edit request (admin function)
 */
export async function updateEditRequestStatus(
  requestId: string, 
  status: 'approved' | 'rejected',
  adminResponse?: string
): Promise<PropertyEditRequest> {
  try {
    const currentUser = await getCurrentUserProfile();
    
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Not authorized to access admin functions');
    }
    
    return await updateDocument<PropertyEditRequest>(
      PROPERTY_EDIT_REQUESTS_COLLECTION, 
      requestId, 
      {
        status,
        adminResponse,
        updatedAt: new Date()
      }
    );
  } catch (error) {
    console.error('Error updating edit request status:', error);
    throw new Error('Failed to update edit request status');
  }
} 
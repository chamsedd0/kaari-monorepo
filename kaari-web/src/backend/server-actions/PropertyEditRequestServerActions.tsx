'use server';

import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { getCurrentUserProfile } from '../firebase/auth';
import { User } from '../entities';
import { EditRequestFormData } from '../../components/skeletons/constructed/modals/property-edit-request-modal';
import { updateProperty } from './PropertyServerActions';
import { createDocument, getDocumentsByField, getDocumentById, updateDocument } from '../firebase/firestore';

// Define edit request interface
export interface PropertyEditRequest {
  id: string;
  propertyId: string;
  requesterId: string;
  requesterName: string;
  propertyTitle: string;
  additionalAmenities: string[];
  features: string[];
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
      features: includedFees,
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
    
    // Get the edit request details
    const editRequest = await getDocumentById<PropertyEditRequest>(
      PROPERTY_EDIT_REQUESTS_COLLECTION,
      requestId
    );
    
    if (!editRequest) {
      throw new Error('Edit request not found');
    }
    
    // If approving, apply the changes to the property
    if (status === 'approved' && editRequest.propertyId) {
      // Get the existing property
      const propertyData: any = {}; // Create an object to hold the property updates
      
      // Add amenities if they were requested
      if (editRequest.additionalAmenities && editRequest.additionalAmenities.length > 0) {
        propertyData.amenities = editRequest.additionalAmenities;
      }
      
      // Add features if they were requested
      if (editRequest.features && editRequest.features.length > 0) {
        propertyData.features = editRequest.features;
      }
      
      // Update the property with the requested changes
      if (Object.keys(propertyData).length > 0) {
        await updateProperty(editRequest.propertyId, propertyData);
        console.log(`Property ${editRequest.propertyId} updated with requested changes`);
      }
    }
    
    // Update the edit request status
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

export const approvePropertyEditRequest = async (requestId: string) => {
  try {
    const editRequest = await getDocumentById(PROPERTY_EDIT_REQUESTS_COLLECTION, requestId) as PropertyEditRequest;
    if (!editRequest) {
      throw new Error('Edit request not found');
    }

    // Create the requested changes object
    const requestedChanges = {
      amenities: editRequest.additionalAmenities || [],
      features: editRequest.features || [],
      additionalComments: editRequest.additionalComments
    };

    // Update the edit request status
    await updateDoc(doc(db, PROPERTY_EDIT_REQUESTS_COLLECTION, requestId), {
      status: 'approved',
      updatedAt: Date.now()
    });

    return {
      success: true,
      propertyId: editRequest.propertyId,
      requestedChanges
    };
  } catch (error) {
    console.error('Error approving property edit request:', error);
    throw error;
  }
}; 
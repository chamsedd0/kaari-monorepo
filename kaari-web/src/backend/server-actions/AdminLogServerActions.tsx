'use server';

import { AdminLog } from '../entities';
import { 
  createDocument, 
  getDocuments,
  getDocumentsByField
} from '../firebase/firestore';

// Collection name for admin logs
const ADMIN_LOGS_COLLECTION = 'adminLogs';

/**
 * Create a new admin log entry
 */
export async function createAdminLog(
  logData: Omit<AdminLog, 'id' | 'createdAt'>
): Promise<AdminLog> {
  try {
    const fullLogData = {
      ...logData,
      createdAt: new Date(),
    };
    
    return await createDocument<AdminLog>(
      ADMIN_LOGS_COLLECTION, 
      fullLogData as Omit<AdminLog, 'id'>
    );
  } catch (error) {
    console.error('Error creating admin log:', error);
    throw new Error('Failed to create admin log');
  }
}

/**
 * Get all admin logs with optional filtering and pagination
 */
export async function getAdminLogs(options?: { 
  limit?: number; 
  action?: AdminLog['action'];
  targetUserId?: string;
  targetPropertyId?: string;
  performedBy?: string;
}): Promise<AdminLog[]> {
  try {
    const filters: Array<{
      field: string;
      operator: '==' | '!=' | '>' | '>=' | '<' | '<=';
      value: unknown;
    }> = [];
    
    // Add filters based on options
    if (options?.action) {
      filters.push({
        field: 'action',
        operator: '==',
        value: options.action
      });
    }
    
    if (options?.targetUserId) {
      filters.push({
        field: 'targetUserId',
        operator: '==',
        value: options.targetUserId
      });
    }
    
    if (options?.targetPropertyId) {
      filters.push({
        field: 'targetPropertyId',
        operator: '==',
        value: options.targetPropertyId
      });
    }
    
    if (options?.performedBy) {
      filters.push({
        field: 'performedBy',
        operator: '==',
        value: options.performedBy
      });
    }
    
    return await getDocuments<AdminLog>(ADMIN_LOGS_COLLECTION, {
      filters,
      orderByField: 'createdAt',
      orderDirection: 'desc',
      limit: options?.limit || 100
    });
  } catch (error) {
    console.error('Error fetching admin logs:', error);
    throw new Error('Failed to fetch admin logs');
  }
}

/**
 * Get admin logs for property refresh actions
 */
export async function getPropertyRefreshLogs(propertyId?: string): Promise<AdminLog[]> {
  try {
    if (propertyId) {
      return await getAdminLogs({
        action: 'property_refresh',
        targetPropertyId: propertyId,
        limit: 50
      });
    } else {
      return await getAdminLogs({
        action: 'property_refresh',
        limit: 100
      });
    }
  } catch (error) {
    console.error('Error fetching property refresh logs:', error);
    throw new Error('Failed to fetch property refresh logs');
  }
}

/**
 * Log a property refresh action
 */
export async function logPropertyRefresh(
  propertyId: string,
  propertyTitle: string,
  advertiserId: string,
  advertiserName?: string
): Promise<void> {
  try {
    await createAdminLog({
      action: 'property_refresh',
      description: `Property "${propertyTitle}" availability refreshed by advertiser ${advertiserName || advertiserId}`,
      targetUserId: advertiserId,
      targetPropertyId: propertyId,
      metadata: {
        propertyTitle,
        advertiserName,
        refreshType: 'manual'
      }
    });
    
  } catch (error) {
    console.error('Error logging property refresh:', error);
    // Don't throw error here as logging shouldn't break the main functionality
  }
} 
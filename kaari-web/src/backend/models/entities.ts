export interface Property {
  // ... existing code ...
}

export interface PropertyEditRequest {
  id: string;
  propertyId: string;
  propertyOwnerId: string;
  requestedChanges: Partial<Property>;
  originalData: Partial<Property>;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  createdAt: number;
  updatedAt: number;
} 
export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  price: number;
  images: string[];
  amenities: string[];
  features: string[];
  status: 'available' | 'unavailable' | 'pending' | 'sold' | 'rented';
  createdAt: Date;
  updatedAt: Date;
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
// Define the core entity interfaces for the application

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  profilePicture?: string;
  role: 'admin' | 'agent' | 'client';
  createdAt: Date;
  updatedAt: Date;
  properties?: string[]; // References to property IDs owned by this user
  listings?: string[]; // References to listing IDs created by this user
  requests?: string[]; // References to request IDs made by this user
}

export interface Property {
  id: string;
  ownerId: string; // Reference to the User ID who owns this property
  title: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  propertyType: 'apartment' | 'house' | 'condo' | 'land' | 'commercial';
  bedrooms?: number;
  bathrooms?: number;
  area: number; // in square feet/meters
  price: number;
  images: string[]; // URLs to property images
  amenities: string[];
  features: string[];
  status: 'available' | 'sold' | 'pending' | 'rented';
  createdAt: Date;
  updatedAt: Date;
  listingId?: string; // Reference to the listing if this property is listed
}

export interface Listing {
  id: string;
  propertyId: string; // Reference to the Property ID
  agentId: string; // Reference to the User ID (agent) who created this listing
  title: string;
  description: string;
  listingType: 'sale' | 'rent';
  price: number;
  deposit?: number; // For rentals
  leaseTerm?: string; // For rentals
  featured: boolean;
  status: 'active' | 'inactive' | 'expired' | 'sold' | 'rented';
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  viewCount: number;
  contactCount: number;
}

export interface Request {
  id: string;
  userId: string; // Reference to the User ID who made the request
  listingId?: string; // Reference to the Listing ID if related to a specific listing
  propertyId?: string; // Reference to the Property ID if related to a specific property
  requestType: 'viewing' | 'information' | 'offer' | 'general';
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  offerAmount?: number; // In case this is an offer
  createdAt: Date;
  updatedAt: Date;
  scheduledDate?: Date; // For viewings
} 
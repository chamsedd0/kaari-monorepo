// Define the core entity interfaces for the application

export interface User {
  id: string;
  email: string;
  name: string;
  surname?: string;
  phoneNumber?: string;
  profilePicture?: string;
  role: 'admin' | 'advertiser' | 'client';
  createdAt: Date;
  updatedAt: Date;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  languages?: string[];
  aboutMe?: string;
  emailVerified?: boolean;
  googleConnected?: boolean;
  googleId?: string;
  googleEmail?: string;
  identificationDocuments?: {
    frontId?: string;
    backId?: string;
    verified: boolean;
    uploadDate: Date;
  };
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

export interface Review {
  id: string;
  userId: string; // Reference to the User ID who wrote the review
  propertyId: string; // Reference to the Property ID
  listingId?: string; // Reference to the Listing ID, if applicable
  advertiserId: string; // Reference to the User ID (advertiser)
  stayDuration: string; // How long the client stayed (e.g., "3 months")
  reviewText: string; // The main review content
  createdAt: Date;
  updatedAt: Date;
  ratings: {
    landlord: number;
    neighbourhood: number;
    publicTransport: number;
    accommodation: number;
    servicesNearby: number;
  };
  published: boolean; // Whether the review is published or still in draft
  moveInDate: Date; // When the client moved in
  responseId?: string; // Reference to a response from the advertiser, if any
}

export interface PhotoshootBooking {
  id: string;
  advertiserId?: string; // Reference to the User ID (advertiser) who requested the photoshoot
  userId?: string; // Alternative to advertiserId for backward compatibility
  propertyAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    streetNumber: string;
    floor?: string;
    flat?: string;
  };
  // Individual address fields (older format)
  streetName?: string;
  streetNumber?: string;
  city?: string;
  stateRegion?: string;
  postalCode?: string;
  country?: string;
  floor?: string;
  flat?: string;
  
  propertyType: string;
  date: Date;
  timeSlot: string;
  teamId?: string; // Reference to the team assigned to the photoshoot
  teamMembers?: string[]; // References to the User IDs of team members
  status: 'pending' | 'assigned' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  images?: string[]; // URLs to images taken during the photoshoot
  comments?: string;
  propertyId?: string; // Reference to the Property ID if a property was created
}

export interface Team {
  id: string;
  name: string;
  members: string[]; // References to User IDs of team members
  lead: string; // Reference to User ID of team lead
  specialization?: string;
  availableDays?: string[]; // Days of the week the team is available
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
} 
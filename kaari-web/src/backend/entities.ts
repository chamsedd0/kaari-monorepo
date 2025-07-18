// Define the core entity interfaces for the application

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
  order: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  surname?: string;
  phoneNumber?: string;
  profilePicture?: string;
  role: 'admin' | 'advertiser' | 'client';
  userType?: 'admin' | 'advertiser' | 'client' | 'user';
  createdAt: Date;
  updatedAt: Date;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  languages?: string[];
  aboutMe?: string;
  /** Whether the user's account is blocked/disabled (cannot log in if true) */
  isBlocked?: boolean;
  emailVerified?: boolean;
  googleConnected?: boolean;
  googleId?: string;
  googleEmail?: string;
  foundingPartner?: boolean; // Flag for advertisers who signed up before August 1st, 2024
  identificationDocuments?: {
    frontId?: string;
    backId?: string;
    verified: boolean;
    uploadDate: Date;
  };
  documents?: {
    rules?: string;
    other?: string;
    [key: string]: string | undefined;
  };
  properties?: string[]; // References to property IDs owned by this user
  requests?: string[]; // References to request IDs made by this user
  
  // Getting started checklist for advertisers
  checklist?: ChecklistItem[];
  checklistLastUpdated?: Date;
  
  // Advertiser specific fields
  advertiserType?: 'broker' | 'landlord' | 'agency'; // Type of advertiser
  isBusiness?: boolean; // Whether the advertiser is a business/agency (legacy field)
  businessName?: string; // Name of the agency if isBusiness is true
  businessSize?: string; // Size of the agency if isBusiness is true
  city?: string; // City of operation for advertiser
  propertyQuantity?: string; // How many properties the advertiser could list
  propertyTypes?: string[]; // Types of properties the advertiser has
  listings?: string[]; // References to listing IDs
  additionalInfo?: string; // Additional information provided by the advertiser
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
  propertyType: 'apartment' | 'house' | 'condo' | 'land' | 'commercial' | 'studio' | 'room' | 'villa' | 'penthouse' | 'townhouse';
  bedrooms?: number;
  bathrooms?: number;
  area: number; // in square feet/meters
  price: number;
  deposit?: number; // Security deposit amount
  serviceFee?: number; // Service fee amount
  minstay?: string; // Minimum length of stay (e.g., "6 months")
  availableFrom?: Date; // Date from which the property is available
  images: string[]; // URLs to property images
  videos?: string[]; // URLs to property videos (max 2)
  amenities: string[];
  features: string[];
  status: 'available' | 'occupied';
  createdAt: Date;
  updatedAt: Date;
  
  // Availability refresh tracking
  lastAvailabilityRefresh?: Date; // When availability was last refreshed
  availabilityRefreshNeeded?: boolean; // Computed field - true if 7+ days since last refresh
  
  rooms?: Array<{
    type: 'bedroom' | 'bathroom' | 'kitchen' | 'storage' | 'living';
    area: number;
  }>;
  isFurnished?: boolean; // Whether the property is furnished
  capacity?: number; // Number of people that can live in the property
  rules?: Array<{
    name: string;
    allowed: boolean;
  }>;
  nearbyPlaces?: Array<{
    name: string;
    timeDistance: string; // e.g., "10 minutes"
  }>;
  reviews?: string[]; // References to review IDs related to this property
  
  // Housing preferences
  housingPreference?: string; // 'womenOnly' | 'familiesOnly' | etc.
  
  // Dedicated fields for allowed rules
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  
  // Dedicated fields for included utilities
  includesWater?: boolean;
  includesElectricity?: boolean;
  includesWifi?: boolean;
  includesGas?: boolean;
  
  // Dedicated fields for property features
  hasBalcony?: boolean;
  hasCentralHeating?: boolean;
  hasParking?: boolean;
  hasAirConditioning?: boolean;
  hasWoodenFloors?: boolean;
  hasElevator?: boolean;
  hasSwimmingPool?: boolean;
  hasFireplace?: boolean;
  isAccessible?: boolean;
}

export interface Request {
  id: string;
  userId: string; // Reference to the User ID who made the request
  propertyId?: string; // Reference to the Property ID if related to a specific property
  requestType: 'rent' | 'information' | 'offer' | 'general';
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'paid' | 'movedIn' | 'cancelled' | 'refundProcessing' | 'refundCompleted' | 'refundFailed' | 'cancellationUnderReview';
  offerAmount?: number; // In case this is an offer
  createdAt: Date;
  updatedAt: Date;
  scheduledDate?: Date; // For move-in date
  paymentMethodId?: string; // ID of the payment method used
  movedIn?: boolean; // Whether the client has moved in
  movedInAt?: Date; // When the client moved in, used for refund eligibility
  
  // Personal information
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: Date | null;
  
  // Stay information
  leavingDate?: Date | null;
  numPeople?: string;
  roommates?: string;
  occupationType?: 'study' | 'work';
  studyPlace?: string;
  workPlace?: string;
  occupationRole?: string;
  funding?: string;
  hasPets?: boolean;
  hasSmoking?: boolean;
  aboutMe?: string;
  
  // Payment information
  price?: number;
  serviceFee?: number;
  totalPrice?: number;
}

export interface Review {
  id: string;
  userId: string; // Reference to the User ID who wrote the review
  propertyId: string; // Reference to the Property ID
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
  phoneNumber?: string; // Contact phone number for the photoshoot
  name?: string; // Name of the person requesting the photoshoot
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
  
  // Location coordinates for map display
  location?: {
    lat: number;
    lng: number;
  };
  
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
  phoneNumber?: string; // Team contact phone number for WhatsApp
  specialization?: string;
  availableDays?: string[]; // Days of the week the team is available
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export interface AdminLog {
  id: string;
  action: 'property_refresh' | 'user_blocked' | 'user_unblocked' | 'property_approved' | 'property_rejected' | 'team_assigned' | 'photoshoot_completed' | 'other';
  description: string;
  performedBy?: string; // User ID of who performed the action (if applicable)
  targetUserId?: string; // User ID that was affected by the action
  targetPropertyId?: string; // Property ID that was affected by the action
  targetTeamId?: string; // Team ID that was affected by the action
  metadata?: {
    [key: string]: any; // Additional data specific to the action
  };
  createdAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface PayoutMethod {
  id: string;
  userId: string;
  type: 'RIB' | 'IBAN';
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
  createdAt: Date;
  updatedAt: Date;
  isDefault: boolean;
} 
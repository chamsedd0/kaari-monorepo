// Core entity interfaces for the Kaari mobile app (client + advertiser only)

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
  role: 'advertiser' | 'client' | 'admin';
  userType?: 'advertiser' | 'client' | 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  languages?: string[];
  aboutMe?: string;
  isBlocked?: boolean;
  emailVerified?: boolean;
  googleConnected?: boolean;
  googleId?: string;
  googleEmail?: string;
  foundingPartner?: boolean;
  identificationDocuments?: {
    frontId?: string;
    backId?: string;
    verified: boolean;
    uploadDate: Date;
  };
  documents?: Record<string, string | undefined> & {
    rules?: string;
    other?: string;
  };
  properties?: string[];
  requests?: string[];
  checklist?: ChecklistItem[];
  checklistLastUpdated?: Date;
  // Advertiser-specific
  advertiserType?: 'broker' | 'landlord' | 'agency';
  brokerExtraFeePercent?: number; // 0-75
  isBusiness?: boolean;
  businessName?: string;
  businessSize?: string;
  city?: string;
  propertyQuantity?: string;
  propertyTypes?: string[];
  listings?: string[];
  additionalInfo?: string;
  // Bank payout method (legacy flat storage)
  paymentMethod?: {
    bankName?: string;
    accountNumber?: string;
    type?: 'RIB' | 'IBAN';
    updatedAt?: Date;
  };
  // Aggregates for advertiser payments
  totalCollected?: number;
  paymentCount?: number;
}

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
  propertyType: 'apartment' | 'house' | 'condo' | 'land' | 'commercial' | 'studio' | 'room' | 'villa' | 'penthouse' | 'townhouse';
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  price: number;
  deposit?: number;
  serviceFee?: number;
  minstay?: string;
  availableFrom?: Date;
  images: string[];
  videos?: string[];
  amenities: string[];
  features: string[];
  status: 'available' | 'occupied';
  listingStatus?: 'active' | 'pending_verification' | 'auto_unlisted_stale';
  firstPublishedAt?: Date;
  lastPhotoshootAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastAvailabilityRefresh?: Date;
  availabilityRefreshNeeded?: boolean;
  rooms?: Array<{ type: 'bedroom' | 'bathroom' | 'kitchen' | 'storage' | 'living'; area: number; }>;
  isFurnished?: boolean;
  capacity?: number;
  rules?: Array<{ name: string; allowed: boolean; }>;
  nearbyPlaces?: Array<{ name: string; timeDistance: string; }>;
  reviews?: string[];
  housingPreference?: string;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  includesWater?: boolean;
  includesElectricity?: boolean;
  includesWifi?: boolean;
  includesGas?: boolean;
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
  userId: string;
  propertyId?: string;
  requestType: 'rent' | 'information' | 'offer' | 'general';
  message?: string;
  status:
    | 'pending'
    | 'accepted'
    | 'rejected'
    | 'paid'
    | 'movedIn'
    | 'cancelled'
    | 'refundProcessing'
    | 'refundCompleted'
    | 'refundFailed'
    | 'cancellationUnderReview'
    | 'cancellationRejected'
    | 'counter_offer_pending_tenant'
    | 'accepted_counter_offer'
    | 'rejected_counter_offer';
  offerAmount?: number;
  createdAt: Date;
  updatedAt: Date;
  scheduledDate?: Date;
  paymentMethodId?: string;
  movedIn?: boolean;
  movedInAt?: Date;
  // Personal
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: Date | null;
  // Stay
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
  // Payment
  price?: number;
  serviceFee?: number;
  totalPrice?: number;
  // Extended payment lifecycle (used by flows)
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  paidAt?: Date;
  payoutPending?: boolean;
  payoutScheduledFor?: Date;
  payoutProcessed?: boolean;
  payoutProcessedAt?: Date;
  safetyWindowEndsAt?: Date;
  // Referral convenience
  clientName?: string;
}

export interface Review {
  id: string;
  userId: string;
  propertyId: string;
  advertiserId: string;
  stayDuration: string;
  reviewText: string;
  createdAt: Date;
  updatedAt: Date;
  ratings: {
    landlord: number;
    neighbourhood: number;
    publicTransport: number;
    accommodation: number;
    servicesNearby: number;
  };
  published: boolean;
  moveInDate: Date;
  responseId?: string;
}

export interface PhotoshootBooking {
  id: string;
  advertiserId?: string;
  userId?: string;
  phoneNumber?: string;
  name?: string;
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
  streetName?: string;
  streetNumber?: string;
  city?: string;
  stateRegion?: string;
  postalCode?: string;
  country?: string;
  floor?: string;
  flat?: string;
  location?: { lat: number; lng: number };
  propertyType: string;
  date: Date;
  timeSlot: string;
  teamId?: string;
  teamMembers?: string[];
  status: 'pending' | 'assigned' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  images?: string[];
  comments?: string;
  propertyId?: string;
}

export interface Team {
  id: string;
  name: string;
  members: string[];
  lead: string;
  phoneNumber?: string;
  specialization?: string;
  availableDays?: string[];
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
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

export interface Payment {
  id: string;
  reservationId: string;
  propertyId: string;
  userId: string;
  advertiserId: string;
  amount: number;
  currency: string; // 'MAD'
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  advertiserStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string; // e.g., 'card'
  transactionId?: string;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PendingPayout {
  id: string;
  reservationId: string;
  propertyId: string;
  userId: string;
  advertiserId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  paymentId: string;
  scheduledReleaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type MoveInStatus =
  | 'Move-in Upcoming'
  | 'Safety Window Open'
  | 'Safety Window Closed'
  | 'Cancelled – Tenant'
  | 'Cancelled – Advertiser';

export type MoveInReason = 'None' | 'Refund requested' | 'Tenant cancelled' | 'Advertiser cancelled';

export interface MoveInEvent {
  id?: string;
  bookingId: string;
  type:
    | 'payment_captured'
    | 'move_in_scheduled'
    | 'move_in_confirmed'
    | 'cancel_tenant'
    | 'cancel_advertiser'
    | 'refund_requested';
  timestamp: Date;
  description: string;
  userId?: string;
  userName?: string;
}

export interface Conversation {
  id: string;
  participants: {
    tenant: { id: string; name: string };
    advertiser: { id: string; name: string };
  };
  linkedBooking?: { id: string; propertyId: string; propertyTitle: string };
  lastMessage?: { content: string; timestamp: Date; senderId: string; senderName: string; senderRole: 'tenant' | 'advertiser' | 'admin' };
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'tenant' | 'advertiser' | 'admin';
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export type ReferralPassStatus = 'active' | 'locked';

export interface ReferralPass {
  active: boolean;
  expiryDate: Date;
  listingsSincePass: number;
  bookingsSincePass: number;
  listingRequirement: number;
  bookingRequirement: number;
}

export interface ReferralStats {
  totalReferrals: number;
  successfulBookings: number;
  monthlyEarnings: number;
  annualEarnings: number;
  firstRentBonus: string; // e.g., "5%", "8%", "10%"
}

export interface ReferralHistoryItem {
  id: string;
  tenantId: string;
  tenantName: string;
  status: 'pending' | 'success' | 'cancelled' | 'paid' | 'completed';
  propertyId: string;
  propertyName: string;
  amount: number;
  date: Date;
}

export interface ReferralData {
  referralCode: string;
  referralPass: ReferralPass;
  referralStats: ReferralStats;
  referralHistory: ReferralHistoryItem[];
}

export interface ReferralDiscount {
  code: string;
  advertiserId: string;
  amount: number; // MAD
  expiryDate: Date;
  isUsed: boolean;
  usedAt?: Date;
  bookingId?: string;
}



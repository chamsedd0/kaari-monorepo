'use server';

import { 
  collection, 
  getDocs, 
  getDoc,
  doc,
  query, 
  where, 
  orderBy,
  Timestamp,
  updateDoc,
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
  addDoc,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { getAuth } from 'firebase/auth';

// Collection references
const REFERRALS_COLLECTION = 'referrals';
const USERS_COLLECTION = 'users';
const REQUESTS_COLLECTION = 'requests';

// Referral status types
export type ReferralPassStatus = 'active' | 'locked';

// Referral advertiser interface
export interface ReferralAdvertiser {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  referralCode: string;
  bookingsViaCode: number;
  earningsPending: number;
  earningsPaid: number;
  passStatus: ReferralPassStatus;
  internalNote?: string;
  // Additional fields from the referral collection
  referralPass?: {
    active: boolean;
    bookingRequirement: number;
    bookingsSincePass: number;
    expiryDate: Date;
    listingRequirement: number;
    listingsSincePass: number;
  };
  referralStats?: {
    annualEarnings: number;
    firstRentBonus: string;
    monthlyEarnings: number;
    successfulBookings: number;
    totalReferrals: number;
  };
}

// Referral booking interface
export interface ReferralBooking {
  id: string;
  bookingId: string;
  propertyId: string;
  propertyTitle: string;
  propertyThumbnail?: string;
  date: Date;
  amount: number;
  status: 'pending' | 'paid' | 'completed';
  tenantId: string;
  tenantName: string;
}

// Referral interface
export interface Referral {
  id: string;
  referrerId: string;
  referrerName?: string;
  referrerEmail?: string;
  referralCode: string;
  referredUserId?: string;
  referredUserName?: string;
  referredUserEmail?: string;
  isUsed: boolean;
  isExpired: boolean;
  expiryDate: Date;
  discountAmount: number;
  discountCurrency: string;
  commissionAmount: number;
  commissionCurrency: string;
  commissionPaid: boolean;
  commissionPaidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Process a referral document and convert to ReferralAdvertiser
 */
async function processReferralDoc(docSnapshot: QueryDocumentSnapshot<DocumentData>): Promise<ReferralAdvertiser> {
  try {
    const data = docSnapshot.data();
    
    // Get advertiser data
    let advertiserName = 'Unknown';
    let advertiserPhone = 'Unknown';
    let advertiserEmail = undefined;
    
    // Try to get advertiser info from users collection
    try {
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, docSnapshot.id));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        advertiserName = userData.displayName || userData.name || 'Unknown';
        advertiserPhone = userData.phoneNumber || 'Unknown';
        advertiserEmail = userData.email;
      }
    } catch (error) {
      console.error('Error fetching advertiser data:', error);
    }
    
    // Get referral history (bookings)
    const referralHistory = data.referralHistory || [];
    
    // Calculate earnings
    const pendingBookings = referralHistory.filter(booking => booking.status === 'pending');
    const completedBookings = referralHistory.filter(booking => booking.status === 'completed' || booking.status === 'paid');
    
    const earningsPending = pendingBookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);
    const earningsPaid = completedBookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);
    
    // Get referral pass status
    const referralPass = data.referralPass || { active: false };
    const passStatus: ReferralPassStatus = referralPass.active ? 'active' : 'locked';
    
    return {
      id: docSnapshot.id,
      name: advertiserName,
      phoneNumber: advertiserPhone,
      email: advertiserEmail,
      referralCode: data.referralCode || '',
      bookingsViaCode: (data.referralStats?.successfulBookings || 0) + (data.referralStats?.totalReferrals || 0),
      earningsPending,
      earningsPaid,
      passStatus,
      internalNote: data.internalNote || '',
      // Additional fields
      referralPass: referralPass ? {
        active: referralPass.active || false,
        bookingRequirement: referralPass.bookingRequirement || 0,
        bookingsSincePass: referralPass.bookingsSincePass || 0,
        expiryDate: referralPass.expiryDate?.toDate ? referralPass.expiryDate.toDate() : new Date(),
        listingRequirement: referralPass.listingRequirement || 0,
        listingsSincePass: referralPass.listingsSincePass || 0
      } : undefined,
      referralStats: data.referralStats ? {
        annualEarnings: data.referralStats.annualEarnings || 0,
        firstRentBonus: data.referralStats.firstRentBonus || "10%",
        monthlyEarnings: data.referralStats.monthlyEarnings || 0,
        successfulBookings: data.referralStats.successfulBookings || 0,
        totalReferrals: data.referralStats.totalReferrals || 0
      } : undefined
    };
  } catch (error) {
    console.error('Error processing referral:', error);
    return {
      id: docSnapshot.id,
      name: 'Error loading advertiser',
      phoneNumber: 'Unknown',
      referralCode: 'ERROR',
      bookingsViaCode: 0,
      earningsPending: 0,
      earningsPaid: 0,
      passStatus: 'locked'
    };
  }
}

/**
 * Get all referral advertisers
 */
export async function getAllReferralAdvertisers(): Promise<ReferralAdvertiser[]> {
  try {
    const referralsRef = collection(db, REFERRALS_COLLECTION);
    const q = query(referralsRef);
    
    const querySnapshot = await getDocs(q);
    const advertisers: ReferralAdvertiser[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const advertiser = await processReferralDoc(docSnapshot);
      advertisers.push(advertiser);
    }
    
    return advertisers;
  } catch (error) {
    console.error('Error fetching referral advertisers:', error);
    throw new Error('Failed to fetch referral advertisers');
  }
}

/**
 * Get referral advertiser by ID
 */
export async function getReferralAdvertiserById(id: string): Promise<ReferralAdvertiser | null> {
  try {
    const docRef = doc(db, REFERRALS_COLLECTION, id);
    const docSnapshot = await getDoc(docRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    return await processReferralDoc(docSnapshot);
  } catch (error) {
    console.error('Error fetching referral advertiser by ID:', error);
    throw new Error('Failed to fetch referral advertiser');
  }
}

/**
 * Get referral bookings by advertiser ID
 */
export async function getReferralBookingsByAdvertiserId(advertiserId: string): Promise<ReferralBooking[]> {
  try {
    const docRef = doc(db, REFERRALS_COLLECTION, advertiserId);
    const docSnapshot = await getDoc(docRef);
    
    if (!docSnapshot.exists()) {
      return [];
    }
    
    const data = docSnapshot.data();
    const referralHistory = data.referralHistory || [];
    const bookings: ReferralBooking[] = [];
    
    for (const booking of referralHistory) {
      // Try to get property details if propertyId exists
      let propertyTitle = 'Unknown Property';
      let propertyThumbnail = undefined;
      
      if (booking.propertyId) {
        try {
          const propertyDoc = await getDoc(doc(db, 'properties', booking.propertyId));
          if (propertyDoc.exists()) {
            const propertyData = propertyDoc.data();
            propertyTitle = propertyData.title || booking.propertyName || 'Unknown Property';
            propertyThumbnail = propertyData.images?.[0];
          }
        } catch (error) {
          console.error('Error fetching property:', error);
        }
      }
      
      bookings.push({
        id: booking.id || `booking-${bookings.length}`,
        bookingId: `R-${booking.id?.slice(-4).toUpperCase() || Math.floor(Math.random() * 9000 + 1000)}`,
        propertyId: booking.propertyId || '',
        propertyTitle: booking.propertyName || propertyTitle,
        propertyThumbnail,
        date: booking.date?.toDate ? booking.date.toDate() : new Date(booking.date || Date.now()),
        amount: booking.amount || 0,
        status: booking.status || 'pending',
        tenantId: booking.tenantId || '',
        tenantName: booking.tenantName || 'Unknown Tenant'
      });
    }
    
    return bookings;
  } catch (error) {
    console.error('Error fetching referral bookings:', error);
    return [];
  }
}

/**
 * Update referral advertiser note
 */
export async function updateReferralAdvertiserNote(advertiserId: string, note: string): Promise<void> {
  try {
    const docRef = doc(db, REFERRALS_COLLECTION, advertiserId);
    await updateDoc(docRef, {
      internalNote: note,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating referral advertiser note:', error);
    throw new Error('Failed to update note');
  }
}

/**
 * Update referral pass status
 */
export async function updateReferralPassStatus(advertiserId: string, status: ReferralPassStatus): Promise<void> {
  try {
    const docRef = doc(db, REFERRALS_COLLECTION, advertiserId);
    await updateDoc(docRef, {
      'referralPass.active': status === 'active',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating referral pass status:', error);
    throw new Error('Failed to update status');
  }
} 

/**
 * Get all referrals
 */
export async function getAllReferrals(): Promise<Referral[]> {
  try {
    const referralsRef = collection(db, REFERRALS_COLLECTION);
    const q = query(
      referralsRef,
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const referrals: Referral[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      
      referrals.push({
        id: docSnapshot.id,
        referrerId: data.referrerId,
        referrerName: data.referrerName,
        referrerEmail: data.referrerEmail,
        referralCode: data.referralCode,
        referredUserId: data.referredUserId,
        referredUserName: data.referredUserName,
        referredUserEmail: data.referredUserEmail,
        isUsed: data.isUsed || false,
        isExpired: data.isExpired || false,
        expiryDate: data.expiryDate?.toDate() || new Date(),
        discountAmount: data.discountAmount || 0,
        discountCurrency: data.discountCurrency || 'MAD',
        commissionAmount: data.commissionAmount || 0,
        commissionCurrency: data.commissionCurrency || 'MAD',
        commissionPaid: data.commissionPaid || false,
        commissionPaidDate: data.commissionPaidDate?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      });
    }
    
    return referrals;
  } catch (error) {
    console.error('Error getting all referrals:', error);
    return [];
  }
}

/**
 * Get referrals by referrer ID
 */
export async function getReferralsByReferrerId(referrerId: string): Promise<Referral[]> {
  try {
    const referralsRef = collection(db, REFERRALS_COLLECTION);
    const q = query(
      referralsRef,
      where('referrerId', '==', referrerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const referrals: Referral[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      
      referrals.push({
        id: docSnapshot.id,
        referrerId: data.referrerId,
        referrerName: data.referrerName,
        referrerEmail: data.referrerEmail,
        referralCode: data.referralCode,
        referredUserId: data.referredUserId,
        referredUserName: data.referredUserName,
        referredUserEmail: data.referredUserEmail,
        isUsed: data.isUsed || false,
        isExpired: data.isExpired || false,
        expiryDate: data.expiryDate?.toDate() || new Date(),
        discountAmount: data.discountAmount || 0,
        discountCurrency: data.discountCurrency || 'MAD',
        commissionAmount: data.commissionAmount || 0,
        commissionCurrency: data.commissionCurrency || 'MAD',
        commissionPaid: data.commissionPaid || false,
        commissionPaidDate: data.commissionPaidDate?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      });
    }
    
    return referrals;
  } catch (error) {
    console.error(`Error getting referrals for referrer ${referrerId}:`, error);
    return [];
  }
} 

/**
 * Get recent referrals
 * @param limitCount Maximum number of referrals to return
 */
export async function getRecentReferrals(limitCount: number = 5): Promise<Referral[]> {
  try {
    const referralsRef = collection(db, REFERRALS_COLLECTION);
    const q = query(
      referralsRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const referrals: Referral[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      
      referrals.push({
        id: docSnapshot.id,
        referrerId: data.referrerId,
        referrerName: data.referrerName,
        referrerEmail: data.referrerEmail,
        referralCode: data.referralCode,
        referredUserId: data.referredUserId,
        referredUserName: data.referredUserName,
        referredUserEmail: data.referredUserEmail,
        isUsed: data.isUsed,
        isExpired: data.isExpired,
        expiryDate: data.expiryDate instanceof Timestamp ? data.expiryDate.toDate() : new Date(data.expiryDate),
        discountAmount: data.discountAmount,
        discountCurrency: data.discountCurrency,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
      });
    }
    
    return referrals;
  } catch (error) {
    console.error('Error getting recent referrals:', error);
    return [];
  }
} 
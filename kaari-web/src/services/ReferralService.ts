import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  Timestamp,
  onSnapshot,
  orderBy,
  limit,
  DocumentData,
  DocumentSnapshot
} from "firebase/firestore";
import { db } from "../backend/firebase/config";
import { User } from '../backend/entities';

// Generate a simple UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Define referral program related interfaces
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
  firstRentBonus: string; // e.g. "5%", "8%", "10%"
}

export interface ReferralHistory {
  id: string;
  tenantId: string;
  tenantName: string;
  status: 'pending' | 'success' | 'cancelled';
  propertyId: string;
  propertyName: string;
  amount: number;
  date: Date;
}

export interface ReferralData {
  referralCode: string;
  referralPass: ReferralPass;
  referralStats: ReferralStats;
  referralHistory: ReferralHistory[];
}

export interface ReferralDiscount {
  code: string;
  advertiserId: string;
  amount: number; // Amount in MAD
  expiryDate: Date;
  isUsed: boolean;
  usedAt?: Date;
  bookingId?: string;
}

class ReferralService {
  // Get referral data for a user
  async getUserReferralData(userId: string): Promise<ReferralData | null> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        console.error('User not found');
        return null;
      }

      const userData = userDoc.data() as User;
      
      // Get referral data from the referrals collection
      const referralDocRef = doc(db, 'referrals', userId);
      const referralDoc = await getDoc(referralDocRef);
      
      if (!referralDoc.exists()) {
        // Create default referral data if it doesn't exist
        const defaultReferralData: ReferralData = {
          referralCode: this.generateReferralCode(userData.name || '', userId),
          referralPass: {
            active: false,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            listingsSincePass: 0,
            bookingsSincePass: 0,
            listingRequirement: 10,
            bookingRequirement: 3
          },
          referralStats: {
            totalReferrals: 0,
            successfulBookings: 0,
            monthlyEarnings: 0,
            annualEarnings: 0,
            firstRentBonus: "5%"
          },
          referralHistory: []
        };
        
        // Save the default data
        await setDoc(referralDocRef, {
          ...defaultReferralData,
          referralPass: {
            ...defaultReferralData.referralPass,
            expiryDate: Timestamp.fromDate(defaultReferralData.referralPass.expiryDate)
          },
          referralHistory: defaultReferralData.referralHistory.map(item => ({
            ...item,
            date: item.date instanceof Date ? Timestamp.fromDate(item.date) : item.date
          }))
        });
        
        return defaultReferralData;
      }
      
      // Convert Firestore data to our interface
      const data = referralDoc.data();
      
      const referralData: ReferralData = {
        referralCode: data.referralCode || this.generateReferralCode(userData.name || '', userId),
        referralPass: {
          active: data.referralPass?.active || false,
          expiryDate: data.referralPass?.expiryDate?.toDate() || new Date(),
          listingsSincePass: data.referralPass?.listingsSincePass || 0,
          bookingsSincePass: data.referralPass?.bookingsSincePass || 0,
          listingRequirement: data.referralPass?.listingRequirement || 10,
          bookingRequirement: data.referralPass?.bookingRequirement || 3
        },
        referralStats: {
          totalReferrals: data.referralStats?.totalReferrals || 0,
          successfulBookings: data.referralStats?.successfulBookings || 0,
          monthlyEarnings: data.referralStats?.monthlyEarnings || 0,
          annualEarnings: data.referralStats?.annualEarnings || 0,
          firstRentBonus: data.referralStats?.firstRentBonus || "5%"
        },
        referralHistory: (data.referralHistory || []).map((item: any) => ({
          id: item.id,
          tenantId: item.tenantId,
          tenantName: item.tenantName,
          status: item.status,
          propertyId: item.propertyId,
          propertyName: item.propertyName,
          amount: item.amount,
          date: item.date.toDate()
        }))
      };
      
      return referralData;
    } catch (error) {
      console.error('Error getting referral data:', error);
      return null;
    }
  }

  // Subscribe to real-time updates for referral data
  subscribeToReferralData(userId: string, callback: (data: ReferralData | null) => void): () => void {
    const referralDocRef = doc(db, 'referrals', userId);
    
    const unsubscribe = onSnapshot(referralDocRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        
        // Get user data for the referral code if needed
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() as User : null;
        
        // Check if the user is a founding partner
        const isFoundingPartner = userData?.foundingPartner === true;
        
        // For founding partners, ensure their pass is active and set for 90 days
        let referralPass = {
          active: data.referralPass?.active || false,
          expiryDate: data.referralPass?.expiryDate?.toDate() || new Date(),
          listingsSincePass: data.referralPass?.listingsSincePass || 0,
          bookingsSincePass: data.referralPass?.bookingsSincePass || 0,
          listingRequirement: data.referralPass?.listingRequirement || 10,
          bookingRequirement: data.referralPass?.bookingRequirement || 3
        };
        
        // If founding partner and pass is not active or is about to expire, set it for 90 days
        if (isFoundingPartner) {
          const now = new Date();
          const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
          
          // If pass doesn't exist, is not active, or has less than 80 days remaining, set it for 90 days
          if (!data.referralPass || 
              !data.referralPass.active || 
              (referralPass.expiryDate.getTime() - now.getTime() < 80 * 24 * 60 * 60 * 1000)) {
            
            // Update the referral pass in Firestore
            await updateDoc(referralDocRef, {
              'referralPass.active': true,
              'referralPass.expiryDate': Timestamp.fromDate(ninetyDaysFromNow)
            });
            
            // Update our local copy
            referralPass.active = true;
            referralPass.expiryDate = ninetyDaysFromNow;
          }
        }
        
        const referralData: ReferralData = {
          referralCode: data.referralCode || this.generateReferralCode(userData?.name || '', userId),
          referralPass: referralPass,
          referralStats: {
            totalReferrals: data.referralStats?.totalReferrals || 0,
            successfulBookings: data.referralStats?.successfulBookings || 0,
            monthlyEarnings: data.referralStats?.monthlyEarnings || 0,
            annualEarnings: data.referralStats?.annualEarnings || 0,
            firstRentBonus: data.referralStats?.firstRentBonus || "5%"
          },
          referralHistory: (data.referralHistory || []).map((item: any) => ({
            id: item.id,
            tenantId: item.tenantId,
            tenantName: item.tenantName,
            status: item.status,
            propertyId: item.propertyId,
            propertyName: item.propertyName,
            amount: item.amount,
            date: item.date.toDate()
          }))
        };
        
        callback(referralData);
      } else {
        // Document doesn't exist, create default data
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          const isFoundingPartner = userData.foundingPartner === true;
          
          // Create default expiry date (30 days for regular users, 90 days for founding partners)
          const now = new Date();
          const expiryDays = isFoundingPartner ? 90 : 30;
          const expiryDate = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000);
          
          const defaultReferralData: ReferralData = {
            referralCode: this.generateReferralCode(userData.name || '', userId),
            referralPass: {
              active: isFoundingPartner, // Auto-activate for founding partners
              expiryDate: expiryDate,
              listingsSincePass: 0,
              bookingsSincePass: 0,
              listingRequirement: 10,
              bookingRequirement: 3
            },
            referralStats: {
              totalReferrals: 0,
              successfulBookings: 0,
              monthlyEarnings: 0,
              annualEarnings: 0,
              firstRentBonus: "10%"
            },
            referralHistory: []
          };
          
          // Save the default data
          await setDoc(referralDocRef, {
            ...defaultReferralData,
            referralPass: {
              ...defaultReferralData.referralPass,
              expiryDate: Timestamp.fromDate(defaultReferralData.referralPass.expiryDate)
            },
            referralHistory: []
          });
          
          callback(defaultReferralData);
        } else {
          callback(null);
        }
      }
    }, (error) => {
      console.error('Error subscribing to referral data:', error);
      callback(null);
    });
    
    return unsubscribe;
  }

  // Activate referral pass for founding partners
  async activateFoundingPartnerPass(userId: string): Promise<boolean> {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        console.error('User not found');
        return false;
      }
      
      const userData = userDoc.data() as User;
      
      // Check if the user is a founding partner
      if (!userData.foundingPartner) {
        console.error('User is not a founding partner');
        return false;
      }
      
      // Get or create referral data
      const referralDocRef = doc(db, 'referrals', userId);
      const referralDoc = await getDoc(referralDocRef);
      
      // Set expiry date to 90 days from now
      const now = new Date();
      const expiryDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      
      if (referralDoc.exists()) {
        // Update existing referral data
        await updateDoc(referralDocRef, {
          'referralPass.active': true,
          'referralPass.expiryDate': Timestamp.fromDate(expiryDate)
        });
      } else {
        // Create new referral data
        const defaultReferralData = {
          referralCode: this.generateReferralCode(userData.name || '', userId),
          referralPass: {
            active: true,
            expiryDate: Timestamp.fromDate(expiryDate),
            listingsSincePass: 0,
            bookingsSincePass: 0,
            listingRequirement: 10,
            bookingRequirement: 3
          },
          referralStats: {
            totalReferrals: 0,
            successfulBookings: 0,
            monthlyEarnings: 0,
            annualEarnings: 0,
            firstRentBonus: "5%"
          },
          referralHistory: []
        };
        
        await setDoc(referralDocRef, defaultReferralData);
      }
      
      return true;
    } catch (error) {
      console.error('Error activating founding partner pass:', error);
      return false;
    }
  }

  // Apply a referral code to get a discount
  async applyReferralCode(userId: string, referralCode: string): Promise<boolean> {
    try {
      // First, check if the user is a client (only clients can use referral discounts)
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.error('User not found:', userId);
        return false;
      }
      
      const userData = userDoc.data();
      
      // Only clients can use referral discounts
      if (userData.role !== 'client') {
        console.error(`User role ${userData.role} is not eligible for referral discounts`);
        return false;
      }
      
      // Check if the user already has an active discount
      const existingDiscount = await this.getUserDiscount(userId);
      if (existingDiscount) {
        console.log('User already has an active discount');
        return false;
      }
      
      // Find the advertiser with this referral code
      const referralsRef = collection(db, 'referrals');
      const q = query(referralsRef, where('referralCode', '==', referralCode));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.error('Invalid referral code:', referralCode);
        return false;
      }
      
      const advertiserDoc = querySnapshot.docs[0];
      const advertiserId = advertiserDoc.id;
      const advertiserData = advertiserDoc.data();
      
      // Prevent self-referrals
      if (advertiserId === userId) {
        console.error('Cannot use your own referral code');
        return false;
      }
      
      // Check if the referral pass is active
      const referralPass = advertiserData.referralPass;
      if (!referralPass || !referralPass.active) {
        console.error('Advertiser referral pass is not active');
        return false;
      }
      
      // Update the advertiser's referral stats
      const referralStats = advertiserData.referralStats || {};
      referralStats.totalReferrals = (referralStats.totalReferrals || 0) + 1;
      
      await updateDoc(advertiserDoc.ref, {
        'referralStats': referralStats
      });
      
      // Add this user to the advertiser's referral history
      const clientDoc = await getDoc(doc(db, 'users', userId));
      if (clientDoc.exists()) {
        const userData = clientDoc.data();
        const userName = userData.name && userData.surname 
          ? `${userData.name} ${userData.surname}` 
          : userData.email || 'Anonymous User';
          
        const historyItem = {
          id: generateUUID(),
          tenantId: userId,
          tenantName: userName,
          status: 'pending',
          propertyId: '',
          propertyName: '',
          amount: 0,
          date: Timestamp.now()
        };
        
        await updateDoc(advertiserDoc.ref, {
          'referralHistory': [...(advertiserData.referralHistory || []), historyItem]
        });
      }
      
      // Create a discount for the user
      await this.createReferralDiscount(userId, advertiserId, referralCode);
      
      return true;
    } catch (error) {
      console.error('Error applying referral code:', error);
      return false;
    }
  }

  // Create a referral discount for a user
  async createReferralDiscount(userId: string, advertiserId: string, referralCode: string): Promise<boolean> {
    try {
      // Create a discount document in the referralDiscounts collection
      const discountRef = collection(db, 'referralDiscounts');
      
      // Set expiry date to 7 days from now
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      
      const discountData: ReferralDiscount = {
        code: referralCode,
        advertiserId: advertiserId,
        amount: 200, // 200 MAD discount
        expiryDate: expiryDate,
        isUsed: false
      };
      
      await addDoc(discountRef, {
        ...discountData,
        userId: userId,
        createdAt: Timestamp.now(),
        expiryDate: Timestamp.fromDate(expiryDate)
      });
      
      return true;
    } catch (error) {
      console.error('Error creating referral discount:', error);
      return false;
    }
  }

  // Get active discount for a user
  async getUserDiscount(userId: string): Promise<ReferralDiscount | null> {
    try {
      const discountsRef = collection(db, 'referralDiscounts');
      const q = query(
        discountsRef, 
        where('userId', '==', userId),
        where('isUsed', '==', false),
        where('expiryDate', '>', Timestamp.now())
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      // Get the first valid discount
      const discountDoc = querySnapshot.docs[0];
      const data = discountDoc.data();
      
      // If the discount is already associated with a booking, it can't be used for another booking
      // This prevents users from using the same discount on multiple bookings before it's marked as used
      if (data.bookingId) {
        return null;
      }
      
      return {
        code: data.code,
        advertiserId: data.advertiserId,
        amount: data.amount,
        expiryDate: data.expiryDate.toDate(),
        isUsed: data.isUsed,
        usedAt: data.usedAt?.toDate(),
        bookingId: data.bookingId
      };
    } catch (error) {
      console.error('Error getting user discount:', error);
      return null;
    }
  }

  // Apply discount to a booking
  async applyDiscountToBooking(userId: string, bookingId: string, propertyId: string, propertyName: string, bookingAmount: number): Promise<number> {
    try {
      // Get active discount
      const discount = await this.getUserDiscount(userId);
      
      if (!discount) {
        return 0; // No discount to apply
      }
      
      // Find the discount document
      const discountsRef = collection(db, 'referralDiscounts');
      const q = query(
        discountsRef, 
        where('userId', '==', userId),
        where('code', '==', discount.code),
        where('isUsed', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return 0;
      }
      
      const discountDoc = querySnapshot.docs[0];
      
      // Associate the discount with the booking but don't mark as used yet
      // This allows the discount to still be valid if booking is cancelled
      await updateDoc(discountDoc.ref, {
        bookingId: bookingId,
        bookingPropertyId: propertyId,
        bookingPropertyName: propertyName,
        bookingAmount: bookingAmount,
        bookingAppliedAt: Timestamp.now()
      });
      
      return discount.amount;
    } catch (error) {
      console.error('Error applying discount to booking:', error);
      return 0;
    }
  }

  // Finalize discount usage after move-in and refund window passes
  async finalizeDiscountUsage(bookingId: string): Promise<boolean> {
    try {
      // Find the discount associated with this booking
      const discountsRef = collection(db, 'referralDiscounts');
      const q = query(
        discountsRef, 
        where('bookingId', '==', bookingId),
        where('isUsed', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('No pending discount found for booking:', bookingId);
        return false;
      }
      
      const discountDoc = querySnapshot.docs[0];
      const discountData = discountDoc.data();
      const userId = discountData.userId;
      const advertiserId = discountData.advertiserId;
      const propertyId = discountData.bookingPropertyId;
      const propertyName = discountData.bookingPropertyName;
      const bookingAmount = discountData.bookingAmount || 0;
      
      // Mark discount as used
      await updateDoc(discountDoc.ref, {
        isUsed: true,
        usedAt: Timestamp.now()
      });
      
      // Update the advertiser's referral stats
      const referralDocRef = doc(db, 'referrals', advertiserId);
      const referralDoc = await getDoc(referralDocRef);
      
      if (referralDoc.exists()) {
        const referralData = referralDoc.data();
        const referralStats = referralData.referralStats || {};
        const referralHistory = referralData.referralHistory || [];
        
        // Update successful bookings count
        referralStats.successfulBookings = (referralStats.successfulBookings || 0) + 1;
        
        // Calculate earnings based on bonus rate and booking amount
        const bonusRate = this.getBonusRateValue(referralStats.firstRentBonus || "5%");
        const earnings = bookingAmount * bonusRate;
        
        // Update monthly and annual earnings
        referralStats.monthlyEarnings = (referralStats.monthlyEarnings || 0) + earnings;
        referralStats.annualEarnings = (referralStats.annualEarnings || 0) + earnings;
        
        // Find and update the history item for this tenant
        const historyIndex = referralHistory.findIndex((item: any) => item.tenantId === userId);
        
        if (historyIndex >= 0) {
          referralHistory[historyIndex] = {
            ...referralHistory[historyIndex],
            status: 'success',
            propertyId: propertyId,
            propertyName: propertyName,
            amount: earnings,
            date: Timestamp.now()
          };
        }
        
        // Update the referral document
        await updateDoc(referralDocRef, {
          'referralStats': referralStats,
          'referralHistory': referralHistory
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error finalizing discount usage:', error);
      return false;
    }
  }

  // Convert bonus rate string to a number (e.g. "5%" -> 0.05)
  private getBonusRateValue(bonusRate: string): number {
    const percentage = parseInt(bonusRate.replace('%', ''));
    return percentage / 100;
  }

  // Generate a unique referral code
  private generateReferralCode(name: string, userId: string): string {
    // Use first 3 letters of name (or first letter if name is shorter) + last 4 chars of userId
    const namePrefix = name.substring(0, Math.min(3, name.length)).toUpperCase();
    const userIdSuffix = userId.substring(userId.length - 4);
    return `${namePrefix}${userIdSuffix}`;
  }

  // Calculate bonus rate based on number of listings
  calculateBonusRate(listingsCount: number): string {
    if (listingsCount >= 11) {
      return "10%";
    } else if (listingsCount >= 3) {
      return "8%";
    } else {
      return "5%";
    }
  }

  // Request a payout (this would typically involve more backend logic)
  async requestPayout(userId: string): Promise<boolean> {
    try {
      // Get the referral data for this user
      const referralRef = doc(db, 'referrals', userId);
      const referralDoc = await getDoc(referralRef);
      
      if (!referralDoc.exists()) {
        console.error('No referral data found for user:', userId);
        return false;
      }
      
      const referralData = referralDoc.data();
      const referralStats = referralData.referralStats || {};
      
      // Check if there are earnings available to withdraw
      const monthlyEarnings = referralStats.monthlyEarnings || 0;
      
      if (monthlyEarnings <= 0) {
        console.error('No earnings available for payout');
        return false;
      }
      
      // Import the PayoutsService
      const PayoutsService = (await import('./PayoutsService')).default;
      
      // Request a payout through the PayoutsService
      return await PayoutsService.requestReferralPayout(userId);
    } catch (error) {
      console.error('Error requesting payout:', error);
      return false;
    }
  }

  // Check if a discount is already associated with a booking (even if not marked as used yet)
  async isDiscountInUse(userId: string): Promise<boolean> {
    try {
      const discountsRef = collection(db, 'referralDiscounts');
      const q = query(
        discountsRef, 
        where('userId', '==', userId),
        where('isUsed', '==', false),
        where('expiryDate', '>', Timestamp.now())
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return false; // No discount found
      }
      
      // Get the first valid discount
      const discountDoc = querySnapshot.docs[0];
      const data = discountDoc.data();
      
      // If bookingId exists, the discount is already in use
      return Boolean(data.bookingId);
    } catch (error) {
      console.error('Error checking if discount is in use:', error);
      return false;
    }
  }
}

export const referralService = new ReferralService();
export default referralService; 
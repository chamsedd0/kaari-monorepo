import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  Timestamp,
  DocumentReference,
  DocumentData,
  addDoc
} from 'firebase/firestore';
import { db } from '../backend/firebase/config';
import { User } from '../backend/entities';

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
        
        const referralData: ReferralData = {
          referralCode: data.referralCode || this.generateReferralCode(userData?.name || '', userId),
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
        
        callback(referralData);
      } else {
        // Document doesn't exist, create default data
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
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

  // Apply referral code when a user signs up
  async applyReferralCode(userId: string, referralCode: string): Promise<boolean> {
    try {
      // Find the advertiser with this referral code
      const referralsRef = collection(db, 'referrals');
      const q = query(referralsRef, where('referralCode', '==', referralCode));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.error('No advertiser found with this referral code');
        return false;
      }
      
      // Get the first matching advertiser
      const advertiserDoc = querySnapshot.docs[0];
      const advertiserId = advertiserDoc.id;
      
      // Update the user document with the referrer info
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        referredBy: advertiserId
      });
      
      // Update the advertiser's referral stats
      const advertiserData = advertiserDoc.data();
      const referralStats = advertiserData.referralStats || {
        totalReferrals: 0,
        successfulBookings: 0,
        monthlyEarnings: 0,
        annualEarnings: 0
      };
      
      // Increment total referrals
      referralStats.totalReferrals += 1;
      
      await updateDoc(advertiserDoc.ref, {
        'referralStats': referralStats
      });
      
      // Add to referral history
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        const historyItem: any = {
          id: userId,
          tenantId: userId,
          tenantName: `${userData.name || ''} ${userData.surname || ''}`.trim() || 'New User',
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
      
      // Mark discount as used
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
      
      // Update the discount document
      await updateDoc(discountDoc.ref, {
        isUsed: true,
        usedAt: Timestamp.now(),
        bookingId: bookingId
      });
      
      // Update the advertiser's referral stats
      const advertiserId = discount.advertiserId;
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
      
      return discount.amount;
    } catch (error) {
      console.error('Error applying discount to booking:', error);
      return 0;
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
      // In a real implementation, this would create a payout request record
      // For now, we'll just log it
      console.log(`Payout requested by user ${userId}`);
      
      // Create a payout request document
      const payoutRequestRef = doc(collection(db, 'payoutRequests'));
      await setDoc(payoutRequestRef, {
        userId,
        amount: 0, // This would be calculated from the actual earnings
        status: 'pending',
        requestedAt: Timestamp.now()
      });
      
      return true;
    } catch (error) {
      console.error('Error requesting payout:', error);
      return false;
    }
  }
}

export const referralService = new ReferralService();
export default referralService; 
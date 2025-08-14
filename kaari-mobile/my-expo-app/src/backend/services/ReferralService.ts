import { db } from '../firebase/config';
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
  setDoc
} from 'firebase/firestore';
import { ReferralData, ReferralDiscount, User } from '../../backend/entities';

function genUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default class ReferralService {
  async getUserReferralData(userId: string): Promise<ReferralData | null> {
    const userSnap = await getDoc(doc(db, 'users', userId));
    if (!userSnap.exists()) return null;
    const user = (userSnap.data() as unknown) as User;
    const refRef = doc(db, 'referrals', userId);
    const refSnap = await getDoc(refRef);
    if (!refSnap.exists()) {
      const def: ReferralData = {
        referralCode: this.generateReferralCode(user.name || '', userId),
        referralPass: {
          active: false,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
          firstRentBonus: '5%'
        },
        referralHistory: []
      };
      await setDoc(refRef, {
        ...def,
        referralPass: { ...def.referralPass, expiryDate: Timestamp.fromDate(def.referralPass.expiryDate) },
        referralHistory: []
      });
      return def;
    }
    const data = refSnap.data();
    return {
      referralCode: data.referralCode,
      referralPass: {
        active: data.referralPass?.active || false,
        expiryDate: data.referralPass?.expiryDate?.toDate?.() || new Date(),
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
        firstRentBonus: data.referralStats?.firstRentBonus || '5%'
      },
      referralHistory: (data.referralHistory || []).map((h: any) => ({
        id: h.id,
        tenantId: h.tenantId,
        tenantName: h.tenantName,
        status: h.status,
        propertyId: h.propertyId,
        propertyName: h.propertyName,
        amount: h.amount,
        date: h.date?.toDate?.() || new Date()
      }))
    };
  }

  async applyReferralCode(userId: string, referralCode: string): Promise<boolean> {
    const advQ = query(collection(db, 'referrals'), where('referralCode', '==', referralCode));
    const advSnap = await getDocs(advQ);
    if (advSnap.empty) return false;
    const advDoc = advSnap.docs[0];
    const advId = advDoc.id;
    if (advId === userId) return false;
    const advertiserData = advDoc.data();

    const stats = advertiserData.referralStats || {};
    stats.totalReferrals = (stats.totalReferrals || 0) + 1;
    await updateDoc(advDoc.ref, { referralStats: stats });

    const userSnap = await getDoc(doc(db, 'users', userId));
    const userName = userSnap.exists()
      ? (userSnap.data() as any).name || (userSnap.data() as any).email || 'Anonymous'
      : 'Anonymous';
    const historyItem = {
      id: genUUID(),
      tenantId: userId,
      tenantName: userName,
      status: 'pending',
      propertyId: '',
      propertyName: '',
      amount: 0,
      date: Timestamp.now()
    };
    await updateDoc(advDoc.ref, {
      referralHistory: [...(advertiserData.referralHistory || []), historyItem]
    });

    // Create discount
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    await addDoc(collection(db, 'referralDiscounts'), {
      code: referralCode,
      advertiserId: advId,
      userId,
      amount: 200,
      isUsed: false,
      createdAt: Timestamp.now(),
      expiryDate: Timestamp.fromDate(expiry)
    });
    return true;
  }

  async getUserDiscount(userId: string): Promise<ReferralDiscount | null> {
    const qRef = query(
      collection(db, 'referralDiscounts'),
      where('userId', '==', userId),
      where('isUsed', '==', false),
      where('expiryDate', '>', Timestamp.now())
    );
    const snap = await getDocs(qRef);
    if (snap.empty) return null;
    const d = snap.docs[0].data();
    if (d.bookingId) return null;
    return {
      code: d.code,
      advertiserId: d.advertiserId,
      amount: d.amount,
      expiryDate: d.expiryDate.toDate(),
      isUsed: d.isUsed,
      usedAt: d.usedAt?.toDate(),
      bookingId: d.bookingId
    };
  }

  async applyDiscountToBooking(
    userId: string,
    bookingId: string,
    propertyId: string,
    propertyName: string,
    bookingAmount: number
  ): Promise<number> {
    const qRef = query(
      collection(db, 'referralDiscounts'),
      where('userId', '==', userId),
      where('isUsed', '==', false)
    );
    const snap = await getDocs(qRef);
    if (snap.empty) return 0;
    const docRef = snap.docs[0].ref;
    const data = snap.docs[0].data();
    await updateDoc(docRef, {
      bookingId,
      bookingPropertyId: propertyId,
      bookingPropertyName: propertyName,
      bookingAmount,
      bookingAppliedAt: Timestamp.now()
    });
    return data.amount || 0;
  }

  async finalizeDiscountUsage(bookingId: string): Promise<boolean> {
    const qRef = query(collection(db, 'referralDiscounts'), where('bookingId', '==', bookingId), where('isUsed', '==', false));
    const snap = await getDocs(qRef);
    if (snap.empty) return false;
    const refDoc = snap.docs[0].ref;
    await updateDoc(refDoc, { isUsed: true, usedAt: Timestamp.now() });
    return true;
  }

  private generateReferralCode(name: string, userId: string): string {
    const prefix = name.substring(0, Math.min(3, name.length)).toUpperCase();
    const suffix = userId.substring(userId.length - 4);
    return `${prefix}${suffix}`;
  }
}



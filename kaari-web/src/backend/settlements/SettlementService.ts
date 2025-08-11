import { db } from '../firebase/config';
import { collection, doc, getDoc, getDocs, query, where, setDoc, updateDoc, serverTimestamp, Timestamp, addDoc } from 'firebase/firestore';
import { getDocumentById, updateDocument } from '../firebase/firestore';
import { Property, Request, User } from '../entities';

const REQUESTS_COLLECTION = 'requests';
const USERS_COLLECTION = 'users';
const PROPERTIES_COLLECTION = 'properties';
const PAYMENTS_COLLECTION = 'payments';
const PENDING_PAYOUTS_COLLECTION = 'pendingPayouts';

export type SettlementComputation = {
  rentAmount: number;
  tenantCommission: number;
  advertiserKaariFee: number;
  payoutAmount: number;
  currency: string;
  notes: string;
};

export async function computeAdvertiserSettlement(reservationId: string): Promise<SettlementComputation> {
  const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
  if (!reservation) throw new Error('Reservation not found');

  if (!reservation.propertyId) throw new Error('Property ID not found on reservation');
  const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
  if (!property) throw new Error('Property not found');

  const advertiserId = property.ownerId;
  if (!advertiserId) throw new Error('Advertiser ID not found for property');

  const advertiserDoc = await getDoc(doc(db, USERS_COLLECTION, advertiserId));
  if (!advertiserDoc.exists()) throw new Error('Advertiser not found');
  const advertiserData = advertiserDoc.data() as User & Record<string, any>;

  const advertiserType: 'broker' | 'landlord' | 'agency' = (advertiserData.advertiserType as any) || 'landlord';
  const tenantCommission: number = typeof (reservation as any).serviceFee === 'number' ? (reservation as any).serviceFee : 0;
  const rentAmount: number = (typeof (reservation as any).price === 'number' ? (reservation as any).price : 0)
    || (typeof (reservation as any).totalPrice === 'number' && typeof tenantCommission === 'number'
      ? Math.max(0, (reservation as any).totalPrice - tenantCommission)
      : 0);

  const advertiserKaariFee: number = (advertiserType === 'broker' || advertiserType === 'agency') ? 0 : rentAmount * 0.5;
  const payoutAmount = Math.max(0, rentAmount - advertiserKaariFee);
  const notes = `Advertiser type: ${advertiserType}. Advertiser fee: ${advertiserKaariFee.toFixed(2)} MAD. Tenant commission retained: ${tenantCommission.toFixed(2)} MAD. Rent: ${rentAmount.toFixed(2)} MAD.`;

  return {
    rentAmount,
    tenantCommission,
    advertiserKaariFee,
    payoutAmount,
    currency: 'MAD',
    notes,
  };
}

export async function ensurePaymentAdvertiserPending(reservationId: string): Promise<void> {
  const paymentsRef = collection(db, PAYMENTS_COLLECTION);
  const qy = query(paymentsRef, where('reservationId', '==', reservationId));
  const snap = await getDocs(qy);
  if (!snap.empty) {
    const paymentDoc = snap.docs[0];
    const data = paymentDoc.data();
    if (data.advertiserStatus !== 'pending') {
      await updateDoc(doc(db, PAYMENTS_COLLECTION, paymentDoc.id), {
        advertiserStatus: 'pending',
        updatedAt: serverTimestamp(),
      });
    }
  }
}

export async function schedulePendingPayout(reservationId: string, releaseAt: Date): Promise<void> {
  const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
  if (!reservation) throw new Error('Reservation not found');
  if (!reservation.propertyId) throw new Error('Property ID not found on reservation');
  const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
  if (!property) throw new Error('Property not found');
  const advertiserId = property.ownerId;
  if (!advertiserId) throw new Error('Advertiser ID not found for property');

  const { payoutAmount, currency } = await computeAdvertiserSettlement(reservationId);

  // Create pending payout doc
  await addDoc(collection(db, PENDING_PAYOUTS_COLLECTION), {
    advertiserId,
    reservationId,
    propertyId: property.id,
    amount: payoutAmount,
    currency,
    status: 'pending',
    scheduledReleaseDate: Timestamp.fromDate(releaseAt),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Mark reservation with payout schedule flags for legacy consumers
  await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
    payoutPending: true as any,
    payoutScheduledFor: releaseAt as any,
    updatedAt: new Date(),
  });

  // Ensure payment record shows advertiser pending
  await ensurePaymentAdvertiserPending(reservationId);
}

export async function completePayoutForReservation(reservationId: string): Promise<boolean> {
  // Create payout document and mark payment as completed
  const { createRentPayout } = await import('../server-actions/PayoutsServerActions');
  const created = await createRentPayout(reservationId);
  if (!created) return false;

  // Flip advertiserStatus to completed on payment
  const paymentsRef = collection(db, PAYMENTS_COLLECTION);
  const qy = query(paymentsRef, where('reservationId', '==', reservationId));
  const snap = await getDocs(qy);
  if (!snap.empty) {
    const paymentDoc = snap.docs[0];
    await updateDoc(doc(db, PAYMENTS_COLLECTION, paymentDoc.id), {
      advertiserStatus: 'completed',
      updatedAt: serverTimestamp(),
    });
  }

  // Clear reservation payout flags
  await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
    payoutPending: false as any,
    payoutProcessed: true as any,
    payoutProcessedAt: new Date() as any,
    updatedAt: new Date(),
  });

  return true;
}



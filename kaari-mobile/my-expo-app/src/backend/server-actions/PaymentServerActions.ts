import { getCurrentUserProfile } from '@backend/firebase/auth';
import { getDocumentById, updateDocument, createDocument, getDocumentsByField } from '@backend/firebase/firestore';
import { Request, Property, User, Payment } from '../../backend/entities';

const REQUESTS_COLLECTION = 'requests';
const PROPERTIES_COLLECTION = 'properties';
const USERS_COLLECTION = 'users';
const PAYMENTS_COLLECTION = 'payments';
const PENDING_PAYOUTS_COLLECTION = 'pendingPayouts';

export async function processPayment(reservationId: string): Promise<{ success: boolean; paymentId?: string; error?: string }> {
  try {
    const user = await getCurrentUserProfile();
    if (!user) throw new Error('User not authenticated');

    const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
    if (!reservation) throw new Error('Reservation not found');
    if (reservation.userId !== user.id) throw new Error('Not authorized to process payment for this reservation');
    if (reservation.status !== 'accepted') throw new Error('Cannot process payment for a reservation that is not accepted');
    if (!reservation.propertyId) throw new Error('Property ID not found in reservation');

    const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
    if (!property) throw new Error('Property not found');
    const advertiserId = property.ownerId;
    if (!advertiserId) throw new Error('Advertiser ID not found for this property');

    const simulatedTransactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const payment = await createDocument<Payment>(PAYMENTS_COLLECTION, {
      reservationId,
      propertyId: property.id,
      userId: user.id,
      advertiserId,
      amount: reservation.totalPrice || 0,
      currency: 'MAD',
      status: 'completed',
      advertiserStatus: 'pending',
      paymentMethod: 'card',
      transactionId: simulatedTransactionId,
      paymentDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    } as any);

    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, { status: 'paid', updatedAt: new Date() } as any);
    return { success: true, paymentId: payment.id };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Unknown error' };
  }
}

export async function handleMoveIn(reservationId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUserProfile();
    if (!user) throw new Error('User not authenticated');

    const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
    if (!reservation) throw new Error('Reservation not found');
    if (reservation.userId !== user.id) throw new Error('Not authorized to confirm move-in');
    if (reservation.status !== 'paid') throw new Error('Cannot confirm move-in for a reservation that is not paid');
    if (!reservation.propertyId) throw new Error('Property ID not found in reservation');

    const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
    if (!property) throw new Error('Property not found');

    // Update reservation to movedIn
    await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
      status: 'movedIn',
      movedIn: true,
      movedInAt: new Date(),
      updatedAt: new Date()
    } as any);

    // Schedule payout placeholder (create pending payout)
    await createDocument(PENDING_PAYOUTS_COLLECTION, {
      reservationId,
      propertyId: property.id,
      userId: user.id,
      advertiserId: property.ownerId,
      amount: reservation.totalPrice || 0,
      currency: 'MAD',
      status: 'pending',
      scheduledReleaseDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Unknown error' };
  }
}

export async function getUserPayments(): Promise<Array<{ payment: Payment; property?: Property; advertiser?: User }>> {
  const user = await getCurrentUserProfile();
  if (!user) throw new Error('User not authenticated');
  const payments = await getDocumentsByField<Payment>(PAYMENTS_COLLECTION, 'userId', user.id);
  const out: Array<{ payment: Payment; property?: Property; advertiser?: User }> = [];
  for (const p of payments) {
    const property = p.propertyId ? await getDocumentById<Property>(PROPERTIES_COLLECTION, p.propertyId) : undefined;
    const advertiser = p.advertiserId ? await getDocumentById<User>(USERS_COLLECTION, p.advertiserId) : undefined;
    out.push({ payment: p, property: property || undefined, advertiser: advertiser || undefined });
  }
  return out;
}



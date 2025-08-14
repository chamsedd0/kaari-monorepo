import { Request, Property, User } from '../../backend/entities';
import { getCurrentUserProfile } from '@backend/firebase/auth';
import {
  getDocumentById,
  getDocumentsByField,
  updateDocument,
  createDocument
} from '@backend/firebase/firestore';
import NotificationService from '../services/NotificationService';

const USERS_COLLECTION = 'users';
const REQUESTS_COLLECTION = 'requests';
const PROPERTIES_COLLECTION = 'properties';
const REFUND_REQUESTS_COLLECTION = 'refundRequests';
const CANCELLATION_REQUESTS_COLLECTION = 'cancellationRequests';
const SAVED_PROPERTIES_COLLECTION = 'savedProperties';

export async function getClientReservations(): Promise<Array<{
  reservation: Request;
  property?: Property | null;
  advertiser?: User | null;
}>> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) throw new Error('User not authenticated');

  const requests = await getDocumentsByField<Request>(REQUESTS_COLLECTION, 'userId', currentUser.id);
  const results: Array<{ reservation: Request; property?: Property | null; advertiser?: User | null }> = [];

  for (const req of requests) {
    let property: Property | null = null;
    let advertiser: User | null = null;

    if (req.propertyId) {
      property = await getDocumentById<Property>(PROPERTIES_COLLECTION, req.propertyId);
      if (property?.ownerId) {
        advertiser = await getDocumentById<User>(USERS_COLLECTION, property.ownerId);
      }
    }
    results.push({ reservation: req, property, advertiser });
  }
  return results;
}

export async function cancelReservation(reservationId: string): Promise<void> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) throw new Error('User not authenticated');

  const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.userId !== currentUser.id) throw new Error('Not authorized to cancel this reservation');

  await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
    status: 'cancelled',
    updatedAt: new Date()
  } as any);

  const refundAmount = reservation.totalPrice || 0;
  const refundReq = await createDocument(REFUND_REQUESTS_COLLECTION, {
    reservationId,
    userId: currentUser.id,
    reason: 'Early cancellation - automatic refund',
    amount: refundAmount,
    originalAmount: refundAmount,
    serviceFee: 0,
    propertyId: reservation.propertyId,
    status: 'approved',
    autoApproved: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    approvedAt: new Date(),
    approvedBy: 'system'
  });

  if (reservation.propertyId) {
    await updateDocument<Property>(PROPERTIES_COLLECTION, reservation.propertyId, {
      status: 'available',
      updatedAt: new Date()
    } as any);
  }

  try {
    const notifier = new NotificationService();
    if (reservation.propertyId) {
      const prop = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
      if (prop?.ownerId) {
        await notifier.createNotification(
          prop.ownerId,
          'advertiser',
          'reservation_cancelled',
          'Reservation Cancelled',
          'The client cancelled the reservation and a refund has been auto-approved.',
          '/dashboard/advertiser/reservations',
          { reservationId, refundRequestId: (refundReq as any).id }
        );
      }
    }
  } catch {}
}

export async function processPayment(reservationId: string): Promise<void> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) throw new Error('User not authenticated');

  const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.userId !== currentUser.id) throw new Error('Not authorized');
  if (reservation.status !== 'accepted') throw new Error('Cannot process payment for a reservation that is not accepted');

  await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
    status: 'paid',
    updatedAt: new Date()
  } as any);

  try {
    const notifier = new NotificationService();
    if (reservation.propertyId) {
      const prop = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
      if (prop?.ownerId) {
        await notifier.createNotification(
          prop.ownerId,
          'advertiser',
          'payment_confirmed',
          'Payment Received',
          `A payment has been received for ${prop.title || 'your property'}. Funds release 24h after move-in.`,
          '/dashboard/advertiser/reservations',
          { reservationId }
        );
      }
    }
  } catch {}
}

export async function completeReservation(reservationId: string): Promise<boolean> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) throw new Error('User not authenticated');

  const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.userId !== currentUser.id) throw new Error('Not authorized');
  if (reservation.status !== 'paid') throw new Error('Cannot complete a reservation that is not paid');

  await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
    status: 'movedIn',
    movedInAt: new Date(),
    updatedAt: new Date()
  } as any);
  return true;
}

export async function requestRefund(
  reservationId: string,
  data?: {
    reasons: string[];
    details: string;
    proofUrls: string[];
    originalAmount: number;
    serviceFee: number;
    refundAmount: number;
    reasonsText: string;
  }
): Promise<void> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) throw new Error('User not authenticated');

  const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.userId !== currentUser.id) throw new Error('Not authorized');
  if (reservation.status !== 'movedIn') throw new Error('Cannot request refund unless moved-in');

  await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
    status: 'refundProcessing',
    updatedAt: new Date()
  } as any);

  if (data) {
    await createDocument(REFUND_REQUESTS_COLLECTION, {
      reservationId,
      userId: currentUser.id,
      reasons: data.reasons,
      reasonsText: data.reasonsText,
      details: data.details,
      proofUrls: data.proofUrls,
      requestedRefundAmount: data.refundAmount,
      originalAmount: data.originalAmount,
      serviceFee: data.serviceFee,
      propertyId: reservation.propertyId,
      status: 'pending',
      adminReviewed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  if (reservation.propertyId) {
    await updateDocument<Property>(PROPERTIES_COLLECTION, reservation.propertyId, {
      status: 'available',
      updatedAt: new Date()
    } as any);
  }
}

export async function processStandardCancellation(data: {
  reservationId: string;
  reason: string;
  daysToMoveIn: number;
  refundAmount: number;
  originalAmount: number;
  serviceFee: number;
  cancellationFee: number;
}): Promise<void> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) throw new Error('User not authenticated');

  const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, data.reservationId);
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.userId !== currentUser.id) throw new Error('Not authorized');

  await updateDocument<Request>(REQUESTS_COLLECTION, data.reservationId, {
    status: 'refundProcessing',
    updatedAt: new Date()
  } as any);

  await createDocument(REFUND_REQUESTS_COLLECTION, {
    reservationId: data.reservationId,
    userId: currentUser.id,
    reason: data.reason,
    amount: data.refundAmount,
    originalAmount: data.originalAmount,
    serviceFee: data.serviceFee,
    cancellationFee: data.cancellationFee,
    daysToMoveIn: data.daysToMoveIn,
    propertyId: reservation.propertyId,
    status: 'processing',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  if (reservation.propertyId) {
    await updateDocument<Property>(PROPERTIES_COLLECTION, reservation.propertyId, {
      status: 'available',
      updatedAt: new Date()
    } as any);
  }
}

export async function respondToCounterOffer(reservationId: string, accept: boolean): Promise<void> {
  const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
  if (!reservation) throw new Error('Reservation not found');
  await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
    status: accept ? 'accepted_counter_offer' : 'rejected_counter_offer',
    updatedAt: new Date()
  } as any);
}

export async function getSavedProperties(): Promise<{ propertyId: string }[]> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) throw new Error('User not authenticated');
  return await getDocumentsByField(SAVED_PROPERTIES_COLLECTION, 'userId', currentUser.id);
}

export async function toggleSavedProperty(propertyId: string): Promise<boolean> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) throw new Error('User not authenticated');
  const existing = await getDocumentsByField<{ id: string; userId: string; propertyId: string }>(
    SAVED_PROPERTIES_COLLECTION,
    'userId',
    currentUser.id
  );
  const found = existing.find((sp) => sp.propertyId === propertyId);
  if (found) {
    await updateDocument(SAVED_PROPERTIES_COLLECTION, found.id, { deleted: true } as any);
    return false;
  }
  await createDocument(SAVED_PROPERTIES_COLLECTION, {
    userId: currentUser.id,
    propertyId,
    createdAt: new Date()
  });
  return true;
}

export async function isPropertySaved(propertyId: string): Promise<boolean> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) return false;
  const saved = await getDocumentsByField<{ propertyId: string }>(SAVED_PROPERTIES_COLLECTION, 'userId', currentUser.id);
  return saved.some((s) => s.propertyId === propertyId);
}



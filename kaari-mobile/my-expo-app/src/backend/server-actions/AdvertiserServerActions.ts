import { getCurrentUserProfile } from '@backend/firebase/auth';
import { getDocumentById, getDocumentsByField, updateDocument } from '@backend/firebase/firestore';
import { Request, Property, User } from '../../backend/entities';

const REQUESTS_COLLECTION = 'requests';
const PROPERTIES_COLLECTION = 'properties';
const USERS_COLLECTION = 'users';

export async function getAdvertiserReservationRequests(): Promise<Array<{
  reservation: Request;
  property?: Property | null;
  client?: User | null;
}>> {
  const current = await getCurrentUserProfile();
  if (!current) throw new Error('User not authenticated');

  // Get properties owned by advertiser
  const properties = await getDocumentsByField<Property>(PROPERTIES_COLLECTION, 'ownerId', current.id);
  if (!properties.length) return [];
  const propertyById = new Map(properties.map((p) => [p.id, p]));

  // For each property, fetch requests
  const results: Array<{ reservation: Request; property?: Property | null; client?: User | null }> = [];
  for (const prop of properties) {
    const propRequests = await getDocumentsByField<Request>(REQUESTS_COLLECTION, 'propertyId', prop.id);
    for (const r of propRequests) {
      let client: User | null = null;
      if (r.userId) client = await getDocumentById<User>(USERS_COLLECTION, r.userId);
      results.push({ reservation: r, property: propertyById.get(prop.id) || null, client });
    }
  }
  return results;
}

export async function approveReservationRequest(requestId: string): Promise<boolean> {
  const current = await getCurrentUserProfile();
  if (!current) throw new Error('User not authenticated');
  const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, requestId);
  if (!reservation) throw new Error('Reservation not found');
  if (!reservation.propertyId) throw new Error('Reservation missing property');
  const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
  if (!property) throw new Error('Property not found');
  if (property.ownerId !== current.id) throw new Error('Not authorized');

  await updateDocument<Request>(REQUESTS_COLLECTION, requestId, { status: 'accepted', updatedAt: new Date() } as any);
  return true;
}

export async function rejectReservationRequest(
  requestId: string,
  options?: { reason?: string; suggestedMoveInDate?: Date }
): Promise<boolean> {
  const current = await getCurrentUserProfile();
  if (!current) throw new Error('User not authenticated');
  const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, requestId);
  if (!reservation) throw new Error('Reservation not found');
  if (!reservation.propertyId) throw new Error('Reservation missing property');
  const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, reservation.propertyId);
  if (!property) throw new Error('Property not found');
  if (property.ownerId !== current.id) throw new Error('Not authorized');

  const isCounterOffer = options?.reason === 'move_in_date_too_far' && !!options?.suggestedMoveInDate;
  await updateDocument<Request>(
    REQUESTS_COLLECTION,
    requestId,
    isCounterOffer
      ? ({ status: 'counter_offer_pending_tenant', counterOfferMoveInDate: options?.suggestedMoveInDate, updatedAt: new Date() } as any)
      : ({ status: 'rejected', rejectionReason: options?.reason || 'unspecified', updatedAt: new Date() } as any)
  );
  return true;
}



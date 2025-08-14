import { getCurrentUserProfile } from '@backend/firebase/auth';
import { getDocumentById, getDocumentsByField, getDocuments, createDocument, updateDocument, deleteDocument } from '@backend/firebase/firestore';
import { Review, Property, User, Request } from '../../backend/entities';

const REVIEWS_COLLECTION = 'reviews';
const PROPERTIES_COLLECTION = 'properties';
const USERS_COLLECTION = 'users';
const REQUESTS_COLLECTION = 'requests';

export async function getReviewsToWrite(): Promise<Array<{ property: Property; advertiser: User; moveInDate: Date }>> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) throw new Error('User not authenticated');

  const completedViewing = await getDocuments(REQUESTS_COLLECTION, {
    filters: [
      { field: 'userId', operator: '==', value: currentUser.id },
      { field: 'requestType', operator: '==', value: 'viewing' },
      { field: 'status', operator: '==', value: 'completed' }
    ]
  });
  const movedIn = await getDocuments(REQUESTS_COLLECTION, {
    filters: [
      { field: 'userId', operator: '==', value: currentUser.id },
      { field: 'status', operator: '==', value: 'movedIn' }
    ]
  });
  const requests: any[] = [...completedViewing, ...movedIn];

  const userReviews = await getDocumentsByField<Review>(REVIEWS_COLLECTION, 'userId', currentUser.id);
  const out: Array<{ property: Property; advertiser: User; moveInDate: Date }> = [];
  for (const req of requests) {
    let propertyId = req.propertyId;
    if (!propertyId && req.listingId) {
      const listing = await getDocumentById<{ propertyId: string }>('listings', req.listingId);
      propertyId = listing?.propertyId;
    }
    if (!propertyId) continue;
    if (userReviews.some((r) => r.propertyId === propertyId)) continue;
    const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, propertyId);
    if (!property) continue;
    const advertiser = await getDocumentById<User>(USERS_COLLECTION, property.ownerId);
    if (!advertiser) continue;
    const moveInDate = new Date(req.movedInAt || req.scheduledDate || req.createdAt);
    out.push({ property, advertiser, moveInDate });
  }
  return out;
}

export async function getUserReviews(): Promise<Array<{ review: Review; property: Property }>> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) throw new Error('User not authenticated');
  const reviews = await getDocumentsByField<Review>(REVIEWS_COLLECTION, 'userId', currentUser.id);
  const out: Array<{ review: Review; property: Property }> = [];
  for (const r of reviews) {
    const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, r.propertyId);
    if (property) out.push({ review: r, property });
  }
  return out;
}

export async function createReview(
  propertyId: string,
  data: {
    stayDuration: string;
    reviewText: string;
    ratings: { landlord: number; neighbourhood: number; publicTransport: number; accommodation: number; servicesNearby: number };
    moveInDate: Date;
  }
): Promise<Review> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) throw new Error('User not authenticated');
  const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, propertyId);
  if (!property) throw new Error('Property not found');
  const payload: Omit<Review, 'id'> = {
    userId: currentUser.id,
    propertyId,
    advertiserId: property.ownerId,
    stayDuration: data.stayDuration,
    reviewText: data.reviewText,
    ratings: data.ratings,
    moveInDate: data.moveInDate,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  return await createDocument<Review>(REVIEWS_COLLECTION, payload as any);
}

export async function updateReview(reviewId: string, partial: Partial<Review>): Promise<Review> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) throw new Error('User not authenticated');
  const existing = await getDocumentById<Review>(REVIEWS_COLLECTION, reviewId);
  if (!existing) throw new Error('Review not found');
  if (existing.userId !== currentUser.id) throw new Error('Not authorized');
  return await updateDocument<Review>(REVIEWS_COLLECTION, reviewId, { ...partial, updatedAt: new Date() } as any);
}

export async function deleteReview(reviewId: string): Promise<boolean> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) throw new Error('User not authenticated');
  const existing = await getDocumentById<Review>(REVIEWS_COLLECTION, reviewId);
  if (!existing) throw new Error('Review not found');
  if (existing.userId !== currentUser.id && currentUser.role !== 'admin') throw new Error('Not authorized');
  return await deleteDocument(REVIEWS_COLLECTION, reviewId);
}

export async function getPropertyReviews(propertyId: string): Promise<Review[]> {
  const reviews = await getDocumentsByField<Review>(REVIEWS_COLLECTION, 'propertyId', propertyId);
  return reviews.filter((r) => r.published);
}

export async function getAdvertiserReviews(advertiserId: string): Promise<Review[]> {
  const reviews = await getDocumentsByField<Review>(REVIEWS_COLLECTION, 'advertiserId', advertiserId);
  return reviews.filter((r) => r.published);
}



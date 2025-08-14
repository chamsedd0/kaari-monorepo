import { mem } from './setup-memory';
import { getReviewsToWrite, createReview, getUserReviews } from '../backend/server-actions/ReviewServerActions';
import * as authModule from '@backend/firebase/auth';

describe('ReviewServerActions', () => {
  beforeEach(() => {
    mem.reset();
    mem.col('users').set('u1', { id: 'u1', email: 'u1@example.com', name: 'Tenant', role: 'client' });
    mem.col('users').set('adv1', { id: 'adv1', email: 'a@example.com', name: 'Adv', role: 'advertiser' });
    mem.col('properties').set('p1', { id: 'p1', ownerId: 'adv1', title: 'Nice Apt' });
    mem.col('requests').set('r1', { id: 'r1', userId: 'u1', propertyId: 'p1', status: 'movedIn', movedInAt: new Date() });
    jest.spyOn(authModule, 'getCurrentUserProfile').mockResolvedValue({
      id: 'u1', email: 'u1@example.com', name: 'Tenant', role: 'client', createdAt: new Date(), updatedAt: new Date()
    } as any);
  });

  it('suggests reviews to write after moved-in', async () => {
    const todo = await getReviewsToWrite();
    expect(todo.length).toBeGreaterThan(0);
    expect(todo[0].property.title).toBe('Nice Apt');
  });

  it('creates and lists user reviews', async () => {
    await createReview('p1', {
      stayDuration: '3 months',
      reviewText: 'Great stay',
      ratings: { landlord: 5, neighbourhood: 4, publicTransport: 4, accommodation: 5, servicesNearby: 4 },
      moveInDate: new Date(),
    });
    const items = await getUserReviews();
    expect(items.length).toBe(1);
    expect(items[0].property.id).toBe('p1');
  });
});



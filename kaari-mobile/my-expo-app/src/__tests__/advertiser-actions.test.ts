import { mem } from './setup-memory';
import { getAdvertiserReservationRequests, approveReservationRequest, rejectReservationRequest } from '../backend/server-actions/AdvertiserServerActions';
import * as authModule from '@backend/firebase/auth';

describe('AdvertiserServerActions', () => {
  beforeEach(() => {
    mem.reset();
    mem.col('users').set('u1', { id: 'u1', email: 'u1@example.com', name: 'Tenant', role: 'client' });
    mem.col('users').set('adv1', { id: 'adv1', email: 'a@example.com', name: 'Adv', role: 'advertiser' });
    mem.col('properties').set('p1', { id: 'p1', title: 'Nice Apt', ownerId: 'adv1', status: 'available' });
    mem.col('requests').set('r1', { id: 'r1', userId: 'u1', propertyId: 'p1', status: 'pending' });
    // make current user advertiser
    jest.spyOn(authModule, 'getCurrentUserProfile').mockResolvedValue({
      id: 'adv1', email: 'a@example.com', name: 'Adv', role: 'advertiser', createdAt: new Date(), updatedAt: new Date()
    } as any);
  });

  it('lists advertiser requests', async () => {
    const res = await getAdvertiserReservationRequests();
    expect(res.length).toBeGreaterThan(0);
    expect(res[0].reservation.propertyId).toBe('p1');
  });

  it('approves reservation', async () => {
    await approveReservationRequest('r1');
    expect(mem.col('requests').get('r1').status).toBe('accepted');
  });

  it('rejects reservation', async () => {
    await rejectReservationRequest('r1', { reason: 'test' });
    expect(mem.col('requests').get('r1').status).toBe('rejected');
  });
});



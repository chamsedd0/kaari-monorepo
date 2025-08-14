import { mem } from './setup-memory';
import { getClientReservations, cancelReservation, processPayment, completeReservation } from '../backend/server-actions/ClientServerActions';

describe('ClientServerActions', () => {
  beforeEach(() => {
    mem.reset();
    mem.col('users').set('u1', { id: 'u1', email: 'u1@example.com', name: 'Test', role: 'client' });
    mem.col('properties').set('p1', { id: 'p1', title: 'Nice Apt', ownerId: 'adv1', status: 'available' });
    mem.col('requests').set('r1', {
      userId: 'u1',
      propertyId: 'p1',
      requestType: 'rent',
      status: 'accepted',
      totalPrice: 1000,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('lists client reservations with property and advertiser', async () => {
    const res = await getClientReservations();
    expect(res.length).toBe(1);
    expect(res[0].property?.id).toBe('p1');
  });

  it('cancels reservation and creates refundRequest, sets property available', async () => {
    await cancelReservation('r1');
    const r1 = mem.col('requests').get('r1');
    expect(r1.status).toBe('cancelled');
    const refunds = Array.from(mem.col('refundRequests').values());
    expect(refunds.length).toBe(1);
    expect(mem.col('properties').get('p1').status).toBe('available');
  });

  it('processes payment only when accepted, sets status paid', async () => {
    await processPayment('r1');
    expect(mem.col('requests').get('r1').status).toBe('paid');
  });

  it('completes reservation only when paid and sets movedIn', async () => {
    await processPayment('r1');
    await completeReservation('r1');
    expect(mem.col('requests').get('r1').status).toBe('movedIn');
  });
});



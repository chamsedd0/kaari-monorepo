import { mem } from './setup-memory';
import { processPayment, handleMoveIn, getUserPayments } from '../backend/server-actions/PaymentServerActions';
import * as authModule from '@backend/firebase/auth';

describe('PaymentServerActions', () => {
  beforeEach(() => {
    mem.reset();
    mem.col('users').set('u1', { id: 'u1', email: 'u1@example.com', name: 'Tenant', role: 'client' });
    mem.col('users').set('adv1', { id: 'adv1', email: 'a@example.com', name: 'Adv', role: 'advertiser' });
    mem.col('properties').set('p1', { id: 'p1', ownerId: 'adv1', title: 'Nice Apt' });
    mem.col('requests').set('r1', { id: 'r1', userId: 'u1', propertyId: 'p1', status: 'accepted', totalPrice: 1200 });
    jest.spyOn(authModule, 'getCurrentUserProfile').mockResolvedValue({
      id: 'u1', email: 'u1@example.com', name: 'Tenant', role: 'client', createdAt: new Date(), updatedAt: new Date()
    } as any);
  });

  it('processes payment and creates payment doc; sets reservation paid', async () => {
    const res = await processPayment('r1');
    expect(res.success).toBe(true);
    const req = mem.col('requests').get('r1');
    expect(req.status).toBe('paid');
    const payments = Array.from(mem.col('payments').values()) as Array<any>;
    expect(payments.length).toBe(1);
    expect((payments[0] as any).reservationId).toBe('r1');
  });

  it('confirm move-in creates pending payout and marks movedIn', async () => {
    await processPayment('r1');
    const res = await handleMoveIn('r1');
    expect(res.success).toBe(true);
    expect(mem.col('requests').get('r1').status).toBe('movedIn');
    const pps = Array.from(mem.col('pendingPayouts').values()) as Array<any>;
    expect(pps.length).toBe(1);
    expect((pps[0] as any).reservationId).toBe('r1');
  });

  it('lists user payments enriched', async () => {
    await processPayment('r1');
    const items = await getUserPayments();
    expect(items.length).toBe(1);
    expect(items[0].payment.reservationId).toBe('r1');
    expect(items[0].property?.id).toBe('p1');
  });
});



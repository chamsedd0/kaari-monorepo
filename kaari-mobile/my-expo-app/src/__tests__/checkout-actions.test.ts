import { initiateCheckout, createCheckoutReservation } from '../backend/server-actions/CheckoutServerActions';
import { mem } from './setup-memory';

describe('CheckoutServerActions', () => {
  beforeEach(() => {
    mem.reset();
    // seed a property and user-related docs if needed
    const props = mem.col('properties');
    props.set('p1', { id: 'p1', title: 'Nice Apt', ownerId: 'adv1', status: 'available' });
    const users = mem.col('users');
    users.set('u1', { id: 'u1', email: 'u1@example.com', name: 'Test', role: 'client' });
  });

  it('initiates checkout by returning user, property and paymentMethods', async () => {
    const data = await initiateCheckout('p1');
    expect(data.user.id).toBe('u1');
    expect(data.property.id).toBe('p1');
    expect(Array.isArray(data.paymentMethods)).toBe(true);
  });

  it('creates a pending reservation request with correct fields', async () => {
    const req = await createCheckoutReservation({
      propertyId: 'p1',
      userId: 'u1',
      paymentMethodId: 'pm_1',
      rentalData: {
        price: 1000,
        serviceFee: 50,
        totalPrice: 1050,
        numPeople: '1',
      },
    });
    expect(req.id).toBeDefined();
    expect(req.status).toBe('pending');
    expect(req.paymentStatus).toBe('pending');
    expect(req.propertyId).toBe('p1');
    expect(req.userId).toBe('u1');
    expect(req.totalPrice).toBe(1050);
  });
});



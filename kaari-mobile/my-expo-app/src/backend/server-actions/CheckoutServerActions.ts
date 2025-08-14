import { User, Property, Request } from '../entities';
import { getCurrentUserProfile } from '../firebase/auth';
import { getDocumentById, createDocument, updateDocument } from '../firebase/firestore';

const USERS_COLLECTION = 'users';
const REQUESTS_COLLECTION = 'requests';
const PROPERTIES_COLLECTION = 'properties';
const PAYMENT_METHODS_COLLECTION = 'paymentMethods';

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card';
  brand: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckoutData {
  user: User;
  property: Property;
  paymentMethods: PaymentMethod[];
}

export async function initiateCheckout(propertyId: string): Promise<CheckoutData> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) throw new Error('User not authenticated');

  const property = await getDocumentById<Property>(PROPERTIES_COLLECTION, propertyId);
  if (!property) throw new Error('Property not found');

  const paymentMethods: PaymentMethod[] = [];
  return { user: currentUser, property, paymentMethods };
}

export async function createCheckoutReservation(data: {
  propertyId: string;
  userId: string;
  rentalData: any;
  paymentMethodId: string;
}): Promise<Request> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) throw new Error('User not authenticated');
  if (!data.propertyId) throw new Error('Property ID must be provided');

  const {
    fullName = currentUser.name && currentUser.surname ? `${currentUser.name} ${currentUser.surname}` : currentUser.name || '',
    email = currentUser.email,
    phoneNumber = currentUser.phoneNumber || '',
    gender = currentUser.gender || '',
    dateOfBirth = currentUser.dateOfBirth ? new Date(currentUser.dateOfBirth) : null,
    scheduledDate = new Date(),
    leavingDate = null,
    numPeople = '1',
    roommates = '',
    occupationType = 'work',
    studyPlace = '',
    workPlace = '',
    occupationRole = '',
    funding = '',
    hasPets = false,
    hasSmoking = false,
    aboutMe = currentUser.aboutMe || '',
    message = '',
    price = 0,
    serviceFee = 0,
    totalPrice = 0,
    discount = null
  } = data.rentalData || {};

  // Build request in pending status
  const requestData: Omit<Request, 'id'> & Record<string, any> = {
    userId: currentUser.id,
    propertyId: data.propertyId,
    requestType: 'rent',
    status: 'pending',
    scheduledDate,
    paymentMethodId: data.paymentMethodId,
    createdAt: new Date(),
    updatedAt: new Date(),
    paymentStatus: 'pending',
    // Personal
    fullName,
    email,
    phoneNumber,
    gender,
    dateOfBirth,
    // Stay
    leavingDate,
    numPeople,
    roommates,
    occupationType,
    studyPlace,
    workPlace,
    occupationRole,
    funding,
    hasPets,
    hasSmoking,
    aboutMe,
    message,
    // Payment
    price,
    serviceFee,
    totalPrice,
    // Discount
    discount: discount
      ? { amount: discount.amount, code: discount.code, appliedAt: new Date() }
      : null
  };

  const request = await createDocument<Request>(REQUESTS_COLLECTION, requestData as any);

  // Minimal notifications can be added via NotificationService if needed
  return request as Request;
}

export async function processPayment(reservationId: string): Promise<boolean> {
  const currentUser = await getCurrentUserProfile();
  if (!currentUser) throw new Error('User not authenticated');
  const reservation = await getDocumentById<Request>(REQUESTS_COLLECTION, reservationId);
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.userId !== currentUser.id) throw new Error('Not authorized to process payment for this reservation');
  if (reservation.status !== 'accepted') throw new Error('Cannot process payment for a reservation that is not accepted');

  await updateDocument<Request>(REQUESTS_COLLECTION, reservationId, {
    paymentOrderId: `res_${reservationId}_${Date.now()}`,
    paymentStatus: 'pending' as any,
    updatedAt: new Date()
  } as any);

  return true;
}



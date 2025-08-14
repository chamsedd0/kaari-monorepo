import { getAuth } from 'firebase/auth';
import { db } from '../firebase/config';
import { collection, getDocs, query, where, updateDoc, doc, addDoc, Timestamp, getDoc, deleteDoc } from 'firebase/firestore';
import { PayoutMethod } from '../../backend/entities';

const PAYOUT_METHODS_COLLECTION = 'payoutMethods';

export interface AddPayoutMethodParams {
  type: 'RIB' | 'IBAN';
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
  setAsDefault?: boolean;
}

export async function addPayoutMethod(params: AddPayoutMethodParams): Promise<PayoutMethod> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const q1 = query(collection(db, PAYOUT_METHODS_COLLECTION), where('userId', '==', user.uid));
  const snap = await getDocs(q1);
  const isDefault = params.setAsDefault || snap.empty;
  if (isDefault && !snap.empty) {
    await Promise.all(
      snap.docs
        .filter((d) => d.data()?.isDefault)
        .map((d) => updateDoc(doc(db, PAYOUT_METHODS_COLLECTION, d.id), { isDefault: false, updatedAt: Timestamp.now() }))
    );
  }
  const payload = {
    userId: user.uid,
    type: params.type,
    accountNumber: params.accountNumber,
    bankName: params.bankName,
    accountHolderName: params.accountHolderName,
    isDefault,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  const created = await addDoc(collection(db, PAYOUT_METHODS_COLLECTION), payload);
  return {
    id: created.id,
    userId: user.uid,
    type: params.type,
    accountNumber: params.accountNumber,
    bankName: params.bankName,
    accountHolderName: params.accountHolderName,
    isDefault,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export async function getPayoutMethods(): Promise<PayoutMethod[]> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  const qRef = query(collection(db, PAYOUT_METHODS_COLLECTION), where('userId', '==', user.uid));
  const snap = await getDocs(qRef);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: data.userId,
      type: data.type,
      accountNumber: data.accountNumber,
      bankName: data.bankName,
      accountHolderName: data.accountHolderName,
      isDefault: data.isDefault || false,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.() || new Date()
    } as PayoutMethod;
  });
}

export async function setDefaultPayoutMethod(payoutMethodId: string): Promise<void> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  const qRef = query(collection(db, PAYOUT_METHODS_COLLECTION), where('userId', '==', user.uid));
  const snap = await getDocs(qRef);
  await Promise.all(
    snap.docs.map((d) =>
      updateDoc(doc(db, PAYOUT_METHODS_COLLECTION, d.id), {
        isDefault: d.id === payoutMethodId,
        updatedAt: Timestamp.now()
      })
    )
  );
}

export async function deletePayoutMethod(payoutMethodId: string): Promise<void> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  const pmRef = doc(db, PAYOUT_METHODS_COLLECTION, payoutMethodId);
  const pm = await getDoc(pmRef);
  if (!pm.exists()) throw new Error('Payout method not found');
  if (pm.data().userId !== user.uid) throw new Error('Not authorized');
  await deleteDoc(pmRef);
}



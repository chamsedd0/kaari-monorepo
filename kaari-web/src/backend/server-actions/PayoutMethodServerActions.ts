import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { PayoutMethod } from "../entities";

const PAYOUT_METHODS_COLLECTION = "payoutMethods";

export interface AddPayoutMethodParams {
  type: 'RIB' | 'IBAN';
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
  setAsDefault?: boolean;
}

/**
 * Add a new payout method for the current user
 */
export async function addPayoutMethod(params: AddPayoutMethodParams): Promise<PayoutMethod> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Check if this is the first payout method for the user
    const existingMethods = await getPayoutMethodsByUserId(user.uid);
    const isDefault = params.setAsDefault || existingMethods.length === 0;
    
    // If setting this as default, update all other methods to not be default
    if (isDefault && existingMethods.length > 0) {
      await Promise.all(
        existingMethods
          .filter(method => method.isDefault)
          .map(method => updatePayoutMethod(method.id, { isDefault: false }))
      );
    }
    
    const payoutMethodData = {
      userId: user.uid,
      type: params.type,
      accountNumber: params.accountNumber,
      bankName: params.bankName,
      accountHolderName: params.accountHolderName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isDefault
    };
    
    const docRef = await addDoc(collection(db, PAYOUT_METHODS_COLLECTION), payoutMethodData);
    
    return {
      id: docRef.id,
      userId: user.uid,
      type: params.type,
      accountNumber: params.accountNumber,
      bankName: params.bankName,
      accountHolderName: params.accountHolderName,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault
    };
  } catch (error) {
    console.error("Error adding payout method:", error);
    throw error;
  }
}

/**
 * Get all payout methods for the current user
 */
export async function getPayoutMethods(): Promise<PayoutMethod[]> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    return getPayoutMethodsByUserId(user.uid);
  } catch (error) {
    console.error("Error getting payout methods:", error);
    throw error;
  }
}

/**
 * Get all payout methods for a specific user
 */
export async function getPayoutMethodsByUserId(userId: string): Promise<PayoutMethod[]> {
  try {
    const payoutMethodsQuery = query(
      collection(db, PAYOUT_METHODS_COLLECTION),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(payoutMethodsQuery);
    const payoutMethods: PayoutMethod[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      payoutMethods.push({
        id: doc.id,
        userId: data.userId,
        type: data.type,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        accountHolderName: data.accountHolderName,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
        isDefault: data.isDefault || false
      });
    });
    
    return payoutMethods;
  } catch (error) {
    console.error("Error getting payout methods by user ID:", error);
    throw error;
  }
}

/**
 * Get a specific payout method by ID
 */
export async function getPayoutMethodById(payoutMethodId: string): Promise<PayoutMethod | null> {
  try {
    const payoutMethodRef = doc(db, PAYOUT_METHODS_COLLECTION, payoutMethodId);
    const payoutMethodDoc = await getDoc(payoutMethodRef);
    
    if (!payoutMethodDoc.exists()) {
      return null;
    }
    
    const data = payoutMethodDoc.data();
    
    return {
      id: payoutMethodDoc.id,
      userId: data.userId,
      type: data.type,
      accountNumber: data.accountNumber,
      bankName: data.bankName,
      accountHolderName: data.accountHolderName,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
      isDefault: data.isDefault || false
    };
  } catch (error) {
    console.error("Error getting payout method by ID:", error);
    throw error;
  }
}

/**
 * Update a payout method
 */
export async function updatePayoutMethod(
  payoutMethodId: string,
  updates: Partial<Omit<PayoutMethod, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Get the payout method to verify ownership
    const payoutMethod = await getPayoutMethodById(payoutMethodId);
    
    if (!payoutMethod) {
      throw new Error("Payout method not found");
    }
    
    if (payoutMethod.userId !== user.uid) {
      throw new Error("You don't have permission to update this payout method");
    }
    
    // If setting this as default, update all other methods to not be default
    if (updates.isDefault) {
      const existingMethods = await getPayoutMethodsByUserId(user.uid);
      await Promise.all(
        existingMethods
          .filter(method => method.isDefault && method.id !== payoutMethodId)
          .map(method => updatePayoutMethod(method.id, { isDefault: false }))
      );
    }
    
    const payoutMethodRef = doc(db, PAYOUT_METHODS_COLLECTION, payoutMethodId);
    
    await updateDoc(payoutMethodRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating payout method:", error);
    throw error;
  }
}

/**
 * Delete a payout method
 */
export async function deletePayoutMethod(payoutMethodId: string): Promise<void> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Get the payout method to verify ownership
    const payoutMethod = await getPayoutMethodById(payoutMethodId);
    
    if (!payoutMethod) {
      throw new Error("Payout method not found");
    }
    
    if (payoutMethod.userId !== user.uid) {
      throw new Error("You don't have permission to delete this payout method");
    }
    
    const payoutMethodRef = doc(db, PAYOUT_METHODS_COLLECTION, payoutMethodId);
    await deleteDoc(payoutMethodRef);
    
    // If this was the default method and there are other methods, make another one default
    if (payoutMethod.isDefault) {
      const remainingMethods = (await getPayoutMethodsByUserId(user.uid))
        .filter(method => method.id !== payoutMethodId);
      
      if (remainingMethods.length > 0) {
        await updatePayoutMethod(remainingMethods[0].id, { isDefault: true });
      }
    }
  } catch (error) {
    console.error("Error deleting payout method:", error);
    throw error;
  }
}

/**
 * Set a payout method as the default
 */
export async function setDefaultPayoutMethod(payoutMethodId: string): Promise<void> {
  return updatePayoutMethod(payoutMethodId, { isDefault: true });
}

export const PayoutMethodServerActions = {
  addPayoutMethod,
  getPayoutMethods,
  getPayoutMethodsByUserId,
  getPayoutMethodById,
  updatePayoutMethod,
  deletePayoutMethod,
  setDefaultPayoutMethod
}; 
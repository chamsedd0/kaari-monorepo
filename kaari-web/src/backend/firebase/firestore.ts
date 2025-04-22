import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  startAfter,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  CollectionReference,
  setDoc
} from 'firebase/firestore';
import { db } from './config';

/**
 * Generic function to get a document by ID
 */
export async function getDocumentById<T>(
  collectionName: string, 
  docId: string
): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Generic function to create a document with auto-generated ID
 */
export async function createDocument<T extends { id?: string, createdAt?: any, updatedAt?: any }>(
  collectionName: string, 
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): Promise<T> {
  try {
    const timestamp = serverTimestamp();
    const collectionRef = collection(db, collectionName);
    
    // Add timestamps
    const dataWithTimestamps = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    const docRef = await addDoc(collectionRef, dataWithTimestamps);
    
    return { 
      id: docRef.id, 
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    } as T;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Generic function to create a document with a specific ID
 */
export async function createDocumentWithId<T extends { id: string, createdAt?: any, updatedAt?: any }>(
  collectionName: string, 
  id: string,
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): Promise<T> {
  try {
    const timestamp = serverTimestamp();
    const docRef = doc(db, collectionName, id);
    
    // Add timestamps
    const dataWithTimestamps = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    await setDoc(docRef, dataWithTimestamps);
    
    return { 
      id, 
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    } as T;
  } catch (error) {
    console.error(`Error creating document with ID in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Generic function to update a document
 */
export async function updateDocument<T extends { id: string }>(
  collectionName: string, 
  id: string, 
  data: Partial<T>
): Promise<T> {
  try {
    const docRef = doc(db, collectionName, id);
    
    // Get current document data
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error(`Document with ID ${id} not found in ${collectionName}`);
    }
    
    const currentData = docSnap.data();
    
    // Add updated timestamp
    const dataWithTimestamp = {
      ...data,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, dataWithTimestamp);
    
    return { 
      id, 
      ...currentData, 
      ...data,
      updatedAt: new Date()
    } as unknown as T;
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Generic function to delete a document
 */
export async function deleteDocument(
  collectionName: string, 
  id: string
): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Generic function to get documents with filtering, ordering, and pagination
 */
export async function getDocuments<T>(
  collectionName: string,
  options?: {
    filters?: Array<{
      field: string;
      operator: '==' | '!=' | '>' | '>=' | '<' | '<=';
      value: any;
    }>;
    orderByField?: string;
    orderDirection?: 'asc' | 'desc';
    limit?: number;
    startAfterId?: string;
  }
): Promise<T[]> {
  try {
    const collectionRef = collection(db, collectionName);
    let queryConstraints: QueryConstraint[] = [];
    
    // Add filters
    if (options?.filters && options.filters.length > 0) {
      for (const filter of options.filters) {
        queryConstraints.push(where(filter.field, filter.operator, filter.value));
      }
    }
    
    // Add ordering
    if (options?.orderByField) {
      queryConstraints.push(orderBy(
        options.orderByField, 
        options.orderDirection || 'asc'
      ));
    }
    
    // Handle pagination with startAfterId
    if (options?.startAfterId) {
      const startAfterDoc = await getDoc(doc(db, collectionName, options.startAfterId));
      if (startAfterDoc.exists()) {
        queryConstraints.push(startAfter(startAfterDoc));
      }
    }
    
    // Add limit
    if (options?.limit) {
      queryConstraints.push(firestoreLimit(options.limit));
    }
    
    // Create and execute query
    const q = query(collectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    // Convert to array of documents with IDs
    const documents: T[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() } as T);
    });
    
    return documents;
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Helper function to get documents by a specific field value
 */
export async function getDocumentsByField<T>(
  collectionName: string,
  field: string,
  value: any,
  options?: {
    orderByField?: string;
    orderDirection?: 'asc' | 'desc';
    limit?: number;
  }
): Promise<T[]> {
  return getDocuments<T>(collectionName, {
    filters: [{ field, operator: '==', value }],
    orderByField: options?.orderByField,
    orderDirection: options?.orderDirection,
    limit: options?.limit
  });
} 
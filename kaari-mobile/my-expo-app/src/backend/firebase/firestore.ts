import { db } from './config';
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
  limit,
  DocumentData
} from 'firebase/firestore';

export async function getDocumentById<T>(col: string, id: string): Promise<T | null> {
  const ref = doc(db, col, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return ({ id: snap.id, ...snap.data() } as unknown) as T;
}

export async function createDocument<T>(col: string, data: Omit<T, 'id'>): Promise<T & { id: string }> {
  const ref = collection(db, col);
  const result = await addDoc(ref, data as DocumentData);
  return ({ id: result.id, ...(data as object) } as unknown) as T & { id: string };
}

export async function updateDocument<T>(col: string, id: string, data: Partial<T>): Promise<T> {
  const ref = doc(db, col, id);
  await updateDoc(ref, data as DocumentData);
  const updated = await getDoc(ref);
  return ({ id, ...updated.data() } as unknown) as T;
}

export async function deleteDocument(col: string, id: string): Promise<boolean> {
  await deleteDoc(doc(db, col, id));
  return true;
}

export async function getDocuments<T>(
  col: string,
  options?: {
    filters?: Array<{ field: string; operator: '==' | '!=' | '>' | '>=' | '<' | '<='; value: unknown }>;
    orderByField?: string;
    orderDirection?: 'asc' | 'desc';
    limit?: number;
  }
): Promise<T[]> {
  let qRef = collection(db, col);
  const constraints: any[] = [];
  if (options?.filters) {
    for (const f of options.filters) constraints.push(where(f.field, f.operator as any, f.value));
  }
  if (options?.orderByField) constraints.push(orderBy(options.orderByField, options.orderDirection || 'desc'));
  if (constraints.length) {
    // @ts-ignore
    qRef = query(qRef, ...constraints);
  }
  if (options?.limit) {
    // @ts-ignore
    qRef = query(qRef, limit(options.limit));
  }
  const snap = await getDocs(qRef);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) } as unknown as T));
}

export async function getDocumentsByField<T>(col: string, field: string, value: unknown): Promise<T[]> {
  const qRef = query(collection(db, col), where(field, '==', value));
  const snap = await getDocs(qRef);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) } as unknown as T));
}



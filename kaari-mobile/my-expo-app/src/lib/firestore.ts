import { db } from '../backend/firebase/config';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, addDoc, deleteDoc } from 'firebase/firestore';

export { db };

export async function getDocument<T>(path: string) {
  const d = await getDoc(doc(db, path));
  return d.exists() ? (d.data() as T) : undefined;
}

export async function setDocument(path: string, data: any) {
  await setDoc(doc(db, path), data, { merge: true });
}

export async function updateDocument(path: string, data: any) {
  await updateDoc(doc(db, path), data);
}

export async function deleteDocument(path: string) {
  await deleteDoc(doc(db, path));
}

export async function listCollection<T>(path: string, conditions?: Array<{ field: string; op: any; value: any }>) {
  const col = collection(db, path);
  const q = conditions && conditions.length
    ? query(col, ...conditions.map(c => where(c.field as any, c.op, c.value)))
    : col;
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Array<T & { id: string }>;
}

export async function addToCollection(path: string, data: any) {
  const col = collection(db, path);
  const ref = await addDoc(col, data);
  return ref.id;
}



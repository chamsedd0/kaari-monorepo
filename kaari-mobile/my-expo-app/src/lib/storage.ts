import { firebaseStorage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadFile(path: string, blob: Blob | ArrayBuffer | Uint8Array, contentType?: string) {
  const r = ref(firebaseStorage, path);
  const file = blob instanceof Blob ? blob : new Blob([blob], contentType ? { type: contentType } : undefined);
  const snapshot = await uploadBytes(r, file, contentType ? { contentType } : undefined);
  const url = await getDownloadURL(snapshot.ref);
  return { url, fullPath: snapshot.metadata.fullPath };
}



import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  uploadString,
  UploadResult
} from 'firebase/storage';
import { storage } from './config';

/**
 * Upload a file to Firebase Storage
 */
export async function uploadFile(
  path: string, 
  file: File, 
  metadata?: { contentType?: string; customMetadata?: Record<string, string> }
): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Upload a data URL to Firebase Storage
 */
export async function uploadDataUrl(
  path: string, 
  dataUrl: string, 
  metadata?: { contentType?: string; customMetadata?: Record<string, string> }
): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    await uploadString(storageRef, dataUrl, 'data_url', metadata);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading data URL:', error);
    throw error;
  }
}

/**
 * Get the download URL for a file
 */
export async function getFileUrl(path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * List all files in a directory
 */
export async function listFiles(directoryPath: string): Promise<string[]> {
  try {
    const directoryRef = ref(storage, directoryPath);
    const res = await listAll(directoryRef);
    const urls = await Promise.all(res.items.map(itemRef => getDownloadURL(itemRef)));
    return urls;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

/**
 * Upload multiple files to Firebase Storage
 */
export async function uploadMultipleFiles(
  files: File[], 
  basePath: string,
  prefix?: string
): Promise<string[]> {
  try {
    const uploadPromises = files.map((file, index) => {
      const timestamp = Date.now();
      const fileName = `${prefix || ''}${timestamp}_${index}_${file.name}`;
      const filePath = `${basePath}/${fileName}`;
      return uploadFile(filePath, file);
    });
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
}

/**
 * Helper function to generate a storage path for property images
 */
export function getPropertyImagePath(propertyId: string, fileName: string): string {
  return `properties/${propertyId}/images/${fileName}`;
}

/**
 * Helper function to generate a storage path for user profile images
 */
export function getUserProfileImagePath(userId: string, fileName: string): string {
  return `users/${userId}/profile/${fileName}`;
} 
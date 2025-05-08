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
import { getAuth } from 'firebase/auth';
import { 
  getSignedUploadUrl, 
  uploadFileWithSignedUrl,
  uploadUserFile,
  uploadMultipleUserFiles
} from './cloudFunctions';

// Export cloud functions for direct use
export { 
  getSignedUploadUrl, 
  uploadFileWithSignedUrl,
  uploadUserFile,
  uploadMultipleUserFiles
};

/**
 * Legacy method to upload a file to Firebase Storage
 * Consider using signed URLs for better security
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
 * Secure version of file upload using cloud functions and signed URLs
 */
export async function secureUploadFile(
  path: string,
  file: File, 
  metadata?: { customMetadata?: Record<string, string> }
): Promise<string> {
  try {
    // Get authentication state
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be authenticated to use secure upload');
    }
    
    // Either the path must include the user's ID or be in a public folder
    if (!path.includes(user.uid) && !path.startsWith('public/')) {
      throw new Error('Unauthorized path. Path must include user ID or be in public folder');
    }
    
    try {
      // Try secure upload with signed URL first
      // Get signed URL from cloud function
      const { url } = await getSignedUploadUrl(path, file.type, file.size);
      
      // Upload using signed URL
      const success = await uploadFileWithSignedUrl(url, file);
      
      if (!success) {
        throw new Error('File upload failed');
      }
    } catch (error) {
      console.warn('Secure upload failed, falling back to direct upload:', error);
      
      // Fall back to direct upload if we get a CORS error or other error with the cloud function
      console.log('Falling back to direct upload for path:', path);
      await uploadFile(path, file, {
        contentType: file.type,
        customMetadata: {
          ...metadata?.customMetadata,
          uploadMethod: 'direct-fallback',
          uploadTime: new Date().toISOString()
        }
      });
    }
    
    // Get download URL regardless of which method was used
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error in secure file upload:', error);
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
 * Upload multiple files to Firebase Storage (legacy method)
 * Consider using secureUploadMultipleFiles instead
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
 * Secure version of multiple file upload using cloud functions and signed URLs
 */
export async function secureUploadMultipleFiles(
  files: File[], 
  basePath: string,
  prefix?: string
): Promise<string[]> {
  try {
    // Get authentication state
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be authenticated to use secure upload');
    }
    
    // Either the basePath must include the user's ID or be in a public folder
    if (!basePath.includes(user.uid) && !basePath.startsWith('public/')) {
      throw new Error('Unauthorized path. Path must include user ID or be in public folder');
    }
    
    try {
      // Try secure upload first
      // Upload files using the cloud function implementation
      const paths = await uploadMultipleUserFiles(
        user.uid,
        files,
        basePath.includes('images') ? 'image' : 
          basePath.includes('documents') ? 'document' : 'other'
      );
      
      // Get download URLs for all files
      return await Promise.all(paths.map(path => getFileUrl(path)));
    } catch (error) {
      console.warn('Secure multiple upload failed, falling back to direct upload:', error);
      
      // Fallback to direct upload if cloud function fails (like CORS issues)
      return await uploadMultipleFiles(files, basePath, prefix);
    }
  } catch (error) {
    console.error('Error in secure multiple file upload:', error);
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
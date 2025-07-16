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
    console.log(`uploadFile: Uploading file to ${path} (${file.size} bytes)`);
    
    // Ensure we have content type metadata
    const fileMetadata = {
      contentType: file.type,
      ...metadata
    };
    
    const storageRef = ref(storage, path);
    console.log(`uploadFile: Storage reference created for ${path}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file, fileMetadata);
    console.log(`uploadFile: Upload completed for ${path}, size: ${snapshot.metadata.size} bytes`);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log(`uploadFile: Download URL obtained: ${downloadURL}`);
    
    return downloadURL;
  } catch (error) {
    console.error(`uploadFile: Error uploading file to ${path}:`, error);
    if (error instanceof Error) {
      console.error(`uploadFile: Error details: ${error.message}`);
      if (error.stack) {
        console.error(`uploadFile: Stack trace: ${error.stack}`);
      }
    }
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
    console.log(`uploadMultipleFiles: Starting direct upload of ${files.length} files to ${basePath}`);
    
    const uploadPromises = files.map((file, index) => {
      const timestamp = Date.now();
      const fileName = `${prefix || ''}${timestamp}_${index}_${file.name}`;
      const filePath = `${basePath}/${fileName}`;
      console.log(`uploadMultipleFiles: Uploading file ${index + 1}/${files.length}: ${fileName} (${file.size} bytes)`);
      return uploadFile(filePath, file)
        .then(url => {
          console.log(`uploadMultipleFiles: Successfully uploaded file ${index + 1}: ${url}`);
          return url;
        })
        .catch(error => {
          console.error(`uploadMultipleFiles: Error uploading file ${index + 1}:`, error);
          throw error;
        });
    });
    
    const results = await Promise.all(uploadPromises);
    console.log(`uploadMultipleFiles: All ${results.length} files uploaded successfully`);
    return results;
  } catch (error) {
    console.error('uploadMultipleFiles: Error uploading multiple files:', error);
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
    console.log(`secureUploadMultipleFiles: Starting upload of ${files.length} files to ${basePath}`);
    
    // Get authentication state
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error('secureUploadMultipleFiles: No authenticated user found');
      throw new Error('User must be authenticated to use secure upload');
    }
    
    // Either the basePath must include the user's ID or be in a public folder
    if (!basePath.includes(user.uid) && !basePath.startsWith('public/')) {
      console.error(`secureUploadMultipleFiles: Unauthorized path: ${basePath}`);
      throw new Error('Unauthorized path. Path must include user ID or be in public folder');
    }
    
    try {
      // Try secure upload first
      console.log('secureUploadMultipleFiles: Attempting secure upload with cloud functions...');
      
      // Upload files using the cloud function implementation
      const paths = await uploadMultipleUserFiles(
        user.uid,
        files,
        basePath.includes('images') ? 'image' : 
          basePath.includes('documents') ? 'document' : 'other'
      );
      
      console.log(`secureUploadMultipleFiles: Successfully uploaded ${paths.length} files to paths:`, paths);
      
      // Get download URLs for all files
      console.log('secureUploadMultipleFiles: Getting download URLs...');
      const urls = await Promise.all(paths.map(path => getFileUrl(path)));
      
      console.log(`secureUploadMultipleFiles: Got ${urls.length} download URLs:`, urls);
      return urls;
    } catch (error) {
      console.warn('secureUploadMultipleFiles: Secure multiple upload failed, falling back to direct upload:', error);
      
      // Fallback to direct upload if cloud function fails (like CORS issues)
      console.log('secureUploadMultipleFiles: Attempting direct upload fallback...');
      const urls = await uploadMultipleFiles(files, basePath, prefix);
      console.log(`secureUploadMultipleFiles: Direct upload fallback succeeded with ${urls.length} URLs:`, urls);
      return urls;
    }
  } catch (error) {
    console.error('secureUploadMultipleFiles: Error in secure multiple file upload:', error);
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
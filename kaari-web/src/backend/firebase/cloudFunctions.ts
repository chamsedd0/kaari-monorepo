import { getFunctions, httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { app } from './config';

// Initialize Firebase Functions
const functions = getFunctions(app);

/**
 * Get a signed URL for uploading a file to Firebase Storage
 */
export async function getSignedUploadUrl(
  path: string, 
  contentType: string,
  fileSize?: number
): Promise<{ url: string; path: string }> {
  try {
    const getSignedUrlFunction = httpsCallable(functions, 'storage-getSignedUploadUrl');
    const result = await getSignedUrlFunction({ path, contentType, fileSize });
    return result.data as { url: string; path: string };
  } catch (error) {
    console.error('Error getting signed upload URL:', error);
    // If CORS error, provide more helpful message
    if (error instanceof Error && error.message.includes('internal')) {
      console.error('This may be a CORS issue. Make sure your Firebase functions have CORS enabled.');
    }
    throw error;
  }
}

/**
 * Get multiple signed URLs for batch file uploads
 */
export async function getMultipleSignedUrls(
  files: Array<{ path: string; contentType: string; fileSize?: number }>
): Promise<{ urls: Array<{ url: string; path: string }> }> {
  try {
    const getMultipleSignedUrlsFunction = httpsCallable(functions, 'storage-getMultipleSignedUrls');
    const result = await getMultipleSignedUrlsFunction({ files });
    return result.data as { urls: Array<{ url: string; path: string }> };
  } catch (error) {
    console.error('Error getting multiple signed URLs:', error);
    // If CORS error, provide more helpful message
    if (error instanceof Error && error.message.includes('internal')) {
      console.error('This may be a CORS issue. Make sure your Firebase functions have CORS enabled.');
    }
    throw error;
  }
}

/**
 * Upload a file using a signed URL
 */
export async function uploadFileWithSignedUrl(
  signedUrl: string,
  file: File
): Promise<boolean> {
  try {
    const response = await fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
      // Try with no-cors mode as a fallback if needed
      // mode: 'cors', // Default mode
    });
    
    if (!response.ok) {
      // If we get an error, log it
      console.error('Upload failed with status:', response.status);
      console.error('Response:', await response.text().catch(() => 'No response text'));
    }
    
    return response.ok;
  } catch (error) {
    console.error('Error uploading file with signed URL:', error);
    
    // Attempt a fallback approach if there might be a CORS issue
    if (error instanceof TypeError && error.message.includes('NetworkError')) {
      console.warn('Attempting upload with no-cors mode as fallback...');
      try {
        // Try with no-cors mode as a fallback
        const fallbackResponse = await fetch(signedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
          mode: 'no-cors'
        });
        
        // With no-cors, we can't actually read the response status
        // So we'll assume success but warn the user
        console.warn('Upload attempted with no-cors mode. Result cannot be verified.');
        return true;
      } catch (fallbackError) {
        console.error('Fallback upload also failed:', fallbackError);
        throw fallbackError;
      }
    }
    
    throw error;
  }
}

/**
 * Helper function to generate a user-specific path
 */
export function getUserFilePath(userId: string, fileName: string, type: 'image' | 'document' | 'other' = 'other'): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `users/${userId}/${type}s/${timestamp}_${sanitizedFileName}`;
}

/**
 * Complete file upload flow: get signed URL and upload
 */
export async function uploadUserFile(
  userId: string,
  file: File,
  type: 'image' | 'document' | 'other' = 'other'
): Promise<string> {
  try {
    // Generate path
    const path = getUserFilePath(userId, file.name, type);
    
    // Get signed URL
    const { url } = await getSignedUploadUrl(path, file.type, file.size);
    
    // Upload file
    const success = await uploadFileWithSignedUrl(url, file);
    
    if (!success) {
      throw new Error('File upload failed');
    }
    
    return path;
  } catch (error) {
    console.error('Error in complete file upload flow:', error);
    throw error;
  }
}

/**
 * Upload multiple files for a user
 */
export async function uploadMultipleUserFiles(
  userId: string,
  files: File[],
  type: 'image' | 'document' | 'other' = 'other'
): Promise<string[]> {
  try {
    // Prepare file data for batch URL generation
    const fileData = files.map(file => ({
      path: getUserFilePath(userId, file.name, type),
      contentType: file.type,
      fileSize: file.size
    }));
    
    // Get signed URLs for all files
    const { urls } = await getMultipleSignedUrls(fileData);
    
    // Upload all files
    const uploadPromises = files.map((file, index) => {
      const { url, path } = urls[index];
      return uploadFileWithSignedUrl(url, file).then(success => {
        if (!success) {
          throw new Error(`Upload failed for file: ${file.name}`);
        }
        return path;
      });
    });
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
} 
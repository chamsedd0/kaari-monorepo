'use server';

import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from '../firebase/config';
import { initializeApp } from 'firebase/app';

// Initialize Firebase app
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);

/**
 * Uploads an image file to Firebase Storage for a property
 * @param file The image file to upload
 * @param propertyId The ID of the property the image belongs to
 * @returns Promise resolving to the download URL of the uploaded image
 */
export async function uploadPropertyImage(file: File, propertyId: string): Promise<string> {
  try {
    const storage = getStorage(firebaseApp);
    
    // Create a unique filename
    const timestamp = Date.now();
    const fileName = `properties/${propertyId}/images/${timestamp}_${file.name}`;
    
    // Create a reference to the file location
    const storageRef = ref(storage, fileName);
    
    // Upload the file
    const uploadTask = await uploadBytesResumable(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(uploadTask.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Deletes an image from Firebase Storage
 * @param imageUrl The URL of the image to delete
 * @returns Promise resolving to true if successful
 */
export async function deletePropertyImage(imageUrl: string): Promise<boolean> {
  try {
    const storage = getStorage(firebaseApp);
    
    // Extract the path from the URL
    const fileRef = ref(storage, imageUrl);
    
    // Delete the file
    await deleteObject(fileRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
}

/**
 * Uploads multiple images for a property in batch
 * @param files Array of image files to upload
 * @param propertyId The ID of the property the images belong to
 * @returns Promise resolving to an array of download URLs
 */
export async function uploadPropertyImages(files: File[], propertyId: string): Promise<string[]> {
  try {
    const uploadPromises = files.map(file => uploadPropertyImage(file, propertyId));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw new Error('Failed to upload one or more images');
  }
} 
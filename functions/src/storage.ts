import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {getStorage} from "firebase-admin/storage";

// CORS is enabled directly in function configurations,
// no need for the middleware in this file

// Function triggered when a file is uploaded to Firebase Storage
// Commented out due to region mismatch with bucket
/*
import {onObjectFinalized} from "firebase-functions/v2/storage";
export const processFileUpload = onObjectFinalized({
  region: "europe-west2",
}, async (event) => {
  const fileBucket = event.data.bucket;
  const filePath = event.data.name;
  const contentType = event.data.contentType;

  logger.info(
    `File ${filePath} uploaded to ${fileBucket} with type ${contentType}`,
    {
      structuredData: true,
      bucket: fileBucket,
      path: filePath,
      contentType: contentType,
    }
  );

  // Process images (e.g., resize, create thumbnails)
  if (contentType && contentType.startsWith("image/")) {
    // Example: you could implement image processing here
    logger.info(`Processing image: ${filePath}`);
    // await processImage(fileBucket, filePath);
  }
});
*/

// Function triggered when a file is deleted from Firebase Storage
// Commented out due to region mismatch with bucket
/*
import {onObjectDeleted} from "firebase-functions/v2/storage";
export const handleFileDelete = onObjectDeleted({
  region: "europe-west2",
}, async (event) => {
  const fileBucket = event.data.bucket;
  const filePath = event.data.name;

  logger.info(`File ${filePath} was deleted from ${fileBucket}`, {
    structuredData: true,
    bucket: fileBucket,
    path: filePath,
  });

  // Perform any necessary cleanup operations
  // For example, remove references to the file in Firestore
});
*/

// Cloud function to generate a signed URL for secure file uploads
export const getSignedUploadUrl = onCall({
  region: "us-central1",
  cors: true, // Enable CORS for this function
}, async (request) => {
  // Verify authentication
  if (!request.auth) {
    throw new Error("Authentication required");
  }

  const userId = request.auth.uid;
  const path = request.data.path;
  const contentType = request.data.contentType;
  // Default max 10MB
  const fileSize = request.data.fileSize || 10 * 1024 * 1024;

  if (!path || !contentType) {
    throw new Error("Path and content type are required");
  }

  // Ensure the path contains the user's ID for security
  if (!path.includes(userId)) {
    throw new Error("Unauthorized path. Must include user ID");
  }

  try {
    const bucket = getStorage().bucket();
    const file = bucket.file(path);

    // Generate a signed URL that expires in 15 minutes
    const signedUrlResponse = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: contentType,
    });

    const url = signedUrlResponse[0];

    // Log file size limits for debugging
    logger.info(
      `Generating signed URL for file: ${path} with size limit: ${fileSize}`
    );

    return {url, path};
  } catch (error) {
    logger.error("Error generating signed URL", error);
    throw new Error("Failed to generate upload URL");
  }
});

// Function to generate multiple signed URLs for batch uploads
export const getMultipleSignedUrls = onCall({
  region: "us-central1",
  cors: true, // Enable CORS for this function
}, async (request) => {
  // Verify authentication
  if (!request.auth) {
    throw new Error("Authentication required");
  }

  const userId = request.auth.uid;
  const files = request.data.files;

  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("Files array is required");
  }

  try {
    const bucket = getStorage().bucket();
    const results = await Promise.all(files.map(async (fileInfo) => {
      const {path, contentType, fileSize = 10 * 1024 * 1024} = fileInfo;

      // Validate path and content type
      if (!path || !contentType) {
        throw new Error("Path and content type are required for each file");
      }

      // Ensure path contains the user's ID for security
      if (!path.includes(userId)) {
        const msg = `Unauthorized path: ${path}. Must include user ID`;
        throw new Error(msg);
      }

      const file = bucket.file(path);

      // Generate a signed URL
      const signedUrlResponse = await file.getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType: contentType,
      });

      const url = signedUrlResponse[0];

      // Log info about the file
      logger.info(`Generated signed URL for ${path} (size limit: ${fileSize})`);

      return {url, path};
    }));

    return {urls: results};
  } catch (error) {
    logger.error("Error generating multiple signed URLs", error);
    throw new Error("Failed to generate upload URLs");
  }
});

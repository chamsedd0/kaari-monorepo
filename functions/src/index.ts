/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import cors from "cors";

// Import storage functions
import * as storageModule from "./storage";

// Initialize Firebase Admin
initializeApp();

// Configure CORS
const corsMiddleware = cors({
  origin: true, // Allows all origins, which is appropriate for development
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  maxAge: 86400, // 24 hours
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// Example HTTP function with CORS
export const helloWorld = onRequest({
  region: "us-central1",
  cors: true,
}, (request, response) => {
  // Apply CORS middleware
  corsMiddleware(request, response, () => {
    logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
  });
});

// Export storage functions
export const storage = storageModule;

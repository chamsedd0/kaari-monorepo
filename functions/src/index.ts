/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import {onSchedule} from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import cors from "cors";
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

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

// Export storage module

// Simple test function (v2 API)
export const helloWorldV2 = onRequest({
  region: "us-central1",
  cors: true,
}, (request, response) => {
  // Apply CORS middleware
  corsMiddleware(request, response, () => {
    logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
  });
});

// OTP Functions

// Function to generate a random 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP
export const sendOTP = functions.https.onCall(async (data: any, context) => {
  const { phoneNumber } = data;
  
  if (!phoneNumber) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Phone number is required"
    );
  }

  try {
    // Generate OTP
    const otp = generateOTP();
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    
    // Store OTP in Firestore with expiry time
    await admin.firestore().collection("otps").doc(phoneNumber).set({
      otp,
      expiryTime,
      attempts: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // In production, you would integrate with an SMS service here
    // For now, we'll just return success
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to send OTP"
    );
  }
});

// Function to verify OTP
export const verifyOTP = functions.https.onCall(async (data: any, context) => {
  const { phoneNumber, otp } = data;
  
  if (!phoneNumber || !otp) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Phone number and OTP are required"
    );
  }

  try {
    // Get OTP document from Firestore
    const otpDoc = await admin.firestore().collection("otps").doc(phoneNumber).get();
    
    if (!otpDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "No OTP found for this phone number"
      );
    }

    const otpData = otpDoc.data();
    
    // Check if OTP has expired
    if (otpData?.expiryTime < Date.now()) {
      throw new functions.https.HttpsError(
        "deadline-exceeded",
        "OTP has expired"
      );
    }

    // Check if max attempts exceeded (3 attempts)
    if (otpData?.attempts >= 3) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        "Maximum verification attempts exceeded"
      );
    }

    // Update attempts
    await admin.firestore().collection("otps").doc(phoneNumber).update({
      attempts: admin.firestore.FieldValue.increment(1)
    });

    // Verify OTP
    if (otpData?.otp !== otp) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid OTP"
      );
    }

    // OTP verified, delete the document
    await admin.firestore().collection("otps").doc(phoneNumber).delete();

    return { success: true, message: "OTP verified successfully" };
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    throw new functions.https.HttpsError(
      error.code || "internal",
      error.message || "Failed to verify OTP"
    );
  }
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

// Scheduled function to check property refresh notifications
export const checkPropertyRefreshNotifications = onSchedule({
  schedule: "0 9 * * *", // Run daily at 9 AM UTC
  timeZone: "UTC",
  region: "us-central1",
}, async (event) => {
  logger.info("Starting daily property refresh notification check");
  
  try {
    const db = getFirestore();
    
    // Get all available properties
    const propertiesSnapshot = await db.collection('properties')
      .where('status', '==', 'available')
      .get();
    
    // Group properties by advertiser
    const propertiesByAdvertiser = new Map<string, any[]>();
    
    propertiesSnapshot.docs.forEach(doc => {
      const property = { id: doc.id, ...doc.data() } as any;
      const ownerId = property.ownerId;
      
      if (!propertiesByAdvertiser.has(ownerId)) {
        propertiesByAdvertiser.set(ownerId, []);
      }
      propertiesByAdvertiser.get(ownerId)!.push(property);
    });
    
    // Check each advertiser's properties and send notifications
    for (const [advertiserId, properties] of propertiesByAdvertiser) {
      const propertiesNeedingReminder: any[] = [];
      const propertiesNeedingWarning: any[] = [];
      
      for (const property of properties) {
        const daysSinceRefresh = getDaysSinceLastRefresh(property);
        
        // Check if property needs warning (14+ days)
        if (daysSinceRefresh >= 14) {
          propertiesNeedingWarning.push(property);
        }
        // Check if property needs reminder (7+ days but less than 14)
        else if (daysSinceRefresh >= 7) {
          propertiesNeedingReminder.push(property);
        }
      }
      
      // Send notifications
      if (propertiesNeedingWarning.length > 0 || propertiesNeedingReminder.length > 0) {
        await sendPropertyRefreshNotifications(
          db,
          advertiserId,
          propertiesNeedingReminder,
          propertiesNeedingWarning
        );
        
        logger.info(`Sent notifications to advertiser ${advertiserId}: ${propertiesNeedingWarning.length} warnings, ${propertiesNeedingReminder.length} reminders`);
      }
    }
    
    logger.info("Property refresh notification check completed successfully");
  } catch (error) {
    logger.error("Error in property refresh notification check:", error);
    throw error;
  }
});

// Helper function to calculate days since last refresh
function getDaysSinceLastRefresh(property: any): number {
  if (!property.lastAvailabilityRefresh) {
    return Infinity;
  }
  
  const now = new Date();
  const lastRefresh = property.lastAvailabilityRefresh.toDate ? 
    property.lastAvailabilityRefresh.toDate() : 
    new Date(property.lastAvailabilityRefresh);
  
  const diffTime = Math.abs(now.getTime() - lastRefresh.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// Helper function to send notifications
async function sendPropertyRefreshNotifications(
  db: any,
  advertiserId: string,
  propertiesNeedingReminder: any[],
  propertiesNeedingWarning: any[]
): Promise<void> {
  const notificationsCollection = db.collection('notifications');
  
  if (propertiesNeedingWarning.length > 0) {
    // Send warning notifications for urgent properties
    if (propertiesNeedingWarning.length === 1) {
      const property = propertiesNeedingWarning[0];
      const daysSinceRefresh = getDaysSinceLastRefresh(property);
      
      await notificationsCollection.add({
        userId: advertiserId,
        userType: 'advertiser',
        type: 'property_refresh_warning',
        title: 'Property Refresh Warning',
        message: `URGENT: Your property "${property.title}" hasn't been refreshed for ${daysSinceRefresh} days. Please update availability immediately to keep your listing active.`,
        timestamp: new Date(),
        isRead: false,
        link: '/dashboard/advertiser/properties',
        metadata: { propertyId: property.id, daysSinceRefresh, urgent: true }
      });
    } else {
      // Multiple urgent properties
      const totalProperties = propertiesNeedingWarning.length + propertiesNeedingReminder.length;
      
      await notificationsCollection.add({
        userId: advertiserId,
        userType: 'advertiser',
        type: 'property_refresh_warning',
        title: 'Urgent: Properties Need Refresh',
        message: `You have ${totalProperties} properties that need availability refresh (${propertiesNeedingWarning.length} urgent). Please update them to keep your listings active.`,
        timestamp: new Date(),
        isRead: false,
        link: '/dashboard/advertiser/properties',
        metadata: { propertiesCount: totalProperties, urgentCount: propertiesNeedingWarning.length }
      });
    }
  } else if (propertiesNeedingReminder.length > 0) {
    // Send reminder notifications for properties needing refresh
    if (propertiesNeedingReminder.length === 1) {
      const property = propertiesNeedingReminder[0];
      const daysSinceRefresh = getDaysSinceLastRefresh(property);
      
      await notificationsCollection.add({
        userId: advertiserId,
        userType: 'advertiser',
        type: 'property_refresh_reminder',
        title: 'Property Refresh Reminder',
        message: `Your property "${property.title}" needs availability refresh. It's been ${daysSinceRefresh} days since last update.`,
        timestamp: new Date(),
        isRead: false,
        link: '/dashboard/advertiser/properties',
        metadata: { propertyId: property.id, daysSinceRefresh }
      });
    } else {
      // Multiple properties need reminder
      await notificationsCollection.add({
        userId: advertiserId,
        userType: 'advertiser',
        type: 'property_refresh_reminder',
        title: 'Properties Need Refresh',
        message: `You have ${propertiesNeedingReminder.length} properties that need availability refresh. Please update them to keep your listings active.`,
        timestamp: new Date(),
        isRead: false,
        link: '/dashboard/advertiser/properties',
        metadata: { propertiesCount: propertiesNeedingReminder.length, urgentCount: 0 }
      });
    }
  }
}

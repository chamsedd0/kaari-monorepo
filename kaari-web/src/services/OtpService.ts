import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';

// Local storage keys for development mode
const OTP_STORAGE_KEY = "kaari_dev_otp";
const OTP_EXPIRY_KEY = "kaari_dev_otp_expiry";
const OTP_ATTEMPTS_KEY = "kaari_dev_otp_attempts";

/**
 * Service for handling OTP operations
 */
export class OtpService {
  private static instance: OtpService;
  private isDevelopment: boolean;

  private constructor() {
    // Check if we're in development mode
    this.isDevelopment = process.env.NODE_ENV === "development";
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): OtpService {
    if (!OtpService.instance) {
      OtpService.instance = new OtpService();
    }
    return OtpService.instance;
  }

  /**
   * Send OTP to a phone number
   * @param phoneNumber - The phone number to send OTP to
   * @returns Promise with success status and message
   */
  public async sendOtp(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      // Normalize the phone number to ensure consistent format
      const normalizedPhone = this.normalizePhoneNumber(phoneNumber);
      
      if (this.isDevelopment) {
        // In development, store OTP in local storage
        // Always use "000000" as the OTP in development mode for easier testing
        const otp = "000000";
        const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes
        
        localStorage.setItem(OTP_STORAGE_KEY, otp);
        localStorage.setItem(OTP_EXPIRY_KEY, expiryTime.toString());
        localStorage.setItem(OTP_ATTEMPTS_KEY, "0");
        
        return { success: true, message: "OTP sent successfully" };
      } else {
        // In production, use Firebase Cloud Function
        const functions = getFunctions(getApp());
        const sendOtpFunction = httpsCallable(functions, "sendOTP");
        
        const result = await sendOtpFunction({ phoneNumber: normalizedPhone });
        return result.data as { success: boolean; message: string };
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      
      // For development fallback, still return success and set the OTP
      if (this.isDevelopment) {
        const otp = "000000";
        const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes
        
        localStorage.setItem(OTP_STORAGE_KEY, otp);
        localStorage.setItem(OTP_EXPIRY_KEY, expiryTime.toString());
        localStorage.setItem(OTP_ATTEMPTS_KEY, "0");
        
        return { success: true, message: "OTP sent successfully (fallback)" };
      }
      
      return { success: false, message: "Failed to send OTP" };
    }
  }

  /**
   * Verify OTP for a phone number
   * @param phoneNumber - The phone number to verify
   * @param otp - The OTP code to verify
   * @returns Promise with success status and message
   */
  public async verifyOtp(phoneNumber: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      // Normalize the phone number to ensure consistent format
      const normalizedPhone = this.normalizePhoneNumber(phoneNumber);
      
      if (this.isDevelopment) {
        // In development mode, always accept "000000" as a valid OTP for easier testing
        if (otp === "000000") {
          return { success: true, message: "OTP verified successfully" };
        }
        
        // Otherwise, verify OTP from local storage
        const storedOtp = localStorage.getItem(OTP_STORAGE_KEY);
        const expiryTime = Number(localStorage.getItem(OTP_EXPIRY_KEY) || "0");
        const attempts = Number(localStorage.getItem(OTP_ATTEMPTS_KEY) || "0");
        
        // Check if OTP exists
        if (!storedOtp) {
          return { success: false, message: "No OTP found for this phone number" };
        }
        
        // Check if OTP has expired
        if (expiryTime < Date.now()) {
          return { success: false, message: "OTP has expired" };
        }
        
        // Check if max attempts exceeded
        if (attempts >= 3) {
          return { success: false, message: "Maximum verification attempts exceeded" };
        }
        
        // Update attempts
        localStorage.setItem(OTP_ATTEMPTS_KEY, (attempts + 1).toString());
        
        // Verify OTP
        if (storedOtp !== otp) {
          return { success: false, message: "Invalid OTP" };
        }
        
        // OTP verified, clear storage
        localStorage.removeItem(OTP_STORAGE_KEY);
        localStorage.removeItem(OTP_EXPIRY_KEY);
        localStorage.removeItem(OTP_ATTEMPTS_KEY);
        
        return { success: true, message: "OTP verified successfully" };
      } else {
        // In production, use Firebase Cloud Function
        const functions = getFunctions(getApp());
        const verifyOtpFunction = httpsCallable(functions, "verifyOTP");
        
        const result = await verifyOtpFunction({ phoneNumber: normalizedPhone, otp });
        return result.data as { success: boolean; message: string };
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      
      // For development fallback, accept "000000" as valid OTP
      if (this.isDevelopment && otp === "000000") {
        return { success: true, message: "OTP verified successfully (fallback)" };
      }
      
      return { 
        success: false, 
        message: error.message || "Failed to verify OTP" 
      };
    }
  }
  
  /**
   * Normalize a phone number to E.164 format for consistent storage and lookup
   * @param phoneNumber - The phone number to normalize
   * @returns Normalized phone number in E.164 format
   */
  private normalizePhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');
    
    // Handle Moroccan numbers
    if (digits.startsWith('212')) {
      // Already in international format
      return `+${digits}`;
    } else if (digits.startsWith('0')) {
      // Convert from national format (0X...) to international format (+212X...)
      return `+212${digits.substring(1)}`;
    } else if (digits.length === 9 && (digits.startsWith('6') || digits.startsWith('7'))) {
      // Just the 9 digits without country code or leading zero
      return `+212${digits}`;
    }
    
    // If we can't normalize it, return as is with + prefix if needed
    return digits.startsWith('+') ? digits : `+${digits}`;
  }
}

export default OtpService.getInstance(); 
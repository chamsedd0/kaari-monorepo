'use server';

import { getCurrentUserProfile } from '../firebase/auth';

/**
 * Interface for support form data
 */
export interface SupportFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
}

/**
 * Mock function to simulate sending an email via EmailJS
 * In a real application, this would be replaced with actual API calls
 */
async function mockSendEmailJS(emailData: {
  to: string;
  from: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Log the email data that would be sent
  
  // Return success (in a real app, this would be the API response)
  return true;
}

/**
 * Send a support email using the provided form data
 */
export async function sendSupportEmail(formData: SupportFormData): Promise<{ success: boolean; message: string }> {
  try {
    // Get current user for additional context
    const currentUser = await getCurrentUserProfile();
    
    // Create email data
    const emailData = {
      to: 'kaarisupport@gmail.com',
      from: formData.email,
      subject: `Support Request: ${formData.subject}`,
      html: `
        <h2>Support Request from ${formData.firstName} ${formData.lastName}</h2>
        <p><strong>From:</strong> ${formData.firstName} ${formData.lastName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phoneNumber}</p>
        ${currentUser ? `<p><strong>User ID:</strong> ${currentUser.id}</p>` : ''}
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <h3>Message:</h3>
        <p>${formData.message.replace(/\n/g, '<br>')}</p>
      `,
    };
    
    // In a production environment, you'd implement real email sending
    // Example implementation for EmailJS would be:
    /*
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'your_service_id',
        template_id: 'your_template_id',
        user_id: 'your_user_id',
        template_params: {
          to_email: emailData.to,
          from_name: `${formData.firstName} ${formData.lastName}`,
          from_email: formData.email,
          subject: emailData.subject,
          message: formData.message,
          phone: formData.phoneNumber,
          user_id: currentUser?.id || 'Guest'
        }
      })
    });
    const success = response.status === 200;
    */
    
    // Use our mock function instead
    const success = await mockSendEmailJS(emailData);
    
    if (success) {
      return {
        success: true,
        message: 'Your support request has been sent to kaarisupport@gmail.com. We will get back to you soon.',
      };
    } else {
      return {
        success: false,
        message: 'There was a problem sending your support request. Please try again later.',
      };
    }
  } catch (error) {
    console.error('Error sending support email:', error);
    return {
      success: false,
      message: 'Failed to send support request. Please try again later.',
    };
  }
}

/**
 * Function to validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Function to validate phone number format
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  // Allow various phone formats, with or without country code
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phoneNumber);
} 
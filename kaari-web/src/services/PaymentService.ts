/**
 * Payment Service for Payzone integration
 * This service handles all payment-related operations with our payment gateway
 */

// Configuration
const PAYMENT_API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.yourproduction.com/api/payments'  // Replace with your production API URL
  : 'http://localhost:3001/api/payments';  // Local development API URL

/**
 * Initiates a payment and returns a redirect URL to Payzone's payment page
 */
export async function initiatePayment(paymentData: {
  amount: number;
  currency?: string;
  orderID: string;
  customerEmail: string;
  customerName?: string;
  redirectURL: string;
  callbackURL: string;
  customData?: Record<string, any>;
}): Promise<{ success: boolean; paymentUrl?: string; error?: string }> {
  try {
    const response = await fetch(`${PAYMENT_API_URL}/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to initiate payment');
    }

    return data;
  } catch (error) {
    console.error('Payment initiation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown payment error',
    };
  }
}

/**
 * Checks the status of a payment by order ID
 */
export async function checkPaymentStatus(orderID: string): Promise<{
  success: boolean;
  status?: any;
  error?: string;
}> {
  try {
    const response = await fetch(`${PAYMENT_API_URL}/status/${orderID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to check payment status');
    }

    return data;
  } catch (error) {
    console.error('Payment status check error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error checking payment status',
    };
  }
}

/**
 * Processes a refund for a transaction
 */
export async function refundPayment(data: {
  transactionID: string;
  amount: number;
  reason?: string;
}): Promise<{
  success: boolean;
  refund?: any;
  error?: string;
}> {
  try {
    const response = await fetch(`${PAYMENT_API_URL}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to process refund');
    }

    return responseData;
  } catch (error) {
    console.error('Refund error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error processing refund',
    };
  }
}

export default {
  initiatePayment,
  checkPaymentStatus,
  refundPayment,
}; 
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

/**
 * API route to handle payment callbacks from Payzone
 * This endpoint will be called by Payzone when a payment is processed
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'KO', message: 'Method not allowed' });
  }
  
  try {
    // Get the signature from headers
    const signature = req.headers['x-callback-signature'];
    
    if (!signature) {
      console.error('Missing signature in payment callback');
      return res.status(400).json({ status: 'KO', message: 'Missing signature' });
    }
    
    // Get the raw request body
    const paymentData = req.body;
    const rawBody = JSON.stringify(paymentData);
    
    // Get the notification key from environment variables
    const notificationKey = process.env.PAYZONE_NOTIFICATION_KEY || 'yw06hJBzkheD3ARA';
    
    // Calculate signature using HMAC-SHA256
    const calculatedSignature = crypto
      .createHmac('sha256', notificationKey)
      .update(rawBody)
      .digest('hex');
    
    // Verify signature
    if (signature !== calculatedSignature) {
      console.error('Invalid callback signature');
      console.error(`Received: ${signature}, Calculated: ${calculatedSignature}`);
      return res.status(200).json({ status: 'KO', message: 'Error signature' });
    }
    
    // Log the payment callback for debugging
    console.log('Payment callback received:', {
      status: paymentData.status,
      transactions: paymentData.transactions?.map((t: any) => ({
        state: t.state,
        resultCode: t.resultCode,
        amount: t.amount,
        orderID: t.orderID || paymentData.orderID,
        transactionID: t.transactionID,
      })),
    });
    
    // Process the payment result
    if (paymentData.status === 'CHARGED') {
      let transactionData = null;
      
      // Find the approved transaction
      for (const transaction of paymentData.transactions || []) {
        if (transaction.state === 'APPROVED') {
          transactionData = transaction;
          break;
        }
      }
      
      if (transactionData && transactionData.resultCode === 0) {
        // Successful payment - in a real implementation, you would:
        // 1. Extract the order ID (format: res_RESERVATION-ID_TIMESTAMP)
        const orderID = transactionData.orderID || paymentData.orderID;
        
        // 2. Update the reservation status in your database
        try {
          // Here you would update your database with the payment information
          // For example, using Firebase or your backend API
          
          // For now, we'll just log the success
          console.log(`Payment successful for order ${orderID}:`, transactionData);
          
          // 3. Send notifications to the user and advertiser
          // This would typically be done through your notification service
          
        } catch (dbError) {
          console.error('Error updating database:', dbError);
          // Even if database update fails, we should still return 200 OK to Payzone
        }
        
        return res.status(200).json({
          status: 'OK',
          message: 'Status recorded successfully'
        });
      } else {
        console.log('Payment not approved:', paymentData);
      }
    } else if (paymentData.status === 'DECLINED') {
      // Payment declined
      console.log('Payment declined:', paymentData);
      
      // Here you would update your database to mark the payment as failed
    }
    
    // Default response
    return res.status(200).json({
      status: 'OK',
      message: 'Callback received'
    });
  } catch (error) {
    console.error('Error processing payment callback:', error);
    // Always return 200 to acknowledge receipt, even on error
    return res.status(200).json({
      status: 'KO',
      message: 'Error processing callback',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// Payzone credentials from environment variables
const MERCHANT_ACCOUNT = process.env.PAYZONE_MERCHANT_ACCOUNT || 'kaari_monorepo_vercel_Test';
const PAYWALL_SECRET_KEY = process.env.PAYZONE_PAYWALL_SECRET_KEY || '5Wkxa8VkO6LzREMk';
const PAYWALL_URL = process.env.PAYZONE_PAYWALL_URL || 'https://payment-sandbox.payzone.ma/pwthree/launch';
const NOTIFICATION_KEY = process.env.PAYZONE_NOTIFICATION_KEY || 'yw06hJBzkheD3ARA';

/**
 * Initiate a payment and return HTML form for redirect
 * POST /api/payments/initiate
 */
router.post('/initiate', async (req, res) => {
  try {
    const {
      amount,
      currency = 'MAD',
      orderID,
      customerEmail,
      customerName,
      redirectURL,
      callbackURL,
      customData = {}
    } = req.body;

    if (!amount || !orderID || !customerEmail || !redirectURL || !callbackURL) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Generate timestamp for unique IDs
    const timestamp = Math.floor(Date.now() / 1000);

    // Create the payload according to Payzone specifications
    const payload = {
      // Authentication parameters
      merchantAccount: MERCHANT_ACCOUNT,
      timestamp: timestamp,
      skin: 'vps-1-vue', // fixed value

      // Customer parameters
      customerId: `customer_${timestamp}`, // must be unique for each customer
      customerCountry: 'MA', // fixed value for Morocco
      customerLocale: 'en_US', // or fr_FR if preferred
      
      // Charge parameters
      chargeId: `charge_${timestamp}`, // unique charge ID
      orderId: orderID,
      price: String(amount), // Payzone expects amount as string
      currency: currency,
      description: customData.description || 'Kaari Reservation Payment',
      
      // Deep linking
      mode: 'DEEP_LINK', // fixed value
      paymentMethod: 'CREDIT_CARD', // fixed value
      showPaymentProfiles: 'false',
      
      // URLs
      callbackUrl: callbackURL,
      successUrl: redirectURL,
      failureUrl: `${redirectURL.split('?')[0]}?status=failed`,
      cancelUrl: `${redirectURL.split('?')[0]}?status=cancelled`,
    };

    // Convert payload to JSON string
    const jsonPayload = JSON.stringify(payload);
    
    // Generate signature using SHA-256
    const signature = crypto.createHash('sha256')
      .update(PAYWALL_SECRET_KEY + jsonPayload)
      .digest('hex');

    // Create HTML form for auto-submission
    const formHtml = `
      <html>
        <head>
          <title>Redirecting to payment...</title>
        </head>
        <body>
          <form id="paymentForm" action="${PAYWALL_URL}" method="POST">
            <input type="hidden" name="payload" value='${jsonPayload}' />
            <input type="hidden" name="signature" value="${signature}" />
          </form>
          <script>
            document.getElementById("paymentForm").submit();
          </script>
        </body>
      </html>
    `;

    // Return the form HTML
    res.setHeader('Content-Type', 'text/html');
    return res.send(formHtml);
  } catch (error) {
    console.error('Payment initiation error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.message
    });
  }
});

/**
 * Handle payment callback from Payzone
 * POST /api/payments/callback
 */
router.post('/callback', (req, res) => {
  try {
    // Get the raw request body
    const input = JSON.stringify(req.body);
    
    // Calculate signature using HMAC-SHA256
    const signature = crypto
      .createHmac('sha256', NOTIFICATION_KEY)
      .update(input)
      .digest('hex');
    
    // Get the signature from headers
    const receivedSignature = req.get('X-Callback-Signature');
    
    // Verify signature
    if (signature !== receivedSignature) {
      console.error('Invalid callback signature');
      return res.status(200).json({
        status: 'KO',
        message: 'Error signature'
      });
    }

    // Process the payment result
    const paymentData = req.body;
    
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
        // Successful payment
        console.log('Payment successful:', transactionData);
        
        // TODO: Update order status in your database
        
        return res.status(200).json({
          status: 'OK',
          message: 'Status recorded successfully'
        });
      } else {
        console.log('Payment not approved:', paymentData);
        return res.status(200).json({
          status: 'KO',
          message: 'Status not recorded successfully'
        });
      }
    } else if (paymentData.status === 'DECLINED') {
      let transactionData = null;
      
      // Find the declined transaction
      for (const transaction of paymentData.transactions || []) {
        if (transaction.state === 'DECLINED') {
          transactionData = transaction;
          break;
        }
      }
      
      console.log('Payment declined:', transactionData);
      
      return res.status(200).json({
        status: 'KO',
        message: 'Status not recorded successfully'
      });
    }
    
    // Default response for other statuses
    return res.status(200).json({
      status: 'OK',
      message: 'Callback received'
    });
  } catch (error) {
    console.error('Payment callback error:', error);
    // Always return 200 to acknowledge receipt
    return res.status(200).json({
      status: 'KO',
      message: 'Error processing callback',
      error: error.message
    });
  }
});

/**
 * Check payment status - This endpoint is not part of the new integration
 * but kept for backward compatibility
 */
router.get('/status/:orderID', async (req, res) => {
  try {
    const { orderID } = req.params;
    
    if (!orderID) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Since the new integration doesn't provide a status check API,
    // we'll return a message indicating that status must be tracked via callbacks
    return res.json({
      success: true,
      message: 'Payment status should be tracked via callbacks in the new integration',
      orderID: orderID
    });
  } catch (error) {
    console.error('Payment status check error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to check payment status',
      error: error.message
    });
  }
});

module.exports = router; 
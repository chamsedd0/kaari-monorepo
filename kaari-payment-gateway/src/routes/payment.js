const express = require('express');
const axios = require('axios');
const router = express.Router();
const { decryptPayzoneCallback } = require('../utils/crypto');

// Payzone API credentials
const PAYZONE_API_URL = process.env.PAYZONE_API_URL;
const ORIGINATOR_ID = process.env.PAYZONE_ORIGINATOR_ID;
const PASSWORD = process.env.PAYZONE_PASSWORD;
const MERCHANT_TOKEN = process.env.PAYZONE_MERCHANT_TOKEN;

/**
 * Initiate a payment and get a redirect URL
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

    const paymentData = {
      amount: String(amount), // Payzone expects amount as string
      currency,
      orderID,
      ctrlCustomData: JSON.stringify(customData),
      customer: {
        email: customerEmail,
        name: customerName
      },
      ctrlRedirectURL: redirectURL,
      ctrlCallbackURL: callbackURL
    };

    const response = await axios.post(
      `${PAYZONE_API_URL}/paymentPageInit`,
      paymentData,
      {
        auth: {
          username: ORIGINATOR_ID,
          password: PASSWORD
        }
      }
    );

    if (response.data && response.data.redirectUrl) {
      return res.json({
        success: true,
        paymentUrl: response.data.redirectUrl
      });
    } else {
      throw new Error('Invalid response from Payzone');
    }
  } catch (error) {
    console.error('Payment initiation error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.response?.data || error.message
    });
  }
});

/**
 * Handle payment callback from Payzone
 * POST /api/payments/callback
 */
router.post('/callback', (req, res) => {
  try {
    const encryptedData = req.body.data;
    
    if (!encryptedData) {
      return res.status(400).json({
        success: false,
        message: 'No encrypted data received'
      });
    }

    // Use the utility function to decrypt the data
    const result = decryptPayzoneCallback(encryptedData, MERCHANT_TOKEN);

    // Process the payment result
    // TODO: Update order status in your database based on result
    console.log('Payment callback received:', result);

    // Always return 200 OK to Payzone to acknowledge receipt
    return res.status(200).json({
      success: true,
      message: 'Callback received and processed'
    });
  } catch (error) {
    console.error('Payment callback error:', error);
    // Still return 200 to acknowledge receipt
    return res.status(200).json({
      success: false,
      message: 'Error processing callback',
      error: error.message
    });
  }
});

/**
 * Check payment status
 * GET /api/payments/status/:orderID
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

    const response = await axios.get(
      `${PAYZONE_API_URL}/transaction/query`,
      {
        params: { orderID },
        auth: {
          username: ORIGINATOR_ID,
          password: PASSWORD
        }
      }
    );

    return res.json({
      success: true,
      status: response.data
    });
  } catch (error) {
    console.error('Payment status check error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to check payment status',
      error: error.response?.data || error.message
    });
  }
});

/**
 * Refund a transaction
 * POST /api/payments/refund
 */
router.post('/refund', async (req, res) => {
  try {
    const { transactionID, amount, reason } = req.body;
    
    if (!transactionID || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID and amount are required'
      });
    }

    const refundData = {
      transactionID,
      amount: String(amount),
      reason: reason || 'Customer request'
    };

    const response = await axios.post(
      `${PAYZONE_API_URL}/transaction/refund`,
      refundData,
      {
        auth: {
          username: ORIGINATOR_ID,
          password: PASSWORD
        }
      }
    );

    return res.json({
      success: true,
      refund: response.data
    });
  } catch (error) {
    console.error('Refund error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.response?.data || error.message
    });
  }
});

module.exports = router; 
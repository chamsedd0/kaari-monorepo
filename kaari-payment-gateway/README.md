# Kaari Payment Gateway

A secure payment gateway service for Kaari using Payzone integration.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your Payzone credentials:
   ```
   # Payzone Credentials
   PAYZONE_MERCHANT_ACCOUNT=kaari_monorepo_vercel_Test
   PAYZONE_PAYWALL_SECRET_KEY=5Wkxa8VkO6LzREMk
   PAYZONE_PAYWALL_URL=https://payment-sandbox.payzone.ma/pwthree/launch
   PAYZONE_NOTIFICATION_KEY=yw06hJBzkheD3ARA
   
   # Server Configuration
   PORT=3001
   ```

## Running the Server

### Development mode
```
npm run dev
```

### Production mode
```
npm start
```

## API Endpoints

### Initiate Payment
- **URL**: `/api/payments/initiate`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "amount": "1000",
    "currency": "MAD",
    "orderID": "ORDER123",
    "customerEmail": "customer@example.com",
    "customerName": "Customer Name",
    "redirectURL": "https://yourapp.com/payment-success",
    "callbackURL": "https://yourapp.com/api/payment-callback",
    "customData": {
      "userId": "user123",
      "productId": "product456"
    }
  }
  ```
- **Response**: HTML form that auto-submits to Payzone's payment page

### Payment Callback
- **URL**: `/api/payments/callback`
- **Method**: `POST`
- **Description**: Endpoint for Payzone to send payment status updates

## Test Card Details

For testing the payment gateway in sandbox mode, use the following test card:

- **Card Number**: 4111111111111111
- **Expiration Date**: Any future date (e.g., 08/25)
- **CVV**: 000

## Important Notes

1. The integration is currently set up for TEST mode only. When ready for production, contact Payzone for production credentials.
2. Remember to include Payzone's logo in your website footer and include their Terms and Conditions. 
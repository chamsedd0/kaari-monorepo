# Kaari Payment Gateway

A secure payment gateway service for Kaari using Payzone integration.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the `.env.example` file to `.env` and update with your Payzone credentials:
   ```
   cp .env.example .env
   ```
4. Update the following environment variables in the `.env` file:
   - `PAYZONE_ORIGINATOR_ID`: Your Payzone originator ID
   - `PAYZONE_PASSWORD`: Your Payzone password
   - `PAYZONE_MERCHANT_TOKEN`: Your Payzone merchant token
   - `PAYZONE_API_URL`: Payzone API URL (default: https://api.payzone.ma)

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
- **Response**:
  ```json
  {
    "success": true,
    "paymentUrl": "https://api.payzone.ma/payment?token=xyz123"
  }
  ```

### Payment Callback
- **URL**: `/api/payments/callback`
- **Method**: `POST`
- **Description**: Endpoint for Payzone to send payment status updates

### Check Payment Status
- **URL**: `/api/payments/status/:orderID`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "success": true,
    "status": {
      "transactionID": "T123456",
      "orderID": "ORDER123",
      "amount": "1000",
      "currency": "MAD",
      "status": "APPROVED",
      "createdAt": "2023-01-01T12:00:00Z"
    }
  }
  ```

### Refund Transaction
- **URL**: `/api/payments/refund`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "transactionID": "T123456",
    "amount": "1000",
    "reason": "Customer request"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "refund": {
      "refundID": "R789012",
      "transactionID": "T123456",
      "amount": "1000",
      "status": "APPROVED"
    }
  }
  ```

## Integration with Frontend

To integrate with your React frontend, create a payment service that calls these API endpoints. Example:

```javascript
// In your frontend payment service
const initiatePayment = async (paymentDetails) => {
  const response = await fetch('http://localhost:3001/api/payments/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentDetails),
  });
  
  const data = await response.json();
  
  if (data.success && data.paymentUrl) {
    // Redirect the user to the Payzone payment page
    window.location.href = data.paymentUrl;
  } else {
    throw new Error('Failed to initiate payment');
  }
};
```

## Security Considerations

- Never store or log sensitive payment information
- Always use HTTPS in production
- Keep your Payzone credentials secure and never expose them in frontend code 
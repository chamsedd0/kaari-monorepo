require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root endpoint for testing
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Kaari Payment Gateway API is running',
    endpoints: {
      health: '/health',
      payments: '/api/payments/initiate'
    }
  });
});

// Import routes
const paymentRoutes = require('./routes/payment');

// Use routes
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Payment gateway service is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Payment gateway server running on port ${PORT}`);
});

module.exports = app; 
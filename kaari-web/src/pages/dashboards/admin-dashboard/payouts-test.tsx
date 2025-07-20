'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  TextField, 
  Card, 
  CardContent, 
  Divider, 
  Alert, 
  CircularProgress,
  Grid,
  Paper
} from '@mui/material';

// Use absolute paths for server actions
import { processSafetyWindowClosures, checkAndProcessSafetyWindow } from '@/backend/server-actions/PayoutsServerActions';
import { createSampleRefundRequest, createSampleCancellationRequest, approveRefundRequest, approveCancellationRequest } from '@/backend/server-actions/AdminServerActions';

export default function PayoutsTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState('');
  const [refundRequestId, setRefundRequestId] = useState('');
  const [cancellationRequestId, setCancellationRequestId] = useState('');

  const handleProcessSafetyWindowClosures = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await processSafetyWindowClosures();
      setResult(result);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckSafetyWindow = async () => {
    if (!bookingId.trim()) {
      setError('Please enter a booking ID');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await checkAndProcessSafetyWindow(bookingId);
      setResult(result);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSampleRefund = async () => {
    setLoading(true);
    setError(null);
    try {
      const id = await createSampleRefundRequest();
      setRefundRequestId(id);
      setResult({ message: `Created sample refund request with ID: ${id}` });
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRefund = async () => {
    if (!refundRequestId.trim()) {
      setError('Please enter a refund request ID or create a sample one');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await approveRefundRequest(refundRequestId);
      setResult({ message: `Approved refund request: ${refundRequestId}. Check pending payouts.` });
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSampleCancellation = async () => {
    setLoading(true);
    setError(null);
    try {
      const id = await createSampleCancellationRequest();
      setCancellationRequestId(id);
      setResult({ message: `Created sample cancellation request with ID: ${id}` });
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCancellation = async () => {
    if (!cancellationRequestId.trim()) {
      setError('Please enter a cancellation request ID or create a sample one');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await approveCancellationRequest(cancellationRequestId);
      setResult({ message: `Approved cancellation request: ${cancellationRequestId}. Check pending payouts.` });
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Payouts Testing Page
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        This page allows you to test various payout functionalities.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
            {typeof result === 'object' ? JSON.stringify(result, null, 2) : result}
          </pre>
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Safety Window Closure Tests
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleProcessSafetyWindowClosures}
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Process All Safety Window Closures'}
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                This will find all eligible bookings and create payouts for them
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Booking ID"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleCheckSafetyWindow}
                disabled={loading || !bookingId}
                sx={{ mt: 1 }}
                fullWidth
              >
                Check & Process Specific Booking
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Refund Tests
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleCreateSampleRefund}
                disabled={loading}
                fullWidth
              >
                Create Sample Refund Request
              </Button>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Refund Request ID"
                value={refundRequestId}
                onChange={(e) => setRefundRequestId(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={handleApproveRefund}
                disabled={loading || !refundRequestId}
                sx={{ mt: 1 }}
                fullWidth
              >
                Approve Refund Request
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                This will approve the refund and create a payout
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cancellation Tests
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Button 
                variant="contained" 
                color="warning" 
                onClick={handleCreateSampleCancellation}
                disabled={loading}
                fullWidth
              >
                Create Sample Cancellation Request
              </Button>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Cancellation Request ID"
                value={cancellationRequestId}
                onChange={(e) => setCancellationRequestId(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button 
                variant="outlined" 
                color="warning" 
                onClick={handleApproveCancellation}
                disabled={loading || !cancellationRequestId}
                sx={{ mt: 1 }}
                fullWidth
              >
                Approve Cancellation Request
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                This will approve the cancellation, create a refund request, and create a cushion payout for the advertiser
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Instructions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body2" paragraph>
              <strong>Testing Flow:</strong>
            </Typography>
            
            <ol style={{ paddingLeft: '1.5rem' }}>
              <li>Create a sample refund or cancellation request</li>
              <li>Approve the request to generate a payout</li>
              <li>Go to the Pending Payouts page to see the created payout</li>
              <li>Process the payout to mark it as paid</li>
            </ol>
            
            <Typography variant="body2" paragraph>
              <strong>Safety Window Testing:</strong>
            </Typography>
            
            <ol style={{ paddingLeft: '1.5rem' }}>
              <li>Create a booking with a move-in date in the past (>24 hours ago)</li>
              <li>Run the "Process All Safety Window Closures" function</li>
              <li>Go to the Pending Payouts page to see the created rent payout</li>
            </ol>
            
            <Typography variant="body2" color="error">
              Note: These operations create real database entries. Use only in development/testing environments.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 
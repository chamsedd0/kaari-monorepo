import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../backend/firebase/config';
import { getAuth } from 'firebase/auth';

interface PaymentMethodRequiredModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function PaymentMethodRequiredModal({
  open,
  onClose,
  onSuccess
}: PaymentMethodRequiredModalProps) {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [type, setType] = useState<'RIB' | 'IBAN'>('RIB');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('You must be logged in to add a payment method');
      }
      
      console.log('Adding payment method for user:', user.uid);
      
      // Add to payoutMethods collection
      const docRef = await addDoc(collection(db, 'payoutMethods'), {
        userId: user.uid,
        bankName,
        accountNumber,
        type,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isVerified: false // Admin will need to verify this
      });
      
      console.log('Payment method added with ID:', docRef.id);
      
      setSuccess(true);
      
      // Reset form
      setBankName('');
      setAccountNumber('');
      setType('RIB');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error adding payment method:', err);
      setError(err instanceof Error ? err.message : 'Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Add Payment Method
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            A payment method is required to receive payments from Kaari.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please provide your bank account details below. This information will be used for all future payouts.
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Payment method added successfully!
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={loading || success}
          />
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Account Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as 'RIB' | 'IBAN')}
              label="Account Type"
              disabled={loading || success}
            >
              <MenuItem value="RIB">RIB</MenuItem>
              <MenuItem value="IBAN">IBAN</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={loading || success}
            helperText={`Please enter your ${type} number`}
          />
          
          <DialogActions sx={{ px: 0, pt: 2 }}>
            <Button 
              onClick={onClose} 
              disabled={loading}
              color="inherit"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading || success || !bankName || !accountNumber}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Saving...' : success ? 'Saved!' : 'Save Payment Method'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
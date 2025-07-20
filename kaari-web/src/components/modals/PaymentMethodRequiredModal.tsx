import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Typography, 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { Theme } from '../../theme/theme';
import { updateUserPaymentMethod } from '../../backend/server-actions/UserServerActions';
import { useStore } from '../../backend/store';

interface PaymentMethodRequiredModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  requiredFor?: 'refund' | 'payout';
}

const PaymentMethodRequiredModal: React.FC<PaymentMethodRequiredModalProps> = ({ 
  open, 
  onClose,
  onSuccess,
  requiredFor = 'payout'
}) => {
  const { user } = useStore();
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState<'RIB' | 'IBAN'>('RIB');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    bankName?: string;
    accountNumber?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      bankName?: string;
      accountNumber?: string;
    } = {};
    
    if (!bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }
    
    if (!accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (accountType === 'RIB' && !/^\d{20}$/.test(accountNumber.replace(/\s/g, ''))) {
      newErrors.accountNumber = 'RIB must be 20 digits';
    } else if (accountType === 'IBAN' && !/^[A-Z]{2}\d{2}[A-Z0-9]{4}\d{16}$/i.test(accountNumber.replace(/\s/g, ''))) {
      newErrors.accountNumber = 'Invalid IBAN format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      await updateUserPaymentMethod({
        bankName,
        accountNumber: accountNumber.replace(/\s/g, ''),
        type: accountType
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating payment method:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (requiredFor === 'refund') {
      return 'Add Payment Method for Refund';
    }
    return 'Add Payment Method for Payouts';
  };

  const getMessage = () => {
    if (requiredFor === 'refund') {
      return 'To process your refund, we need your bank account information. Please provide your bank details below.';
    }
    return 'To receive payments for your bookings, we need your bank account information. Please provide your bank details below.';
  };

  return (
    <Dialog 
      open={open} 
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        bgcolor: Theme.colors.secondary,
        color: 'white',
        fontWeight: 'bold'
      }}>
        {getTitle()}
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body1" paragraph>
          {getMessage()}
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>Account Type</InputLabel>
            <Select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as 'RIB' | 'IBAN')}
              label="Account Type"
              disabled={loading}
            >
              <MenuItem value="RIB">RIB (Moroccan Bank Account)</MenuItem>
              <MenuItem value="IBAN">IBAN (International Bank Account)</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Bank Name"
            variant="outlined"
            fullWidth
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            error={!!errors.bankName}
            helperText={errors.bankName}
            disabled={loading}
            sx={{ mb: 2 }}
          />
          
          <TextField
            label={accountType === 'RIB' ? 'RIB Number' : 'IBAN Number'}
            variant="outlined"
            fullWidth
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            error={!!errors.accountNumber}
            helperText={errors.accountNumber || (
              accountType === 'RIB' 
                ? '20-digit number without spaces' 
                : 'Format: XX00XXXX0000000000000000'
            )}
            disabled={loading}
          />
        </Box>
        
        <Typography variant="caption" color="textSecondary">
          Your bank details are securely stored and will only be used for processing payments.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="secondary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Saving...' : 'Save Payment Method'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentMethodRequiredModal; 
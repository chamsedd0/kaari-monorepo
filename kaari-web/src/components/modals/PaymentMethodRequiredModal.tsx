import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogActions, Box, CircularProgress, Alert } from '@mui/material';
import { addDoc, collection, serverTimestamp, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../backend/firebase/config';
import { getAuth } from 'firebase/auth';
import { Theme } from '../../theme/theme';
import InputBaseModel from '../skeletons/inputs/input-fields/input-variant';
import SelectFieldBaseModel from '../skeletons/inputs/select-fields/select-field-base-model';
import { PurpleButtonMB48 } from '../skeletons/buttons/purple_MB48';
import { BpurpleButtonMB48 } from '../skeletons/buttons/border_purple_MB48';
import MoneyShieldIcon from '../skeletons/icons/Security.svg';

interface PaymentMethodRequiredModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type AccountType = 'RIB' | 'IBAN';

export default function PaymentMethodRequiredModal({ open, onClose, onSuccess }: PaymentMethodRequiredModalProps) {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [type, setType] = useState<AccountType>('RIB');
  const [setDefault, setSetDefault] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Helpers
  const sanitizeDigits = (value: string) => value.replace(/\D/g, '');
  const sanitizeIban = (value: string) => value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  const formatRIB = (value: string) => {
    const digits = sanitizeDigits(value).slice(0, 23);
    const groups: string[] = [];
    for (let i = 0; i < digits.length; i += 4) groups.push(digits.slice(i, i + 4));
    return groups.join(' ').trim();
  };

  const formatIBAN = (value: string) => {
    const text = sanitizeIban(value).slice(0, 34);
    const groups: string[] = [];
    for (let i = 0; i < text.length; i += 4) groups.push(text.slice(i, i + 4));
    return groups.join(' ').trim();
  };

  const normalizedAccount = useMemo(() => accountNumber.replace(/\s+/g, ''), [accountNumber]);

  const accountError = useMemo(() => {
    if (type === 'RIB') {
      if (!/^\d{23}$/.test(normalizedAccount)) return 'RIB must be 23 digits';
    } else {
      if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(normalizedAccount)) return 'Invalid IBAN format';
    }
    return '';
  }, [type, normalizedAccount]);

  const isSaveDisabled = loading || success || !bankName.trim() || !!accountError;

  const handleAccountChange = (raw: string) => {
    setAccountNumber(type === 'RIB' ? formatRIB(raw) : formatIBAN(raw));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('You must be logged in to add a payment method');

      // Create new method first
      const colRef = collection(db, 'payoutMethods');
      const docRef = await addDoc(colRef, {
        userId: user.uid,
        bankName: bankName.trim(),
        accountNumber: normalizedAccount,
        type,
        isDefault: setDefault,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isVerified: false,
      });

      // If set as default, unset previous defaults
      if (setDefault) {
        const q = query(colRef, where('userId', '==', user.uid));
        const snap = await getDocs(q);
        await Promise.all(
          snap.docs
            .filter(d => d.id !== docRef.id && d.data()?.isDefault)
            .map(d => updateDoc(doc(db, 'payoutMethods', d.id), { isDefault: false, updatedAt: serverTimestamp() }))
        );
      }

      setSuccess(true);
      setBankName('');
      setAccountNumber('');
      setType('RIB');
      if (onSuccess) onSuccess();
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      console.error('Error adding payment method:', err);
      setError(err instanceof Error ? err.message : 'Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${Theme.colors.fifth}`,
          boxShadow: '0 24px 60px rgba(0,0,0,0.12)'
        }
      }}
    >
      <DialogContent sx={{ p: 3.5 }}>
        <Box sx={{ mb: 2, display: 'grid', gridTemplateColumns: '48px 1fr', columnGap: 1.5, alignItems: 'center' }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '50%', background: `${Theme.colors.secondary}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={MoneyShieldIcon} alt="secure" style={{ width: 22, height: 22, filter: 'brightness(0) invert(1)' }} />
          </Box>
          <Box>
            <div style={{ font: Theme.typography.fonts.h5B, color: Theme.colors.black }}>Add Payout Method</div>
            <div style={{ font: Theme.typography.fonts.mediumM, color: Theme.colors.gray2, marginTop: 4 }}>
              Add a bank payout method to receive refunds and payments securely.
            </div>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Payment method added successfully!</Alert>}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <SelectFieldBaseModel
              label="Account Type"
              options={["RIB", "IBAN"]}
              value={type}
              onChange={(v) => setType((v as AccountType))}
            />
            <InputBaseModel
              title="Bank Name"
              placeholder="e.g., Attijariwafa Bank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
            <InputBaseModel
              title={type === 'RIB' ? 'RIB Number' : 'IBAN Number'}
              placeholder={type === 'RIB' ? 'Enter your 23-digit RIB' : 'Enter your IBAN'}
              value={accountNumber}
              onChange={(e) => handleAccountChange(e.target.value)}
            />
            <div style={{ font: Theme.typography.fonts.text12, color: Theme.colors.gray2 }}>
              {type === 'RIB' ? '23 digits' : 'Starts with country code (e.g., FR...)'}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, font: Theme.typography.fonts.mediumM, color: Theme.colors.black }}>
              <input
                type="checkbox"
                checked={setDefault}
                onChange={(e) => setSetDefault(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: Theme.colors.secondary }}
              />
              Set as default payout method
            </label>
            {accountError && (
              <div style={{ font: Theme.typography.fonts.text12, color: '#9B0303' }}>{accountError}</div>
            )}
          </Box>

        <DialogActions sx={{ px: 0, pt: 2, display: 'flex', gap: 12 }}>
          <div style={{ maxWidth: 160 }}>
            <BpurpleButtonMB48 text="Cancel" onClick={onClose} />
          </div>
          <div style={{ maxWidth: 220 }}>
            <PurpleButtonMB48
              text={loading ? 'Saving...' : success ? 'Saved!' : 'Save Payout Method'}
              type="submit"
              disabled={isSaveDisabled}
            >
              {loading && <CircularProgress size={18} color="inherit" style={{ marginLeft: 8 }} />}
            </PurpleButtonMB48>
          </div>
        </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
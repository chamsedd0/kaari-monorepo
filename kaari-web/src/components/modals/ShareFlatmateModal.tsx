import React, { useState } from 'react';
import { Dialog, DialogContent, DialogActions, Box } from '@mui/material';
import { Theme } from '../../theme/theme';
import { PurpleButtonMB48 } from '../skeletons/buttons/purple_MB48';
import { BpurpleButtonMB48 } from '../skeletons/buttons/border_purple_MB48';

interface ShareFlatmateModalProps {
  open: boolean;
  onClose: () => void;
  propertyTitle?: string;
}

const ShareFlatmateModal: React.FC<ShareFlatmateModalProps> = ({ open, onClose, propertyTitle }) => {
  const [months, setMonths] = useState<string>('');

  const handleShare = async () => {
    const url = window.location.href;
    const title = propertyTitle || 'Kaari Property';
    const text = 'Intéressé·e mais besoin d’un·e coloc ? Partage ce lien !';
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Link copied');
      }
    } finally {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: `1px solid ${Theme.colors.fifth}`,
          boxShadow: '0 24px 60px rgba(0,0,0,0.12)'
        }
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        <div style={{ font: Theme.typography.fonts.h5B, color: Theme.colors.black, marginBottom: 12 }}>
          Share to find a flatmate
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', font: Theme.typography.fonts.mediumB, color: Theme.colors.black, marginBottom: 6 }}>Intended length of stay</label>
          <input
            type="number"
            min={1}
            placeholder="Months"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 100,
              border: `1px solid ${Theme.colors.tertiary}`,
              font: Theme.typography.typography || Theme.typography.fonts.mediumM
            }}
          />
          <div style={{ font: Theme.typography.fonts.text12, color: Theme.colors.gray2, marginTop: 6 }}>
            For advertiser reference only; chosen length must respect the minimum stay.
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, display: 'flex', gap: 12 }}>
        <div style={{ maxWidth: 160 }}>
          <BpurpleButtonMB48 text="Close" onClick={onClose} />
        </div>
        <div style={{ maxWidth: 240 }}>
          <PurpleButtonMB48 text="Share to find a flatmate" onClick={handleShare} />
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default ShareFlatmateModal;



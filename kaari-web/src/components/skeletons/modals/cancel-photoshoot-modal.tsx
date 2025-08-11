import React, { useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { PurpleButtonMB48 } from '../buttons/purple_MB48';
import { BpurpleButtonMB48 } from '../buttons/border_purple_MB48';

interface CancelPhotoshootModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  photoshootLocation: string;
  photoshootDate: string;
}

const CancelPhotoshootModal: React.FC<CancelPhotoshootModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  photoshootLocation,
  photoshootDate,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }
    
    onConfirm(reason);
    setReason('');
    setError('');
  };
  
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <h3>Cancel Photoshoot</h3>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <ModalContent>
          <p className="info">
            Are you sure you want to cancel the photoshoot at <strong>{photoshootLocation}</strong> scheduled for <strong>{photoshootDate}</strong>?
          </p>
          
          <div className="reason-section">
            <label htmlFor="cancelReason">
              Please provide a reason for cancellation:
            </label>
            <textarea
              id="cancelReason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              placeholder="Enter reason for cancellation..."
              rows={4}
              className={error ? 'error' : ''}
            />
            {error && <p className="error-message">{error}</p>}
          </div>
        </ModalContent>
        
        <ModalFooter>
          <div className="button-container">
            <BpurpleButtonMB48 
              text="Go Back" 
              onClick={onClose}
            />
            <PurpleButtonMB48 
              text="Confirm Cancellation" 
              onClick={handleSubmit}
            />
          </div>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: ${Theme.borders.radius.lg};
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${Theme.colors.gray3};
  
  h3 {
    font: ${Theme.typography.fonts.largeB};
    color: ${Theme.colors.primary};
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${Theme.colors.gray2};
  
  &:hover {
    color: ${Theme.colors.primary};
  }
`;

const ModalContent = styled.div`
  padding: 20px;
  
  p.info {
    margin-bottom: 20px;
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.black};
    line-height: 1.5;
  }
  
  .reason-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    label {
      font: ${Theme.typography.fonts.mediumB};
      color: ${Theme.colors.black};
    }
    
    textarea {
      padding: 12px;
      border: 1px solid ${Theme.colors.gray3};
      border-radius: 8px;
      resize: vertical;
      font: ${Theme.typography.fonts.mediumM};
      
      &.error {
        border-color: ${Theme.colors.error};
      }
      
      &:focus {
        outline: none;
        border-color: ${Theme.colors.primary};
      }
    }
    
    .error-message {
      color: ${Theme.colors.error};
      font: ${Theme.typography.fonts.smallM};
      margin: 5px 0 0;
    }
  }
`;

const ModalFooter = styled.div`
  padding: 20px;
  border-top: 1px solid ${Theme.colors.gray3};
  
  .button-container {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    
    button {
      min-width: 120px;
    }
  }
`;

export default CancelPhotoshootModal; 
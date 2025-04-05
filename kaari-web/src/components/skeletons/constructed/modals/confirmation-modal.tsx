import React, { useRef, useEffect } from 'react';
import { ModalOverlayStyle, ConfirmationModalStyle } from '../../../styles/constructed/modals/auth-modal-style';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { PurpleButtonLB60 } from '../../buttons/purple_LB60';
import { WhiteButtonLB60 } from '../../buttons/white_LB60';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  type?: 'reservation' | 'unlist' | 'cancel';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Go back',
  type = 'reservation'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlayStyle>
      <ConfirmationModalStyle ref={modalRef}>
        <div className="modal-header">
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="icon-container">
            <div className="warning-icon">
              <FaExclamationTriangle />
            </div>
          </div>
          
          <h2 className="confirmation-title">{title}</h2>
          <p className="confirmation-message">{message}</p>
          
          <div className="button-container">
            <WhiteButtonLB60 text={cancelButtonText} onClick={onClose} />
            <PurpleButtonLB60 
              text={confirmButtonText} 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              // Set special styling for cancel action
              style={type === 'cancel' ? { backgroundColor: '#d32f2f' } : undefined}
            />
          </div>
        </div>
      </ConfirmationModalStyle>
    </ModalOverlayStyle>
  );
};

export default ConfirmationModal; 
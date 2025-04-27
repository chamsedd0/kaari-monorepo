import React, { useRef, useEffect } from 'react';
import { ModalOverlayStyle, ConfirmationModalStyle } from '../../../styles/constructed/modals/auth-modal-style';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { PurpleButtonLB60 } from '../../buttons/purple_LB60';
import { WhiteButtonLB60 } from '../../buttons/white_LB60';

interface PropertyUnlistConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  propertyTitle: string;
}

export const PropertyUnlistConfirmationModal: React.FC<PropertyUnlistConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  propertyTitle
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
          
          <h2 className="confirmation-title">Unlist Property?</h2>
          
          <p className="confirmation-message">
            You are about to unlist <strong>{propertyTitle}</strong>. This property will no longer appear in search results, and users will not be able to book it. You can re-list it anytime.
          </p>
          
          <div className="button-container">
            <WhiteButtonLB60 text="Cancel" onClick={onClose} />
            <PurpleButtonLB60
              text="Unlist Property"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            />
          </div>
        </div>
      </ConfirmationModalStyle>
    </ModalOverlayStyle>
  );
};

export default PropertyUnlistConfirmationModal; 
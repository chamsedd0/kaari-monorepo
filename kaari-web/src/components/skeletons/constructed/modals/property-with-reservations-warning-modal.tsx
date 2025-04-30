import React, { useRef, useEffect } from 'react';
import { ModalOverlayStyle, ConfirmationModalStyle } from '../../../styles/constructed/modals/auth-modal-style';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { PurpleButtonLB60 } from '../../buttons/purple_LB60';
import { WhiteButtonLB60 } from '../../buttons/white_LB60';

interface PropertyReservationsWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewReservations: () => void;
  propertyTitle: string;
}

export const PropertyReservationsWarningModal: React.FC<PropertyReservationsWarningModalProps> = ({
  isOpen,
  onClose,
  onViewReservations,
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
          
          <h2 className="confirmation-title">Active Reservations</h2>
          
          <p className="confirmation-message">
            <strong>{propertyTitle}</strong> has active reservation requests. You need to cancel or reject these reservations before you can list this property as available.
          </p>
          
          <div className="button-container">
            <WhiteButtonLB60 text="Cancel" onClick={onClose} />
            <PurpleButtonLB60
              text="View Reservations"
              onClick={() => {
                onViewReservations();
                onClose();
              }}
            />
          </div>
        </div>
      </ConfirmationModalStyle>
    </ModalOverlayStyle>
  );
};

export default PropertyReservationsWarningModal; 
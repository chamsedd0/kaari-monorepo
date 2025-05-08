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
  reason: 'completed' | 'pending' | 'accepted' | 'paid' | 'movedIn' | 'none';
}

export const PropertyReservationsWarningModal: React.FC<PropertyReservationsWarningModalProps> = ({
  isOpen,
  onClose,
  onViewReservations,
  propertyTitle,
  reason = 'none'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Generate title based on reason
  const getTitle = () => {
    switch(reason) {
      case 'movedIn':
        return 'Property Has Active Tenant';
      case 'paid':
        return 'Property Has Paid Reservation';
      case 'completed':
        return 'Property Occupied';
      case 'accepted':
      case 'pending':
        return 'Active Reservations';
      default:
        return 'Cannot List Property';
    }
  };

  // Generate specific message based on reason
  const getMessage = () => {
    switch(reason) {
      case 'movedIn':
        return `${propertyTitle} currently has a tenant who has moved in. This property cannot be listed as available until the tenant moves out.`;
      case 'paid':
        return `${propertyTitle} has a paid reservation. This property cannot be listed as available until the reservation is cancelled or completed.`;
      case 'completed':
        return `${propertyTitle} currently has a tenant living there. This property cannot be listed as available until the reservation is marked as completed and the tenant has moved out.`;
      case 'accepted':
        return `${propertyTitle} has accepted reservation requests that need to be addressed before listing.`;
      case 'pending':
        return `${propertyTitle} has pending reservation requests that need to be addressed before listing.`;
      default:
        return `${propertyTitle} cannot be listed at this time.`;
    }
  };

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
          
          <h2 className="confirmation-title">{getTitle()}</h2>
          
          <p className="confirmation-message">
            {getMessage()}
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
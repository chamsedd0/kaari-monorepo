import React, { useRef, useEffect } from 'react';
import { FaTimes, FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../../backend/store';
import { useAuth } from '../../../../contexts/auth';
import { ModalOverlayStyle, ConfirmationModalStyle } from '../../../styles/constructed/modals/auth-modal-style';
import { PurpleButtonLB60 } from '../../buttons/purple_LB60';
import { WhiteButtonLB60 } from '../../buttons/white_LB60';
import { useToastService } from '../../../../services/ToastService';

interface SignOutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => Promise<void>;
}

export const SignOutConfirmationModal: React.FC<SignOutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const { signOutUser, status } = useAuth();
  const isLoading = status === 'loading';
  const toast = useToastService();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if clicking on the overlay, not when clicking inside the modal
      const target = event.target as HTMLElement;
      if (target && target.classList.contains('modal-overlay')) {
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

  const handleSignOut = async () => {
    try {
      if (onConfirm) {
        await onConfirm();
      } else {
        // Use the centralized auth context for logout
        await signOutUser();
        
        // Show logout success toast
        toast.auth.logoutSuccess();
        
        // Navigate to home page
        navigate('/', { replace: true });
      }
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error signing out:", error);
      // We still want to close the modal and navigate away
      onClose();
      navigate('/', { replace: true });
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlayStyle className="modal-overlay">
      <ConfirmationModalStyle ref={modalRef}>
        <div className="modal-header">
          <button className="close-button" onClick={onClose} disabled={isLoading}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="icon-container">
            <div className="warning-icon">
              <FaSignOutAlt />
            </div>
          </div>
          
          <h2 className="confirmation-title">Sign Out</h2>
          
          <p className="confirmation-message">
            Are you sure you want to sign out of your account?
          </p>
          
          <div className="button-container">
            <WhiteButtonLB60 
              text="Cancel" 
              onClick={onClose} 
              disabled={isLoading}
            />
            
            <PurpleButtonLB60 
              text={isLoading ? (
                <div className="loading-indicator">
                  <FaSpinner className="spinner" /> Signing Out...
                </div>
              ) : "Sign Out"}
              onClick={handleSignOut} 
              disabled={isLoading}
            />
          </div>
        </div>
      </ConfirmationModalStyle>
    </ModalOverlayStyle>
  );
}; 
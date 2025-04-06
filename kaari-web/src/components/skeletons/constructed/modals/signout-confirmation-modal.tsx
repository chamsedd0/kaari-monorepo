import React, { useRef, useEffect } from 'react';
import { FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../../backend/store';
import { signOut } from '../../../../backend/firebase/auth';
import { ModalOverlayStyle, ConfirmationModalStyle } from '../../../styles/constructed/modals/auth-modal-style';
import { PurpleButtonLB60 } from '../../buttons/purple_LB60';
import { WhiteButtonLB60 } from '../../buttons/white_LB60';
import { Theme } from '../../../../theme/theme';

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
  const setUser = useStore(state => state.setUser);
  const setIsAuthenticated = useStore(state => state.setIsAuthenticated);
  const loading = useStore(state => state.loading);

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

  const handleSignOut = async () => {
    try {
      if (onConfirm) {
        await onConfirm();
      } else {
        // Default logout process
        await signOut();
        
        // Manually update the store state
        setUser(null);
        setIsAuthenticated(false);
        
        // Navigate to home page
        navigate('/');
      }
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
              <FaSignOutAlt />
            </div>
          </div>
          
          <h2 className="confirmation-title">Sign Out</h2>
          
          <p className="confirmation-message">
            Are you sure you want to sign out of your account?
          </p>
          
          <div className="button-container">
            <WhiteButtonLB60 text="Cancel" onClick={onClose} />
            <PurpleButtonLB60 
              text="Sign Out" 
              onClick={handleSignOut} 
              disabled={loading}
            />
          </div>
        </div>
      </ConfirmationModalStyle>
    </ModalOverlayStyle>
  );
}; 
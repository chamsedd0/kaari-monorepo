import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalOverlayStyle, ConfirmationModalStyle } from '../../../styles/constructed/modals/auth-modal-style';
import { FaTimes } from 'react-icons/fa';
import { useAuth } from '../../../../contexts/auth';
import { useStore } from '../../../../backend/store';
import { PurpleButtonLB60 } from '../../buttons/purple_LB60';
import { WhiteOutlinedButtonLB60 } from '../../buttons/white_outlined_LB60';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const { signOutUser, forceUpdate } = useAuth();
  const setUser = useStore(state => state.setUser);
  const setIsAuthenticated = useStore(state => state.setIsAuthenticated);
  const modalRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = async () => {
    try {
      // 1. Immediately update UI state in store
      setUser(null);
      setIsAuthenticated(false);
      
      // 2. Close modal first
      onClose();
      
      // 3. Dispatch global event
      document.body.dispatchEvent(new Event('auth-change'));
      
      // 4. Navigate to home page using client-side navigation
      navigate('/', { replace: true });
      
      // 5. Start the actual logout process (in background)
      signOutUser().catch(error => {
        console.error('Logout failed:', error);
      });
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if there's an error, navigate to home
      navigate('/', { replace: true });
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlayStyle className="modal-overlay">
      <ConfirmationModalStyle ref={modalRef}>
        <div className="modal-header">
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="icon-container">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="24" fill="#673AB7" fillOpacity="0.1"/>
              <path d="M29 16V19H20V29H29V32L35 24L29 16ZM17 16H23V13H17C15.3 13 14 14.3 14 16V32C14 33.7 15.3 35 17 35H23V32H17V16Z" fill="#673AB7"/>
            </svg>
          </div>
          
          <h3 className="confirmation-title">Are you sure?</h3>
          
          <p className="confirmation-message">
            You are trying to log out. Do you wish to continue? Next time you will have to log in again.
          </p>
          
          <div className="confirmation-actions">
            <WhiteOutlinedButtonLB60
              text="Log Out"
              onClick={handleLogout}
            />
            
            <PurpleButtonLB60
              text="Cancel"
              onClick={onClose}
            />
          </div>
        </div>
      </ConfirmationModalStyle>
    </ModalOverlayStyle>
  );
};

export default LogoutConfirmationModal; 
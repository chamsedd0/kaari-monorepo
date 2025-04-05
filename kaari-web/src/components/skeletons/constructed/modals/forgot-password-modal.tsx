import React, { useState, useRef, useEffect } from 'react';
import { ModalOverlayStyle, AuthModalStyle } from '../../../styles/constructed/modals/auth-modal-style';
import { FaTimes, FaKey } from 'react-icons/fa';
import { PurpleButtonLB60 } from '../../buttons/purple_LB60';
import { useAuth } from '../../../../contexts/auth';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { sendPasswordResetEmail, error, loading } = useAuth();

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
  
  // Update local error state when auth context error changes
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (email.trim()) {
      try {
        await sendPasswordResetEmail(email);
        
        // If an external onSubmit is provided, call it
        if (onSubmit) {
          onSubmit(email);
        }
        
        setEmailSent(true);
      } catch (err) {
        // Error is handled by auth context and reflected in state
      }
    }
  };

  const handleClose = () => {
    setEmail('');
    setEmailSent(false);
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlayStyle className="modal-overlay" onClick={(e) => {
      // Only close if clicking directly on the overlay
      if (e.target === e.currentTarget) {
        handleClose();
      }
      // Prevent event from bubbling to parent modals
      e.stopPropagation();
    }}>
      <AuthModalStyle ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="logo-container">
            <h2>Forgot Password</h2>
          </div>
          <button className="close-button" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          {!emailSent ? (
            <>
              <div className="auth-header">
                <FaKey size={32} />
                <p className="instructions">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>
              
              {errorMessage && (
                <div className="warning-message">
                  <div className="icon">⚠️</div>
                  <div className="message">{errorMessage}</div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="button-container">
                  <PurpleButtonLB60 
                    text="Send Reset Link" 
                    onClick={handleSubmit}
                    disabled={!email.trim() || loading} 
                  />
                </div>
              </form>
            </>
          ) : (
            <div className="success-message">
              <div className="auth-header">
                <FaKey size={32} />
                <h3>Email Sent!</h3>
                
                <p>
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Please check your inbox and follow the instructions to reset your password.
                </p>
                
                <p className="note">
                  If you don't see the email, please check your spam folder.
                </p>
              </div>
              
              <div className="button-container">
                <PurpleButtonLB60 text="Close" onClick={handleClose} />
              </div>
            </div>
          )}
        </div>
      </AuthModalStyle>
    </ModalOverlayStyle>
  );
};

export default ForgotPasswordModal; 
import React, { useState, useEffect } from 'react';
import { FaKey, FaSpinner, FaCheck } from 'react-icons/fa';
import { PurpleButtonLB60 } from '../../buttons/purple_LB60';
import { useAuth } from '../../../../contexts/auth';
import AccessibleModal from '../modal/accessible-modal';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import eventBus, { EventType } from '../../../../utils/event-bus';

const ForgotPasswordContent = styled.div`
  .auth-header {
    text-align: center;
    margin-bottom: 1.5rem;
    
    svg {
      display: block;
      margin: 0 auto 1rem;
      color: ${Theme.colors.primary};
    }
    
    .instructions {
      color: ${Theme.colors.gray3};
      margin-bottom: 1rem;
    }
    
    h3 {
      margin-bottom: 1rem;
      color: ${Theme.colors.black};
    }
    
    p {
      margin-bottom: 0.5rem;
      color: ${Theme.colors.gray3};
      
      strong {
        color: ${Theme.colors.black};
      }
    }
    
    .note {
      font-size: 0.875rem;
      color: ${Theme.colors.gray2};
      font-style: italic;
      margin-top: 1rem;
    }
  }
  
  .warning-message {
    display: flex;
    align-items: center;
    background-color: rgba(255, 99, 71, 0.1);
    border-radius: 8px;
    padding: 16px;
    margin: 20px 0;
    
    .icon {
      color: tomato;
      font-size: 24px;
      margin-right: 12px;
    }
    
    .message {
      font-size: 14px;
      color: ${Theme.colors.black};
    }
  }
  
  .form-group {
    margin-bottom: 20px;
    
    label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      color: ${Theme.colors.black};
    }
    
    input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid ${Theme.colors.fifth};
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s;
      
      &:focus {
        outline: none;
        border-color: ${Theme.colors.primary};
      }
    }
  }
  
  .button-container {
    margin-top: 24px;
  }
  
  .success-message {
    text-align: center;
  }

  .loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    .spinner {
      animation: spin 1s linear infinite;
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    }
  }
`;

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (email: string) => void;
  loading?: boolean;
  initialEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading: externalLoading = false,
  initialEmail = ''
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [emailSent, setEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendPasswordResetEmail, error, loading: authLoading, clearError } = useAuth();

  // Combined loading state from both sources
  const isLoading = isSubmitting || authLoading || externalLoading;

  useEffect(() => {
    // Prevent submitting if already loading from external source
    if (externalLoading && !isSubmitting) {
      setIsSubmitting(false);
    }
    
    if (isOpen) {
      // Reset state when opening modal
      setErrorMessage(null);
      clearError?.();
      
      // Set email from initialEmail prop if available
      if (initialEmail && !email) {
        setEmail(initialEmail);
      }
      
      // Emit modal open event
      eventBus.emit(EventType.UI_MODAL_OPEN, { 
        modalId: 'forgot-password-modal',
        props: { email }
      });
    }
  }, [isOpen, clearError, initialEmail, email]);
  
  // Update local error state when auth context error changes
  useEffect(() => {
    if (error) {
      setErrorMessage(formatErrorMessage(error));
      setIsSubmitting(false);
    }
  }, [error]);

  // Format error messages to be more user-friendly
  const formatErrorMessage = (error: string): string => {
    if (error.includes('user-not-found')) {
      return 'No account exists with this email address';
    } else if (error.includes('invalid-email')) {
      return 'Please enter a valid email address';
    } else if (error.includes('too-many-requests')) {
      return 'Too many attempts. Please try again later';
    }
    return error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    // Validate email
    if (!email.trim()) {
      setErrorMessage('Please enter your email');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await sendPasswordResetEmail(email);
      
      // If an external onSubmit is provided, call it
      if (onSubmit) {
        onSubmit(email);
      }
      
      // Emit password reset event
      eventBus.emit(EventType.AUTH_PASSWORD_RESET, {
        email,
        success: true
      });
      
      setEmailSent(true);
      setIsSubmitting(false);
    } catch (err) {
      // Error is handled by auth context and reflected in state
      setIsSubmitting(false);
      
      // Emit failed password reset event
      eventBus.emit(EventType.AUTH_PASSWORD_RESET, {
        email,
        success: false
      });
    }
  };

  const handleClose = () => {
    setEmail(initialEmail);
    setEmailSent(false);
    setErrorMessage(null);
    setIsSubmitting(false);
    clearError?.();
    onClose();
  };

  const getAccessibleModalDescription = () => {
    return emailSent
      ? `A password reset link has been sent to ${email}. Please check your inbox.`
      : 'Enter your email address and we will send you a link to reset your password.';
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Forgot Password"
      description={getAccessibleModalDescription()}
      modalId="forgot-password-modal"
      size="small"
      showCloseButton={!isLoading}
    >
      <ForgotPasswordContent>
        {!emailSent ? (
          <>
            <div className="auth-header">
              <FaKey size={32} aria-hidden="true" />
              <p className="instructions">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
            
            {errorMessage && (
              <div 
                className="warning-message" 
                role="alert" 
                aria-live="assertive"
              >
                <div className="icon" aria-hidden="true">⚠️</div>
                <div className="message">{errorMessage}</div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="forgot-password-email">Email Address</label>
                <input
                  type="email"
                  id="forgot-password-email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
                  aria-required="true"
                  aria-invalid={errorMessage !== null ? 'true' : 'false'}
                  aria-describedby={errorMessage ? 'forgot-password-error' : undefined}
                />
                {errorMessage && (
                  <div id="forgot-password-error" className="sr-only">
                    {errorMessage}
                  </div>
                )}
              </div>
              
              <div className="button-container">
                <PurpleButtonLB60 
                  text={isLoading ? (
                    <div className="loading-indicator">
                      <FaSpinner className="spinner" aria-hidden="true" /> 
                      <span>Sending...</span>
                    </div>
                  ) : "Send Reset Link"} 
                  onClick={handleSubmit}
                  disabled={!email.trim() || isLoading}
                  aria-busy={isLoading ? 'true' : 'false'}
                />
              </div>
            </form>
          </>
        ) : (
          <div className="success-message" role="status" aria-live="polite">
            <div className="auth-header">
              <FaCheck size={32} color="green" aria-hidden="true" />
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
      </ForgotPasswordContent>
    </AccessibleModal>
  );
};

export default ForgotPasswordModal; 
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaTimes, FaSpinner } from 'react-icons/fa';
import { PurpleButtonLB60 } from '../../buttons/purple_LB60';
import { WhiteButtonLB60 } from '../../buttons/white_LB60';
import Logo from "../../../../assets/images/purpleLogo.svg";
import { useAuth } from '../../../../contexts/auth';
import { ForgotPasswordModal } from './forgot-password-modal';
import eventBus, { EventType } from '../../../../utils/event-bus';
import AccessibleModal from '../modal/accessible-modal';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

// Create styled components for the auth modal content
const AuthModalContent = styled.div`
  .logo-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
    
    img {
      height: 32px;
      width: auto;
    }
  }
  
  .error-message {
    background-color: #FFF0F0;
    color: #E53935;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
  }
  
  .success-message {
    background-color: #F0FFF4;
    color: #2E7D32;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  form {
    .form-group {
      margin-bottom: 16px;
      
      label {
        display: block;
        font-size: 14px;
        margin-bottom: 8px;
        color: ${Theme.colors.gray3};
      }
      
      input {
        width: 100%;
        padding: 16px;
        border: 1px solid #E0E0E0;
        border-radius: 100px;
        font-size: 16px;
        
        &:focus {
          outline: none;
          border-color: ${Theme.colors.primary};
        }
        
        &::placeholder {
          color: #BDBDBD;
        }
      }
    }
  }
  
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0 24px;
    
    @media (max-width: 480px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    
    .remember-me {
      display: flex;
      align-items: center;
      
      input[type="checkbox"] {
        margin-right: 8px;
        accent-color: ${Theme.colors.primary};
      }
      
      label {
        font-size: 14px;
        color: ${Theme.colors.gray2};
      }
    }
    
    .forgot-password {
      .forgot-link {
        color: ${Theme.colors.primary};
        font-size: 14px;
        cursor: pointer;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  
  .separator {
    display: flex;
    align-items: center;
    margin: 24px 0;
    
    &::before, &::after {
      content: '';
      flex: 1;
      height: 1px;
      background-color: #E0E0E0;
    }
    
    span {
      padding: 0 16px;
      color: #757575;
      font-size: 14px;
    }
  }
  
  .google-button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
  }
  
  .advertiser-link {
    text-align: center;
    margin-top: 24px;
    
    a {
      color: ${Theme.colors.primary};
      font-size: 14px;
      cursor: pointer;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
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

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess
}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use auth context
  const { signIn, signUp, signInWithGooglePopup, error, loading, clearError, forceUpdate } = useAuth();

  // Listen for successful auth events to close modal
  useEffect(() => {
    const unsubscribe = eventBus.on(EventType.AUTH_SIGNED_IN, () => {
      // When user successfully signs in, close the modal and call success callback
      if (isOpen) {
        if (onSuccess) onSuccess();
        onClose();
      }
    });
    
    return unsubscribe;
  }, [isOpen, onSuccess, onClose]);
  
  // Reset form when opening modal
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setShowPassword(false);
      clearError?.();
    }
  }, [isOpen, clearError]);
  
  // Update local error state when auth context error changes
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setIsSubmitting(false);
    }
  }, [error]);

  const handleGoogleSignIn = async () => {
    try {
      setErrorMessage(null);
      setIsSubmitting(true);
      
      // Prevent default redirection behavior
      event?.preventDefault?.();
      
      await signInWithGooglePopup();
      
      // No need to manually close or navigate as the AUTH_SIGNED_IN event listener will handle it
    } catch (err) {
      console.error("Google sign-in error:", err);
      setIsSubmitting(false);
      // Set a user-friendly error message
      setErrorMessage("Could not sign in with Google. Please try again.");
    }
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    if (!showPassword) {
      setShowPassword(true);
      return;
    }
    
    if (!password.trim()) {
      setErrorMessage('Please enter your password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Try sign in first
      await signIn(email, password);
      
      // No need to manually close or navigate as the AUTH_SIGNED_IN event listener will handle it
    } catch (err: any) {
      console.error("Sign in error:", err);
      // If error contains 'user-not-found', attempt to register
      if (err.message && err.message.includes('user-not-found')) {
        try {
          await signUp(email, password, email.split('@')[0]); // Use part of email as name
          
          // No need to manually close or navigate as the AUTH_SIGNED_IN event listener will handle it
        } catch (signUpErr) {
          console.error("Sign up error:", signUpErr);
          setIsSubmitting(false);
          setErrorMessage("Registration failed. Please try again.");
        }
      } else {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    
    // Emit event for analytics or tracking
    eventBus.emit(EventType.UI_MODAL_OPEN, {
      modalId: 'forgot-password-modal',
      props: { email }
    });
  };

  const formatErrorMessage = (message: string): string => {
    if (message.includes('auth/user-not-found')) {
      return 'No account found with this email. Please check your email.';
    } else if (message.includes('auth/wrong-password')) {
      return 'Incorrect password. Please try again or reset your password.';
    } else if (message.includes('auth/email-already-in-use')) {
      return 'An account with this email already exists. Please sign in instead.';
    } else if (message.includes('auth/weak-password')) {
      return 'Password is too weak. Please use a stronger password.';
    } else if (message.includes('auth/network-request-failed')) {
      return 'Network error. Please check your internet connection and try again.';
    } else if (message.includes('auth/too-many-requests')) {
      return 'Too many attempts. Please try again later or reset your password.';
    }
    return message;
  };

  const getAccessibleModalDescription = () => {
    return initialMode === 'signin' 
      ? 'Sign in to your account or register for a new account' 
      : 'Create a new account or sign in to an existing account';
  };

  return (
    <>
      <AccessibleModal
        isOpen={isOpen}
        onClose={onClose}
        title="Sign in or Register"
        description={getAccessibleModalDescription()}
        modalId="auth-modal"
        size="small"
        showCloseButton={!isSubmitting && !loading}
      >
        <AuthModalContent>
          <div className="logo-container">
            <img src={Logo} alt="Kaari Logo" />
          </div>
          
          {errorMessage && (
            <div 
              className="error-message" 
              role="alert" 
              aria-live="assertive"
            >
              {formatErrorMessage(errorMessage)}
            </div>
          )}
          
          <form onSubmit={handleContinue}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                disabled={isSubmitting || loading}
                aria-required="true"
                aria-invalid={errorMessage && errorMessage.includes('email') ? 'true' : 'false'}
              />
            </div>
            
            {showPassword && (
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  disabled={isSubmitting || loading}
                  aria-required="true"
                  aria-invalid={errorMessage && errorMessage.includes('password') ? 'true' : 'false'}
                />
              </div>
            )}
            
            <PurpleButtonLB60
              text={isSubmitting || loading ? (
                <div className="loading-indicator">
                  <FaSpinner className="spinner" aria-hidden="true" /> 
                  <span>Please wait...</span>
                </div>
              ) : "Sign in or Register"}
              onClick={handleContinue}
              disabled={isSubmitting || loading}
              aria-busy={isSubmitting || loading ? 'true' : 'false'}
            />
            
            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isSubmitting || loading}
                />
                <label htmlFor="remember">Remember this device</label>
              </div>
              
              {showPassword && (
                <div className="forgot-password">
                  <button 
                    type="button"
                    onClick={handleForgotPassword} 
                    className="forgot-link btn-reset"
                    disabled={isSubmitting || loading}
                    aria-label="Forgot password"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>
            
            <div className="separator">
              <span>or</span>
            </div>
            
            <WhiteButtonLB60
              text={
                isSubmitting || loading ? (
                  <div className="loading-indicator">
                    <FaSpinner className="spinner" aria-hidden="true" /> 
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <span className="google-button-content">
                    <FaGoogle aria-hidden="true" /> 
                    <span>Connect with Google</span>
                  </span>
                )
              }
              onClick={handleGoogleSignIn}
              disabled={isSubmitting || loading}
              aria-busy={isSubmitting || loading ? 'true' : 'false'}
            />
            
            <div className="advertiser-link">
              <button 
                type="button"
                className="btn-reset"
                onClick={() => navigate('/for-advertisers')}
                disabled={isSubmitting || loading}
              >
                Are you an advertiser?
              </button>
            </div>
          </form>
        </AuthModalContent>
      </AccessibleModal>
      
      {showForgotPassword && (
        <ForgotPasswordModal
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
          loading={isSubmitting || loading}
          initialEmail={email}
        />
      )}
    </>
  );
};

export default AuthModal; 
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaTimes, FaSpinner, FaUser, FaBuilding } from 'react-icons/fa';
import { PurpleButtonLB60 } from '../../buttons/purple_LB60';
import { WhiteButtonLB60 } from '../../buttons/white_LB60';
import Logo from "../../../../assets/images/purpleLogo.svg";
import { useAuth } from '../../../../contexts/auth';
import { ForgotPasswordModal } from './forgot-password-modal';
import eventBus, { EventType } from '../../../../utils/event-bus';
import AccessibleModal from '../modal/accessible-modal';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { useToastService } from '../../../../services/ToastService';

// Create styled components for the auth modal content
const AuthModalContent = styled.div`
  width: 100%;
  min-width: 400px;
  max-width: 100%;
  overflow-x: hidden;
  
  .logo-container {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
    
    img {
      height: 36px;
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
      margin-bottom: 20px;
      
      label {
        display: block;
        font-size: 14px;
        margin-bottom: 8px;
        color: ${Theme.colors.gray2};
        font-weight: 500;
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
          box-shadow: 0 0 0 1px ${Theme.colors.primary}20;
        }
        
        &::placeholder {
          color: #BDBDBD;
        }
      }
    }
    
    /* Make sure the buttons take up full width */
    .PurpleLB60, .WhiteLB60 {
      width: 100%;
      display: flex;
      justify-content: center;
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
    gap: 10px;
    width: 100%;
    
    svg {
      font-size: 18px;
    }
    
    span {
      font-weight: 500;
    }
  }
  
  /* Make main action buttons take full width */
  form > button, 
  form > [role="button"],
  form > div > button,
  form > div > [role="button"],
  button.white-button-lb60,
  button.purple-button-lb60 {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .account-type-toggle {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    border-radius: 100px;
    background-color: #f5f5f5;
    padding: 4px;
    position: relative;
    overflow: hidden;
    width: 100%;
    
    .toggle-button {
      flex: 1;
      padding: 12px 16px;
      border: none;
      background: none;
      font-size: 15px;
      font-weight: 500;
      color: ${Theme.colors.gray2};
      cursor: pointer;
      position: relative;
      z-index: 1;
      transition: color 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      
      &.active {
        color: ${Theme.colors.white};
      }
      
      svg {
        font-size: 18px;
      }
    }
    
    .slider {
      position: absolute;
      top: 4px;
      bottom: 4px;
      left: 4px;
      width: calc(50% - 8px);
      background-color: ${Theme.colors.primary};
      border-radius: 100px;
      transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
      
      &.advertiser {
        transform: translateX(calc(100% + 8px));
      }
    }
  }
  
  .advertiser-info {
    background-color: rgba(159, 50, 225, 0.1);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    font-size: 14px;
    color: ${Theme.colors.primary};
    
    h4 {
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 16px;
    }
    
    p {
      margin: 0;
      line-height: 1.5;
    }
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
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountType, setAccountType] = useState<'client' | 'advertiser'>('client');
  const [showNameField, setShowNameField] = useState(false);
  
  // Use auth context
  const { signIn, signUp, signInWithGooglePopup, error, clearError, forceUpdate } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Use toast service
  const toast = useToastService();

  // Listen for successful auth events to close modal
  useEffect(() => {
    const unsubscribe = eventBus.on(EventType.AUTH_SIGNED_IN, () => {
      // When user successfully signs in, close the modal and call success callback
      if (isOpen) {
        // Show success toast
        toast.auth.loginSuccess();
        if (onSuccess) onSuccess();
        onClose();
      }
    });
    
    return unsubscribe;
  }, [isOpen, onSuccess, onClose, toast]);
  
  // Reset form when opening modal
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setShowPassword(false);
      setShowNameField(false);
      setName('');
      clearError?.();
    }
  }, [isOpen, clearError]);
  
  // Update local error state when auth context error changes
  useEffect(() => {
    if (error) {
      setErrorMessage(error.message || String(error));
      setIsSubmitting(false);
    }
  }, [error]);

  const handleGoogleSignIn = async () => {
    try {
      setErrorMessage(null);
      setIsSubmitting(true);
      
      // Prevent default redirection behavior
      event?.preventDefault?.();
      
      // If we've selected the advertiser account type, pass that to the Google sign-in
      // This works whether we're on the name field or just clicked the advertiser toggle
      const isAdvertiserRegistration = accountType === 'advertiser';
      
      // Pass the account type when signing in with Google if we're in advertiser mode
      const result = await signInWithGooglePopup(
        isAdvertiserRegistration ? 'advertiser' : undefined,
        isAdvertiserRegistration // Pass flag to indicate this is a new advertiser registration
      );
      
      // No need to manually close or navigate as the AUTH_SIGNED_IN event listener will handle it
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setIsSubmitting(false);
      
      // Extract error message for display
      let errorCode = '';
      let errorText = '';
      
      // Handle Firebase error objects which have a code property
      if (err && typeof err === 'object') {
        if (err.code) {
          errorCode = err.code; // Save the error code for specific checks
          errorText = err.message || String(err);
        } else {
          errorText = err.message || String(err);
        }
      } else {
        errorText = String(err);
      }
      
      // Custom error message for specific cases
      if (errorCode === 'auth/email-already-in-use' || 
          errorText.includes('auth/email-already-in-use') || 
          errorText.includes('already exists') ||
          errorText.includes('existing account')) {
        if (accountType === 'advertiser') {
          errorText = 'This email is already registered. Please use a different email to create an advertiser account.';
        } else {
          errorText = 'This email is already registered. Please sign in instead.';
        }
      } else if (errorCode === 'auth/popup-closed-by-user' || errorText.includes('popup-closed-by-user')) {
        errorText = 'Sign-in popup was closed. Please try again.';
      } else if (!errorText || errorText === 'undefined' || errorText === '[object Object]') {
        // Fallback for cases where we didn't get a usable error message
        errorText = 'Could not sign in with Google. Please try again.';
      }
      
      setErrorMessage(errorText);
      toast.auth.loginError(formatErrorMessage(errorText));
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
    
    // If password is not visible yet, just show the password field
    if (!showPassword) {
      setShowPassword(true);
      return;
    }
    
    if (!password.trim()) {
      setErrorMessage('Please enter your password');
      return;
    }
    
    // Password strength check for new accounts
    if (initialMode === 'register' || !showNameField) {
      if (password.length < 8) {
        setErrorMessage('Password should be at least 8 characters');
        return;
      }
    }
    
    // If it's register mode or we've determined we need to register (account doesn't exist),
    // and we haven't yet shown the name field, show it now
    if ((initialMode === 'register' || showNameField) && !name.trim() && showPassword) {
      setShowNameField(true);
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Determine if we're signing in or signing up
      if (showNameField) {
        // This is a registration
        await signUp(email, password, name, accountType); // Pass the account type when registering
        // Show registration success toast - the AUTH_SIGNED_IN event will show login success
        toast.auth.registrationSuccess();
      } else {
        // This is a sign in attempt
        await signIn(email, password);
        // Login success toast will be shown by the AUTH_SIGNED_IN event listener
      }
      
      // If we get here, it means the operation was successful
      if (onSuccess) onSuccess();
      
      // Clear fields for security
      setEmail('');
      setPassword('');
      setName('');
      setShowPassword(false);
      setShowNameField(false);
      
    } catch (error: any) {
      console.error('Auth error:', error);
      setIsSubmitting(false);
      
      // Convert error to string for display
      let errorCode = '';
      let errorText = '';
      
      // Handle Firebase error objects which have a code property
      if (error && typeof error === 'object') {
        if (error.code) {
          errorCode = error.code; // Save the error code for specific checks
          errorText = error.message || String(error);
        } else {
          errorText = error.message || String(error);
        }
      } else {
        errorText = String(error);
      }
      
      // Special handling for specific error cases
      if (errorCode === 'auth/email-already-in-use' || errorText.includes('auth/email-already-in-use')) {
        if (showNameField && accountType === 'advertiser') {
          // If trying to register as advertiser but email exists
          setErrorMessage('This email is already registered. Please use a different email to create an advertiser account.');
          return;
        } else if (!showNameField) {
          // If trying to sign in and the email exists, suggest signing in
          setErrorMessage('An account with this email already exists. Please sign in instead.');
          return;
        }
      } else if ((errorCode === 'auth/user-not-found' || errorText.includes('auth/user-not-found')) && !showNameField) {
        // If trying to sign in but no account found, switch to registration mode
        setShowNameField(true);
        setErrorMessage('No account found with this email. Please complete registration.');
        return;
      }
      
      // For all other errors, just display the formatted message
      setErrorMessage(errorText);
      
      // Show toast notification for the error
      if (showNameField) {
        toast.auth.registrationError(formatErrorMessage(errorText));
      } else {
        toast.auth.loginError(formatErrorMessage(errorText));
      }
    }
  };
  
  // Create a wrapper function to handle button clicks
  const handleButtonClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    handleContinue({} as React.FormEvent);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    
    // Emit event for analytics or tracking
    eventBus.emit(EventType.UI_MODAL_OPEN, {
      modalId: 'forgot-password-modal',
      props: { email }
    });
  };

  const handleForgotPasswordClose = (success?: boolean) => {
    setShowForgotPassword(false);
    if (success) {
      // Show toast for password reset email sent
      toast.auth.resetPasswordSuccess();
    }
  };

  const formatErrorMessage = (message: string | any): string => {
    // If message is not a string or is undefined/null, provide a default error message
    if (!message || typeof message !== 'string') {
      return 'An unknown error occurred. Please try again.';
    }
    
    if (message.includes('auth/user-not-found')) {
      return 'No account found with this email. Please check your email.';
    } else if (message.includes('auth/wrong-password')) {
      return 'Incorrect password. Please try again or reset your password.';
    } else if (message.includes('auth/email-already-in-use')) {
      return 'An account with this email already exists. Please sign in instead or use a different email.';
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
    return showNameField 
      ? 'Create a new account' 
      : 'Sign in to your account or register for a new account';
  };

  const getFormTitle = () => {
    return showNameField 
      ? `Register as ${accountType === 'advertiser' ? 'an Advertiser' : 'a Client'}` 
      : "Sign in or Register";
  };

  return (
    <>
      <AccessibleModal
        isOpen={isOpen}
        onClose={onClose}
        title={getFormTitle()}
        description={getAccessibleModalDescription()}
        modalId="auth-modal"
        size="medium"
        showCloseButton={!isSubmitting && !loading}
      >
        <AuthModalContent>
          <div className="logo-container">
            <img src={Logo} alt="Kaari Logo" />
          </div>
          
          {showNameField && (
            <div className="account-type-toggle">
              <div className={`slider ${accountType === 'advertiser' ? 'advertiser' : ''}`}></div>
              <button 
                type="button"
                className={`toggle-button ${accountType === 'client' ? 'active' : ''}`}
                onClick={() => setAccountType('client')}
                aria-pressed={accountType === 'client'}
              >
                <FaUser size={16} />
                <span>Client</span>
              </button>
              <button 
                type="button"
                className={`toggle-button ${accountType === 'advertiser' ? 'active' : ''}`}
                onClick={() => setAccountType('advertiser')}
                aria-pressed={accountType === 'advertiser'}
              >
                <FaBuilding size={16} />
                <span>Advertiser</span>
              </button>
            </div>
          )}
          
          {showNameField && accountType === 'advertiser' && (
            <div className="advertiser-info">
              <h4>Register as Property Advertiser</h4>
              <p>You'll be able to list properties for rent and receive requests from clients.</p>
            </div>
          )}
          
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
            {showNameField && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  disabled={isSubmitting || loading}
                  aria-required="true"
                  aria-invalid={errorMessage && typeof errorMessage === 'string' && errorMessage.includes('name') ? 'true' : 'false'}
                />
              </div>
            )}
            
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
                aria-invalid={errorMessage && typeof errorMessage === 'string' && errorMessage.includes('email') ? 'true' : 'false'}
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
                  aria-invalid={errorMessage && typeof errorMessage === 'string' && errorMessage.includes('password') ? 'true' : 'false'}
                />
              </div>
            )}
            
            <PurpleButtonLB60
              text={isSubmitting || loading ? "Please wait..." : showNameField ? "Register" : "Continue"}
              onClick={handleButtonClick}
              disabled={isSubmitting || loading}
              aria-busy={isSubmitting || loading ? 'true' : 'false'}
            />
            
            {!showNameField && (
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
            )}
            
            <div className="separator">
              <span>or</span>
            </div>
            
            <WhiteButtonLB60
              text={
                <span className="google-button-content">
                  <FaGoogle aria-hidden="true" /> 
                  <span>Connect with Google</span>
                </span>
              }
              onClick={handleGoogleSignIn}
              disabled={isSubmitting || loading}
              aria-busy={isSubmitting || loading ? 'true' : 'false'}
            />
            
            {!showNameField && (
              <div className="advertiser-link" style={{ textAlign: 'center', marginTop: '20px' }}>
                <button 
                  type="button" 
                  className="btn-reset" 
                  style={{ color: Theme.colors.primary, textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                  onClick={() => {
                    setShowNameField(true);
                    setAccountType('advertiser');
                  }}
                >
                  Register as an advertiser
                </button>
              </div>
            )}
          </form>
        </AuthModalContent>
      </AccessibleModal>
      
      {showForgotPassword && (
        <ForgotPasswordModal
          isOpen={showForgotPassword}
          onClose={handleForgotPasswordClose}
          loading={isSubmitting || loading}
          initialEmail={email}
        />
      )}
    </>
  );
};

export default AuthModal; 
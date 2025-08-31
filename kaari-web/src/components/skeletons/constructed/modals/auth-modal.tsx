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

  @media (max-width: 700px) {
    min-width: 0;
  }
  
  .logo-container {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
    
    img {
      height: 50px;
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

  .advertiser-toggle {
    width: 100%;
    background: none;
    border: none;
    color: ${Theme.colors.primary};
    font-size: 14px;
    padding: 12px;
    margin-top: 16px;
    cursor: pointer;
    transition: opacity 0.2s;
    font-weight: 500;

    &:hover {
      opacity: 0.8;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'register';
  referralCode?: string | null;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  referralCode = null,
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
  const [isAdvertiserMode, setIsAdvertiserMode] = useState(false);
  const [showNameField, setShowNameField] = useState(false);
  const [currentReferralCode, setCurrentReferralCode] = useState<string | null>(null);
  
  // Use auth context
  const { signIn, signUp, signInWithGooglePopup, error, clearError, forceUpdate } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Use toast service
  const toast = useToastService();

  // Track if a blocked user message has already been shown
  const [hasShownBlockedMessage, setHasShownBlockedMessage] = useState(false);

  // Update referral code when prop changes
  useEffect(() => {
    if (referralCode) {
      setCurrentReferralCode(referralCode);
    }
  }, [referralCode]);

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
      setPassword('');
      setEmail('');
      setIsAdvertiserMode(false);
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
      // Reset blocked message flag
      setHasShownBlockedMessage(false);
      
      // Prevent default redirection behavior
      event?.preventDefault?.();
      
      // If we've selected the advertiser account type, pass that to the Google sign-in
      // This works whether we're on the name field or just clicked the advertiser toggle
      const isAdvertiserRegistration = isAdvertiserMode;
      
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
        if (isAdvertiserMode) {
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
      
      // Use formatErrorMessage to ensure toast notifications are handled consistently
      const formattedError = formatErrorMessage(errorText);
      setErrorMessage(formattedError);
      
      // Only show toast for non-blocked errors, as blocked errors are handled in formatErrorMessage
      if (!errorText.includes('account has been blocked') && !errorText.includes('has been blocked')) {
        toast.auth.loginError(formattedError);
      }
    }
  };

  const handleContinue = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && 'preventDefault' in e) {
      e.preventDefault();
    }
    
    // Reset blocked message flag at the start of each attempt
    setHasShownBlockedMessage(false);
    
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
    
    // Show password field after email validation
    if (!showPassword) {
      setShowPassword(true);
      return;
    }

    // If password field is empty, just validate
    if (!password.trim()) {
      setErrorMessage('Please enter your password');
      return;
    }

    // For advertiser mode, always collect name for new registrations
    if (isAdvertiserMode && !showNameField) {
      try {
        // Try to sign in first to check if account exists
        const userCredential = await signIn(email, password);
        
        // If we get here and it's not an advertiser account, show error
        if (!(userCredential as any)?.user?.isAdvertiser) {
          setErrorMessage('This email is registered as a client account. Please use a different email for your advertiser account.');
          return;
        }
        
        // If it is an advertiser, let them sign in
        if (onSuccess) onSuccess();
        setEmail('');
        setPassword('');
        setShowPassword(false);
        return;
        
      } catch (error: any) {
        // If user not found, proceed to registration
        if (error.message?.includes('user-not-found')) {
          setShowNameField(true);
          return;
        }
        // For other errors, show them
        setErrorMessage(formatErrorMessage(error.message || String(error)));
        return;
      }
    }

    // If in advertiser mode and name is required but empty
    if (isAdvertiserMode && showNameField && !name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    // Proceed with registration (we only get here for new advertiser registration)
    if (isAdvertiserMode && showNameField) {
      setIsSubmitting(true);
      setErrorMessage(null);
      
      try {
        await signUp(email, password, name, 'advertiser');
        toast.auth.registrationSuccess();
        
        // If we get here, it means the registration was successful
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
        
        let errorText = error.message || String(error);
        if (errorText.includes('email-already-in-use')) {
          errorText = 'This email is already registered. Please use a different email for your advertiser account.';
        }
        
        setErrorMessage(formatErrorMessage(errorText));
        toast.auth.registrationError(errorText);
      }
      return;
    }

    // Regular sign in (non-advertiser mode)
    if (!isAdvertiserMode) {
      setIsSubmitting(true);
      setErrorMessage(null);
      
      try {
        // If we have a referral code and this is a new registration, sign up instead of signing in
        if (currentReferralCode && initialMode === 'register') {
          // We need to collect the name first
          if (!showNameField) {
            setShowNameField(true);
            setIsSubmitting(false);
            return;
          }
          
          // If we have the name, proceed with registration
          if (name.trim()) {
            await signUp(email, password, name, 'client', currentReferralCode);
            toast.auth.registrationSuccess();
            toast.showToast('success', 'Referral', '200 MAD discount applied to your account!', true, 5000);
          } else {
            setErrorMessage('Please enter your full name');
            setIsSubmitting(false);
            return;
          }
        } else {
          // Regular sign in
          await signIn(email, password);
        }
        
        // If we get here, it means the sign in was successful
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
        
        // Get error message
        const errorText = error.message || String(error);
        
        // Use formatErrorMessage to ensure toast notifications are handled consistently
        const formattedError = formatErrorMessage(errorText);
        setErrorMessage(formattedError);
        
        // Only show toast for non-blocked errors, as blocked errors are handled in formatErrorMessage
        if (!errorText.includes('account has been blocked') && !errorText.includes('has been blocked')) {
          toast.auth.loginError(formattedError);
        }
      }
    }
  };

  const handleCancel = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e && 'preventDefault' in e) {
      e.preventDefault();
    }
    if (showNameField) {
      setShowNameField(false);
    } else {
      setShowPassword(false);
      setPassword('');
    }
    setErrorMessage(null);
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
    } else if (message.includes('account has been blocked') || message.includes('has been blocked')) {
      // Special case for blocked user - only show once
      if (!hasShownBlockedMessage) {
        setHasShownBlockedMessage(true);
        toast.auth.userBlocked();
      }
      return 'Your account has been blocked. Please contact support for assistance.';
    }
    return message;
  };

  const getAccessibleModalDescription = () => {
    return showNameField 
      ? 'Create a new account' 
      : 'Sign in to your account or register for a new account';
  };

  const getFormTitle = () => {
    if (isAdvertiserMode) {
      return showNameField ? "Register as Advertiser" : "Advertiser Sign In";
    }
    return "Sign in";
  };

  // Create a wrapper function to handle button clicks
  const handleButtonClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (showPassword && !password.trim()) {
      handleCancel(e);
    } else {
      handleContinue(e);
    }
  };

  const toggleAdvertiserMode = () => {
    setIsAdvertiserMode(!isAdvertiserMode);
    setShowPassword(false);
    setShowNameField(false);
    setPassword('');
    setName('');
    setErrorMessage(null);
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
          
          {isAdvertiserMode && showNameField && (
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
            {isAdvertiserMode && showNameField && (
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
            
            {showPassword && (
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
              </div>
            )}
            
            <PurpleButtonLB60
              text={
                isSubmitting || loading 
                  ? "Please wait..." 
                  : showPassword 
                    ? password.trim() 
                      ? isAdvertiserMode && !showNameField
                        ? "Continue"
                        : showNameField
                          ? "Register"
                          : "Log in"
                      : "Cancel"
                    : "Continue"
              }
              onClick={(e) => handleButtonClick(e as any)}
              disabled={isSubmitting || loading}
              aria-busy={isSubmitting || loading ? 'true' : 'false'}
            />
            
            {!showPassword && (
              <>
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

                
              </>
            )}
          </form>
        </AuthModalContent>
      </AccessibleModal>
      
      {showForgotPassword && (
        <ForgotPasswordModal
          isOpen={showForgotPassword}
          onClose={handleForgotPasswordClose}
          initialEmail={email}
        />
      )}
    </>
  );
};

export default AuthModal; 
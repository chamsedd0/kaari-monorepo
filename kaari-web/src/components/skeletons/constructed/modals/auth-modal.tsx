import React, { useState, useRef, useEffect } from 'react';
import { ModalOverlayStyle, AuthModalStyle } from '../../../styles/constructed/modals/auth-modal-style';
import { FaGoogle, FaTimes } from 'react-icons/fa';
import { PurpleButtonLB60 } from '../../buttons/purple_LB60';
import { WhiteButtonLB60 } from '../../buttons/white_LB60';
import Logo from "../../../../assets/images/purpleLogo.svg";
import { useAuth } from '../../../../contexts/auth';
import { ForgotPasswordModal } from './forgot-password-modal';

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
  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Use auth context
  const { signIn, signUp, signInWithGooglePopup, sendPasswordResetEmail, error, loading } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if clicking on the overlay, not when clicking inside the modal
      const target = event.target as HTMLElement;
      if (target && target.classList.contains('auth-modal-overlay')) {
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

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGooglePopup();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      // Error is handled in auth context and passed via the error state
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    try {
      if (mode === 'signin') {
        await signIn(email, password);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        if (!name.trim()) {
          setErrorMessage('Please enter your name');
          return;
        }
        await signUp(email, password, name);
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      // Error is handled in auth context and passed via the error state
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'register' : 'signin');
    setErrorMessage(null);
  };
  
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };
  
  const handleForgotPasswordSubmit = async (email: string) => {
    try {
      await sendPasswordResetEmail(email);
    } catch (err) {
      // Error is handled in auth context
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {!showForgotPassword && (
        <ModalOverlayStyle 
          className="auth-modal-overlay" 
          onClick={(e) => {
            // Only close if clicking directly on the overlay
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <AuthModalStyle ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="logo-container">
                <img src={Logo} alt="Kaari Logo" />
              </div>
              <button className="close-button" onClick={onClose}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="auth-header">
                <h2>{mode === 'signin' ? 'Sign in or Register' : 'Create an Account'}</h2>
                <p>{mode === 'signin' ? 'Welcome back!' : 'Join Kaari today'}</p>
              </div>

              <button 
                className="social-login-button" 
                onClick={handleGoogleSignIn} 
                disabled={loading}
              >
                <FaGoogle />
                <span>Connect with Google</span>
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              {errorMessage && (
                <div className="warning-message">
                  <div className="icon">⚠️</div>
                  <div className="message">{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {mode === 'register' && (
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {mode === 'signin' && (
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember">Remember this device</label>
                  </div>
                )}

                <div className="button-container">
                  <PurpleButtonLB60 
                    text={mode === 'signin' ? 'Sign in or Register' : 'Create Account'} 
                    onClick={handleSubmit}
                    disabled={loading}
                  />
                </div>
              </form>

              {mode === 'signin' && (
                <div className="link-text" onClick={handleForgotPassword}>
                  Forgot password?
                </div>
              )}

              <div className="link-text" onClick={toggleMode}>
                {mode === 'signin' ? 'Are you an advertiser?' : 'Already have an account? Sign in'}
              </div>
            </div>
          </AuthModalStyle>
        </ModalOverlayStyle>
      )}
      
      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSubmit={handleForgotPasswordSubmit}
      />
    </>
  );
};

export default AuthModal; 
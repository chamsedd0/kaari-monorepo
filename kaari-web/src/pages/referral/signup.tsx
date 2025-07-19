import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { FaEye, FaEyeSlash, FaExclamationTriangle, FaUser } from 'react-icons/fa';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { useStore } from '../../backend/store';
import { useToastService } from '../../services/ToastService';
import { getReferralCode } from '../../utils/referral-utils';
import MainLayout from '../../layouts/MainLayout';
import { GoogleButtonMB48 } from '../../components/skeletons/buttons/google_MB48';
import googleIcon from '../../components/skeletons/icons/google-icon.svg';

// Custom compact input component
const CompactInput = ({ title, ...props }: { title: string, [key: string]: any }) => {
  return (
    <CompactInputContainer>
      <label>{title}</label>
      <input {...props} />
    </CompactInputContainer>
  );
};

// Password input with show/hide toggle
const PasswordInput = ({ title, value, onChange, placeholder }: { 
  title: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  placeholder: string
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <CompactInputContainer>
      <label>{title}</label>
      <div className="password-input-container">
        <input 
          type={showPassword ? "text" : "password"} 
          value={value} 
          onChange={onChange}
          placeholder={placeholder}
        />
        <button 
          type="button" 
          className="toggle-password" 
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </CompactInputContainer>
  );
};

const ReferralSignupPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToastService();
  const signUp = useStore(state => state.signUp);
  const [isMobile, setIsMobile] = useState(false);
  
  // Form state
  const [step, setStep] = useState<'email' | 'password' | 'login'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(200); // Default 200 MAD
  const [userName, setUserName] = useState('John');
  const [userAge, setUserAge] = useState('20');
  
  // Check if device is mobile and extract referral code
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Extract referral code from URL
    const code = getReferralCode(window.location.href);
    if (code) {
      setReferralCode(code);
    } else {
      // If no code in URL, redirect to home
      navigate('/');
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [navigate]);
  
  // Handle email step
  const handleEmailStep = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError(null);
    setStep('password');
  };
  
  // Handle password creation
  const handlePasswordCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords don\'t match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    // Check if password contains both letters and numbers
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    if (!hasLetters || !hasNumbers) {
      setError('Password must contain both letters and numbers');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create user with email and password, passing the referral code
      const user = await signUp(email, password, '', 'client', referralCode);
      
      // Send email verification
      const auth = getAuth();
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser, {
          url: window.location.origin + '/email-verification/success',
          handleCodeInApp: true
        });
        toast.auth.verificationEmailSent();
      }
      
      // Move to login step
      setStep('login');
      setIsLoading(false);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'An error occurred during signup');
      setIsLoading(false);
    }
  };
  
  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginPassword) {
      setError('Password is required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Show success message about the discount
      toast.showToast(
        'success',
        'Discount Applied!',
        `Your ${discountAmount} MAD discount has been applied to your account and is valid for 7 days.`
      );
      
      // Redirect to the property list page
      navigate('/properties', { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
      setIsLoading(false);
    }
  };
  
  // Handle Google signup
  const handleGoogleSignup = async () => {
    if (!referralCode) {
      setError('Missing referral code');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the signInWithGoogle function from auth.ts
      const { signInWithGoogle } = await import('../../backend/firebase/auth');
      const user = await signInWithGoogle('client', false, referralCode);
      
      if (user && user.id) {
        // Show success message about the discount
        toast.showToast(
          'success',
          'Discount Applied!',
          `Your ${discountAmount} MAD discount has been applied to your account and is valid for 7 days.`
        );
        
        // Redirect to the property list page
        navigate('/properties', { replace: true });
      }
    } catch (err: any) {
      console.error('Google signup error:', err);
      setError(err.message || 'An error occurred during Google signup');
    }
    
    setIsLoading(false);
  };
  
  return (
    <MainLayout>
      <SignupContainer isMobile={isMobile}>
        <ContentContainer isMobile={isMobile}>
          <SignupCard isMobile={isMobile}>
            {step === 'email' ? (
              <>
                <CardHeader isMobile={isMobile}>
                  <h1>Log in or Sign up</h1>
                </CardHeader>
                
                <ReferralBanner>
                  <div className="banner-icon">
                    <span>%</span>
                  </div>
                  <span className="banner-text">
                    Your Referral code is automatically applied!
                  </span>
                </ReferralBanner>
                
                {error && (
                  <ErrorMessage>
                    {error}
                  </ErrorMessage>
                )}
                
                <SignupForm onSubmit={handleEmailStep}>
                  <CompactInput
                    type="email"
                    placeholder="email@email.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    title="Email"
                  />
                  
                  <Divider isMobile={isMobile}>
                    <span>or</span>
                  </Divider>
                  
                  <GoogleButtonWrapper>
                    <GoogleButtonMB48 
                      icon={googleIcon}
                      text="Connect  with Google"
                    />
                  </GoogleButtonWrapper>
                  
                  <LoginOptions>
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        id="remember-device-email"
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                      />
                      <label htmlFor="remember-device-email">
                        Remember this device
                      </label>
                    </div>
                    <ForgotPasswordLink>
                      Forgot password?
                    </ForgotPasswordLink>
                  </LoginOptions>
                  
                  <SubmitButtonWrapper isMobile={isMobile}>
                    <CompactPurpleButton 
                      type="submit"
                      disabled={isLoading}
                      isMobile={isMobile}
                    >
                      {isLoading ? 'Loading...' : 'Log in or Sign Up'}
                    </CompactPurpleButton>
                  </SubmitButtonWrapper>
                </SignupForm>
                
                <AdvertiserLink>
                  Are you an advertiser?
                </AdvertiserLink>
              </>
            ) : step === 'password' ? (
              <>
                <CardHeader isMobile={isMobile}>
                  <h1>Create Password</h1>
                </CardHeader>
                
                {error && (
                  <ErrorMessage>
                    {error}
                  </ErrorMessage>
                )}
                
                <SignupForm onSubmit={handlePasswordCreation}>
                  <PasswordInput
                    title="Create Password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="Enter here"
                  />
                  
                  <PasswordInput
                    title="Re-enter Password"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    placeholder="Enter here"
                  />
                  
                  <PasswordRequirements>
                    <FaExclamationTriangle />
                    <span>Passwords must have at least 8 characters and contain numbers and letters</span>
                  </PasswordRequirements>
                  
                  <SubmitButtonWrapper isMobile={isMobile}>
                    <CompactPurpleButton 
                      type="submit"
                      disabled={isLoading}
                      isMobile={isMobile}
                    >
                      {isLoading ? 'Loading...' : 'Create Password'}
                    </CompactPurpleButton>
                  </SubmitButtonWrapper>
                </SignupForm>
              </>
            ) : (
              <>
                <CardHeader isMobile={isMobile}>
                  <h1>Enter Password</h1>
                </CardHeader>
                
                <UserInfoSection>
                  <p className="login-text">You are logging in as</p>
                  <UserCard>
                    <div className="user-avatar">
                      <FaUser />
                    </div>
                    <div className="user-details">
                      <span className="user-name">{userName}, {userAge}</span>
                    </div>
                  </UserCard>
                </UserInfoSection>
                
                {error && (
                  <ErrorMessage>
                    {error}
                  </ErrorMessage>
                )}
                
                <SignupForm onSubmit={handleLogin}>
                  <PasswordInput
                    title="Your password"
                    value={loginPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginPassword(e.target.value)}
                    placeholder="email@email.com"
                  />
                  
                  <LoginOptions>
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        id="remember-device"
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                      />
                      <label htmlFor="remember-device">
                        Remember this device
                      </label>
                    </div>
                    <ForgotPasswordLink>
                      Forgot password?
                    </ForgotPasswordLink>
                  </LoginOptions>
                  
                  <SubmitButtonWrapper isMobile={isMobile}>
                    <CompactPurpleButton 
                      type="submit"
                      disabled={isLoading}
                      isMobile={isMobile}
                    >
                      {isLoading ? 'Loading...' : 'Log in'}
                    </CompactPurpleButton>
                  </SubmitButtonWrapper>
                </SignupForm>
                
                <AdvertiserLink>
                  Are you an advertiser?
                </AdvertiserLink>
              </>
            )}
          </SignupCard>
        </ContentContainer>
      </SignupContainer>
    </MainLayout>
  );
};

// Styled components
const SignupContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px);
  padding: ${props => props.isMobile ? '16px' : '40px'};
  margin-top: 80px;
  background-color: ${Theme.colors.white};
`;

const ContentContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  max-width: ${props => props.isMobile ? '100%' : '480px'};
  margin: 0 auto;
`;

const SignupCard = styled.div<{ isMobile: boolean }>`
  background-color: white;
  padding: ${props => props.isMobile ? '0' : '40px'};
  width: 100%;
`;

const CardHeader = styled.div<{ isMobile: boolean }>`
  text-align: center;
  margin-bottom: 24px;
  
  h1 {
    font: ${Theme.typography.fonts.extraLargeB};
    margin: 0;
    color: ${Theme.colors.black};
  }
`;

const ReferralBanner = styled.div`
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, rgba(173, 115, 255, 1) 0%, rgba(0, 191, 212, 1) 100%);
  color: white;
  padding: 12px 16px;
  border-radius: ${Theme.borders.radius.md};
  margin-bottom: 24px;
  
  .banner-icon {
    background-color: white;
    color: rgba(173, 115, 255, 1);
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    font-weight: bold;
    font-size: 14px;
  }
  
  .banner-text {
    font: ${Theme.typography.fonts.mediumM};
  }
`;

const UserInfoSection = styled.div`
  text-align: center;
  margin-bottom: 24px;
  
  .login-text {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.black};
    margin: 0 0 16px 0;
  }
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${Theme.colors.gray2};
  border-radius: 50px;
  padding: 8px 16px;
  width: fit-content;
  margin: 0 auto;
  
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: ${Theme.colors.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    
    svg {
      color: white;
      font-size: 16px;
    }
  }
  
  .user-details {
    .user-name {
      font: ${Theme.typography.fonts.mediumB};
      color: ${Theme.colors.black};
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #FFF0F0;
  color: #E53935;
  padding: 12px 16px;
  border-radius: ${Theme.borders.radius.md};
  margin-bottom: 24px;
  font: ${Theme.typography.fonts.mediumM};
`;

const SignupForm = styled.form`
  width: 100%;
`;

const CompactInputContainer = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.black};
    margin-bottom: 8px;
  }
  
  input {
    width: 100%;
    padding: 16px;
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.extreme};
    font: ${Theme.typography.fonts.mediumM};
    
    &:focus {
      outline: none;
      border-color: rgba(173, 115, 255, 1);
    }
  }
  
  .password-input-container {
    position: relative;
    
    input {
      padding-right: 48px;
    }
    
    .toggle-password {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: ${Theme.colors.black};
      
      &:hover {
        color: ${Theme.colors.primary};
      }
    }
  }
`;

const LoginOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  .checkbox-container {
    display: flex;
    align-items: center;
    
    input[type="checkbox"] {
      margin-right: 8px;
      width: 20px;
      height: 20px;
      padding: 0;
      accent-color: ${Theme.colors.secondary};
      border: 1px solid ${Theme.colors.black};
      border-radius: 4px;
    }
    
    label {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.black};
      margin: 0;
      cursor: pointer;
    }
  }
`;

const ForgotPasswordLink = styled.span`
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.primary};
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PasswordRequirements = styled.div`
  display: flex;
  align-items: flex-start;
  background-color: ${Theme.colors.primary}20;
  color: white;
  padding: 12px 16px;
  border-radius: ${Theme.borders.radius.md};
  margin-bottom: 24px;
  
  svg {
    margin-right: 12px;
    margin-top: 2px;
    color: ${Theme.colors.primary};
    flex-shrink: 0;
  }
  
  span {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.primary};
    line-height: 1.4;
  }
`;

const Divider = styled.div<{ isMobile: boolean }>`
  display: flex;
  align-items: center;
  margin: 24px 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${Theme.colors.sixth};
  }
  
  span {
    padding: 0 16px;
    color: ${Theme.colors.black};
    font: ${Theme.typography.fonts.mediumM};
  }
`;

const GoogleButtonWrapper = styled.div`
  width: 100%;
  margin-bottom: 24px;
  
  > * {
    width: 100%;
  }
`;

const SubmitButtonWrapper = styled.div<{ isMobile: boolean }>`
  margin-top: 24px;
`;

const CompactPurpleButton = styled.button<{ isMobile: boolean }>`
  width: 100%;
  padding: 16px;
  background-color: ${Theme.colors.secondary};
  color: white;
  border: none;
  border-radius: ${Theme.borders.radius.extreme};
  font: ${Theme.typography.fonts.mediumB};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${Theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AdvertiserLink = styled.p`
  text-align: center;
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.secondary};
  margin-top: 24px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default ReferralSignupPage; 
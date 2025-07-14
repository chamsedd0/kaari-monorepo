import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { FaGoogle, FaArrowLeft, FaEye, FaEyeSlash, FaGift } from 'react-icons/fa';
import Logo from '../../assets/images/purpleLogo.svg';
import { getAuth, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { useStore } from '../../backend/store';
import { useToastService } from '../../services/ToastService';
import { LanguageSwitcher, MobileLanguageSwitcher } from '../../components/skeletons/language-switcher';
import { getReferralCode } from '../../utils/referral-utils';
import MainLayout from '../../layouts/MainLayout';
import { getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../backend/firebase/config';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(200); // Default 200 MAD
  
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
  
  // Handle email signup
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!email || !password || !confirmPassword || !name) {
      setError(t('referral.signup.errors.all_fields_required', 'All fields are required'));
      return;
    }
    
    if (password !== confirmPassword) {
      setError(t('referral.signup.errors.passwords_dont_match', 'Passwords don\'t match'));
      return;
    }
    
    if (password.length < 6) {
      setError(t('referral.signup.errors.password_too_short', 'Password must be at least 6 characters'));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create user with email and password, passing the referral code
      const user = await signUp(email, password, name, 'client', referralCode);
      
      // Send email verification
      const auth = getAuth();
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser, {
          url: window.location.origin + '/email-verification/success',
          handleCodeInApp: true
        });
        toast.auth.verificationEmailSent();
      }
      
      // Show success message about the discount
      toast.showToast(
        'success',
        t('referral.signup.discount_applied', 'Discount Applied!'),
        t('referral.signup.discount_message', 'Your {{amount}} MAD discount has been applied to your account and is valid for 7 days.', { amount: discountAmount })
      );
      
      // Redirect to the property list page
      navigate('/properties', { replace: true });
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || t('referral.signup.errors.signup_error', 'An error occurred during signup'));
      setIsLoading(false);
    }
  };
  
  // Handle Google signup
  const handleGoogleSignup = async () => {
    if (!referralCode) {
      setError(t('referral.signup.errors.missing_referral', 'Missing referral code'));
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
          t('referral.signup.discount_applied', 'Discount Applied!'),
          t('referral.signup.discount_message', 'Your {{amount}} MAD discount has been applied to your account and is valid for 7 days.', { amount: discountAmount })
        );
        
        // Redirect to the property list page
        navigate('/properties', { replace: true });
      }
    } catch (err: any) {
      console.error('Google signup error:', err);
      setError(err.message || t('referral.signup.errors.google_error', 'An error occurred during Google signup'));
    }
    
    setIsLoading(false);
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate(`/referral/claim-discount?ref=${referralCode}`);
  };
  
  return (
    <MainLayout>
      <SignupContainer isMobile={isMobile}>
        <TopSection isMobile={isMobile}>
          <BackButton onClick={handleBackClick}>
            <FaArrowLeft />
          </BackButton>
          <LogoContainer>
            <img src={Logo} alt={t('common.kaari_logo')} height={isMobile ? "28" : "32"} />
          </LogoContainer>
          <LanguageSwitcherContainer>
            {isMobile ? <MobileLanguageSwitcher lightBackground={true} /> : <LanguageSwitcher />}
          </LanguageSwitcherContainer>
        </TopSection>
        
        <ContentContainer isMobile={isMobile}>
          <SignupCard isMobile={isMobile}>
            <CardHeader isMobile={isMobile}>
              <DiscountBadge>
                <FaGift />
                <span>{discountAmount} MAD {t('referral.signup.discount', 'Discount')}</span>
              </DiscountBadge>
              <h1>{t('referral.signup.title', 'Create an Account')}</h1>
              <p>{t('referral.signup.subtitle', 'Sign up to claim your discount')}</p>
            </CardHeader>
            
            {error && (
              <ErrorMessage>
                {error}
              </ErrorMessage>
            )}
            
            <GoogleButton onClick={handleGoogleSignup} disabled={isLoading} isMobile={isMobile}>
              <FaGoogle />
              {t('referral.signup.continue_with_google', 'Continue with Google')}
            </GoogleButton>
            
            <Divider isMobile={isMobile}>
              <span>{t('common.or', 'or')}</span>
            </Divider>
            
            <SignupForm onSubmit={handleEmailSignup}>
              <CompactInput
                type="text"
                placeholder={t('referral.signup.name_placeholder', 'Your full name')}
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                title={t('referral.signup.full_name', 'Full Name')}
              />
              
              <CompactInput
                type="email"
                placeholder={t('referral.signup.email_placeholder', 'Your email address')}
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                title={t('referral.signup.email', 'Email')}
              />
              
              <PasswordInput
                title={t('referral.signup.password', 'Password')}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder={t('referral.signup.password_placeholder', 'Create a password')}
              />
              
              <PasswordInput
                title={t('referral.signup.confirm_password', 'Confirm Password')}
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                placeholder={t('referral.signup.confirm_password_placeholder', 'Confirm your password')}
              />
              
              <SubmitButtonWrapper isMobile={isMobile}>
                <CompactPurpleButton 
                  type="submit"
                  disabled={isLoading}
                  isMobile={isMobile}
                >
                  {isLoading ? t('common.loading', 'Loading...') : t('referral.signup.create_account', 'Create Account & Claim Discount')}
                </CompactPurpleButton>
              </SubmitButtonWrapper>
            </SignupForm>
            
            <TermsText>
              {t('referral.signup.terms', 'By signing up, you agree to our Terms of Service and Privacy Policy')}
            </TermsText>
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

const TopSection = styled.div<{ isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.isMobile ? '24px' : '40px'};
  position: relative;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: ${Theme.colors.black};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${Theme.colors.lightGray};
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
`;

const LanguageSwitcherContainer = styled.div`
  min-width: 100px;
  display: flex;
  justify-content: flex-end;
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
  border-radius: ${Theme.borders.radius.large};
  box-shadow: ${props => props.isMobile ? 'none' : '0 8px 24px rgba(0, 0, 0, 0.1)'};
  padding: ${props => props.isMobile ? '0' : '40px'};
  width: 100%;
`;

const CardHeader = styled.div<{ isMobile: boolean }>`
  text-align: center;
  margin-bottom: 32px;
  
  h1 {
    font: ${Theme.typography.fonts.boldL};
    margin: 16px 0 8px;
  }
  
  p {
    font: ${Theme.typography.fonts.regularM};
    color: ${Theme.colors.darkGray};
    margin: 0;
  }
`;

const DiscountBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background: linear-gradient(90deg, ${Theme.colors.primary} 0%, ${Theme.colors.secondary} 100%);
  color: white;
  padding: 8px 16px;
  border-radius: ${Theme.borders.radius.medium};
  margin: 0 auto;
  
  svg {
    margin-right: 8px;
  }
  
  span {
    font: ${Theme.typography.fonts.boldM};
  }
`;

const ErrorMessage = styled.div`
  background-color: #FFF0F0;
  color: #E53935;
  padding: 12px 16px;
  border-radius: ${Theme.borders.radius.medium};
  margin-bottom: 24px;
  font: ${Theme.typography.fonts.regularM};
`;

const GoogleButton = styled.button<{ isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px;
  border: 1px solid ${Theme.colors.lightGray};
  border-radius: ${Theme.borders.radius.medium};
  background-color: white;
  font: ${Theme.typography.fonts.boldM};
  color: ${Theme.colors.black};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${Theme.colors.lightGray};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: 12px;
    color: #4285F4;
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
    background-color: ${Theme.colors.lightGray};
  }
  
  span {
    padding: 0 16px;
    color: ${Theme.colors.darkGray};
    font: ${Theme.typography.fonts.regularM};
  }
`;

const SignupForm = styled.form`
  width: 100%;
`;

const CompactInputContainer = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    font: ${Theme.typography.fonts.regularM};
    color: ${Theme.colors.darkGray};
    margin-bottom: 8px;
  }
  
  input {
    width: 100%;
    padding: 16px;
    border: 1px solid ${Theme.colors.lightGray};
    border-radius: ${Theme.borders.radius.medium};
    font: ${Theme.typography.fonts.regularM};
    
    &:focus {
      outline: none;
      border-color: ${Theme.colors.primary};
      box-shadow: 0 0 0 2px ${Theme.colors.primary}20;
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
      color: ${Theme.colors.darkGray};
      
      &:hover {
        color: ${Theme.colors.primary};
      }
    }
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
  border-radius: ${Theme.borders.radius.medium};
  font: ${Theme.typography.fonts.boldM};
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

const TermsText = styled.p`
  text-align: center;
  font: ${Theme.typography.fonts.regularS};
  color: ${Theme.colors.darkGray};
  margin-top: 24px;
`;

export default ReferralSignupPage; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { FaGoogle, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import Logo from '../../assets/images/purpleLogo.svg';
import { getAuth, GoogleAuthProvider, signInWithPopup, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { useStore } from '../../backend/store';
import { useToastService } from '../../services/ToastService';
import { LanguageSwitcher, MobileLanguageSwitcher } from '../../components/skeletons/language-switcher';
import { startSignup } from '../../utils/advertiser-signup';
import { hideHeadersAndFooters } from '../../utils/advertiser-signup';
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

const AdvertiserSignupForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastService();
  const signUp = useStore(state => state.signUp);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile and hide headers/footers
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Hide scrollbar on mobile
    if (window.innerWidth <= 768) {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      
      const style = document.createElement('style');
      style.textContent = `
        body::-webkit-scrollbar, html::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          background: transparent !important;
        }
        body, html {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Hide headers and footers
    const cleanupHeadersFooters = hideHeadersAndFooters();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      cleanupHeadersFooters();
    };
  }, []);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle email signup
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!email || !password || !confirmPassword || !name) {
      setError(t('advertiser_signup.errors.all_fields_required'));
      return;
    }
    
    if (password !== confirmPassword) {
      setError(t('advertiser_signup.errors.passwords_dont_match'));
      return;
    }
    
    if (password.length < 6) {
      setError(t('advertiser_signup.errors.password_too_short'));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create user with email and password
      const user = await signUp(email, password, name, 'advertiser');
      
      // Send email verification
      const auth = getAuth();
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser, {
          url: window.location.origin + '/email-verification/success',
          handleCodeInApp: true
        });
        toast.auth.verificationEmailSent();
      }
      
      // Start the signup process
      startSignup();
      
      // Redirect to the waiting page with email in state
      navigate('/email-verification/waiting', { 
        replace: true,
        state: { email }
      });
    } catch (err: any) {
      console.error('Signup error:', err);
      
      // Handle specific error cases
      if (err.code === 'auth/email-already-in-use') {
        // Check if the user has an incomplete signup in Firestore
        try {
          const auth = getAuth();
          const result = await signInWithEmailAndPassword(auth, email, password);
          const userDoc = await getDoc(doc(db, 'users', result.user.uid));
          
          if (userDoc.exists()) {
            // Check if the user has already completed the signup process
            if (userDoc.data().signupStatus === 'completed') {
              // User exists and completed signup, show error
              setError(t('advertiser_signup.errors.already_registered'));
              // Sign out the user we just signed in
              await auth.signOut();
            } 
            // User exists but didn't complete signup, allow continuing
            else if (userDoc.data().signupStatus !== 'completed') {
              if (!result.user.emailVerified) {
                // Send verification email again
                await sendEmailVerification(result.user, {
                  url: window.location.origin + '/email-verification/success',
                  handleCodeInApp: true
                });
                
                // Redirect to waiting page
                navigate('/email-verification/waiting', { 
                  replace: true,
                  state: { email }
                });
              } else {
                // Email already verified, continue to onboarding
                startSignup();
                navigate('/become-advertiser', { replace: true });
              }
            }
          } else {
            // User exists but no document, treat as new signup
            // This shouldn't normally happen, but just in case
            setError(t('advertiser_signup.errors.email_in_use'));
            // Sign out the user we just signed in
            await auth.signOut();
          }
        } catch (signInError) {
          // Failed to sign in with existing email, show original error
          setError(t('advertiser_signup.errors.email_in_use'));
        }
      } else {
        setError(err.message || t('advertiser_signup.errors.generic_error'));
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle Google signup
  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      
      // Add advertiser role hint
      provider.setCustomParameters({
        prompt: 'select_account',
        login_hint: 'advertiser_registration'
      });
      
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        // First check if this user has already completed the signup process
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        
        if (userDoc.exists() && userDoc.data().signupStatus === 'completed') {
          // User has already completed the signup process, show error and sign out
          setError(t('advertiser_signup.errors.already_registered'));
          await auth.signOut();
          setIsLoading(false);
          return;
        }
        
        // Check if email is verified (should be for Google accounts)
        if (!result.user.emailVerified) {
          // Send verification email if not verified
          await sendEmailVerification(result.user, {
            url: window.location.origin + '/email-verification/success',
            handleCodeInApp: true
          });
          toast.auth.verificationEmailSent();
          
          // Redirect to waiting page
          navigate('/email-verification/waiting', { 
            replace: true,
            state: { email: result.user.email }
          });
        } else {
          // Email already verified, continue to onboarding
          
          // Check if user document exists and mark signup status
          await setDoc(doc(db, 'users', result.user.uid), {
            signupStatus: 'email_verified',
            emailVerified: true,
            email: result.user.email,
            displayName: result.user.displayName,
            createdAt: serverTimestamp()
          }, { merge: true });
          
          // Start the signup process
          startSignup();
          
          // Redirect to advertiser onboarding
          navigate('/become-advertiser?fromAuth=true', { replace: true });
        }
      }
    } catch (err: any) {
      console.error('Google signup error:', err);
      setError(err.message || t('advertiser_signup.errors.google_error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate('/advertiser-signup');
  };
  
  return (
    <SignupContainer isMobile={isMobile}>
      <TopSection isMobile={isMobile}>
        {isMobile && (
          <BackButton onClick={handleBackClick}>
            <FaArrowLeft />
          </BackButton>
        )}
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
            <h1>{t('advertiser_signup.title')}</h1>
            <p>{t('advertiser_signup.subtitle')}</p>
          </CardHeader>
          
          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}
          
          <GoogleButton onClick={handleGoogleSignup} disabled={isLoading} isMobile={isMobile}>
            <FaGoogle />
            {t('advertiser_signup.continue_with_google')}
          </GoogleButton>
          
          <Divider isMobile={isMobile}>
            <span>{t('common.or')}</span>
          </Divider>
          
          <SignupForm onSubmit={handleEmailSignup}>
            <CompactInput
              type="text"
              placeholder={t('advertiser_signup.name_placeholder')}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              title={t('advertiser_signup.full_name')}
            />
            
            <CompactInput
              type="email"
              placeholder={t('advertiser_signup.email_placeholder')}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              title={t('advertiser_signup.email')}
            />
            
            <PasswordInput
              type="password"
              placeholder={t('advertiser_signup.password_placeholder')}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              title={t('advertiser_signup.password')}
            />
            
            <PasswordInput
              type="password"
              placeholder={t('advertiser_signup.confirm_password_placeholder')}
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              title={t('advertiser_signup.confirm_password')}
            />
            
            <SubmitButtonWrapper isMobile={isMobile}>
              <CompactPurpleButton 
                onClick={handleEmailSignup} 
                disabled={isLoading}
                type="submit"
                isMobile={isMobile}
              >
                {isLoading ? t('common.loading') : t('advertiser_signup.create_account')}
              </CompactPurpleButton>
            </SubmitButtonWrapper>
          </SignupForm>
          
          <PrivacyNote isMobile={isMobile}>
            {t('advertiser_signup.privacy_note')}
          </PrivacyNote>
          
          <LanguageNote isMobile={isMobile}>
            {t('advertiser_signup.language_note')}
          </LanguageNote>
        </SignupCard>
      </ContentContainer>
    </SignupContainer>
  );
};

// Styled components
const SignupContainer = styled.div<{ isMobile: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${Theme.colors.white};
  color: ${Theme.colors.black};
  box-sizing: border-box;
  z-index: 1000;
  overflow-y: ${props => props.isMobile ? 'auto' : 'auto'};
  padding: ${props => props.isMobile ? '0' : '0'};
  
  /* Mobile scrollbar hiding */
  ${props => props.isMobile && `
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
    &::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }
  `}
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${Theme.colors.secondary};
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TopSection = styled.div<{ isMobile: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: ${props => props.isMobile ? '10px' : '20px'};
  padding: ${props => props.isMobile ? '0px 16px' : '0px 50px'};
  height: ${props => props.isMobile ? '50px' : 'auto'};
`;

const LogoContainer = styled.div`
  img {
    height: 30px;
  }
`;

const LanguageSwitcherContainer = styled.div`
  z-index: 10;
  
  @media (max-width: 768px) {
    margin-right: 8px;
  }
`;

const ContentContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${props => props.isMobile ? 'center' : 'start'};
  flex: 1;
  padding: 0;
  width: 100%;
  
  max-width: ${props => props.isMobile ? '90%' : '500px'};
  
  margin: 0 auto;
  
  margin-top: ${props => props.isMobile ? '0px' : '50px'};
  
  overflow-y: ${props => props.isMobile ? 'auto' : 'visible'};
  -webkit-overflow-scrolling: touch;
  
  /* Mobile scrollbar hiding */
  ${props => props.isMobile && `
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
    &::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }
  `}
`;

const SignupCard = styled.div<{ isMobile: boolean }>`
  background-color: white;
  padding: ${props => props.isMobile ? '20px' : '16px'};
  width: ${props => props.isMobile ? '100%' : '100%'};
  box-sizing: border-box;
  ${props => props.isMobile && `
    border-radius: ${Theme.borders.radius.md};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  `}
`;

const CardHeader = styled.div<{ isMobile: boolean }>`
  text-align: center;
  margin-bottom: ${props => props.isMobile ? '20px' : '16px'};
  
  h1 {
    font: ${Theme.typography.fonts.h4B};
    color: ${Theme.colors.black};
    margin-bottom: 4px;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  p {
    font: ${Theme.typography.fonts.text12};
    color: ${Theme.colors.gray2};
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
      padding: 0 10px;
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #FEE2E2;
  color: ${Theme.colors.error};
  padding: 8px 12px;
  border-radius: ${Theme.borders.radius.sm};
  margin-bottom: 16px;
  font: ${Theme.typography.fonts.text12};
`;

const GoogleButton = styled.button<{ isMobile: boolean }>`
  width: 100%;
  padding: ${props => props.isMobile ? '14px 20px' : '14px 20px'};
  background-color: white;
  color: ${Theme.colors.secondary};
  border: 1px solid ${Theme.colors.secondary};
  border-radius: ${Theme.borders.radius.extreme};
  font: ${Theme.typography.fonts.mediumB};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  
  svg {
    color: ${Theme.colors.secondary};
    font-size: 16px;
  }
  
  &:hover {
    background-color: ${Theme.colors.sixth};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  ${props => props.isMobile && `
    font-size: 15px;
    height: 48px;
  `}
`;

const Divider = styled.div<{ isMobile: boolean }>`
  display: flex;
  align-items: center;
  margin: ${props => props.isMobile ? '12px 0' : '15px 0'};
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${Theme.colors.gray};
  }
  
  span {
    padding: 0 10px;
    color: ${Theme.colors.gray2};
    font: ${Theme.typography.fonts.text12};
  }
`;

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  @media (max-width: 768px) {
    gap: 14px;
  }
`;

const SubmitButtonWrapper = styled.div<{ isMobile: boolean }>`
  margin-top: ${props => props.isMobile ? '8px' : '4px'};
`;

const PrivacyNote = styled.p<{ isMobile: boolean }>`
  font: ${Theme.typography.fonts.text12};
  color: ${Theme.colors.gray2};
  text-align: center;
  margin-top: 15px;
  padding: ${props => props.isMobile ? '0 10px 10px 10px' : '0'};
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    line-height: 1.3;
  }
`;

const LanguageNote = styled.p<{ isMobile: boolean }>`
  font: ${Theme.typography.fonts.text12};
  color: ${Theme.colors.gray2};
  text-align: center;
  margin-top: 10px;
  padding: ${props => props.isMobile ? '0 10px 10px 10px' : '0'};
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    line-height: 1.3;
  }
`;

const CompactInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  
  label {
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.black};
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
  
  input {
    width: 100%;
    padding: 14px 16px;
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.extreme};
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.primary};
    background-color: ${Theme.colors.white};
    box-sizing: border-box;
    
    &::placeholder {
      color: ${Theme.colors.tertiary};
    }
    
    &:focus {
      outline: none;
      border-color: ${Theme.colors.secondary};
    }
    
    @media (max-width: 768px) {
      padding: 12px 14px;
      font-size: 15px; /* Prevents iOS zoom on input focus */
      height: 46px;
    }
  }
  
  .password-input {
    position: relative;
    width: 100%;
    
    input {
      width: 100%;
      padding-right: 45px; /* Make room for the eye icon */
    }
    
    button {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: 5px;
      color: ${Theme.colors.gray2};
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        color: ${Theme.colors.secondary};
      }
      
      svg {
        font-size: 18px;
        
        @media (max-width: 768px) {
          font-size: 16px;
        }
      }
    }
  }
`;

const CompactPurpleButton = styled.button<{ isMobile: boolean }>`
  background-color: ${Theme.colors.secondary};
  color: ${Theme.colors.white};
  border: none;
  border-radius: ${Theme.borders.radius.extreme};
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  padding: ${props => props.isMobile ? '14px 20px' : '14px 20px'};
  font: ${Theme.typography.fonts.mediumB};
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${props => props.isMobile ? '46px' : 'auto'};

  &:hover {
    background-color: ${Theme.colors.primary};
  }
  
  &:disabled {
    background-color: ${Theme.colors.gray2};
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  
  @media (max-width: 768px) {
    padding: 20px 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    
    form {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .form-group {
        width: 100%;
        max-width: 280px;
      }
    }
  }
`;

const RadioOption = styled.label<{ selected: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  user-select: none;
  
  .radio {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid ${({ selected }) => (selected ? Theme.colors.secondary : Theme.colors.gray)};
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: ${Theme.colors.secondary};
      opacity: ${({ selected }) => (selected ? 1 : 0)};
      transition: opacity 0.2s ease;
    }
    
    @media (max-width: 768px) {
      width: 10px;
      height: 10px;
      
      .dot {
        width: 4px;
        height: 4px;
      }
    }
  }
  
  span {
    font: ${Theme.typography.fonts.text16};
    color: ${Theme.colors.black};
    
    @media (max-width: 768px) {
      font-size: 14px;
    }
  }
`;

// Update the mobile radio option component for better mobile display
const MobileRadioOption = styled.label<{ selected: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
  user-select: none;
  width: 100%;
  max-width: 280px;
  
  .radio {
    min-width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid ${({ selected }) => (selected ? Theme.colors.secondary : Theme.colors.gray)};
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: ${Theme.colors.secondary};
      opacity: ${({ selected }) => (selected ? 1 : 0)};
      transition: opacity 0.2s ease;
    }
  }
  
  span {
    font-size: 14px;
    color: ${Theme.colors.black};
  }
`;

// Update the mobile radio group component
const MobileRadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

// Update the checkbox component for mobile
const MobileCheckbox = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
  user-select: none;
  width: 100%;
  max-width: 280px;
  
  .checkbox {
    width: 14px;
    height: 14px;
    min-width: 14px;
    border: 1px solid ${Theme.colors.gray};
    border-radius: 4px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .checkmark {
      color: ${Theme.colors.secondary};
      font-size: 10px;
    }
  }
  
  span {
    font-size: 13px;
    color: ${Theme.colors.black};
  }
`;

// Update the form group for better mobile display
const FormGroup = styled.div`
  margin-bottom: 20px;
  width: 100%;
  
  label {
    display: block;
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.black};
    margin-bottom: 8px;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid ${Theme.colors.gray};
    border-radius: ${Theme.borders.radius.sm};
    font: ${Theme.typography.fonts.text16};
    color: ${Theme.colors.black};
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: ${Theme.colors.secondary};
    }
  }
  
  .error {
    color: ${Theme.colors.error};
    font-size: 14px;
    margin-top: 5px;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    input, select, textarea {
      font-size: 14px;
      padding: 10px 12px;
      max-width: 280px;
    }
    
    label {
      font-size: 14px;
      margin-bottom: 6px;
      align-self: flex-start;
      max-width: 280px;
      width: 100%;
    }
    
    .error {
      font-size: 12px;
      align-self: flex-start;
      max-width: 280px;
      width: 100%;
    }
  }
`;

// Update the radio group rendering function
const renderRadioGroup = (
  options: { value: string; label: string }[],
  selectedValue: string,
  handleChange: (value: string) => void,
  name: string
) => {
  const isMobile = window.innerWidth <= 768;
  
  return (
    <MobileRadioGroup>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        
        if (isMobile) {
          return (
            <MobileRadioOption
              key={option.value}
              selected={isSelected}
              onClick={() => handleChange(option.value)}
            >
              <div className="radio">
                {isSelected && <div className="dot" />}
              </div>
              <span>{option.label}</span>
            </MobileRadioOption>
          );
        }
        
        return (
          <RadioOption
            key={option.value}
            selected={isSelected}
            onClick={() => handleChange(option.value)}
          >
            <div className="radio">
              {isSelected && <div className="dot" />}
            </div>
            <span>{option.label}</span>
          </RadioOption>
        );
      })}
    </MobileRadioGroup>
  );
};

const PasswordInput: React.FC<{ type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; title: string }> = ({ type, placeholder, value, onChange, title }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    setShowPassword(!showPassword);
  };

  return (
    <CompactInputContainer>
      <label>{title}</label>
      <div className="password-input">
        <input
          type={showPassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button 
          type="button" 
          onClick={togglePasswordVisibility}
          tabIndex={-1} // Prevent tab focus for better accessibility
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </CompactInputContainer>
  );
};

export default AdvertiserSignupForm;
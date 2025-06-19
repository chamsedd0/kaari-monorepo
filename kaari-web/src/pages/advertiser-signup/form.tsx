import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { FaGoogle } from 'react-icons/fa';
import Logo from '../../assets/images/purpleLogo.svg';
import { getAuth, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { useStore } from '../../backend/store';
import { useToastService } from '../../services/ToastService';
import LanguageSwitcher from '../../components/skeletons/language-switcher/language-switcher';
import { startSignup } from '../../utils/advertiser-signup';

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
      
      // Redirect to the advertiser onboarding
      navigate('/become-advertiser', { replace: true });
    } catch (err: any) {
      console.error('Signup error:', err);
      
      // Handle specific error cases
      if (err.code === 'auth/email-already-in-use') {
        setError(t('advertiser_signup.errors.email_in_use'));
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
        // Check if email is verified (should be for Google accounts)
        if (!result.user.emailVerified) {
          // Send verification email if not verified
          await sendEmailVerification(result.user, {
            url: window.location.origin + '/email-verification/success',
            handleCodeInApp: true
          });
          toast.auth.verificationEmailSent();
        }
        
        // Start the signup process
        startSignup();
        
        // Redirect to advertiser onboarding
        navigate('/become-advertiser?fromAuth=true', { replace: true });
      }
    } catch (err: any) {
      console.error('Google signup error:', err);
      setError(err.message || t('advertiser_signup.errors.google_error'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SignupContainer>
      <TopSection>
        <LogoContainer>
          <img src={Logo} alt={t('common.kaari_logo')} height="32" />
        </LogoContainer>
        <LanguageSwitcherContainer>
          <LanguageSwitcher />
        </LanguageSwitcherContainer>
      </TopSection>
      
      <ContentContainer>
        <SignupCard>
          <CardHeader>
            <h1>{t('advertiser_signup.title')}</h1>
            <p>{t('advertiser_signup.subtitle')}</p>
          </CardHeader>
          
          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}
          
          <GoogleButton onClick={handleGoogleSignup} disabled={isLoading}>
            <FaGoogle />
            {t('advertiser_signup.continue_with_google')}
          </GoogleButton>
          
          <Divider>
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
            
            <CompactInput
              type="password"
              placeholder={t('advertiser_signup.password_placeholder')}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              title={t('advertiser_signup.password')}
            />
            
            <CompactInput
              type="password"
              placeholder={t('advertiser_signup.confirm_password_placeholder')}
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              title={t('advertiser_signup.confirm_password')}
            />
            
            <SubmitButtonWrapper>
              <CompactPurpleButton 
                onClick={handleEmailSignup} 
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? t('common.loading') : t('advertiser_signup.create_account')}
              </CompactPurpleButton>
            </SubmitButtonWrapper>
          </SignupForm>
          
          <PrivacyNote>
            {t('advertiser_signup.privacy_note')}
          </PrivacyNote>
        </SignupCard>
      </ContentContainer>
    </SignupContainer>
  );
};

// Styled components
const SignupContainer = styled.div`
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
  overflow-y: auto;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 20px;
  padding: 0px 50px;
`;

const LogoContainer = styled.div`
  img {
    height: 40px;
  }
`;

const LanguageSwitcherContainer = styled.div`
  z-index: 10;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  flex: 1;
  padding: 0;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  margin-top: 50px;

`;

const SignupCard = styled.div`
  background-color: white;
  padding: 16px;
  width: 100%;
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 16px;
  
  h1 {
    font: ${Theme.typography.fonts.h4B};
    color: ${Theme.colors.black};
    margin-bottom: 4px;
  }
  
  p {
    font: ${Theme.typography.fonts.text12};
    color: ${Theme.colors.gray2};
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

const GoogleButton = styled.button`
  width: 100%;
  padding: 14px 20px;
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
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
  
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
`;

const SubmitButtonWrapper = styled.div`
  margin-top: 5px;
`;

const PrivacyNote = styled.p`
  font: ${Theme.typography.fonts.text12};
  color: ${Theme.colors.gray2};
  text-align: center;
  margin-top: 15px;
`;

const CompactInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  
  label {
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.black};
  }
  
  input {
    width: 100%;
    padding: 14px 16px;
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.extreme};
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.primary};
    background-color: ${Theme.colors.white};
    
    &::placeholder {
      color: ${Theme.colors.tertiary};
    }
    
    &:focus {
      outline: none;
      border-color: ${Theme.colors.secondary};
    }
  }
`;

const CompactPurpleButton = styled.button`
  background-color: ${Theme.colors.secondary};
  color: ${Theme.colors.white};
  border: none;
  border-radius: ${Theme.borders.radius.extreme};
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  padding: 14px 20px;
  font: ${Theme.typography.fonts.mediumB};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${Theme.colors.primary};
  }
  
  &:disabled {
    background-color: ${Theme.colors.gray2};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export default AdvertiserSignupForm;
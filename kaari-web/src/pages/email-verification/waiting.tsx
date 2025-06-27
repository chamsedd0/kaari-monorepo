import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import Logo from '../../assets/images/purpleLogo.svg';
import { FaEnvelope, FaSpinner } from 'react-icons/fa';
import LanguageSwitcher from '../../components/skeletons/language-switcher/language-switcher';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useToastService } from '../../services/ToastService';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../backend/firebase/config';

const EmailVerificationWaitingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToastService();
  const [email, setEmail] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);
  
  // Extract email from location state
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      // If no email in state, try to get it from current user
      const auth = getAuth();
      if (auth.currentUser?.email) {
        setEmail(auth.currentUser.email);
      }
    }
  }, [location.state]);
  
  // Set up verification status check
  useEffect(() => {
    const auth = getAuth();
    if (!auth.currentUser) {
      navigate('/advertiser-signup/form');
      return;
    }
    
    // Mark user as in verification process in Firestore
    const markUserInVerification = async () => {
      try {
        await setDoc(doc(db, 'users', auth.currentUser!.uid), {
          signupStatus: 'awaiting_verification',
          email: auth.currentUser!.email,
          verificationExpiry: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
          createdAt: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        console.error('Error marking user in verification:', error);
      }
    };
    
    markUserInVerification();
    
    // Set up auth state listener to check for email verification
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        // User has verified their email
        setIsCheckingStatus(true);
        try {
          // Update user document to mark verification as complete
          await setDoc(doc(db, 'users', user.uid), {
            signupStatus: 'email_verified',
            emailVerified: true,
            verifiedAt: serverTimestamp()
          }, { merge: true });
          
          // Navigate to thank you page
          navigate('/become-advertiser/thank-you');
        } catch (error) {
          console.error('Error updating verification status:', error);
        } finally {
          setIsCheckingStatus(false);
        }
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [navigate]);
  
  // Set up countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      // Time expired, delete the user
      const auth = getAuth();
      if (auth.currentUser) {
        const deleteUnverifiedUser = async () => {
          try {
            // Delete the user document first
            await deleteDoc(doc(db, 'users', auth.currentUser!.uid));
            
            // Delete the user from authentication
            await auth.currentUser!.delete();
            
            // Show message and redirect
            toast.showToast('error', t('email_verification.timeout_title'), t('email_verification.timeout_message'));
            navigate('/advertiser-signup/form');
          } catch (error) {
            console.error('Error deleting unverified user:', error);
          }
        };
        
        deleteUnverifiedUser();
      }
      return;
    }
    
    // Update timer every second
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, [timeLeft, navigate, t, toast]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleResendVerification = async () => {
    const auth = getAuth();
    if (auth.currentUser) {
      try {
        await auth.currentUser.sendEmailVerification({
          url: window.location.origin + '/email-verification/success',
          handleCodeInApp: true
        });
        
        // Reset timer
        setTimeLeft(300);
        
        // Update expiry time in Firestore
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          verificationExpiry: new Date(Date.now() + 5 * 60 * 1000)
        }, { merge: true });
        
        toast.auth.verificationEmailSent();
      } catch (error) {
        console.error('Error sending verification email:', error);
        toast.showToast('error', t('email_verification.error_title'), t('email_verification.resend_error'));
      }
    } else {
      // If no user is logged in, redirect to signup
      navigate('/advertiser-signup/form');
    }
  };
  
  return (
    <VerificationContainer>
      <TopSection>
        <LogoContainer>
          <img src={Logo} alt={t('common.kaari_logo')} height="32" />
        </LogoContainer>
        <LanguageSwitcherContainer>
          <LanguageSwitcher />
        </LanguageSwitcherContainer>
      </TopSection>
      
      <ContentContainer>
        <WaitingCard>
          <EmailIcon>
            <FaEnvelope size={64} color={Theme.colors.secondary} />
          </EmailIcon>
          
          <CardHeader>
            <h1>{t('email_verification.waiting_title')}</h1>
            <p>{t('email_verification.waiting_message', { email })}</p>
          </CardHeader>
          
          <TimerContainer>
            <TimerLabel>{t('email_verification.time_remaining')}:</TimerLabel>
            <TimerValue>{formatTime(timeLeft)}</TimerValue>
          </TimerContainer>
          
          <ButtonsContainer>
            {isCheckingStatus ? (
              <CheckingStatus>
                <FaSpinner className="spinner" size={24} />
                {t('email_verification.checking_status')}
              </CheckingStatus>
            ) : (
              <>
                <PrimaryButton onClick={handleResendVerification}>
                  {t('email_verification.resend_button')}
                </PrimaryButton>
              </>
            )}
          </ButtonsContainer>
        </WaitingCard>
      </ContentContainer>
    </VerificationContainer>
  );
};

// Styled components
const VerificationContainer = styled.div`
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
  justify-content: center;
  flex: 1;
  padding: 0 20px 20px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  margin-top: 50px;
`;

const WaitingCard = styled.div`
  background-color: white;
  padding: 32px;
  width: 100%;
  border-radius: ${Theme.borders.radius.lg};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EmailIcon = styled.div`
  margin-bottom: 24px;
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
  
  h1 {
    font: ${Theme.typography.fonts.h4B};
    color: ${Theme.colors.black};
    margin-bottom: 12px;
  }
  
  p {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};
    line-height: 1.5;
  }
`;

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background-color: ${Theme.colors.sixth};
  border-radius: ${Theme.borders.radius.md};
  width: 100%;
`;

const TimerLabel = styled.div`
  font: ${Theme.typography.fonts.smallM};
  color: ${Theme.colors.gray2};
  margin-bottom: 8px;
`;

const TimerValue = styled.div`
  font: ${Theme.typography.fonts.h4B};
  color: ${Theme.colors.secondary};
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const PrimaryButton = styled.button`
  background-color: ${Theme.colors.secondary};
  color: ${Theme.colors.white};
  border: none;
  border-radius: ${Theme.borders.radius.extreme};
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  padding: 14px 16px;
  font: ${Theme.typography.fonts.mediumB};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${Theme.colors.primary};
  }
`;

const SecondaryButton = styled.button`
  background-color: transparent;
  color: ${Theme.colors.secondary};
  border: 1px solid ${Theme.colors.secondary};
  border-radius: ${Theme.borders.radius.extreme};
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  padding: 14px 16px;
  font: ${Theme.typography.fonts.mediumB};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${Theme.colors.sixth};
  }
`;

const CheckingStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.gray2};
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default EmailVerificationWaitingPage; 
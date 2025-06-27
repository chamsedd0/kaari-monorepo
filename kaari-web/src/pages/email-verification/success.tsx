import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import Logo from '../../assets/images/purpleLogo.svg';
import { FaCheckCircle } from 'react-icons/fa';
import LanguageSwitcher from '../../components/skeletons/language-switcher/language-switcher';
import { getAuth } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../backend/firebase/config';

const EmailVerificationSuccessPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Update user status in Firestore
  useEffect(() => {
    const updateUserStatus = async () => {
      const auth = getAuth();
      if (auth.currentUser) {
        try {
          // Update user document to mark verification as complete
          await setDoc(doc(db, 'users', auth.currentUser.uid), {
            signupStatus: 'email_verified',
            emailVerified: true,
            verifiedAt: serverTimestamp()
          }, { merge: true });
        } catch (error) {
          console.error('Error updating verification status:', error);
        }
      }
    };
    
    updateUserStatus();
  }, []);
  
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
        <SuccessCard>
          <SuccessIcon>
            <FaCheckCircle size={64} color={Theme.colors.success} />
          </SuccessIcon>
          
          <CardHeader>
            <h1>{t('email_verification.success_title')}</h1>
            <p>{t('email_verification.success_message')}</p>
          </CardHeader>
          
          <ButtonsContainer>
            <PrimaryButton onClick={() => navigate('/become-advertiser')}>
              {t('email_verification.continue_button')}
            </PrimaryButton>
          </ButtonsContainer>
        </SuccessCard>
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

const SuccessCard = styled.div`
  background-color: white;
  padding: 32px;
  width: 100%;
  border-radius: ${Theme.borders.radius.lg};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SuccessIcon = styled.div`
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

export default EmailVerificationSuccessPage; 
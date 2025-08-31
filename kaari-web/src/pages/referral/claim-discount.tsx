import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getReferralCode } from '../../utils/referral-utils';
import { useReferralSignup } from '../../hooks/useReferralSignup';
import MainLayout from '../../layouts/MainLayout';
import { getAuth, signOut } from 'firebase/auth';
import twoGuysSvg from '../../components/skeletons/icons/2-guys.svg';

const ClaimDiscountPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { 
    referralCode, 
    discount, 
    claimDiscount, 
    error: referralError 
  } = useReferralSignup();

  useEffect(() => {
    // Function to handle initialization
    const initPage = async () => {
      setIsLoading(true);
      
      // Sign out any existing user before the page loads
      const auth = getAuth();
      if (auth.currentUser) {
        try {
          await signOut(auth);
          console.log("User signed out successfully");
        } catch (error) {
          console.error("Error signing out:", error);
        }
      }

      // Extract referral code from URL
      const code = getReferralCode(window.location.href);
      
      if (!code) {
        // If no code in URL, redirect to home
        navigate('/');
        return;
      }
      
      setIsLoading(false);
    };
    
    initPage();
  }, [navigate]);

  const handleClaimDiscount = () => {
    // Mark as claimed and navigate to signup page with referral code
    setIsClaimed(true);
    
    // Navigate to the signup page with the referral code
    setTimeout(() => {
      navigate(`/referral/signup?ref=${referralCode}`);
    }, 1500);
  };

  const handleBrowseProperties = () => {
    // Redirect to property list page
    navigate('/properties');
  };

  if (isLoading || !referralCode) {
    return (
      <MainLayout>
        <Container>
          <LoadingText>{t('referral.claim.loading', 'Loading...')}</LoadingText>
        </Container>
      </MainLayout>
    );
  }

  if (referralError) {
    return (
      <MainLayout>
        <Container>
          <ContentWrapper>
            <ErrorMessage>{referralError}</ErrorMessage>
            <PrimaryButton onClick={() => navigate('/')}>
              {t('referral.claim.goHome', 'Go to Homepage')}
            </PrimaryButton>
          </ContentWrapper>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container>
        <ContentWrapper>
          <LeftContent>
            <Title>
              {isClaimed 
                ? t('referral.claim.successTitle', 'Discount Successfully Claimed!')
                : "You've got"}
            </Title>
            
            {!isClaimed && (
              <DiscountAmount>
                200 MAD OFF
              </DiscountAmount>
            )}
            
            <SubTitle>
              {isClaimed 
                ? null
                : t('referral.claim.subtitle', 'your next booking on Kaari!')}
            </SubTitle>
            

              <ImportantTitle>
                {t('referral.claim.importantTitle', 'Important!')}
              </ImportantTitle>
              <ImportantText>
                {t('referral.claim.validityText', 'Your discount is valid for 7 days.')}
                <br />
                {t('referral.claim.claimNow', 'Claim it now and use it on any property.')}
              </ImportantText>
           
            
            {!isClaimed ? (
              <ButtonsContainer>
                <PrimaryButton onClick={handleClaimDiscount}>
                  {t('referral.claim.claimButton', 'Claim my Discount')}
                </PrimaryButton>
              </ButtonsContainer>
            ) : (
              <ButtonsContainer>
                <PrimaryButton onClick={() => navigate(`/referral/signup?ref=${referralCode}`)}>
                  {t('referral.claim.createAccountButton', 'Create Account')}
                </PrimaryButton>

              </ButtonsContainer>
            )}
          </LeftContent>
          <RightContent>
            <img src={twoGuysSvg} alt="Referral Illustration" />
          </RightContent>
        </ContentWrapper>
      </Container>
    </MainLayout>
  );
};

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 12px 16px;
  margin-top: 0;
  background: linear-gradient(135deg, rgba(67, 13, 174, 1) 0%, rgba(159, 50, 225, 1) 50%, rgba(225, 155, 50, 1) 100%);
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 1100px;
  background: transparent;
  border-radius: ${Theme.borders.radius.lg};
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const LeftContent = styled.div`
  padding: 24px 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
  color: white;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 32px;
  }
`;

const RightContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 12px;
  
  img {
    max-width: 100%;
    max-height: 485px;
    filter: brightness(1.1) contrast(1.1);
  }
`;

const Title = styled.h1`
  font: ${Theme.typography.fonts.extraLargeM};
  color: white;
  

`;

const DiscountAmount = styled.h1`
  font: ${Theme.typography.fonts.h1};
  color: white;

  

`;

const SubTitle = styled.h2`
  font: ${Theme.typography.fonts.h3};
  color: white;
  margin: 0 0 40px 0;
  

`;



const ImportantTitle = styled.h3`
  font: ${Theme.typography.fonts.h4DB};
  margin: 0 0 8px 0;
  color: white;

`;

const ImportantText = styled.p`
  font: ${Theme.typography.fonts.smallM};
  margin: 0 0 4px 0;
  line-height: 1.4;
  color: white;
 
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 160px;
`;

const PrimaryButton = styled.button`
  background-color: rgba(225, 155, 50, 1);
  color: white;
  border: none;
  border-radius: ${Theme.borders.radius.extreme};
  padding: 16px 19px;
  font: ${Theme.typography.fonts.text14};
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-top: 20px;
 

  &:hover {
    background-color: rgba(225, 155, 50, 0.9);
    transform: translateY(-2px);
  }
`;


const LoadingText = styled.p`
  font: ${Theme.typography.fonts.largeM};
  color: white;
  text-align: center;
`;

const ErrorMessage = styled.p`
  font: ${Theme.typography.fonts.largeM};
  color: #ff6b6b;
  text-align: center;
  margin-bottom: 24px;
`;

export default ClaimDiscountPage; 
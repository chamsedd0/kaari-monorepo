import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getReferralCode } from '../../utils/referral-utils';
import { useReferralSignup } from '../../hooks/useReferralSignup';
import MainLayout from '../../layouts/MainLayout';

const ClaimDiscountPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const { 
    referralCode, 
    discount, 
    claimDiscount, 
    error: referralError 
  } = useReferralSignup();

  useEffect(() => {
    // Extract referral code from URL
    const code = getReferralCode(window.location.href);
    
    if (!code) {
      // If no code in URL, redirect to home
      navigate('/');
    }
  }, [navigate]);

  const handleClaimDiscount = () => {
    // Mark as claimed and navigate to login/signup
    setIsClaimed(true);
    
    // Use the hook's claim function
    setTimeout(() => {
      claimDiscount();
    }, 1500);
  };

  const handleBrowseProperties = () => {
    // Redirect to property list page
    navigate('/properties');
  };

  if (!referralCode) {
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
          <ContentBox>
            <LeftContent>
              <Title>
                {isClaimed 
                  ? t('referral.claim.successTitle', 'Discount Successfully Claimed!')
                  : t('referral.claim.title', 'You\'ve got 200 MAD OFF')}
              </Title>
              
              <SubTitle>
                {isClaimed 
                  ? null
                  : t('referral.claim.subtitle', 'your next booking on Kaari!')}
              </SubTitle>
              
              <ImportantSection>
                <ImportantTitle>
                  {t('referral.claim.importantTitle', 'Important!')}
                </ImportantTitle>
                <ImportantText>
                  {t('referral.claim.validityText', 'Your discount is valid for 7 days.')}
                  <br />
                  {t('referral.claim.claimNow', 'Claim it now and use it on any property.')}
                </ImportantText>
              </ImportantSection>
              
              {!isClaimed ? (
                <ButtonsContainer>
                  <PrimaryButton onClick={handleClaimDiscount}>
                    {t('referral.claim.claimButton', 'Claim my Discount')}
                  </PrimaryButton>
                  <SecondaryButton onClick={handleBrowseProperties}>
                    {t('referral.claim.browseButton', 'Browse Properties')}
                  </SecondaryButton>
                </ButtonsContainer>
              ) : (
                <ButtonsContainer>
                  <PrimaryButton onClick={() => navigate(`/signup?ref=${referralCode}`)}>
                    {t('referral.claim.createAccountButton', 'Create Account')}
                  </PrimaryButton>
                  <SecondaryButton onClick={handleBrowseProperties}>
                    {t('referral.claim.browseButton', 'Browse Properties')}
                  </SecondaryButton>
                </ButtonsContainer>
              )}
            </LeftContent>
            <RightContent>
              <img src="/public/referral-illustration.svg" alt="Referral Illustration" />
            </RightContent>
          </ContentBox>
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
  min-height: calc(100vh - 80px);
  padding: 20px;
  margin-top: 80px;
  background: linear-gradient(135deg, ${Theme.colors.primary} 0%, ${Theme.colors.secondary} 100%);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  width: 100%;
  margin: 40px 0;
`;

const ContentBox = styled.div`
  display: flex;
  width: 100%;
  background-color: white;
  border-radius: ${Theme.borders.radius.large};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const LeftContent = styled.div`
  padding: 48px;
  display: flex;
  flex-direction: column;
  flex: 1;
  
  @media (max-width: 768px) {
    padding: 32px;
  }
`;

const RightContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, ${Theme.colors.primary} 0%, ${Theme.colors.secondary} 100%);
  flex: 1;
  padding: 20px;
  
  img {
    max-width: 100%;
    max-height: 400px;
  }
`;

const Title = styled.h1`
  font: ${Theme.typography.fonts.boldL};
  font-size: 48px;
  color: ${Theme.colors.black};
  margin: 0 0 8px 0;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const SubTitle = styled.h2`
  font: ${Theme.typography.fonts.regularL};
  font-size: 32px;
  color: ${Theme.colors.black};
  margin: 0 0 32px 0;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Description = styled.p`
  font: ${Theme.typography.fonts.regularM};
  color: ${Theme.colors.darkGray};
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const ImportantSection = styled.div`
  background: linear-gradient(90deg, ${Theme.colors.primary}20 0%, ${Theme.colors.secondary}20 100%);
  border-radius: ${Theme.borders.radius.medium};
  padding: 24px;
  color: ${Theme.colors.black};
  width: 100%;
  margin-bottom: 32px;
  margin-top: auto;
`;

const ImportantTitle = styled.h3`
  font: ${Theme.typography.fonts.boldM};
  margin: 0 0 8px 0;
`;

const ImportantText = styled.p`
  font: ${Theme.typography.fonts.regularM};
  margin: 0;
  line-height: 1.5;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const PrimaryButton = styled.button`
  background-color: ${Theme.colors.secondary};
  color: white;
  border: none;
  border-radius: ${Theme.borders.radius.medium};
  padding: 16px;
  font: ${Theme.typography.fonts.boldM};
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background-color: ${Theme.colors.primary};
  }
`;

const SecondaryButton = styled.button`
  background-color: transparent;
  color: ${Theme.colors.secondary};
  border: 1px solid ${Theme.colors.secondary};
  border-radius: ${Theme.borders.radius.medium};
  padding: 16px;
  font: ${Theme.typography.fonts.boldM};
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background-color: ${Theme.colors.secondary}10;
  }
`;

const LoadingText = styled.p`
  font: ${Theme.typography.fonts.regularL};
  color: white;
  text-align: center;
`;

const ErrorMessage = styled.p`
  font: ${Theme.typography.fonts.regularL};
  color: ${Theme.colors.error};
  text-align: center;
  margin-bottom: 24px;
`;

export default ClaimDiscountPage; 
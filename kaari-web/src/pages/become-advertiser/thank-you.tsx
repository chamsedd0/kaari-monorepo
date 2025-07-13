import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCheckCircle, FaPhone, FaCalendarAlt, FaEnvelope, FaCamera } from 'react-icons/fa';
import { Theme } from '../../theme/theme';
import { completeSignup, hideHeadersAndFooters } from '../../utils/advertiser-signup';
import { getAuth } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../backend/firebase/config';
import { useTranslation } from 'react-i18next';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ThankYouContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, ${Theme.colors.primary} 0%, ${Theme.colors.secondary} 100%);
  padding: 4vh 5vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.5s ease-in-out;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 40px 15px;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }
`;

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  pointer-events: none;
  z-index: 1;
`;

const CircleDecoration1 = styled.div`
  position: absolute;
  top: -10vh;
  right: -10vw;
  width: 40vw;
  max-width: 400px;
  height: 40vw;
  max-height: 400px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  z-index: 1;
  display: none;
  
  @media (min-width: 769px) {
    display: block;
  }
`;

const CircleDecoration2 = styled.div`
  position: absolute;
  bottom: -15vh;
  left: -15vw;
  width: 50vw;
  max-width: 500px;
  height: 50vw;
  max-height: 500px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  z-index: 1;
  display: none;
  
  @media (min-width: 769px) {
    display: block;
  }
`;

const ThankYouCard = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: ${Theme.borders.radius.md};
  padding: 40px;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 769px) {
    padding: min(4vh, 40px) min(5vw, 40px);
    width: 90%;
    max-width: min(80vw, 580px);
  }
  
  @media (max-width: 768px) {
    padding: 30px 15px;
    width: 100%;
    box-sizing: border-box;
  }
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${Theme.borders.radius.round};
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  
  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
  
  @media (min-width: 769px) {
    width: min(10vw, 90px);
    height: min(10vw, 90px);
    
    svg {
      width: min(5vw, 45px);
      height: min(5vw, 45px);
    }
  }
  
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    margin-bottom: 15px;
    
    svg {
      width: 35px;
      height: 35px;
    }
  }
`;

const Title = styled.h1`
  font: ${Theme.typography.fonts.h3};
  color: white;
  margin-bottom: 15px;
  background: linear-gradient(to right, #ffffff, #e0e0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.2);
  
  @media (min-width: 769px) {
    font-size: min(3.2vw, 32px);
    font-weight: 700;
    font-family: 'Visby CF';
    margin-bottom: min(2vh, 20px);
  }
  
  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 12px;
  }
`;

const Message = styled.p`
  font: ${Theme.typography.fonts.text16};
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
  max-width: 500px;
  
  @media (min-width: 769px) {
    font-size: min(1.8vw, 16px);
    font-weight: 500;
    font-family: 'Visby CF';
    line-height: 1.6;
    max-width: min(60vw, 500px);
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 25px;
    padding: 0 10px;
  }
`;

const Divider = styled.div`
  width: 80%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 30px 0;
  
  @media (min-width: 769px) {
    width: 60%;
    margin: min(4vh, 40px) 0;
  }
`;

const LaunchInfo = styled.div`
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: ${Theme.borders.radius.md};
  padding: 20px;
  width: 100%;
  max-width: 500px;
  margin-top: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (min-width: 769px) {
    padding: min(3vh, 25px) min(3vw, 25px);
    width: 90%;
    max-width: min(70vw, 500px);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  }
`;

const LaunchTitle = styled.h2`
  font: ${Theme.typography.fonts.h5};
  color: white;
  margin-bottom: 10px;
  
  @media (min-width: 769px) {
    font-size: min(2.4vw, 24px);
    font-weight: 600;
    font-family: 'Visby CF';
    margin-bottom: min(1.5vh, 15px);
  }
`;

const LaunchDate = styled.div`
  font: ${Theme.typography.fonts.mediumB};
  color: white;
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 769px) {
    font-size: min(1.6vw, 16px);
    font-weight: 700;
    font-family: 'Visby CF';
    background-color: rgba(255, 255, 255, 0.1);
    padding: min(1vh, 10px) min(2vw, 18px);
    border-radius: ${Theme.borders.radius.extreme};
    margin: min(2vh, 20px) 0 min(1vh, 10px);
    
    svg {
      margin-right: 10px;
      font-size: min(1.8vw, 18px);
    }
  }
`;

const ContactSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 30px;
  
  @media (min-width: 769px) {
    flex-direction: row;
    justify-content: center;
    gap: min(2vw, 20px);
    margin-top: min(4vh, 40px);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: ${Theme.borders.radius.extreme};
  
  svg {
    color: white;
    margin-right: 10px;
  }
  
  span {
    color: white;
    font: ${Theme.typography.fonts.mediumB};
  }
  
  @media (min-width: 769px) {
    margin-top: 0;
    padding: min(1.5vh, 15px) min(2.5vw, 25px);
    
    span {
      font-size: min(1.6vw, 16px);
      font-weight: 700;
      font-family: 'Visby CF';
    }
    
    svg {
      font-size: min(1.8vw, 18px);
    }
  }
`;

const EmailContact = styled(ContactInfo)`
  @media (max-width: 768px) {
    margin-top: 15px;
  }
`;

const ThankYouPage: React.FC = () => {
  const { t } = useTranslation();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Hide headers and footers
    const cleanupHeadersFooters = hideHeadersAndFooters();
    
    // Mark signup as completed to clean up any remaining data
    completeSignup();
    
    // Update user status in Firestore
    const updateUserStatus = async () => {
      const auth = getAuth();
      if (auth.currentUser) {
        try {
          // Update user document to mark signup as completed
          await setDoc(doc(db, 'users', auth.currentUser.uid), {
            signupStatus: 'completed',
            completedAt: serverTimestamp()
          }, { merge: true });
        } catch (error) {
          console.error('Error updating signup completion status:', error);
        }
      }
    };
    
    updateUserStatus();
    
    // Add event listener for beforeunload to ensure cleanup
    const handleBeforeUnload = () => {
      completeSignup();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup function
    return () => {
      cleanupHeadersFooters();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  return (
    <ThankYouContainer>
      <GradientOverlay />
      <CircleDecoration1 />
      <CircleDecoration2 />
      <ThankYouCard>
        <SuccessIcon>
          <FaCheckCircle />
        </SuccessIcon>
        <Title>{t('advertiser_thank_you.title')}</Title>
        <Message>
          {t('advertiser_thank_you.main_message')}
        </Message>
        
        <ContactSection>
          <ContactInfo>
            <FaPhone />
            <span>+212 688-888888</span>
          </ContactInfo>
          
          <EmailContact>
            <FaEnvelope />
            <span>support@kaari.com</span>
          </EmailContact>
        </ContactSection>
        
        <Divider />
        
        <LaunchInfo>
          <LaunchTitle>
            <FaCamera style={{ marginRight: '10px' }} />
            {t('advertiser_thank_you.dont_forget_us')}
          </LaunchTitle>
          <Message>
            {t('advertiser_thank_you.photoshoot_message')}
          </Message>
          <Message style={{ fontStyle: 'italic', marginTop: '10px' }}>
            {t('advertiser_thank_you.notification_message')}
          </Message>
        </LaunchInfo>
      </ThankYouCard>
    </ThankYouContainer>
  );
};

export default ThankYouPage;
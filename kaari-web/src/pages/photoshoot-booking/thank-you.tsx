import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import UnifiedHeader from '../../components/skeletons/constructed/headers/unified-header';
import Footer from '../../components/skeletons/constructed/footer/footer';
import { PurpleButtonLB60 } from '../../components/skeletons/buttons/purple_LB60';
import { BpurpleButtonLB60 } from '../../components/skeletons/buttons/border_purple_LB60';
import GenerativeObjectSvg from '../../components/skeletons/icons/Generative-Object.svg';
import LeftCelebrationSvg from '../../components/skeletons/icons/left-celebration.svg';
import RightCelebrationSvg from '../../components/skeletons/icons/right-celebration.svg';
// Create custom button component instead of extending PurpleButtonMB48


const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { bookingId?: string } || {};
  
  // Extract booking ID from state or query params
  const bookingId = state?.bookingId || new URLSearchParams(location.search).get('bookingId') || '';
  
  const handleDownloadSummary = () => {
    // In a real implementation, this would generate and download a PDF
    console.log('Downloading booking summary for ID:', bookingId);
    alert('Summary download functionality would be implemented here');
  };
  
  const handleGoToDashboard = () => {
    navigate('/dashboard/advertiser/dashboard');
  };
  
  return (
    <>
      <UnifiedHeader variant="white" userType="advertiser" showSearchBar={true} />
      <ThankYouPageStyle>
        <div className="celebration-confetti left">
          <img src={LeftCelebrationSvg} alt="Left celebration" />
        </div>
        <div className="celebration-confetti right">
          <img src={RightCelebrationSvg} alt="Right celebration" />
        </div>
        
        <div className="content-container">
          <div className="photographer-illustration">
            <img src={GenerativeObjectSvg} alt="Generative object illustration" />
          </div>
          
          <h1 className="main-title">Thank you for Booking a Photoshoot!</h1>
          
          <div className="message-container">
            <p className="main-message">
              Your photoshoot is scheduled. We will contact you soon to confirm the details. To 
              check more details, please, log into your account.
            </p>
            
            <div className="divider"></div>
            
            <div className="next-steps">
              <h2>What to expect next:</h2>
              <p>Our team will review your booking and get in touch with you within 24 hours.</p>
            </div>
            
            <div className="preparation">
              <h2>Prepare the property:</h2>
              <p>Declutter and clean all rooms. Arrange furniture to showcase the space effectively.</p>
            </div>
          </div>
          
          <div className="action-buttons">
            <BpurpleButtonLB60 text="Download Summary" onClick={handleDownloadSummary} />
            
            <PurpleButtonLB60 text="Go to Dashboard" onClick={handleGoToDashboard} />
          </div>
        </div>
      </ThankYouPageStyle>
      
    </>
  );
};

const ThankYouPageStyle = styled.div`
  position: relative;
  padding: 100px 20px 80px;
  margin-top: 60px;
  min-height: calc(100vh - 300px);
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 80px 16px 60px;
    margin-top: 40px;
  }
  
  .celebration-confetti {
    position: absolute;
    top: 0;
    width: 25%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    &.left {
      left: 0;
    }
    
    &.right {
      right: 0;
    }
    
    @media (max-width: 768px) {
      width: 20%;
      opacity: 0.7;
    }
  }
  
  .content-container {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    
    @media (max-width: 768px) {
      max-width: 100%;
      padding: 0 10px;
    }
  }
  
  .photographer-illustration {
    width: 180px;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    
    img {
      width: 100%;
      height: auto;
    }
    
    @media (max-width: 768px) {
      width: 140px;
      height: 140px;
      margin-bottom: 16px;
    }
  }
  
  .main-title {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
    margin-bottom: 12px;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
      line-height: 1.3;
      margin-bottom: 10px;
    }
  }
  
  .message-container {
    margin-bottom: 24px;
    
    @media (max-width: 768px) {
      margin-bottom: 16px;
    }
  }
  
  .main-message {
    font: ${Theme.typography.fonts.text14};
    color: ${Theme.colors.gray2};
    max-width: 600px;
    margin: 0 auto 20px;
    line-height: 1.6;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
      line-height: 1.4;
      max-width: 100%;
      margin-bottom: 16px;
    }
  }
  
  .divider {
    width: 100%;
    height: 1px;
    background-color: ${Theme.colors.quaternary};
    margin: 24px 0;
    
    @media (max-width: 768px) {
      margin: 16px 0;
    }
  }
  
  .next-steps, .preparation {
    margin-bottom: 12px;
    
    h2 {
      font: ${Theme.typography.fonts.largeB};
      color: ${Theme.colors.black};
      margin-bottom: 24px;
      
      @media (max-width: 768px) {
        font-size: 1.1rem;
        margin-bottom: 12px;
      }
    }
    
    p {
      font: ${Theme.typography.fonts.text14};
      color: ${Theme.colors.gray2};
      
      @media (max-width: 768px) {
        font-size: 0.9rem;
        line-height: 1.4;
      }
    }
    
    @media (max-width: 768px) {
      margin-bottom: 16px;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 24px;
    margin-bottom: 160px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 16px;
      margin-top: 20px;
      margin-bottom: 80px;
      padding: 0 20px;
      
      button {
        width: 100%;
      }
    }
  }
`;

export default ThankYouPage; 
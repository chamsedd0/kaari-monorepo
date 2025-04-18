import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import UnifiedHeader from '../../components/skeletons/constructed/headers/unified-header';
import Footer from '../../components/skeletons/constructed/footer/footer';
import { FaCamera } from 'react-icons/fa';

// Create custom button component instead of extending PurpleButtonMB48
const StyledButton = styled.button`
  font: ${Theme.typography.fonts.mediumB};
  padding: 12px 32px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 180px;
`;

const DownloadButton = styled(StyledButton)`
  background-color: transparent;
  color: ${Theme.colors.primary};
  border: 2px solid ${Theme.colors.primary};
  
  &:hover {
    background-color: ${Theme.colors.primary}10;
  }
`;

const DashboardButton = styled(StyledButton)`
  background-color: ${Theme.colors.primary};
  color: white;
  border: none;
  
  &:hover {
    background-color: ${Theme.colors.primary}DD;
    transform: translateY(-2px);
  }
`;

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
    navigate('/dashboard');
  };
  
  return (
    <>
      <UnifiedHeader variant="white" userType="advertiser" showSearchBar={true} />
      
      <ThankYouPageStyle>
        <div className="celebration-confetti top-left"></div>
        <div className="celebration-confetti top-right"></div>
        <div className="celebration-confetti bottom-left"></div>
        <div className="celebration-confetti bottom-right"></div>
        
        <div className="content-container">
          <div className="photographer-illustration">
            <FaCamera size={40} />
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
            <DownloadButton onClick={handleDownloadSummary}>
              Download Summary
            </DownloadButton>
            
            <DashboardButton onClick={handleGoToDashboard}>
              Go to Dashboard
            </DashboardButton>
          </div>
        </div>
      </ThankYouPageStyle>
      
      <Footer />
    </>
  );
};

const ThankYouPageStyle = styled.div`
  position: relative;
  padding: 100px 20px 80px;
  min-height: calc(100vh - 300px);
  overflow: hidden;
  
  .celebration-confetti {
    position: absolute;
    width: 200px;
    height: 200px;
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0.7;
    z-index: -1;
    
    &.top-left {
      top: 0;
      left: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath d='M20,40 Q40,20 60,30' stroke='%239B51E0' stroke-width='5' fill='none'/%3E%3Cpath d='M30,80 Q60,60 70,90' stroke='%2347BDFF' stroke-width='5' fill='none'/%3E%3Crect x='40' y='30' width='15' height='15' fill='%23FFC700' transform='rotate(25)'/%3E%3Crect x='70' y='50' width='10' height='10' fill='%239B51E0' transform='rotate(45)'/%3E%3C/svg%3E");
    }
    
    &.top-right {
      top: 0;
      right: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath d='M140,30 Q160,50 180,40' stroke='%239B51E0' stroke-width='5' fill='none'/%3E%3Cpath d='M130,60 Q150,80 170,70' stroke='%2347BDFF' stroke-width='5' fill='none'/%3E%3Crect x='160' y='30' width='15' height='15' fill='%23FFC700' transform='rotate(-25)'/%3E%3Crect x='140' y='70' width='10' height='10' fill='%239B51E0' transform='rotate(-45)'/%3E%3C/svg%3E");
    }
    
    &.bottom-left {
      bottom: 0;
      left: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath d='M30,140 Q50,160 40,180' stroke='%239B51E0' stroke-width='5' fill='none'/%3E%3Cpath d='M60,130 Q80,150 70,170' stroke='%2347BDFF' stroke-width='5' fill='none'/%3E%3Crect x='30' y='160' width='15' height='15' fill='%23FFC700' transform='rotate(-25)'/%3E%3Crect x='70' y='140' width='10' height='10' fill='%239B51E0' transform='rotate(-45)'/%3E%3C/svg%3E");
    }
    
    &.bottom-right {
      bottom: 0;
      right: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath d='M140,160 Q160,140 180,150' stroke='%239B51E0' stroke-width='5' fill='none'/%3E%3Cpath d='M130,130 Q150,110 170,120' stroke='%2347BDFF' stroke-width='5' fill='none'/%3E%3Crect x='150' y='140' width='15' height='15' fill='%23FFC700' transform='rotate(25)'/%3E%3Crect x='130' y='120' width='10' height='10' fill='%239B51E0' transform='rotate(45)'/%3E%3C/svg%3E");
    }
  }
  
  .content-container {
    max-width: 800px;
    margin: 0 auto;
    background-color: ${Theme.colors.white};
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 40px;
    text-align: center;
  }
  
  .photographer-illustration {
    width: 120px;
    height: 120px;
    background-color: ${Theme.colors.primary}15;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    
    svg {
      color: ${Theme.colors.primary};
    }
  }
  
  .main-title {
    font: ${Theme.typography.fonts.h2};
    color: ${Theme.colors.black};
    margin-bottom: 24px;
  }
  
  .message-container {
    margin-bottom: 40px;
  }
  
  .main-message {
    font: ${Theme.typography.fonts.text16};
    color: ${Theme.colors.gray2};
    max-width: 600px;
    margin: 0 auto 20px;
    line-height: 1.6;
  }
  
  .divider {
    width: 100%;
    height: 1px;
    background-color: ${Theme.colors.gray}40;
    margin: 24px 0;
  }
  
  .next-steps, .preparation {
    text-align: left;
    margin-bottom: 16px;
    
    h2 {
      font: ${Theme.typography.fonts.mediumB};
      color: ${Theme.colors.black};
      margin-bottom: 8px;
    }
    
    p {
      font: ${Theme.typography.fonts.text16};
      color: ${Theme.colors.gray2};
      line-height: 1.5;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 40px;
    
    @media (max-width: 600px) {
      flex-direction: column;
      align-items: center;
    }
  }
`;

export default ThankYouPage; 
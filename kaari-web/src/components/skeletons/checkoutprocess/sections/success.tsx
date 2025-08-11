import React from 'react';
import { PurpleButtonMB48 } from '../../buttons/purple_MB48';
import { SuccessMessage } from '../../../styles/checkoutprocess/checkout-process-sections-style';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { useNavigate } from 'react-router-dom';
import ConfirmationStatusCard from '../../cards/confiramtion-status-card';
import ApplicationTrackingCardComponent from '../../cards/application-trackig-card';
import applicationtrackingIcon from '../../icons/Icon_ApplicationTracking.svg';
import emailnotificationIcon from '../../icons/Icon_EmailTracking.svg';
import alertviaappIcon from '../../icons/Icon_PhoneTracking.svg';
import SuccessCardComponent from '../../cards/success-card';
import ContactAdvisorCard from '../../cards/contact-advisor-card';
import advisorImage from '../../../../assets/images/HeroImage.png';
import DeadlineTooSoonCard from '../../cards/deadline-too-soon-card';
import { BedroomIcon, BathroomIcon, FurnitureIcon, KitchenIcon } from '../../../../components/icons/RoomIcons';
import RejectedCard from '../../cards/rejected-card';
import PaymentFailedCard from '../../cards/payment-failed-card';
import Mastercard from '../../cards/mastercard';
import { PurpleButtonLB60 } from '../../buttons/purple_LB60';
import { RefundCard } from '../../cards/refund-card';
interface SuccessProps {
  onDone: () => void;
  status: 'success' | 'pending' | 'rejected' | 'payment_failed' | 'refund_processing';
}

const SuggestionsList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 94px;
  align-items: center;
  width: 100%;
  margin-top: 24px;
`;  

const ButtonContainer = styled.div`
  max-width: 188px;
`;

const InfoPanel = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const InfoPanel2 = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

const RoomsList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
  width: 100%;
`

const RoomCard = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 16px 27px;
  border: 1px solid ${Theme.colors.gray};
  border-radius: ${Theme.borders.radius.md};
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: white;
  
  
  .text-container {
    display: flex;
    flex-direction: column;
    gap: 6px;
    
    .room-name {
      font: ${Theme.typography.fonts.largeB};
      color: ${Theme.colors.black};
    }

    .room-description {
      font: ${Theme.typography.fonts.smallM};
      color: ${Theme.colors.gray2};
    }
  }
`

const ExtraLargeText = styled.div`
  font: ${Theme.typography.fonts.extraLargeB};
  color: ${Theme.colors.black};
`;

const LargeBText = styled.div`
  font: ${Theme.typography.fonts.largeB};
  color: ${Theme.colors.black};
`;

const ThoughtfulGestureCard = styled.div`
  padding: 24px 34px;
  background: ${Theme.colors.white};
  border-radius: ${Theme.borders.radius.md};
  border: ${Theme.borders.primary};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 40px;

  .card-title {
    font: ${Theme.typography.fonts.largeB};
    color: ${Theme.colors.black};
    display: inline;
    margin-right: 5px;
  }

  p {
    font: ${Theme.typography.fonts.text16};
    color: ${Theme.colors.black};
    margin: 0;
  }

  strong {
    font: ${Theme.typography.fonts.link16};
    color: ${Theme.colors.black};
    text-decoration: underline;
    transition: all 0.3s ease;
    cursor: pointer;


    &:hover {
            color: ${Theme.colors.primary};
        }
  }
`;

const Success: React.FC<SuccessProps> = ({ onDone, status = 'success' }) => {
  const navigate = useNavigate();
  
  const handleDone = () => {
    onDone();
    // Navigate to the user dashboard
    navigate('/dashboard/user');
  };
  
  const handleFindOtherHousing = () => {
    // Navigate to the property list page
    navigate('/properties');
  };
  
  const handleContactSupport = () => {
    // Navigate to the support page or open a support modal
    window.location.href = 'mailto:customercare@kaari.com';
  };
  
  const handleTryAgain = () => {
    // Go back to the payment method step
    // This would typically be handled by the parent component's state
    onDone();
    // Redirect to payment method step
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('step', '2');
    navigate(`/checkout-process?${urlParams.toString()}`);
  };
  
  const handleConfirm = () => {
    // Simulate a booking confirmation
    onDone();
    // Navigate to the success status
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('status', 'success');
    navigate(`/checkout-process?${urlParams.toString()}`);
  };
  
  const handleCancel = () => {
    // Navigate to the property page or dashboard
    navigate('/dashboard/user');
  };

  // Helper function to render content based on status
  const renderStatusContent = () => {
    switch (status) {
      case 'success':
        return (
          <>
           <SuccessCardComponent time="23:59:59" />

            <InfoPanel2>
            <ContactAdvisorCard advisorName="John Doe" advisorImage={advisorImage} />
            <DeadlineTooSoonCard />

            </InfoPanel2>
            
            <InfoPanel2>
              
                <RoomsList>
                  <RoomCard>
                    <BedroomIcon color={Theme.colors.secondary} />
                    <div className="text-container">
                      <span className="room-name">Bedroom</span>
                      <span className="room-description">10 m²</span>
                    </div>
                  </RoomCard>
                  <RoomCard>
                    <KitchenIcon color={Theme.colors.secondary} />
                    <div className="text-container">
                      <span className="room-name">Kitchen</span>
                      <span className="room-description">10 m²</span>
                    </div>
                  </RoomCard>
                  <RoomCard>
                    <FurnitureIcon color={Theme.colors.secondary} />
                    <div className="text-container">
                      <span className="room-name">Living Room</span>
                      <span className="room-description">10 m²</span>
                    </div>
                  </RoomCard>
                  <RoomCard>
                    <BathroomIcon color={Theme.colors.secondary} />
                    <div className="text-container">
                      <span className="room-name">Bathroom</span>
                      <span className="room-description">10 m²</span>
                    </div>
                  </RoomCard>
                </RoomsList>
              
            </InfoPanel2>
          </>
        );
        
      case 'pending':
        return (
          <>
            
              <ConfirmationStatusCard />
            <ExtraLargeText>
              Track Your Application Status
            </ExtraLargeText>

            <InfoPanel>
              <ApplicationTrackingCardComponent 
              title="Application Tracking" 
              description="Access your profile to monitor the progress of your request in real-time. The landlord has 24 hours to approve your reservation request. " 
              imageSrc={applicationtrackingIcon} />
              
              <ApplicationTrackingCardComponent 
              title="Email Notifications" 
              description="You will receive an email to keep you informed of the current status of your request, allowing you to stay updated at each step. " 
              imageSrc={emailnotificationIcon} />
              
              <ApplicationTrackingCardComponent 
              title="Alerts via the App" 
              description="If you have our app, instant notifications will be sent to you as soon as the status of your request is updated, ensuring uninterrupted tracking." 
              imageSrc={alertviaappIcon} />
            </InfoPanel>
          </>
        );
        
      case 'rejected':
        return (
          <>
           
           <RejectedCard />
           
           <ThoughtfulGestureCard>
              <p><span className="card-title">A Thoughtful Gesture from Kaari's Customer Care Team:</span> Contact our support team <strong>promptly</strong> to check property availability even after the 24-hour period. If the property is still available, you can avoid losing the payment you've made (50% of the tenant fee).</p>
           </ThoughtfulGestureCard>
           <ExtraLargeText>
           Some other Suggestions for you:  
           </ExtraLargeText>
           <SuggestionsList>
            
           </SuggestionsList>
          </>
        );
        
      case 'payment_failed':
        return (
          <>
            <PaymentFailedCard />
            <LargeBText>Your Payment Methods</LargeBText>
            <Mastercard title="Mastercard" cardNumber="1234 5678 9012 3456" expirationDate="01/24" />
            <ButtonContainer>
              <PurpleButtonLB60 text="Try Again" />
            </ButtonContainer>
          </>
        );
        
      case 'refund_processing':
        return (
          <>
            <RefundCard 
              title="Example Property"
              image=""
              moveInDate="2025-01-01"
              lengthOfStay="12 months"
              profileImage=""
              profileName="Advertiser"
              originalAmount="10000 MAD"
              serviceFee="500 MAD"
              cancellationFee="300 MAD"
              refundTotal="9200 MAD"
              daysToMoveIn={10}
            />
            <ExtraLargeText>
           Some other Suggestions for you:  
           </ExtraLargeText>
           <SuggestionsList>
            
           </SuggestionsList>
           
          </>
        );
        
      default:
        return (
          <SuccessMessage className="success-message">
            <div className="success-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="38" stroke="#6B46C1" strokeWidth="4"/>
                <path d="M24 40L36 52L56 28" stroke="#6B46C1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h3>Your booking has been confirmed!</h3>
            
            <p>Thank you for choosing Kaari for your accommodation needs. Your booking details have been sent to your email.</p>
            
            <div className="booking-details">
              <div className="detail-item">
                <span className="label">Booking Reference:</span>
                <span className="value">KA-123456</span>
              </div>
              <div className="detail-item">
                <span className="label">Move-in Date:</span>
                <span className="value">2023-01-01</span>
              </div>
              <div className="detail-item">
                <span className="label">Property:</span>
                <span className="value">Luxury Apartment</span>
              </div>
            </div>
            
            <div className="next-steps">
              <h4>Next Steps</h4>
              <ul>
                <li>Check your email for booking confirmation</li>
                <li>Download your booking receipt</li>
                <li>Contact the property manager to arrange key collection</li>
              </ul>
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <PurpleButtonMB48 text="Go to Dashboard" onClick={handleDone} />
            </div>
          </SuccessMessage>
        );
    }
  };

  return (
    <div className="checkout-process-form">
      {renderStatusContent()}
    </div>
  );
};

export default Success; 
import React from 'react';
import { PurpleButtonMB48 } from '../../buttons/purple_MB48';
import { SuccessMessage } from '../../../styles/checkoutprocess/checkout-process-sections-style';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { useNavigate } from 'react-router-dom';

interface SuccessProps {
  onDone: () => void;
  status: 'success' | 'pending' | 'rejected' | 'payment_failed' | 'refund_processing';
}

const StatusContainer = styled.div`
  width: 100%;
  padding: 32px;
  border-radius: ${Theme.borders.radius.lg};
  margin-bottom: 24px;
  
  &.success {
    background: linear-gradient(120deg, #7928CA, #35478C);
  }
  
  &.pending {
    background: linear-gradient(120deg, ${Theme.colors.secondary}, #8B5CF6);
  }
  
  &.rejected {
    background: linear-gradient(120deg, #CF1754, #7928CA);
  }
  
  &.payment-failed {
    background: linear-gradient(120deg, #CF1754, #8B5CF6);
  }
  
  &.refund-processing {
    background: linear-gradient(120deg, #8B5CF6, #4C1D95);
  }
  
  .status-title {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.white};
    margin-bottom: 16px;
  }
  
  .status-description {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.white};
    margin-bottom: 16px;
    opacity: 0.9;
  }
  
  .timer {
    font: ${Theme.typography.fonts.h1};
    color: ${Theme.colors.white};
    text-align: center;
    margin: 24px 0;
  }
  
  .status-action {
    margin-top: 16px;
  }
`;

const ActionButton = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  color: ${Theme.colors.white};
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: ${Theme.borders.radius.lg};
  padding: 12px 24px;
  font: ${Theme.typography.fonts.mediumB};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const InfoPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 32px;
  
  .info-item {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    
    .info-icon {
      width: 48px;
      height: 48px;
      color: ${Theme.colors.secondary};
      flex-shrink: 0;
    }
    
    .info-content {
      h4 {
        font: ${Theme.typography.fonts.largeB};
        color: ${Theme.colors.black};
        margin-bottom: 8px;
      }
      
      p {
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
      }
    }
  }
`;

const CardInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid ${Theme.colors.gray};
  border-radius: ${Theme.borders.radius.lg};
  margin-top: 16px;
  
  .card-logo {
    width: 48px;
    height: 32px;
    margin-right: 16px;
  }
  
  .card-details {
    flex: 1;
    
    .card-number {
      font: ${Theme.typography.fonts.mediumB};
      color: ${Theme.colors.black};
    }
    
    .expiry {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.gray2};
    }
  }
  
  .card-actions {
    button {
      background: none;
      border: none;
      font-size: 20px;
      color: ${Theme.colors.gray2};
      cursor: pointer;
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
            <StatusContainer className="success">
              <div className="status-content">
                <h2 className="status-title">Congratulations, the place is Yours!</h2>
                <p className="status-description">You have 24 hours to confirm your reservation. Confirmation will result in your payment being processed. You can also cancel your reservation.</p>
                <div className="status-action">
                  <ActionButton onClick={handleConfirm}>Confirm</ActionButton>
                </div>
              </div>
            </StatusContainer>

            <InfoPanel>
              <div className="info-item">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 9H9C7.89543 9 7 9.89543 7 11V17C7 18.1046 7.89543 19 9 19H19C20.1046 19 21 18.1046 21 17V11C21 9.89543 20.1046 9 19 9Z" />
                    <path d="M19 5H9C7.89543 5 7 5.89543 7 7H21C21 5.89543 20.1046 5 19 5Z" />
                    <path d="M5 9C5 7.89543 4.10457 7 3 7V17C4.10457 17 5 16.1046 5 15V9Z" />
                  </svg>
                </div>
                <div className="info-content">
                  <h4>Contact Your Advertiser</h4>
                  <p>Contacting the advertiser will be considered as confirmation of your reservation. The payment will be processed after your confirmation.</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                    <path d="M12 8V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="info-content">
                  <h4>Deadline is too Soon?</h4>
                  <p>To extend the 24-hour deadline, please email Kaari's Customer Care at customercare@kaari.com or call at 05XXXXX. Customer care is available daily from 9 AM to 8 PM, excluding holidays.</p>
                </div>
              </div>
            </InfoPanel>
          </>
        );
        
      case 'pending':
        return (
          <>
            <StatusContainer className="pending">
              <div className="status-content">
                <h2 className="status-title">Your Reservation Request has been sent!</h2>
                <p className="status-description">We will keep you updated on your request. Make sure to check emails regularly.</p>
                <div className="status-action">
                  <ActionButton onClick={handleCancel}>Cancel without charge</ActionButton>
                </div>
              </div>
            </StatusContainer>

            <InfoPanel>
              <div className="info-item">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 6V11H18V7.75L22 12L18 16.25V13H13V18H16.25L12 22L7.75 18H11V13H6V16.25L2 12L6 7.75V11H11V6H7.75L12 2L16.25 6H13Z" />
                  </svg>
                </div>
                <div className="info-content">
                  <h4>Application Tracking</h4>
                  <p>Access your profile to monitor the progress of your request in real-time. The landlord has 24 hours to approve your reservation request.</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" />
                    <path d="M22 6L12 13L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="info-content">
                  <h4>Email Notifications</h4>
                  <p>You will receive an email to keep you informed of the current status of your request, allowing you to stay updated at each step.</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V4C20 2.89543 19.1046 2 18 2Z" />
                    <path d="M12 18H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="info-content">
                  <h4>Alerts via the App</h4>
                  <p>If you have our app, instant notifications will be sent to you as soon as the status of your request is updated, ensuring uninterrupted tracking.</p>
                </div>
              </div>
            </InfoPanel>
          </>
        );
        
      case 'rejected':
        return (
          <>
            <StatusContainer className="rejected">
              <div className="status-content">
                <h2 className="status-title">Your Request has been rejected</h2>
                <p className="status-description">We hate to inform you that your reservation request (ID 208297) for the offer Apartment in Agadir has been rejected by the advertiser. We are truly sorry for that.</p>
                <div className="status-action">
                  <ActionButton onClick={handleFindOtherHousing}>Find other housing</ActionButton>
                </div>
              </div>
            </StatusContainer>

            <InfoPanel>
              <div className="info-item">
                <div className="info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                    <path d="M15 9L9 15M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="info-content">
                  <h4>A Thoughtful Gesture from Kaari's Customer Care Team</h4>
                  <p>Contact our support team promptly to check property availability even after the 24-hour period. If the property is still available, you can avoid losing the payment you've made (50% of the tenant fee).</p>
                </div>
              </div>
            </InfoPanel>
          </>
        );
        
      case 'payment_failed':
        return (
          <>
            <StatusContainer className="payment-failed">
              <div className="status-content">
                <h2 className="status-title">Your payment has failed</h2>
                <p className="status-description">It seems that the payment has failed for the following reason(s):</p>
                <div className="status-reason">
                  <p>Your receipt was not valid.</p>
                  <p>Please resubmit the receipt so we can continue the process.</p>
                </div>
              </div>
            </StatusContainer>

            <h3 style={{ marginBottom: '16px', font: Theme.typography.fonts.largeB }}>Your Payment Methods</h3>
            
            <CardInfo>
              <div className="card-logo">
                <img src="/mastercard-logo.svg" alt="Mastercard" />
              </div>
              <div className="card-details">
                <div className="card-number">Master Card • 1234</div>
                <div className="expiry">Expiration: 04/30</div>
              </div>
              <div className="card-actions">
                <button>•••</button>
              </div>
            </CardInfo>
            
            <div style={{ marginTop: '24px' }}>
              <PurpleButtonMB48 text="Try Again" onClick={handleTryAgain} />
            </div>
          </>
        );
        
      case 'refund_processing':
        return (
          <>
            <StatusContainer className="refund-processing">
              <div className="status-content">
                <h2 className="status-title">The refund is being processed</h2>
                <p className="status-description">You'll receive the refund within 7 business days. We apologize once again for any inconvenience caused. If you have any issues related to your refund, please contact us at customercare@kaari.ma or give us a call at 05XXXXXXX.</p>
                <div className="status-action">
                  <ActionButton onClick={handleContactSupport}>Contact Support</ActionButton>
                </div>
              </div>
            </StatusContainer>

            <div style={{ marginTop: '32px' }}>
              <h3 style={{ marginBottom: '24px', font: Theme.typography.fonts.largeB }}>Some other Suggestions for you:</h3>
              {/* Property suggestions would go here */}
              <p style={{ color: Theme.colors.gray2 }}>Similar property listings would be displayed here</p>
            </div>
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
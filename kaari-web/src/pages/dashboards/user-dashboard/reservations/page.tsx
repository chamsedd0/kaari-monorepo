import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { getClientReservations, cancelReservation, completeReservation, requestRefund } from '../../../../backend/server-actions/ClientServerActions';
import { processPayment } from '../../../../backend/server-actions/CheckoutServerActions';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import { BpurpleButtonMB48 } from '../../../../components/skeletons/buttons/border_purple_MB48';
import { CardBaseModelStyleLatestRequest } from '../../../../components/styles/cards/card-base-model-style-latest-request';
import ProgressBanner from '../../../../components/skeletons/banners/status/banner-base-model-progress';
import { useNavigate } from 'react-router-dom';
import emptyBoxSvg from '../../../../assets/images/emptybox.svg';

const ReservationsContainer = styled.div`
  padding: 2rem;
  
  h1 {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
    margin-bottom: 1.5rem;
  }
  
  .filter-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    
    .filter-tabs {
    display: flex;
    gap: 1rem;
    
      .filter-tab {
      padding: 0.5rem 1rem;
      font: ${Theme.typography.fonts.smallB};
      color: ${Theme.colors.gray2};
        border-radius: ${Theme.borders.radius.sm};
      cursor: pointer;
      transition: all 0.3s ease;
        
        &:hover {
          background-color: ${Theme.colors.tertiary};
        }
      
      &.active {
        background-color: ${Theme.colors.secondary};
        color: white;
      }
      }
    }
  }
  
  .latest-requests {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
    
    > div {
      flex: 1;
      min-height: 330px;
      max-width: calc(50% - 0.75rem);
      
      @media (max-width: 768px) {
        max-width: 100%;
      }
    }
    }
    
  .no-reservations {
    text-align: center;
    padding: 3rem;
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};
  }
  
  .other-reservations {
    background-color: white;
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    overflow: hidden;
    margin-top: 2rem;
  }
    
  .table-header {
    border-bottom: 1px solid ${Theme.colors.gray2};
    padding: 1.5rem;
    
    h2 {
      font: ${Theme.typography.fonts.h4B};
      color: ${Theme.colors.black};
      margin: 0;
    }
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th {
      text-align: left;
      padding: 1rem 1.5rem;
          font: ${Theme.typography.fonts.smallB};
      color: ${Theme.colors.gray2};
      background-color: white;
      border-bottom: 1px solid ${Theme.colors.gray2};
    }
    
    td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid ${Theme.colors.gray2};
      font: ${Theme.typography.fonts.smallM};
      color: ${Theme.colors.black};
    }
          
    tr:last-child td {
      border-bottom: none;
    }
    
    .status {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 16px;
      font: ${Theme.typography.fonts.smallB};
      text-align: center;
      min-width: 90px;
      
      &.pending {
        background-color: #E3F8FF;
        color: #0299CC;
      }
        
      &.approved {
        background-color: #E6F5F0;
        color: #0CA86B;
      }
          
      &.declined {
        background-color: #FDECEC;
        color: #D02C2C;
      }
      
      &.completed {
        background-color: #EEE6FD;
        color: ${Theme.colors.secondary};
      }
    }
      
      .action-button {
      padding: 0.5rem 0.75rem;
        border-radius: ${Theme.borders.radius.sm};
        font: ${Theme.typography.fonts.smallB};
        cursor: pointer;
          background-color: white;
          color: ${Theme.colors.secondary};
          border: 1px solid ${Theme.colors.secondary};
      transition: all 0.3s ease;
          
          &:hover {
        background-color: ${Theme.colors.secondary};
        color: white;
      }
    }
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    
    .modal-content {
      background-color: white;
      border-radius: ${Theme.borders.radius.md};
      padding: 2rem;
      width: 90%;
      max-width: 500px;
      
      .modal-title {
        font: ${Theme.typography.fonts.h4B};
        color: ${Theme.colors.black};
        margin-bottom: 1rem;
      }
      
      .modal-message {
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
        margin-bottom: 1.5rem;
      }
      
      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        
        .modal-button {
          padding: 0.75rem 1.5rem;
          border-radius: ${Theme.borders.radius.sm};
          font: ${Theme.typography.fonts.smallB};
          cursor: pointer;
          transition: all 0.3s ease;
          
          &.cancel {
            background-color: white;
            color: ${Theme.colors.gray2};
            border: 1px solid ${Theme.colors.gray};
            
            &:hover {
              background-color: ${Theme.colors.tertiary};
            }
          }
          
          &.confirm {
            background-color: ${Theme.colors.error};
            color: white;
            border: none;
            
            &:hover {
              background-color: #c0392b;
            }
            
            &:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }
          }
          
          &.pay {
            background-color: ${Theme.colors.success};
            color: white;
            border: none;
            
            &:hover {
              background-color: ${Theme.colors.success};
            }
            
            &:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }
`;

const EmptyLatestRequests = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: ${Theme.borders.radius.lg};
  padding: 3rem;
  width: 100%;
  min-height: 330px;
      border: ${Theme.borders.primary};

  
  img {
    width: 100px;
    height: 100px;
    margin-bottom: 1.5rem;
  }
  
  h3 {
    font: ${Theme.typography.fonts.h4B};
    color: ${Theme.colors.black};
    margin-bottom: 0.5rem;
  }
  
  p {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};
    text-align: center;
    max-width: 400px;
  }
`;

interface Reservation {
  reservation: {
    id: string;
    requestType: string;
    status: 'pending' | 'accepted' | 'rejected' | 'paid' | 'movedIn' | 'cancelled' | 'refundProcessing' | 'refundCompleted' | 'refundFailed' | 'cancellationUnderReview';
    createdAt: Date;
    updatedAt: Date;
    scheduledDate?: Date;
    message: string;
    propertyId?: string;
    movedIn?: boolean;
    movedInAt?: Date | FirestoreTimestamp | string;
  };
  listing?: {
    id: string;
    title: string;
    price: number;
  } | null;
  property?: {
    id: string;
    title: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    price: number;
    images: string[];
  } | null;
  advertiser?: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  } | null;
}

// Define FirestoreTimestamp interface for better type safety
interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

// CustomReservationCard props interface
interface CustomReservationCardProps {
  title: string;
  details: string;
  status: "Approved" | "Declined" | "Pending" | "Paid" | "MovedIn" | string;
  timer: boolean;
  date: string;
  price: string;
  image: string;
  reservationId: string;
  onCancel: (id: string) => void;
  onConfirmPayment: (id: string) => void;
  updatedAt: Date | FirestoreTimestamp | string;
  scheduledDate?: Date | FirestoreTimestamp | string;
  moveInDisabled?: boolean;
  onMoveIn?: (id: string) => void;
  movedInAt?: Date | FirestoreTimestamp | string;
  onRequestRefund?: (id: string) => void;
}

const CustomReservationCard: React.FC<CustomReservationCardProps> = ({ 
  title, 
  details, 
  status, 
  timer, 
  date, 
  price, 
  image,
  reservationId,
  onCancel,
  onConfirmPayment,
  updatedAt,
  scheduledDate,
  moveInDisabled = true,
  onMoveIn,
  movedInAt,
  onRequestRefund
}) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    // Navigate to property details page
    navigate(`/dashboard/user/reservation-status?id=${reservationId}&status=${status.toLowerCase()}`);
  };
  
  // Get the appropriate button text based on status
  const getButtonText = () => {
    switch (status) {
      case 'Pending':
        return 'Cancel Reservation';
      case 'Approved':
        return 'Confirm Payment';
      case 'Paid':
        // Show "Cancel Reservation" if move-in date hasn't arrived, otherwise "I Moved In"
        return isMoveInDateReached() ? 'I Moved In' : 'Cancel Reservation';
      case 'MovedIn':
        return 'Request Refund';
      case 'Refund Processing':
        return 'Processing...';
      case 'Refund Completed':
        return 'Completed';
      case 'Refund Failed':
        return 'No Refund Available';
      case 'Cancellation Under Review':
        return 'Under Review';
      case 'Cancelled':
        return 'Remove from Latest';
      case 'Declined':
      default:
        return 'View';
    }
  };
  
  // Determine if button should be disabled
  const isButtonDisabled = () => {
    switch (status) {
      case 'Paid':
        // Only disable the "I Moved In" button if move-in date hasn't arrived
        return isMoveInDateReached() ? moveInDisabled : false;
      case 'MovedIn':
        return !canRequestRefund;
      case 'Refund Processing':
      case 'Refund Completed':
      case 'Refund Failed':
      case 'Cancellation Under Review':
      case 'Cancelled':
        return true;
      default:
        return false;
    }
  };
  
  // Check if the move-in date has arrived
  const isMoveInDateReached = () => {
    if (!scheduledDate) return false;
    
    try {
      let moveInDate: Date;
      
      if (scheduledDate instanceof Date) {
        moveInDate = scheduledDate;
      } 
      else if (typeof scheduledDate === 'object' && 'seconds' in scheduledDate) {
        const firestoreTimestamp = scheduledDate as FirestoreTimestamp;
        moveInDate = new Date(firestoreTimestamp.seconds * 1000);
      }
      else {
        moveInDate = new Date(scheduledDate as string);
      }
      
      const now = new Date();
      return moveInDate.getTime() <= now.getTime();
    } catch (error) {
      console.error('Error checking move-in date:', error, scheduledDate);
      return false;
    }
  };
  
  // Handle button click based on status
  const handleButtonClick = () => {
    switch (status) {
      case 'Pending':
        onCancel(reservationId);
        break;
      case 'Approved':
        onConfirmPayment(reservationId);
        break;
      case 'Paid':
        if (isMoveInDateReached() && !moveInDisabled) {
          // If move-in date has arrived, show the "I Moved In" button
          if (onMoveIn) {
            onMoveIn(reservationId);
          }
        } else {
          // If move-in date hasn't arrived, navigate to cancellation request page
          navigate(`/dashboard/user/cancellation-request?reservationId=${reservationId}`);
        }
        break;
      case 'MovedIn':
        if (onRequestRefund && canRequestRefund) {
          onRequestRefund(reservationId);
        } else {
          handleViewDetails();
        }
        break;
      case 'Cancelled':
        // TODO: Implement remove from latest functionality
        handleViewDetails();
        break;
      default:
        handleViewDetails();
    }
  };
  
  // Custom styled container for the timer/date info
  const CustomTimerContainer = styled.div`
    .timer {
      min-width: 300px !important;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.4); 
      backdrop-filter: blur(10px);
      border-radius: ${Theme.borders.radius.lg};
      padding: 16px 0px !important;
    }

    .move-in-date {
      min-width: 300px !important;
      height: 72px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(10px);
      border-radius: ${Theme.borders.radius.lg};
      padding: 16px 0px !important;

      .label {
        font: ${Theme.typography.fonts.smallB};
        color: white;
        margin-bottom: 4px;
      }

      .date {
        font: ${Theme.typography.fonts.h4B};
        color: white;
      }
    }
    
    .refund-timer {
      min-width: 300px !important;
      height: 72px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(10px);
      border-radius: ${Theme.borders.radius.lg};
      padding: 16px 0px !important;

      .label {
        font: ${Theme.typography.fonts.smallB};
        color: white;
        margin-bottom: 4px;
      }

      .countdown {
        font: ${Theme.typography.fonts.h4B};
        color: white;
      }
    }
    
    .processing-spinner {
      min-width: 300px !important;
      height: 72px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(10px);
      border-radius: ${Theme.borders.radius.lg};
      padding: 16px 0px !important;

      .label {
        font: ${Theme.typography.fonts.smallB};
        color: white;
        margin-bottom: 8px;
      }

      .spinner {
        animation: spin 1.5s linear infinite;
        font-size: 24px;
        color: white;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    }
    
    .result-container {
      min-width: 300px !important;
      height: 72px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(10px);
      border-radius: ${Theme.borders.radius.lg};
      padding: 16px 0px !important;

      .label {
        font: ${Theme.typography.fonts.smallB};
        color: white;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .message {
        font: ${Theme.typography.fonts.mediumM};
        color: white;
        margin-top: 4px;
        text-align: center;
      }
      
      .success-icon {
        color: #4CAF50;
      }
      
      .error-icon {
        color: #F44336;
      }
    }
  `;
  
  // Format move-in date
  const formatMoveInDate = (date: Date | FirestoreTimestamp | string | undefined) => {
    if (!date) return "Not set";
    
    try {
      let dateObj: Date;
      
      if (date instanceof Date) {
        dateObj = date;
      } 
      else if (typeof date === 'object' && 'seconds' in date) {
        const firestoreTimestamp = date as FirestoreTimestamp;
        dateObj = new Date(firestoreTimestamp.seconds * 1000);
      }
      else {
        dateObj = new Date(date as string);
      }
      
      if (isNaN(dateObj.getTime())) {
        return "Invalid Date";
      }
      
      return dateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting move-in date:', error, date);
      return "Invalid Date";
    }
  };
  
  // Check if refund is still available
  const [canRequestRefund, setCanRequestRefund] = useState<boolean>(false);
  const [refundTimeLeft, setRefundTimeLeft] = useState<string>("");
  
  useEffect(() => {
    if (status !== 'MovedIn') {
      return;
    }
    
    // If status is MovedIn but no movedInAt, use a fallback timestamp
    if (!movedInAt) {
      setRefundTimeLeft("24:00:00");
      setCanRequestRefund(true);
      return;
    }
    
    const checkRefundEligibility = () => {
      try {
        let moveInDate: Date;
        
        if (movedInAt instanceof Date) {
          moveInDate = movedInAt;
        } 
        else if (typeof movedInAt === 'object' && 'seconds' in movedInAt) {
          const firestoreTimestamp = movedInAt as FirestoreTimestamp;
          moveInDate = new Date(firestoreTimestamp.seconds * 1000);
        }
        else {
          moveInDate = new Date(movedInAt as string);
        }
        
        const now = new Date();
        // Add 24 hours to the move-in timestamp for the refund deadline
        const deadlineMs = moveInDate.getTime() + 24 * 60 * 60 * 1000;
        const diffMs = deadlineMs - now.getTime();
        
        // If time is up, refund is no longer available
        if (diffMs <= 0) {
          setCanRequestRefund(false);
          setRefundTimeLeft("Refund period has ended");
          return;
        }
        
        setCanRequestRefund(true);
        
        // Format remaining time
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        setRefundTimeLeft(formattedTime);
      } catch (error) {
        console.error('Error checking refund eligibility:', error);
        setCanRequestRefund(false);
      }
    };
    
    // Initial check
    checkRefundEligibility();
    
    // Set up interval to update every second
    const timer = setInterval(checkRefundEligibility, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(timer);
  }, [movedInAt, status]);

  // Render the appropriate timer/info container based on status
  const renderTimerContainer = () => {
    switch (status) {
      case 'Approved':
        return (
          <CustomTimerContainer>
            <div className="timer">
              <CountdownTimer updatedAt={updatedAt} />
            </div>
          </CustomTimerContainer>
        );
      case 'Paid':
        return (
          <CustomTimerContainer>
            <div className="move-in-date">
              <div className="label">Move-in Date</div>
              <div className="date">{formatMoveInDate(scheduledDate)}</div>
            </div>
          </CustomTimerContainer>
        );
      case 'MovedIn':
        return (
          <CustomTimerContainer>
            <div className="refund-timer">
              <div className="label">Refund Available For</div>
              <div className="countdown">
                {movedInAt ? refundTimeLeft : "24:00:00"}
              </div>
            </div>
          </CustomTimerContainer>
        );
      case 'Refund Processing':
      case 'Cancellation Under Review':
        return (
          <CustomTimerContainer>
            <div className="processing-spinner">
              <div className="label">
                {status === 'Refund Processing' ? 'Refund Being Processed' : 'Cancellation Under Review'}
              </div>
              <div className="spinner">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" fill="currentColor"/>
                  <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
          </CustomTimerContainer>
        );
      case 'Refund Completed':
        return (
          <CustomTimerContainer>
            <div className="result-container">
              <div className="label">
                <span className="success-icon">✓</span> Refund Successful
              </div>
              <div className="message">Your refund has been processed</div>
            </div>
          </CustomTimerContainer>
        );
      case 'Refund Failed':
        return (
          <CustomTimerContainer>
            <div className="result-container">
              <div className="label">
                <span className="error-icon">✗</span> Refund Failed
              </div>
              <div className="message">Please contact support</div>
            </div>
          </CustomTimerContainer>
        );
      case 'Cancelled':
        return (
          <CustomTimerContainer>
            <div className="result-container">
              <div className="label">
                <span className="success-icon">✓</span> Cancelled
              </div>
              <div className="message">Your reservation has been cancelled successfully</div>
            </div>
          </CustomTimerContainer>
        );
      default:
        return null;
    }
  };
  
  // Check if the card should display a timer/info container
  const shouldShowTimer = () => {
    return status === 'Approved' || status === 'Paid' || status === 'MovedIn' || 
      status === 'Refund Processing' || status === 'Refund Completed' || 
      status === 'Refund Failed' || status === 'Cancellation Under Review' || 
      status === 'Cancelled';
  };
  
  return (
    <CardBaseModelStyleLatestRequest timer={shouldShowTimer()}>
      <div className="timer-container">
        <img src={image} alt=""/>
        <div className="upper-banner">
          <div className="title-banner">Latest Request</div>
          <div className="status-banner">
            <ProgressBanner 
              status={
                status === 'Refund Processing' || status === 'Cancellation Under Review' 
                  ? 'Pending'
                  : status === 'Refund Completed' || status === 'MovedIn' || status === 'Paid'
                    ? 'Approved'
                    : status === 'Refund Failed' || status === 'Cancelled' || status === 'Declined'
                      ? 'Declined' 
                      : (status as 'Pending' | 'Approved' | 'Declined' | 'Paid')
              } 
              text={status}
            />
          </div>
        </div>
        <div className="main-content">
          {renderTimerContainer()}
          <div className="text-content">
            <div className="title" style={{ maxWidth: '65%' }}>
              <b>{title}</b>
              <span style={{
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}>{details}</span>
            </div>
            <div className="info">
              <div className="date">{date}</div>
              <div className="price">{price}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="control-container">
        <BpurpleButtonMB48 
          text="Details" 
          onClick={handleViewDetails}
          icon={
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.64815 5.92592C8.64815 5.63292 8.73504 5.34649 8.89783 5.10286C9.06061 4.85923 9.29199 4.66934 9.56269 4.55721C9.8334 4.44508 10.1313 4.41575 10.4187 4.47291C10.706 4.53007 10.97 4.67117 11.1772 4.87836C11.3844 5.08555 11.5255 5.34952 11.5826 5.6369C11.6398 5.92428 11.6105 6.22216 11.4983 6.49286C11.3862 6.76357 11.1963 6.99494 10.9527 7.15773C10.7091 7.32052 10.4226 7.40741 10.1296 7.40741C9.73672 7.40741 9.3599 7.25132 9.08207 6.97349C8.80424 6.69566 8.64815 6.31884 8.64815 5.92592ZM20.5 10C20.5 11.9778 19.9135 13.9112 18.8147 15.5557C17.7159 17.2002 16.1541 18.4819 14.3268 19.2388C12.4996 19.9957 10.4889 20.1937 8.5491 19.8078C6.60929 19.422 4.82746 18.4696 3.42894 17.0711C2.03041 15.6725 1.078 13.8907 0.692152 11.9509C0.3063 10.0111 0.504333 8.00043 1.26121 6.17316C2.01809 4.3459 3.29981 2.78412 4.9443 1.6853C6.58879 0.58649 8.52219 0 10.5 0C13.1513 0.00294095 15.6931 1.05745 17.5678 2.93218C19.4425 4.80691 20.4971 7.34874 20.5 10ZM18.2778 10C18.2778 8.4617 17.8216 6.95795 16.967 5.6789C16.1124 4.39985 14.8976 3.40295 13.4764 2.81427C12.0552 2.22559 10.4914 2.07156 8.98263 2.37167C7.47389 2.67178 6.08803 3.41254 5.00028 4.50028C3.91254 5.58802 3.17178 6.97389 2.87167 8.48263C2.57157 9.99137 2.72559 11.5552 3.31427 12.9764C3.90296 14.3976 4.89985 15.6123 6.1789 16.467C7.45795 17.3216 8.9617 17.7778 10.5 17.7778C12.5621 17.7756 14.5391 16.9554 15.9973 15.4973C17.4554 14.0391 18.2756 12.0621 18.2778 10ZM11.6111 13.3963V10.3704C11.6111 9.87923 11.416 9.4082 11.0687 9.06091C10.7214 8.71362 10.2504 8.51852 9.75926 8.51852C9.49686 8.51813 9.24279 8.61061 9.04205 8.7796C8.84131 8.94858 8.70685 9.18316 8.66249 9.44178C8.61813 9.70041 8.66673 9.96638 8.79968 10.1926C8.93264 10.4188 9.14136 10.5907 9.38889 10.6778V13.7037C9.38889 14.1948 9.584 14.6659 9.93129 15.0132C10.2786 15.3604 10.7496 15.5556 11.2407 15.5556C11.5031 15.5559 11.7572 15.4635 11.958 15.2945C12.1587 15.1255 12.2932 14.8909 12.3375 14.6323C12.3819 14.3737 12.3333 14.1077 12.2003 13.8815C12.0674 13.6552 11.8586 13.4834 11.6111 13.3963Z" fill="currentColor"/>
            </svg>
          } 
        />
        <PurpleButtonMB48 
          text={getButtonText()}
          disabled={isButtonDisabled()}
          onClick={handleButtonClick}
        />
      </div>
    </CardBaseModelStyleLatestRequest>
  );
};

// Create a custom countdown timer component
interface CountdownTimerProps {
  updatedAt: Date | FirestoreTimestamp | string;
}

const CountdownTimer = ({ updatedAt }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState('23:59:59');
  
  useEffect(() => {
    // Function to calculate and format time left
    const calculateTimeLeft = () => {
      if (!updatedAt) return '23:59:59';
      
      try {
        let updated: Date;
        
        // Convert the timestamp to a Date object
        if (updatedAt instanceof Date) {
          updated = updatedAt;
        } 
        else if (typeof updatedAt === 'object' && 'seconds' in updatedAt) {
          const firestoreTimestamp = updatedAt as FirestoreTimestamp;
          updated = new Date(firestoreTimestamp.seconds * 1000);
        }
        else {
          updated = new Date(updatedAt as string);
        }
        
        if (isNaN(updated.getTime())) {
          return '23:59:59';
        }
        
        const now = new Date();
        const deadline = new Date(updated.getTime() + 24 * 60 * 60 * 1000);
        const diffMs = deadline.getTime() - now.getTime();
        
        if (diffMs <= 0) return '00:00:00';
        
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } catch (error) {
        console.error('Error formatting timer display:', error, updatedAt);
        return '23:59:59';
      }
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Set up interval to update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(timer);
  }, [updatedAt]);
  
  return (
    <div style={{ 
      font: 'normal 900 58px Visby CF', 
      color: 'white',
      padding: '16px' 
    }}>
      {timeLeft}
    </div>
  );
};

const ReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [cancellingReservation, setCancellingReservation] = useState(false);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [processingMoveIn, setProcessingMoveIn] = useState<string | null>(null);
  const [processingRefund, setProcessingRefund] = useState<string | null>(null);
    
    useEffect(() => {
    loadReservations();
  }, []);
  
        const loadReservations = async () => {
    try {
            setLoading(true);
                const data = await getClientReservations();
                setReservations(data);
    } catch (err: any) {
                console.error('Error loading reservations:', err);
      setError(err.message || 'Failed to load reservations');
            } finally {
                setLoading(false);
            }
        };
        
  const handleConfirmPayment = async () => {
    if (!selectedReservation) return;
    
    try {
      setProcessingPayment(selectedReservation);
      await processPayment(selectedReservation);
      await loadReservations();
      setShowPaymentModal(false);
    } catch (err: any) {
      console.error('Error processing payment:', err);
      setError(err.message || 'Failed to process payment');
    } finally {
      setProcessingPayment(null);
      setSelectedReservation(null);
    }
  };
  
  const openPaymentModal = (reservationId: string) => {
    setSelectedReservation(reservationId);
    setShowPaymentModal(true);
  };
  
  const closePaymentModal = () => {
    setSelectedReservation(null);
    setShowPaymentModal(false);
  };
  
  const getTimeRemaining = (updatedAt: Date | FirestoreTimestamp | string | undefined) => {
    if (!updatedAt) return { hours: 0, minutes: 0, expired: true };
    
    try {
      let updated: Date;
      
      // Check if it's already a Date object
      if (updatedAt instanceof Date) {
        updated = updatedAt;
      } 
      // Check if it's a timestamp object with seconds and nanoseconds (Firestore timestamp)
      else if (typeof updatedAt === 'object' && 'seconds' in updatedAt && 'nanoseconds' in updatedAt) {
        updated = new Date((updatedAt as FirestoreTimestamp).seconds * 1000);
      }
      // Handle string or any other format
      else {
        updated = new Date(updatedAt as string);
      }
      
      if (isNaN(updated.getTime())) {
        console.error('Invalid date in getTimeRemaining:', updatedAt);
        return { hours: 0, minutes: 0, expired: true };
      }
      
      const now = new Date();
      const deadline = new Date(updated.getTime() + 24 * 60 * 60 * 1000);
      const diffMs = deadline.getTime() - now.getTime();
      
      if (diffMs <= 0) return { hours: 0, minutes: 0, expired: true };
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      return { hours, minutes, expired: false };
    } catch (error) {
      console.error('Error in getTimeRemaining:', error, updatedAt);
      return { hours: 0, minutes: 0, expired: true };
    }
  };
  
  const formatTimeRemaining = (updatedAt: Date | FirestoreTimestamp | string | undefined) => {
    const { hours, minutes, expired } = getTimeRemaining(updatedAt);
    
    if (expired) return 'Time expired';
    
    return `${hours}h ${minutes}m remaining`;
        };
        
  const handleCancelReservation = async () => {
    if (!selectedReservation) return;
    
    try {
      setCancellingReservation(true);
      await cancelReservation(selectedReservation);
      await loadReservations();
      setShowCancelModal(false);
    } catch (err: any) {
      console.error('Error cancelling reservation:', err);
      setError(err.message || 'Failed to cancel reservation');
    } finally {
      setCancellingReservation(false);
    }
  };
  
  const openCancelModal = (reservationId: string) => {
    setSelectedReservation(reservationId);
    setShowCancelModal(true);
  };
  
  const closeCancelModal = () => {
    setSelectedReservation(null);
    setShowCancelModal(false);
  };
  
  const formatAddress = (address: any) => {
    if (!address) return 'Address not available';
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  };
  
  const formatDate = (date: Date | FirestoreTimestamp | string | undefined) => {
    if (!date) return 'Date not available';
    
    // Handle case where date might be a Firestore timestamp or string
    let dateObject: Date;
    
    try {
      // Check if it's already a Date object
      if (date instanceof Date) {
        dateObject = date;
      } 
      // Check if it's a timestamp object with seconds and nanoseconds (Firestore timestamp)
      else if (typeof date === 'object' && 'seconds' in date) {
        const firestoreTimestamp = date as FirestoreTimestamp;
        dateObject = new Date(firestoreTimestamp.seconds * 1000);
      }
      // Handle string or any other format
      else {
        dateObject = new Date(date as string);
      }
      
      // Check if the date is valid
      if (isNaN(dateObject.getTime())) {
        return 'Invalid Date';
      }
      
      return dateObject.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Invalid Date';
    }
  };
  
  const formatDateShort = (date: Date | FirestoreTimestamp | string | undefined) => {
    if (!date) return 'N/A';
    
    try {
      let dateObject: Date;
      
      if (date instanceof Date) {
        dateObject = date;
      } 
      else if (typeof date === 'object' && 'seconds' in date) {
        const firestoreTimestamp = date as FirestoreTimestamp;
        dateObject = new Date(firestoreTimestamp.seconds * 1000);
      }
      else {
        dateObject = new Date(date as string);
      }
      
      if (isNaN(dateObject.getTime())) {
        return 'Invalid Date';
      }
      
      return dateObject.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Invalid Date';
    }
  };
  
  const filteredReservations = statusFilter === 'all'
    ? reservations
    : reservations.filter(res => res.reservation.status === statusFilter);
  
  // Include 'completed' status for paid reservations
  const latestReservations = reservations
    .filter(res => res.reservation.status !== 'rejected' && res.reservation.status !== 'cancelled')
    .sort((a, b) => {
      const dateA = new Date(a.reservation.createdAt).getTime();
      const dateB = new Date(b.reservation.createdAt).getTime();
      return dateB - dateA;
    })
    .slice(0, 2);
  
  const otherReservations = reservations
    .filter(res => !latestReservations.some(latest => latest.reservation.id === res.reservation.id))
    .sort((a, b) => {
      const dateA = new Date(a.reservation.createdAt).getTime();
      const dateB = new Date(b.reservation.createdAt).getTime();
      return dateB - dateA;
    });
  
  const getTimeLeftForMoveIn = (scheduledDate: Date | FirestoreTimestamp | string | undefined) => {
    if (!scheduledDate) return null;
    
    try {
      let moveInDate: Date;
      
      // Check if it's already a Date object
      if (scheduledDate instanceof Date) {
        moveInDate = scheduledDate;
      } 
      // Check if it's a timestamp object with seconds and nanoseconds (Firestore timestamp)
      else if (typeof scheduledDate === 'object' && 'seconds' in scheduledDate) {
        const firestoreTimestamp = scheduledDate as FirestoreTimestamp;
        moveInDate = new Date(firestoreTimestamp.seconds * 1000);
      }
      // Handle string or any other format
      else {
        moveInDate = new Date(scheduledDate as string);
      }
      
      // Check if the date is valid
      if (isNaN(moveInDate.getTime())) {
        console.error('Invalid date in getTimeLeftForMoveIn:', scheduledDate);
        return null;
      }
    
    const now = new Date();
    const diffTime = moveInDate.getTime() - now.getTime();
    
    if (diffTime <= 0) return null;
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} until your viewing`;
    }
    
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} until your viewing`;
    } catch (error) {
      console.error('Error in getTimeLeftForMoveIn:', error, scheduledDate);
      return null;
    }
  };
  
  // Handle move-in action
  const handleMoveIn = async (reservationId: string) => {
    try {
      setProcessingMoveIn(reservationId);
      
      // Call the completeReservation function to mark the reservation as completed
      await completeReservation(reservationId);
      await loadReservations();
    } catch (err: any) {
      console.error('Error marking move-in:', err);
      setError(err.message || 'Failed to process move-in');
    } finally {
      setProcessingMoveIn(null);
    }
  };
  
  // Handle refund request
  const handleRequestRefund = async () => {
    if (!selectedReservation) return;
    
    try {
      setProcessingRefund(selectedReservation);
      
      // Call the requestRefund function to process the refund
      await requestRefund(selectedReservation);
      
      alert("Your refund request has been submitted and is now being processed.");
      
      await loadReservations();
      setShowRefundModal(false);
    } catch (err: any) {
      console.error('Error requesting refund:', err);
      setError(err.message || 'Failed to request refund');
    } finally {
      setProcessingRefund(null);
      setSelectedReservation(null);
    }
  };
  
  const openRefundModal = (reservationId: string) => {
    setSelectedReservation(reservationId);
    setShowRefundModal(true);
  };
  
  const closeRefundModal = () => {
    setSelectedReservation(null);
    setShowRefundModal(false);
  };
  
  // Helper function to map status to CSS class
  const formatStatusForClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'cancellationunderreview':
      case 'refundprocessing':
        return 'pending';
      case 'approved':
      case 'accepted':
      case 'paid':
      case 'movedin':
      case 'refundcompleted':
        return 'approved';
      case 'declined':
      case 'rejected':
      case 'cancelled':
      case 'refundfailed':
        return 'declined';
      default:
        return 'pending';
    }
  };
  
  if (loading) {
    return <div>Loading your reservations...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
    
    return (
    <ReservationsContainer>
      <h1>Reservations</h1>
      
      {reservations.length === 0 && (
        <div className="no-reservations">
          You don't have any reservations yet. Browse our properties and make a reservation!
        </div>
      )}
      
      {latestReservations.length > 0 ? (
        <div className="latest-requests">
          {latestReservations.map(res => {
            const propertyTitle = res.property?.title || "Apartment - flat in the center of Agadir";
            const propertyAddress = res.property ? formatAddress(res.property.address) : "avenue larache, Agadir, Souss-Massa 80000";
            const status = 
              res.reservation.status === 'accepted' ? 'Approved' : 
              res.reservation.status === 'rejected' ? 'Declined' : 
              res.reservation.status === 'paid' ? 'Paid' :
              res.reservation.status === 'movedIn' ? 'MovedIn' :
              res.reservation.status === 'refundProcessing' ? 'Refund Processing' :
              res.reservation.status === 'refundCompleted' ? 'Refund Completed' :
              res.reservation.status === 'refundFailed' ? 'Refund Failed' :
              res.reservation.status === 'cancellationUnderReview' ? 'Cancellation Under Review' :
              'Pending';
            const price = `${res.property?.price || 1500}$/month`;
            const date = formatDateShort(res.reservation.scheduledDate || res.reservation.createdAt);
            const imageUrl = "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
            const hasTimer = res.reservation.status === 'accepted';
            
            // Determine if move-in is disabled based on whether move-in date has arrived
            const isMoveInDateReached = (scheduledDate?: Date | FirestoreTimestamp | string) => {
              if (!scheduledDate) return false;
              
              try {
                let moveInDate: Date;
                
                if (scheduledDate instanceof Date) {
                  moveInDate = scheduledDate;
                } 
                else if (typeof scheduledDate === 'object' && 'seconds' in scheduledDate) {
                  const firestoreTimestamp = scheduledDate as FirestoreTimestamp;
                  moveInDate = new Date(firestoreTimestamp.seconds * 1000);
                }
                else {
                  moveInDate = new Date(scheduledDate as string);
                }
                
                const now = new Date();
                return moveInDate.getTime() <= now.getTime();
              } catch (error) {
                console.error('Error checking move-in date:', error, scheduledDate);
                return false;
              }
            };
            
            const moveInDisabled = !isMoveInDateReached(res.reservation.scheduledDate);
            
            return (
              <CustomReservationCard
                key={res.reservation.id}
                title={propertyTitle}
                details={propertyAddress}
                status={status}
                timer={hasTimer}
                date={date}
                price={price}
                image={imageUrl}
                reservationId={res.reservation.id}
                onCancel={openCancelModal}
                onConfirmPayment={openPaymentModal}
                onMoveIn={handleMoveIn}
                onRequestRefund={openRefundModal}
                updatedAt={res.reservation.updatedAt}
                scheduledDate={res.reservation.scheduledDate}
                moveInDisabled={moveInDisabled}
                movedInAt={res.reservation.movedInAt}
              />
            );
          })}
                  </div>
      ) : (
        <EmptyLatestRequests>
          <img src={emptyBoxSvg} alt="No latest requests" />
          <h3>No Latest Requests</h3>
          <p>You don't have any active reservation requests. Start browsing properties to make a reservation!</p>
        </EmptyLatestRequests>
      )}
            
      {otherReservations.length > 0 ? (
        <div className="other-reservations">
          <div className="table-header">
            <h2>Past Reservations</h2>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Property Name</th>
                <th>Advertiser</th>
                <th>Check-in</th>
                <th>Status</th>
                <th>Fee</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {otherReservations.map(res => (
                <tr key={res.reservation.id}>
                  <td>{res.property?.title || "Apartment in Agadir"}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src="https://randomuser.me/api/portraits/men/32.jpg" 
                        alt="Avatar" 
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          marginRight: '8px' 
                        }} 
                      />
                      {res.advertiser?.name || "Leonardo V."}
                    </div>
                  </td>
                  <td>{formatDateShort(res.reservation.scheduledDate)}</td>
                  <td>
                    <span className={`status ${formatStatusForClass(res.reservation.status)}`}>
                      {res.reservation.status === 'accepted' ? 'Approved' : 
                       res.reservation.status === 'rejected' ? 'Declined' : 
                       res.reservation.status === 'paid' ? 'Paid' :
                       res.reservation.status === 'movedIn' ? 'Moved In' :
                       res.reservation.status === 'refundProcessing' ? 'Refund Processing' :
                       res.reservation.status === 'refundCompleted' ? 'Refund Completed' :
                       res.reservation.status === 'refundFailed' ? 'Refund Failed' :
                       res.reservation.status === 'cancellationUnderReview' ? 'Under Review' :
                       'Pending'}
                    </span>
                  </td>
                  <td>0$</td>
                  <td>
                    <button 
                      className="action-button"
                      onClick={() => window.open(`/properties/${res.property?.id || res.reservation.propertyId || ''}`, '_blank')}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : reservations.length > 0 && (
        <div className="other-reservations" style={{ padding: '2rem', textAlign: 'left' }}>
          <div className="table-header">
            <h2>Past Reservations</h2>
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '3rem',
            borderTop: Theme.borders.primary
          }}>
            <img src={emptyBoxSvg} alt="No past reservations" style={{ width: '80px', marginBottom: '1.5rem' }} />
            <h3 style={{ 
              font: Theme.typography.fonts.h4B, 
              color: Theme.colors.black, 
              marginBottom: '0.5rem' 
            }}>No Past Reservations</h3>
            <p style={{ 
              font: Theme.typography.fonts.mediumM, 
              color: Theme.colors.gray2, 
              textAlign: 'center',
              maxWidth: '400px'
            }}>
              You don't have any past or inactive reservations.
            </p>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Cancel Reservation</h2>
            <p className="modal-message">
              Are you sure you want to cancel this reservation request? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button 
                className="modal-button cancel"
                onClick={closeCancelModal}
                disabled={cancellingReservation}
              >
                Keep Request
              </button>
              <button 
                className="modal-button confirm"
                onClick={handleCancelReservation}
                disabled={cancellingReservation}
              >
                {cancellingReservation ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRefundModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Request Refund</h2>
            <p className="modal-message">
              Are you sure you want to request a refund? If approved, your deposit and first month's rent will be refunded.
              This action cannot be undone once submitted.
            </p>
            <div className="modal-actions">
              <button 
                className="modal-button cancel"
                onClick={closeRefundModal}
                disabled={processingRefund !== null}
              >
                Cancel
              </button>
              <button 
                className="modal-button confirm"
                onClick={handleRequestRefund}
                disabled={processingRefund !== null}
              >
                {processingRefund ? 'Processing...' : 'Request Refund'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Confirm Payment</h2>
            <p className="modal-message">
              By confirming this payment, you agree to complete the reservation. 
              Your payment method will be charged for the deposit and first month's rent.
            </p>
            <div className="modal-actions">
              <button 
                className="modal-button cancel"
                onClick={closePaymentModal}
                disabled={processingPayment !== null}
              >
                Cancel
              </button>
              <button 
                className="modal-button pay"
                onClick={handleConfirmPayment}
                disabled={processingPayment !== null}
              >
                {processingPayment ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ReservationsContainer>
    );
};

export default ReservationsPage;

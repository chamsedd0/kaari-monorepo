import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ReservationStatusContainer } from './styles';
import { Theme } from '../../../../theme/theme';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import { useTranslation } from 'react-i18next';
import { getClientReservations, cancelReservation } from '../../../../backend/server-actions/ClientServerActions';
import { processPayment } from '../../../../backend/server-actions/CheckoutServerActions';
import { CardBaseModelStyleConfirmationStatus } from '../../../../components/styles/cards/card-base-model-style-confirmation-status';
import confirmationImage from '../../../../components/icons/Group.svg';
import { BwhiteButtonLB48 } from '../../../../components/skeletons/buttons/border_white_LB48';
import { FaInfoCircle } from 'react-icons/fa';
import { CheckoutCard } from '../../../../components/skeletons/cards/checkout-card';

import ConfirmationImage from '../../../../components/skeletons/icons/success.svg';

// Define interfaces
interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

interface Reservation {
  reservation: {
    id: string;
    requestType: string;
    status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
    createdAt: Date | FirestoreTimestamp | string;
    updatedAt: Date | FirestoreTimestamp | string;
    scheduledDate?: Date | FirestoreTimestamp | string;
    message: string;
    propertyId?: string;
    movedIn?: boolean;
    movedInAt?: Date | FirestoreTimestamp | string;
    paymentStatus?: 'pending' | 'failed' | 'completed';
    refundStatus?: 'pending' | 'processed';
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
    deposit?: number;
    serviceFee?: number;
    images: string[];
    rooms?: Array<{
      type: string;
      area: number;
    }>;
  } | null;
  advertiser?: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    profilePicture?: string;
  } | null;
}

// Status Card Components
const PendingStatusCard: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  return (
    <CardBaseModelStyleConfirmationStatus>
      <div className="left-container">
        <div className="confirmation-status-text">Confirmation Status</div>
        <div className="h3-text">Your Reservation Request has been sent!</div>
        <div className="text16-text">We will keep you updated on your request. Make sure to check emails regularly.</div>
        <div className="button-container">
          <BwhiteButtonLB48 text="Cancel without charge" onClick={onCancel} />
        </div>
      </div>
      <div className="right-container">
        <img src={confirmationImage} alt="Confirmation" />
      </div>
    </CardBaseModelStyleConfirmationStatus>
  );
};

const AcceptedStatusCard: React.FC<{ onCancel: () => void, onConfirm: () => void }> = ({ onCancel, onConfirm }) => {
  return (
    <CardBaseModelStyleConfirmationStatus className="accepted">
      <div className="left-container">
        <div className="confirmation-status-text">Confirmation Status</div>
        <div className="h3-text">Congratulations, the place is Yours!</div>
        <div className="text16-text">You have 24 hours to confirm your reservation. Confirmation will result in your payment being processed. You can also cancel your reservation.</div>
        <div className="button-container">
          <BwhiteButtonLB48 text="Cancel Reservation" onClick={onCancel} />
          <BwhiteButtonLB48 text="Confirm" onClick={onConfirm} />
        </div>
      </div>
      <div className="right-container">
        <div className="countdown">23:59:59</div>
      </div>
    </CardBaseModelStyleConfirmationStatus>
  );
};

const RejectedStatusCard: React.FC<{ onFindHousing: () => void, reservationId: string, propertyTitle: string }> = 
  ({ onFindHousing, reservationId, propertyTitle }) => {
  return (
    <CardBaseModelStyleConfirmationStatus className="rejected">
      <div className="left-container">
        <div className="confirmation-status-text">Confirmation Status</div>
        <div className="h3-text">Your Request has been rejected</div>
        <div className="text16-text">
          We hate to inform you that your reservation request (ID {reservationId.substring(0, 6)}) 
          for the offer {propertyTitle} has been rejected by the advertiser. We are truly sorry for that.
        </div>
        <div className="button-container">
          <BwhiteButtonLB48 text="Find other housing" onClick={onFindHousing} />
        </div>
      </div>
      <div className="right-container">
        <img src="/images/sad-user.png" alt="Rejected" />
      </div>
    </CardBaseModelStyleConfirmationStatus>
  );
};

const CompletedStatusCard: React.FC<{ onDownload: () => void }> = ({ onDownload }) => {
  return (
    <CardBaseModelStyleConfirmationStatus className="completed">
      <div className="left-container">
        <div className="confirmation-status-text">Confirmation Status</div>
        <div className="h3-text">Payment Confirmed</div>
        <div className="text16-text">Your payment has been successfully processed. You can now move in on your scheduled date.</div>
        <div className="button-container">
          <BwhiteButtonLB48 text="Download Receipt" onClick={onDownload} />
        </div>
      </div>
      <div className="right-container">
        <img src={confirmationImage} alt="Payment Confirmed" />
      </div>
    </CardBaseModelStyleConfirmationStatus>
  );
};

const PaymentFailedCard: React.FC = () => {
  return (
    <CardBaseModelStyleConfirmationStatus className="payment-failed">
      <div className="left-container">
        <div className="confirmation-status-text">Confirmation Status</div>
        <div className="h3-text">Your payment has failed</div>
        <div className="text16-text">
          It seems that the payment has failed for the following reason(s):
          Your receipt was not valid.
          Please resubmit the receipt so we can continue the process.
        </div>
      </div>
      <div className="right-container">
        <img src="/images/payment-failed.png" alt="Payment Failed" />
      </div>
    </CardBaseModelStyleConfirmationStatus>
  );
};

const RefundPendingCard: React.FC<{ onContactSupport: () => void }> = ({ onContactSupport }) => {
  return (
    <CardBaseModelStyleConfirmationStatus className="refund-pending">
      <div className="left-container">
        <div className="confirmation-status-text">Confirmation Status</div>
        <div className="h3-text">The refund is being processed</div>
        <div className="text16-text">
          You'll receive the refund within 7 business days. We apologize once again for any inconvenience caused. 
          If you have any issues related to your refund, please contact us at customercare@kaari.mg or give us a call at 05XXXXXX.
        </div>
        <div className="button-container">
          <BwhiteButtonLB48 text="Contact Support" onClick={onContactSupport} />
        </div>
      </div>
      <div className="right-container">
        <img src="/images/refund-pending.png" alt="Refund Processing" />
      </div>
    </CardBaseModelStyleConfirmationStatus>
  );
};

const RefundProcessedCard: React.FC<{ onDownload: () => void }> = ({ onDownload }) => {
  return (
    <CardBaseModelStyleConfirmationStatus className="refund-processed">
      <div className="left-container">
        <div className="confirmation-status-text">Confirmation Status</div>
        <div className="h3-text">The refund was processed Successfully</div>
        <div className="text16-text">
          If you have any issues related to your refund, please contact our Customer Care
        </div>
        <div className="button-container">
          <BwhiteButtonLB48 text="Download Receipt" onClick={onDownload} />
        </div>
      </div>
      <div className="right-container">
        <img src="/images/refund-success.png" alt="Refund Processed" />
      </div>
    </CardBaseModelStyleConfirmationStatus>
  );
};

// Moved In Status Card with Refund Timer
const MovedInStatusCard: React.FC<{ 
  onRequestRefund: () => void, 
  movedInAt: Date | FirestoreTimestamp | string,
  scheduledDate?: Date | FirestoreTimestamp | string | undefined,
  refundPeriodDays?: number, // Number of days the refund period lasts
  isExpiredForTesting?: boolean
}> = ({ onRequestRefund, movedInAt, scheduledDate, refundPeriodDays = 1, isExpiredForTesting = false }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isRefundExpired, setIsRefundExpired] = useState(isExpiredForTesting);

  useEffect(() => {
    // If testing with expired flag, skip timer calculation
    if (isExpiredForTesting) {
      setIsRefundExpired(true);
      return;
    }
    
    // Convert movedInAt to Date object - this is when the user actually moved in
    const startDate = new Date(
      typeof movedInAt === 'object' && 'seconds' in movedInAt 
        ? movedInAt.seconds * 1000 
        : movedInAt || Date.now()
    );
    
    // Calculate the refund deadline (24 hours from actual move-in date)
    const refundDeadline = new Date(startDate);
    refundDeadline.setHours(refundDeadline.getHours() + 24);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = refundDeadline.getTime() - now.getTime();
      
      if (difference <= 0) {
        setIsRefundExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      // Calculate time components
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      return { days: 0, hours, minutes, seconds };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Update every second
    const timer = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);
      
      if (updatedTimeLeft.hours === 0 && 
          updatedTimeLeft.minutes === 0 && 
          updatedTimeLeft.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [movedInAt, isExpiredForTesting]);
  
  // Format the time with leading zeros
  const formatTime = (value: number) => {
    return value < 10 ? `0${value}` : value.toString();
  };
  
  return (
    <CardBaseModelStyleConfirmationStatus className="moved-in">
      <div className="left-container">
        <div className="confirmation-status-text">Property Status</div>
        <div className="h3-text">You've Successfully Moved In!</div>
        <div className="text16-text">
          {isRefundExpired ? 
            "The refund period has expired. If you're experiencing any issues with your stay, please contact our customer support team." :
            "You're still within the refund period. If you encounter any significant issues with the property, you can request a refund."
          }
    </div>
        {!isRefundExpired && (
          <div className="button-container">
            <BwhiteButtonLB48 text="Request Refund" onClick={onRequestRefund} />
          </div>
        )}
      </div>
      <div className="right-container">
        {!isRefundExpired ? (
          <div className="refund-timer">
            <div className="timer-label">Refund Period Ends In:</div>
            <div className="countdown-container">
              <div className="countdown-segment">
                <div className="count">{formatTime(timeLeft.hours)}</div>
                <div className="label">Hours</div>
              </div>
              <div className="separator">:</div>
              <div className="countdown-segment">
                <div className="count">{formatTime(timeLeft.minutes)}</div>
                <div className="label">Mins</div>
              </div>
              <div className="separator">:</div>
              <div className="countdown-segment">
                <div className="count">{formatTime(timeLeft.seconds)}</div>
                <div className="label">Secs</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="refund-expired">
            <div className="expired-message">Refund Period Has Expired</div>
            <img src="/images/refund-expired.png" alt="Refund Expired" />
          </div>
        )}
      </div>
    </CardBaseModelStyleConfirmationStatus>
  );
};

// Main component
const ReservationStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const queryReservationId = queryParams.get('id');
  const urlReservationId = params.reservationId;
  const reservationId = urlReservationId || queryReservationId;
  const statusParam = queryParams.get('status');
  
  useEffect(() => {
    const loadReservationDetails = async () => {
      if (!reservationId) {
        setError('No reservation ID provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // Get all client reservations and filter for the requested one
        const reservationsData = await getClientReservations();
        const foundReservation = reservationsData.find(res => res.reservation.id === reservationId);
        
        if (!foundReservation) {
          setError('Reservation not found');
          setLoading(false);
          return;
        }
        
        console.log('Loaded reservation data:', foundReservation);
        console.log('Property data:', foundReservation.property);
        setReservation(foundReservation);
      } catch (err: Error | unknown) {
        console.error('Error loading reservation details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load reservation details');
      } finally {
        setLoading(false);
      }
    };
    
    loadReservationDetails();
  }, [reservationId]);
  
  const handleBack = () => {
    navigate('/dashboard/user/reservations');
  };
  
  // Handle primary actions
  const handleCancel = async () => {
    if (!reservation) return;
    setIsProcessing(true);
    try {
      await cancelReservation(reservation.reservation.id);
      alert('Reservation cancelled successfully');
      // Reload data
      const reservationsData = await getClientReservations();
      const updatedReservation = reservationsData.find(res => res.reservation.id === reservationId);
      if (updatedReservation) {
      setReservation(updatedReservation);
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('Failed to cancel reservation');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleConfirmPayment = async () => {
    if (!reservation) return;
    setIsProcessing(true);
    try {
      await processPayment(reservation.reservation.id);
      alert('Payment confirmed successfully');
      // Reload data
      const reservationsData = await getClientReservations();
      const updatedReservation = reservationsData.find(res => res.reservation.id === reservationId);
      if (updatedReservation) {
      setReservation(updatedReservation);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Failed to confirm payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFindHousing = () => {
    navigate('/properties');
  };

  const handleDownloadReceipt = () => {
    alert('Receipt download will be implemented');
  };
  
  const handleRetryPayment = async () => {
    if (!reservation) return;
    setIsProcessing(true);
    try {
      await processPayment(reservation.reservation.id);
      alert('Payment retry initiated');
      // Reload data
      const reservationsData = await getClientReservations();
      const updatedReservation = reservationsData.find(res => res.reservation.id === reservationId);
      if (updatedReservation) {
      setReservation(updatedReservation);
      }
    } catch (error) {
      console.error('Error retrying payment:', error);
      alert('Failed to retry payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:customercare@kaari.mg';
  };

  const handleViewProfile = () => {
    if (!reservation?.advertiser?.id) return;
    navigate(`/advertiser-profile/${reservation.advertiser.id}`);
  };

  const handleContactAdvertiser = () => {
    alert('Contact advertiser functionality will be implemented');
  };

  const handleReadCancellationPolicy = () => {
    alert('Cancellation policy will be displayed');
  };

  // Add new handler for requesting refund
  const handleRequestRefund = () => {
    if (!reservation) return;
    navigate(`/dashboard/user/refunds/request?reservationId=${reservation.reservation.id}`);
  };

  if (loading) {
    return (
      <ReservationStatusContainer>
        <div className="back-button" onClick={handleBack}>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 8H1M1 8L8 15M1 8L8 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Reservations
        </div>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          Loading reservation details...
        </div>
      </ReservationStatusContainer>
    );
  }
  
  if (error) {
    return (
      <ReservationStatusContainer>
        <div className="back-button" onClick={handleBack}>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 8H1M1 8L8 15M1 8L8 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Reservations
        </div>
        <div style={{ textAlign: 'center', padding: '3rem', color: Theme.colors.error }}>
          Error: {error}
        </div>
      </ReservationStatusContainer>
    );
  }
  
  if (!reservation) {
    return (
      <ReservationStatusContainer>
        <div className="back-button" onClick={handleBack}>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 8H1M1 8L8 15M1 8L8 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Reservations
        </div>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          Reservation not found
        </div>
      </ReservationStatusContainer>
    );
  }

  // Determine which status to show based on status parameter and actual reservation status
  const determineStatus = () => {
    if (statusParam === 'paid') return 'completed';
    if (statusParam === 'refund-pending') return 'refund-pending';
    if (statusParam === 'refund-processed') return 'refund-processed';
    if (statusParam === 'payment-failed') return 'payment-failed';
    if (statusParam === 'moved-in') return 'moved-in';
    // Test with different refund periods by using URL parameters:
    // ?status=moved-in&days=3 (3 days refund period)
    // ?status=moved-in&days=0.001 (almost expired - ~86 seconds)
    // ?status=moved-in&expired=true (expired refund period)
    // Check if the reservation has movedIn flag
    if (reservation?.reservation.movedIn) return 'moved-in';
    return statusParam || reservation.reservation.status;
  };

  const currentStatus = determineStatus();
  
  // Get test parameters for moved-in status
  const testRefundDays = queryParams.get('days') ? parseFloat(queryParams.get('days')!) : 7;
  const testIsExpired = queryParams.get('expired') === 'true';
  
  // Format date helper
  const formatDate = (date: FirestoreTimestamp | Date | string | undefined) => {
    if (!date) return 'Not specified';
    try {
      const dateObj = new Date(
        typeof date === 'object' && 'seconds' in date 
          ? date.seconds * 1000 
          : date
      );
      return dateObj.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '.');
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  };
  
  return (
    <ReservationStatusContainer>
      <div className="back-button" onClick={handleBack}>
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 8H1M1 8L8 15M1 8L8 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Reservations
      </div>
      
      <h1>Reservation Status</h1>
      
      {/* Render appropriate status card based on status */}
      {currentStatus === 'pending' && (
        <PendingStatusCard onCancel={handleCancel} />
      )}
      
      {currentStatus === 'accepted' && (
        <AcceptedStatusCard onCancel={handleCancel} onConfirm={handleConfirmPayment} />
      )}
      
      {currentStatus === 'rejected' && (
        <RejectedStatusCard 
          onFindHousing={handleFindHousing} 
          reservationId={reservation.reservation.id} 
          propertyTitle={reservation.property?.title || "Apartment in Agadir"}
        />
      )}
      
      {currentStatus === 'completed' && (
        <CompletedStatusCard onDownload={handleDownloadReceipt} />
      )}
      
      {currentStatus === 'payment-failed' && (
        <PaymentFailedCard />
      )}
      
      {currentStatus === 'refund-pending' && (
        <RefundPendingCard onContactSupport={handleContactSupport} />
      )}
      
      {currentStatus === 'refund-processed' && (
        <RefundProcessedCard onDownload={handleDownloadReceipt} />
      )}

      {currentStatus === 'moved-in' && (
        <MovedInStatusCard 
          onRequestRefund={handleRequestRefund} 
          movedInAt={reservation.reservation.movedInAt || new Date()} 
          scheduledDate={reservation.reservation.scheduledDate}
          refundPeriodDays={testRefundDays}
          isExpiredForTesting={testIsExpired}
        />
      )}
      
      {/* Payment Methods section for payment-failed status */}
      {currentStatus === 'payment-failed' && (
        <div className="payment-methods-section">
          <h2>Your Payment Methods</h2>
          <div className="payment-card">
            <div className="card-info">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" />
              <div className="card-details">
                <div className="card-type">Master Card</div>
                <div className="card-expiry">Expiration: 04/30</div>
                </div>
              </div>
            <div className="card-actions">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="#666666" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" fill="#666666" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" fill="#666666" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
          <div className="action-buttons">
            <PurpleButtonMB48 
              text="Try Again" 
              onClick={handleRetryPayment} 
            />
          </div>
        </div>
      )}
      
      {/* Additional info for rejected status */}
      {currentStatus === 'rejected' && (
        <div className="rejection-info">
          <div className="info-card">
            <h4>
              <FaInfoCircle size={18} />
                A Thoughtful Gesture from Kaari's Customer Care Team:
              </h4>
            <p>
              Contact our support team <strong>promptly</strong> to check property 
              availability even after the 24-hour period. If the property is still available, 
              you can avoid losing the payment you've made (50% of the tenant fee).
            </p>
            </div>
                    </div>
      )}
      
      {/* Contact cards for accepted status */}
      {currentStatus === 'accepted' && (
        <div className="contact-cards">
          <div className="info-card-row">
              <div className="info-card">
                  <h4>Contact Your Advertiser</h4>
              <p>
                <strong>Important!</strong> Contacting the advertiser will be considered as confirmation of your reservation. 
                The payment will be processed after your confirmation.
              </p>
              <div className="advertiser-info">
                <img 
                  src={reservation.advertiser?.profilePicture || "https://ui-avatars.com/api/?name=Leonardo+V"} 
                  alt="Advertiser" 
                  className="advertiser-avatar"
                />
                <div className="advertiser-details">
                  <div className="advertiser-name">{reservation.advertiser?.name || "Leonardo V."}</div>
                  <div className="advertiser-title">Experienced host</div>
                    </div>
                <button className="contact-button" onClick={handleContactAdvertiser}>Contact</button>
              </div>
            </div>
            
              <div className="info-card">
                  <h4>Deadline is too Soon?</h4>
              <p>
                To extend the 24-hour deadline, please email Kaari's Customer Care 
                at customercare@kaari.mg or call 05XXXXX. Customer care is 
                available daily from 9 AM to 8 PM, excluding holidays.
              </p>
              <div className="support-card">
                <div className="support-icon">
                  <img src="/images/support-icon.png" alt="Support" />
                    </div>
                <button className="contact-button" onClick={handleContactSupport}>Contact</button>
                </div>
              </div>
            </div>
            
          <div className="amenities-row">
            <div className="amenity-card">
              <div className="amenity-icon bedroom">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 17.5V10C20 8.9 19.1 8 18 8H6C4.9 8 4 8.9 4 10V17.5" stroke="#1E88E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17.5V19.5C2 20.05 2.45 20.5 3 20.5H4C4.55 20.5 5 20.05 5 19.5V17.5" stroke="#1E88E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 17.5V19.5C22 20.05 21.55 20.5 21 20.5H20C19.45 20.5 19 20.05 19 19.5V17.5" stroke="#1E88E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 8V5C8 3.9 8.9 3 10 3H14C15.1 3 16 3.9 16 5V8" stroke="#1E88E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="amenity-details">
                <div className="amenity-name">Bedroom</div>
                <div className="amenity-value">10 m²</div>
              </div>
              </div>
            <div className="amenity-card">
              <div className="amenity-icon kitchen">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 8H5C3.89543 8 3 8.89543 3 10V22H21V10C21 8.89543 20.1046 8 19 8Z" stroke="#FFA000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 4H5C3.89543 4 3 4.89543 3 6V8H21V6C21 4.89543 20.1046 4 19 4Z" stroke="#FFA000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 15H16" stroke="#FFA000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 18H16" stroke="#FFA000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
              <div className="amenity-details">
                <div className="amenity-name">Kitchen</div>
                <div className="amenity-value">10 m²</div>
          </div>
        </div>
            <div className="amenity-card">
              <div className="amenity-icon living-room">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 15V7C4 5.9 4.9 5 6 5H18C19.1 5 20 5.9 20 7V15" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 15V17C4 18.1 4.9 19 6 19H18C19.1 19 20 18.1 20 17V15" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 15H22" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="amenity-details">
                <div className="amenity-name">Living Room</div>
                <div className="amenity-value">10 m²</div>
            </div>
            </div>
            <div className="amenity-card">
              <div className="amenity-icon bathroom">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 12H20C20.55 12 21 12.45 21 13V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V13C3 12.45 3.45 12 4 12Z" stroke="#9C27B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 12V5C6 4.45 6.45 4 7 4H10C10.55 4 11 4.45 11 5V12" stroke="#9C27B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.5 4V2" stroke="#9C27B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.5 20V22" stroke="#9C27B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.5 20V22" stroke="#9C27B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
              <div className="amenity-details">
                <div className="amenity-name">Bathroom</div>
                <div className="amenity-value">10 m²</div>
                    </div>
                    </div>
                  </div>
                </div>
      )}
      
      {/* Information cards for pending status */}
      {currentStatus === 'pending' && (
        <div className="info-cards-section">
          <h2>Some important information for you</h2>
          <div className="info-cards-container">
            <div className="info-card">
              <div className="info-icon application"></div>
              <h3>Application Tracking</h3>
              <p>
                Access your profile to monitor the progress of your request in real-time. 
                The landlord has 24 hours to approve your reservation request.
              </p>
              </div>
              
            <div className="info-card">
              <div className="info-icon email"></div>
              <h3>Email Notifications</h3>
              <p>
                You will receive an email to keep you informed of the current status of your 
                request, allowing you to stay updated at each step.
              </p>
              </div>
              
            <div className="info-card">
              <div className="info-icon app"></div>
              <h3>Alerts via the App</h3>
              <p>
                If you have our app, instant notifications will be sent to you as 
                soon as the status of your request is updated, ensuring uninterrupted tracking.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Suggested listings section for rejected and refund statuses */}
      {(currentStatus === 'rejected' || currentStatus === 'refund-pending' || currentStatus === 'refund-processed') && (
            <div className="suggestions-section">
          <h2>Some other Suggestions for you:</h2>
              <div className="suggestions-container">
            <div className="property-suggestion-card">
              <div className="property-image-container">
                    <img 
                      src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg" 
                      alt="Suggested property" 
                />
                <div className="top-pick-badge">TOP PICK</div>
                <div className="favorite-button">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="property-details">
                <h3>Apartment - flat in the center of Agadir</h3>
                <div className="min-stay">Min.stay (30 days)</div>
                <div className="property-price">100$/month</div>
            </div>
              <div className="property-badges">
                <div className="badge kaari-verified">Kaari Verified</div>
                <div className="badge tenant-protection">Tenant Protection</div>
                  </div>
            </div>
            
            <div className="property-suggestion-card">
              <div className="property-image-container">
                    <img 
                      src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg" 
                      alt="Suggested property" 
                />
                <div className="top-pick-badge">TOP PICK</div>
                <div className="favorite-button">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                    </div>
                    </div>
              <div className="property-details">
                <h3>Apartment - flat in the center of Agadir</h3>
                <div className="min-stay">Min.stay (30 days)</div>
                <div className="property-price">100$/month</div>
                  </div>
              <div className="property-badges">
                <div className="badge kaari-verified">Kaari Verified</div>
                <div className="badge tenant-protection">Tenant Protection</div>
                </div>
              </div>
            </div>
              </div>
      )}
      
      {/* Property Details Card - shown on all pages */}
      <div className="property-details-card">
        <CheckoutCard 
          title={reservation.property?.title || "Apartment in Agadir"}
          image={'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'}
          moveInDate={formatDate(reservation.reservation.scheduledDate)}
          lengthOfStay={reservation.property?.rooms ? 
            `${reservation.property.rooms.length} room${reservation.property.rooms.length > 1 ? 's' : ''}` : 
            "30 days"}
          profileImage={"https://ui-avatars.com/api/?name=John+Doe"}
          profileName={reservation.advertiser?.name || "John Doe"}
          monthlyRent={`${reservation.property?.price || 0}$`}
          securityDeposit={`${reservation.property?.deposit || 0}$`}
          serviceFee={`${reservation.property?.serviceFee || 0}$`}
          total={`${(reservation.property?.price || 0) + 
                    (reservation.property?.deposit || 0) + 
                    (reservation.property?.serviceFee || 0)}$`}
          onViewProfile={handleViewProfile}
          onReadCancellationPolicy={handleReadCancellationPolicy}
        />
              </div>
    </ReservationStatusContainer>
  );
};

export default ReservationStatusPage; 
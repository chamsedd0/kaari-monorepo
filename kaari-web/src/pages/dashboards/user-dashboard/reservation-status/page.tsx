import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ReservationStatusContainer } from './styles';
import { Theme } from '../../../../theme/theme';
import { FaArrowLeft, FaInfoCircle, FaComments, FaClock, FaReceipt } from 'react-icons/fa';
import { MdBed, MdKitchen, MdChair, MdBathtub } from 'react-icons/md';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import { BpurpleButtonMB48 } from '../../../../components/skeletons/buttons/border_purple_MB48';
import { CheckoutCard } from '../../../../components/skeletons/cards/checkout-card';
import { getClientReservations, cancelReservation, completeReservation, requestRefund } from '../../../../backend/server-actions/ClientServerActions';
import { processPayment } from '../../../../backend/server-actions/CheckoutServerActions';
import { useToastService } from '../../../../services/ToastService';
import BookingDetailsComponent from '../../../../components/reservations/BookingDetails';
import TimerComponent from '../../../../components/skeletons/constructed/status-cards/TimerComponent';
import ApprovedReservationWithTimer from './ApprovedReservationWithTimer';
import MovedInWithTimer from './MovedInWithTimer';
import InfoCardsSection from './InfoCardsSection';
import ConfirmationModal from '../../../../components/modals/ConfirmationModal';

// Import status cards - Using correct import types for each component
import { ConfirmationRequestSentCard } from '../../../../components/skeletons/constructed/status-cards/confirmation-request-sent';
import ConfirmationRequestApproved from '../../../../components/skeletons/constructed/status-cards/confirmation-request-approved';
import ConfirmationRequestRejected  from '../../../../components/skeletons/constructed/status-cards/confirmation-request-rejected';
import ConfirmationYouGetThePlace  from '../../../../components/skeletons/constructed/status-cards/confirmation-you-get-the-place';
import ConfirmationPaymentFailedCard  from '../../../../components/skeletons/constructed/status-cards/confirmation-paymet-failed'; // Note: There's a typo in the filename
import ConfirmationToYourLikingCard  from '../../../../components/skeletons/constructed/status-cards/cofirmation-to-your-liking'; // Note: There's a typo in the filename
import CancellationRequestUnderReview from '../../../../components/skeletons/constructed/status-cards/cancellation-request-under-review';
import CancellationRequestApproved from '../../../../components/skeletons/constructed/status-cards/cancellation-request-approved';
import CancellationRequestRejected from '../../../../components/skeletons/constructed/status-cards/cacellation-request-rejected'; // Note: There's a typo in the filename
import CancellationRefundBeingProcessed from '../../../../components/skeletons/constructed/status-cards/cancellation-refund-being-processed';
import CancellationRefundCouldNotProcessed from '../../../../components/skeletons/constructed/status-cards/cancellation-refund-could-not-processed';

// Define interfaces
interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

interface Reservation {
  reservation: {
    id: string;
    requestType: string;
    status: 'pending' | 'accepted' | 'rejected' | 'paid' | 'movedIn' | 'cancelled' | 'refundProcessing' | 'refundCompleted' | 'refundFailed' | 'cancellationUnderReview' | 'cancellationRejected';
    createdAt: Date | FirestoreTimestamp | string;
    updatedAt: Date | FirestoreTimestamp | string;
    scheduledDate?: Date | FirestoreTimestamp | string;
    message: string;
    propertyId?: string;
    movedIn?: boolean;
    movedInAt?: Date | FirestoreTimestamp | string;
  };
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
      type: 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'storage';
      area: number;
    }>;
    features?: string[] | Record<string, boolean> | string;
  } | null;
  advertiser?: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    profilePicture?: string;
  } | null;
}

// Helper function for formatting dates
const formatDate = (date: Date | FirestoreTimestamp | string | undefined): string => {
  if (!date) return 'Not set';
  
  try {
    let dateObj: Date;
    
    if (date instanceof Date) {
      dateObj = date;
    } 
    else if (typeof date === 'object' && 'seconds' in date) {
      dateObj = new Date((date as FirestoreTimestamp).seconds * 1000);
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
    console.error('Error formatting date:', error, date);
    return "Invalid Date";
  }
};

// Helper function to format address
const formatAddress = (address: any): string => {
  if (!address) return "Address not available";
  
  const { street, city, state, zipCode, country } = address;
  return `${street || ''}, ${city || ''}, ${state || ''} ${zipCode || ''}, ${country || ''}`;
};

const ReservationStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const toast = useToastService();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [processing, setProcessing] = useState(false);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: () => {}
  });
  
  // Get the reservation ID from params or search params
  const reservationId = id || new URLSearchParams(location.search).get('id');
  
  useEffect(() => {
      if (!reservationId) {
        setError('No reservation ID provided');
        setLoading(false);
        return;
      }
      
    loadReservationDetails();
  }, [reservationId]);
  
  const loadReservationDetails = async () => {
      try {
        setLoading(true);
      
      // Fetch all client reservations
        const reservationsData = await getClientReservations();
      
      // Find the specific reservation
        const foundReservation = reservationsData.find(res => res.reservation.id === reservationId);
        
        if (!foundReservation) {
          setError('Reservation not found');
          setLoading(false);
          return;
        }
        
        console.log('Loaded reservation data:', foundReservation);
        setReservation(foundReservation);
      setLoading(false);
    } catch (err: any) {
        console.error('Error loading reservation details:', err);
      setError(err.message || 'Failed to load reservation details');
        setLoading(false);
      }
    };
  
  const handleBack = () => {
    navigate('/dashboard/user/reservations');
  };
  
  // Function to handle reservation cancellation with modal
  const confirmCancel = () => {
    setModalConfig({
      title: 'Cancel Reservation',
      message: 'Are you sure you want to cancel this reservation? This action cannot be undone.',
      confirmText: 'Yes, Cancel',
      cancelText: 'No, Keep It',
      onConfirm: performCancellation
    });
    setModalOpen(true);
  };
  
  const performCancellation = async () => {
    if (!reservation) return;
    
    try {
      setProcessing(true);
      setModalOpen(false);
      await cancelReservation(reservation.reservation.id);
      toast.showToast('success', 'Reservation Cancelled', 'Your reservation has been successfully cancelled');
      
      // Reload data
      await loadReservationDetails();
    } catch (error: any) {
      console.error('Error cancelling reservation:', error);
      toast.showToast('error', 'Cancellation Failed', error.message || 'Failed to cancel reservation');
    } finally {
      setProcessing(false);
    }
  };
  
  // Function to handle payment confirmation with modal
  const confirmPayment = () => {
    setModalConfig({
      title: 'Confirm Payment',
      message: 'Are you sure you want to proceed with the payment? Your payment information will be processed.',
      confirmText: 'Yes, Pay Now',
      cancelText: 'Not Now',
      onConfirm: performPayment
    });
    setModalOpen(true);
  };
  
  const performPayment = async () => {
    if (!reservation) return;
    
    try {
      setProcessing(true);
      setModalOpen(false);
      await processPayment(reservation.reservation.id);
      toast.showToast('success', 'Payment Processed', 'Your payment has been successfully processed');
      
      // Reload data
      await loadReservationDetails();
    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast.showToast('error', 'Payment Failed', error.message || 'Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };
  
  // Function to handle move-in confirmation with modal
  const confirmMoveIn = () => {
    setModalConfig({
      title: 'Confirm Move-In',
      message: 'Are you sure you want to confirm that you have moved in to this property?',
      confirmText: 'Yes, I Moved In',
      cancelText: 'Not Yet',
      onConfirm: performMoveIn
    });
    setModalOpen(true);
  };
  
  const performMoveIn = async () => {
    if (!reservation) return;
    
    try {
      setProcessing(true);
      setModalOpen(false);
      await completeReservation(reservation.reservation.id);
      toast.showToast('success', 'Move-In Confirmed', 'Your move-in has been successfully confirmed');
      
      // Reload data
      await loadReservationDetails();
    } catch (error: any) {
      console.error('Error confirming move-in:', error);
      toast.showToast('error', 'Confirmation Failed', error.message || 'Failed to confirm move-in');
    } finally {
      setProcessing(false);
    }
  };
  
  // Function to handle refund request with modal
  const confirmRefundRequest = () => {
    setModalConfig({
      title: 'Request Refund',
      message: 'Are you sure you want to request a refund? This will initiate the cancellation process.',
      confirmText: 'Yes, Request Refund',
      cancelText: 'Cancel',
      onConfirm: () => navigate(`/dashboard/user/refund-request?reservationId=${reservation?.reservation.id}`)
    });
    setModalOpen(true);
  };
  
  // Function to handle 'Find other housing' button
  const handleFindHousing = () => {
    navigate('/properties');
  };

  // Function to handle 'Download Receipt' button
  const handleDownloadReceipt = () => {
    toast.showToast('info', 'Download Started', 'Your receipt is being downloaded');
    // In a real implementation, this would download a receipt file
  };
  
  // Function to handle 'Contact Advertiser' button
  const confirmContactAdvertiser = () => {
    if (!reservation?.advertiser?.id) return;
    
    setModalConfig({
      title: 'Contact Advertiser',
      message: `Are you sure you want to contact ${reservation.advertiser.name}?`,
      confirmText: 'Yes, Contact Now',
      cancelText: 'Not Now',
      onConfirm: () => {
        // In a real implementation, this would open a chat with the advertiser or redirect to a message form
        toast.showToast('info', 'Contact', 'Opening chat with advertiser');
        setModalOpen(false);
      }
    });
    setModalOpen(true);
  };
  
  // Function to handle 'View Profile' button
  const handleViewProfile = () => {
    if (!reservation?.advertiser?.id) return;
    window.open(`/advertiser/${reservation.advertiser.id}`, '_blank');
  };

  // Function to read cancellation policy
  const handleReadCancellationPolicy = () => {
    window.open('/cancellation-policy', '_blank');
  };

  // Function to handle 'Contact Support' button
  const confirmContactSupport = () => {
    setModalConfig({
      title: 'Contact Support',
      message: 'Do you want to contact our support team for assistance?',
      confirmText: 'Yes, Contact Support',
      cancelText: 'Not Now',
      onConfirm: () => {
        window.open('/help', '_blank');
        setModalOpen(false);
      }
    });
    setModalOpen(true);
  };
  
  // Function to handle resubmit request for cancellation
  const confirmResubmitCancellation = () => {
    if (!reservation) return;
    
    setModalConfig({
      title: 'Resubmit Cancellation Request',
      message: 'Would you like to resubmit your cancellation request with additional information?',
      confirmText: 'Yes, Resubmit',
      cancelText: 'Not Now',
      onConfirm: () => navigate('/dashboard/user/cancellation-request?reservationId=' + reservation.reservation.id)
    });
    setModalOpen(true);
  };

  // Function to calculate expiry time (24 hours after updatedAt)
  const calculateExpiryTime = (timestamp: Date | FirestoreTimestamp | string | undefined): Date | null => {
    if (!timestamp) return null;
    
    try {
      let dateObj: Date;
      
      // Convert the timestamp to a Date object
      if (timestamp instanceof Date) {
        dateObj = new Date(timestamp);
      } 
      else if (typeof timestamp === 'object' && 'seconds' in timestamp) {
        dateObj = new Date((timestamp as FirestoreTimestamp).seconds * 1000);
      }
      else {
        dateObj = new Date(timestamp as string);
      }
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        console.error('Invalid date in calculateExpiryTime:', timestamp);
        return null;
      }
      
      // Add 24 hours to the timestamp
      const expiryTime = new Date(dateObj.getTime() + (24 * 60 * 60 * 1000));
      return expiryTime;
    } catch (error) {
      console.error('Error calculating expiry time:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <ReservationStatusContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          Loading reservation details...
        </div>
      </ReservationStatusContainer>
    );
  }
  
  if (error) {
    return (
      <ReservationStatusContainer>
        <div style={{ textAlign: 'center', padding: '3rem', color: Theme.colors.error }}>
          Error: {error}
        </div>
      </ReservationStatusContainer>
    );
  }
  
  if (!reservation) {
    return (
      <ReservationStatusContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          Reservation not found
        </div>
      </ReservationStatusContainer>
    );
  }

  // Determine which status to show based on status parameter and actual reservation status
  const determineStatus = () => {
    return reservation.reservation.status;
  };

  const currentStatus = determineStatus();
  
  // Get the reservation status
  const status = reservation.reservation.status;
  const propertyTitle = reservation.property?.title || "Property";
  const moveInDate = formatDate(reservation.reservation.scheduledDate);
  const lengthOfStay = "1 month"; // This would typically come from the reservation data
  
  // Reservation details for display
  const reservationDetails = {
    propertyTitle,
    propertyAddress: reservation.property ? formatAddress(reservation.property.address) : "Address not available",
    moveInDate,
    lengthOfStay,
    originalAmount: `${reservation.property?.price || 0}$`,
    serviceFee: `${reservation.property?.serviceFee || 0}$`,
    totalAmount: `${(reservation.property?.price || 0) + (reservation.property?.serviceFee || 0)}$`
  };
  
  // Render different content based on status
  return (
    <ReservationStatusContainer>
      <div className="back-button" onClick={handleBack}>
        <FaArrowLeft />
        Back to Reservations
      </div>
      
      <h1>Reservation Details</h1>
      
      <div className="main-content">
        {/* Status Card Container - Replace with appropriate status card based on status */}
        <div className="status-card-container">
          {status === 'pending' && (
            <>
              <ConfirmationRequestSentCard 
                onCancel={confirmCancel} 
              />
              <InfoCardsSection />
            </>
          )}
          
          {status === 'accepted' && (
            <ApprovedReservationWithTimer 
              onConfirmPayment={confirmPayment} 
              onCancelReservation={confirmCancel}
              expiryTime={calculateExpiryTime(reservation.reservation.updatedAt)}
            />
          )}
          
          {status === 'rejected' && (
            <ConfirmationRequestRejected />
          )}
          
          {status === 'paid' && (
            <ConfirmationYouGetThePlace 
              onMovedIn={confirmMoveIn}
              onHaveIssue={confirmRefundRequest}
            />
          )}
          
          {status === 'movedIn' && (
            <MovedInWithTimer 
              onHaveIssue={confirmRefundRequest}
              expiryTime={calculateExpiryTime(reservation.reservation.movedInAt)}
            />
          )}
          
          {(status === 'cancellationUnderReview') && (
            <CancellationRequestUnderReview 
              onContactSupport={confirmContactSupport}
            />
          )}
          
          {status === 'cancelled' && (
            <CancellationRequestApproved 
              onGoBack={() => navigate('/dashboard/user/reservations')}
            />
          )}
          
          {status === 'refundProcessing' && (
            <CancellationRefundBeingProcessed 
              onContactSupport={confirmContactSupport}
            />
          )}
          
          {status === 'refundCompleted' && (
            <CancellationRequestApproved 
              onGoBack={() => navigate('/dashboard/user/reservations')}
            />
          )}
          
          {status === 'refundFailed' && (
            <CancellationRefundCouldNotProcessed 
              onTryAgain={confirmContactSupport}
            />
          )}

          {/* Add handler for cancellation rejection if this status exists */}
          {status === 'cancellationRejected' && (
            <CancellationRequestRejected 
              onResubmit={confirmResubmitCancellation}
            />
          )}
        </div>
        
        {/* Note: Some sections below are now partially redundant with the status cards above,
           but they provide additional information that may still be useful to the user. */}
        
        {/* Additional Info Sections based on status */}
        {(status === 'accepted' || status === 'paid' || status === 'movedIn') && (
          <div className="section">
            <div className="info-card">
              <div className="card-header">
                <FaInfoCircle />
                <h3>Contact Your Advertiser</h3>
              </div>
              <p>If you need to discuss anything about your reservation or have questions about the property, you can contact the advertiser directly.</p>
              {reservation.advertiser && (
                <p style={{ marginTop: '0.5rem' }}>
                  <strong>Name:</strong> {reservation.advertiser.name}<br />
                  {reservation.advertiser.email && <><strong>Email:</strong> {reservation.advertiser.email}<br /></>}
                  {reservation.advertiser.phoneNumber && <><strong>Phone:</strong> {reservation.advertiser.phoneNumber}<br /></>}
                </p>
              )}
              <div className="card-actions">
                <PurpleButtonMB48 
                  text="Contact Advertiser" 
                  onClick={confirmContactAdvertiser}
                  disabled={processing || !reservation.advertiser}
                />
              </div>
            </div>
          </div>
        )}
      
        {status === 'rejected' && (
          <div className="section">
              <div className="info-card">
              <div className="card-header">
                <FaInfoCircle />
                <h3>What to do next?</h3>
              </div>
              <p>Unfortunately, this reservation was rejected. Don't worry, there are many other great properties available for you!</p>
              <p>Contact our customer support if you need assistance finding a suitable property that matches your needs.</p>
              <div className="card-actions" style={{ marginTop: '1rem' }}>
                <PurpleButtonMB48 
                  text="Find Other Housing" 
                  onClick={handleFindHousing}
                  disabled={processing}
                />
              </div>
            </div>
            
            <h2>Suggested Properties For You</h2>
            <div className="suggestions-section">
              <div className="suggestions-grid">
                {/* Empty grid for now - would be filled with property suggestions */}
                <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'white', borderRadius: Theme.borders.radius.lg, border: Theme.borders.primary }}>
                  Suggested properties will appear here
                </div>
              </div>
            </div>
          </div>
        )}
        
        {status === 'cancelled' && (
          <div className="section">
            <div className="info-card">
              <div className="card-header">
                <FaInfoCircle />
                <h3>Cancellation Details</h3>
              </div>
              <p>This reservation has been cancelled on {formatDate(reservation.reservation.updatedAt)}.</p>
              <p>If you need to book a new property, you can check our available listings.</p>
              <div className="card-actions" style={{ marginTop: '1rem' }}>
                <PurpleButtonMB48 
                  text="Find Other Housing" 
                  onClick={handleFindHousing}
                  disabled={processing}
                />
              </div>
            </div>
          </div>
        )}
        
        {(status === 'refundProcessing' || status === 'cancellationUnderReview') && (
          <div className="section">
            <div className="info-card">
              <div className="card-header">
                <FaClock />
                <h3>{status === 'refundProcessing' ? 'Refund Processing' : 'Cancellation Under Review'}</h3>
              </div>
              <p>Your request is being processed. This usually takes 3-5 business days. We'll keep you updated on the status.</p>
              <p>If you have any questions, please contact our customer support.</p>
            </div>
          </div>
        )}
        
        {status === 'refundCompleted' && (
          <div className="section">
            <div className="info-card">
              <div className="card-header">
                <FaReceipt />
                <h3>Refund Completed</h3>
        </div>
              <p>Your refund has been processed successfully on {formatDate(reservation.reservation.updatedAt)}.</p>
              <p>The funds should appear in your account within 5-7 business days, depending on your bank's processing time.</p>
              <div className="card-actions">
                <BpurpleButtonMB48 
                  text="Download Receipt" 
                  onClick={handleDownloadReceipt}
                />
              </div>
            </div>
            </div>
        )}
        
        {status === 'refundFailed' && (
          <div className="section">
            <div className="info-card">
              <div className="card-header">
                <FaInfoCircle />
                <h3>Refund Failed</h3>
              </div>
              <p>There was an issue processing your refund. This could be due to:</p>
              <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                <li>Payment method issues</li>
                <li>Bank processing errors</li>
                <li>Verification requirements</li>
              </ul>
              <p style={{ marginTop: '0.5rem' }}>Please contact our customer support for assistance.</p>
            </div>
          </div>
        )}
        
        {/* Room details section - for paid and moved in statuses */}
        {(status === 'paid' || status === 'movedIn' || status === 'refundProcessing' || 
          status === 'refundCompleted' || status === 'refundFailed') && (
          <>
            <h2>Property Details</h2>
            <div className="room-details">
              {reservation.property?.rooms ? (
                reservation.property.rooms.map((room, index) => (
                  <div className="room-card" key={index}>
                    {room.type === 'bedroom' && <MdBed />}
                    {room.type === 'bathroom' && <MdBathtub />}
                    {room.type === 'kitchen' && <MdKitchen />}
                    {room.type === 'living' && <MdChair />}
                    <div className="room-info">
                      <div className="room-type">{room.type.charAt(0).toUpperCase() + room.type.slice(1)}</div>
                      <div className="room-size">{room.area} m²</div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="room-card">
                    <MdBed />
                    <div className="room-info">
                      <div className="room-type">Bedroom</div>
                      <div className="room-size">10 m²</div>
                    </div>
                  </div>
                  <div className="room-card">
                    <MdKitchen />
                    <div className="room-info">
                      <div className="room-type">Kitchen</div>
                      <div className="room-size">10 m²</div>
                    </div>
                  </div>
                  <div className="room-card">
                    <MdChair />
                    <div className="room-info">
                      <div className="room-type">Living Room</div>
                      <div className="room-size">10 m²</div>
                    </div>
                  </div>
                  <div className="room-card">
                    <MdBathtub />
                    <div className="room-info">
                      <div className="room-type">Bathroom</div>
                      <div className="room-size">10 m²</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
        
        {/* Booking details section - for all statuses except pending */}
        {status !== 'pending' && (
          <BookingDetailsComponent
            personalDetails={{
              // Include basic reservation details that are user-friendly
              requestType: reservation.reservation.requestType,
              
              // Include all relevant reservation data, filtering developer info
              ...Object.fromEntries(
                Object.entries(reservation.reservation)
                  .filter(([key, value]) => {
                    // Define fields to exclude (developer-only, system fields, timestamps handled separately)
                    const developerFields = [
                      'id', 'status', 'propertyId', 'movedIn', 'advertiserId', 'clientId',
                      'createdAt', 'updatedAt', 'scheduledDate', 'movedInAt', 'userId', 
                      'messageId', 'activityId', 'batchId', 'transactionId', 'message', 
                      'requestType', '__typename'
                    ];
                    
                    // Keep all fields that aren't developer-only and have values
                    return !developerFields.includes(key) && 
                           value !== undefined && 
                           value !== null;
                  })
              ),
              
              // Format important dates correctly
              ...(reservation.reservation.scheduledDate && {
                moveInDate: formatDate(reservation.reservation.scheduledDate)
              })
            }}
            otherDetails={{
              // Only include user-friendly property details
              propertyTitle: reservation.property?.title,
              propertyAddress: reservation.property ? formatAddress(reservation.property.address) : undefined,
              monthlyRent: reservation.property?.price ? `${reservation.property.price}$` : undefined,
              securityDeposit: reservation.property?.deposit ? `${reservation.property.deposit}$` : undefined,
              serviceFee: reservation.property?.serviceFee ? `${reservation.property.serviceFee}$` : undefined,
              
              // Include property features in a readable format
              ...(reservation.property?.features && { 
                features: Array.isArray(reservation.property.features) 
                  ? reservation.property.features.join(', ') 
                  : (typeof reservation.property.features === 'object' ? Object.keys(reservation.property.features).join(', ') : String(reservation.property.features))
              }),
              
              // Only include room count, not detailed room info (shown elsewhere)
              ...(reservation.property?.rooms && {
                roomCount: reservation.property.rooms.length
              })
            }}
            message={reservation.reservation.message}
          />
      )}
      </div>
      
      {/* Sidebar with property details */}
      <div className="sidebar">
        <CheckoutCard 
          title={propertyTitle}
          image={reservation.property?.images?.[0] || "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"}
          moveInDate={moveInDate}
          lengthOfStay={lengthOfStay}
          profileImage={reservation.advertiser?.profilePicture || "https://ui-avatars.com/api/?name=Leonardo+V"}
          profileName={reservation.advertiser?.name || "Leonardo V."}
          monthlyRent={reservationDetails.originalAmount}
          securityDeposit={`${reservation.property?.deposit || 0}$`}
          serviceFee={reservationDetails.serviceFee}
          total={reservationDetails.totalAmount}
          onViewProfile={handleViewProfile}
          onReadCancellationPolicy={handleReadCancellationPolicy}
        />
        
        
        
        
       
              </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        isLoading={processing}
      />
    </ReservationStatusContainer>
  );
};

export default ReservationStatusPage; 
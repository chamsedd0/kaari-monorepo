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

// Define interfaces
interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

interface Reservation {
  reservation: {
    id: string;
    requestType: string;
    status: 'pending' | 'accepted' | 'rejected' | 'paid' | 'movedIn' | 'cancelled' | 'refundProcessing' | 'refundCompleted' | 'refundFailed' | 'cancellationUnderReview';
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
  
  // Function to handle reservation cancellation
  const handleCancel = async () => {
    if (!reservation) return;
    
    try {
      setProcessing(true);
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
  
  // Function to handle payment confirmation
  const handleConfirmPayment = async () => {
    if (!reservation) return;
    
    try {
      setProcessing(true);
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
  
  // Function to handle move-in confirmation
  const handleMoveIn = async () => {
    if (!reservation) return;
    
    try {
      setProcessing(true);
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
  
  // Function to handle refund request
  const handleRequestRefund = () => {
    if (!reservation) return;
    navigate(`/dashboard/user/refund-request?reservationId=${reservation.reservation.id}`);
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
  const handleContactAdvertiser = () => {
    if (!reservation?.advertiser?.id) return;
    // In a real implementation, this would open a chat with the advertiser or redirect to a message form
    toast.showToast('info', 'Contact', 'Opening chat with advertiser');
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
        {/* Status Card Container - To be filled with actual status cards later */}
        <div className="status-card-container">
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Status: {status.charAt(0).toUpperCase() + status.slice(1)}</h2>
            <p>
              {status === 'pending' && 'Your reservation request is waiting for advertiser approval.'}
              {status === 'accepted' && 'Your reservation has been accepted! Please proceed with payment.'}
              {status === 'rejected' && 'Your reservation request was not accepted by the advertiser.'}
              {status === 'paid' && 'Your payment has been processed. You can move in on the scheduled date.'}
              {status === 'movedIn' && 'You have confirmed moving in to this property.'}
              {status === 'cancelled' && 'This reservation has been cancelled.'}
              {status === 'refundProcessing' && 'Your refund request is being processed.'}
              {status === 'refundCompleted' && 'Your refund has been processed successfully.'}
              {status === 'refundFailed' && 'There was an issue processing your refund.'}
              {status === 'cancellationUnderReview' && 'Your cancellation request is being reviewed.'}
            </p>
            <p style={{ marginTop: '1rem' }}>
              Last updated: {formatDate(reservation.reservation.updatedAt)}
            </p>
          </div>
        </div>
        
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
                  onClick={handleContactAdvertiser}
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
          <div className="booking-details">
            <h3>Booking Details</h3>
            <p>These are the details that were shown to your advertiser. Some information like your contact information or your surname will not be shared with the advertiser.</p>
            
            <div className="details-grid">
              {/* Display real booking details from reservation request */}
              {reservation.reservation.requestType && (
                <div className="detail-item">
                  <div className="detail-label">Request Type</div>
                  <div className="detail-value">{reservation.reservation.requestType}</div>
                </div>
      )}
      
              {/* User details - In a real implementation, these would come from the user profile or reservation data */}
              {/* Map reservation data dynamically - this assumes reservation.reservation contains booking details */}
              {Object.entries(reservation.reservation).filter(([key, value]) => {
                // Filter out internal fields or fields already displayed elsewhere
                const excludedFields = ['id', 'status', 'createdAt', 'updatedAt', 'propertyId', 'message', 'requestType', 'movedIn', 'movedInAt', 'scheduledDate'];
                return !excludedFields.includes(key) && value !== undefined && value !== null;
              }).map(([key, value]) => (
                <div className="detail-item" key={key}>
                  <div className="detail-label">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="detail-value">
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                     typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                  </div>
              </div>
              ))}
              
              {/* Display message separately as it might be longer */}
              <div className="detail-item" style={{ gridColumn: '1 / span 2' }}>
                <div className="detail-label">Message</div>
                <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{reservation.reservation.message || "-"}</div>
              </div>
              
              {/* Use a fallback if no booking details are available */}
              {Object.entries(reservation.reservation).filter(([key, value]) => {
                const excludedFields = ['id', 'status', 'createdAt', 'updatedAt', 'propertyId', 'message', 'requestType', 'movedIn', 'movedInAt', 'scheduledDate'];
                return !excludedFields.includes(key) && value !== undefined && value !== null;
              }).length === 0 && (
                <>
                  <div className="detail-item">
                    <div className="detail-label">Name</div>
                    <div className="detail-value">John</div>
            </div>
                  <div className="detail-item">
                    <div className="detail-label">Do you study or work</div>
                    <div className="detail-value">Study</div>
          </div>
                  <div className="detail-item">
                    <div className="detail-label">Gender</div>
                    <div className="detail-value">Male</div>
        </div>
                  <div className="detail-item">
                    <div className="detail-label">Institution Name</div>
                    <div className="detail-value">NYU</div>
                </div>
                  <div className="detail-item">
                    <div className="detail-label">Age</div>
                    <div className="detail-value">20 y.o.</div>
              </div>
                  <div className="detail-item">
                    <div className="detail-label">Field of Study</div>
                    <div className="detail-value">Computer Engineering</div>
            </div>
                  <div className="detail-item">
                    <div className="detail-label">Length of Stay</div>
                    <div className="detail-value">{lengthOfStay}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Funding Source</div>
                    <div className="detail-value">Salary</div>
            </div>
                  <div className="detail-item">
                    <div className="detail-label">Nationality</div>
                    <div className="detail-value">Morocco</div>
                    </div>
                  <div className="detail-item">
                    <div className="detail-label">Pets</div>
                    <div className="detail-value">Yes</div>
                    </div>
                  <div className="detail-item">
                    <div className="detail-label">Number of People</div>
                    <div className="detail-value">2</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Smoking Habits</div>
                    <div className="detail-value">No</div>
                </div>
                  <div className="detail-item">
                    <div className="detail-label">Who will you live with</div>
                    <div className="detail-value">Family</div>
              </div>
                </>
              )}
            </div>
              </div>
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
        
        {/* Cancellation Policy Table */}
        <div className="cancellation-policy">
          <table className="policy-table">
            <thead>
              <tr>
                <th>Cancel before move-in</th>
                <th>Rent refund</th>
                <th>Tenant fee refund</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>&gt; 30 days</td>
                <td>100%</td>
                <td>75%</td>
              </tr>
              <tr>
                <td>30 - 15 days</td>
                <td>100%</td>
                <td>50%</td>
              </tr>
              <tr>
                <td>14 - 8 days</td>
                <td>50%</td>
                <td>50%</td>
              </tr>
              <tr>
                <td>≤ 7 days</td>
                <td>0%</td>
                <td>50%</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Status-specific action buttons */}
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {status === 'pending' && (
            <PurpleButtonMB48 
              text={processing ? "Processing..." : "Cancel Reservation"} 
              onClick={handleCancel}
              disabled={processing}
            />
          )}
          
          {status === 'accepted' && (
            <>
              <PurpleButtonMB48 
                text={processing ? "Processing..." : "Confirm Payment"} 
                onClick={handleConfirmPayment}
                disabled={processing}
              />
              <BpurpleButtonMB48 
                text="Cancel Reservation" 
                onClick={handleCancel}
                disabled={processing}
              />
            </>
          )}
          
          {status === 'paid' && (
            <PurpleButtonMB48 
              text={processing ? "Processing..." : "I Moved In"} 
              onClick={handleMoveIn}
              disabled={processing}
            />
          )}
          
          {status === 'movedIn' && (
            <PurpleButtonMB48 
              text="Request Refund" 
              onClick={handleRequestRefund}
              disabled={processing}
            />
          )}
          
          {status === 'rejected' && (
            <PurpleButtonMB48 
              text="Find Other Housing" 
              onClick={handleFindHousing}
              disabled={processing}
            />
          )}
          
          {status === 'refundCompleted' && (
            <PurpleButtonMB48 
              text="Download Receipt" 
              onClick={handleDownloadReceipt}
              disabled={processing}
            />
          )}
          
          {status === 'refundFailed' && (
            <PurpleButtonMB48 
              text="Contact Support" 
              onClick={() => window.open('/help', '_blank')}
              disabled={processing}
            />
          )}
          
          {status === 'cancelled' && (
            <PurpleButtonMB48 
              text="Find New Housing" 
              onClick={handleFindHousing}
              disabled={processing}
            />
          )}
          
          {(status === 'refundProcessing' || status === 'cancellationUnderReview') && (
            <div style={{ textAlign: 'center', padding: '1rem', color: Theme.colors.gray2, fontSize: '0.9rem' }}>
              Your request is being processed. Please check back later for updates.
            </div>
          )}
        </div>
              </div>
    </ReservationStatusContainer>
  );
};

export default ReservationStatusPage; 
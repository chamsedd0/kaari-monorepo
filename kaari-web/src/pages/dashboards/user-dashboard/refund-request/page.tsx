import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  getClientReservations, 
  requestRefund 
} from '../../../../backend/server-actions/ClientServerActions';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import { BpurpleButtonMB48 } from '../../../../components/skeletons/buttons/border_purple_MB48';
import { RefundCard } from '../../../../components/skeletons/cards/refund-card';
import { useToastService } from '../../../../services/ToastService';

const RefundRequestContainer = styled.div`
  margin: 100px auto;
  margin-top: 120px;
  max-width: 1400px;
  
  h1 {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
    margin-bottom: 1.5rem;
  }
  
  .refund-container {
    display: flex;
    gap: 2rem;
    
    @media (max-width: 1024px) {
      flex-direction: column;
    }
    
    .form-section {
      flex: 1;
      background-color: white;
      border-radius: ${Theme.borders.radius.lg};
      
      h2 {
        font: ${Theme.typography.fonts.h4B};
        color: ${Theme.colors.black};
        margin-bottom: 1rem;
      }
      
      p {
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
        margin-bottom: 1.5rem;
      }
      
      .alert {
        background-color: #F8E5FF;
        border-radius: ${Theme.borders.radius.sm};
        padding: 1rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        
        svg {
          margin-right: 0.75rem;
          min-width: 24px;
          color: ${Theme.colors.secondary};
        }
        
        p {
          font: ${Theme.typography.fonts.smallM};
          color: ${Theme.colors.secondary};
          margin-bottom: 0;
        }
      }
      
      .reason-section {
        margin-bottom: 1.5rem;
        width: 100%;
        
        .reason-label {
          font: ${Theme.typography.fonts.mediumB};
          color: ${Theme.colors.black};
          margin-bottom: 0.75rem;
        }
        
        .checkbox-option {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.75rem;

          * {
            transition: all 0.3s ease;
          }
          
          input[type="checkbox"] {
            appearance: none;
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 4px;
            border: 2px solid ${Theme.colors.gray};
            margin-right: 0.75rem;
            outline: none;
            position: relative;
            cursor: pointer;
            margin-top: 2px;
            
            &:checked {
              border-color: ${Theme.colors.secondary};
              background-color: ${Theme.colors.secondary};
              
              &:after {
                content: "✓";
                position: absolute;
                color: white;
                font-size: 14px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              }
            }
            
            &:hover {
              border-color: ${Theme.colors.secondary};
            }
          }
          
          label {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.black};
            display: flex;
            flex-direction: column;
            cursor: pointer;
            
            .proof-required {
              font: ${Theme.typography.fonts.smallB};
              color: ${Theme.colors.secondary};
              margin-top: 0.25rem;
            }
            
            .description {
              font: ${Theme.typography.fonts.smallM};
              color: ${Theme.colors.gray2};
              margin-top: 0.25rem;
            }
          }
        }
      }
      
      .reason-detail {
        width: 100%;
        margin-bottom: 1.5rem;
        
        .detail-label {
          font: ${Theme.typography.fonts.mediumB};
          color: ${Theme.colors.black};
          margin-bottom: 0.75rem;
        }
        
        textarea {
          width: 100%;
          min-height: 120px;
          padding: 1rem;
          border-radius: ${Theme.borders.radius.sm};
          border: 1px solid ${Theme.colors.gray};
          font: ${Theme.typography.fonts.mediumM};
          resize: none;
          
          &:focus {
            outline: none;
            border-color: ${Theme.colors.secondary};
          }
        }
      }
      
      .upload-section {
        width: 100%;
        margin-bottom: 1.5rem;
        
        .upload-label {
          font: ${Theme.typography.fonts.mediumB};
          color: ${Theme.colors.black};
          margin-bottom: 0.75rem;
        }
        
        .upload-area {
          border: 2px dashed ${Theme.colors.secondary}30;
          border-radius: ${Theme.borders.radius.sm};
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background-color: #F8E5FF50;
          min-height: 120px;
          
          &:hover {
            border-color: ${Theme.colors.secondary};
            background-color: #F8E5FF80;
          }
          
          p {
            font: ${Theme.typography.fonts.smallM};
            color: ${Theme.colors.gray2};
            margin-bottom: 0.5rem;
            text-align: center;
          }
          
          .info {
            font: ${Theme.typography.fonts.smallM};
            color: ${Theme.colors.gray2};
            margin-bottom: 0.75rem;
          }
          
          .browse-button {
            margin-top: 0.5rem;
            background-color: ${Theme.colors.secondary};
            color: white;
            border: none;
            border-radius: ${Theme.borders.radius.sm};
            padding: 0.5rem 1.5rem;
            font: ${Theme.typography.fonts.smallB};
            cursor: pointer;
            transition: all 0.3s ease;
            
            &:hover {
              background-color: ${Theme.colors.primary};
            }
          }
        }
        
        .uploaded-files {
          margin-top: 0.75rem;
          
          ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
            
            li {
              font: ${Theme.typography.fonts.smallM};
              color: ${Theme.colors.gray2};
              margin-bottom: 0.25rem;
              display: flex;
              align-items: center;
              
              &:before {
                content: "•";
                margin-right: 0.5rem;
                color: ${Theme.colors.secondary};
              }
            }
          }
        }
      }
      
      .action-buttons {
        display: flex;
        justify-content: flex-start;
        gap: 16px;
        margin-top: 2rem;
        flex-direction: row;
        
        button {
          max-width: 188px;
          width: 100%;
        }
      }
    }
    
    .refund-section {
      flex: 1;
      max-width: 400px;
      
      @media (max-width: 1024px) {
        max-width: 100%;
      }
    }
  }
`;

const RefundRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToastService();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<any | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [reasonDetails, setReasonDetails] = useState('');
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const reservationId = queryParams.get('reservationId');
  
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
        setReservation(foundReservation);
      } catch (err: any) {
        console.error('Error loading reservation details:', err);
        setError(err.message || 'Failed to load reservation details');
      } finally {
        setLoading(false);
      }
    };
    
    loadReservationDetails();
  }, [reservationId]);
  
  const handleBack = () => {
    navigate('/dashboard/user/reservations');
  };
  
  const handleReasonChange = (reason: string) => {
    setSelectedReasons(prev => {
      if (prev.includes(reason)) {
        return prev.filter(r => r !== reason);
      } else {
        return [...prev, reason];
      }
    });
  };
  
  const handleUploadClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*, application/pdf';
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const filesArray: File[] = [];
        for (let i = 0; i < target.files.length; i++) {
          filesArray.push(target.files[i]);
        }
        setProofFiles([...proofFiles, ...filesArray]);
      }
    };
    fileInput.click();
  };
  
  const handleSubmit = async () => {
    if (selectedReasons.length === 0) {
      toast.showToast('error', 'Missing Information', 'Please select at least one reason for the refund request');
      return;
    }
    
    if (needsProof() && proofFiles.length === 0) {
      toast.showToast('error', 'Missing Information', 'Please upload proof for your refund request');
      return;
    }
    
    if (!reasonDetails.trim()) {
      toast.showToast('error', 'Missing Information', 'Please provide details about your refund request');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Show initial processing toast
      toast.showToast('info', 'Processing', 'Submitting your refund request...');
      
      // Calculate refund amounts for submission
      const propertyPrice = reservation.property.price;
      const serviceFee = reservation.reservation?.serviceFee || 
                         reservation.property.serviceFee || 
                         (propertyPrice * 0.1);
      const refundableRent = propertyPrice * 0.5;
      
      // Call the refund request function with comprehensive data
      await requestRefund(reservationId!, {
        reasons: selectedReasons,
        details: reasonDetails,
        proofUrls: [], // Empty array as we're now passing the files directly
        proofFiles: proofFiles, // Pass the actual File objects for secure upload
        originalAmount: propertyPrice,
        serviceFee: serviceFee,
        refundAmount: refundableRent,
        reasonsText: selectedReasons.join(', ')
      });
      
      // Show success toast
      toast.showToast('success', 'Refund Requested', 'Your refund request has been submitted for review and your reservation status has been updated to "Refund Processing"');
      
      // Navigate back to dashboard
      navigate('/dashboard/reservations');
    } catch (error) {
      console.error('Error submitting refund request:', error);
      toast.showToast('error', 'Submission Error', getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };
  
  // Check if any selected reason requires proof
  const needsProof = () => {
    // All reasons require proof after move-in
    return selectedReasons.length > 0;
  };
  
  const formatDate = (date: any) => {
    if (!date) return 'Not set';
    
    try {
      let dateObj: Date;
      
      if (date instanceof Date) {
        dateObj = date;
      } 
      else if (typeof date === 'object' && 'seconds' in date) {
        dateObj = new Date(date.seconds * 1000);
      }
      else {
        dateObj = new Date(date);
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
  
  // Calculate refund amount based on property price and service fee
  const calculateRefund = () => {
    if (!reservation?.property?.price) return { 
      originalAmount: '0$', 
      serviceFee: '0$', 
      cancellationFee: '0$', 
      refundTotal: '0$' 
    };
    
    // Get the rent amount from property price
    const propertyPrice = reservation.property.price;
    
    // Get the service fee from the most accurate source available
    // 1. Paid service fee from reservation if available
    // 2. Service fee from property data
    // 3. Fallback to calculated value (10% of property price)
    const serviceFee = reservation.reservation?.serviceFee || 
                       reservation.property.serviceFee || 
                       (propertyPrice * 0.1);
    
    // Since user has already moved in, they forfeit the service fee and 50% of the rent paid
    const refundableRent = propertyPrice * 0.5; // Only 50% of rent is refundable
    const cancellationFee = serviceFee; // Service fee is forfeited (counted as cancellation fee)
    const refundAmount = refundableRent; // User gets 50% of the rent back
    
    // Log the values for debugging
    console.log('Refund calculation:', {
      propertyPrice,
      serviceFee,
      refundableRent,
      cancellationFee,
      refundAmount
    });
    
    return {
      originalAmount: `${propertyPrice}$`,
      serviceFee: `${Math.round(serviceFee)}$`,
      cancellationFee: `${Math.round(cancellationFee)}$`,
      refundTotal: `${Math.round(refundAmount)}$`
    };
  };
  
  const getRemainingTime = () => {
    if (!reservation?.reservation?.movedInAt) return null;
    
    const movedInDate = new Date(
      typeof reservation.reservation.movedInAt === 'object' && 'seconds' in reservation.reservation.movedInAt
        ? reservation.reservation.movedInAt.seconds * 1000
        : reservation.reservation.movedInAt
    );
    
    const deadline = new Date(movedInDate);
    deadline.setHours(deadline.getHours() + 24);
    
    const now = new Date();
    const diffMs = deadline.getTime() - now.getTime();
    
    if (diffMs <= 0) return null;
    
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };
  
  if (loading) {
    return (
      <RefundRequestContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          Loading reservation details...
        </div>
      </RefundRequestContainer>
    );
  }
  
  if (error) {
    return (
      <RefundRequestContainer>
        <div style={{ textAlign: 'center', padding: '3rem', color: Theme.colors.error }}>
          Error: {error}
        </div>
      </RefundRequestContainer>
    );
  }
  
  if (!reservation) {
    return (
      <RefundRequestContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          Reservation not found
        </div>
      </RefundRequestContainer>
    );
  }
  
  const { originalAmount, serviceFee, cancellationFee, refundTotal } = calculateRefund();
  const remainingTime = getRemainingTime();
  
  return (
    <RefundRequestContainer>
      <h1>Refund Request</h1>
      
      <div className="refund-container">
        <div className="form-section">
          <h2>You are requesting a refund for the property shown on this page.</h2>
          <p>Since you have already moved in, you are eligible for a partial refund if your request is submitted within 24 hours of moving in.</p>
          
          <div className="alert">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z" fill="currentColor"/>
            </svg>
            <p>
              After moving in, you may receive 50% of the rent back if you submit a valid refund request within 24 hours. The service fee is non-refundable.
              {remainingTime && <span> You have <b>{remainingTime}</b> remaining to request a refund.</span>}
            </p>
          </div>
          
          <div className="reason-section">
            <div className="reason-label">Select the reason(s) for your refund request (proof required for all selections):</div>
            
            <div className="checkbox-option">
              <input 
                type="checkbox" 
                id="property_issue" 
                checked={selectedReasons.includes('property_issue')}
                onChange={() => handleReasonChange('property_issue')}
              />
              <label htmlFor="property_issue">
                Critical property issues
                <span className="proof-required">(Proof Required)</span>
                <span className="description">Major defects with utilities, plumbing, heating, or essential appliances that make the property uninhabitable</span>
              </label>
            </div>
            
            <div className="checkbox-option">
              <input 
                type="checkbox" 
                id="misleading" 
                checked={selectedReasons.includes('misleading')}
                onChange={() => handleReasonChange('misleading')}
              />
              <label htmlFor="misleading">
                Significantly misrepresented listing
                <span className="proof-required">(Proof Required)</span>
                <span className="description">The property is substantially different from what was advertised (size, rooms, amenities)</span>
              </label>
            </div>
            
            <div className="checkbox-option">
              <input 
                type="checkbox" 
                id="safety_concern" 
                checked={selectedReasons.includes('safety_concern')}
                onChange={() => handleReasonChange('safety_concern')}
              />
              <label htmlFor="safety_concern">
                Serious safety hazards
                <span className="proof-required">(Proof Required)</span>
                <span className="description">Dangerous conditions that present immediate risks (exposed wiring, structural issues, gas leaks, etc.)</span>
              </label>
            </div>
            
            <div className="checkbox-option">
              <input 
                type="checkbox" 
                id="accessibility" 
                checked={selectedReasons.includes('accessibility')}
                onChange={() => handleReasonChange('accessibility')}
              />
              <label htmlFor="accessibility">
                Accessibility issues
                <span className="proof-required">(Proof Required)</span>
                <span className="description">The property does not meet accessibility requirements that were explicitly promised</span>
              </label>
            </div>
            
            <div className="checkbox-option">
              <input 
                type="checkbox" 
                id="unclean" 
                checked={selectedReasons.includes('unclean')}
                onChange={() => handleReasonChange('unclean')}
              />
              <label htmlFor="unclean">
                Severe unclean conditions
                <span className="proof-required">(Proof Required)</span>
                <span className="description">Property was not cleaned prior to move-in or has severe pest/sanitation issues</span>
              </label>
            </div>
            
            <div className="checkbox-option">
              <input 
                type="checkbox" 
                id="other" 
                checked={selectedReasons.includes('other')}
                onChange={() => handleReasonChange('other')}
              />
              <label htmlFor="other">
                Other critical issue
                <span className="proof-required">(Proof Required)</span>
                <span className="description">Please explain in detail below with supporting evidence</span>
              </label>
            </div>
          </div>
          
          <div className="reason-detail">
            <div className="detail-label">Provide detailed explanation and description of evidence:</div>
            <textarea 
              value={reasonDetails}
              onChange={(e) => setReasonDetails(e.target.value)}
              placeholder="Please provide specific details about the issues, when you discovered them, what evidence you're submitting, and why this makes the property uninhabitable..."
            />
          </div>
          
          <div className="upload-section">
            <div className="upload-label">Upload supporting evidence (required):</div>
            <div className="upload-area" onClick={handleUploadClick}>
              <p>Upload photos/videos showing the issues claimed in your refund request</p>
              <p className="info">Max 5 files, 25 MB each</p>
              <button className="browse-button">Browse Files</button>
            </div>
            {proofFiles.length > 0 && (
              <div className="uploaded-files">
                <ul>
                  {proofFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="action-buttons">
            <BpurpleButtonMB48 
              text="Cancel" 
              onClick={handleBack}
              disabled={submitting}
            />
            <PurpleButtonMB48 
              text={submitting ? "Processing..." : "Request Refund"}
              onClick={handleSubmit}
              disabled={submitting}
            />
          </div>
        </div>
        
        <div className="refund-section">
          <RefundCard
            title={reservation.property?.title || "Modern Apartment in Agadir"}
            image={reservation.property?.images?.[0] || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'}
            moveInDate={formatDate(reservation.reservation.scheduledDate)}
            lengthOfStay={"1 month"}
            profileImage={reservation.advertiser?.profilePicture || "https://ui-avatars.com/api/?name=Leonardo+V"}
            profileName={reservation.advertiser?.name || "Leonardo V."}
            originalAmount={originalAmount}
            serviceFee={serviceFee}
            cancellationFee={cancellationFee}
            refundTotal={refundTotal}
            daysToMoveIn={0} // User has already moved in
            onViewProfile={() => {
              if (reservation.advertiser?.id) {
                window.open(`/advertiser/${reservation.advertiser.id}`, '_blank');
              }
            }}
            onReadCancellationPolicy={() => {
              window.open('/cancellation-policy', '_blank');
            }}
          />
        </div>
      </div>
    </RefundRequestContainer>
  );
};

export default RefundRequestPage; 
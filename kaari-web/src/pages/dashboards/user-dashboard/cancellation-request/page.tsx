import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  getClientReservations, 
  cancelReservation, 
  processStandardCancellation,
  requestExceptionCancellation
} from '../../../../backend/server-actions/ClientServerActions';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import { BpurpleButtonMB48 } from '../../../../components/skeletons/buttons/border_purple_MB48';
import { RefundCard } from '../../../../components/skeletons/cards/refund-card';
import { useToastService } from '../../../../services/ToastService';

const CancellationRequestContainer = styled.div`
  margin: 100px auto;
  margin-top: 120px;
  max-width: 1400px;
  
  h1 {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
    margin-bottom: 1.5rem;
  }
  
  .cancellation-container {
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
      
      .reason-refund-container {
        display: flex;
        gap: 20px;
        width: 100%;
        margin-bottom: 1.5rem;
        
        @media (max-width: 768px) {
          flex-direction: column;
        }
      }
      
      .reason-options {
        margin-bottom: 0;
        flex: 1;
        
        @media (max-width: 768px) {
          margin-bottom: 1.5rem;
        }
        
        .reason-label {
          font: ${Theme.typography.fonts.mediumB};
          color: ${Theme.colors.black};
          margin-bottom: 0.75rem;
        }
        
        .option {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;

          * {
            transition: all 0.3s ease;
          }
          
          input[type="radio"] {
            appearance: none;
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid ${Theme.colors.gray};
            margin-right: 0.75rem;
            outline: none;
            position: relative;
            cursor: pointer;
            
            &:checked {
              border-color: ${Theme.colors.secondary};
              
              &:after {
                content: "";
                position: absolute;
                width: 12px;
                height: 12px;
                background-color: ${Theme.colors.secondary};
                border-radius: 50%;
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
            align-items: center;
            cursor: pointer;
            
            .proof-required {
              font: ${Theme.typography.fonts.smallB};
              color: ${Theme.colors.secondary};
              margin-left: 0.5rem;
            }
            
            .proof-not-required {
              font: ${Theme.typography.fonts.smallB};
              color: ${Theme.colors.gray2};
              margin-left: 0.5rem;
            }
          }
        }
      }

      .refund-table-container {
        margin: 0;
        padding: 0px;
        border: ${Theme.borders.primary};
        border-radius: ${Theme.borders.radius.md};
        background-color: white;
        flex: 1;
      }
      
      .refund-table {
        width: 100%;
        border-collapse: collapse;
        border-radius: 8px;
        overflow: hidden;
        
        th, td {
          padding: 12px;
          text-align: center;
          border: none;
        }
        
        th {
          font: ${Theme.typography.fonts.smallB};
          color: ${Theme.colors.black};
          padding-bottom: 8px;
        }
        
        td {
          font: ${Theme.typography.fonts.smallM};
          color: ${Theme.colors.gray2};
          
          &.percentage {
            font: ${Theme.typography.fonts.smallM};
            color: ${Theme.colors.gray2};
          }
        }
        
        tr:not(:last-child) td {
          border-bottom: 1px solid ${Theme.colors.gray}10;
        }
      }
      
      .reason-detail {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease, opacity 0.3s ease, margin 0.3s ease;
        opacity: 0;
        margin-bottom: 0;
        flex: 1;
        
        &.visible {
          max-height: 250px;
          opacity: 1;
          margin-bottom: 0;
        }
        
        .detail-label {
          font: ${Theme.typography.fonts.mediumB};
          color: ${Theme.colors.black};
          margin-bottom: 0.75rem;
        }
        
        textarea {
          width: 100%;
          min-height: 120px;
          height: calc(100% - 30px);
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
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease, opacity 0.3s ease, margin 0.3s ease;
        opacity: 0;
        margin-bottom: 0;
        flex: 1;
        
        &.visible {
          max-height: 250px;
          opacity: 1;
          margin-bottom: 0;
        }
        
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
          height: calc(100% - 30px); /* Account for the label height */
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
          }
          
          .browse-button {
            margin-top: 0.75rem;
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
      
      .detail-upload-container {
        display: flex;
        flex-direction: row;
        gap: 20px;
        margin-bottom: 1.5rem;
        width: 100%;
        transition: all 0.3s ease;
        height: auto;
        min-height: 0;
        
        &.empty {
          height: 0;
          margin: 0;
          overflow: hidden;
        }
      }

      /* CSS classes for animation */
      .animated-section {
        transition: opacity 0.5s ease, width 0.5s ease;
        opacity: 0;
        max-height: 0;
        height: 0;
        overflow: hidden;
        width: 0;
        flex: 0;
        margin: 0;
        padding: 0;
        flex-basis: 0;
        pointer-events: none;
        position: relative;
      }
      
      .animated-section.visible {
        opacity: 1;
        height: auto;
        max-height: 250px;
        min-height: 250px;
        width: 100%;
        flex: 1;
        padding: 0;
        margin: 0;
        flex-basis: 100%;
        pointer-events: all;
      }

      .animated-section.half-width {
        width: 50%;
        flex-basis: 50%;
      }
      
      .reason-detail, .upload-section {
        height: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
      }
      
      .reason-detail .detail-label, .upload-section .upload-label {
        height: 30px;
        margin-bottom: 0.75rem;
        font: ${Theme.typography.fonts.mediumB};
        color: ${Theme.colors.black};
        box-sizing: border-box;
      }
      
      .reason-detail textarea {
        height: calc(100% - 40px);
        min-height: 120px;
        flex-grow: 1;
        box-sizing: border-box;
      }
      
      .upload-section .upload-area {
        height: calc(100% - 40px);
        min-height: 120px;
        flex-grow: 1;
        box-sizing: border-box;
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

const CancellationRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToastService();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<any | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [reasonDetails, setReasonDetails] = useState('');
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  // States for animation control
  const [showReasonDetail, setShowReasonDetail] = useState(true);
  const [showUploadSection, setShowUploadSection] = useState(true);
  const [reasonAnimating, setReasonAnimating] = useState(true);
  const [uploadAnimating, setUploadAnimating] = useState(true);
  
  // Initialize states when component loads
  useEffect(() => {
    // Set initial states
    const initialNeedsReasonDetail = !selectedReason || selectedReason === 'extenuating' || selectedReason === 'other';
    const initialNeedsUpload = !selectedReason || selectedReason === 'extenuating';
    
    setReasonAnimating(initialNeedsReasonDetail);
    setUploadAnimating(initialNeedsUpload);
    setShowReasonDetail(initialNeedsReasonDetail);
    setShowUploadSection(initialNeedsUpload);
  }, []);
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const reservationId = queryParams.get('reservationId');
  
  // Update visibility states when reason changes
  useEffect(() => {
    const needsReasonDetail = needsReview() || !selectedReason;
    const needsUpload = selectedReason === 'extenuating' || !selectedReason;
    
    // Set animation state first
    setReasonAnimating(needsReasonDetail);
    setUploadAnimating(needsUpload);
    
    // Ensure the sections are visible when they should be
    if (needsReasonDetail) {
      setShowReasonDetail(true);
    }
    
    if (needsUpload) {
      setShowUploadSection(true);
    }
  }, [selectedReason]);
  
  // Handle animation end for reason detail
  const handleReasonTransitionEnd = (e: React.TransitionEvent) => {
    // Only process if the event is for this element directly
    if (e.target !== e.currentTarget) return;
    
    // Only hide if it should be hidden
    if (!needsReview() && selectedReason && !reasonAnimating) {
      setShowReasonDetail(false);
    }
  };
  
  // Handle animation end for upload section
  const handleUploadTransitionEnd = (e: React.TransitionEvent) => {
    // Only process if the event is for this element directly
    if (e.target !== e.currentTarget) return;
    
    // Only hide if it should be hidden
    if (selectedReason !== 'extenuating' && selectedReason && !uploadAnimating) {
      setShowUploadSection(false);
    }
  };
  
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
  
  const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedReason(e.target.value);
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
    if (!selectedReason) {
      toast.showToast('error', 'Missing Information', 'Please select a reason for cancellation');
      return;
    }
    
    if (selectedReason === 'extenuating' && !proofFiles.length) {
      toast.showToast('error', 'Missing Information', 'Please upload proof for extenuating circumstances');
      return;
    }
    
    if (needsReview() && !reasonDetails.trim()) {
      toast.showToast('error', 'Missing Information', 'Please provide details about your cancellation reason');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const refundAmounts = calculateRefundAmounts();
      
      // Handle the cancellation based on whether it needs review or not
      if (needsReview()) {
        // Upload files first if there are any
        let fileUrls: string[] = [];
        
        if (proofFiles.length > 0) {
          // In a real implementation, you would upload the files
          // and get back their URLs
          fileUrls = proofFiles.map(file => `fake-url-for-${file.name}`);
        }
        
        // For reasons that need review (extenuating or other)
        await requestExceptionCancellation({
          reservationId: reservationId!,
          reason: selectedReason,
          details: reasonDetails,
          proofUrls: fileUrls,
          daysToMoveIn,
          refundAmount: refundAmounts.refundAmount,
          originalAmount: refundAmounts.originalAmount,
          serviceFee: refundAmounts.serviceFee,
          cancellationFee: refundAmounts.cancellationFee
        });
        
        toast.showToast('success', 'Request Submitted', 'Your cancellation request has been submitted for review');
      } else {
        // For standard cancellation reasons (plans change, payment issues, alternative found)
        await processStandardCancellation({
          reservationId: reservationId!,
          reason: selectedReason,
          daysToMoveIn,
          refundAmount: refundAmounts.refundAmount,
          originalAmount: refundAmounts.originalAmount,
          serviceFee: refundAmounts.serviceFee,
          cancellationFee: refundAmounts.cancellationFee
        });
        
        toast.showToast('success', 'Cancellation Processed', 'Your cancellation has been processed and refund will be issued');
      }
      
      // Navigate back to reservations page
      navigate('/dashboard/user/reservations');
    } catch (error: any) {
      console.error('Error submitting cancellation request:', error);
      toast.showToast('error', 'Submission Failed', `Failed to submit cancellation request: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Determine if this cancellation requires review
  const needsReview = () => {
    return selectedReason === 'extenuating' || selectedReason === 'other';
  };
  
  // Get the appropriate button text based on the selected reason
  const getButtonText = () => {
    if (!selectedReason) return 'Cancel Reservation';
    
    return needsReview() ? 'Request Exception' : 'Cancel Reservation';
  };
  
  const calculateDaysToMoveIn = () => {
    if (!reservation?.reservation?.scheduledDate) return 0;
    
    const scheduledDate = new Date(
      typeof reservation.reservation.scheduledDate === 'object' && 'seconds' in reservation.reservation.scheduledDate
        ? reservation.reservation.scheduledDate.seconds * 1000
        : reservation.reservation.scheduledDate
    );
    
    const now = new Date();
    const diffTime = scheduledDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  const calculateRefund = () => {
    if (!reservation?.property?.price) return { 
      originalAmount: '0$', 
      serviceFee: '0$', 
      cancellationFee: '0$', 
      refundTotal: '0$' 
    };
    
    const propertyPrice = reservation.property.price;
    const serviceFee = propertyPrice * 0.1; // Assuming service fee is 10% of property price
    const daysToMoveIn = calculateDaysToMoveIn();
    
    let refundRate = 0;
    let tenantFeeRefundRate = 0;
    
    if (daysToMoveIn > 30) {
      refundRate = 1.0; // 100%
      tenantFeeRefundRate = 0.75; // 75%
    } else if (daysToMoveIn > 15) {
      refundRate = 1.0; // 100%
      tenantFeeRefundRate = 0.5; // 50%
    } else if (daysToMoveIn > 7) {
      refundRate = 0.5; // 50%
      tenantFeeRefundRate = 0.5; // 50%
    } else {
      refundRate = 0; // 0%
      tenantFeeRefundRate = 0.5; // 50%
    }
    
    const originalAmount = propertyPrice;
    const refundableServiceFee = serviceFee * tenantFeeRefundRate;
    const cancellationFee = serviceFee - refundableServiceFee;
    const refundAmount = (originalAmount * refundRate) + refundableServiceFee - cancellationFee;
    
    return {
      originalAmount: `${originalAmount}$`,
      serviceFee: `${Math.round(serviceFee)}$`,
      cancellationFee: `${Math.round(cancellationFee)}$`,
      refundTotal: `${Math.round(refundAmount)}$`
    };
  };
  
  const calculateRefundAmounts = () => {
    if (!reservation?.property?.price) return { 
      originalAmount: 0, 
      serviceFee: 0, 
      cancellationFee: 0, 
      refundAmount: 0 
    };
    
    const propertyPrice = reservation.property.price;
    const serviceFee = propertyPrice * 0.1; // Assuming service fee is 10% of property price
    const daysToMoveIn = calculateDaysToMoveIn();
    
    let refundRate = 0;
    let tenantFeeRefundRate = 0;
    
    if (daysToMoveIn > 30) {
      refundRate = 1.0; // 100%
      tenantFeeRefundRate = 0.75; // 75%
    } else if (daysToMoveIn > 15) {
      refundRate = 1.0; // 100%
      tenantFeeRefundRate = 0.5; // 50%
    } else if (daysToMoveIn > 7) {
      refundRate = 0.5; // 50%
      tenantFeeRefundRate = 0.5; // 50%
    } else {
      refundRate = 0; // 0%
      tenantFeeRefundRate = 0.5; // 50%
    }
    
    const originalAmount = propertyPrice;
    const refundableServiceFee = serviceFee * tenantFeeRefundRate;
    const cancellationFee = serviceFee - refundableServiceFee;
    const refundAmount = (originalAmount * refundRate) + refundableServiceFee - cancellationFee;
    
    return {
      originalAmount: Math.round(originalAmount),
      serviceFee: Math.round(serviceFee),
      cancellationFee: Math.round(cancellationFee),
      refundAmount: Math.round(refundAmount)
    };
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
  
  if (loading) {
    return (
      <CancellationRequestContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          Loading reservation details...
        </div>
      </CancellationRequestContainer>
    );
  }
  
  if (error) {
    return (
      <CancellationRequestContainer>
        <div style={{ textAlign: 'center', padding: '3rem', color: Theme.colors.error }}>
          Error: {error}
        </div>
      </CancellationRequestContainer>
    );
  }
  
  if (!reservation) {
    return (
      <CancellationRequestContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          Reservation not found
        </div>
      </CancellationRequestContainer>
    );
  }
  
  const { originalAmount, serviceFee, cancellationFee, refundTotal } = calculateRefund();
  const daysToMoveIn = calculateDaysToMoveIn();
  
  return (
    <CancellationRequestContainer>
      <h1>Cancellation Request</h1>
      
      <div className="cancellation-container">
        <div className="form-section">
          <h2>You are cancelling a reservation on the property shown on this page.</h2>
          <p>Select a reason for your cancellation and, if needed, provide proof of your reason.</p>
          
          <div className="alert">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z" fill="currentColor"/>
            </svg>
            <p>Please provide truthful and accurate information. False claims may lead to account suspension.</p>
          </div>
          
          <div className="reason-refund-container">
            <div className="reason-options">
              <div className="reason-label">Select a reason for your cancellation:</div>
              
              <div className="option">
                <input 
                  type="radio" 
                  id="extenuating" 
                  name="reason" 
                  value="extenuating"
                  checked={selectedReason === 'extenuating'}
                  onChange={handleReasonChange}
                />
                <label htmlFor="extenuating">
                  Extenuating circumstance
                  <span className="proof-required">(Proof Required)</span>
                </label>
              </div>
              
              <div className="option">
                <input 
                  type="radio" 
                  id="plans" 
                  name="reason" 
                  value="plans"
                  checked={selectedReason === 'plans'}
                  onChange={handleReasonChange}
                />
                <label htmlFor="plans">
                  Plans Change
                  <span className="proof-not-required">(Proof is not Required)</span>
                </label>
              </div>
              
              <div className="option">
                <input 
                  type="radio" 
                  id="payment" 
                  name="reason" 
                  value="payment"
                  checked={selectedReason === 'payment'}
                  onChange={handleReasonChange}
                />
                <label htmlFor="payment">
                  Couldn't secure payment
                  <span className="proof-not-required">(Proof is not Required)</span>
                </label>
              </div>
              
              <div className="option">
                <input 
                  type="radio" 
                  id="alternative" 
                  name="reason" 
                  value="alternative"
                  checked={selectedReason === 'alternative'}
                  onChange={handleReasonChange}
                />
                <label htmlFor="alternative">
                  Alternative found
                  <span className="proof-not-required">(Proof is not Required)</span>
                </label>
              </div>
              
              <div className="option">
                <input 
                  type="radio" 
                  id="other" 
                  name="reason" 
                  value="other"
                  checked={selectedReason === 'other'}
                  onChange={handleReasonChange}
                />
                <label htmlFor="other">
                  Other
                  <span className="proof-not-required">(If needed)</span>
                </label>
              </div>
            </div>

            <div className="refund-table-container">
              <table className="refund-table">
                <thead>
                  <tr>
                    <th>Cancel before move-in</th>
                    <th>Rent refund</th>
                    <th>Tenant fee refund</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{"> 30 days"}</td>
                    <td className="percentage">100%</td>
                    <td className="percentage">75%</td>
                  </tr>
                  <tr>
                    <td>30 - 15 days</td>
                    <td className="percentage">100%</td>
                    <td className="percentage">50%</td>
                  </tr>
                  <tr>
                    <td>14 - 8 days</td>
                    <td className="percentage">50%</td>
                    <td className="percentage">50%</td>
                  </tr>
                  <tr>
                    <td>≤ 7 days</td>
                    <td className="percentage">0%</td>
                    <td className="percentage">50%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className={`detail-upload-container ${!showReasonDetail && !showUploadSection ? 'empty' : ''}`}>
            {showReasonDetail && (
              <div 
                className={`reason-detail animated-section ${reasonAnimating ? 'visible' : ''} ${(showUploadSection && uploadAnimating) ? 'half-width' : ''}`}
                onTransitionEnd={handleReasonTransitionEnd}
              >
                <div className="detail-label">Tell us your reason of cancellation here...</div>
                <textarea 
                  value={reasonDetails}
                  onChange={(e) => setReasonDetails(e.target.value)}
                  placeholder="Please provide detailed information about your reason for cancellation..."
                />
              </div>
            )}
            
            {showUploadSection && (
              <div 
                className={`upload-section animated-section ${uploadAnimating ? 'visible' : ''} ${(showReasonDetail && reasonAnimating) ? 'half-width' : ''}`}
                onTransitionEnd={handleUploadTransitionEnd}
              >
                <div className="upload-label">Drop files here to upload...</div>
                <div className="upload-area" onClick={handleUploadClick}>
                  <p>photos/videos, max 5 files, 25 MB each</p>
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
            )}
          </div>
          
          <div className="action-buttons">
            <BpurpleButtonMB48 
              text="Cancel" 
              onClick={handleBack}
            />
            <PurpleButtonMB48 
              text={getButtonText()}
              onClick={handleSubmit}
              disabled={submitting}
            />
          </div>
        </div>
        
        <div className="refund-section">
          <RefundCard
            title={reservation.property?.title || "Modern Apartment in Agadir"}
            image={'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'}
            moveInDate={formatDate(reservation.reservation.scheduledDate)}
            lengthOfStay={"1 month"}
            profileImage={"https://ui-avatars.com/api/?name=Leonardo+V"}
            profileName={reservation.advertiser?.name || "Leonardo V."}
            originalAmount={originalAmount}
            serviceFee={serviceFee}
            cancellationFee={cancellationFee}
            refundTotal={refundTotal}
            daysToMoveIn={daysToMoveIn}
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
    </CancellationRequestContainer>
  );
};

export default CancellationRequestPage; 
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { createCheckoutReservation } from '../../backend/server-actions/CheckoutServerActions';
import referralService from '../../services/ReferralService';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import LoadingScreen from '../../components/loading/LoadingScreen';

const PaymentCallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  
  .status-icon {
    font-size: 5rem;
    margin-bottom: 1.5rem;
    
    &.loading {
      color: ${Theme.colors.secondary};
      animation: spin 1.5s linear infinite;
    }
    
    &.success {
      color: ${Theme.colors.success};
    }
    
    &.error {
      color: ${Theme.colors.error};
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
  
  .status-title {
    font: ${Theme.typography.fonts.h3B};
    color: ${Theme.colors.black};
    margin-bottom: 1rem;
  }
  
  .status-message {
    font: ${Theme.typography.fonts.largeM};
    color: ${Theme.colors.gray2};
    margin-bottom: 2rem;
    max-width: 600px;
  }
  
  .card {
    background-color: white;
    border-radius: ${Theme.borders.radius.md};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    padding: 3rem 2rem;
    width: 100%;
    max-width: 600px;
    margin-bottom: 2rem;
    
    .progress-bar {
      width: 100%;
      height: 8px;
      background-color: ${Theme.colors.tertiary};
      border-radius: 4px;
      margin: 2rem 0;
      overflow: hidden;
      
      .progress {
        height: 100%;
        background-color: ${Theme.colors.secondary};
        width: 0;
        animation: progress 3s ease-in-out forwards;
        
        @keyframes progress {
          0% { width: 0; }
          100% { width: 100%; }
        }
      }
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    
    @media (max-width: 600px) {
      flex-direction: column;
      width: 100%;
    }
  }
  
  .action-button {
    padding: 16px 32px;
    border-radius: 100px;
    font: ${Theme.typography.fonts.mediumB};
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.primary {
      background-color: ${Theme.colors.secondary};
      color: white;
      border: none;
      
      &:hover {
        background-color: ${Theme.colors.primary};
      }
    }
    
    &.secondary {
      background-color: white;
      color: ${Theme.colors.secondary};
      border: 1px solid ${Theme.colors.secondary};
      
      &:hover {
        background-color: ${Theme.colors.tertiary};
      }
    }
    
    @media (max-width: 600px) {
      width: 100%;
    }
  }
`;

// Create a flag to prevent multiple reservation creations
let isProcessing = false;

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Processing your payment...');
  const [progress, setProgress] = useState<number>(0);
  const [reservationId, setReservationId] = useState<string | null>(null);
  
  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        // Check if we already have a reservation ID from a previous processing attempt
        if (reservationId) {
          console.log('Reservation already created with ID:', reservationId);
          setStatus('success');
          setMessage('Your payment was successful and your reservation has been confirmed!');
          
          // Redirect to success page after 3 seconds
          setTimeout(() => {
            navigate('/payment-success?reservationId=' + reservationId);
          }, 3000);
          return;
        }
        
        // Get the payment status from URL parameters
        const paymentStatus = searchParams.get('status');
        const reservationData = localStorage.getItem('pendingReservation');
        
        if (!reservationData) {
          setStatus('error');
          setMessage('No pending reservation found. Please try booking again.');
          return;
        }
        
        const pendingReservation = JSON.parse(reservationData);
        
        // Check if payment was successful
        if (paymentStatus === 'success') {
          // Check if we're already processing this reservation to prevent duplicates
          if (isProcessing) {
            console.log('Already processing reservation, preventing duplicate creation');
            return;
          }
          
          isProcessing = true;
          
          try {
            // Create the reservation
            const reservation = await createCheckoutReservation(pendingReservation);
            
            console.log('Reservation created:', reservation);
            setReservationId(reservation.id);
            
            // Apply discount to booking if available
            if (pendingReservation.rentalData.discount) {
              try {
                const discountApplied = await referralService.applyDiscountToBooking(
                  pendingReservation.userId,
                  reservation.id,
                  pendingReservation.propertyId,
                  pendingReservation.propertyTitle || 'Property',
                  pendingReservation.rentalData.price
                );
                
                console.log(`Discount applied to booking: ${discountApplied} MAD`);
              } catch (discountErr) {
                console.error('Error applying discount to booking:', discountErr);
                // Don't fail the whole process if discount application fails
              }
            }
            
            // Clear the pending reservation data
            localStorage.removeItem('pendingReservation');
            
            setStatus('success');
            setMessage('Your payment was successful and your reservation has been confirmed!');
            
            // Redirect to success page after 3 seconds
            setTimeout(() => {
              navigate('/payment-success?reservationId=' + reservation.id);
            }, 3000);
          } finally {
            // Reset the processing flag regardless of success or failure
            isProcessing = false;
          }
        } else {
          // Payment failed or was cancelled
          setStatus('error');
          setMessage(
            paymentStatus === 'cancelled'
              ? 'Your payment was cancelled. Please try again.'
              : 'Your payment was not successful. Please try again.'
          );
          
          // Clear the pending reservation data
          localStorage.removeItem('pendingReservation');
        }
      } catch (error) {
        console.error('Error processing payment result:', error);
        setStatus('error');
        setMessage('An error occurred while processing your payment. Please contact support.');
        isProcessing = false;
      }
    };
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    processPaymentResult();
    
    return () => clearInterval(progressInterval);
  }, [searchParams, navigate, reservationId]);
  
  const handleContinue = () => {
    if (status === 'success') {
      navigate('/dashboard/user/reservations');
    } else {
      navigate('/checkout');
    }
  };
  
  const handleContactSupport = () => {
    window.location.href = 'mailto:support@kaari.ma';
  };
  
  return (
    <PaymentCallbackContainer>
      {status === 'loading' && (
        <div className="card">
          <FaSpinner className="status-icon loading" />
          <h1 className="status-title">Processing Payment</h1>
          <p className="status-message">{message}</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="status-message">Please do not close this window...</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="card">
          <FaCheckCircle className="status-icon success" />
          <h1 className="status-title">Payment Successful</h1>
          <p className="status-message">{message}</p>
          <div className="action-buttons">
            <button className="action-button primary" onClick={handleContinue}>
              View My Reservations
            </button>
          </div>
        </div>
      )}
      
      {status === 'error' && (
        <div className="card">
          <FaTimesCircle className="status-icon error" />
          <h1 className="status-title">Payment Failed</h1>
          <p className="status-message">{message}</p>
          <div className="action-buttons">
            <button className="action-button primary" onClick={handleContinue}>
              Try Again
            </button>
            <button className="action-button secondary" onClick={handleContactSupport}>
              Contact Support
            </button>
          </div>
        </div>
      )}
    </PaymentCallbackContainer>
  );
};

export default PaymentCallback; 
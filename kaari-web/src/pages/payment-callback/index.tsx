import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { updateDocument, getDocumentById } from '../../backend/firebase/firestore';
// Import collection names from ClientServerActions
import { getCurrentUserProfile } from '../../backend/firebase/auth';
import LoadingScreen from '../../components/loading/LoadingScreen';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { User, Request, Property } from '../../backend/entities';

// Collection names - these are defined in multiple server action files
const REQUESTS_COLLECTION = 'requests';
const PROPERTIES_COLLECTION = 'properties';

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Processing your payment...');
  
  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        // Get payment status from URL parameters
        const paymentStatus = searchParams.get('status');
        const orderID = searchParams.get('orderID');
        
        if (!orderID) {
          setStatus('error');
          setMessage('Invalid payment reference. Order ID is missing.');
          return;
        }
        
        // Check if the user is authenticated
        const currentUser = await getCurrentUserProfile();
        if (!currentUser) {
          setStatus('error');
          setMessage('Authentication required. Please log in.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }
        
        // Extract reservation ID from order ID (format: res_RESERVATION-ID_TIMESTAMP)
        const reservationIdMatch = orderID.match(/^res_(.+?)_\d+$/);
        if (!reservationIdMatch) {
          setStatus('error');
          setMessage('Invalid order ID format.');
          return;
        }
        
        const reservationId = reservationIdMatch[1];
        
        // Get the reservation
        const reservation = await getDocumentById(REQUESTS_COLLECTION, reservationId) as Request | null;
        if (!reservation) {
          setStatus('error');
          setMessage('Reservation not found.');
          return;
        }
        
        // Verify that the payment belongs to the current user
        if (reservation.userId !== currentUser.id) {
          setStatus('error');
          setMessage('Not authorized to process this payment.');
          return;
        }
        
        // Import the payment gateway service to check payment status
        const PaymentGatewayService = (await import('../../services/PaymentGatewayService')).default;
        const paymentResult = await PaymentGatewayService.checkPaymentStatus(orderID);
        
        if (!paymentResult.success) {
          setStatus('error');
          setMessage('Failed to verify payment status. Please contact support.');
          return;
        }
        
        // Check the payment status from the gateway
        const gatewayStatus = paymentResult.status?.status || paymentStatus;
        
        if (gatewayStatus === 'APPROVED' || gatewayStatus === 'SUCCESS') {
          // Update reservation status to paid
          await updateDocument(REQUESTS_COLLECTION, reservationId, {
            status: 'paid',
            paymentStatus: 'completed',
            paymentCompletedAt: new Date(),
            updatedAt: new Date()
          } as Partial<Request>);
          
          // Get property details for notification
          const property = await getDocumentById(PROPERTIES_COLLECTION, reservation.propertyId || '') as Property | null;
          
          if (property) {
            // Send notifications
            const NotificationService = (await import('../../services/NotificationService')).default;
            
            // Notify property owner
            await NotificationService.createNotification(
              property.ownerId,
              'advertiser',
              'payment_confirmed',
              'Reservation Payment Received',
              `Payment has been received for the reservation at ${property.title || 'your property'}.`,
              `/dashboard/advertiser/reservations`,
              {
                reservationId,
                propertyId: property.id,
                status: 'paid'
              }
            );
            
            // Notify user
            await NotificationService.createNotification(
              currentUser.id,
              'user',
              'payment_confirmation',
              'Payment Confirmed',
              `Your payment for ${property.title || 'the property'} has been successfully processed.`,
              `/dashboard/user/reservations`,
              {
                reservationId,
                propertyId: property.id,
                status: 'paid'
              }
            );
          }
          
          setStatus('success');
          setMessage('Payment successful! Redirecting to your reservations...');
          setTimeout(() => navigate('/dashboard/user/reservations'), 3000);
        } else {
          // Payment failed or is pending
          await updateDocument(REQUESTS_COLLECTION, reservationId, {
            paymentStatus: gatewayStatus?.toLowerCase() || 'failed',
            updatedAt: new Date()
          } as Partial<Request>);
          
          setStatus('error');
          setMessage(`Payment ${gatewayStatus?.toLowerCase() || 'failed'}. Please try again or contact support.`);
        }
      } catch (error) {
        console.error('Error processing payment callback:', error);
        setStatus('error');
        setMessage('An error occurred while processing your payment. Please contact support.');
      }
    };
    
    processPaymentResult();
  }, [searchParams, navigate]);
  
  return (
    <PaymentCallbackContainer>
      {status === 'loading' && <LoadingScreen isLoading={true} />}
      
      {status === 'success' && (
        <SuccessContainer>
          <SuccessIcon>✓</SuccessIcon>
          <h1>Payment Successful</h1>
          <p>{message}</p>
        </SuccessContainer>
      )}
      
      {status === 'error' && (
        <ErrorContainer>
          <ErrorIcon>✗</ErrorIcon>
          <h1>Payment Issue</h1>
          <p>{message}</p>
          <button onClick={() => navigate('/dashboard/user/reservations')}>
            Go to My Reservations
          </button>
        </ErrorContainer>
      )}
    </PaymentCallbackContainer>
  );
};

const PaymentCallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
  text-align: center;
`;

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: white;
  border-radius: ${Theme.borders.radius.lg};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  
  h1 {
    color: ${Theme.colors.success};
    margin-bottom: 1rem;
  }
  
  p {
    color: ${Theme.colors.gray2};
    margin-bottom: 1.5rem;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: white;
  border-radius: ${Theme.borders.radius.lg};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  
  h1 {
    color: ${Theme.colors.error};
    margin-bottom: 1rem;
  }
  
  p {
    color: ${Theme.colors.gray2};
    margin-bottom: 1.5rem;
  }
  
  button {
    padding: 0.75rem 1.5rem;
    background-color: ${Theme.colors.primary};
    color: white;
    border: none;
    border-radius: ${Theme.borders.radius.md};
    cursor: pointer;
    font: ${Theme.typography.fonts.mediumB};
    transition: background-color 0.2s;
    
    &:hover {
      background-color: ${Theme.colors.primary};
    }
  }
`;

const SuccessIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: ${Theme.colors.success};
  color: white;
  border-radius: 50%;
  font-size: 40px;
  margin-bottom: 1.5rem;
`;

const ErrorIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: ${Theme.colors.error};
  color: white;
  border-radius: 50%;
  font-size: 40px;
  margin-bottom: 1.5rem;
`;

export default PaymentCallback; 
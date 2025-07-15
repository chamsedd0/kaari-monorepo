import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import LoadingScreen from '../../components/loading/LoadingScreen';
import { getDocumentById } from '../../backend/firebase/firestore';
import { User, Request, Property } from '../../backend/entities';
import { getCurrentUserProfile } from '../../backend/firebase/auth';

// Collection names - these are defined in multiple server action files
const REQUESTS_COLLECTION = 'requests';
const PROPERTIES_COLLECTION = 'properties';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [propertyTitle, setPropertyTitle] = useState('');
  const [reservationId, setReservationId] = useState('');
  
  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        // Get reservation ID from URL params
        const resId = searchParams.get('reservationId');
        if (!resId) {
          navigate('/dashboard/user/reservations');
          return;
        }
        
        setReservationId(resId);
        
        // Check if user is authenticated
        const currentUser = await getCurrentUserProfile();
        if (!currentUser) {
          navigate('/login');
          return;
        }
        
        // Get reservation details
        const reservation = await getDocumentById(REQUESTS_COLLECTION, resId) as Request | null;
        if (!reservation) {
          navigate('/dashboard/user/reservations');
          return;
        }
        
        // Verify that the reservation belongs to the current user
        if (reservation.userId !== currentUser.id) {
          navigate('/dashboard/user/reservations');
          return;
        }
        
        // Get property details
        if (reservation.propertyId) {
          const property = await getDocumentById(PROPERTIES_COLLECTION, reservation.propertyId) as Property | null;
          if (property) {
            setPropertyTitle(property.title || 'Property');
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching reservation details:', error);
        navigate('/dashboard/user/reservations');
      }
    };
    
    fetchReservationDetails();
  }, [searchParams, navigate]);
  
  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }
  
  return (
    <SuccessContainer>
      <SuccessContent>
        <SuccessIcon>✓</SuccessIcon>
        <h1>Payment Successful!</h1>
        
        <p>
          Your payment for <strong>{propertyTitle}</strong> has been processed successfully.
          We've sent you a confirmation email with all the details.
        </p>
        
        <p className="reservation-id">
          Reservation ID: <strong>{reservationId}</strong>
        </p>
        
        <p>
          The property owner has been notified of your payment. You can view the status
          of your reservation in your dashboard.
        </p>
        
        <ButtonGroup>
          <PrimaryButton onClick={() => navigate(`/dashboard/user/reservations/${reservationId}`)}>
            View Reservation
          </PrimaryButton>
          
          <SecondaryButton onClick={() => navigate('/dashboard/user/reservations')}>
            All Reservations
          </SecondaryButton>
        </ButtonGroup>
      </SuccessContent>
    </SuccessContainer>
  );
};

const SuccessContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
`;

const SuccessContent = styled.div`
  background-color: white;
  border-radius: ${Theme.borders.radius.lg};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  text-align: center;
  
  h1 {
    color: ${Theme.colors.success};
    margin-bottom: 1.5rem;
    font: ${Theme.typography.fonts.h2};
  }
  
  p {
    color: ${Theme.colors.gray2};
    margin-bottom: 1.5rem;
    font: ${Theme.typography.fonts.mediumM};
    line-height: 1.6;
  }
  
  .reservation-id {
    font: ${Theme.typography.fonts.smallB};
    background-color: ${Theme.colors.tertiary};
    padding: 0.75rem;
    border-radius: ${Theme.borders.radius.md};
    display: inline-block;
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
  margin: 0 auto 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const PrimaryButton = styled.button`
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
`;

const SecondaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: ${Theme.colors.primary};
  border: 1px solid ${Theme.colors.primary};
  border-radius: ${Theme.borders.radius.md};
  cursor: pointer;
  font: ${Theme.typography.fonts.mediumB};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${Theme.colors.tertiary};
  }
`;

export default PaymentSuccess; 
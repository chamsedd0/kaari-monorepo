import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import LoadingScreen from '../../components/loading/LoadingScreen';
import { getDocumentById } from '../../backend/firebase/firestore';
import { User, Request, Property } from '../../backend/entities';
import { getCurrentUserProfile } from '../../backend/firebase/auth';
import { FaCheckCircle, FaCalendarAlt, FaClock, FaUser, FaHome, FaCreditCard } from 'react-icons/fa';

// Collection names - these are defined in multiple server action files
const REQUESTS_COLLECTION = 'requests';
const PROPERTIES_COLLECTION = 'properties';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [propertyTitle, setPropertyTitle] = useState('');
  const [reservationId, setReservationId] = useState('');
  const [moveInDate, setMoveInDate] = useState<Date | null>(null);
  const [amount, setAmount] = useState<number>(0);
  
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

        // Set move-in date and amount if available
        if (reservation.scheduledDate) {
          setMoveInDate(new Date(reservation.scheduledDate));
        }
        
        if (reservation.totalPrice) {
          setAmount(reservation.totalPrice);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching reservation details:', error);
        navigate('/dashboard/user/reservations');
      }
    };
    
    fetchReservationDetails();
  }, [searchParams, navigate]);
  
  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return 'Not specified';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }
  
  return (
    <SuccessContainer>
      <FaCheckCircle className="success-icon" />
      
      <h2 className="success-title">Payment Successful!</h2>
      
      <p className="success-message">
        Your payment for <strong>{propertyTitle}</strong> has been successfully processed.
        We've sent you a confirmation email with all the details.
      </p>
      
      <div className="reservation-details">
        <h3 className="details-title">Payment Details</h3>
        
        <div className="details-container">
          <div className="detail-card">
            <div className="detail-icon">
              <FaHome />
            </div>
            <div className="detail-content">
              <h4>Property</h4>
              <p>{propertyTitle}</p>
            </div>
          </div>
          
          <div className="detail-card">
            <div className="detail-icon">
              <FaCalendarAlt />
            </div>
            <div className="detail-content">
              <h4>Move-In Date</h4>
              <p>{formatDate(moveInDate)}</p>
            </div>
          </div>
          
          <div className="detail-card">
            <div className="detail-icon">
              <FaCreditCard />
            </div>
            <div className="detail-content">
              <h4>Amount Paid</h4>
              <p>{formatCurrency(amount)}</p>
            </div>
          </div>
          
          <div className="detail-card">
            <div className="detail-icon">
              <FaClock />
            </div>
            <div className="detail-content">
              <h4>Reference Number</h4>
              <p>{reservationId}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="next-steps">
        <h3 className="next-steps-title">What Happens Next?</h3>
        
        <ul className="steps-list">
          <li>
            <strong>Confirmation:</strong> The property owner has been notified of your payment.
          </li>
          <li>
            <strong>Move-In Preparation:</strong> Get ready for your scheduled move-in date.
          </li>
          <li>
            <strong>Contact Owner:</strong> Coordinate with the property owner for key handover and other details.
          </li>
          <li>
            <strong>Move In:</strong> On your move-in day, confirm your arrival through your dashboard.
          </li>
        </ul>
      </div>
      
      <div className="action-buttons">
        <button 
          className="action-button primary"
          onClick={() => navigate(`/dashboard/user/reservations/${reservationId}`)}
        >
          View Reservation Details
        </button>
        
        <button 
          className="action-button secondary"
          onClick={() => navigate('/dashboard/user/reservations')}
        >
          All Reservations
        </button>
      </div>
    </SuccessContainer>
  );
};

const SuccessContainer = styled.div`
  display: flex;
  min-height: 100vh;
  margin: 0 auto;
  margin-top: 80px;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  padding: 3rem 1.5rem;
  text-align: center;
  
  .success-icon {
    color: ${Theme.colors.secondary};
    font-size: 5rem;
    margin-bottom: 1.5rem;
  }
  
  .success-title {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
    margin-bottom: 1rem;
  }
  
  .success-message {
    font: ${Theme.typography.fonts.largeM};
    color: ${Theme.colors.gray2};
    max-width: 600px;
    margin-bottom: 2.5rem;
  }
  
  .reservation-details {
    background-color: ${Theme.colors.tertiary};
    border-radius: ${Theme.borders.radius.md};
    padding: 2rem;
    width: 100%;
    margin-bottom: 2.5rem;
    
    .details-title {
      font: ${Theme.typography.fonts.largeB};
      color: ${Theme.colors.black};
      margin-bottom: 1.5rem;
      border-bottom: 1px solid ${Theme.colors.gray};
      padding-bottom: 0.75rem;
      text-align: left;
    }
    
    .details-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      
      .detail-card {
        display: flex;
        align-items: flex-start;
        text-align: left;
        
        .detail-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(143, 39, 206, 0.1);
          color: ${Theme.colors.secondary};
          margin-right: 1rem;
          
          svg {
            font-size: 1.25rem;
          }
        }
        
        .detail-content {
          h4 {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.black};
            margin: 0 0 0.5rem;
          }
          
          p {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.gray2};
            margin: 0;
          }
        }
      }
    }
  }
  
  .next-steps {
    width: 100%;
    margin-bottom: 2.5rem;
    
    .next-steps-title {
      font: ${Theme.typography.fonts.largeB};
      color: ${Theme.colors.black};
      margin-bottom: 1.5rem;
      text-align: left;
    }
    
    .steps-list {
      list-style-type: none;
      padding: 0;
      margin: 0;
      text-align: left;
      
      li {
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
        margin-bottom: 1rem;
        padding-left: 1.5rem;
        position: relative;
        
        &:before {
          content: "•";
          color: ${Theme.colors.secondary};
          font-size: 1.5rem;
          position: absolute;
          left: 0;
          top: -0.25rem;
        }
        
        strong {
          font: ${Theme.typography.fonts.mediumB};
          color: ${Theme.colors.black};
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
  }
`;

export default PaymentSuccess; 
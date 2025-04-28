import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { Property } from '../../backend/entities';
import { FaCheckCircle, FaCalendarAlt, FaClock, FaUser, FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
  
  .success-icon {
    color: ${Theme.colors.secondary};
    font-size: 5rem;
    margin-bottom: 1.5rem;
  }
  
  .success-title {
    font: ${Theme.typography.fonts.h3B};
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
    max-width: 700px;
    margin-bottom: 2.5rem;
    
    .details-title {
      font: ${Theme.typography.fonts.largeB};
      color: ${Theme.colors.black};
      margin-bottom: 1.5rem;
      border-bottom: 1px solid ${Theme.colors.gray};
      padding-bottom: 0.75rem;
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
          margin-right: 12px;
        }
        
        .detail-content {
          h4 {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.black};
            margin-bottom: 0.25rem;
          }
          
          p {
            font: ${Theme.typography.fonts.smallM};
            color: ${Theme.colors.gray2};
          }
        }
      }
    }
  }
  
  .next-steps {
    background-color: white;
    border: 1px solid ${Theme.colors.tertiary};
    border-radius: ${Theme.borders.radius.md};
    padding: 2rem;
    width: 100%;
    max-width: 700px;
    margin-bottom: 2.5rem;
    
    .next-steps-title {
      font: ${Theme.typography.fonts.largeB};
      color: ${Theme.colors.black};
      margin-bottom: 1.5rem;
      border-bottom: 1px solid ${Theme.colors.gray};
      padding-bottom: 0.75rem;
    }
    
    .steps-list {
      list-style: none;
      padding: 0;
      text-align: left;
      
      li {
        position: relative;
        padding-left: 2rem;
        margin-bottom: 1rem;
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
        
        &:before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.5rem;
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
          background-color: ${Theme.colors.secondary};
        }
        
        strong {
          color: ${Theme.colors.black};
        }
      }
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 1rem;
    
    @media (max-width: 576px) {
      flex-direction: column;
    }
    
    .action-button {
      padding: 0.75rem 1.5rem;
      border-radius: ${Theme.borders.radius.md};
      font: ${Theme.typography.fonts.mediumB};
      text-decoration: none;
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
          background-color: rgba(143, 39, 206, 0.05);
        }
      }
    }
  }
`;

interface SuccessProps {
  propertyData: Property;
}

const SuccessPage: React.FC<SuccessProps> = ({ propertyData }) => {
  const navigate = useNavigate();
  const [rentalData, setRentalData] = useState<any>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  
  useEffect(() => {
    // Try to retrieve reservation ID from localStorage
    const savedReservationId = localStorage.getItem('lastReservationId');
    if (savedReservationId) {
      setReservationId(savedReservationId);
    }
    
    // Check if there's any remaining rental application data in localStorage
    const savedData = localStorage.getItem('rentalApplicationData');
    if (savedData) {
      setRentalData(JSON.parse(savedData));
    }
  }, []);
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <SuccessContainer>
      <FaCheckCircle className="success-icon" />
      
      <h2 className="success-title">Reservation Request Submitted!</h2>
      
      <p className="success-message">
        Your request has been successfully submitted. The property owner will review your request and respond 
        within 48 hours. You'll receive a notification by email when they respond.
      </p>
      
      <div className="reservation-details">
        <h3 className="details-title">Reservation Details</h3>
        
        <div className="details-container">
          <div className="detail-card">
            <div className="detail-icon">
              <FaHome />
            </div>
            <div className="detail-content">
              <h4>Property</h4>
              <p>{propertyData.title}</p>
            </div>
          </div>
          
          <div className="detail-card">
            <div className="detail-icon">
              <FaCalendarAlt />
            </div>
            <div className="detail-content">
              <h4>Viewing Date</h4>
              <p>{rentalData ? formatDate(rentalData.visitDate) : 'Scheduled'}</p>
            </div>
          </div>
          
          <div className="detail-card">
            <div className="detail-icon">
              <FaUser />
            </div>
            <div className="detail-content">
              <h4>Status</h4>
              <p>Pending Owner Approval</p>
            </div>
          </div>
          
          <div className="detail-card">
            <div className="detail-icon">
              <FaClock />
            </div>
            <div className="detail-content">
              <h4>Reference Number</h4>
              <p>{reservationId || 'Generated'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="next-steps">
        <h3 className="next-steps-title">What Happens Next?</h3>
        
        <ul className="steps-list">
          <li>
            <strong>Wait for owner approval:</strong> The property owner will review your request 
            within 48 hours.
          </li>
          <li>
            <strong>Receive confirmation:</strong> Once approved, you'll receive a confirmation email 
            with details about your viewing appointment.
          </li>
          <li>
            <strong>Visit the property:</strong> Meet with the owner or agent at the scheduled time 
            to view the property.
          </li>
          <li>
            <strong>Complete application:</strong> If you decide to proceed, you'll complete the full 
            rental application and pay any required deposits.
          </li>
        </ul>
      </div>
      
      <div className="action-buttons">
        <Link to="/dashboard/user/reservations" className="action-button primary">
          View My Reservations
        </Link>
        
        <Link to="/properties" className="action-button secondary">
          Browse More Properties
        </Link>
      </div>
    </SuccessContainer>
  );
};

export default SuccessPage; 
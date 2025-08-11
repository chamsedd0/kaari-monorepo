import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaUser, FaUsers } from 'react-icons/fa';
import { Request, Property, User } from '../../backend/entities';
import crossSvg from '../../components/skeletons/icons/Cross-Icon.svg';

// Default images
const DEFAULT_PROPERTY_IMAGE = '/img/default-property.jpg'; // This should be a simple gray background
const DEFAULT_AVATAR_IMAGE = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80';

// Extended status type
type ExtendedStatus = Request['status'] | 'completed';

// Extended Request type to handle the fields we're using
interface ReservationRequest extends Omit<Request, 'status'> {
  status: ExtendedStatus;
  // We're using these fields which may not be in the Request type
  movingDate?: Date | string;
  minstay?: string;
}

interface ReservationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: {
    reservation: ReservationRequest;
    property?: Property | null;
    client?: User | null;
  } | null;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string, suggestedMoveInDate?: string) => void;
  isProcessing: boolean | string | null;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  
  .modal-header {
    background-size: cover;
    background-position: center;
    height: 120px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    position: relative;
    background-image: url(${DEFAULT_PROPERTY_IMAGE}); /* Property image */
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.4); /* Slightly darker overlay */
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
    }
  }
  
  .header-content {
    position: relative;
    z-index: 2;
    color: white;
    padding: 20px;
    padding-right: 40px;
    display: flex;
    align-items: center;
    height: 100%;
    
    h2 {
      margin: 0;
      font-size: ${Theme.typography.fonts.extraLargeB};
    }
  }
  
  .modal-body {
    padding: 24px 20px;
    background-color: white;
  }
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${Theme.colors.gray2};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${Theme.colors.gray2};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${Theme.colors.gray2};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.4);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  z-index: 10;
  transition: all 0.2s ease;

  img {
    width: 12px;
    height: 12px;
    object-fit: cover;
    filter: brightness(0) invert(1);
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

const CongratulationsHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
  
  h2 {
    font-size: 22px;
    font-weight: 700;
    color: ${Theme.colors.black};
    margin: 0 0 8px 0;
  }
  
  p {
    font-size: 16px;
    color: ${Theme.colors.gray2};
    margin: 0;
  }
`;

const UserInfoSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 12px;
    background-color: ${Theme.colors.gray2};
    display: flex;
    align-items: center;
    justify-content: center;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .fallback-icon {
      color: ${Theme.colors.gray2};
      font-size: 20px;
    }
  }
  
  .user-details {
    .name {
      font-size: 16px;
      font-weight: 600;
      color: ${Theme.colors.black};
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .occupation {
      font-size: 14px;
      color: ${Theme.colors.gray2};
    }
  }
  
  .user-count {
    margin-left: auto;
    background: ${Theme.colors.secondary};
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    .count {
      font-size: 14px;
      font-weight: 500;
    }
    
    .users-icon {
      position: absolute;
      font-size: 10px;
      left: -6px;
      bottom: -6px;
      background-color: white;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${Theme.colors.primary};
      border: 1px solid ${Theme.colors.primary};
    }
  }
`;

const InfoGrid = styled.div`
  margin-bottom: 24px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${Theme.colors.gray};
  
  &:last-child {
    border-bottom: none;
  }
  
  .label {
    font-size: 14px;
    color: ${Theme.colors.gray2};
  }
  
  .value {
    font-size: 14px;
    font-weight: 500;
    color: ${Theme.colors.black};
    text-align: right;
  }
`;

const AlertBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background-color: #FEE9EE;
  color: ${Theme.colors.primary};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    color: ${Theme.colors.primary};
  }
  
  .message {
    font-size: 14px;
    line-height: 1.4;
  }
`;

const StatusBox = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  
  ${({ status }) => {
    if (status === 'accepted') {
      return `
        background-color: ${Theme.colors.primary}50;
        color: ${Theme.colors.primary};
      `;
    } else if (status === 'rejected') {
      return `
        background-color: #FFEBEE;
        color: #C62828;
      `;
    } else {
      return `
        background-color: #E3F2FD;
        color: #1565C0;
      `;
    }
  }}
  
  .status-icon {
    font-size: 20px;
  }
  
  .status-message {
    font-size: 14px;
    font-weight: 500;
  }
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  button {
    padding: 14px;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &.accept {
      background-color: #57208E;
      color: white;
      border: none;
      
      &:hover {
        background-color: #491B7A;
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
    
    &.decline {
      background-color: white;
      color: ${Theme.colors.black};
      border: 1px solid ${Theme.colors.gray};
      
      &:hover {
        background-color: ${Theme.colors.gray};
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
`;

export const ReservationDetailsModal: React.FC<ReservationDetailsModalProps> = ({
  isOpen,
  onClose,
  reservation,
  onApprove,
  onReject,
  isProcessing
}) => {
  if (!isOpen || !reservation) return null;

  const { reservation: req, property, client } = reservation;
  const isPending = req.status === 'pending';
  
  // Get number of people
  const getNumPeople = (): number => {
    if (!req.numPeople) return 2; // Default to 2 if not specified
    if (req.numPeople === 'Alone' || req.numPeople === '1') return 1;
    const num = parseInt(req.numPeople);
    return isNaN(num) ? 2 : num;
  };
  
  // Format date for display (DD/MM/YYYY)
  const formatDate = (date: Date | undefined | string) => {
    if (!date) return 'Not specified';
    
    try {
      let dateObj: Date;
      
      // Check if it's already a Date object
      if (date instanceof Date) {
        dateObj = date;
      }
      // Check if it's a Firestore timestamp (has seconds and nanoseconds)
      else if (typeof date === 'object' && date !== null && 'seconds' in date) {
        // Type assertion to tell TypeScript this has a seconds property
        const timestampObj = date as { seconds: number; nanoseconds?: number };
        dateObj = new Date(timestampObj.seconds * 1000);
      }
      // Handle string or any other format
      else {
        dateObj = new Date(date);
      }
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Not specified';
      }
      
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Not specified';
    }
  };

  // Get status message
  const getStatusMessage = () => {
    switch(req.status) {
      case 'accepted':
        return 'You have accepted this reservation request';
      case 'rejected':
        return 'You have declined this reservation request';
      case 'completed':
      case 'movedIn':
        return 'This reservation has been completed';
      default:
        return '';
    }
  };

  // Handle image loading error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_AVATAR_IMAGE;
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <h2>{property?.title || 'Apartment in Rabat'}</h2>
          </div>
          <CloseButton onClick={onClose}>
            <img src={crossSvg} alt="Close" />
          </CloseButton>
        </div>
        
        <div className="modal-body">
          <CongratulationsHeader>
            <h2>Congratulations!</h2>
            <p>You have a new reservation request!</p>
          </CongratulationsHeader>
          
          <UserInfoSection>
            <div className="avatar">
              {client?.profilePicture ? (
                <img 
                  src={client.profilePicture} 
                  alt={`${client?.name || 'User'}`}
                  onError={handleImageError}
                />
              ) : (
                <img 
                  src={DEFAULT_AVATAR_IMAGE}
                  alt="User"
                />
              )}
            </div>
            <div className="user-details">
              <div className="name">
                {client ? `${client.name || ''} ${client.surname || ''}`.trim() : 'mohamed chams eddine'}
              </div>
              <div className="occupation">
                {req.occupationType === 'study' ? 'Student' : 
                 req.occupationType === 'work' ? 'Working Professional' : 'Student'}
              </div>
            </div>
            <div className="user-count">
              <div className="count">{getNumPeople()}</div>
              <div className="users-icon">
                <FaUsers size={10} />
              </div>
            </div>
          </UserInfoSection>
          
          <InfoGrid>
            <InfoRow>
              <div className="label">Move-in date</div>
              <div className="value">
                {req.movingDate ? formatDate(req.movingDate) : 
                 req.scheduledDate ? formatDate(req.scheduledDate) : '07/05/2025'}
              </div>
            </InfoRow>
            <InfoRow>
              <div className="label">People to live with</div>
              <div className="value">
                {req.numPeople === '1' ? 'Alone' : req.numPeople || 'Alone'}
              </div>
            </InfoRow>
            <InfoRow>
              <div className="label">Student at</div>
              <div className="value">
                {req.studyPlace || 'ehwehw'}
              </div>
            </InfoRow>
            <InfoRow>
              <div className="label">Funded by</div>
              <div className="value">
                {req.funding || 'Myself (from salary)'}
              </div>
            </InfoRow>
            <InfoRow>
              <div className="label">Length of stay</div>
              <div className="value">
                {req.minstay || '1 month'}
              </div>
            </InfoRow>
          </InfoGrid>
          
          {isPending ? (
            <AlertBox>
              <div className="icon">
                <FaExclamationTriangle size={20} />
              </div>
              <div className="message">
                Important: You have only 24 hours to respond to this request. If no action is taken, the request will automatically be declined.
              </div>
            </AlertBox>
          ) : (
            <StatusBox status={req.status || 'pending'}>
              <div className="status-icon">
                {req.status === 'accepted' ? <FaCheckCircle /> : 
                 req.status === 'rejected' ? <FaTimesCircle /> : null}
              </div>
              <div className="status-message">{getStatusMessage()}</div>
            </StatusBox>
          )}
          
          {isPending && (
            <ActionButtons>
              <button 
                className="decline"
                onClick={() => {
                  const reason = 'move_in_date_too_far';
                  const suggested = prompt('Optional: suggest an alternative move-in date (YYYY-MM-DD)');
                  onReject(req.id, reason, suggested || undefined);
                }}
                disabled={isProcessing === req.id}
              >
                Decline
              </button>
              <button 
                className="accept"
                onClick={() => onApprove(req.id)}
                disabled={isProcessing === req.id}
              >
                Accept
              </button>
            </ActionButtons>
          )}
        </div>
      </ModalContent>
    </ModalOverlay>
  );
}; 
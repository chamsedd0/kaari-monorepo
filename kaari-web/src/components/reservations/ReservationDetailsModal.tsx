import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { FaTimesCircle, FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaEnvelope, FaPhone, FaUsers, FaBriefcase, FaGraduationCap, FaInfoCircle, FaDollarSign } from 'react-icons/fa';
import { Request, Property, User } from '../../backend/entities';

interface ReservationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: {
    reservation: Request;
    property?: Property | null;
    client?: User | null;
  } | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
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
  border-radius: ${Theme.borders.radius.lg};
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 32px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  
  @media (max-width: 768px) {
    padding: 24px 16px;
    width: 95%;
  }
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${Theme.colors.gray6};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${Theme.colors.gray4};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${Theme.colors.gray3};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: ${Theme.colors.gray6};
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  color: ${Theme.colors.gray1};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${Theme.colors.gray5};
    color: ${Theme.colors.black};
  }
  
  @media (max-width: 768px) {
    top: 16px;
    right: 16px;
  }
`;

const ModalHeader = styled.div`
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${Theme.colors.gray5};
  
  h2 {
    font: ${Theme.typography.fonts.h3B};
    color: ${Theme.colors.black};
    margin: 0 0 12px 0;
  }
  
  .status {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 20px;
    font: ${Theme.typography.fonts.smallB};
    margin-right: 16px;
    
    svg {
      margin-right: 6px;
    }
    
    &.pending {
      background-color: #FFF8E1;
      color: #FFA000;
    }
    
    &.accepted {
      background-color: #E6F5F0;
      color: ${Theme.colors.success};
    }
    
    &.rejected {
      background-color: #FDECEC;
      color: ${Theme.colors.error};
    }
    
    &.completed {
      background-color: #EEE6FD;
      color: ${Theme.colors.secondary};
    }
  }
  
  .requestId {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.gray2};
    display: inline-flex;
    align-items: center;
    
    &::before {
      content: "•";
      margin: 0 6px;
      color: ${Theme.colors.gray4};
    }
  }
`;

const SectionTitle = styled.h3`
  font: ${Theme.typography.fonts.h4B};
  margin: 0 0 20px 0;
  color: ${Theme.colors.black};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
    color: ${Theme.colors.secondary};
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  margin-bottom: 28px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const InfoSection = styled.div`
  background-color: #f9fafc;
  padding: 24px;
  border-radius: ${Theme.borders.radius.md};
  border: 1px solid ${Theme.colors.gray6};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const InfoItem = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .label {
    display: flex;
    align-items: center;
    gap: 8px;
    font: ${Theme.typography.fonts.smallB};
    color: ${Theme.colors.gray2};
    margin-bottom: 8px;
    
    svg {
      color: ${Theme.colors.secondary};
    }
  }
  
  .value {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.black};
    word-break: break-word;
    padding: 4px 0;
    
    &.empty {
      color: ${Theme.colors.gray3};
      font-style: italic;
    }
  }
`;

const MessageSection = styled.div`
  margin: 28px 0;
  padding: 24px;
  background-color: #f9fafc;
  border-radius: ${Theme.borders.radius.md};
  border: 1px solid ${Theme.colors.gray6};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  .label {
    font: ${Theme.typography.fonts.smallB};
    color: ${Theme.colors.gray2};
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 8px;
      color: ${Theme.colors.secondary};
    }
  }
  
  .message {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.black};
    white-space: pre-wrap;
    padding: 4px 0;
    line-height: 1.5;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 36px;
  
  button {
    padding: 14px 28px;
    border-radius: ${Theme.borders.radius.md};
    font: ${Theme.typography.fonts.smallB};
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.approve {
      background-color: ${Theme.colors.success};
      color: white;
      border: none;
      
      &:hover {
        background-color: #1e994c;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(30, 153, 76, 0.2);
      }
      
      &:active {
        transform: translateY(0);
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    }
    
    &.reject {
      background-color: ${Theme.colors.error};
      color: white;
      border: none;
      
      &:hover {
        background-color: #c0392b;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(192, 57, 43, 0.2);
      }
      
      &:active {
        transform: translateY(0);
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    }
    
    &.close {
      background-color: white;
      color: ${Theme.colors.gray2};
      border: 1px solid ${Theme.colors.gray4};
      
      &:hover {
        background-color: ${Theme.colors.gray5};
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    
    button {
      width: 100%;
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
  
  // Format date for display
  const formatDate = (date: Date | undefined | string) => {
    if (!date) return 'Not specified';
    
    try {
      let dateObj: Date;
      
      // Check if it's already a Date object
      if (date instanceof Date) {
        dateObj = date;
      }
      // Check if it's a Firestore timestamp (has seconds and nanoseconds)
      else if (typeof date === 'object' && 'seconds' in date && 'nanoseconds' in date) {
        dateObj = new Date(date.seconds * 1000);
      }
      // Handle string or any other format
      else {
        dateObj = new Date(date);
      }
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }
      
      return dateObj.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Invalid Date';
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    return <span className={`status ${status}`}>
      {status === 'pending' ? 
        <><FaInfoCircle size={14} /> Pending</> :
       status === 'accepted' ? 
        <><FaCheckCircle size={14} /> Approved</> :
       status === 'rejected' ? 
        <><FaTimesCircle size={14} /> Rejected</> : 
        <><FaCheckCircle size={14} /> Completed</>}
    </span>;
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <ModalHeader>
          <h2>Reservation Request</h2>
          <div>
            {getStatusBadge(req.status)}
            <span className="requestId">ID: {req.id}</span>
          </div>
        </ModalHeader>
        
        <InfoGrid>
          <InfoSection>
            <SectionTitle>
              <FaMapMarkerAlt size={18} /> Property Details
            </SectionTitle>
            <InfoItem>
              <div className="label">
                <FaMapMarkerAlt /> Property
              </div>
              <div className="value">
                {property?.title || 'Property information not available'}
              </div>
            </InfoItem>
            <InfoItem>
              <div className="label">
                <FaMapMarkerAlt /> Address
              </div>
              <div className="value">
                {property?.address ? (
                  <>
                    {property.address.street}, {property.address.city}, {property.address.state}, {property.address.zipCode}, {property.address.country}
                  </>
                ) : <span className="empty">Address not available</span>}
              </div>
            </InfoItem>
            <InfoItem>
              <div className="label">
                <FaUsers /> Occupants
              </div>
              <div className="value">
                {req.numPeople || property?.occupants || <span className="empty">Not specified</span>}
              </div>
            </InfoItem>
            <InfoItem>
              <div className="label">
                <FaDollarSign /> Price
              </div>
              <div className="value">
                ${property?.price || 0}/month
              </div>
            </InfoItem>
          </InfoSection>
          
          <InfoSection>
            <SectionTitle>
              <FaUser size={18} /> Applicant Information
            </SectionTitle>
            <InfoItem>
              <div className="label">
                <FaUser /> Full Name
              </div>
              <div className="value">
                {req.fullName || (client ? `${client.name} ${client.surname || ''}` : <span className="empty">Name not available</span>)}
              </div>
            </InfoItem>
            <InfoItem>
              <div className="label">
                <FaEnvelope /> Email
              </div>
              <div className="value">
                {req.email || client?.email || <span className="empty">Email not available</span>}
              </div>
            </InfoItem>
            <InfoItem>
              <div className="label">
                <FaPhone /> Phone
              </div>
              <div className="value">
                {req.phoneNumber || client?.phoneNumber || <span className="empty">Phone not available</span>}
              </div>
            </InfoItem>
            <InfoItem>
              <div className="label">
                <FaInfoCircle /> Gender
              </div>
              <div className="value">
                {req.gender || client?.gender || <span className="empty">Not specified</span>}
              </div>
            </InfoItem>
          </InfoSection>
        </InfoGrid>
        
        <InfoGrid>
          <InfoSection>
            <SectionTitle>
              <FaCalendarAlt size={18} /> Stay Details
            </SectionTitle>
            <InfoItem>
              <div className="label">
                <FaCalendarAlt /> Moving Date
              </div>
              <div className="value">
                {formatDate(req.movingDate) || <span className="empty">Not specified</span>}
              </div>
            </InfoItem>
            <InfoItem>
              <div className="label">
                <FaCalendarAlt /> Leaving Date
              </div>
              <div className="value">
                {formatDate(req.leavingDate) || <span className="empty">Not specified</span>}
              </div>
            </InfoItem>
            <InfoItem>
              <div className="label">
                <FaUsers /> Roommates
              </div>
              <div className="value">
                {req.roommates || <span className="empty">Not specified</span>}
              </div>
            </InfoItem>
            <InfoItem>
              <div className="label">
                <FaInfoCircle /> Occupation Type
              </div>
              <div className="value">
                {req.occupationType === 'study' ? 'Student' : 
                 req.occupationType === 'work' ? 'Working' : 
                 <span className="empty">Not specified</span>}
              </div>
            </InfoItem>
          </InfoSection>
          
          <InfoSection>
            <SectionTitle>
              <FaInfoCircle size={18} /> Additional Information
            </SectionTitle>
            <InfoItem>
              <div className="label">
                {req.occupationType === 'study' ? 
                  <><FaGraduationCap /> Study Place</> : 
                  <><FaBriefcase /> Work Place</>}
              </div>
              <div className="value">
                {req.occupationType === 'study' ? 
                  req.studyPlace || <span className="empty">Not specified</span> : 
                  req.workPlace || <span className="empty">Not specified</span>}
              </div>
            </InfoItem>
            <InfoItem>
              <div className="label">
                <FaBriefcase /> Occupation Role
              </div>
              <div className="value">
                {req.occupationRole || <span className="empty">Not specified</span>}
              </div>
            </InfoItem>
            <InfoItem>
              <div className="label">
                <FaDollarSign /> Funding Source
              </div>
              <div className="value">
                {req.funding || <span className="empty">Not specified</span>}
              </div>
            </InfoItem>
            <InfoItem>
              <div className="label">
                <FaInfoCircle /> Pets/Smoking
              </div>
              <div className="value">
                {req.hasPets === true ? 'Has pets' : req.hasPets === false ? 'No pets' : 'Pets not specified'} 
                {' / '}
                {req.hasSmoking === true ? 'Smoker' : req.hasSmoking === false ? 'Non-smoker' : 'Smoking not specified'}
              </div>
            </InfoItem>
          </InfoSection>
        </InfoGrid>
        
        <MessageSection>
          <div className="label">
            <FaEnvelope /> Message from Applicant
          </div>
          <div className="message">
            {req.message || <span className="empty">No message provided</span>}
          </div>
        </MessageSection>
        
        <InfoSection>
          <SectionTitle>
            <FaDollarSign size={18} /> Payment Information
          </SectionTitle>
          <InfoGrid>
            <InfoItem>
              <div className="label">
                <FaDollarSign /> Rent Price
              </div>
              <div className="value">
                ${req.price || property?.price || 0}
              </div>
            </InfoItem>
            <InfoItem>
              <div className="label">
                <FaDollarSign /> Service Fee
              </div>
              <div className="value">
                ${req.serviceFee || property?.serviceFee || 0}
              </div>
            </InfoItem>
            <InfoItem>
              <div className="label">
                <FaDollarSign /> Total Price
              </div>
              <div className="value">
                ${req.totalPrice || ((req.price || property?.price || 0) + (req.serviceFee || property?.serviceFee || 0))}
              </div>
            </InfoItem>
          </InfoGrid>
        </InfoSection>
        
        <ActionButtons>
          {req.status === 'pending' ? (
            <>
              <button 
                className="approve"
                onClick={() => onApprove(req.id)}
                disabled={isProcessing === req.id}
              >
                <FaCheckCircle size={16} /> Approve Request
              </button>
              <button 
                className="reject"
                onClick={() => onReject(req.id)}
                disabled={isProcessing === req.id}
              >
                <FaTimesCircle size={16} /> Reject Request
              </button>
            </>
          ) : (
            <button className="close" onClick={onClose}>
              Close
            </button>
          )}
        </ActionButtons>
      </ModalContent>
    </ModalOverlay>
  );
}; 
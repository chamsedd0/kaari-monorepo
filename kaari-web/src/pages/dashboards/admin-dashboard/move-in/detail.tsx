import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaUser, FaHome, FaFileAlt, FaPhone, FaEnvelope, FaCopy } from 'react-icons/fa';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import {
  DashboardCard,
  CardTitle,
  CardContent,
} from '../styles';
import { 
  getMoveInBookingById, 
  getMoveInEvents,
  updateMoveInBookingNote,
  addMoveInEvent,
  MoveInBooking, 
  MoveInEvent,
  MoveInStatus 
} from '../../../../backend/server-actions/MoveInServerActions';

const DetailContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 8px 0;
  margin-bottom: 20px;
  font: ${Theme.typography.fonts.smallB};
  color: ${Theme.colors.secondary};
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid ${Theme.colors.gray};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const BookingId = styled.h2`
  margin: 0;
  font: ${Theme.typography.fonts.h3};
  color: ${Theme.colors.secondary};
`;

const StatusBadge = styled.span<{ $status: MoveInStatus }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  font: ${Theme.typography.fonts.smallB};
  margin-right: 15px;
  
  background-color: ${props => {
    switch (props.$status) {
      case 'Move-in Upcoming':
        return '#fef7e0';
      case 'Safety Window Open':
        return '#fff3cd';
      case 'Safety Window Closed':
        return '#e6f4ea';
      case 'Cancelled – Tenant':
      case 'Cancelled – Advertiser':
        return '#fce8e6';
      default:
        return '#f1f3f4';
    }
  }};
  
  color: ${props => {
    switch (props.$status) {
      case 'Move-in Upcoming':
        return '#b06000';
      case 'Safety Window Open':
        return '#664d03';
      case 'Safety Window Closed':
        return '#137333';
      case 'Cancelled – Tenant':
      case 'Cancelled – Advertiser':
        return '#c5221f';
      default:
        return '#5f6368';
    }
  }};
`;

const TimerDisplay = styled.div<{ $isLessThanOneHour?: boolean }>`
  display: flex;
  align-items: center;
  color: ${props => props.$isLessThanOneHour ? '#dc3545' : '#666'};
  font-weight: ${props => props.$isLessThanOneHour ? 'bold' : 'normal'};
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  
  svg {
    margin-right: 8px;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
`;

const DetailSection = styled.div`
  background-color: white;
  border-radius: 8px;
  border: 1px solid ${Theme.colors.gray};
  padding: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 15px 0;
  color: ${Theme.colors.secondary};
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
`;

const TimelineContainer = styled.div`
  grid-column: 1 / -1;
`;

const TimelineItem = styled.div`
  display: flex;
  margin-bottom: 15px;
  position: relative;
  
  &:not(:last-child):before {
    content: '';
    position: absolute;
    left: 10px;
    top: 20px;
    bottom: -15px;
    width: 1px;
    background-color: #ddd;
  }
`;

const TimelineDot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${Theme.colors.secondary};
  margin-right: 15px;
  flex-shrink: 0;
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineTime = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 5px;
`;

const TimelineDescription = styled.div`
  font: ${Theme.typography.fonts.smallM};
`;

const ContactItem = styled.div`
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ContactLabel = styled.div`
  font: ${Theme.typography.fonts.smallB};
  color: ${Theme.colors.gray2};
  margin-bottom: 5px;
`;

const ContactValue = styled.div`
  font: ${Theme.typography.fonts.smallM};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  color: ${Theme.colors.secondary};
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const PropertyAddress = styled.div`
  font: ${Theme.typography.fonts.smallM};
  margin-bottom: 10px;
  color: #666;
`;

const AmenitiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const AmenityTag = styled.span`
  padding: 2px 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  font-size: 0.7rem;
  color: #666;
`;

const NoteTextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
  font: ${Theme.typography.fonts.smallM};
  margin-top: 10px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${Theme.colors.secondary};
  }
`;

const SaveNoteButton = styled.button`
  background-color: ${Theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font: ${Theme.typography.fonts.smallB};
  margin-top: 10px;
  cursor: pointer;
  
  &:hover {
    background-color: ${Theme.colors.primary};
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const PaymentInfo = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid ${Theme.colors.gray};
`;

const PaymentRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
    font-weight: bold;
  }
`;

const PaymentLabel = styled.div`
  color: ${Theme.colors.gray2};
`;

const PaymentValue = styled.div``;

const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #dc3545;
`;

const SafetyWindowTimer: React.FC<{ moveInDate: Date; status: MoveInStatus }> = ({ moveInDate, status }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isLessThanOneHour, setIsLessThanOneHour] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if date is valid before proceeding
    if (!moveInDate || isNaN(moveInDate.getTime())) {
      setTimeLeft('Invalid date');
      setIsActive(false);
      return;
    }
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const moveInDateTime = new Date(moveInDate);
      const safetyWindowEnd = new Date(moveInDateTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours after move-in
      
      // Determine if the safety window is active
      const isInSafetyWindow = now >= moveInDateTime && now < safetyWindowEnd;
      setIsActive(isInSafetyWindow);
      
      let targetDate;
      let prefix = '';
      
      if (now < moveInDateTime) {
        // Time until move-in
        targetDate = moveInDateTime;
        prefix = 'Move-in in: ';
      } else if (now < safetyWindowEnd) {
        // Time until safety window closes
        targetDate = safetyWindowEnd;
        prefix = 'Window closes in: ';
      } else {
        // Safety window has closed
        setTimeLeft('Window closed');
        return;
      }
      
      // Calculate time difference
      const diff = targetDate.getTime() - now.getTime();
      
      // Convert to hours, minutes, seconds
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      // Format the time
      const timeString = `${prefix}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      setTimeLeft(timeString);
      setIsLessThanOneHour(hours === 0);
    };
    
    // Only calculate if status is relevant
    if (status === 'Move-in Upcoming' || status === 'Safety Window Open') {
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer);
    } else {
      setTimeLeft('');
      setIsActive(false);
    }
  }, [moveInDate, status]);
  
  if (!timeLeft) return null;
  
  return (
    <TimerDisplay $isLessThanOneHour={isLessThanOneHour}>
      <FaClock />
      {timeLeft}
    </TimerDisplay>
  );
};

const MoveInDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<MoveInBooking | null>(null);
  const [events, setEvents] = useState<MoveInEvent[]>([]);
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [savingNote, setSavingNote] = useState<boolean>(false);
  
  useEffect(() => {
    const loadBookingDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get booking details
        const bookingData = await getMoveInBookingById(id);
        if (!bookingData) {
          setError('Booking not found');
          return;
        }
        
        setBooking(bookingData);
        setNote(bookingData.internalNote || '');
        
        // Get booking events
        const eventsData = await getMoveInEvents(id);
        setEvents(eventsData);
      } catch (err) {
        console.error('Error loading booking details:', err);
        setError('Failed to load booking details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadBookingDetails();
  }, [id]);
  
  const handleSaveNote = async () => {
    if (!booking || !id) return;
    
    try {
      setSavingNote(true);
      await updateMoveInBookingNote(id, note);
      
      // Add event for the note update
      await addMoveInEvent({
        bookingId: id,
        type: 'move_in_confirmed',
        timestamp: new Date(),
        description: 'Admin updated internal note',
        userId: 'admin', // Should be replaced with actual admin ID
        userName: 'Admin' // Should be replaced with actual admin name
      });
      
      // Could add success message here
    } catch (err) {
      console.error('Error saving note:', err);
      // Could add error message here
    } finally {
      setSavingNote(false);
    }
  };
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };
  
  const formatDateTime = (date: Date) => {
    // Check if date is valid before formatting
    if (!date || isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getPlaceholderImage = (propertyTitle: string) => {
    // Generate a placeholder image based on property title
    const colors = ['#6c5ce7', '#00cec9', '#fdcb6e', '#e17055', '#74b9ff'];
    const colorIndex = propertyTitle.length % colors.length;
    const initials = propertyTitle.substring(0, 2).toUpperCase();
    
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = colors[colorIndex];
      ctx.fillRect(0, 0, 300, 150);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initials, 150, 75);
    }
    
    return canvas.toDataURL();
  };
  
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  if (loading) {
    return (
      <DetailContainer>
        <BackButton onClick={() => navigate('/dashboard/admin/move-in')}>
          <FaArrowLeft /> Back to Move-In Management
        </BackButton>
        <LoadingMessage>Loading booking details...</LoadingMessage>
      </DetailContainer>
    );
  }
  
  if (error || !booking) {
    return (
      <DetailContainer>
        <BackButton onClick={() => navigate('/dashboard/admin/move-in')}>
          <FaArrowLeft /> Back to Move-In Management
        </BackButton>
        <ErrorMessage>{error || 'Booking not found'}</ErrorMessage>
      </DetailContainer>
    );
  }
  
  return (
    <DetailContainer>
      <BackButton onClick={() => navigate('/dashboard/admin/move-in')}>
        <FaArrowLeft /> Back to Move-In Management
      </BackButton>
      
      <DetailHeader>
        <HeaderLeft>
          <BookingId>{booking.bookingId}</BookingId>
          <StatusBadge $status={booking.status}>{booking.status}</StatusBadge>
          {booking.reason !== 'None' && (
            <span style={{ color: '#666' }}>{booking.reason}</span>
          )}
        </HeaderLeft>
        
        <SafetyWindowTimer moveInDate={booking.moveInDate} status={booking.status} />
      </DetailHeader>
      
      <DetailGrid>
        {/* Property Section */}
        <DetailSection>
          <SectionTitle><FaHome /> Property Details</SectionTitle>
          
          <PropertyImage 
            src={booking.property.thumbnail || getPlaceholderImage(booking.property.title)} 
            alt={booking.property.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = getPlaceholderImage(booking.property.title);
            }}
          />
          
          <h4 style={{ margin: '0 0 10px 0' }}>{booking.property.title}</h4>
          <PropertyAddress>{booking.property.address}</PropertyAddress>
          
          <AmenitiesList>
            {booking.property.amenities.map((amenity, index) => (
              <AmenityTag key={index}>{amenity}</AmenityTag>
            ))}
          </AmenitiesList>
        </DetailSection>
        
        {/* Tenant Section */}
        <DetailSection>
          <SectionTitle><FaUser /> Tenant Information</SectionTitle>
          
          <ContactItem>
            <ContactLabel>Name</ContactLabel>
            <ContactValue>{booking.tenant.name}</ContactValue>
          </ContactItem>
          
          <ContactItem>
            <ContactLabel>Phone Number</ContactLabel>
            <ContactValue>
              {booking.tenant.phoneNumber}
              <CopyButton onClick={() => copyToClipboard(booking.tenant.phoneNumber)}>
                <FaCopy size={14} />
              </CopyButton>
            </ContactValue>
          </ContactItem>
          
          {booking.tenant.email && (
            <ContactItem>
              <ContactLabel>Email</ContactLabel>
              <ContactValue>
                {booking.tenant.email}
                <CopyButton onClick={() => copyToClipboard(booking.tenant.email!)}>
                  <FaCopy size={14} />
                </CopyButton>
              </ContactValue>
            </ContactItem>
          )}
          
          {booking.tenant.bankLastFour && (
            <ContactItem>
              <ContactLabel>Bank Account (Last 4)</ContactLabel>
              <ContactValue>•••• {booking.tenant.bankLastFour}</ContactValue>
            </ContactItem>
          )}
          
          <PaymentInfo>
            <PaymentRow>
              <PaymentLabel>Move-In Date</PaymentLabel>
              <PaymentValue>{booking.moveInDate ? formatDateTime(booking.moveInDate) : 'Not set'}</PaymentValue>
            </PaymentRow>
            <PaymentRow>
              <PaymentLabel>Payment Captured</PaymentLabel>
              <PaymentValue>{booking.paymentCapturedAt ? formatDateTime(booking.paymentCapturedAt) : 'Not captured'}</PaymentValue>
            </PaymentRow>
            {booking.gatewayReference && (
              <PaymentRow>
                <PaymentLabel>Payment Reference</PaymentLabel>
                <PaymentValue>
                  {booking.gatewayReference}
                  <CopyButton onClick={() => copyToClipboard(booking.gatewayReference!)}>
                    <FaCopy size={14} />
                  </CopyButton>
                </PaymentValue>
              </PaymentRow>
            )}
            <PaymentRow>
              <PaymentLabel>Amount</PaymentLabel>
              <PaymentValue>{formatAmount(booking.amount)}</PaymentValue>
            </PaymentRow>
          </PaymentInfo>
        </DetailSection>
        
        {/* Advertiser Section */}
        <DetailSection>
          <SectionTitle><FaUser /> Advertiser Information</SectionTitle>
          
          <ContactItem>
            <ContactLabel>Name</ContactLabel>
            <ContactValue>{booking.advertiser.name}</ContactValue>
          </ContactItem>
          
          <ContactItem>
            <ContactLabel>Phone Number</ContactLabel>
            <ContactValue>
              {booking.advertiser.phoneNumber}
              <CopyButton onClick={() => copyToClipboard(booking.advertiser.phoneNumber)}>
                <FaCopy size={14} />
              </CopyButton>
            </ContactValue>
          </ContactItem>
          
          {booking.advertiser.email && (
            <ContactItem>
              <ContactLabel>Email</ContactLabel>
              <ContactValue>
                {booking.advertiser.email}
                <CopyButton onClick={() => copyToClipboard(booking.advertiser.email!)}>
                  <FaCopy size={14} />
                </CopyButton>
              </ContactValue>
            </ContactItem>
          )}
        </DetailSection>
        
        {/* Admin Notes Section */}
        <DetailSection>
          <SectionTitle><FaFileAlt /> Admin Notes</SectionTitle>
          
          <NoteTextArea 
            value={note} 
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add internal notes about this move-in booking..."
          />
          
          <SaveNoteButton 
            onClick={handleSaveNote} 
            disabled={savingNote}
          >
            {savingNote ? 'Saving...' : 'Save Note'}
          </SaveNoteButton>
        </DetailSection>
        
        {/* Timeline Section */}
        <TimelineContainer>
          <DetailSection>
            <SectionTitle><FaClock /> Timeline</SectionTitle>
            
            {events.length === 0 ? (
              <div style={{ color: '#666', fontStyle: 'italic' }}>No events recorded for this booking.</div>
            ) : (
              events.map((event, index) => (
                <TimelineItem key={index}>
                  <TimelineDot />
                  <TimelineContent>
                    <TimelineTime>
                      {formatDateTime(event.timestamp instanceof Date ? event.timestamp : 
                        (event.timestamp && typeof event.timestamp.toDate === 'function') ? 
                          event.timestamp.toDate() : 
                          new Date())}
                    </TimelineTime>
                    <TimelineDescription>
                      {event.description}
                      {event.userName && ` by ${event.userName}`}
                    </TimelineDescription>
                  </TimelineContent>
                </TimelineItem>
              ))
            )}
          </DetailSection>
        </TimelineContainer>
      </DetailGrid>
    </DetailContainer>
  );
};

export default MoveInDetailPage; 
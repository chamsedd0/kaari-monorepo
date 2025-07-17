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
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${Theme.colors.secondary};
  }
`;

const SaveButton = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  background-color: ${Theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 4px;
  font: ${Theme.typography.fonts.smallB};
  cursor: pointer;
  
  &:hover {
    background-color: ${Theme.colors.primary};
  }
`;

// Safety Window Timer Component
const SafetyWindowTimer: React.FC<{ moveInDate: Date; status: MoveInStatus }> = ({ moveInDate, status }) => {
  const [timeLeft, setTimeLeft] = useState('—');
  const [isLessThanOneHour, setIsLessThanOneHour] = useState(false);
  
  useEffect(() => {
    if (status !== 'Safety Window Open') {
      setTimeLeft('—');
      return;
    }
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const safetyWindowEnd = new Date(moveInDate.getTime() + 24 * 60 * 60 * 1000);
      const diffMs = safetyWindowEnd.getTime() - now.getTime();
      
      if (diffMs <= 0) return { formatted: '00:00', lessThanHour: false };
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      const lessThanHour = hours < 1;
      
      return { formatted, lessThanHour };
    };
    
    const { formatted, lessThanHour } = calculateTimeLeft();
    setTimeLeft(formatted);
    setIsLessThanOneHour(lessThanHour);
    
    const timer = setInterval(() => {
      const { formatted, lessThanHour } = calculateTimeLeft();
      setTimeLeft(formatted);
      setIsLessThanOneHour(lessThanHour);
    }, 60000);
    
    return () => clearInterval(timer);
  }, [moveInDate, status]);
  
  if (status !== 'Safety Window Open') return null;
  
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
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const loadBookingDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Load booking details
        const bookingData = await getMoveInBookingById(id);
        if (!bookingData) {
          setError('Booking not found');
          return;
        }
        
        setBooking(bookingData);
        setNote(bookingData.internalNote || '');
        
        // Load events
        const eventsData = await getMoveInEvents(id);
        setEvents(eventsData);
      } catch (err) {
        console.error('Error loading booking details:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    
    loadBookingDetails();
  }, [id]);
  
  const handleSaveNote = async () => {
    if (!booking) return;
    
    try {
      setSaving(true);
      await updateMoveInBookingNote(booking.id, note);
      // Show success message or update UI
    } catch (err) {
      console.error('Error saving note:', err);
      // Show error message
    } finally {
      setSaving(false);
    }
  };
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show success message
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getPlaceholderImage = (propertyTitle: string) => {
    const hash = propertyTitle.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const color = `hsl(${Math.abs(hash) % 360}, 70%, 80%)`;
    return `https://placehold.co/300x150/${color.replace('#', '')}?text=${propertyTitle.charAt(0)}`;
  };
  
  if (loading) {
    return (
      <DetailContainer>
        <p>Loading booking details...</p>
      </DetailContainer>
    );
  }
  
  if (error || !booking) {
    return (
      <DetailContainer>
        <BackButton onClick={() => navigate('/dashboard/admin/move-in')}>
          <FaArrowLeft /> Back to Move-in Management
        </BackButton>
        <p style={{ color: 'red' }}>{error || 'Booking not found'}</p>
      </DetailContainer>
    );
  }
  
  return (
    <DetailContainer>
      <BackButton onClick={() => navigate('/dashboard/admin/move-in')}>
        <FaArrowLeft /> Back to Move-in Management
      </BackButton>
      
      {/* Header */}
      <DetailHeader>
        <HeaderLeft>
          <BookingId>{booking.bookingId}</BookingId>
          <StatusBadge $status={booking.status}>{booking.status}</StatusBadge>
        </HeaderLeft>
        <SafetyWindowTimer moveInDate={booking.moveInDate} status={booking.status} />
      </DetailHeader>
      
      {/* Timeline */}
      <DetailSection>
        <TimelineContainer>
          <SectionTitle>
            <FaClock /> Timeline
          </SectionTitle>
          
          {/* Default events */}
          <TimelineItem>
            <TimelineDot />
            <TimelineContent>
              <TimelineTime>{formatDateTime(booking.paymentCapturedAt)}</TimelineTime>
              <TimelineDescription>Payment captured - {booking.amount} MAD</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          
          <TimelineItem>
            <TimelineDot />
            <TimelineContent>
              <TimelineTime>{formatDateTime(booking.moveInDate)}</TimelineTime>
              <TimelineDescription>Move-in scheduled</TimelineDescription>
            </TimelineContent>
          </TimelineItem>
          
          {/* Custom events */}
          {events.map(event => (
            <TimelineItem key={event.id}>
              <TimelineDot />
              <TimelineContent>
                <TimelineTime>{formatDateTime(event.timestamp)}</TimelineTime>
                <TimelineDescription>{event.description}</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          ))}
        </TimelineContainer>
      </DetailSection>
      
      <DetailGrid>
        {/* Tenant Details */}
        <DetailSection>
          <SectionTitle>
            <FaUser /> Tenant Details
          </SectionTitle>
          
          <ContactItem>
            <ContactLabel>Name</ContactLabel>
            <ContactValue>{booking.tenant.name}</ContactValue>
          </ContactItem>
          
          <ContactItem>
            <ContactLabel>Phone</ContactLabel>
            <ContactValue>
              {booking.tenant.phoneNumber}
              <CopyButton onClick={() => copyToClipboard(booking.tenant.phoneNumber)}>
                <FaCopy size={12} />
              </CopyButton>
            </ContactValue>
          </ContactItem>
          
          {booking.tenant.email && (
            <ContactItem>
              <ContactLabel>Email</ContactLabel>
              <ContactValue>
                {booking.tenant.email}
                <CopyButton onClick={() => copyToClipboard(booking.tenant.email)}>
                  <FaCopy size={12} />
                </CopyButton>
              </ContactValue>
            </ContactItem>
          )}
          
          {booking.tenant.bankLastFour && (
            <ContactItem>
              <ContactLabel>Bank (Last 4)</ContactLabel>
              <ContactValue>****{booking.tenant.bankLastFour}</ContactValue>
            </ContactItem>
          )}
        </DetailSection>
        
        {/* Advertiser Details */}
        <DetailSection>
          <SectionTitle>
            <FaUser /> Advertiser Details
          </SectionTitle>
          
          <ContactItem>
            <ContactLabel>Name</ContactLabel>
            <ContactValue>{booking.advertiser.name}</ContactValue>
          </ContactItem>
          
          <ContactItem>
            <ContactLabel>Phone</ContactLabel>
            <ContactValue>
              {booking.advertiser.phoneNumber}
              <CopyButton onClick={() => copyToClipboard(booking.advertiser.phoneNumber)}>
                <FaCopy size={12} />
              </CopyButton>
            </ContactValue>
          </ContactItem>
          
          {booking.advertiser.email && (
            <ContactItem>
              <ContactLabel>Email</ContactLabel>
              <ContactValue>
                {booking.advertiser.email}
                <CopyButton onClick={() => copyToClipboard(booking.advertiser.email)}>
                  <FaCopy size={12} />
                </CopyButton>
              </ContactValue>
            </ContactItem>
          )}
        </DetailSection>
      </DetailGrid>
      
      {/* Property Snapshot */}
      <DetailSection>
        <SectionTitle>
          <FaHome /> Property Snapshot
        </SectionTitle>
        
        <PropertyImage 
          src={booking.property.thumbnail || getPlaceholderImage(booking.property.title)}
          alt={booking.property.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = getPlaceholderImage(booking.property.title);
          }}
        />
        
        <ContactItem>
          <ContactLabel>Property Title</ContactLabel>
          <ContactValue>{booking.property.title}</ContactValue>
        </ContactItem>
        
        <ContactItem>
          <ContactLabel>Address</ContactLabel>
          <PropertyAddress>{booking.property.address}</PropertyAddress>
        </ContactItem>
        
        {booking.property.amenities.length > 0 && (
          <ContactItem>
            <ContactLabel>Key Amenities</ContactLabel>
            <AmenitiesList>
              {booking.property.amenities.slice(0, 5).map((amenity, index) => (
                <AmenityTag key={index}>{amenity}</AmenityTag>
              ))}
              {booking.property.amenities.length > 5 && (
                <AmenityTag>+{booking.property.amenities.length - 5} more</AmenityTag>
              )}
            </AmenitiesList>
          </ContactItem>
        )}
      </DetailSection>
      
      {/* Internal Notes */}
      <DetailSection>
        <SectionTitle>
          <FaFileAlt /> Internal Notes
        </SectionTitle>
        
        <NoteTextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add internal notes about this booking..."
        />
        
        <SaveButton onClick={handleSaveNote} disabled={saving}>
          {saving ? 'Saving...' : 'Save Note'}
        </SaveButton>
      </DetailSection>
    </DetailContainer>
  );
};

export default MoveInDetailPage; 
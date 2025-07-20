import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaClock, FaUser, FaBuilding, FaCreditCard, FaClipboard, FaCopy } from 'react-icons/fa';
import { Theme } from '../../../../theme/theme';
import {
  DashboardCard,
  CardTitle,
  CardContent,
  Button,
  FormGroup,
} from '../styles';
import {
  DetailPanel,
  DetailGrid,
  DetailItem,
  DetailItemTitle,
  DetailItemContent,
  TimelineContainer,
  PropertyCard,
  PropertyImageContainer,
  PropertyImage,
  PropertyInfo,
  PropertyTitle,
  PropertyAddress,
  TimerWrapper,
  NotesSection,
  NotesList,
  NoteItem,
  NoteHeader,
  NoteContent,
  ActionBar,
} from './styles';
import { getBookingById, getBookingEvents, addBookingNote, BookingEvent, AdminBooking } from '../../../../backend/server-actions/BookingServerActions';

// Styled components
const BackButton = styled(Button)`
  background-color: transparent;
  color: ${Theme.colors.secondary};
  padding: 8px 0;
  margin-bottom: 15px;
  
  &:hover {
    background-color: transparent;
    color: ${Theme.colors.secondary}cc;
  }
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const BookingId = styled.h2`
  margin: 0;
  margin-right: 15px;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 15px;
  
  background-color: ${props => {
    switch (props.$status) {
      case 'Await-Advertiser':
        return '#fef7e0'; // yellow
      case 'Await-Tenant-Confirm':
        return '#fff3cd'; // orange
      case 'Confirmed':
        return '#e6f4ea'; // green
      case 'Cancelled':
        return '#f8d7da'; // red
      default:
        return '#e2e3e5';
    }
  }};
  
  color: ${props => {
    switch (props.$status) {
      case 'Await-Advertiser':
        return '#b06000'; // dark yellow
      case 'Await-Tenant-Confirm':
        return '#664d03'; // dark orange
      case 'Confirmed':
        return '#137333'; // dark green
      case 'Cancelled':
        return '#721c24'; // dark red
      default:
        return '#383d41';
    }
  }};
`;

const PaymentStateBadge = styled.span<{ $state: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  
  background-color: ${props => {
    switch (props.$state) {
      case 'Hold':
        return '#fef7e0'; // yellow
      case 'Captured':
        return '#e6f4ea'; // green
      case 'Voided':
        return '#f1f3f4'; // grey
      default:
        return '#f1f3f4';
    }
  }};
  
  color: ${props => {
    switch (props.$state) {
      case 'Hold':
        return '#b06000'; // dark orange
      case 'Captured':
        return '#137333'; // dark green
      case 'Voided':
        return '#5f6368'; // dark grey
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
  
  svg {
    margin-right: 5px;
  }
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

const TimelineTitle = styled.div`
  font-weight: 500;
`;

const TimelineDate = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const NoteInput = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
  margin-bottom: 10px;
  
  &:focus {
    outline: none;
    border-color: ${Theme.colors.secondary};
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-bottom: 15px;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  margin-bottom: 15px;
`;

const DetailContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const DetailSection = styled.div`
  background-color: white;
  border-radius: 8px;
  border: 1px solid ${Theme.colors.gray};
  padding: 20px;
  margin-bottom: 20px;
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

// Component for countdown timer
const CountdownTimer: React.FC<{ updatedAt: Date }> = ({ updatedAt }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isLessThanOneHour, setIsLessThanOneHour] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if date is valid before proceeding
    if (!updatedAt || isNaN(updatedAt.getTime())) {
      setTimeLeft('Invalid date');
      return;
    }
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const deadline = new Date(updatedAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours from updatedAt
      const diffMs = deadline.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        setTimeLeft('Expired');
        setIsLessThanOneHour(false);
        return;
      }
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      setTimeLeft(timeString);
      setIsLessThanOneHour(hours === 0);
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [updatedAt]);
  
  return (
    <TimerDisplay $isLessThanOneHour={isLessThanOneHour}>
      <FaClock /> {timeLeft}
    </TimerDisplay>
  );
};

// Main component
const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<AdminBooking | null>(null);
  const [events, setEvents] = useState<BookingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [addingNote, setAddingNote] = useState(false);
  
  useEffect(() => {
    const loadBookingDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Load booking details
        const bookingData = await getBookingById(id);
        setBooking(bookingData);
        
        // Load booking events
        const eventsData = await getBookingEvents(id);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error loading booking details:', error);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    
    loadBookingDetails();
  }, [id]);
  
  const handleBack = () => {
    navigate('/dashboard/admin/bookings');
  };
  
  const handleAddNote = async () => {
    if (!note.trim() || !booking || !id) return;
    
    try {
      setAddingNote(true);
      setError(null);
      setSuccess(null);
      
      // Add note to booking
      const noteId = await addBookingNote(id, note, 'admin'); // 'admin' should be replaced with actual admin ID
      
      // Update events list
      const newEvent: BookingEvent = {
        id: noteId,
        bookingId: id,
        type: 'note',
        timestamp: new Date(),
        description: note,
        userId: 'admin',
        userName: 'Admin'
      };
      
      setEvents([newEvent, ...events]);
      setNote('');
      setSuccess('Note added successfully');
    } catch (error) {
      console.error('Error adding note:', error);
      setError('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };
  
  const formatDate = (date: Date) => {
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
  
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };
  
  if (loading) {
    return (
      <DetailContainer>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Bookings
        </BackButton>
        <LoadingMessage>Loading booking details...</LoadingMessage>
      </DetailContainer>
    );
  }
  
  if (error || !booking) {
    return (
      <DetailContainer>
          <BackButton onClick={handleBack}>
            <FaArrowLeft /> Back to Bookings
          </BackButton>
        <ErrorMessage>{error || 'Booking not found'}</ErrorMessage>
      </DetailContainer>
    );
  }
  
  return (
    <DetailContainer>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Bookings
        </BackButton>
        
        <DetailHeader>
          <BookingId>{booking.bookingId}</BookingId>
          <StatusBadge $status={booking.status}>{booking.status}</StatusBadge>
        <PaymentStateBadge $state={booking.paymentState}>{booking.paymentState}</PaymentStateBadge>
        {booking.status === 'Await-Advertiser' && (
            <CountdownTimer updatedAt={booking.updatedAt} />
          )}
        </DetailHeader>
        
      <DetailGrid>
        {/* Property Section */}
        <DetailSection>
          <SectionTitle><FaBuilding /> Property Details</SectionTitle>
          
          <PropertyImage 
            src={booking.property.thumbnail || getPlaceholderImage(booking.property.title)} 
            alt={booking.property.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = getPlaceholderImage(booking.property.title);
            }}
          />
          
          <h4 style={{ margin: '0 0 10px 0' }}>{booking.property.title}</h4>
          <PropertyAddress>{booking.property.city}</PropertyAddress>
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
          
          <PaymentInfo>
            <PaymentRow>
              <PaymentLabel>Created</PaymentLabel>
              <PaymentValue>{formatDate(booking.createdAt)}</PaymentValue>
            </PaymentRow>
            <PaymentRow>
              <PaymentLabel>Last Updated</PaymentLabel>
              <PaymentValue>{formatDate(booking.updatedAt)}</PaymentValue>
            </PaymentRow>
            {booking.cardLastFour && (
              <PaymentRow>
                <PaymentLabel>Card</PaymentLabel>
                <PaymentValue>•••• {booking.cardLastFour}</PaymentValue>
              </PaymentRow>
            )}
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
          <SectionTitle><FaClipboard /> Admin Notes</SectionTitle>
          
          <NoteInput 
            value={note} 
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note about this booking..."
          />
          
          <Button 
            onClick={handleAddNote} 
            disabled={!note.trim() || addingNote}
          >
            {addingNote ? 'Adding...' : 'Add Note'}
          </Button>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </DetailSection>
        
        {/* Timeline Section */}
        <DetailSection>
          <SectionTitle><FaClock /> Timeline</SectionTitle>
          
          {events.length === 0 ? (
            <div style={{ color: '#666', fontStyle: 'italic' }}>No events recorded for this booking.</div>
          ) : (
            events.map((event, index) => (
              <TimelineItem key={index}>
                <TimelineDot />
                <TimelineContent>
                  <TimelineTitle>
                    {event.description}
                    {event.userName && ` by ${event.userName}`}
                  </TimelineTitle>
                  <TimelineDate>
                    {formatDate(event.timestamp instanceof Date ? event.timestamp : 
                      (event.timestamp && typeof event.timestamp.toDate === 'function') ? 
                        event.timestamp.toDate() : 
                        new Date())}
                  </TimelineDate>
                </TimelineContent>
              </TimelineItem>
            ))
          )}
        </DetailSection>
        </DetailGrid>
    </DetailContainer>
  );
};

export default BookingDetail; 
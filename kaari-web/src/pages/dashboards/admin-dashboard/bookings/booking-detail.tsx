import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaClock, FaUser, FaBuilding, FaCreditCard, FaClipboard } from 'react-icons/fa';
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
        return '#ffeeba'; // yellow
      case 'Await-Tenant-Confirm':
        return '#fff3cd'; // orange
      case 'Confirmed':
        return '#d4edda'; // green
      case 'Cancelled':
        return '#f8d7da'; // grey
      default:
        return '#e2e3e5';
    }
  }};
  
  color: ${props => {
    switch (props.$status) {
      case 'Await-Advertiser':
        return '#856404'; // dark yellow
      case 'Await-Tenant-Confirm':
        return '#664d03'; // dark orange
      case 'Confirmed':
        return '#155724'; // dark green
      case 'Cancelled':
        return '#721c24'; // dark grey
      default:
        return '#383d41';
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
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-bottom: 15px;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  margin-bottom: 15px;
`;

// Component for countdown timer
const CountdownTimer: React.FC<{ updatedAt: Date }> = ({ updatedAt }) => {
  const [timeLeft, setTimeLeft] = useState('00:00');
  const [isLessThanOneHour, setIsLessThanOneHour] = useState(false);
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const deadline = new Date(updatedAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours from updatedAt
      const diffMs = deadline.getTime() - now.getTime();
      
      if (diffMs <= 0) return { formatted: '00:00', lessThanHour: false };
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      const lessThanHour = hours < 1;
      
      return { formatted, lessThanHour };
    };
    
    // Initial calculation
    const { formatted, lessThanHour } = calculateTimeLeft();
    setTimeLeft(formatted);
    setIsLessThanOneHour(lessThanHour);
    
    // Update every minute
    const timer = setInterval(() => {
      const { formatted, lessThanHour } = calculateTimeLeft();
      setTimeLeft(formatted);
      setIsLessThanOneHour(lessThanHour);
    }, 60000);
    
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
        setError('Failed to load booking details. Please try again later.');
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
    if (!id || !note.trim()) return;
    
    try {
      setAddingNote(true);
      setError(null);
      setSuccess(null);
      
      // In a real app, get the current user ID
      const userId = 'admin-user-id';
      await addBookingNote(id, note, userId);
      
      // Refresh events
      const eventsData = await getBookingEvents(id);
      setEvents(eventsData);
      
      // Clear note input and show success message
      setNote('');
      setSuccess('Note added successfully');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error adding note:', error);
      setError('Failed to add note. Please try again.');
    } finally {
      setAddingNote(false);
    }
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get placeholder image for properties without images
  const getPlaceholderImage = (propertyTitle: string) => {
    // Generate a color based on the property title
    const hash = propertyTitle.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const color = `hsl(${Math.abs(hash) % 360}, 70%, 80%)`;
    
    return `https://placehold.co/100x100/${color.replace('#', '')}?text=${propertyTitle.charAt(0)}`;
  };
  
  if (loading) {
    return (
      <DashboardCard>
        <CardContent>
          <p>Loading booking details...</p>
        </CardContent>
      </DashboardCard>
    );
  }
  
  if (!booking) {
    return (
      <DashboardCard>
        <CardContent>
          <BackButton onClick={handleBack}>
            <FaArrowLeft /> Back to Bookings
          </BackButton>
          <p>Booking not found.</p>
        </CardContent>
      </DashboardCard>
    );
  }
  
  return (
    <DashboardCard>
      <CardContent>
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Bookings
        </BackButton>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <DetailHeader>
          <BookingId>{booking.bookingId}</BookingId>
          <StatusBadge $status={booking.status}>{booking.status}</StatusBadge>
          {(booking.status === 'Await-Advertiser' || booking.status === 'Await-Tenant-Confirm') && (
            <CountdownTimer updatedAt={booking.updatedAt} />
          )}
        </DetailHeader>
        
        {/* Timeline */}
        <TimelineContainer>
          <SectionTitle>
            <FaClipboard /> Timeline
          </SectionTitle>
          {events.length > 0 ? (
            events.map((event, index) => (
              <TimelineItem key={event.id || index}>
                <TimelineDot />
                <TimelineContent>
                  <TimelineTitle>{event.description}</TimelineTitle>
                  <TimelineDate>
                    {formatDate(event.timestamp instanceof Date 
                      ? event.timestamp 
                      : new Date((event.timestamp as any).seconds * 1000))}
                  </TimelineDate>
                </TimelineContent>
              </TimelineItem>
            ))
          ) : (
            <p>No events found for this booking.</p>
          )}
        </TimelineContainer>
        
        <DetailGrid>
          {/* Tenant Info */}
          <DetailItem>
            <SectionTitle>
              <FaUser /> Tenant
            </SectionTitle>
            <DetailPanel>
              <div>
                <strong>Name:</strong> {booking.tenant.name}
              </div>
              <div>
                <strong>Phone:</strong> {booking.tenant.phoneNumber}
              </div>
              {booking.tenant.email && (
                <div>
                  <strong>Email:</strong> {booking.tenant.email}
                </div>
              )}
            </DetailPanel>
          </DetailItem>
          
          {/* Advertiser Info */}
          <DetailItem>
            <SectionTitle>
              <FaUser /> Advertiser
            </SectionTitle>
            <DetailPanel>
              <div>
                <strong>Name:</strong> {booking.advertiser.name}
              </div>
              <div>
                <strong>Phone:</strong> {booking.advertiser.phoneNumber}
              </div>
              {booking.advertiser.email && (
                <div>
                  <strong>Email:</strong> {booking.advertiser.email}
                </div>
              )}
            </DetailPanel>
          </DetailItem>
        </DetailGrid>
        
        {/* Payment Details */}
        <DetailItem>
          <SectionTitle>
            <FaCreditCard /> Payment Details
          </SectionTitle>
          <DetailPanel>
            <div>
              <strong>Amount:</strong> €{booking.amount.toFixed(2)}
            </div>
            <div>
              <strong>Status:</strong> {booking.paymentState}
            </div>
            {booking.cardLastFour && (
              <div>
                <strong>Card:</strong> **** **** **** {booking.cardLastFour}
              </div>
            )}
            {booking.gatewayReference && (
              <div>
                <strong>Reference:</strong> {booking.gatewayReference}
              </div>
            )}
          </DetailPanel>
        </DetailItem>
        
        {/* Property Snapshot */}
        <DetailItem>
          <SectionTitle>
            <FaBuilding /> Property
          </SectionTitle>
          <PropertyCard>
            <PropertyImageContainer>
              <PropertyImage 
                src={booking.property.thumbnail || getPlaceholderImage(booking.property.title)} 
                alt={booking.property.title} 
                onError={(e) => {
                  // If image fails to load, replace with placeholder
                  (e.target as HTMLImageElement).src = getPlaceholderImage(booking.property.title);
                }}
              />
            </PropertyImageContainer>
            <PropertyInfo>
              <PropertyTitle>{booking.property.title}</PropertyTitle>
              <PropertyAddress>{booking.property.city}</PropertyAddress>
            </PropertyInfo>
          </PropertyCard>
        </DetailItem>
        
        {/* Internal Note */}
        <NotesSection>
          <SectionTitle>Internal Notes</SectionTitle>
          <FormGroup>
            <NoteInput
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add an internal note about this booking..."
            />
          </FormGroup>
          <ActionBar>
            <Button onClick={handleAddNote} disabled={addingNote || !note.trim()}>
              {addingNote ? 'Adding...' : 'Add Note'}
            </Button>
          </ActionBar>
          
          <NotesList>
            {events.filter(event => event.type === 'note').map((noteEvent, index) => (
              <NoteItem key={noteEvent.id || `note-${index}`}>
                <NoteHeader>
                  <span>{noteEvent.userName || 'Admin'}</span>
                  <span>
                    {formatDate(noteEvent.timestamp instanceof Date 
                      ? noteEvent.timestamp 
                      : new Date((noteEvent.timestamp as any).seconds * 1000))}
                  </span>
                </NoteHeader>
                <NoteContent>{noteEvent.description}</NoteContent>
              </NoteItem>
            ))}
          </NotesList>
        </NotesSection>
      </CardContent>
    </DashboardCard>
  );
};

export default BookingDetail; 
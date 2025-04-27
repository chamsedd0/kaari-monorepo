import React, { useEffect, useState } from 'react';
import { PhotoshootsPageStyle } from './styles';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import NeedHelpCardComponent from '../../../../components/skeletons/cards/need-help-card';
import PreparePropertyComponent from '../../../../components/skeletons/cards/prepare-your-property';
import PhotoshootStatusCard from '../../../../components/skeletons/cards/photoshoot-status-card';
import CancelPhotoshootModal from '../../../../components/skeletons/modals/cancel-photoshoot-modal';
import ReschedulePhotoshootModal from '../../../../components/skeletons/modals/reschedule-photoshoot-modal';
import profile from '../../../../assets/images/HeroImage.png';
import { useNavigate } from 'react-router-dom';
import { PhotoshootBookingServerActions } from '../../../../backend/server-actions/PhotoshootBookingServerActions';
import { PhotoshootBooking, Team } from '../../../../backend/entities';
import { useStore } from '../../../../backend/store';
import { TeamServerActions } from '../../../../backend/server-actions/TeamServerActions';

// Interface for booking with team data
interface BookingWithTeam extends PhotoshootBooking {
  team?: Team | null;
}

// Add the team leader info
interface TeamWithLeaderInfo extends Team {
  leaderPhone?: string;
}

// Enhance BookingWithTeam to include the updated team type
interface BookingWithTeamInfo extends PhotoshootBooking {
  team?: TeamWithLeaderInfo | null;
}

const PhotoshootPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [bookings, setBookings] = useState<BookingWithTeamInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithTeamInfo | null>(null);
  
  // Debug loading state
  useEffect(() => {
    console.log('Loading state changed:', loading);
  }, [loading]);
  
  // Helper function to fetch bookings with team data
  const fetchBookingsWithTeamData = async () => {
    console.log('Fetching bookings with team data');
    
    try {
      // Get all bookings
      const allBookings = await PhotoshootBookingServerActions.getAllBookings();
      console.log('All bookings:', allBookings);
      
      // Fetch team data for each booking that has a teamId
      const bookingsWithTeam: BookingWithTeamInfo[] = [];
      
      for (const booking of allBookings) {
        const bookingWithTeam: BookingWithTeamInfo = { ...booking };
        
        if (booking.teamId) {
          try {
            const team = await TeamServerActions.getTeamById(booking.teamId);
            
            // If team exists and has a lead, fetch leader phone number (mock for now)
            if (team && team.lead) {
              const teamWithLeader: TeamWithLeaderInfo = {
                ...team,
                leaderPhone: "+1234567890" // Mock phone number - in real app, fetch from user data
              };
              bookingWithTeam.team = teamWithLeader;
            } else {
              bookingWithTeam.team = team;
            }
          } catch (error) {
            console.error(`Error fetching team for booking ${booking.id}:`, error);
            bookingWithTeam.team = null;
          }
        }
        
        bookingsWithTeam.push(bookingWithTeam);
      }
      
      return bookingsWithTeam;
    } catch (error) {
      console.error('Error fetching bookings with team data:', error);
      throw error;
    }
  };
  
  useEffect(() => {
    const fetchBookings = async () => {
      console.log('Fetching bookings, user:', user?.id);
      setLoading(true);
      
      try {
        const bookingsWithTeam = await fetchBookingsWithTeamData();
        
        if (user?.id) {
          // Set bookings to all bookings for now (temporary fix)
          setBookings(bookingsWithTeam);
        } else {
          console.warn('User ID is missing');
          setBookings([]);
        }
      } catch (error) {
        console.error('Error fetching photoshoot bookings:', error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [user]);
  
  const handleBookPhotoshoot = () => {
    navigate('/photoshoot-booking');
  };
  
  const handleOpenRescheduleModal = (booking: BookingWithTeamInfo) => {
    setSelectedBooking(booking);
    setRescheduleModalOpen(true);
  };
  
  const handleCloseRescheduleModal = () => {
    setRescheduleModalOpen(false);
    setSelectedBooking(null);
  };
  
  const handleConfirmReschedule = async (newDate: Date, newTimeSlot: string) => {
    if (!selectedBooking) return;
    
    try {
      await PhotoshootBookingServerActions.rescheduleBooking(
        selectedBooking.id, 
        newDate, 
        newTimeSlot
      );
      
      // Refresh bookings after rescheduling
      if (user && user.id) {
        const bookingsWithTeam = await fetchBookingsWithTeamData();
        setBookings(bookingsWithTeam);
      }
      
      // Close the modal
      setRescheduleModalOpen(false);
      setSelectedBooking(null);
      
      // Show success message
      alert('Photoshoot rescheduled successfully');
    } catch (error) {
      console.error('Error rescheduling photoshoot:', error);
      alert('Failed to reschedule photoshoot. Please try again.');
    }
  };
  
  const handleOpenCancelModal = (booking: BookingWithTeamInfo) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  };
  
  const handleCloseCancelModal = () => {
    setCancelModalOpen(false);
    setSelectedBooking(null);
  };
  
  const handleConfirmCancel = async (reason: string) => {
    if (!selectedBooking) return;
    
    try {
      await PhotoshootBookingServerActions.cancelBooking(selectedBooking.id, reason);
      
      // Refresh bookings after cancellation
      if (user && user.id) {
        const bookingsWithTeam = await fetchBookingsWithTeamData();
        setBookings(bookingsWithTeam);
      }
      
      // Close the modal
      setCancelModalOpen(false);
      setSelectedBooking(null);
      
      // Show success message (optional)
      alert('Photoshoot cancelled successfully');
    } catch (error) {
      console.error('Error cancelling photoshoot:', error);
      alert('Failed to cancel photoshoot. Please try again.');
    }
  };
  
  const getFormattedAddress = (booking: BookingWithTeamInfo) => {
    if (booking.propertyAddress) {
      const { street, city, state, zipCode } = booking.propertyAddress;
      return `${street}, ${city}, ${state} ${zipCode}`;
    } else if (booking.streetName && booking.city) {
      return `${booking.streetName}, ${booking.city}`;
    }
    return 'Address not available';
  };
  
  const formatDate = (date: Date | string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Create safe copies for sorting to avoid issues
  const safeBookings = Array.isArray(bookings) ? [...bookings] : [];
  
  // Sort bookings: pending first, then assigned, then others
  const sortedBookings = safeBookings.sort((a, b) => {
    // Skip invalid entries
    if (!a || !b) return 0;
    
    // Prioritize active bookings (pending or assigned)
    if ((a.status === 'pending' || a.status === 'assigned') && 
        (b.status !== 'pending' && b.status !== 'assigned')) {
      return -1;
    }
    if ((b.status === 'pending' || b.status === 'assigned') && 
        (a.status !== 'pending' && a.status !== 'assigned')) {
      return 1;
    }
    
    // For active bookings, prioritize by date (closest first)
    if ((a.status === 'pending' || a.status === 'assigned') && 
        (b.status === 'pending' || b.status === 'assigned')) {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    }
    
    // Otherwise, sort by date (newest first)
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
  
  // Get active and completed bookings
  const activeBookings = sortedBookings.filter(b => b && (b.status === 'pending' || b.status === 'assigned'));
  const completedBookings = sortedBookings.filter(b => b && (b.status === 'completed' || b.status === 'cancelled'));
  
  console.log('Rendering with states:', { 
    loading, 
    bookingsLength: bookings.length,
    activeLength: activeBookings.length, 
    completedLength: completedBookings.length 
  });
  
  // Temporary function to force end loading if it's stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.log('Loading was stuck, forcing to false');
        setLoading(false);
      }
    }, 5000); // Force end loading after 5 seconds
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  return (
    <PhotoshootsPageStyle>
      <div className="left">
        <div className="section-title-container">
          <h2 className="section-title">Book a Photoshoot</h2>
          <div className="button-container">
            <PurpleButtonMB48 
              text="Book a free Photoshoot" 
              onClick={handleBookPhotoshoot}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="loading">Loading photoshoots...</div>
        ) : (
          <>
            {activeBookings.length > 0 ? (
              activeBookings.map((booking, index) => (
                <PhotoshootStatusCard
                  key={booking.id}
                  photoshootId={booking.id}
                  propertyLocation={getFormattedAddress(booking)}
                  scheduledDate={booking.date}
                  timeSlot={booking.timeSlot}
                  status={booking.status}
                  photographerName={booking.status === 'assigned' ? (booking.team?.name || "Kaari Photography Team") : undefined}
                  photographerInfo={booking.status === 'assigned' ? (booking.team?.specialization || "Professional Photographer") : undefined}
                  photographerImage={booking.status === 'assigned' ? profile : undefined}
                  phoneNumber={booking.status === 'assigned' ? booking.team?.leaderPhone : undefined}
                  number={index + 1}
                  onReschedule={() => handleOpenRescheduleModal(booking)}
                  onCancel={() => handleOpenCancelModal(booking)}
                />
              ))
            ) : (
              <div className="no-bookings">
                <p>You have no upcoming photoshoots. Book a free photoshoot for your property!</p>
              </div>
            )}
          </>
        )}
        
        {completedBookings.length > 0 && (
          <div className="history-container">
            <h3 className="history-title">History of photoshoots</h3>
            <div className="history-item-container">
              {completedBookings.map(booking => {
                const bookingDate = new Date(booking.date);
                return (
                  <div key={booking.id} className="history-item">
                    <span className="location">{getFormattedAddress(booking)}</span>
                    <span className="date-time">
                      {bookingDate.toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="date-time">
                      {bookingDate.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                    <span className={`status ${booking.status}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="right">
        <PreparePropertyComponent />
        <NeedHelpCardComponent />
      </div>
      
      {/* Cancel Photoshoot Modal */}
      {selectedBooking && (
        <>
          <CancelPhotoshootModal
            isOpen={cancelModalOpen}
            onClose={handleCloseCancelModal}
            onConfirm={handleConfirmCancel}
            photoshootLocation={getFormattedAddress(selectedBooking)}
            photoshootDate={formatDate(selectedBooking.date)}
          />
          
          <ReschedulePhotoshootModal
            isOpen={rescheduleModalOpen}
            onClose={handleCloseRescheduleModal}
            onConfirm={handleConfirmReschedule}
            photoshootLocation={getFormattedAddress(selectedBooking)}
            currentDate={selectedBooking.date}
            currentTimeSlot={selectedBooking.timeSlot}
          />
        </>
      )}
    </PhotoshootsPageStyle>
  );
};

export default PhotoshootPage;

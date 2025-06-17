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
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// Styled components for the banner reset button
const BannerResetContainer = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`;

const BannerResetButton = styled.button`
  background-color: transparent;
  color: #8F27CE;
  border: 1px solid #8F27CE;
  border-radius: 24px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(143, 39, 206, 0.05);
  }
`;

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
  const { t, i18n } = useTranslation();
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
    console.log('Fetching bookings with team data for user:', user?.id);
    
    if (!user?.id) {
      console.warn('No user ID available, cannot fetch bookings');
      return [];
    }
    
    try {
      // Get bookings for the current user only
      const userBookings = await PhotoshootBookingServerActions.getBookingsByAdvertiserId(user.id);
      console.log('User bookings:', userBookings.length);
      
      // Fetch team data for each booking that has a teamId
      const bookingsWithTeam: BookingWithTeamInfo[] = [];
      
      for (const booking of userBookings) {
        const bookingWithTeam: BookingWithTeamInfo = { ...booking };
        
        if (booking.teamId) {
          try {
            const team = await TeamServerActions.getTeamById(booking.teamId);
            
            // If team exists, use the team's phone number
            if (team) {
              const teamWithLeader: TeamWithLeaderInfo = {
                ...team,
                leaderPhone: team.phoneNumber || undefined // Use team's phone number
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
      
      if (!user?.id) {
        console.warn('User ID is missing, cannot fetch bookings');
        setBookings([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        const bookingsWithTeam = await fetchBookingsWithTeamData();
        setBookings(bookingsWithTeam);
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
  
  // Function to reset the banner visibility
  const handleResetBanner = () => {
    localStorage.setItem('showPhotoshootBanner', 'true');
    alert(t('advertiser_dashboard.photoshoot.banner_reset', 'Banner will be shown again when you visit the dashboard'));
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
      alert(t('advertiser_dashboard.photoshoot.reschedule_success', 'Photoshoot rescheduled successfully'));
    } catch (error) {
      console.error('Error rescheduling photoshoot:', error);
      alert(t('advertiser_dashboard.photoshoot.reschedule_error', 'Failed to reschedule photoshoot. Please try again.'));
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
      
      // Show success message
      alert(t('advertiser_dashboard.photoshoot.cancel_success', 'Photoshoot cancelled successfully'));
    } catch (error) {
      console.error('Error cancelling photoshoot:', error);
      alert(t('advertiser_dashboard.photoshoot.cancel_error', 'Failed to cancel photoshoot. Please try again.'));
    }
  };
  
  const getFormattedAddress = (booking: BookingWithTeamInfo) => {
    if (booking.propertyAddress) {
      const { street, city, state, zipCode } = booking.propertyAddress;
      return `${street}, ${city}, ${state} ${zipCode}`;
    } else if (booking.streetName && booking.city) {
      return `${booking.streetName}, ${booking.city}`;
    }
    return t('advertiser_dashboard.photoshoot.address_unavailable', 'Address not available');
  };
  
  const formatDate = (date: Date | string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
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
          <h2 className="section-title">{t('advertiser_dashboard.photoshoot.section_title', 'Book a photoshoot')}</h2>
          <div className="button-container">
            <PurpleButtonMB48 
              text={t('advertiser_dashboard.photoshoot.book_button', 'Book a free photoshoot')}
              onClick={handleBookPhotoshoot}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="loading">{t('advertiser_dashboard.photoshoot.loading', 'Loading photoshoots...')}</div>
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
                  photographerName={booking.status === 'assigned' ? (booking.team?.name || t('advertiser_dashboard.photoshoot.photographer_team', 'Kaari Photography Team')) : undefined}
                  photographerInfo={booking.status === 'assigned' ? (booking.team?.specialization || t('advertiser_dashboard.photoshoot.professional_photographer', 'Professional Photographer')) : undefined}
                  photographerImage={booking.status === 'assigned' ? profile : undefined}
                  phoneNumber={booking.status === 'assigned' ? booking.team?.leaderPhone : undefined}
                  number={index + 1}
                  onReschedule={() => handleOpenRescheduleModal(booking)}
                  onCancel={() => handleOpenCancelModal(booking)}
                />
              ))
            ) : (
              <div className="no-bookings">
                <p>{t('advertiser_dashboard.photoshoot.no_bookings_message', 'You don\'t have any upcoming photoshoots. Book a free photoshoot for your property!')}</p>
              </div>
            )}
          </>
        )}
        
        {completedBookings.length > 0 && (
        <div className="history-container">
          <h3 className="history-title">{t('advertiser_dashboard.photoshoot.history_title', 'Photoshoot History')}</h3>
          <div className="history-item-container">
              {completedBookings.map(booking => {
                const bookingDate = new Date(booking.date);
                const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
                return (
                  <div key={booking.id} className="history-item">
                    <span className="location">{getFormattedAddress(booking)}</span>
                    <span className="date-time">
                      {bookingDate.toLocaleDateString(locale, {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="date-time">
                      {bookingDate.toLocaleTimeString(locale, {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                    <span className={`status ${booking.status}`}>
                      {t(`advertiser_dashboard.photoshoot.${booking.status}`, booking.status)}
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
      
      {/* Banner reset button at the bottom */}
      <BannerResetContainer>
        <BannerResetButton onClick={handleResetBanner}>
          {t('advertiser_dashboard.photoshoot.show_banner_again', 'Show photoshoot banner again')}
        </BannerResetButton>
      </BannerResetContainer>
    </PhotoshootsPageStyle>
  );
};

export default PhotoshootPage;

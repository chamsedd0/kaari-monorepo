import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaPhone, FaEnvelope, FaCopy, FaToggleOn, FaToggleOff, FaCalendarAlt } from 'react-icons/fa';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import {
  DashboardCard,
  CardTitle,
  CardContent,
} from '../styles';
import { 
  getReferralAdvertiserById, 
  getReferralBookingsByAdvertiserId,
  updateReferralAdvertiserNote,
  updateReferralPassStatus,
  ReferralAdvertiser, 
  ReferralBooking,
  ReferralPassStatus
} from '../../../../backend/server-actions/ReferralServerActions';

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
  margin-bottom: 20px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid ${Theme.colors.gray};
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const AdvertiserName = styled.h2`
  margin: 0;
  font: ${Theme.typography.fonts.h3};
  color: ${Theme.colors.secondary};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const PassStatusToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
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

const ReferralCodeDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-weight: 500;
  font-size: 1.1rem;
  letter-spacing: 1px;
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

const BookingsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
`;

const BookingsTableHead = styled.thead`
  background-color: #f8f9fa;
`;

const BookingsTableHeader = styled.th`
  padding: 10px;
  text-align: left;
  font: ${Theme.typography.fonts.smallB};
  color: ${Theme.colors.gray2};
  border-bottom: 1px solid ${Theme.colors.gray};
`;

const BookingsTableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid ${Theme.colors.gray};
  }
`;

const BookingsTableCell = styled.td`
  padding: 10px;
  font: ${Theme.typography.fonts.smallM};
`;

const PropertyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PropertyThumbnail = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 4px;
  object-fit: cover;
`;

const PropertyTitle = styled.div`
  font-weight: 500;
`;

const EarningsSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const EarningsRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid ${Theme.colors.gray};
  
  &:last-child {
    border-bottom: none;
    font-weight: 600;
  }
`;

const EarningsLabel = styled.div`
  font: ${Theme.typography.fonts.smallM};
`;

const EarningsValue = styled.div`
  font: ${Theme.typography.fonts.smallB};
  color: ${Theme.colors.primary};
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

const NoBookingsMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  font: ${Theme.typography.fonts.smallM};
`;

const PassInfoContainer = styled.div`
  margin-top: 15px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const PassInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const PassInfoLabel = styled.div`
  font: ${Theme.typography.fonts.smallB};
  color: ${Theme.colors.gray2};
`;

const PassInfoValue = styled.div`
  font: ${Theme.typography.fonts.smallM};
`;

const ReferralDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [advertiser, setAdvertiser] = useState<ReferralAdvertiser | null>(null);
  const [bookings, setBookings] = useState<ReferralBooking[]>([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  useEffect(() => {
    const loadAdvertiserDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Load advertiser details
        const advertiserData = await getReferralAdvertiserById(id);
        if (!advertiserData) {
          setError('Advertiser not found');
          return;
        }
        
        setAdvertiser(advertiserData);
        setNote(advertiserData.internalNote || '');
        
        // Load referral bookings
        const bookingsData = await getReferralBookingsByAdvertiserId(id);
        setBookings(bookingsData);
      } catch (err) {
        console.error('Error loading advertiser details:', err);
        setError('Failed to load advertiser details');
      } finally {
        setLoading(false);
      }
    };
    
    loadAdvertiserDetails();
  }, [id]);
  
  const handleSaveNote = async () => {
    if (!advertiser) return;
    
    try {
      setSaving(true);
      await updateReferralAdvertiserNote(advertiser.id, note);
      // Show success message or update UI
    } catch (err) {
      console.error('Error saving note:', err);
      // Show error message
    } finally {
      setSaving(false);
    }
  };
  
  const handleTogglePassStatus = async () => {
    if (!advertiser) return;
    
    try {
      setUpdatingStatus(true);
      const newStatus: ReferralPassStatus = advertiser.passStatus === 'active' ? 'locked' : 'active';
      await updateReferralPassStatus(advertiser.id, newStatus);
      
      // Update local state
      setAdvertiser({
        ...advertiser,
        passStatus: newStatus,
        referralPass: advertiser.referralPass ? {
          ...advertiser.referralPass,
          active: newStatus === 'active'
        } : undefined
      });
      
      // Show success message
    } catch (err) {
      console.error('Error updating pass status:', err);
      // Show error message
    } finally {
      setUpdatingStatus(false);
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
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getPlaceholderImage = (propertyTitle: string) => {
    const hash = propertyTitle.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const color = `hsl(${Math.abs(hash) % 360}, 70%, 80%)`;
    return `https://placehold.co/30x30/${color.replace('#', '')}?text=${propertyTitle.charAt(0)}`;
  };
  
  if (loading) {
    return (
      <DetailContainer>
        <p>Loading advertiser details...</p>
      </DetailContainer>
    );
  }
  
  if (error || !advertiser) {
    return (
      <DetailContainer>
        <BackButton onClick={() => navigate('/dashboard/admin/referrals')}>
          <FaArrowLeft /> Back to Referrals
        </BackButton>
        <p style={{ color: 'red' }}>{error || 'Advertiser not found'}</p>
      </DetailContainer>
    );
  }
  
  return (
    <DetailContainer>
      <BackButton onClick={() => navigate('/dashboard/admin/referrals')}>
        <FaArrowLeft /> Back to Referrals
      </BackButton>
      
      {/* Header */}
      <DetailHeader>
        <HeaderLeft>
          <AdvertiserName>{advertiser.name}</AdvertiserName>
        </HeaderLeft>
        <HeaderRight>
          <PassStatusToggle onClick={handleTogglePassStatus} title="Toggle pass status">
            {advertiser.passStatus === 'active' ? (
              <>
                <FaToggleOn size={24} color="#137333" />
                <span style={{ color: '#137333' }}>Active</span>
              </>
            ) : (
              <>
                <FaToggleOff size={24} color="#5f6368" />
                <span style={{ color: '#5f6368' }}>Locked</span>
              </>
            )}
          </PassStatusToggle>
        </HeaderRight>
      </DetailHeader>
      
      <DetailGrid>
        {/* Advertiser Info */}
        <DetailSection>
          <SectionTitle>
            <FaUser /> Advertiser Information
          </SectionTitle>
          
          <ContactItem>
            <ContactLabel>Name</ContactLabel>
            <ContactValue>{advertiser.name}</ContactValue>
          </ContactItem>
          
          <ContactItem>
            <ContactLabel>Phone</ContactLabel>
            <ContactValue>
              {advertiser.phoneNumber}
              <CopyButton onClick={() => copyToClipboard(advertiser.phoneNumber)}>
                <FaCopy size={14} />
              </CopyButton>
            </ContactValue>
          </ContactItem>
          
          {advertiser.email && (
            <ContactItem>
              <ContactLabel>Email</ContactLabel>
              <ContactValue>
                {advertiser.email}
                <CopyButton onClick={() => copyToClipboard(advertiser.email)}>
                  <FaCopy size={14} />
                </CopyButton>
              </ContactValue>
            </ContactItem>
          )}
          
          <ContactItem>
            <ContactLabel>Referral Code</ContactLabel>
            <ReferralCodeDisplay>
              {advertiser.referralCode}
              <CopyButton onClick={() => copyToClipboard(advertiser.referralCode)}>
                <FaCopy size={16} />
              </CopyButton>
            </ReferralCodeDisplay>
          </ContactItem>
          
          {advertiser.referralPass && (
            <ContactItem>
              <ContactLabel>Referral Pass</ContactLabel>
              <PassInfoContainer>
                <PassInfoRow>
                  <PassInfoLabel>Status</PassInfoLabel>
                  <PassInfoValue>{advertiser.referralPass.active ? 'Active' : 'Locked'}</PassInfoValue>
                </PassInfoRow>
                <PassInfoRow>
                  <PassInfoLabel>Booking Requirement</PassInfoLabel>
                  <PassInfoValue>{advertiser.referralPass.bookingRequirement}</PassInfoValue>
                </PassInfoRow>
                <PassInfoRow>
                  <PassInfoLabel>Bookings Since Pass</PassInfoLabel>
                  <PassInfoValue>{advertiser.referralPass.bookingsSincePass}</PassInfoValue>
                </PassInfoRow>
                <PassInfoRow>
                  <PassInfoLabel>Listing Requirement</PassInfoLabel>
                  <PassInfoValue>{advertiser.referralPass.listingRequirement}</PassInfoValue>
                </PassInfoRow>
                <PassInfoRow>
                  <PassInfoLabel>Listings Since Pass</PassInfoLabel>
                  <PassInfoValue>{advertiser.referralPass.listingsSincePass}</PassInfoValue>
                </PassInfoRow>
                <PassInfoRow>
                  <PassInfoLabel>Expiry Date</PassInfoLabel>
                  <PassInfoValue>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaCalendarAlt size={12} />
                      {formatDate(advertiser.referralPass.expiryDate)}
                    </div>
                  </PassInfoValue>
                </PassInfoRow>
              </PassInfoContainer>
            </ContactItem>
          )}
        </DetailSection>
        
        {/* Internal Notes */}
        <DetailSection>
          <SectionTitle>Internal Notes</SectionTitle>
          
          <NoteTextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add internal notes about this advertiser's referrals..."
          />
          
          <SaveButton onClick={handleSaveNote} disabled={saving}>
            {saving ? 'Saving...' : 'Save Note'}
          </SaveButton>
        </DetailSection>
        
        {/* Referral Stats */}
        {advertiser.referralStats && (
          <DetailSection>
            <SectionTitle>Referral Statistics</SectionTitle>
            
            <PassInfoContainer>
              <PassInfoRow>
                <PassInfoLabel>First Rent Bonus</PassInfoLabel>
                <PassInfoValue>{advertiser.referralStats.firstRentBonus}</PassInfoValue>
              </PassInfoRow>
              <PassInfoRow>
                <PassInfoLabel>Total Referrals</PassInfoLabel>
                <PassInfoValue>{advertiser.referralStats.totalReferrals}</PassInfoValue>
              </PassInfoRow>
              <PassInfoRow>
                <PassInfoLabel>Successful Bookings</PassInfoLabel>
                <PassInfoValue>{advertiser.referralStats.successfulBookings}</PassInfoValue>
              </PassInfoRow>
              <PassInfoRow>
                <PassInfoLabel>Monthly Earnings</PassInfoLabel>
                <PassInfoValue>{formatCurrency(advertiser.referralStats.monthlyEarnings)}</PassInfoValue>
              </PassInfoRow>
              <PassInfoRow>
                <PassInfoLabel>Annual Earnings</PassInfoLabel>
                <PassInfoValue>{formatCurrency(advertiser.referralStats.annualEarnings)}</PassInfoValue>
              </PassInfoRow>
            </PassInfoContainer>
          </DetailSection>
        )}
        
        {/* Bookings List */}
        <DetailSection style={{ gridColumn: '1 / -1' }}>
          <SectionTitle>Bookings via Referral Code</SectionTitle>
          
          {bookings.length === 0 ? (
            <NoBookingsMessage>
              No bookings have been made using this advertiser's referral code yet.
            </NoBookingsMessage>
          ) : (
            <>
              <BookingsTable>
                <BookingsTableHead>
                  <BookingsTableRow>
                    <BookingsTableHeader>Booking ID</BookingsTableHeader>
                    <BookingsTableHeader>Property</BookingsTableHeader>
                    <BookingsTableHeader>Tenant</BookingsTableHeader>
                    <BookingsTableHeader>Date</BookingsTableHeader>
                    <BookingsTableHeader>Amount Earned</BookingsTableHeader>
                    <BookingsTableHeader>Status</BookingsTableHeader>
                  </BookingsTableRow>
                </BookingsTableHead>
                <tbody>
                  {bookings.map(booking => (
                    <BookingsTableRow key={booking.id}>
                      <BookingsTableCell>{booking.bookingId}</BookingsTableCell>
                      <BookingsTableCell>
                        <PropertyInfo>
                          <PropertyThumbnail 
                            src={booking.propertyThumbnail || getPlaceholderImage(booking.propertyTitle)} 
                            alt={booking.propertyTitle} 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getPlaceholderImage(booking.propertyTitle);
                            }}
                          />
                          <PropertyTitle>{booking.propertyTitle}</PropertyTitle>
                        </PropertyInfo>
                      </BookingsTableCell>
                      <BookingsTableCell>{booking.tenantName}</BookingsTableCell>
                      <BookingsTableCell>{formatDate(booking.date)}</BookingsTableCell>
                      <BookingsTableCell style={{ color: Theme.colors.primary, fontWeight: 500 }}>
                        {formatCurrency(booking.amount)}
                      </BookingsTableCell>
                      <BookingsTableCell>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </BookingsTableCell>
                    </BookingsTableRow>
                  ))}
                </tbody>
              </BookingsTable>
              
              <EarningsSummary>
                <EarningsRow>
                  <EarningsLabel>Total Pending</EarningsLabel>
                  <EarningsValue>{formatCurrency(advertiser.earningsPending)}</EarningsValue>
                </EarningsRow>
                <EarningsRow>
                  <EarningsLabel>Total Paid</EarningsLabel>
                  <EarningsValue>{formatCurrency(advertiser.earningsPaid)}</EarningsValue>
                </EarningsRow>
                <EarningsRow>
                  <EarningsLabel>Total Earnings</EarningsLabel>
                  <EarningsValue>{formatCurrency(advertiser.earningsPending + advertiser.earningsPaid)}</EarningsValue>
                </EarningsRow>
              </EarningsSummary>
            </>
          )}
        </DetailSection>
      </DetailGrid>
    </DetailContainer>
  );
};

export default ReferralDetailPage; 
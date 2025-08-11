import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaPhone, FaEnvelope, FaCopy, FaToggleOn, FaToggleOff, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { PageContainer, PageHeader, GlassCard } from '../../../../components/admin/AdminUI';
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
  margin-bottom: 10px;
  
  &:focus {
    outline: none;
    border-color: ${Theme.colors.secondary};
  }
`;

const SaveButton = styled.button`
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
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  
  background-color: ${props => {
    switch (props.$status) {
      case 'pending':
        return '#fef7e0'; // yellow
      case 'paid':
        return '#e6f4ea'; // green
      case 'completed':
        return '#e6f4ea'; // green
      default:
        return '#f1f3f4';
    }
  }};
  
  color: ${props => {
    switch (props.$status) {
      case 'pending':
        return '#b06000'; // dark yellow
      case 'paid':
      case 'completed':
        return '#137333'; // dark green
      default:
        return '#5f6368';
    }
  }};
`;

const PassRequirementsList = styled.ul`
  margin: 0;
  padding-left: 20px;
`;

const PassRequirementItem = styled.li<{ $isMet: boolean }>`
  margin-bottom: 8px;
  color: ${props => props.$isMet ? '#137333' : '#5f6368'};
`;

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

const SuccessMessage = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  background-color: #e6f4ea;
  border-radius: 4px;
  color: #137333;
  font-weight: 500;
`;

const NoDataMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  font-style: italic;
`;

const WarningMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff3cd;
  border-radius: 4px;
  color: #664d03;
  font-weight: 500;
`;

const ReferralDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [advertiser, setAdvertiser] = useState<ReferralAdvertiser | null>(null);
  const [bookings, setBookings] = useState<ReferralBooking[]>([]);
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [savingNote, setSavingNote] = useState<boolean>(false);
  const [togglingStatus, setTogglingStatus] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    const loadAdvertiserDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get advertiser details
        const advertiserData = await getReferralAdvertiserById(id);
        if (!advertiserData) {
          setError('Advertiser not found');
          return;
        }
        
        setAdvertiser(advertiserData);
        setNote(advertiserData.internalNote || '');
        
        // Get referral bookings
        const bookingsData = await getReferralBookingsByAdvertiserId(id);
        setBookings(bookingsData);
      } catch (err) {
        console.error('Error loading advertiser details:', err);
        setError('Failed to load advertiser details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadAdvertiserDetails();
  }, [id]);
  
  const handleSaveNote = async () => {
    if (!advertiser || !id) return;
    
    try {
      setSavingNote(true);
      setError(null);
      setSuccess(null);
      
      await updateReferralAdvertiserNote(id, note);
      setSuccess('Note saved successfully');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving note:', err);
      setError('Failed to save note. Please try again.');
    } finally {
      setSavingNote(false);
    }
  };
  
  const handleTogglePassStatus = async () => {
    if (!advertiser || !id) return;
    
    try {
      setTogglingStatus(true);
      setError(null);
      setSuccess(null);
      
      // Toggle pass status
      const newStatus: ReferralPassStatus = advertiser.passStatus === 'active' ? 'locked' : 'active';
      await updateReferralPassStatus(id, newStatus);
      
      // Update local state
      setAdvertiser({
        ...advertiser,
        passStatus: newStatus
      });
      
      setSuccess(`Pass status updated to ${newStatus === 'active' ? 'Active' : 'Locked'}`);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating pass status:', err);
      setError('Failed to update pass status. Please try again.');
    } finally {
      setTogglingStatus(false);
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
  
  const formatDate = (date: Date) => {
    // Check if date is valid before formatting
    if (!date || isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const formatCurrency = (amount: number) => {
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
    canvas.width = 30;
    canvas.height = 30;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = colors[colorIndex];
      ctx.fillRect(0, 0, 30, 30);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initials, 15, 15);
    }
    
    return canvas.toDataURL();
  };
  
  const getTotalReferrals = () => {
    if (!advertiser) return 0;
    
    // Use referralStats if available, otherwise use bookingsViaCode
    if (advertiser.referralStats) {
      return advertiser.referralStats.totalReferrals + advertiser.referralStats.successfulBookings;
    }
    return advertiser.bookingsViaCode;
  };
  
  const getTotalEarnings = () => {
    if (!advertiser) return 0;
    return advertiser.earningsPending + advertiser.earningsPaid;
  };
  
  const isPassRequirementMet = (current: number, required: number) => {
    return current >= required;
  };
  
  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="Referral Advertiser" />
        <GlassCard>
          <DetailContainer>
            <BackButton onClick={() => navigate('/dashboard/admin/referrals')}>
              <FaArrowLeft /> Back to Referrals
            </BackButton>
            <LoadingMessage>Loading advertiser details...</LoadingMessage>
          </DetailContainer>
        </GlassCard>
      </PageContainer>
    );
  }
  
  if (error || !advertiser) {
    return (
      <PageContainer>
        <PageHeader title="Referral Advertiser" />
        <GlassCard>
          <DetailContainer>
            <BackButton onClick={() => navigate('/dashboard/admin/referrals')}>
              <FaArrowLeft /> Back to Referrals
            </BackButton>
            <ErrorMessage>{error || 'Advertiser not found'}</ErrorMessage>
          </DetailContainer>
        </GlassCard>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader title="Referral Advertiser" />
      <GlassCard>
        <DetailContainer>
          <BackButton onClick={() => navigate('/dashboard/admin/referrals')}>
            <FaArrowLeft /> Back to Referrals
          </BackButton>
          
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <DetailHeader>
            <HeaderLeft>
              <AdvertiserName>{advertiser.name}</AdvertiserName>
              <div>Referral Code: <strong>{advertiser.referralCode}</strong></div>
            </HeaderLeft>
            
            <HeaderRight>
              <PassStatusToggle onClick={handleTogglePassStatus} title="Click to toggle pass status">
                {advertiser.passStatus === 'active' ? (
                  <>
                    <FaToggleOn size={24} color={Theme.colors.secondary} />
                    <span>Pass Active</span>
                  </>
                ) : (
                  <>
                    <FaToggleOff size={24} color={Theme.colors.gray2} />
                    <span>Pass Locked</span>
                  </>
                )}
              </PassStatusToggle>
            </HeaderRight>
          </DetailHeader>
          
          <DetailGrid>
            {/* Contact Information */}
            <DetailSection>
              <SectionTitle><FaUser /> Contact Information</SectionTitle>
              
              <ContactItem>
                <ContactLabel>Name</ContactLabel>
                <ContactValue>{advertiser.name}</ContactValue>
              </ContactItem>
              
              <ContactItem>
                <ContactLabel>Phone Number</ContactLabel>
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
                  <CopyButton onClick={() => advertiser.email && copyToClipboard(advertiser.email)}>
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
            </DetailSection>
            
            {/* Referral Pass */}
            <DetailSection>
              <SectionTitle><FaCalendarAlt /> Referral Pass Status</SectionTitle>
              
              {advertiser.referralPass ? (
                <>
                  <ContactItem>
                    <ContactLabel>Status</ContactLabel>
                    <ContactValue>
                      {advertiser.passStatus === 'active' ? (
                        <span style={{ color: '#137333', fontWeight: 'bold' }}>Active</span>
                      ) : (
                        <span style={{ color: '#5f6368' }}>Locked</span>
                      )}
                    </ContactValue>
                  </ContactItem>
                  
                  {advertiser.referralPass.expiryDate && !isNaN(advertiser.referralPass.expiryDate.getTime()) && (
                    <ContactItem>
                      <ContactLabel>Expiry Date</ContactLabel>
                      <ContactValue>{formatDate(advertiser.referralPass.expiryDate)}</ContactValue>
                    </ContactItem>
                  )}
                  
                <ContactItem>
                    <ContactLabel>Requirements</ContactLabel>
                    <PassRequirementsList>
                      <PassRequirementItem 
                        $isMet={isPassRequirementMet(
                          advertiser.referralPass.bookingsSincePass, 
                          advertiser.referralPass.bookingRequirement
                        )}
                      >
                        Bookings: {advertiser.referralPass.bookingsSincePass} / {advertiser.referralPass.bookingRequirement}
                      </PassRequirementItem>
                      <PassRequirementItem 
                        $isMet={isPassRequirementMet(
                          advertiser.referralPass.listingsSincePass, 
                          advertiser.referralPass.listingRequirement
                        )}
                      >
                        Listings: {advertiser.referralPass.listingsSincePass} / {advertiser.referralPass.listingRequirement}
                      </PassRequirementItem>
                    </PassRequirementsList>
                </ContactItem>
                </>
              ) : (
                <WarningMessage>
                  <FaExclamationTriangle />
                  No referral pass information available
                </WarningMessage>
              )}
            </DetailSection>
            
            {/* Earnings Summary */}
            <DetailSection>
              <SectionTitle>Earnings Summary</SectionTitle>
              
              <EarningsSummary>
                <EarningsRow>
                  <EarningsLabel>Total Referrals</EarningsLabel>
                  <EarningsValue>{getTotalReferrals()}</EarningsValue>
                </EarningsRow>
                <EarningsRow>
                  <EarningsLabel>Pending Earnings</EarningsLabel>
                  <EarningsValue>{formatCurrency(advertiser.earningsPending)}</EarningsValue>
                </EarningsRow>
                <EarningsRow>
                  <EarningsLabel>Paid Earnings</EarningsLabel>
                  <EarningsValue>{formatCurrency(advertiser.earningsPaid)}</EarningsValue>
                </EarningsRow>
                <EarningsRow>
                  <EarningsLabel>Total Earnings</EarningsLabel>
                  <EarningsValue>{formatCurrency(getTotalEarnings())}</EarningsValue>
                </EarningsRow>
              </EarningsSummary>
            </DetailSection>
            
            {/* Admin Notes */}
            <DetailSection>
              <SectionTitle>Admin Notes</SectionTitle>
              
              <NoteTextArea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add internal notes about this advertiser..."
              />
              
              <SaveButton 
                onClick={handleSaveNote} 
                disabled={savingNote}
              >
                {savingNote ? 'Saving...' : 'Save Note'}
              </SaveButton>
            </DetailSection>
            
            {/* Referral Bookings */}
            <DetailSection style={{ gridColumn: '1 / -1' }}>
              <SectionTitle>Referral Bookings</SectionTitle>
              
              {bookings.length === 0 ? (
                <NoDataMessage>No referral bookings found for this advertiser.</NoDataMessage>
              ) : (
                  <BookingsTable>
                    <BookingsTableHead>
                    <tr>
                        <BookingsTableHeader>Property</BookingsTableHeader>
                        <BookingsTableHeader>Tenant</BookingsTableHeader>
                        <BookingsTableHeader>Date</BookingsTableHeader>
                      <BookingsTableHeader>Amount</BookingsTableHeader>
                        <BookingsTableHeader>Status</BookingsTableHeader>
                    </tr>
                    </BookingsTableHead>
                    <tbody>
                    {bookings.map((booking, index) => (
                      <BookingsTableRow key={index}>
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
                        <BookingsTableCell>{formatCurrency(booking.amount)}</BookingsTableCell>
                          <BookingsTableCell>
                          <StatusBadge $status={booking.status}>
                            {booking.status === 'pending' ? 'Pending' : 
                             booking.status === 'paid' ? 'Paid' : 'Completed'}
                          </StatusBadge>
                          </BookingsTableCell>
                        </BookingsTableRow>
                      ))}
                    </tbody>
                  </BookingsTable>
              )}
            </DetailSection>
          </DetailGrid>
        </DetailContainer>
      </GlassCard>
    </PageContainer>
  );
};

export default ReferralDetailPage; 
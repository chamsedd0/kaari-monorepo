import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaCopy, FaClock } from 'react-icons/fa';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import {
  DashboardCard,
  CardTitle,
  CardContent,
} from '../styles';
import { useNavigate } from 'react-router-dom';
import { 
  getAllMoveInBookings, 
  getMoveInBookingsByStatus, 
  MoveInBooking, 
  MoveInStatus 
} from '../../../../backend/server-actions/MoveInServerActions';

// Excel-like styled components
const MoveInTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
  overflow: hidden;
  table-layout: fixed;
`;

const MoveInTableHead = styled.thead`
  background-color: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const MoveInTableHeader = styled.th`
  padding: 12px 15px;
  text-align: left;
  font: ${Theme.typography.fonts.smallB};
  color: ${Theme.colors.gray2};
  border-bottom: 1px solid ${Theme.colors.gray};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MoveInRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f3eefb;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${Theme.colors.gray};
  }
`;

const MoveInCell = styled.td`
  padding: 10px 15px;
  font: ${Theme.typography.fonts.smallM};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

const PropertyCell = styled(MoveInCell)`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PropertyThumbnail = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
`;

const PropertyInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PropertyTitle = styled.div`
  font-weight: 500;
`;

const PropertyCity = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ContactName = styled.div`
  font-weight: 500;
`;

const ContactPhone = styled.div`
  font-size: 0.8rem;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    color: ${Theme.colors.secondary};
  }
`;

const StatusBadge = styled.span<{ $status: MoveInStatus }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font: ${Theme.typography.fonts.smallB};
  
  background-color: ${props => {
    switch (props.$status) {
      case 'Move-in Upcoming':
        return '#fef7e0'; // yellow
      case 'Safety Window Open':
        return '#fff3cd'; // orange
      case 'Safety Window Closed':
        return '#e6f4ea'; // green
      case 'Cancelled – Tenant':
      case 'Cancelled – Advertiser':
        return '#fce8e6'; // red
      default:
        return '#f1f3f4';
    }
  }};
  
  color: ${props => {
    switch (props.$status) {
      case 'Move-in Upcoming':
        return '#b06000'; // dark yellow
      case 'Safety Window Open':
        return '#664d03'; // dark orange
      case 'Safety Window Closed':
        return '#137333'; // dark green
      case 'Cancelled – Tenant':
      case 'Cancelled – Advertiser':
        return '#c5221f'; // dark red
      default:
        return '#5f6368';
    }
  }};
`;

const ReasonBadge = styled.span<{ $reason: string }>`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 500;
  
  background-color: ${props => {
    switch (props.$reason) {
      case 'None':
        return 'transparent';
      case 'Refund requested':
        return '#fff3cd';
      case 'Tenant cancelled':
      case 'Advertiser cancelled':
        return '#fce8e6';
      default:
        return '#f1f3f4';
    }
  }};
  
  color: ${props => {
    switch (props.$reason) {
      case 'None':
        return '#666';
      case 'Refund requested':
        return '#664d03';
      case 'Tenant cancelled':
      case 'Advertiser cancelled':
        return '#c5221f';
      default:
        return '#5f6368';
    }
  }};
`;

const TimerDisplay = styled.div<{ $isLessThanOneHour?: boolean; $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${props => 
    props.$isLessThanOneHour ? '#dc3545' : 
    props.$isActive ? '#666' : '#ccc'
  };
  font-weight: ${props => props.$isLessThanOneHour ? 'bold' : 'normal'};
  font-family: 'Courier New', monospace;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const FilterSelect = styled.select`
  min-width: 150px;
  padding: 8px 10px;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
  font: ${Theme.typography.fonts.smallM};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${Theme.colors.secondary};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex-grow: 1;
  max-width: 300px;
  
  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: ${Theme.colors.gray2};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 10px 8px 35px;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
  font: ${Theme.typography.fonts.smallM};
  
  &:focus {
    outline: none;
    border-color: ${Theme.colors.secondary};
  }
`;

const TableContainer = styled.div`
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
`;

const NoDataMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const StatusCount = styled.span`
  background-color: ${Theme.colors.gray};
  color: ${Theme.colors.gray2};
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 0.8rem;
  margin-left: 5px;
`;

const SafetyWindowTimer: React.FC<{ moveInDate: Date; status: MoveInStatus }> = ({ moveInDate, status }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isLessThanOneHour, setIsLessThanOneHour] = useState<boolean>(false);
  
  useEffect(() => {
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
    <TimerDisplay $isLessThanOneHour={isLessThanOneHour} $isActive={isActive}>
      <FaClock />
      {timeLeft}
    </TimerDisplay>
  );
};

const MoveInPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<MoveInBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<MoveInBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Load bookings data
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let fetchedBookings: MoveInBooking[];
        
        if (statusFilter === 'all') {
          // Get all move-in bookings
          fetchedBookings = await getAllMoveInBookings();
        } else {
          // Get bookings filtered by status
          fetchedBookings = await getMoveInBookingsByStatus(statusFilter as MoveInStatus);
        }
        
        // Sort bookings by move-in date (most recent first)
        fetchedBookings.sort((a, b) => b.moveInDate.getTime() - a.moveInDate.getTime());
        
        setBookings(fetchedBookings);
        setFilteredBookings(fetchedBookings);
      } catch (err) {
        console.error('Error loading move-in bookings:', err);
        setError('Failed to load move-in bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadBookings();
  }, [statusFilter]);
  
  // Apply search filter
  useEffect(() => {
    const applyFilters = (
      bookingsToFilter: MoveInBooking[], 
      status: string, 
      search: string
    ) => {
      // Start with all bookings
      let result = [...bookingsToFilter];
      
      // Apply status filter
      if (status !== 'all') {
        result = result.filter(booking => booking.status === status);
      }

      // Apply search filter if provided
      if (search.trim() !== '') {
        const searchLower = search.toLowerCase();
        result = result.filter(booking => 
          booking.property.title.toLowerCase().includes(searchLower) ||
          booking.property.city.toLowerCase().includes(searchLower) ||
          booking.tenant.name.toLowerCase().includes(searchLower) ||
          booking.tenant.phoneNumber.toLowerCase().includes(searchLower) ||
          booking.advertiser.name.toLowerCase().includes(searchLower) ||
          booking.advertiser.phoneNumber.toLowerCase().includes(searchLower) ||
          booking.bookingId.toLowerCase().includes(searchLower)
        );
      }
      
      return result;
    };
    
    const filtered = applyFilters(bookings, statusFilter, searchQuery);
    setFilteredBookings(filtered);
  }, [bookings, searchQuery, statusFilter]);
  
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const openBookingDetail = (booking: MoveInBooking) => {
    navigate(`/dashboard/admin/move-in/${booking.id}`);
  };
  
  const copyToClipboard = async (text: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };
  
  const formatMoveInDate = (date: Date) => {
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
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = colors[colorIndex];
      ctx.fillRect(0, 0, 40, 40);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initials, 20, 20);
    }
    
    return canvas.toDataURL();
  };
  
  const countByStatus = (status: MoveInStatus | 'all'): number => {
    if (status === 'all') {
      return bookings.length;
    }
    return bookings.filter(booking => booking.status === status).length;
  };
  
  return (
    <DashboardCard>
      <CardTitle>Move-In Management</CardTitle>
      <CardContent>
        <FilterContainer>
          <FilterSelect 
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="all">All Statuses ({countByStatus('all')})</option>
            <option value="Move-in Upcoming">Move-in Upcoming ({countByStatus('Move-in Upcoming')})</option>
            <option value="Safety Window Open">Safety Window Open ({countByStatus('Safety Window Open')})</option>
            <option value="Safety Window Closed">Safety Window Closed ({countByStatus('Safety Window Closed')})</option>
            <option value="Cancelled – Tenant">Cancelled – Tenant ({countByStatus('Cancelled – Tenant')})</option>
            <option value="Cancelled – Advertiser">Cancelled – Advertiser ({countByStatus('Cancelled – Advertiser')})</option>
          </FilterSelect>
          
          <SearchContainer>
            <FaSearch />
            <SearchInput 
              type="text" 
              placeholder="Search by name, property, or phone"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </SearchContainer>
        </FilterContainer>
        
        <TableContainer>
          {loading ? (
            <LoadingMessage>Loading move-in data...</LoadingMessage>
          ) : error ? (
            <NoDataMessage>{error}</NoDataMessage>
          ) : filteredBookings.length === 0 ? (
            <NoDataMessage>No move-in bookings found matching your criteria.</NoDataMessage>
          ) : (
            <MoveInTable>
              <MoveInTableHead>
                <tr>
                  <MoveInTableHeader style={{ width: '25%' }}>Property</MoveInTableHeader>
                  <MoveInTableHeader style={{ width: '15%' }}>Tenant</MoveInTableHeader>
                  <MoveInTableHeader style={{ width: '15%' }}>Advertiser</MoveInTableHeader>
                  <MoveInTableHeader style={{ width: '15%' }}>Move-In Date</MoveInTableHeader>
                  <MoveInTableHeader style={{ width: '10%' }}>Amount</MoveInTableHeader>
                  <MoveInTableHeader style={{ width: '10%' }}>Status</MoveInTableHeader>
                  <MoveInTableHeader style={{ width: '10%' }}>Safety Window</MoveInTableHeader>
                </tr>
              </MoveInTableHead>
              <tbody>
                {filteredBookings.map(booking => (
                  <MoveInRow key={booking.id} onClick={() => openBookingDetail(booking)}>
                    <PropertyCell>
                      <PropertyThumbnail 
                        src={booking.property.thumbnail || getPlaceholderImage(booking.property.title)} 
                        alt={booking.property.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getPlaceholderImage(booking.property.title);
                        }}
                      />
                      <PropertyInfo>
                        <PropertyTitle>{booking.property.title}</PropertyTitle>
                        <PropertyCity>{booking.property.city}</PropertyCity>
                      </PropertyInfo>
                    </PropertyCell>
                    <MoveInCell>
                      <ContactInfo>
                        <ContactName>{booking.tenant.name}</ContactName>
                        <ContactPhone onClick={(e) => copyToClipboard(booking.tenant.phoneNumber, e)}>
                          {booking.tenant.phoneNumber}
                          <FaCopy size={12} />
                        </ContactPhone>
                      </ContactInfo>
                    </MoveInCell>
                    <MoveInCell>
                      <ContactInfo>
                        <ContactName>{booking.advertiser.name}</ContactName>
                        <ContactPhone onClick={(e) => copyToClipboard(booking.advertiser.phoneNumber, e)}>
                          {booking.advertiser.phoneNumber}
                          <FaCopy size={12} />
                        </ContactPhone>
                      </ContactInfo>
                    </MoveInCell>
                    <MoveInCell>
                      {formatMoveInDate(booking.moveInDate)}
                    </MoveInCell>
                    <MoveInCell>
                      {formatAmount(booking.amount)}
                    </MoveInCell>
                    <MoveInCell>
                      <StatusBadge $status={booking.status}>
                        {booking.status}
                      </StatusBadge>
                      {booking.reason !== 'None' && (
                        <div style={{ marginTop: '5px' }}>
                          <ReasonBadge $reason={booking.reason}>
                            {booking.reason}
                          </ReasonBadge>
                        </div>
                      )}
                    </MoveInCell>
                    <MoveInCell>
                      <SafetyWindowTimer 
                        moveInDate={booking.moveInDate}
                        status={booking.status}
                      />
                    </MoveInCell>
                  </MoveInRow>
                ))}
              </tbody>
            </MoveInTable>
          )}
        </TableContainer>
      </CardContent>
    </DashboardCard>
  );
};

export default MoveInPage; 
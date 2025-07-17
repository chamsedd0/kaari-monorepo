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

const ActionButton = styled.button`
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: white;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
  font: ${Theme.typography.fonts.smallM};
  cursor: pointer;
  
  &:hover {
    background-color: #f3eefb;
    border-color: ${Theme.colors.secondary};
  }
`;

// Component for countdown timer (only during Safety Window Open)
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
      const safetyWindowEnd = new Date(moveInDate.getTime() + 24 * 60 * 60 * 1000); // 24 hours after move-in
      const diffMs = safetyWindowEnd.getTime() - now.getTime();
      
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
  }, [moveInDate, status]);
  
  const isActive = status === 'Safety Window Open';
  
  return (
    <TimerDisplay $isLessThanOneHour={isLessThanOneHour} $isActive={isActive}>
      {isActive && <FaClock size={12} />}
      {timeLeft}
    </TimerDisplay>
  );
};

// Main component
const MoveInPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<MoveInBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<MoveInBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Load move-in bookings data
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all move-in bookings
        const allBookings = await getAllMoveInBookings();
        setBookings(allBookings);
        setFilteredBookings(allBookings);
      } catch (err) {
        console.error('Error loading move-in bookings:', err);
        setError('Failed to load move-in bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadBookings();
  }, []);
  
  // Apply filters
  useEffect(() => {
    const applyFilters = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let filtered: MoveInBooking[] = [];
        
        // Apply status filter
        if (statusFilter !== 'all') {
          filtered = await getMoveInBookingsByStatus(statusFilter as MoveInStatus);
        } else {
          filtered = [...bookings];
        }
        
        // Apply search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            booking =>
              booking.bookingId.toLowerCase().includes(query) ||
              booking.tenant.name.toLowerCase().includes(query) ||
              booking.property.title.toLowerCase().includes(query) ||
              booking.advertiser.name.toLowerCase().includes(query)
          );
        }
        
        // Sort by move-in date (today/tomorrow first)
        filtered.sort((a, b) => {
          const now = new Date();
          const aDate = new Date(a.moveInDate);
          const bDate = new Date(b.moveInDate);
          
          // Priority: today -> tomorrow -> future -> past
          const aDaysFromNow = Math.floor((aDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          const bDaysFromNow = Math.floor((bDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          return aDaysFromNow - bDaysFromNow;
        });
        
        setFilteredBookings(filtered);
      } catch (err) {
        console.error('Error applying filters:', err);
        setError('Failed to apply filters. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    // Only apply filtering if we have bookings loaded
    if (bookings.length > 0) {
      applyFilters();
    }
  }, [statusFilter, searchQuery, bookings]);
  
  // Open booking detail drawer
  const openBookingDetail = (booking: MoveInBooking) => {
    navigate(`/dashboard/admin/move-in/${booking.id}`);
  };
  
  // Copy phone number to clipboard
  const copyToClipboard = async (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  // Format move-in date for display
  const formatMoveInDate = (date: Date) => {
    const now = new Date();
    const moveInDate = new Date(date);
    const daysDiff = Math.floor((moveInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return 'Today';
    if (daysDiff === 1) return 'Tomorrow';
    if (daysDiff === -1) return 'Yesterday';
    
    return moveInDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: moveInDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };
  
  // Get placeholder image for properties without images
  const getPlaceholderImage = (propertyTitle: string) => {
    const hash = propertyTitle.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const color = `hsl(${Math.abs(hash) % 360}, 70%, 80%)`;
    return `https://placehold.co/40x40/${color.replace('#', '')}?text=${propertyTitle.charAt(0)}`;
  };
  
  return (
    <>
      <DashboardCard>
        <CardTitle>Move-in Management</CardTitle>
        <CardContent>
          {/* Filters */}
          <FilterContainer>
            <FilterSelect 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Move-in Upcoming">Move-in Upcoming</option>
              <option value="Safety Window Open">Safety Window Open</option>
              <option value="Safety Window Closed">Safety Window Closed</option>
              <option value="Cancelled – Tenant">Cancelled – Tenant</option>
              <option value="Cancelled – Advertiser">Cancelled – Advertiser</option>
            </FilterSelect>
            
            <SearchContainer>
              <FaSearch />
              <SearchInput 
                type="text" 
                placeholder="Search booking ID, tenant, property..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchContainer>
          </FilterContainer>
          
          {/* Error message */}
          {error && (
            <div style={{ color: 'red', marginBottom: '15px' }}>
              {error}
            </div>
          )}
          
          {/* Move-in Table */}
          {loading ? (
            <p>Loading move-in bookings...</p>
          ) : filteredBookings.length === 0 ? (
            <p>No move-in bookings found matching your criteria.</p>
          ) : (
            <TableContainer>
              <MoveInTable>
                <MoveInTableHead>
                  <MoveInRow>
                    <MoveInTableHeader style={{ width: '8%' }}>Booking ID</MoveInTableHeader>
                    <MoveInTableHeader style={{ width: '22%' }}>Property</MoveInTableHeader>
                    <MoveInTableHeader style={{ width: '15%' }}>Tenant</MoveInTableHeader>
                    <MoveInTableHeader style={{ width: '15%' }}>Advertiser</MoveInTableHeader>
                    <MoveInTableHeader style={{ width: '10%' }}>Move-in Date</MoveInTableHeader>
                    <MoveInTableHeader style={{ width: '12%' }}>Status</MoveInTableHeader>
                    <MoveInTableHeader style={{ width: '8%' }}>Timer</MoveInTableHeader>
                    <MoveInTableHeader style={{ width: '8%' }}>Reason/Flag</MoveInTableHeader>
                    <MoveInTableHeader style={{ width: '2%' }}>Actions</MoveInTableHeader>
                  </MoveInRow>
                </MoveInTableHead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <MoveInRow key={booking.id} onClick={() => openBookingDetail(booking)}>
                      <MoveInCell>{booking.bookingId}</MoveInCell>
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
                            {booking.tenant.phoneNumber} <FaCopy size={10} />
                          </ContactPhone>
                        </ContactInfo>
                      </MoveInCell>
                      <MoveInCell>
                        <ContactInfo>
                          <ContactName>{booking.advertiser.name}</ContactName>
                          <ContactPhone onClick={(e) => copyToClipboard(booking.advertiser.phoneNumber, e)}>
                            {booking.advertiser.phoneNumber} <FaCopy size={10} />
                          </ContactPhone>
                        </ContactInfo>
                      </MoveInCell>
                      <MoveInCell>{formatMoveInDate(booking.moveInDate)}</MoveInCell>
                      <MoveInCell>
                        <StatusBadge $status={booking.status}>{booking.status}</StatusBadge>
                      </MoveInCell>
                      <MoveInCell>
                        <SafetyWindowTimer moveInDate={booking.moveInDate} status={booking.status} />
                      </MoveInCell>
                      <MoveInCell>
                        <ReasonBadge $reason={booking.reason}>{booking.reason}</ReasonBadge>
                      </MoveInCell>
                      <MoveInCell>
                        <ActionButton onClick={(e) => {
                          e.stopPropagation();
                          openBookingDetail(booking);
                        }}>
                          <FaEye />
                        </ActionButton>
                      </MoveInCell>
                    </MoveInRow>
                  ))}
                </tbody>
              </MoveInTable>
            </TableContainer>
          )}
        </CardContent>
      </DashboardCard>
    </>
  );
};

export default MoveInPage; 
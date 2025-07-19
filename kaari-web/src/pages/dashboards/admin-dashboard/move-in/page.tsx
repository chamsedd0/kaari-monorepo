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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Load all bookings
  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allBookings = await getAllMoveInBookings();
      setBookings(allBookings);
      
      // Apply initial filters
      applyFilters(allBookings, statusFilter, searchTerm);
    } catch (err: any) {
      console.error('Error loading move-in bookings:', err);
      setError(err.message || 'Failed to load move-in bookings');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    loadBookings();
  }, []);
  
  // Apply filters when status or search term changes
  useEffect(() => {
    applyFilters(bookings, statusFilter, searchTerm);
  }, [statusFilter, searchTerm]);
  
  // Apply filters to bookings
  const applyFilters = (
    bookingsToFilter: MoveInBooking[], 
    status: string, 
    search: string
  ) => {
    let filtered = [...bookingsToFilter];
    
    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter(booking => booking.status === status);
    }
    
    // Apply search filter
    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        booking => 
          booking.tenant.name.toLowerCase().includes(term) ||
          booking.property.title.toLowerCase().includes(term) ||
          booking.property.city.toLowerCase().includes(term) ||
          booking.bookingId.toLowerCase().includes(term)
      );
    }
    
    setFilteredBookings(filtered);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Open booking detail
  const openBookingDetail = (booking: MoveInBooking) => {
    navigate(`/dashboard/admin/move-in/${booking.id}`);
  };
  
  // Copy phone number to clipboard
  const copyToClipboard = async (text: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    try {
      await navigator.clipboard.writeText(text);
      alert(`Copied: ${text}`);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  // Format move-in date
  const formatMoveInDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Format amount
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Get placeholder image if property thumbnail is missing
  const getPlaceholderImage = (propertyTitle: string) => {
    // Generate a color based on the property title
    const hash = propertyTitle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    
    // Create a colored placeholder
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='hsl(${hue}, 70%25, 80%25)' /%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='hsl(${hue}, 70%25, 30%25)' text-anchor='middle' dy='.3em'%3E${propertyTitle.charAt(0)}%3C/text%3E%3C/svg%3E`;
  };
  
  // Count bookings by status
  const countByStatus = (status: MoveInStatus | 'all'): number => {
    if (status === 'all') return bookings.length;
    return bookings.filter(booking => booking.status === status).length;
  };
  
  return (
    <DashboardCard>
      <CardTitle>Move-in Management</CardTitle>
      <CardContent>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select 
              value={statusFilter} 
              onChange={handleStatusFilterChange}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: 'white'
              }}
            >
              <option value="all">All Statuses ({countByStatus('all')})</option>
              <option value="Move-in Upcoming">Upcoming ({countByStatus('Move-in Upcoming')})</option>
              <option value="Safety Window Open">Safety Window Open ({countByStatus('Safety Window Open')})</option>
              <option value="Safety Window Closed">Completed ({countByStatus('Safety Window Closed')})</option>
              <option value="Cancelled – Tenant">Cancelled by Tenant ({countByStatus('Cancelled – Tenant')})</option>
              <option value="Cancelled – Advertiser">Cancelled by Advertiser ({countByStatus('Cancelled – Advertiser')})</option>
            </select>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '6px 12px',
            backgroundColor: 'white'
          }}>
            <FaSearch style={{ color: '#666', marginRight: '8px' }} />
            <input
              type="text"
              placeholder="Search by tenant, property, or booking ID"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                border: 'none',
                outline: 'none',
                width: '250px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Loading move-in data...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
            {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No move-in bookings found matching your criteria.
          </div>
        ) : (
          <MoveInTable>
            <MoveInTableHead>
              <tr>
                <MoveInTableHeader style={{ width: '30%' }}>Property</MoveInTableHeader>
                <MoveInTableHeader style={{ width: '20%' }}>Tenant</MoveInTableHeader>
                <MoveInTableHeader style={{ width: '15%' }}>Move-in Date</MoveInTableHeader>
                <MoveInTableHeader style={{ width: '15%' }}>Status</MoveInTableHeader>
                <MoveInTableHeader style={{ width: '10%' }}>Amount</MoveInTableHeader>
                <MoveInTableHeader style={{ width: '10%' }}>Booking ID</MoveInTableHeader>
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
                        {booking.tenant.phoneNumber} <FaCopy size={12} />
                      </ContactPhone>
                    </ContactInfo>
                  </MoveInCell>
                  <MoveInCell>
                    {formatMoveInDate(booking.moveInDate)}
                    {booking.status === 'Safety Window Open' && (
                      <SafetyWindowTimer moveInDate={booking.moveInDate} status={booking.status} />
                    )}
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
                    {formatAmount(booking.amount)}
                  </MoveInCell>
                  <MoveInCell>
                    {booking.bookingId}
                  </MoveInCell>
                </MoveInRow>
              ))}
            </tbody>
          </MoveInTable>
        )}
      </CardContent>
    </DashboardCard>
  );
};

export default MoveInPage; 
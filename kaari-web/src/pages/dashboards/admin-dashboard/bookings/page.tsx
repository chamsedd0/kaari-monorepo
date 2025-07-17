import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye } from 'react-icons/fa';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import {
  DashboardCard,
  CardTitle,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  FormGroup,
  Input,
  Select,
  Button,
} from '../styles';
import { useNavigate } from 'react-router-dom';
import { 
  getAllBookings, 
  getBookingsByStatus, 
  getBookingsByCity, 
  searchBookings, 
  AdminBooking, 
  AdminBookingStatus 
} from '../../../../backend/server-actions/BookingServerActions';

// Define payment state type
type PaymentState = 'Hold' | 'Captured' | 'Voided';

// Excel-like styled components
const BookingsTable = styled(Table)`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
  overflow: hidden;
  table-layout: fixed;
`;

const BookingsTableHead = styled(TableHead)`
  background-color: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const BookingsTableHeader = styled(TableHeader)`
  padding: 12px 15px;
  text-align: left;
  font: ${Theme.typography.fonts.smallB};
  color: ${Theme.colors.gray2};
  border-bottom: 1px solid ${Theme.colors.gray};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BookingRow = styled(TableRow)`
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f3eefb;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${Theme.colors.gray};
  }
`;

const BookingCell = styled(TableCell)`
  padding: 10px 15px;
  font: ${Theme.typography.fonts.smallM};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PropertyCell = styled(BookingCell)`
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
`;

const ContactName = styled.div`
  font-weight: 500;
`;

const ContactPhone = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const StatusBadge = styled.span<{ $status: AdminBookingStatus }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font: ${Theme.typography.fonts.smallB};
  
  background-color: ${props => {
    switch (props.$status) {
      case 'Await-Advertiser':
        return '#fef7e0'; // yellow
      case 'Await-Tenant-Confirm':
        return '#fef7e0'; // orange
      case 'Confirmed':
        return '#e6f4ea'; // green
      case 'Cancelled':
        return '#f1f3f4'; // grey
      default:
        return '#f1f3f4';
    }
  }};
  
  color: ${props => {
    switch (props.$status) {
      case 'Await-Advertiser':
        return '#b06000'; // dark yellow
      case 'Await-Tenant-Confirm':
        return '#b06000'; // dark orange
      case 'Confirmed':
        return '#137333'; // dark green
      case 'Cancelled':
        return '#5f6368'; // dark grey
      default:
        return '#5f6368';
    }
  }};
`;

const PaymentStateBadge = styled.span<{ $state: PaymentState }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font: ${Theme.typography.fonts.smallB};
  
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
  color: ${props => props.$isLessThanOneHour ? '#dc3545' : 'inherit'};
  font-weight: ${props => props.$isLessThanOneHour ? 'bold' : 'normal'};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const FilterSelect = styled(Select)`
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

const SearchInput = styled(Input)`
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

const ActionButton = styled(Button)`
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: white;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
  font: ${Theme.typography.fonts.smallM};
  
  &:hover {
    background-color: #f3eefb;
    border-color: ${Theme.colors.secondary};
  }
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
      {timeLeft}
    </TimerDisplay>
  );
};

// Main component
const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cities, setCities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Load bookings data
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all bookings
        const allBookings = await getAllBookings();
        setBookings(allBookings);
        setFilteredBookings(allBookings);
        
        // Extract unique cities
        const uniqueCities = [...new Set(allBookings.map(booking => booking.property.city))];
        setCities(uniqueCities);
      } catch (err) {
        console.error('Error loading bookings:', err);
        setError('Failed to load bookings. Please try again later.');
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
        
        let filtered: AdminBooking[] = [];
        
        // Apply status filter
        if (statusFilter !== 'all') {
          filtered = await getBookingsByStatus(statusFilter as AdminBookingStatus);
        } else {
          filtered = [...bookings];
        }
        
        // Apply city filter
        if (cityFilter !== 'all') {
          if (statusFilter !== 'all') {
            // If we already filtered by status, filter the results by city
            filtered = filtered.filter(booking => booking.property.city === cityFilter);
          } else {
            // Otherwise, get bookings by city from the server
            filtered = await getBookingsByCity(cityFilter);
          }
        }
        
        // Apply search filter
        if (searchQuery.trim()) {
          if (statusFilter !== 'all' || cityFilter !== 'all') {
            // If we already filtered, filter the results by search query
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
              booking =>
                booking.tenant.name.toLowerCase().includes(query) ||
                booking.property.title.toLowerCase().includes(query)
            );
          } else {
            // Otherwise, search bookings from the server
            filtered = await searchBookings(searchQuery);
          }
        }
        
        setFilteredBookings(filtered);
      } catch (err) {
        console.error('Error applying filters:', err);
        setError('Failed to apply filters. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    // Only apply server-side filtering if we have bookings loaded
    if (bookings.length > 0) {
      applyFilters();
    }
  }, [statusFilter, cityFilter, searchQuery, bookings]);
  
  // Open booking detail page
  const openBookingDetail = (booking: AdminBooking) => {
    navigate(`/dashboard/admin/bookings/${booking.id}`);
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
    
    return `https://placehold.co/40x40/${color.replace('#', '')}?text=${propertyTitle.charAt(0)}`;
  };
  
  return (
    <>
      <DashboardCard>
        <CardTitle>Reservations</CardTitle>
        <CardContent>
          {/* Filters */}
          <FilterContainer>
            <FilterSelect 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Await-Advertiser">Await Advertiser</option>
              <option value="Await-Tenant-Confirm">Await Tenant Confirm</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </FilterSelect>
            
            <FilterSelect 
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </FilterSelect>
            
            <SearchContainer>
              <FaSearch />
              <SearchInput 
                type="text" 
                placeholder="Search tenant or property..." 
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
          
          {/* Bookings Table */}
          {loading ? (
            <p>Loading bookings...</p>
          ) : filteredBookings.length === 0 ? (
            <p>No bookings found matching your criteria.</p>
          ) : (
            <TableContainer>
              <BookingsTable>
                <BookingsTableHead>
                  <BookingRow>
                    <BookingsTableHeader style={{ width: '10%' }}>Booking ID</BookingsTableHeader>
                    <BookingsTableHeader style={{ width: '20%' }}>Property</BookingsTableHeader>
                    <BookingsTableHeader style={{ width: '15%' }}>Tenant</BookingsTableHeader>
                    <BookingsTableHeader style={{ width: '15%' }}>Advertiser</BookingsTableHeader>
                    <BookingsTableHeader style={{ width: '10%' }}>Status</BookingsTableHeader>
                    <BookingsTableHeader style={{ width: '10%' }}>Timer</BookingsTableHeader>
                    <BookingsTableHeader style={{ width: '10%' }}>Payment State</BookingsTableHeader>
                    <BookingsTableHeader style={{ width: '10%' }}>Actions</BookingsTableHeader>
                  </BookingRow>
                </BookingsTableHead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <BookingRow key={booking.id} onClick={() => openBookingDetail(booking)}>
                      <BookingCell>{booking.bookingId}</BookingCell>
                      <PropertyCell>
                        <PropertyThumbnail 
                          src={booking.property.thumbnail || getPlaceholderImage(booking.property.title)} 
                          alt={booking.property.title} 
                          onError={(e) => {
                            // If image fails to load, replace with placeholder
                            (e.target as HTMLImageElement).src = getPlaceholderImage(booking.property.title);
                          }}
                        />
                        <PropertyInfo>
                          <PropertyTitle>{booking.property.title}</PropertyTitle>
                          <PropertyCity>{booking.property.city}</PropertyCity>
                        </PropertyInfo>
                      </PropertyCell>
                      <BookingCell>
                        <ContactInfo>
                          <ContactName>{booking.tenant.name}</ContactName>
                          <ContactPhone>{booking.tenant.phoneNumber}</ContactPhone>
                        </ContactInfo>
                      </BookingCell>
                      <BookingCell>
                        <ContactInfo>
                          <ContactName>{booking.advertiser.name}</ContactName>
                          <ContactPhone>{booking.advertiser.phoneNumber}</ContactPhone>
                        </ContactInfo>
                      </BookingCell>
                      <BookingCell>
                        <StatusBadge $status={booking.status}>{booking.status}</StatusBadge>
                      </BookingCell>
                      <BookingCell>
                        {(booking.status === 'Await-Advertiser' || booking.status === 'Await-Tenant-Confirm') && (
                          <CountdownTimer updatedAt={booking.updatedAt} />
                        )}
                      </BookingCell>
                      <BookingCell>
                        <PaymentStateBadge $state={booking.paymentState}>
                          {booking.paymentState}
                        </PaymentStateBadge>
                      </BookingCell>
                      <BookingCell>
                        <ActionButton onClick={(e) => {
                          e.stopPropagation();
                          openBookingDetail(booking);
                        }}>
                          <FaEye /> View
                        </ActionButton>
                      </BookingCell>
                    </BookingRow>
                  ))}
                </tbody>
              </BookingsTable>
            </TableContainer>
          )}
        </CardContent>
      </DashboardCard>
    </>
  );
};

export default BookingsPage; 
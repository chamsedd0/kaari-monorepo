import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaEye } from 'react-icons/fa';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { Table, TableHead, TableRow, TableHeader, TableCell, FormGroup, Input, Select, Button } from '../styles';
import { useNavigate } from 'react-router-dom';
import { 
  getAllBookings, 
  getBookingsByStatus, 
  getBookingsByCity, 
  searchBookings, 
  AdminBooking, 
  AdminBookingStatus,
  PaymentState
} from '../../../../backend/server-actions/BookingServerActions';
import AdminTableScaffold from '../../../../components/admin/AdminTableScaffold';
import { formatDateSafe } from '../../../../utils/dates';
import { PageContainer, PageHeader, FilterBar, SearchBox, GlassTable, GlassCard } from '../../../../components/admin/AdminUI';

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

// Loading and empty states are handled by AdminTableScaffold

const StatusCount = styled.span`
  background-color: ${Theme.colors.gray};
  color: ${Theme.colors.gray2};
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 0.8rem;
  margin-left: 5px;
`;

const CountdownTimer: React.FC<{ updatedAt: Date }> = ({ updatedAt }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isLessThanOneHour, setIsLessThanOneHour] = useState<boolean>(false);
  
  useEffect(() => {
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
      {timeLeft}
    </TimerDisplay>
  );
};

const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cities, setCities] = useState<string[]>([]);
  
  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let fetchedBookings: AdminBooking[];

      if (statusFilter !== 'all' && cityFilter !== 'all') {
        try {
          // @ts-ignore: assume server-action exists or will be added
          const combined = await getBookingsByStatusAndCity(statusFilter as AdminBookingStatus, cityFilter);
          fetchedBookings = combined;
        } catch {
          const statusBookings = await getBookingsByStatus(statusFilter as AdminBookingStatus);
          fetchedBookings = statusBookings.filter(booking => booking.property.city === cityFilter);
        }
      } else if (statusFilter !== 'all') {
        fetchedBookings = await getBookingsByStatus(statusFilter as AdminBookingStatus);
      } else if (cityFilter !== 'all') {
        fetchedBookings = await getBookingsByCity(cityFilter);
      } else {
        fetchedBookings = await getAllBookings();
      }

      const uniqueCities = [...new Set(fetchedBookings.map(booking => booking.property.city).filter(Boolean))];
      setCities(uniqueCities);

      fetchedBookings.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      setBookings(fetchedBookings);

      if (searchQuery) {
        const filtered = await searchBookings(searchQuery);
        setFilteredBookings(filtered);
      } else {
        setFilteredBookings(fetchedBookings);
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Failed to load bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, cityFilter, searchQuery]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);
  
  // Apply search filter
  useEffect(() => {
    const applyFilters = async () => {
      if (searchQuery.trim() === '') {
        setFilteredBookings(bookings);
        return;
      }
      
      try {
        const results = await searchBookings(searchQuery);
        
        // Apply additional filters if needed
        let filtered = results;
        
        if (statusFilter !== 'all') {
          filtered = filtered.filter(booking => booking.status === statusFilter);
        }
        
        if (cityFilter !== 'all') {
          filtered = filtered.filter(booking => booking.property.city === cityFilter);
        }
        
        setFilteredBookings(filtered);
      } catch (err) {
        console.error('Error searching bookings:', err);
        // Fallback to client-side filtering if API search fails
        const query = searchQuery.toLowerCase();
        const filtered = bookings.filter(booking => 
          booking.property.title.toLowerCase().includes(query) ||
          booking.property.city.toLowerCase().includes(query) ||
          booking.tenant.name.toLowerCase().includes(query) ||
          booking.tenant.phoneNumber?.toLowerCase().includes(query) ||
          booking.advertiser.name.toLowerCase().includes(query) ||
          booking.advertiser.phoneNumber?.toLowerCase().includes(query) ||
          booking.bookingId.toLowerCase().includes(query)
        );
        
        setFilteredBookings(filtered);
      }
    };
    
    applyFilters();
  }, [searchQuery, bookings, statusFilter, cityFilter]);
  
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };
  
  const handleCityFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCityFilter(e.target.value);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const openBookingDetail = (booking: AdminBooking) => {
    navigate(`/dashboard/admin/bookings/${booking.id}`);
  };
  
  const formatDate = (date: any) => formatDateSafe(date, 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  
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
  
  const countByStatus = (status: AdminBookingStatus | 'all'): number => {
    if (status === 'all') {
      return bookings.length;
    }
    return bookings.filter(booking => booking.status === status).length;
  };
  
  return (
    <PageContainer>
      <PageHeader title="Bookings Management" />
      <FilterBar>
        <FilterSelect value={statusFilter} onChange={handleStatusFilterChange}>
          <option value="all">All Statuses ({countByStatus('all')})</option>
          <option value="Await-Advertiser">Awaiting Advertiser ({countByStatus('Await-Advertiser')})</option>
          <option value="Await-Tenant-Confirm">Awaiting Tenant Confirmation ({countByStatus('Await-Tenant-Confirm')})</option>
          <option value="Confirmed">Confirmed ({countByStatus('Confirmed')})</option>
          <option value="Cancelled">Cancelled ({countByStatus('Cancelled')})</option>
        </FilterSelect>
        <FilterSelect value={cityFilter} onChange={handleCityFilterChange}>
          <option value="all">All Cities</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </FilterSelect>
        <SearchBox>
          <FaSearch />
          <input type="text" placeholder="Search by name, property, or ID" value={searchQuery} onChange={handleSearchChange} />
        </SearchBox>
      </FilterBar>
        
        <AdminTableScaffold
          loading={loading}
          error={error}
          isEmpty={!loading && !error && filteredBookings.length === 0}
          onRetry={() => loadBookings()}
        >
          {filteredBookings.length > 0 && (
            <GlassCard>
              <GlassTable>
                <BookingsTableHead>
                  <tr>
                    <BookingsTableHeader style={{ width: '5%' }}>ID</BookingsTableHeader>
                    <BookingsTableHeader style={{ width: '20%' }}>Property</BookingsTableHeader>
                    <BookingsTableHeader style={{ width: '15%' }}>Tenant</BookingsTableHeader>
                    <BookingsTableHeader style={{ width: '15%' }}>Advertiser</BookingsTableHeader>
                    <BookingsTableHeader style={{ width: '15%' }}>Date</BookingsTableHeader>
                    <BookingsTableHeader style={{ width: '10%' }}>Amount</BookingsTableHeader>
                    <BookingsTableHeader style={{ width: '10%' }}>Status</BookingsTableHeader>
                    <BookingsTableHeader style={{ width: '10%' }}>Payment</BookingsTableHeader>
                  </tr>
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
                        {formatDate(booking.updatedAt)}
                        {booking.status === 'Await-Advertiser' && (
                          <div>
                            <CountdownTimer updatedAt={booking.updatedAt} />
                          </div>
                        )}
                      </BookingCell>
                      <BookingCell>
                        {formatAmount(booking.amount)}
                      </BookingCell>
                      <BookingCell>
                        <StatusBadge $status={booking.status}>
                          {booking.status}
                        </StatusBadge>
                      </BookingCell>
                      <BookingCell>
                        <PaymentStateBadge $state={booking.paymentState}>
                          {booking.paymentState}
                        </PaymentStateBadge>
                      </BookingCell>
                    </BookingRow>
                  ))}
                </tbody>
              </GlassTable>
            </GlassCard>
          )}
        </AdminTableScaffold>
    </PageContainer>
  );
};

export default BookingsPage; 
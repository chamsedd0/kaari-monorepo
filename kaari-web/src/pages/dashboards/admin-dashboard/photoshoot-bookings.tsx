import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { PageContainer, PageHeader, FilterBar, SearchBox, GlassCard, GlassTable, PrimaryButton, StatusBadge, Pill } from '../../../components/admin/AdminUI';
import { Theme } from '../../../theme/theme';
import { PhotoshootBookingServerActions } from '../../../backend/server-actions/PhotoshootBookingServerActions';
import { PhotoshootBooking } from '../../../backend/entities';
import { formatDateSafe, toDateSafe } from '../../../utils/dates';

const PhotoshootBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<PhotoshootBooking[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'assigned' | 'completed' | 'cancelled'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    loadBookings();
  }, []);
  
  const loadBookings = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const allBookings = await PhotoshootBookingServerActions.getAllBookings();
      setBookings(allBookings ?? []);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Failed to load photoshoot bookings');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredBookings = useMemo(() => {
    const lower = searchQuery.trim().toLowerCase();
    const list = (bookings ?? [])
      .filter(b => (activeTab === 'all' ? true : (b.status as string | undefined) === activeTab))
      .filter(b => {
        if (!lower) return true;
        const street = b.propertyAddress?.street?.toLowerCase() ?? '';
        const city = b.propertyAddress?.city?.toLowerCase() ?? '';
        const type = (b.propertyType as string | undefined)?.toLowerCase() ?? '';
        return street.includes(lower) || city.includes(lower) || type.includes(lower);
      })
      .sort((a, b) => {
        const aDate = toDateSafe((a as any).createdAt || (a as any).date);
        const bDate = toDateSafe((b as any).createdAt || (b as any).date);
        return (bDate?.getTime() ?? 0) - (aDate?.getTime() ?? 0);
      });
    return list;
  }, [bookings, activeTab, searchQuery]);
  
  const handleTabChange = (tab: 'all' | 'pending' | 'assigned' | 'completed' | 'cancelled') => {
    setActiveTab(tab);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };
  
  const viewBookingDetails = (id: string) => {
    if (!id) {
      console.error('Cannot view booking: Booking ID is missing');
      return;
    }
    
    console.log('Navigating to booking details:', id);
    
    // Use a timeout to ensure any pending state updates are completed
    // before navigating to the detail page
    setTimeout(() => {
      navigate(`/dashboard/admin/photoshoot-bookings/view/${id}`);
    }, 0);
  };
  
  const formatDate = (value: unknown) => formatDateSafe(value);
  
  const renderBookingsTable = (): React.ReactNode => {
    if (error) {
      return (
        <div style={{ padding: '12px 16px', color: Theme.colors.error }}>
          {error} <button onClick={loadBookings} style={{ marginLeft: 12 }}>Retry</button>
        </div>
      );
    }
    if (loading) {
      return <div style={{ padding: '12px 16px' }}>Loading bookings...</div>;
    }
    if (!filteredBookings.length) {
      return <div style={{ padding: '12px 16px' }}>No photoshoot bookings found.</div>;
    }
    return (
      <GlassTable>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Address</th>
            <th>Property Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((booking) => (
            <tr key={booking.id}>
              <td>{(booking as any).date ? formatDate((booking as any).date) : 'N/A'}</td>
              <td>{(booking as any).timeSlot || 'N/A'}</td>
              <td>
                {booking.propertyAddress
                  ? `${booking.propertyAddress.street || 'No street'}, ${booking.propertyAddress.city || 'No city'}`
                  : 'No address provided'}
              </td>
              <td>{(booking as any).propertyType || 'N/A'}</td>
              <td>
                <StatusBadge status={(booking as any).status}>{(booking as any).status}</StatusBadge>
              </td>
              <td>
                <PrimaryButton onClick={() => viewBookingDetails(booking.id)}>View</PrimaryButton>
              </td>
            </tr>
          ))}
        </tbody>
      </GlassTable>
    );
  };
  
  return (
    <PageContainer>
      <PageHeader title="Photoshoot bookings" subtitle="Search, filter, and review booking requests" right={
        <PrimaryButton onClick={loadBookings}><FaPlus style={{ marginRight: 6 }} />Refresh</PrimaryButton>
      } />

      <GlassCard>
        <FilterBar>
          <SearchBox>
            <FaSearch />
            <input
              type="text"
              placeholder="Search by street, city, or type"
              value={searchQuery}
              onChange={handleSearch}
            />
          </SearchBox>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['all','pending','assigned','completed','cancelled'] as const).map(k => (
              <Pill
                key={k}
                onClick={() => handleTabChange(k)}
                style={{
                  cursor: 'pointer',
                  background: activeTab === k ? `${Theme.colors.tertiary}30` : Theme.colors.white,
                  borderColor: activeTab === k ? Theme.colors.tertiary : `${Theme.colors.tertiary}80`
                }}
              >{k === 'all' ? 'All' : k.charAt(0).toUpperCase() + k.slice(1)}</Pill>
            ))}
          </div>
        </FilterBar>

        <div style={{ marginTop: 12 }}>{renderBookingsTable()}</div>
      </GlassCard>
    </PageContainer>
  );
};

export default PhotoshootBookingsPage; 
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch } from 'react-icons/fa';
import {
  DashboardCard,
  CardTitle,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  Button,
  StatusBadge,
  TabsContainer,
  TabList,
  Tab,
  TabPanel,
  FormGroup,
  Input,
} from './styles';

import { PhotoshootBookingServerActions } from '../../../backend/server-actions/PhotoshootBookingServerActions';
import { PhotoshootBooking } from '../../../backend/entities';
import PhotoshootBookingDetail from './photoshoot-booking-detail';

const PhotoshootBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<PhotoshootBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<PhotoshootBooking[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  
  useEffect(() => {
    loadBookings();
  }, []);
  
  const loadBookings = async () => {
    try {
      setLoading(true);
      const allBookings = await PhotoshootBookingServerActions.getAllBookings();
      setBookings(allBookings);
      filterBookings(allBookings, activeTab, searchQuery);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filterBookings = (bookingsList: PhotoshootBooking[], tab: string, query: string) => {
    let filtered = [...bookingsList];
    
    // Filter by tab
    if (tab !== 'all') {
      filtered = filtered.filter(booking => booking.status === tab);
    }
    
    // Filter by search query
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(booking => 
        (booking.propertyAddress?.street?.toLowerCase().includes(lowercaseQuery) || false) ||
        (booking.propertyAddress?.city?.toLowerCase().includes(lowercaseQuery) || false) ||
        (booking.propertyType?.toLowerCase().includes(lowercaseQuery) || false)
      );
    }
    
    // Sort by date
    filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setFilteredBookings(filtered);
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    filterBookings(bookings, tab, searchQuery);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterBookings(bookings, activeTab, query);
  };
  
  const viewBookingDetails = (id: string) => {
    navigate(`/dashboard/admin/photoshoot-bookings/view/${id}`);
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const renderBookingsTable = () => {
    if (loading) {
      return <p>Loading bookings...</p>;
    }
    
    if (filteredBookings.length === 0) {
      return <p>No photoshoot bookings found.</p>;
    }
    
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableHeader>Time</TableHeader>
            <TableHeader>Address</TableHeader>
            <TableHeader>Property Type</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {filteredBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.date ? formatDate(booking.date) : 'N/A'}</TableCell>
              <TableCell>{booking.timeSlot || 'N/A'}</TableCell>
              <TableCell>
                {booking.propertyAddress ? 
                  `${booking.propertyAddress.street || 'No street'}, ${booking.propertyAddress.city || 'No city'}` : 
                  'No address provided'}
              </TableCell>
              <TableCell>{booking.propertyType || 'N/A'}</TableCell>
              <TableCell>
                <StatusBadge status={booking.status}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </StatusBadge>
              </TableCell>
              <TableCell>
                <Button onClick={() => viewBookingDetails(booking.id)}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    );
  };
  
  const BookingsList = () => (
    <DashboardCard>
      <CardTitle>Photoshoot Bookings</CardTitle>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <FormGroup style={{ width: '300px', margin: 0 }}>
            <div style={{ position: 'relative' }}>
              <Input 
                type="text" 
                placeholder="Search bookings..." 
                value={searchQuery}
                onChange={handleSearch}
                style={{ paddingLeft: '35px' }}
              />
              <FaSearch style={{ position: 'absolute', left: '10px', top: '12px', color: '#aaa' }} />
            </div>
          </FormGroup>
          
          <Button onClick={() => navigate('/dashboard/admin/photoshoot-bookings/refresh')}>
            <FaPlus style={{ marginRight: '5px' }} /> Refresh
          </Button>
        </div>
        
        <TabsContainer>
          <TabList>
            <Tab 
              active={activeTab === 'all'} 
              onClick={() => handleTabChange('all')}
            >
              All Bookings
            </Tab>
            <Tab 
              active={activeTab === 'pending'} 
              onClick={() => handleTabChange('pending')}
            >
              Pending
            </Tab>
            <Tab 
              active={activeTab === 'assigned'} 
              onClick={() => handleTabChange('assigned')}
            >
              Assigned
            </Tab>
            <Tab 
              active={activeTab === 'completed'} 
              onClick={() => handleTabChange('completed')}
            >
              Completed
            </Tab>
            <Tab 
              active={activeTab === 'cancelled'} 
              onClick={() => handleTabChange('cancelled')}
            >
              Cancelled
            </Tab>
          </TabList>
          
          <TabPanel>
            {renderBookingsTable()}
          </TabPanel>
        </TabsContainer>
      </CardContent>
    </DashboardCard>
  );
  
  return (
    <Routes>
      <Route path="/" element={<BookingsList />} />
      <Route path="/view/:id" element={<PhotoshootBookingDetail onUpdateBooking={loadBookings} />} />
      <Route path="/refresh" element={<BookingsList />} />
    </Routes>
  );
};

export default PhotoshootBookingsPage; 
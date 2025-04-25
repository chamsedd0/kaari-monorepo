import React, { useState, useEffect } from 'react';
import { FaCalendar, FaUsers, FaBuilding, FaCheck } from 'react-icons/fa';
import {
  DashboardCard,
  CardTitle,
  CardContent,
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  Button,
  StatusBadge,
} from './styles';

import { PhotoshootBookingServerActions } from '../../../backend/server-actions/PhotoshootBookingServerActions';
import { TeamServerActions } from '../../../backend/server-actions/TeamServerActions';
import { PhotoshootBooking } from '../../../backend/entities';

const OverviewPage: React.FC = () => {
  const [stats, setStats] = useState({
    pendingBookings: 0,
    completedBookings: 0,
    activeTeams: 0,
    totalProperties: 0,
  });
  
  const [recentBookings, setRecentBookings] = useState<PhotoshootBooking[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get all bookings and count by status
        const bookings = await PhotoshootBookingServerActions.getAllBookings();
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        const completedBookings = bookings.filter(b => b.status === 'completed').length;
        
        // Get the most recent 5 bookings
        const sortedBookings = [...bookings].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 5);
        
        // Get active teams count
        const teams = await TeamServerActions.getActiveTeams();
        const activeTeams = teams.length;
        
        // Set stats and recent bookings
        setStats({
          pendingBookings,
          completedBookings,
          activeTeams,
          totalProperties: 0, // To be implemented
        });
        
        setRecentBookings(sortedBookings);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div>
      <StatsGrid>
        <StatCard>
          <StatValue>{stats.pendingBookings}</StatValue>
          <StatLabel>
            <FaCalendar style={{ marginRight: '5px' }} />
            Pending Bookings
          </StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{stats.completedBookings}</StatValue>
          <StatLabel>
            <FaCheck style={{ marginRight: '5px' }} />
            Completed Bookings
          </StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{stats.activeTeams}</StatValue>
          <StatLabel>
            <FaUsers style={{ marginRight: '5px' }} />
            Active Teams
          </StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{stats.totalProperties}</StatValue>
          <StatLabel>
            <FaBuilding style={{ marginRight: '5px' }} />
            Total Properties
          </StatLabel>
        </StatCard>
      </StatsGrid>
      
      <DashboardCard>
        <CardTitle>Recent Photoshoot Bookings</CardTitle>
        <CardContent>
          {loading ? (
            <p>Loading data...</p>
          ) : recentBookings.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Address</TableHeader>
                  <TableHeader>Property Type</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.date ? formatDate(booking.date) : 'N/A'}</TableCell>
                    <TableCell>
                      {booking.propertyAddress ? 
                        `${booking.propertyAddress.street || 'No street'}, ${booking.propertyAddress.city || 'No city'}` : 
                        'No address provided'}
                    </TableCell>
                    <TableCell>{booking.propertyType || 'N/A'}</TableCell>
                    <TableCell>
                      <StatusBadge $status={booking.status}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => window.location.href = `/dashboard/admin/photoshoot-bookings/view/${booking.id}`}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No recent bookings found.</p>
          )}
          
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <Button onClick={() => window.location.href = '/dashboard/admin/photoshoot-bookings'}>
              View All Bookings
            </Button>
          </div>
        </CardContent>
      </DashboardCard>
    </div>
  );
};

export default OverviewPage; 
import React, { useState, useEffect } from 'react';
import { 
  FaCalendar, 
  FaUsers, 
  FaBuilding, 
  FaCheck, 
  FaCreditCard, 
  FaHandshake, 
  FaUserPlus,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaHome
} from 'react-icons/fa';
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
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { PhotoshootBookingServerActions } from '../../../backend/server-actions/PhotoshootBookingServerActions';
import { TeamServerActions } from '../../../backend/server-actions/TeamServerActions';
import { getAllUsers } from '../../../backend/server-actions/UserServerActions';
import { getAllPendingPayouts } from '../../../backend/server-actions/PayoutsServerActions';
import { getAllReferrals, getRecentReferrals } from '../../../backend/server-actions/ReferralServerActions';
import { getRecentBookings } from '../../../backend/server-actions/BookingServerActions';
import { PhotoshootBooking } from '../../../backend/entities';

// Additional styled components
const ActivityGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ActivityCard = styled(DashboardCard)`
  margin-bottom: 0;
`;

const ViewAllLink = styled.div`
  margin-top: 15px;
  text-align: right;
`;

const EmptyState = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const RecentActivity = styled.div`
  border-bottom: 1px solid #eee;
  padding: 10px 0;
  display: flex;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  margin-right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c5ce7;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 500;
`;

const ActivityMeta = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-top: 4px;
`;

const ActivityAmount = styled.div`
  font-weight: 600;
  color: #6c5ce7;
`;

const OverviewPage: React.FC = () => {
  const [stats, setStats] = useState({
    pendingBookings: 0,
    completedBookings: 0,
    activeTeams: 0,
    totalProperties: 0,
    pendingPayouts: 0,
    totalUsers: 0,
    activeReferrals: 0,
    pendingMoveIns: 0
  });
  
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentPhotoshoots, setRecentPhotoshoots] = useState<PhotoshootBooking[]>([]);
  const [recentPayouts, setRecentPayouts] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentReferrals, setRecentReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get photoshoot bookings
        let pendingPhotoshootBookings = 0;
        let completedPhotoshootBookings = 0;
        let sortedPhotoshootBookings: PhotoshootBooking[] = [];
        try {
          const photoshootBookings = await PhotoshootBookingServerActions.getAllBookings();
          pendingPhotoshootBookings = photoshootBookings.filter(b => b.status === 'pending').length;
          completedPhotoshootBookings = photoshootBookings.filter(b => b.status === 'completed').length;
          
          // Get the most recent 5 photoshoot bookings
          sortedPhotoshootBookings = [...photoshootBookings].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ).slice(0, 5);
        } catch (error) {
          console.error('Error loading photoshoot bookings:', error);
        }
        
        // Get active teams count
        let activeTeams = 0;
        try {
          const teams = await TeamServerActions.getActiveTeams();
          activeTeams = teams.length;
        } catch (error) {
          console.error('Error loading teams:', error);
        }
        
        // Get users count
        let totalUsers = 0;
        let sortedUsers: any[] = [];
        try {
          const users = await getAllUsers();
          totalUsers = users.length;
          
          // Get recent users (last 5 registered)
          sortedUsers = [...users].sort((a, b) => 
            new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime()
          ).slice(0, 5);
        } catch (error) {
          console.error('Error loading users:', error);
        }
        
        // Get pending payouts
        let pendingPayouts: any[] = [];
        try {
          pendingPayouts = await getAllPendingPayouts();
        } catch (error) {
          console.error('Error loading pending payouts:', error);
        }
        
        // Get recent bookings
        let bookings: any[] = [];
        let pendingMoveIns = 0;
        try {
          bookings = await getRecentBookings(5);
          pendingMoveIns = bookings.filter(b => b.status === 'paid').length;
        } catch (error) {
          console.error('Error loading bookings:', error);
        }
        
        // Get recent referrals
        let activeReferrals = 0;
        let recentReferrals: any[] = [];
        try {
          const allReferrals = await getAllReferrals();
          activeReferrals = allReferrals.filter(r => !r.isExpired && !r.isUsed).length;
          recentReferrals = await getRecentReferrals(5);
        } catch (error) {
          console.error('Error loading referrals:', error);
        }
        
        // Set stats and recent activities
        setStats({
          pendingBookings: pendingPhotoshootBookings,
          completedBookings: completedPhotoshootBookings,
          activeTeams,
          totalProperties: 0, // To be implemented
          pendingPayouts: pendingPayouts.length,
          totalUsers,
          activeReferrals,
          pendingMoveIns
        });
        
        setRecentPhotoshoots(sortedPhotoshootBookings);
        setRecentPayouts(pendingPayouts.slice(0, 5));
        setRecentUsers(sortedUsers);
        setRecentBookings(bookings);
        setRecentReferrals(recentReferrals);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  // Format date helper
  const formatDate = (date: Date | string | number) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Format time ago helper
  const formatTimeAgo = (date: Date | string | number) => {
    if (!date) return '';
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  };
  
  return (
    <div>
      <StatsGrid>
        <StatCard>
          <StatValue>{stats.pendingBookings}</StatValue>
          <StatLabel>
            <FaCalendar style={{ marginRight: '5px' }} />
            Pending Photoshoots
          </StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{stats.pendingMoveIns}</StatValue>
          <StatLabel>
            <FaHome style={{ marginRight: '5px' }} />
            Pending Move-ins
          </StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{stats.pendingPayouts}</StatValue>
          <StatLabel>
            <FaCreditCard style={{ marginRight: '5px' }} />
            Pending Payouts
          </StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue>{stats.activeReferrals}</StatValue>
          <StatLabel>
            <FaHandshake style={{ marginRight: '5px' }} />
            Active Referrals
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
          <StatValue>{stats.totalUsers}</StatValue>
          <StatLabel>
            <FaUserPlus style={{ marginRight: '5px' }} />
            Total Users
          </StatLabel>
        </StatCard>
      </StatsGrid>
      
      <ActivityGrid>
        <ActivityCard>
          <CardTitle>Recent Bookings</CardTitle>
          <CardContent>
            {loading ? (
              <p>Loading data...</p>
            ) : recentBookings.length > 0 ? (
              <>
                {recentBookings.map(booking => (
                  <RecentActivity key={booking.id}>
                    <ActivityIcon>
                      <FaHome />
                    </ActivityIcon>
                    <ActivityContent>
                      <ActivityTitle>
                        {booking.property?.title || 'Property Booking'} - {booking.client?.name || 'Unknown Client'}
                      </ActivityTitle>
                      <ActivityMeta>
                        {formatDate(booking.createdAt)} - Status: <StatusBadge status={booking.status}>{booking.status}</StatusBadge>
                      </ActivityMeta>
                    </ActivityContent>
                    <ActivityAmount>
                      {booking.totalAmount} {booking.currency || 'MAD'}
                    </ActivityAmount>
                  </RecentActivity>
                ))}
                <ViewAllLink>
                  <Link to="/dashboard/admin/bookings" style={{ textDecoration: 'none' }}>
                    <Button>View All Bookings</Button>
                  </Link>
                </ViewAllLink>
              </>
            ) : (
              <EmptyState>No recent bookings found.</EmptyState>
            )}
          </CardContent>
        </ActivityCard>
        
        <ActivityCard>
          <CardTitle>Pending Payouts</CardTitle>
          <CardContent>
            {loading ? (
              <p>Loading data...</p>
            ) : recentPayouts.length > 0 ? (
              <>
                {recentPayouts.map(payout => (
                  <RecentActivity key={payout.id}>
                    <ActivityIcon>
                      <FaMoneyBillWave />
                    </ActivityIcon>
                    <ActivityContent>
                      <ActivityTitle>
                        {payout.payeeName} - {payout.reason}
                      </ActivityTitle>
                      <ActivityMeta>
                        {formatDate(payout.createdAt)} - {payout.payeeType === 'advertiser' ? 'Advertiser' : 'Client'}
                      </ActivityMeta>
                    </ActivityContent>
                    <ActivityAmount>
                      {payout.amount} {payout.currency || 'MAD'}
                    </ActivityAmount>
                  </RecentActivity>
                ))}
                <ViewAllLink>
                  <Link to="/dashboard/admin/pending-payouts" style={{ textDecoration: 'none' }}>
                    <Button>View All Pending Payouts</Button>
                  </Link>
                </ViewAllLink>
              </>
            ) : (
              <EmptyState>No pending payouts found.</EmptyState>
            )}
          </CardContent>
        </ActivityCard>
        
        <ActivityCard>
          <CardTitle>Recent Photoshoot Bookings</CardTitle>
          <CardContent>
            {loading ? (
              <p>Loading data...</p>
            ) : recentPhotoshoots.length > 0 ? (
              <>
                {recentPhotoshoots.map(booking => (
                  <RecentActivity key={booking.id}>
                    <ActivityIcon>
                      <FaCalendar />
                    </ActivityIcon>
                    <ActivityContent>
                      <ActivityTitle>
                        {booking.propertyType || 'Property'} - {booking.name || 'Unknown User'}
                      </ActivityTitle>
                      <ActivityMeta>
                        {formatDate(booking.date)} - <StatusBadge status={booking.status || 'pending'}>
                          {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
                        </StatusBadge>
                      </ActivityMeta>
                    </ActivityContent>
                    <Button 
                      onClick={() => navigate(`/dashboard/admin/photoshoot-bookings/view/${booking.id}`)}
                      style={{ 
                        padding: '6px 12px',
                        fontSize: '0.85rem'
                      }}
                    >
                      View
                    </Button>
                  </RecentActivity>
                ))}
                <ViewAllLink>
                  <Link to="/dashboard/admin/photoshoot-bookings" style={{ textDecoration: 'none' }}>
                    <Button>View All Photoshoots</Button>
                  </Link>
                </ViewAllLink>
              </>
            ) : (
              <EmptyState>No recent photoshoot bookings found.</EmptyState>
            )}
          </CardContent>
        </ActivityCard>
        
        <ActivityCard>
          <CardTitle>Recent Users</CardTitle>
          <CardContent>
            {loading ? (
              <p>Loading data...</p>
            ) : recentUsers.length > 0 ? (
              <>
                {recentUsers.map(user => (
                  <RecentActivity key={user.id}>
                    <ActivityIcon>
                      <FaUserPlus />
                    </ActivityIcon>
                    <ActivityContent>
                      <ActivityTitle>
                        {user.name} {user.surname || ''}
                      </ActivityTitle>
                      <ActivityMeta>
                        {formatDate(user.createdAt)} - Role: {user.role || 'User'}
                      </ActivityMeta>
                    </ActivityContent>
                    <Button 
                      onClick={() => navigate(`/dashboard/admin/users/${user.id}`)}
                      style={{ 
                        padding: '6px 12px',
                        fontSize: '0.85rem'
                      }}
                    >
                      View
                    </Button>
                  </RecentActivity>
                ))}
                <ViewAllLink>
                  <Link to="/dashboard/admin/users" style={{ textDecoration: 'none' }}>
                    <Button>View All Users</Button>
                  </Link>
                </ViewAllLink>
              </>
            ) : (
              <EmptyState>No recent users found.</EmptyState>
            )}
          </CardContent>
        </ActivityCard>
        
        <ActivityCard>
          <CardTitle>Recent Referrals</CardTitle>
          <CardContent>
            {loading ? (
              <p>Loading data...</p>
            ) : recentReferrals.length > 0 ? (
              <>
                {recentReferrals.map(referral => (
                  <RecentActivity key={referral.id}>
                    <ActivityIcon>
                      <FaHandshake />
                    </ActivityIcon>
                    <ActivityContent>
                      <ActivityTitle>
                        {referral.referrerName || 'Unknown'} - Code: {referral.referralCode}
                      </ActivityTitle>
                      <ActivityMeta>
                        {formatDate(referral.createdAt)} - Status: {referral.isUsed ? 'Used' : referral.isExpired ? 'Expired' : 'Active'}
                      </ActivityMeta>
                    </ActivityContent>
                    <ActivityAmount>
                      {referral.discountAmount} {referral.discountCurrency || 'MAD'}
                    </ActivityAmount>
                  </RecentActivity>
                ))}
                <ViewAllLink>
                  <Link to="/dashboard/admin/referrals" style={{ textDecoration: 'none' }}>
                    <Button>View All Referrals</Button>
                  </Link>
                </ViewAllLink>
              </>
            ) : (
              <EmptyState>No recent referrals found.</EmptyState>
            )}
          </CardContent>
        </ActivityCard>
      </ActivityGrid>
    </div>
  );
};

export default OverviewPage; 
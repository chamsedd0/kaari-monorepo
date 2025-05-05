import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaUsers, 
  FaCameraRetro, 
  FaBuilding, 
  FaCog, 
  FaSignOutAlt, 
  FaEdit, 
  FaTimesCircle, 
  FaSearch,
  FaBan,
  FaPhotoVideo,
  FaListAlt,
  FaMoneyBillAlt
} from 'react-icons/fa';
import { 
  MdDashboard, 
  MdSettings, 
  MdGroup, 
  MdList, 
  MdMoneyOff,
  MdCancel,
  MdPhotoCamera
} from 'react-icons/md';

import {
  AdminDashboardContainer,
  Sidebar,
  SidebarHeader,
  Logo,
  NavItem,
  MainContent,
  Header,
  PageTitle,
  UserInfo,
  Avatar,
  UserName,
} from './styles';

import { useStore } from '../../../backend/store';
import PhotoshootBookings from './photoshoot-bookings';
import PhotoshootBookingDetail from './photoshoot-booking-detail';
import PropertyEditRequests from './property-edit-requests';
import EditRequests from './edit-requests/page';
import RefundRequests from './refund-requests/page';
import CancellationRequests from './cancellation-requests/page';
import AdminControls from './admin-controls';
import TeamsPage from './teams';
import OverviewPage from './overview';
import TestDataGenerator from './test-data-generator';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState<string>('overview');
  
  const user = useStore(state => state.user);
  const logout = useStore(state => state.logout);
  
  // Helper function to get user initials for avatar
  const getUserInitials = (): string => {
    if (!user) return '';
    
    const firstName = user.name.charAt(0).toUpperCase();
    const lastName = user.surname ? user.surname.charAt(0).toUpperCase() : '';
    
    return `${firstName}${lastName}`;
  };
  
  // Update active page based on route
  useEffect(() => {
    const path = location.pathname.split('/').pop() || 'overview';
    setActivePage(path);
  }, [location]);
  
  // Navigation handler
  const handleNavigation = (page: string) => {
    navigate(`/dashboard/admin/${page}`);
  };
  
  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };
  
  // Check for trailing slash and ensure it's removed from the shown path
  const renderContent = () => {
    const path = location.pathname;
    
    console.log('Current path in AdminDashboard:', path);
    
    if (path.endsWith('overview') || path === '/dashboard/admin') {
      return <OverviewPage />;
    } else if (path.includes('photoshoot-bookings')) {
      // Check if this is a view route with an ID
      const viewMatch = path.match(/\/photoshoot-bookings\/view\/([^\/]+)/);
      if (viewMatch && viewMatch[1]) {
        console.log('Found booking ID in path:', viewMatch[1]);
        return <PhotoshootBookingDetail onUpdateBooking={() => {}} />;
      }
      return <PhotoshootBookings />;
    } else if (path.includes('teams')) {
      return <TeamsPage />;
    } else if (path.endsWith('settings') || path.endsWith('admin-controls')) {
      return <AdminControls />;
    } else if (path.endsWith('property-edit-requests')) {
      return <PropertyEditRequests />;
    } else if (path.endsWith('edit-requests')) {
      return <EditRequests />;
    } else if (path.endsWith('refund-requests')) {
      return <RefundRequests />;
    } else if (path.endsWith('cancellation-requests')) {
      return <CancellationRequests />;
    } else if (path.endsWith('test-data-generator')) {
      return <TestDataGenerator />;
    } else {
      return <div>404 not found</div>;
    }
  };
  
  // Side navigation items for admin dashboard
  const navItems = [
    {
      label: 'Overview',
      icon: <MdDashboard />,
      path: '/dashboard/admin/overview',
      exact: true,
    },
    {
      label: 'Admin Controls',
      icon: <MdSettings />,
      path: '/dashboard/admin/admin-controls',
      exact: true,
    },
    {
      label: 'Teams',
      icon: <MdGroup />,
      path: '/dashboard/admin/teams',
      exact: true,
    },
    {
      label: 'Photoshoot Bookings',
      icon: <MdPhotoCamera />,
      path: '/dashboard/admin/photoshoot-bookings',
      exact: true,
    },
    {
      label: 'Property Edit Requests',
      icon: <FaEdit />,
      path: '/dashboard/admin/property-edit-requests',
      exact: true,
    },
    {
      label: 'Edit Requests',
      icon: <FaListAlt />,
      path: '/dashboard/admin/edit-requests',
      exact: true,
    },
    {
      label: 'Refund Requests',
      icon: <FaMoneyBillAlt />,
      path: '/dashboard/admin/refund-requests',
      exact: true,
    },
    {
      label: 'Cancellation Requests',
      icon: <FaBan />,
      path: '/dashboard/admin/cancellation-requests',
      exact: true,
    },
    {
      label: 'Test Data Generator',
      icon: <MdList />,
      path: '/dashboard/admin/test-data-generator',
      exact: true,
    },
  ];
  
  return (
    <AdminDashboardContainer>
      <Sidebar>
        <SidebarHeader>
          <Logo>Admin Panel</Logo>
        </SidebarHeader>
        
        <NavItem 
          $active={activePage === 'overview'} 
          onClick={() => handleNavigation('overview')}
        >
          <MdDashboard /> Overview
        </NavItem>
        
        <NavItem 
          $active={activePage === 'photoshoot-bookings'} 
          onClick={() => handleNavigation('photoshoot-bookings')}
        >
          <MdPhotoCamera /> Photoshoot Bookings
        </NavItem>
        
        <NavItem 
          $active={activePage === 'teams'} 
          onClick={() => handleNavigation('teams')}
        >
          <MdGroup /> Teams
        </NavItem>
        
        <NavItem 
          $active={activePage === 'properties'} 
          onClick={() => handleNavigation('properties')}
        >
          <FaBuilding /> Properties
        </NavItem>
        
        <NavItem 
          $active={activePage === 'property-edit-requests'} 
          onClick={() => handleNavigation('property-edit-requests')}
        >
          <FaEdit /> Property Edit Requests
        </NavItem>
        
        <NavItem 
          $active={activePage === 'refund-requests'} 
          onClick={() => handleNavigation('refund-requests')}
        >
          <FaMoneyBillAlt /> Refund Requests
        </NavItem>
        
        <NavItem 
          $active={activePage === 'cancellation-requests'} 
          onClick={() => handleNavigation('cancellation-requests')}
        >
          <FaBan /> Cancellation Requests
        </NavItem>
        
        <NavItem 
          $active={activePage === 'test-data-generator'} 
          onClick={() => handleNavigation('test-data-generator')}
        >
          <MdList /> Test Data Generator
        </NavItem>
        
        <NavItem 
          $active={activePage === 'settings'} 
          onClick={() => handleNavigation('settings')}
        >
          <MdSettings /> Settings
        </NavItem>
        
        <div style={{ marginTop: 'auto' }}>
          <NavItem onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </NavItem>
        </div>
      </Sidebar>
      
      <MainContent>
        <Header>
          <PageTitle>
            {activePage === 'overview' && 'Dashboard Overview'}
            {activePage === 'photoshoot-bookings' && 'Photoshoot Bookings'}
            {activePage === 'teams' && 'Manage Teams'}
            {activePage === 'properties' && 'Properties'}
            {activePage === 'property-edit-requests' && 'Property Edit Requests'}
            {activePage === 'refund-requests' && 'Refund Requests'}
            {activePage === 'cancellation-requests' && 'Cancellation Requests'}
            {activePage === 'settings' && 'Admin Controls'}
          </PageTitle>
          
          <UserInfo>
            <UserName>{user?.name} {user?.surname}</UserName>
            <Avatar>{getUserInitials()}</Avatar>
            <button 
              onClick={handleLogout}
              style={{
                marginLeft: '10px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#333',
                fontSize: '14px',
              }}
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          </UserInfo>
        </Header>
        
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/admin/overview" replace />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/photoshoot-bookings" element={<PhotoshootBookings />} />
          <Route path="/photoshoot-bookings/*" element={<PhotoshootBookings />} />
          <Route path="/teams/*" element={<TeamsPage />} />
          <Route path="/property-edit-requests" element={<PropertyEditRequests />} />
          <Route path="/edit-requests" element={<EditRequests />} />
          <Route path="/refund-requests" element={<RefundRequests />} />
          <Route path="/cancellation-requests" element={<CancellationRequests />} />
          <Route path="/settings" element={<AdminControls />} />
          <Route path="/admin-controls" element={<AdminControls />} />
          <Route path="/test-data-generator" element={<TestDataGenerator />} />
          <Route path="*" element={<Navigate to="/dashboard/admin/overview" replace />} />
        </Routes>
      </MainContent>
    </AdminDashboardContainer>
  );
};

export default AdminDashboard;
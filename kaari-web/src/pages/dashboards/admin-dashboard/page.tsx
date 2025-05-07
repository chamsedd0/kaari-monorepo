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
          $active={activePage === 'admin-controls'} 
          onClick={() => handleNavigation('admin-controls')}
        >
          <MdSettings /> Admin Controls
        </NavItem>
        
        <NavItem onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </NavItem>
      </Sidebar>
      
      <MainContent>
        <Header>
          <PageTitle>
            Admin Dashboard
          </PageTitle>
          
          <UserInfo>
            <Avatar>{getUserInitials()}</Avatar>
            <UserName>{user?.displayName || user?.name || 'Admin User'}</UserName>
          </UserInfo>
        </Header>
        
        <Routes>
          <Route path="/" element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="photoshoot-bookings" element={<PhotoshootBookings />} />
          <Route path="photoshoot-bookings/view/:id" element={<PhotoshootBookingDetail onUpdateBooking={() => {}} />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="admin-controls" element={<AdminControls />} />
          <Route path="property-edit-requests" element={<PropertyEditRequests />} />
          <Route path="edit-requests/*" element={<EditRequests />} />
          <Route path="refund-requests/*" element={<RefundRequests />} />
          <Route path="cancellation-requests/*" element={<CancellationRequests />} />
          <Route path="test-data-generator" element={<TestDataGenerator />} />
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </MainContent>
    </AdminDashboardContainer>
  );
};

export default AdminDashboard;
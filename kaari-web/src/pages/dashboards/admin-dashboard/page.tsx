import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { 
  FaBuilding, 
  FaSignOutAlt, 
  FaEdit, 
  FaBan,
  FaMoneyBillAlt,
  FaUserCog,
  FaClipboardList
} from 'react-icons/fa';
import { 
  MdDashboard, 
  MdSettings, 
  MdGroup, 
  MdList, 
  MdPhotoCamera,
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
import PropertyPage from './properties/page';
import PropertyEditPage from './properties/[id]/edit/page';
import UsersPage from './users';
import UserDetailPage from './user-detail';
import AdminLogsPage from './logs';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useStore();
  const [activePage, setActivePage] = useState('overview');

  const handleNavigation = (page: string) => {
    setActivePage(page);
    navigate(`/dashboard/admin/${page}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
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
          $active={activePage === 'users'} 
          onClick={() => handleNavigation('users')}
        >
          <FaUserCog /> Users Management
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
        
        <NavItem 
          $active={activePage === 'logs'} 
          onClick={() => handleNavigation('logs')}
        >
          <FaClipboardList /> Activity Logs
        </NavItem>
        
        <NavItem onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </NavItem>
      </Sidebar>

      <MainContent>
        <Header>
          <PageTitle>
            {activePage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </PageTitle>
          <UserInfo>
            <Avatar>
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="User avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'A'
              )}
            </Avatar>
            <UserName>{user?.name || 'Admin User'}</UserName>
          </UserInfo>
        </Header>

        <Routes>
          <Route path="/" element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<UserDetailPage />} />
          <Route path="photoshoot-bookings" element={<PhotoshootBookings />} />
          <Route path="photoshoot-bookings/view/:id" element={<PhotoshootBookingDetail onUpdateBooking={() => {}} />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="admin-controls" element={<AdminControls />} />
          <Route path="properties" element={<PropertyPage />} />
          <Route path="properties/edit/:id" element={<PropertyEditPage />} />
          <Route path="property-edit-requests" element={<PropertyEditRequests />} />
          <Route path="edit-requests/*" element={<EditRequests />} />
          <Route path="refund-requests/*" element={<RefundRequests />} />
          <Route path="cancellation-requests/*" element={<CancellationRequests />} />
          <Route path="test-data-generator" element={<TestDataGenerator />} />
          <Route path="logs" element={<AdminLogsPage />} />
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </MainContent>
    </AdminDashboardContainer>
  );
};

export default AdminDashboard;
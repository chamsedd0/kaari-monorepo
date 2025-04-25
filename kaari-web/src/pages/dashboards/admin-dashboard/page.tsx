import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaUsers, FaCameraRetro, FaBuilding, FaCog, FaSignOutAlt } from 'react-icons/fa';

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
import PhotoshootBookingsPage from './photoshoot-bookings';
import TeamsPage from './teams';
import OverviewPage from './overview';
import AdminControls from './admin-controls';

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
          <FaHome /> Overview
        </NavItem>
        
        <NavItem 
          $active={activePage === 'photoshoot-bookings'} 
          onClick={() => handleNavigation('photoshoot-bookings')}
        >
          <FaCalendarAlt /> Photoshoot Bookings
        </NavItem>
        
        <NavItem 
          $active={activePage === 'teams'} 
          onClick={() => handleNavigation('teams')}
        >
          <FaUsers /> Teams
        </NavItem>
        
        <NavItem 
          $active={activePage === 'properties'} 
          onClick={() => handleNavigation('properties')}
        >
          <FaBuilding /> Properties
        </NavItem>
        
        <NavItem 
          $active={activePage === 'settings'} 
          onClick={() => handleNavigation('settings')}
        >
          <FaCog /> Settings
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
          <Route path="/" element={<OverviewPage />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/photoshoot-bookings/*" element={<PhotoshootBookingsPage />} />
          <Route path="/teams/*" element={<TeamsPage />} />
          <Route path="/settings" element={<AdminControls />} />
          {/* Additional routes to be implemented */}
          <Route path="*" element={<OverviewPage />} />
        </Routes>
      </MainContent>
    </AdminDashboardContainer>
  );
};

export default AdminDashboard;
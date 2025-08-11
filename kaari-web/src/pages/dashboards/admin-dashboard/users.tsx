import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaUserTie, 
  FaUserCog, 
  FaSearch, 
  FaEye, 
  FaBan, 
  FaTrash, 
  FaUnlock, 
  FaFilter, 
  FaRedo
} from 'react-icons/fa';
import { PageContainer, PageHeader, GlassCard, FilterBar, SearchBox, Pill, IconButton } from '../../../components/admin/AdminUI';
import { Button, StatusBadge } from './styles';
import { getAllUsers, blockUser, unblockUser } from '../../../backend/server-actions/UserServerActions';
import { deleteDocument } from '../../../backend/firebase/firestore';
import { User } from '../../../backend/entities';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

const USERS_COLLECTION = 'users';

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid ${Theme.colors.gray}30;
  }
  
  th {
    font-weight: 600;
    color: ${Theme.colors.primary};
    background-color: ${Theme.colors.gray}10;
  }
  
  tbody tr:hover {
    background-color: ${Theme.colors.gray}10;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  
  button {
    padding: 0.35rem;
    border: none;
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.view {
      color: ${Theme.colors.primary};
    }
    
    &.block {
      color: ${Theme.colors.error};
    }
    
    &.unblock {
      color: ${Theme.colors.success};
    }
    
    &.delete {
      color: ${Theme.colors.error};
    }
    
    &:hover {
      background-color: ${Theme.colors.gray}20;
    }
  }
`;

// Legacy FilterContainer removed; using shared FilterBar and Pill

// Legacy SearchContainer removed; using shared SearchBox

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: ${Theme.colors.gray}30;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: ${Theme.colors.primary};
    
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  
  .user-info {
    .name {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    
    .email {
      font-size: 0.875rem;
      color: ${Theme.colors.gray};
    }
  }
`;

const UserType = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => 
      props.role === 'admin' 
        ? Theme.colors.error
        : props.role === 'advertiser'
          ? Theme.colors.secondary
          : Theme.colors.success
    };
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  
  button {
    padding: 0.5rem 0.75rem;
    border: 1px solid ${Theme.colors.gray}30;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
    
    &.active {
      background-color: ${Theme.colors.primary};
      color: white;
      border-color: ${Theme.colors.primary};
    }
    
    &:hover:not(:disabled) {
      background-color: ${Theme.colors.gray}10;
      
      &.active {
        background-color: ${Theme.colors.primary}dd;
      }
    }
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${Theme.colors.gray};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${Theme.colors.gray};
  
  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  h3 {
    margin-bottom: 0.5rem;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  .stat-card {
    flex: 1;
    background-color: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    
    .title {
      font-size: 0.875rem;
      color: ${Theme.colors.gray};
      margin-bottom: 0.5rem;
    }
    
    .value {
      font-size: 1.5rem;
      font-weight: 600;
      color: ${Theme.colors.primary};
      
      &.admin {
        color: ${Theme.colors.error};
      }
      
      &.advertiser {
        color: ${Theme.colors.secondary};
      }
      
      &.client {
        color: ${Theme.colors.success};
      }
    }
  }
`;

const ITEMS_PER_PAGE = 10;

const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'client' | 'advertiser' | 'admin'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    advertisers: 0,
    clients: 0
  });

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
        
        // Calculate stats
        setStats({
          total: allUsers.length,
          admins: allUsers.filter(user => user.role === 'admin').length,
          advertisers: allUsers.filter(user => user.role === 'advertiser').length,
          clients: allUsers.filter(user => user.role === 'client').length
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading users:', error);
        setLoading(false);
      }
    };
    
    loadUsers();
  }, [refresh]);

  // Apply filters when activeFilter or searchQuery changes
  useEffect(() => {
    let result = [...users];
    
    // Apply role filter
    if (activeFilter !== 'all') {
      result = result.filter(user => user.role === activeFilter);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query) ||
        (user.surname && user.surname.toLowerCase().includes(query))
      );
    }
    
    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, activeFilter, searchQuery]);

  // Handle filter click
  const handleFilterClick = (filter: 'all' | 'client' | 'advertiser' | 'admin') => {
    setActiveFilter(filter);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle blocking/unblocking a user
  const handleBlockUser = async (userId: string, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await unblockUser(userId);
      } else {
        await blockUser(userId);
      }
      
      // Refresh the user list
      setRefresh(prev => prev + 1);
    } catch (error) {
      console.error('Error toggling user block status:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to update user status'}`);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user ${userName}? This action cannot be undone.`)) {
      try {
        await deleteDocument(USERS_COLLECTION, userId);
        
        // Refresh the user list
        setRefresh(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(`Error: ${error instanceof Error ? error.message : 'Failed to delete user'}`);
      }
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  // Function to view user details
  const handleViewUser = (userId: string) => {
    navigate(`/dashboard/admin/users/${userId}`);
  };
  
  // Function to refresh users list
  const handleRefresh = () => {
    setRefresh(prev => prev + 1);
  };

  // Function to format date properly
  const formatDate = (dateString: string | Date): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <PageContainer>
      <PageHeader title="User Management" right={<Button onClick={handleRefresh} className="secondary"><FaRedo /> Refresh</Button>} />
      <GlassCard>
        {/* Stats cards */}
        <Stats>
          <div className="stat-card">
            <div className="title">Total Users</div>
            <div className="value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="title">Admins</div>
            <div className="value admin">{stats.admins}</div>
          </div>
          <div className="stat-card">
            <div className="title">Advertisers</div>
            <div className="value advertiser">{stats.advertisers}</div>
          </div>
          <div className="stat-card">
            <div className="title">Clients</div>
            <div className="value client">{stats.clients}</div>
          </div>
        </Stats>
        
        {/* Filters and search */}
        <FilterBar>
          <div style={{ display: 'flex', gap: 8 }}>
            {([
              { key: 'all', label: 'All Users', icon: <FaFilter /> },
              { key: 'client', label: 'Clients', icon: <FaUser /> },
              { key: 'advertiser', label: 'Advertisers', icon: <FaUserTie /> },
              { key: 'admin', label: 'Admins', icon: <FaUserCog /> },
            ] as const).map(item => (
              <Pill key={item.key as string} onClick={() => handleFilterClick(item.key as any)} style={{
                cursor: 'pointer',
                background: activeFilter === (item.key as any) ? `${Theme.colors.tertiary}30` : Theme.colors.white,
                borderColor: activeFilter === (item.key as any) ? Theme.colors.tertiary : `${Theme.colors.tertiary}80`
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {item.icon} {item.label}
                </span>
              </Pill>
            ))}
          </div>
          <SearchBox>
            <FaSearch />
            <input type="text" placeholder="Search users..." value={searchQuery} onChange={handleSearchChange} />
          </SearchBox>
        </FilterBar>

        {/* User list */}
        {loading ? (
          <LoadingState>Loading users...</LoadingState>
        ) : filteredUsers.length === 0 ? (
          <EmptyState>
            <FaUser />
            <h3>No users found</h3>
            <p>Try changing your filters or search query</p>
          </EmptyState>
        ) : (
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <UserProfile>
                        <div className="avatar">
                          {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="user-info">
                          <div className="name">{user.name} {user.surname}</div>
                          <div className="email">{user.email}</div>
                        </div>
                      </UserProfile>
                    </td>
                    <td>
                      <UserType role={user.role}>
                        {user.role === 'admin' ? (
                          <>
                            <FaUserCog /> Admin
                          </>
                        ) : user.role === 'advertiser' ? (
                          <>
                            <FaUserTie /> Advertiser
                          </>
                        ) : (
                          <>
                            <FaUser /> Client
                          </>
                        )}
                      </UserType>
                    </td>
                    <td>
                      <StatusBadge status={getUserStatusBadge(user).status}>
                        {getUserStatusBadge(user).label}
                      </StatusBadge>
                    </td>
                    <td>
                      {formatDate(user.createdAt)}
                    </td>
                    <td>
                      <ActionsContainer>
                        {user.role !== 'admin' && (
                          <>
                            <IconButton title="View Details" onClick={() => handleViewUser(user.id)}>
                              <FaEye style={{ color: Theme.colors.primary }} />
                            </IconButton>
                            <IconButton
                              title={user.isBlocked ? 'Unblock User' : 'Block User'}
                              onClick={() => handleBlockUser(user.id, user.isBlocked || false)}
                            >
                              {user.isBlocked ? (
                                <FaUnlock style={{ color: Theme.colors.success }} />
                              ) : (
                                <FaBan style={{ color: Theme.colors.error }} />
                              )}
                            </IconButton>
                            <IconButton title="Delete User" onClick={() => handleDeleteUser(user.id, user.name)}>
                              <FaTrash style={{ color: Theme.colors.error }} />
                            </IconButton>
                          </>
                        )}
                        {user.role === 'admin' && (
                          <span style={{ color: '#888', fontStyle: 'italic', fontSize: '0.85rem' }}>Protected</span>
                        )}
                      </ActionsContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                <span>Page {currentPage} of {totalPages}</span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </button>
              </Pagination>
            )}
          </TableContainer>
        )}
      </GlassCard>
    </PageContainer>
  );
};

export default UsersPage;

// Add a helper function to get status badge props
export const getUserStatusBadge = (user: User) => {
  if (user.role === 'admin') {
    return {
      status: 'admin',
      label: 'Admin'
    };
  }
  
  return {
    status: user.isBlocked ? 'blocked' : 'active',
    label: user.isBlocked ? 'Blocked' : 'Active'
  };
}; 
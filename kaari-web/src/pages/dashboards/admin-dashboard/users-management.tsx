import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaUserTie, 
  FaBuilding,
  FaHome,
  FaSearch, 
  FaEye, 
  FaCalendarAlt,
  FaFilter, 
  FaRedo
} from 'react-icons/fa';
import { 
  DashboardCard, 
  CardTitle, 
  CardContent, 
  Button, 
  StatusBadge 
} from './styles';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import AdminTableScaffold from '../../../components/admin/AdminTableScaffold';
import { formatDateSafe } from '../../../utils/dates';
import { PageContainer, PageHeader, FilterBar, SearchBox, GlassCard, GlassTable, Pill, IconButton } from '../../../components/admin/AdminUI';

// Mock data for testing
const mockUsers = [
  {
    id: 'user1',
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@example.com',
    profilePicture: '',
    role: 'advertiser',
    advertiserType: 'broker',
    createdAt: new Date('2023-01-15')
  },
  {
    id: 'user2',
    name: 'Jane',
    surname: 'Smith',
    email: 'jane.smith@example.com',
    profilePicture: '',
    role: 'client',
    createdAt: new Date('2023-02-20')
  },
  {
    id: 'user3',
    name: 'Robert',
    surname: 'Johnson',
    email: 'robert.johnson@example.com',
    profilePicture: '',
    role: 'advertiser',
    advertiserType: 'landlord',
    createdAt: new Date('2023-03-10')
  },
  {
    id: 'user4',
    name: 'Emily',
    surname: 'Brown',
    email: 'emily.brown@example.com',
    profilePicture: '',
    role: 'client',
    createdAt: new Date('2023-04-05')
  },
  {
    id: 'user5',
    name: 'Michael',
    surname: 'Davis',
    email: 'michael.davis@example.com',
    profilePicture: '',
    role: 'advertiser',
    advertiserType: 'agency',
    createdAt: new Date('2023-05-15')
  },
  {
    id: 'user6',
    name: 'Sarah',
    surname: 'Wilson',
    email: 'sarah.wilson@example.com',
    profilePicture: '',
    role: 'client',
    createdAt: new Date('2023-06-20')
  },
  {
    id: 'user7',
    name: 'David',
    surname: 'Taylor',
    email: 'david.taylor@example.com',
    profilePicture: '',
    role: 'advertiser',
    advertiserType: 'broker',
    createdAt: new Date('2023-07-10')
  },
  {
    id: 'user8',
    name: 'Lisa',
    surname: 'Anderson',
    email: 'lisa.anderson@example.com',
    profilePicture: '',
    role: 'client',
    createdAt: new Date('2023-08-05')
  },
  {
    id: 'user9',
    name: 'James',
    surname: 'Thomas',
    email: 'james.thomas@example.com',
    profilePicture: '',
    role: 'advertiser',
    advertiserType: 'landlord',
    createdAt: new Date('2023-09-15')
  },
  {
    id: 'user10',
    name: 'Jennifer',
    surname: 'Jackson',
    email: 'jennifer.jackson@example.com',
    profilePicture: '',
    role: 'client',
    createdAt: new Date('2023-10-20')
  },
  {
    id: 'user11',
    name: 'Charles',
    surname: 'White',
    email: 'charles.white@example.com',
    profilePicture: '',
    role: 'advertiser',
    advertiserType: 'agency',
    createdAt: new Date('2023-11-10')
  },
  {
    id: 'user12',
    name: 'Amanda',
    surname: 'Harris',
    email: 'amanda.harris@example.com',
    profilePicture: '',
    role: 'admin',
    createdAt: new Date('2023-12-05')
  }
];

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
  
  tbody tr {
    cursor: pointer;
    &:hover {
      background-color: ${Theme.colors.gray}10;
    }
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 300px;
  
  input {
    width: 100%;
    padding: 0.5rem 1rem;
    padding-left: 2.5rem;
    border: 1px solid ${Theme.colors.gray}30;
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: ${Theme.colors.primary};
    }
  }
  
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${Theme.colors.gray};
  }
`;

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

const AdvertiserType = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${Theme.colors.primary};
  }
`;

const DateRangeFilter = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  
  input {
    padding: 0.5rem;
    border: 1px solid ${Theme.colors.gray}30;
    border-radius: 4px;
    font-size: 0.875rem;
    
    &:focus {
      outline: none;
      border-color: ${Theme.colors.primary};
    }
  }
  
  label {
    font-size: 0.875rem;
    color: ${Theme.colors.gray};
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
    opacity: 0.5;
  }
  
  p {
    margin-bottom: 1rem;
  }
`;

const FilterDropdown = styled.select`
  padding: 0.5rem;
  border: 1px solid ${Theme.colors.gray}30;
  border-radius: 4px;
  background-color: white;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${Theme.colors.primary};
  }
`;

const UsersManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(50);
  const [error, setError] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'client' | 'advertiser'>('all');
  const [advertiserTypeFilter, setAdvertiserTypeFilter] = useState<'all' | 'broker' | 'landlord' | 'agency'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 10;

  // Load users on component mount
  useEffect(() => {
    // Simulated initial load; replace with server-action when available
    setLoading(true);
    setError(null);
    setTimeout(() => {
      try {
        const initial = mockUsers.slice(0, limit);
        setUsers(initial);
        setFilteredUsers(initial);
        setHasMore(mockUsers.length > initial.length);
      } catch (e: any) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [limit]);

  // Apply filters whenever filter state changes
  useEffect(() => {
    applyFilters();
  }, [users, userTypeFilter, advertiserTypeFilter, searchTerm, startDate, endDate]);

  // Function to apply all filters
  const applyFilters = () => {
    let result = [...users];

    // Filter by user type
    if (userTypeFilter !== 'all') {
      result = result.filter(user => user.role === userTypeFilter);
    }

    // Filter by advertiser type (only if user type is advertiser)
    if (userTypeFilter === 'advertiser' && advertiserTypeFilter !== 'all') {
      result = result.filter(user => user.advertiserType === advertiserTypeFilter);
    }

    // Filter by search term (name or email)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name?.toLowerCase().includes(term) || 
        user.surname?.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
      );
    }

    // Filter by date range
    if (startDate) {
      const startTimestamp = new Date(startDate).getTime();
      result = result.filter(user => {
        const userDate = user.createdAt instanceof Date 
          ? user.createdAt.getTime() 
          : new Date(user.createdAt).getTime();
        return userDate >= startTimestamp;
      });
    }

    if (endDate) {
      const endTimestamp = new Date(endDate).getTime() + (24 * 60 * 60 * 1000); // Include the entire end day
      result = result.filter(user => {
        const userDate = user.createdAt instanceof Date 
          ? user.createdAt.getTime() 
          : new Date(user.createdAt).getTime();
        return userDate <= endTimestamp;
      });
    }

    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle filter button clicks
  const handleUserTypeFilter = (filter: 'all' | 'client' | 'advertiser') => {
    setUserTypeFilter(filter);
    // Reset advertiser type filter if user type is not advertiser
    if (filter !== 'advertiser') {
      setAdvertiserTypeFilter('all');
    }
  };

  // Handle advertiser type filter change
  const handleAdvertiserTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAdvertiserTypeFilter(e.target.value as 'all' | 'broker' | 'landlord' | 'agency');
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle date filter changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const initial = mockUsers.slice(0, limit);
      setUsers(initial);
      setFilteredUsers(initial);
      setHasMore(mockUsers.length > initial.length);
      setUserTypeFilter('all');
      setAdvertiserTypeFilter('all');
      setSearchTerm('');
      setStartDate('');
      setEndDate('');
      setCurrentPage(1);
      setLoading(false);
    }, 500);
  };

  // Handle view user details
  const handleViewUser = (userId: string) => {
    navigate(`/dashboard/admin/user-management/${userId}`);
  };

  // Format date for display
  const formatDate = (dateLike: any): string => formatDateSafe(dateLike);

  // Get user icon based on role
  const getUserIcon = (user: any) => {
    switch (user.role) {
      case 'admin':
        return <FaUserTie />;
      case 'advertiser':
        return <FaUserTie />;
      default:
        return <FaUser />;
    }
  };

  // Get advertiser type icon
  const getAdvertiserTypeIcon = (user: any) => {
    if (user.role !== 'advertiser') return null;
    
    switch (user.advertiserType) {
      case 'broker':
        return <FaUserTie />;
      case 'landlord':
        return <FaHome />;
      case 'agency':
        return <FaBuilding />;
      default:
        return null;
    }
  };

  // Get advertiser type display text
  const getAdvertiserTypeText = (user: any) => {
    if (user.role !== 'advertiser') return 'N/A';
    
    switch (user.advertiserType) {
      case 'broker':
        return 'Broker';
      case 'landlord':
        return 'Landlord';
      case 'agency':
        return 'Agency';
      default:
        return 'N/A';
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <PageContainer>
      <PageHeader title="Users Management" subtitle="View and manage all users in the system" right={<Button onClick={handleRefresh}><FaRedo /> Refresh</Button>} />
      <FilterBar>
        <div style={{ display: 'flex', gap: 8 }}>
          {([
            { key: 'all', label: 'All Users', icon: <FaUser /> },
            { key: 'client', label: 'Clients', icon: <FaUser /> },
            { key: 'advertiser', label: 'Advertisers', icon: <FaUserTie /> },
          ] as const).map(item => (
            <Pill key={item.key as string} onClick={() => handleUserTypeFilter(item.key as any)} style={{
              cursor: 'pointer',
              background: userTypeFilter === (item.key as any) ? `${Theme.colors.tertiary}30` : '#fff',
              borderColor: userTypeFilter === (item.key as any) ? Theme.colors.tertiary : `${Theme.colors.tertiary}80`
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {item.icon} {item.label}
              </span>
            </Pill>
          ))}
        </div>
        {userTypeFilter === 'advertiser' && (
          <FilterDropdown value={advertiserTypeFilter} onChange={handleAdvertiserTypeFilter}>
            <option value="all">All Types</option>
            <option value="broker">Broker</option>
            <option value="landlord">Landlord</option>
            <option value="agency">Agency</option>
          </FilterDropdown>
        )}
        <SearchBox>
          <FaSearch />
          <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={handleSearchChange} />
        </SearchBox>
        <DateRangeFilter>
          <label>From:</label>
          <input type="date" value={startDate} onChange={handleStartDateChange} />
          <label>To:</label>
          <input type="date" value={endDate} onChange={handleEndDateChange} />
        </DateRangeFilter>
      </FilterBar>
        
        <AdminTableScaffold
          loading={loading}
          error={error}
          isEmpty={!loading && !error && filteredUsers.length === 0}
          onRetry={handleRefresh}
          hasMore={hasMore}
          onLoadMore={() => {
            const next = mockUsers.slice(users.length, users.length + limit);
            const updated = [...users, ...next];
            setUsers(updated);
            setHasMore(updated.length < mockUsers.length);
          }}
        >
          {filteredUsers.length > 0 && (
            <>
              <GlassCard>
                <GlassTable>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Type</th>
                      <th>Advertiser Type</th>
                      <th>Date Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user.id} onClick={() => handleViewUser(user.id)}>
                        <td>
                          <UserProfile>
                            <div className="avatar">
                              {user.profilePicture ? (
                                <img src={user.profilePicture} alt={user.name} />
                              ) : (
                                user.name?.charAt(0) || user.email.charAt(0).toUpperCase()
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
                            {getUserIcon(user)}
                            {user.role === 'admin' ? 'Admin' : user.role === 'advertiser' ? 'Advertiser' : 'Client'}
                          </UserType>
                        </td>
                        <td>
                          {user.role === 'advertiser' ? (
                            <AdvertiserType>
                              {getAdvertiserTypeIcon(user)}
                              {getAdvertiserTypeText(user)}
                            </AdvertiserType>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <ActionsContainer>
                            <IconButton title="View" onClick={(e) => {
                              e.stopPropagation();
                              handleViewUser(user.id);
                            }}>
                              <FaEye style={{ color: Theme.colors.primary }} />
                            </IconButton>
                          </ActionsContainer>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </GlassTable>
              </GlassCard>
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination>
                  <button 
                    onClick={() => paginate(1)} 
                    disabled={currentPage === 1}
                  >
                    First
                  </button>
                  <button 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={currentPage === pageNum ? 'active' : ''}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                  <button 
                    onClick={() => paginate(totalPages)} 
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </button>
                </Pagination>
              )}
            </>
          )}
        </AdminTableScaffold>
    </PageContainer>
  );
};

export default UsersManagementPage; 
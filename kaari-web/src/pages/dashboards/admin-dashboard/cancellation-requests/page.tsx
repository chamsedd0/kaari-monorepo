import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { 
  FaSearch, 
  FaFilter, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf, 
  FaUserCircle,
  FaBuilding,
  FaCalendarAlt,
  FaDollarSign,
  FaExclamationCircle,
  FaInbox,
  FaSpinner,
  FaSync
} from 'react-icons/fa';
import { useToastService } from '../../../../services/ToastService';
import { getCancellationRequests, approveCancellationRequest, rejectCancellationRequest, CancellationRequest } from '../../../../backend/server-actions/AdminServerActions';

// Styled components (reusing styles from refund-requests)
const CancellationRequestsContainer = styled.div`
  padding: 2rem;
  
  h1 {
    font: ${Theme.typography.fonts.h3};
    margin-bottom: 1.5rem;
  }
  
  .filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    
    .search-box {
      display: flex;
      align-items: center;
      background-color: white;
      border: 1px solid ${Theme.colors.tertiary};
      border-radius: ${Theme.borders.radius.sm};
      padding: 0 1rem;
      width: 300px;
      
      input {
        flex: 1;
        border: none;
        padding: 0.75rem 0;
        outline: none;
        
        &::placeholder {
          color: ${Theme.colors.gray2};
        }
      }
      
      svg {
        color: ${Theme.colors.gray2};
        margin-right: 0.5rem;
      }
    }
    
    .filters {
      display: flex;
      align-items: center;
      gap: 1rem;
      
      .filter-dropdown {
        position: relative;
        
        .filter-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background-color: white;
          border: 1px solid ${Theme.colors.tertiary};
          border-radius: ${Theme.borders.radius.sm};
          cursor: pointer;
          font: ${Theme.typography.fonts.smallB};
          
          svg {
            color: ${Theme.colors.gray2};
          }
        }
        
        .dropdown-content {
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 10;
          background-color: white;
          border: 1px solid ${Theme.colors.tertiary};
          border-radius: ${Theme.borders.radius.sm};
          min-width: 200px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          margin-top: 0.5rem;
          
          .dropdown-item {
            padding: 0.75rem 1rem;
            cursor: pointer;
            font: ${Theme.typography.fonts.smallM};
            
            &:hover {
              background-color: ${Theme.colors.tertiary}40;
            }
            
            &.active {
              background-color: ${Theme.colors.secondary}20;
              color: ${Theme.colors.secondary};
            }
          }
        }
      }
    }
  }
  
  .requests-table {
    background-color: white;
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    overflow: hidden;
    
    table {
      width: 100%;
      border-collapse: collapse;
      
      th {
        text-align: left;
        padding: 1rem 1.5rem;
        font: ${Theme.typography.fonts.smallB};
        color: ${Theme.colors.gray2};
        background-color: ${Theme.colors.white};
        border-bottom: 1px solid ${Theme.colors.tertiary};
      }
      
      td {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid ${Theme.colors.tertiary};
        font: ${Theme.typography.fonts.smallM};
        color: ${Theme.colors.black};
        vertical-align: middle;
      }
      
      tr:last-child td {
        border-bottom: none;
      }
      
      .status {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.75rem;
        border-radius: 16px;
        font: ${Theme.typography.fonts.smallB};
        
        &.pending {
          background-color: #FFF8E1;
          color: #FF9800;
        }
        
        &.approved {
          background-color: #E8F5E9;
          color: #4CAF50;
        }
        
        &.rejected {
          background-color: #FFEBEE;
          color: #F44336;
        }
      }
      
      .action-buttons {
        display: flex;
        gap: 0.5rem;
        
        button {
          padding: 0.5rem;
          border-radius: ${Theme.borders.radius.sm};
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          
          &.approve {
            background-color: #E8F5E9;
            color: #4CAF50;
            
            &:hover {
              background-color: #4CAF50;
              color: white;
            }
          }
          
          &.reject {
            background-color: #FFEBEE;
            color: #F44336;
            
            &:hover {
              background-color: #F44336;
              color: white;
            }
          }
          
          &.view {
            background-color: #E3F2FD;
            color: #2196F3;
            
            &:hover {
              background-color: #2196F3;
              color: white;
            }
          }
          
          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            
            &:hover {
              background-color: inherit;
              color: inherit;
            }
          }
        }
      }
    }
  }
  
  .empty-state {
    text-align: center;
    padding: 3rem;
    background-color: white;
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    
    svg {
      font-size: 48px;
      color: ${Theme.colors.gray2};
      margin-bottom: 1rem;
    }
    
    h3 {
      font: ${Theme.typography.fonts.h4B};
      color: ${Theme.colors.black};
      margin-bottom: 0.5rem;
    }
    
    p {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.gray2};
      max-width: 500px;
      margin: 0 auto;
    }
  }
  
  .loading {
    text-align: center;
    padding: 3rem;
    color: ${Theme.colors.gray2};
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${Theme.colors.gray2};

  .spinner {
    animation: spin 1s linear infinite;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${Theme.colors.error};

  svg {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .retry-button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: ${Theme.borders.radius.sm};
    background-color: ${Theme.colors.secondary};
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 1rem auto;

    &:hover {
      background-color: ${Theme.colors.secondaryDark};
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${Theme.colors.gray2};

  svg {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const CancellationRequests: React.FC = () => {
  const [cancellationRequests, setCancellationRequests] = useState<CancellationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const toast = useToastService();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching cancellation requests...');
        const data = await getCancellationRequests();
        console.log('Received cancellation requests:', data);
        
        // Filter out any malformed data
        const validRequests = data.filter(request => {
          const isValid = 
            request.id &&
            request.userId &&
            request.propertyId &&
            typeof request.originalAmount === 'number' &&
            request.status;
          
          if (!isValid) {
            console.warn('Found invalid cancellation request:', request);
          }
          return isValid;
        });
        
        setCancellationRequests(validRequests);
      } catch (err: any) {
        console.error('Error fetching cancellation requests:', err);
        setError(err.message || 'Failed to load cancellation requests');
        setCancellationRequests([]); // Clear any partial data
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Filter requests based on search term and status filter
  const filteredRequests = cancellationRequests.filter(request => {
    const matchesSearch = 
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Format date
  const formatDate = (date: any) => {
    if (!date) return 'Not set';
    
    try {
      console.log('Formatting date:', date, typeof date);
      
      // Handle Firestore Timestamp
      if (typeof date === 'object' && date !== null) {
        // Check if it's a Firestore Timestamp (has seconds property)
        if ('seconds' in date) {
          console.log('Formatting Firestore Timestamp');
          return new Date(date.seconds * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
        
        // Handle Date object
        if (date instanceof Date) {
          console.log('Formatting Date object');
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
        
        // Handle server timestamp (special Firebase value)
        if (date.toDate && typeof date.toDate === 'function') {
          console.log('Formatting with toDate() method');
          const jsDate = date.toDate();
          return jsDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
      }
      
      // Handle string (ISO date string)
      if (typeof date === 'string') {
        console.log('Formatting string date');
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
      
      // Handle number (timestamp in milliseconds)
      if (typeof date === 'number') {
        console.log('Formatting number timestamp');
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
      
      return 'Invalid date format';
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Invalid date';
    }
  };
  
  // Format amount with currency
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Handle request approval
  const handleApprove = async (id: string) => {
    try {
      setProcessing(id);
      await approveCancellationRequest(id);
      toast.showToast('success', 'Cancellation Approved', 'The cancellation request has been approved');
      
      // Refresh the list
      await fetchCancellationRequests();
      setProcessing(null);
    } catch (err: any) {
      toast.showToast('error', 'Error', err.message || 'Failed to approve cancellation');
      setProcessing(null);
    }
  };
  
  // Handle request rejection
  const handleReject = async (id: string) => {
    try {
      setProcessing(id);
      await rejectCancellationRequest(id);
      toast.showToast('success', 'Cancellation Rejected', 'The cancellation request has been rejected');
      
      // Refresh the list
      await fetchCancellationRequests();
      setProcessing(null);
    } catch (err: any) {
      toast.showToast('error', 'Error', err.message || 'Failed to reject cancellation');
      setProcessing(null);
    }
  };
  
  // Handle view details
  const handleViewDetails = (id: string) => {
    // In a real implementation, this would navigate to a details page
    toast.showToast('info', 'View Details', `Viewing details for request ${id}`);
  };
  
  if (loading) {
    return (
      <CancellationRequestsContainer>
        <h1>Cancellation Requests</h1>
        <div className="loading">Loading cancellation requests...</div>
      </CancellationRequestsContainer>
    );
  }
  
  if (error) {
    return (
      <CancellationRequestsContainer>
        <h1>Cancellation Requests</h1>
        <div className="empty-state">
          <FaTimesCircle />
          <h3>Error Loading Requests</h3>
          <p>{error}</p>
        </div>
      </CancellationRequestsContainer>
    );
  }
  
  return (
    <CancellationRequestsContainer>
      <h1>Cancellation Requests</h1>
      
      <div className="filter-bar">
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search by name, property or ID" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <div className="filter-dropdown">
            <div className="filter-button" onClick={() => setShowStatusFilter(!showStatusFilter)}>
              <FaFilter />
              <span>Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
            </div>
            
            {showStatusFilter && (
              <div className="dropdown-content">
                <div 
                  className={`dropdown-item ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => {
                    setStatusFilter('all');
                    setShowStatusFilter(false);
                  }}
                >
                  All
                </div>
                <div 
                  className={`dropdown-item ${statusFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => {
                    setStatusFilter('pending');
                    setShowStatusFilter(false);
                  }}
                >
                  Pending
                </div>
                <div 
                  className={`dropdown-item ${statusFilter === 'approved' ? 'active' : ''}`}
                  onClick={() => {
                    setStatusFilter('approved');
                    setShowStatusFilter(false);
                  }}
                >
                  Approved
                </div>
                <div 
                  className={`dropdown-item ${statusFilter === 'rejected' ? 'active' : ''}`}
                  onClick={() => {
                    setStatusFilter('rejected');
                    setShowStatusFilter(false);
                  }}
                >
                  Rejected
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <p>Loading cancellation requests...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <FaExclamationCircle />
          <h3>Error Loading Requests</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            <FaSync /> Retry
          </button>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="empty-state">
          <FaInbox />
          <h3>No Cancellation Requests Found</h3>
          <p>There are currently no cancellation requests matching your search criteria.</p>
        </div>
      ) : (
        <div className="requests-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Property</th>
                <th>Reason</th>
                <th>Amount</th>
                <th>Cancellation Fee</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map(request => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaUserCircle />
                      {request.userName}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaBuilding />
                      {request.propertyName}
                    </div>
                  </td>
                  <td>{request.reason}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaDollarSign />
                      {formatAmount(request.originalAmount)}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaDollarSign />
                      {formatAmount(request.cancellationFee)}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FaCalendarAlt />
                      {formatDate(request.createdAt)}
                    </div>
                  </td>
                  <td>
                    <div className={`status ${request.status}`}>
                      {request.status === 'pending' && <FaHourglassHalf />}
                      {request.status === 'approved' && <FaCheckCircle />}
                      {request.status === 'rejected' && <FaTimesCircle />}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="view" 
                        onClick={() => handleViewDetails(request.id)}
                        title="View Details"
                      >
                        <FaSearch />
                      </button>
                      
                      {request.status === 'pending' && (
                        <>
                          <button 
                            className="approve" 
                            onClick={() => handleApprove(request.id)}
                            disabled={processing === request.id}
                            title="Approve Cancellation"
                          >
                            <FaCheckCircle />
                          </button>
                          <button 
                            className="reject" 
                            onClick={() => handleReject(request.id)}
                            disabled={processing === request.id}
                            title="Reject Cancellation"
                          >
                            <FaTimesCircle />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CancellationRequestsContainer>
  );
};

export default CancellationRequests; 
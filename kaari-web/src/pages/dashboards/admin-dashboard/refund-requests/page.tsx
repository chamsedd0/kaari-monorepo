import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { PageContainer, PageHeader, FilterBar, SearchBox, Button as AdminUIButton, Pill, IconButton } from '../../../../components/admin/AdminUI';
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
import { getRefundRequests, approveRefundRequest, rejectRefundRequest, RefundRequest } from '../../../../backend/server-actions/AdminServerActions';
import { formatDateSafe } from '../../../../utils/dates';
import AdminTableScaffold from '../../../../components/admin/AdminTableScaffold';
import { GlassCard, GlassTable, StatusBadge } from '../../../../components/admin/AdminUI';

// Styled components
const RefundRequestsContainer = styled.div`
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
  
  .pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 1.5rem;
    gap: 0.5rem;
    
    .page-button {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      border: 1px solid ${Theme.colors.tertiary};
      border-radius: ${Theme.borders.radius.sm};
      cursor: pointer;
      font: ${Theme.typography.fonts.smallB};
      
      &.active {
        background-color: ${Theme.colors.secondary};
        color: white;
        border-color: ${Theme.colors.secondary};
      }
      
      &:hover:not(.active) {
        background-color: ${Theme.colors.tertiary}40;
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        
        &:hover {
          background-color: white;
        }
      }
    }
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
      background-color: ${Theme.colors.secondary};
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

const RefundRequests: React.FC = () => {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(50);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const toast = useToastService();
  
  const fetchRefundRequests = useCallback(async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRefundRequests();
      
      // Update validation to match the actual refund request structure
      // Only filter out completely invalid requests, not ones with different structure
      const validRequests = data;

        
      // Normalize the data structure to make it consistent for display
      const normalizedRequests = validRequests.map(request => {
        // Fill in display data from available fields
        const amount = request.amount || request.requestedRefundAmount || 0;
        const userName = request.userName || 'Unknown User';
        const propertyName = request.propertyName || 'Property ' + (request.propertyId || '');
        const reason = request.reason || request.reasonsText || (request.reasons?.join(', ') || 'Not specified');
        const requestDate = request.requestDate || request.createdAt || new Date();
        
        return {
          ...request,
          amount,
          userName,
          propertyName,
          reason,
          requestDate
        };
      });
      
      setRefundRequests(prev => (reset ? normalizedRequests : [...prev, ...normalizedRequests]));
      setHasMore(normalizedRequests.length === limit);
    } catch (err: any) {
      setError(err.message || 'Failed to load refund requests');
      setRefundRequests([]); // Clear any partial data
    } finally {
      setLoading(false);
    }
  }, [limit]);
  
  useEffect(() => {
    fetchRefundRequests(true);
  }, [fetchRefundRequests]);
  
  // Define a type for our normalized refund request with guaranteed fields
  type NormalizedRefundRequest = RefundRequest & {
    userName: string;
    propertyName: string;
    amount: number;
  };

  // Filter requests based on search term and status filter
  const filteredRequests = refundRequests.filter(request => {
    // For the filter, we need to safely access potentially undefined properties
    const userName = request.userName || '';
    const propertyName = request.propertyName || '';
    
    const matchesSearch = 
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) as NormalizedRefundRequest[]; // Assert that after filtering, these fields are defined
  
  const formatDate = (date: any) => formatDateSafe(date);
  
  // Format amount with currency
  const formatAmount = (request: RefundRequest) => {
    // Try each possible amount field in order of preference
    let amount = 0;
    
    if (typeof request.requestedRefundAmount === 'number') {
      amount = request.requestedRefundAmount;
    } else if (typeof request.amount === 'number') {
      amount = request.amount;
    } else if (typeof request.originalAmount === 'number') {
      // If we only have original amount, show half of it as a fallback since refunds are usually 50%
      amount = request.originalAmount * 0.5;
    }
    
    // Ensure amount is a number (avoid NaN)
    amount = isNaN(amount) ? 0 : amount;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Get request reason display text
  const getReasonText = (request: RefundRequest) => {
    // Use the most descriptive reason available
    if (request.reason) return request.reason;
    if (request.reasonsText) return request.reasonsText; 
    if (request.reasons && request.reasons.length > 0) return request.reasons.join(', ');
    return 'Not specified';
  };
  
  // Get request date display text
  const getRequestDate = (request: RefundRequest) => {
    return formatDate(request.requestDate || request.createdAt || new Date());
  };
  
  // Handle request approval
  const handleApprove = async (id: string) => {
    try {
      setProcessing(id);
      await approveRefundRequest(id);
      toast.showToast('success', 'Refund Approved', 'The refund request has been approved successfully');
      // Refresh the list in reset mode to avoid duplicates
      await fetchRefundRequests(true);
    } catch (err: any) {
      toast.showToast('error', 'Error', err.message || 'Failed to approve refund');
    }
    finally {
      setProcessing(null);
    }
  };
  
  // Handle request rejection
  const handleReject = async (id: string) => {
    try {
      setProcessing(id);
      await rejectRefundRequest(id);
      toast.showToast('success', 'Refund Rejected', 'The refund request has been rejected');
      // Refresh the list in reset mode to avoid duplicates
      await fetchRefundRequests(true);
    } catch (err: any) {
      toast.showToast('error', 'Error', err.message || 'Failed to reject refund');
    }
    finally {
      setProcessing(null);
    }
  };
  
  // Handle view details
  const handleViewDetails = (id: string) => {
    // In a real implementation, this would navigate to a details page
    toast.showToast('info', 'View Details', `Viewing details for request ${id}`);
  };
  
  return (
    <PageContainer>
      <PageHeader title="Refund Requests" />
      <FilterBar>
        <SearchBox>
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name, property or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
        <div className="filters" style={{ display: 'flex', gap: 8 }}>
          {(['all','pending','approved','rejected'] as const).map(k => (
            <Pill key={k}
              onClick={() => setStatusFilter(k)}
              style={{
                cursor: 'pointer',
                background: statusFilter === k ? `${Theme.colors.tertiary}30` : '#fff',
                borderColor: statusFilter === k ? Theme.colors.tertiary : `${Theme.colors.tertiary}80`
              }}
            >
              {k === 'all' ? 'All' : k.charAt(0).toUpperCase() + k.slice(1)}
            </Pill>
          ))}
        </div>
      </FilterBar>

      <AdminTableScaffold
        loading={loading}
        error={error}
        isEmpty={!loading && !error && filteredRequests.length === 0}
        onRetry={() => fetchRefundRequests(true)}
        hasMore={hasMore}
        onLoadMore={() => fetchRefundRequests(false)}
      >
        {filteredRequests.length > 0 && (
          <GlassCard>
            <GlassTable>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Property</th>
                  <th>Reason</th>
                  <th>Amount</th>
                  <th>Request Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(request => {
                  const safeUserName = request.userName || 'Unknown User';
                  const safePropertyName = request.propertyName || 'Unknown Property';
                  return (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FaUserCircle />
                          {safeUserName}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FaBuilding />
                          {safePropertyName}
                        </div>
                      </td>
                      <td>{getReasonText(request)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FaDollarSign />
                          {formatAmount(request)}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FaCalendarAlt />
                          {getRequestDate(request)}
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={request.status}>
                          {request.status === 'pending' && <FaHourglassHalf />}
                          {request.status === 'approved' && <FaCheckCircle />}
                          {request.status === 'rejected' && <FaTimesCircle />}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </StatusBadge>
                      </td>
                      <td>
                        <div className="action-buttons" style={{ display: 'flex', gap: 8 }}>
                          <IconButton onClick={() => handleViewDetails(request.id)} title="View Details">
                            <FaSearch />
                          </IconButton>
                          {request.status === 'pending' && (
                            <>
                              <IconButton onClick={() => handleApprove(request.id)} disabled={processing === request.id} title="Approve Refund">
                                {processing === request.id ? <FaSpinner /> : <FaCheckCircle />}
                              </IconButton>
                              <IconButton onClick={() => handleReject(request.id)} disabled={processing === request.id} title="Reject Refund">
                                {processing === request.id ? <FaSpinner /> : <FaTimesCircle />}
                              </IconButton>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </GlassTable>
          </GlassCard>
        )}
      </AdminTableScaffold>
    </PageContainer>
  );
};

export default RefundRequests;
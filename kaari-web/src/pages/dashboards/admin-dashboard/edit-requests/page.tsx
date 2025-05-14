import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { FaSearch, FaFilter, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { getDocumentsByField } from '../../../../backend/firebase/firestore';
import { PropertyEditRequest } from '../../../../backend/models/entities';
import { approvePropertyEditRequest } from '../../../../backend/server-actions/PropertyEditRequestServerActions';
import { useToastService } from '../../../../services/ToastService';

const EditRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastService();
  
  const [editRequests, setEditRequests] = useState<PropertyEditRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  useEffect(() => {
    loadEditRequests();
  }, []);

  const loadEditRequests = async () => {
      try {
      setLoading(true);
        setError(null);
      const requests = await getDocumentsByField('propertyEditRequests', 'status', 'pending');
      setEditRequests(requests as PropertyEditRequest[]);
      } catch (err) {
        console.error('Error loading edit requests:', err);
      setError('Failed to load edit requests');
      toast.error('Failed to load edit requests');
      } finally {
      setLoading(false);
      }
    };

  const handleApproveRequest = async (requestId: string) => {
    try {
      const result = await approvePropertyEditRequest(requestId);
      if (result.success) {
        toast.success('Edit request approved');
        // Navigate to the property edit page with the requested changes
        navigate(`/dashboard/admin/properties/edit/${result.propertyId}`, {
          state: { requestedChanges: result.requestedChanges }
        });
      }
    } catch (err) {
      console.error('Error approving edit request:', err);
      toast.error('Failed to approve edit request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      // Implement reject logic here
      toast.success('Edit request rejected');
      await loadEditRequests(); // Reload the list
    } catch (err) {
      console.error('Error rejecting edit request:', err);
      toast.error('Failed to reject edit request');
    }
  };

  const filteredRequests = editRequests.filter(request => {
    const matchesSearch = 
      request.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.propertyId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <EditRequestsPageContainer>
      <h1>Property Edit Requests</h1>
      
      <div className="filter-bar">
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search by property title or ID" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <div className="filter-dropdown">
            <div className="filter-button" onClick={() => setShowStatusFilter(!showStatusFilter)}>
              <FaFilter />
              <span>Status: {filterStatus === 'all' ? 'All' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}</span>
            </div>
            
            {showStatusFilter && (
              <div className="dropdown-content">
                <div 
                  className={`dropdown-item ${filterStatus === 'all' ? 'active' : ''}`}
                  onClick={() => {
                    setFilterStatus('all');
                    setShowStatusFilter(false);
                  }}
                >
                  All
                </div>
                <div 
                  className={`dropdown-item ${filterStatus === 'pending' ? 'active' : ''}`}
                  onClick={() => {
                    setFilterStatus('pending');
                    setShowStatusFilter(false);
                  }}
                >
                  Pending
        </div>
                <div 
                  className={`dropdown-item ${filterStatus === 'approved' ? 'active' : ''}`}
                  onClick={() => {
                    setFilterStatus('approved');
                    setShowStatusFilter(false);
                  }}
                >
                  Approved
                </div>
                <div 
                  className={`dropdown-item ${filterStatus === 'rejected' ? 'active' : ''}`}
                  onClick={() => {
                    setFilterStatus('rejected');
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
          <p>Loading edit requests...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={loadEditRequests} className="retry-button">
            Retry
          </button>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="empty-state">
          <p>No edit requests found matching your criteria.</p>
        </div>
      ) : (
        <div className="requests-list">
          {filteredRequests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-info">
                <h3>{request.propertyTitle}</h3>
                <p className="requester">Requested by: {request.requesterName}</p>
                <p className="timestamp">
                  {new Date(request.createdAt).toLocaleDateString()} at{' '}
                  {new Date(request.createdAt).toLocaleTimeString()}
                </p>
                
                <div className="changes-summary">
                  <h4>Requested Changes:</h4>
                  <ul>
                    {Object.entries(request.requestedChanges).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {JSON.stringify(value)}
                      </li>
                        ))}
                  </ul>
                    </div>
                  
                  {request.additionalComments && (
                  <div className="comments">
                      <h4>Additional Comments:</h4>
                    <p>{request.additionalComments}</p>
                  </div>
                )}
              </div>

              <div className="request-actions">
                <button 
                  className="approve-button"
                  onClick={() => handleApproveRequest(request.id)}
                  title="Approve Request"
                >
                  <FaCheck /> Approve
                </button>
                <button 
                  className="reject-button"
                  onClick={() => handleRejectRequest(request.id)}
                  title="Reject Request"
                >
                  <FaTimes /> Reject
                </button>
                </div>
            </div>
          ))}
        </div>
      )}
    </EditRequestsPageContainer>
  );
};

const EditRequestsPageContainer = styled.div`
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

  .loading-state {
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
  }
  
  .error-state {
    text-align: center;
    padding: 2rem;
    color: ${Theme.colors.error};
    
    .retry-button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background-color: ${Theme.colors.secondary};
      color: white;
      border: none;
      border-radius: ${Theme.borders.radius.sm};
      cursor: pointer;
      
      &:hover {
        background-color: ${Theme.colors.secondaryDark};
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: ${Theme.colors.gray2};
    background-color: white;
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
  }
  
  .requests-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    
    .request-card {
      background-color: white;
      border-radius: ${Theme.borders.radius.lg};
      padding: 1.5rem;
      display: flex;
      gap: 2rem;

      .request-info {
        flex: 1;

        h3 {
          font: ${Theme.typography.fonts.mediumB};
          margin-bottom: 0.5rem;
      }
      
        .requester {
          color: ${Theme.colors.gray2};
          font: ${Theme.typography.fonts.smallM};
          margin-bottom: 0.25rem;
        }

        .timestamp {
          color: ${Theme.colors.gray2};
          font: ${Theme.typography.fonts.smallM};
          margin-bottom: 1rem;
        }

        .changes-summary {
          margin-bottom: 1rem;

          h4 {
            font: ${Theme.typography.fonts.smallB};
            margin-bottom: 0.5rem;
          }

          ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
              font: ${Theme.typography.fonts.smallM};
              margin-bottom: 0.25rem;

              strong {
                color: ${Theme.colors.gray2};
              }
            }
          }
        }

        .comments {
          h4 {
            font: ${Theme.typography.fonts.smallB};
            margin-bottom: 0.5rem;
          }
          
          p {
            font: ${Theme.typography.fonts.smallM};
            color: ${Theme.colors.gray2};
          }
        }
          }
          
      .request-actions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 120px;

        button {
            display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: none;
          border-radius: ${Theme.borders.radius.sm};
          cursor: pointer;
          font: ${Theme.typography.fonts.smallB};

          &.approve-button {
            background-color: ${Theme.colors.success}20;
            color: ${Theme.colors.success};

            &:hover {
              background-color: ${Theme.colors.success};
              color: white;
          }
        }
        
          &.reject-button {
            background-color: ${Theme.colors.error}20;
            color: ${Theme.colors.error};

            &:hover {
              background-color: ${Theme.colors.error};
              color: white;
            }
          }
        }
      }
    }
  }
`;

export default EditRequestsPage; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageContainer, PageHeader, GlassCard, Pill, IconButton, Button as AdminUIButton } from '../../../../components/admin/AdminUI';
import { Theme } from '../../../../theme/theme';
import { FaSearch, FaFilter, FaCheck, FaTimes, FaSpinner, FaPaw, FaSmoking } from 'react-icons/fa';
import { ImWoman } from 'react-icons/im';
import { BiGroup } from 'react-icons/bi';
import { getDocumentsByField } from '../../../../backend/firebase/firestore';
import { 
  PropertyEditRequest,
  getAllPendingEditRequests, 
  updateEditRequestStatus,
  approvePropertyEditRequest
} from '../../../../backend/server-actions/PropertyEditRequestServerActions';
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
      toast.showToast('error', 'Error', 'Failed to load edit requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      const result = await approvePropertyEditRequest(requestId);
      if (result.success) {
        toast.showToast('success', 'Success', 'Edit request approved');
        // Navigate to the property edit page with the requested changes
        navigate(`/dashboard/admin/properties/edit/${result.propertyId}`, {
          state: { 
            requestedChanges: {
              ...result.requestedChanges,
              // Pass separate properties for different types of changes
              amenities: result.requestedChanges.amenities || [],
              features: result.requestedChanges.features || [],
              // Add housing preference if in comments
              housingPreference: result.requestedChanges.additionalComments?.includes('Housing Preference: womenOnly') 
                ? 'womenOnly' 
                : result.requestedChanges.additionalComments?.includes('Housing Preference: familiesOnly')
                ? 'familiesOnly'
                : undefined,
              // Extract rules from comments
              petsAllowed: result.requestedChanges.additionalComments?.includes('petsAllowed') || undefined,
              smokingAllowed: result.requestedChanges.additionalComments?.includes('smokingAllowed') || undefined,
            }
          }
        });
      }
    } catch (err) {
      console.error('Error approving edit request:', err);
      toast.showToast('error', 'Error', 'Failed to approve edit request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      // Implement reject logic here
      toast.showToast('success', 'Success', 'Edit request rejected');
      await loadEditRequests(); // Reload the list
    } catch (err) {
      console.error('Error rejecting edit request:', err);
      toast.showToast('error', 'Error', 'Failed to reject edit request');
    }
  };

  const filteredRequests = editRequests.filter(request => {
    const matchesSearch = 
      request.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.propertyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.propertyTitle && request.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Helper function to format and categorize changes
  const formatChanges = (request: PropertyEditRequest) => {
    const changes: { type: string, items: string[] }[] = [];
    
    // Add amenities
    if (request.additionalAmenities && request.additionalAmenities.length > 0) {
      changes.push({
        type: 'Amenities',
        items: request.additionalAmenities
      });
    }
    
    // Add features
    if (request.features && request.features.length > 0) {
      changes.push({
        type: 'Features',
        items: request.features
      });
    }
    
    // Extract housing preference from comments
    const comments = request.additionalComments || '';
    
    if (comments.includes('Housing Preference:')) {
      const housingPref = comments.includes('womenOnly') 
        ? ['Women Only'] 
        : comments.includes('familiesOnly') 
        ? ['Families Only'] 
        : [];
      
      if (housingPref.length > 0) {
        changes.push({
          type: 'Housing Preference',
          items: housingPref
        });
      }
    }
    
    // Extract rules from comments
    if (comments.includes('Rules:')) {
      const rules = [];
      if (comments.includes('petsAllowed')) rules.push('Pets Allowed');
      if (comments.includes('smokingAllowed')) rules.push('Smoking Allowed');
      
      if (rules.length > 0) {
        changes.push({
          type: 'Rules',
          items: rules
        });
      }
    }
    
    return changes;
  };
  
  // Get icon for a specific change type and item
  const getChangeIcon = (type: string, item: string) => {
    if (type === 'Housing Preference') {
      if (item === 'Women Only') return <ImWoman />;
      if (item === 'Families Only') return <BiGroup />;
    }
    
    if (type === 'Rules') {
      if (item === 'Pets Allowed') return <FaPaw />;
      if (item === 'Smoking Allowed') return <FaSmoking />;
    }
    
    return null;
  };
  
  // Extract clean comments (without special tags)
  const getCleanComments = (comments: string) => {
    if (!comments) return '';
    
    return comments
      .replace(/Housing Preference: \w+/g, '')
      .replace(/Rules: [\w, ]+/g, '')
      .trim();
  };

  return (
    <PageContainer>
      <PageHeader title="Property Edit Requests" />
      <GlassCard>
    <EditRequestsPageContainer>
      
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
        
        <div className="filters" style={{ display: 'flex', gap: 8 }}>
          {(['all','pending','approved','rejected'] as const).map(k => (
            <Pill key={k}
              onClick={() => setFilterStatus(k)}
              style={{
                cursor: 'pointer',
                background: filterStatus === k ? `${Theme.colors.tertiary}30` : Theme.colors.white,
                borderColor: filterStatus === k ? Theme.colors.tertiary : `${Theme.colors.tertiary}80`
              }}
            >
              {k === 'all' ? 'All' : k.charAt(0).toUpperCase() + k.slice(1)}
            </Pill>
          ))}
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
                <h3>{request.propertyTitle || 'Property Edit Request'}</h3>
                <p className="requester">Requested by: {request.requesterName || request.requesterId}</p>
                <p className="timestamp">
                  {new Date(request.createdAt).toLocaleDateString()} at{' '}
                  {new Date(request.createdAt).toLocaleTimeString()}
                </p>
                
                <div className="changes-summary">
                  <h4>Requested Changes:</h4>
                  
                  {formatChanges(request).length > 0 ? (
                    <div className="changes-grid">
                      {formatChanges(request).map((change, idx) => (
                        <div key={idx} className="change-category">
                          <h5>{change.type}</h5>
                          <ul>
                            {change.items.map((item, itemIdx) => (
                              <li key={itemIdx}>
                                {getChangeIcon(change.type, item)} {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-changes">No specific changes requested</p>
                  )}
                </div>
                
                <div className="comments">
                  <h4>Additional Comments:</h4>
                  <p>{getCleanComments(request.additionalComments || '') || 'No additional comments'}</p>
                </div>
              </div>

              <div className="request-actions" style={{ display: 'flex', gap: 8 }}>
                <AdminUIButton $variant="default" onClick={() => handleApproveRequest(request.id)} title="Approve Request">
                  <FaCheck /> Approve
                </AdminUIButton>
                <AdminUIButton $variant="destructive" onClick={() => handleRejectRequest(request.id)} title="Reject Request">
                  <FaTimes /> Reject
                </AdminUIButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </EditRequestsPageContainer>
      </GlassCard>
    </PageContainer>
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
        background-color: ${Theme.colors.secondary};
        opacity: 0.8;
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
          
          .changes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
            
            .change-category {
              h5 {
                font: ${Theme.typography.fonts.smallB};
                color: ${Theme.colors.gray2};
                margin-bottom: 0.25rem;
              }
              
              ul {
                list-style: none;
                padding: 0;
                margin: 0;
                
                li {
                  font: ${Theme.typography.fonts.smallM};
                  margin-bottom: 0.25rem;
                  display: flex;
                  align-items: center;
                  gap: 0.25rem;
                  
                  svg {
                    color: ${Theme.colors.secondary};
                    font-size: 1rem;
                  }
                }
              }
            }
          }
          
          .no-changes {
            font: ${Theme.typography.fonts.smallM};
            color: ${Theme.colors.gray2};
            font-style: italic;
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
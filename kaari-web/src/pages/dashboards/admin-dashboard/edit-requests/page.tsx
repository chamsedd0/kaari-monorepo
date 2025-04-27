import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { 
  getAllPendingEditRequests, 
  updateEditRequestStatus, 
  PropertyEditRequest 
} from '../../../../backend/server-actions/PropertyEditRequestServerActions';
import { PurpleButtonSM32 } from '../../../../components/skeletons/buttons/purple_SM32';
import { WhiteButtonSM32 } from '../../../../components/skeletons/buttons/white_SM32';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

const EditRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<PropertyEditRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setIsLoading(true);
        const pendingRequests = await getAllPendingEditRequests();
        setRequests(pendingRequests);
        setError(null);
      } catch (err) {
        console.error('Error loading edit requests:', err);
        setError('Failed to load edit requests. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  const handleApprove = async (requestId: string) => {
    try {
      setProcessingRequestId(requestId);
      await updateEditRequestStatus(requestId, 'approved', responseText);
      
      // Update local state
      setRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
      
      setResponseText('');
      setExpandedRequestId(null);
    } catch (error) {
      console.error('Error approving request:', error);
      setError('Failed to approve request. Please try again.');
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setProcessingRequestId(requestId);
      await updateEditRequestStatus(requestId, 'rejected', responseText);
      
      // Update local state
      setRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
      
      setResponseText('');
      setExpandedRequestId(null);
    } catch (error) {
      console.error('Error rejecting request:', error);
      setError('Failed to reject request. Please try again.');
    } finally {
      setProcessingRequestId(null);
    }
  };

  const toggleExpandRequest = (requestId: string) => {
    setExpandedRequestId(prevId => prevId === requestId ? null : requestId);
    setResponseText('');
  };

  return (
    <EditRequestsPageStyle>
      <h1 className="page-title">Property Edit Requests</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {isLoading ? (
        <div className="loading-spinner">
          <FaSpinner className="spinner-icon" />
          Loading edit requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="no-requests-message">
          No pending edit requests found.
        </div>
      ) : (
        <div className="requests-container">
          {requests.map(request => (
            <div 
              key={request.id} 
              className={`request-card ${expandedRequestId === request.id ? 'expanded' : ''}`}
            >
              <div className="request-header" onClick={() => toggleExpandRequest(request.id)}>
                <div className="property-info">
                  <h3>{request.propertyTitle}</h3>
                  <p>Requested by: {request.requesterName}</p>
                  <p className="request-date">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="request-preview">
                  {request.additionalAmenities.length > 0 && (
                    <span className="change-item">
                      {request.additionalAmenities.length} amenities
                    </span>
                  )}
                  {request.includedFees.length > 0 && (
                    <span className="change-item">
                      {request.includedFees.length} fees
                    </span>
                  )}
                  {request.additionalComments && (
                    <span className="change-item">Has comments</span>
                  )}
                </div>
              </div>
              
              {expandedRequestId === request.id && (
                <div className="request-details">
                  {request.additionalAmenities.length > 0 && (
                    <div className="detail-section">
                      <h4>Additional Amenities:</h4>
                      <div className="tags-container">
                        {request.additionalAmenities.map(amenity => (
                          <span key={amenity} className="tag">{amenity}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {request.includedFees.length > 0 && (
                    <div className="detail-section">
                      <h4>Included Fees:</h4>
                      <div className="tags-container">
                        {request.includedFees.map(fee => (
                          <span key={fee} className="tag">{fee}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {request.additionalComments && (
                    <div className="detail-section">
                      <h4>Additional Comments:</h4>
                      <p className="comments">{request.additionalComments}</p>
                    </div>
                  )}
                  
                  <div className="response-section">
                    <h4>Admin Response:</h4>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Optional: Add a response message..."
                      rows={3}
                    />
                    
                    <div className="action-buttons">
                      <WhiteButtonSM32
                        text="Reject"
                        onClick={() => handleReject(request.id)}
                        disabled={processingRequestId === request.id}
                      />
                      <PurpleButtonSM32
                        text="Approve"
                        onClick={() => handleApprove(request.id)}
                        disabled={processingRequestId === request.id}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </EditRequestsPageStyle>
  );
};

const EditRequestsPageStyle = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  
  .page-title {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
    margin-bottom: 24px;
  }
  
  .error-message {
    padding: 12px 16px;
    background-color: rgba(255, 99, 71, 0.1);
    border-left: 4px solid tomato;
    color: tomato;
    border-radius: 4px;
    margin-bottom: 16px;
  }
  
  .loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    color: ${Theme.colors.gray2};
    font: ${Theme.typography.fonts.mediumM};
    
    .spinner-icon {
      animation: spin 1s linear infinite;
      margin-right: 12px;
      font-size: 20px;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  }
  
  .no-requests-message {
    padding: 24px;
    background-color: ${Theme.colors.fifth};
    color: ${Theme.colors.gray2};
    font: ${Theme.typography.fonts.mediumM};
    text-align: center;
    border-radius: 8px;
    margin-bottom: 16px;
  }
  
  .requests-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .request-card {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      transition: all 0.3s ease;
      
      &.expanded {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }
      
      .request-header {
        padding: 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        border-bottom: 1px solid transparent;
        
        .property-info {
          h3 {
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.black};
            margin-bottom: 4px;
          }
          
          p {
            font: ${Theme.typography.fonts.smallM};
            color: ${Theme.colors.gray2};
            margin: 0;
          }
          
          .request-date {
            color: ${Theme.colors.gray};
            font-size: 12px;
            margin-top: 4px;
          }
        }
        
        .request-preview {
          display: flex;
          gap: 8px;
          
          .change-item {
            background-color: ${Theme.colors.fifth};
            color: ${Theme.colors.secondary};
            padding: 4px 8px;
            border-radius: 16px;
            font-size: 12px;
          }
        }
      }
      
      &.expanded .request-header {
        border-bottom: 1px solid ${Theme.colors.fifth};
      }
      
      .request-details {
        padding: 20px;
        
        .detail-section {
          margin-bottom: 20px;
          
          h4 {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.black};
            margin-bottom: 8px;
          }
          
          .tags-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            
            .tag {
              background-color: ${Theme.colors.fifth};
              color: ${Theme.colors.secondary};
              padding: 6px 12px;
              border-radius: 16px;
              font-size: 14px;
            }
          }
          
          .comments {
            background-color: ${Theme.colors.fifth};
            padding: 12px;
            border-radius: 8px;
            margin: 0;
            white-space: pre-wrap;
          }
        }
        
        .response-section {
          h4 {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.black};
            margin-bottom: 8px;
          }
          
          textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid ${Theme.colors.tertiary};
            border-radius: 8px;
            resize: vertical;
            font: ${Theme.typography.fonts.mediumM};
            margin-bottom: 16px;
            
            &:focus {
              outline: none;
              border-color: ${Theme.colors.secondary};
            }
          }
          
          .action-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }
        }
      }
    }
  }
`;

export default EditRequestsPage; 
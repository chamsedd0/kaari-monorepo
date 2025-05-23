import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCheck, FaTimes, FaEye, FaPaw, FaSmoking } from 'react-icons/fa';
import { ImWoman } from 'react-icons/im';
import { Theme } from '../../../../theme/theme';

import { 
  PropertyEditRequest, 
  getAllPendingEditRequests, 
  updateEditRequestStatus,
  approvePropertyEditRequest
} from '../../../../backend/server-actions/PropertyEditRequestServerActions';

const PropertyEditRequestsPage: React.FC = () => {
  const [editRequests, setEditRequests] = useState<PropertyEditRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<PropertyEditRequest | null>(null);
  const [adminResponse, setAdminResponse] = useState<string>('');
  const navigate = useNavigate();

  // Fetch all pending edit requests
  useEffect(() => {
    const fetchEditRequests = async () => {
      try {
        setLoading(true);
        setSuccessMessage(null);
        const requests = await getAllPendingEditRequests();
        setEditRequests(requests);
        setError(null);
      } catch (err) {
        setError('Failed to load edit requests. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEditRequests();
  }, []);

  // Handle request approval
  const handleApprove = async (requestId: string) => {
    try {
      // Get the request before it's removed from state
      const request = editRequests.find(req => req.id === requestId);
      
      const result = await approvePropertyEditRequest(requestId);
      if (result.success) {
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
        
        // Update local state
        setEditRequests(editRequests.filter(req => req.id !== requestId));
        setSelectedRequest(null);
        setAdminResponse('');
        
        // Set success message
        if (request) {
          setSuccessMessage(
            `Changes for "${request.propertyTitle}" have been approved. You will be redirected to edit the property.`
          );
        }
      }
    } catch (err) {
      setError('Failed to approve request. Please try again.');
      console.error(err);
    }
  };

  // Handle request rejection
  const handleReject = async (requestId: string) => {
    try {
      await updateEditRequestStatus(requestId, 'rejected', adminResponse);
      
      // Update local state
      setEditRequests(editRequests.filter(req => req.id !== requestId));
      setSelectedRequest(null);
      setAdminResponse('');
    } catch (err) {
      setError('Failed to reject request. Please try again.');
      console.error(err);
    }
  };

  // View property details
  const viewProperty = (propertyId: string) => {
    navigate(`/dashboard/admin/properties/edit/${propertyId}`);
  };

  // Helper function to categorize and display changes
  const formatRequestedChanges = (request: PropertyEditRequest) => {
    const categories = [
      { 
        title: 'Amenities', 
        items: request.additionalAmenities || [],
        icon: null 
      },
      { 
        title: 'Features', 
        items: request.features || [],
        icon: null 
      }
    ];
    
    // Extract housing preference and rules from comments
    const comments = request.additionalComments || '';
    
    // Check for housing preferences
    if (comments.includes('Housing Preference: womenOnly')) {
      categories.push({
        title: 'Housing Preference',
        items: ['Women Only'],
        icon: null
      });
    } else if (comments.includes('Housing Preference: familiesOnly')) {
      categories.push({
        title: 'Housing Preference',
        items: ['Families Only'],
        icon: null
      });
    }
    
    // Check for rules
    const rules: string[] = [];
    if (comments.includes('Rules:')) {
      if (comments.includes('petsAllowed')) {
        rules.push('Pets Allowed');
      }
      if (comments.includes('smokingAllowed')) {
        rules.push('Smoking Allowed');
      }
    }
    
    if (rules.length > 0) {
      categories.push({
        title: 'Rules',
        items: rules,
        icon: null
      });
    }
    
    // Filter out any empty categories
    return categories.filter(cat => cat.items.length > 0);
  };
  
  // Get cleaned comments without the special tags
  const getCleanedComments = (comments: string) => {
    if (!comments) return '';
    
    return comments
      .replace(/Housing Preference: \w+/g, '')
      .replace(/Rules: [\w, ]+/g, '')
      .trim();
  };

  return (
    <Container>
      <h1>Property Edit Requests</h1>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      
      {loading ? (
        <LoadingMessage>Loading edit requests...</LoadingMessage>
      ) : editRequests.length === 0 ? (
        <NoRequests>No pending edit requests found.</NoRequests>
      ) : (
        <Content>
          <RequestsList>
            {editRequests.map(request => (
              <RequestCard 
                key={request.id}
                $isSelected={selectedRequest?.id === request.id}
                onClick={() => setSelectedRequest(request)}
              >
                <PropertyTitle>{request.propertyTitle}</PropertyTitle>
                <RequesterInfo>Requested by: {request.requesterName}</RequesterInfo>
                <RequestDate>
                  {new Date(request.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </RequestDate>
                <ViewPropertyButton onClick={(e) => {
                  e.stopPropagation();
                  viewProperty(request.propertyId);
                }}>
                  <FaEye /> View Property
                </ViewPropertyButton>
              </RequestCard>
            ))}
          </RequestsList>
          
          {selectedRequest && (
            <RequestDetails>
              <h2>{selectedRequest.propertyTitle}</h2>
              <DetailSection>
                <h3>Request Details</h3>
                <DetailItem>
                  <Label>Requester:</Label>
                  <Value>{selectedRequest.requesterName}</Value>
                </DetailItem>
                <DetailItem>
                  <Label>Date Requested:</Label>
                  <Value>
                    {new Date(selectedRequest.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Value>
                </DetailItem>
                
                {formatRequestedChanges(selectedRequest).map((category, idx) => (
                  <DetailItem key={idx}>
                    <Label>{category.title}:</Label>
                    {category.items.length > 0 ? (
                      <ItemList>
                        {category.items.map((item, index) => (
                          <li key={index}>
                            {category.icon} {item}
                          </li>
                        ))}
                      </ItemList>
                    ) : (
                      <Value>None specified</Value>
                    )}
                  </DetailItem>
                ))}
                
                <DetailItem>
                  <Label>Additional Comments:</Label>
                  <Value>{getCleanedComments(selectedRequest.additionalComments) || 'None'}</Value>
                </DetailItem>
              </DetailSection>
              
              <AdminResponseSection>
                <h3>Admin Response</h3>
                <ResponseTextarea 
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Enter your response to the requester (optional)"
                />
                
                <ActionButtons>
                  <ApproveButton onClick={() => handleApprove(selectedRequest.id)}>
                    <FaCheck /> Approve Request
                  </ApproveButton>
                  <RejectButton onClick={() => handleReject(selectedRequest.id)}>
                    <FaTimes /> Reject Request
                  </RejectButton>
                </ActionButtons>
              </AdminResponseSection>
            </RequestDetails>
          )}
        </Content>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 20px;
`;

const ErrorMessage = styled.div`
  background-color: #fff1f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const SuccessMessage = styled.div`
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
  color: #8c8c8c;
`;

const NoRequests = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
  color: #8c8c8c;
  font-style: italic;
`;

const Content = styled.div`
  display: flex;
  gap: 30px;
  min-height: 500px;
`;

const RequestsList = styled.div`
  flex: 0 0 300px;
  overflow-y: auto;
  border-right: 1px solid #e8e8e8;
  padding-right: 20px;
`;

const RequestCard = styled.div<{ $isSelected: boolean }>`
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  background-color: ${props => props.$isSelected ? '#e6f7ff' : '#fff'};
  border: 1px solid ${props => props.$isSelected ? '#91d5ff' : '#e8e8e8'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.$isSelected ? '#e6f7ff' : '#f9f9f9'};
    border-color: ${props => props.$isSelected ? '#91d5ff' : '#d9d9d9'};
  }
`;

const PropertyTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
`;

const RequesterInfo = styled.div`
  font-size: 14px;
  color: #595959;
  margin-bottom: 5px;
`;

const RequestDate = styled.div`
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 10px;
`;

const ViewPropertyButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background-color: transparent;
  border: 1px solid #d9d9d9;
  color: #595959;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: #f5f5f5;
    border-color: #8c8c8c;
  }
`;

const RequestDetails = styled.div`
  flex: 1;
  padding: 0 10px;
  
  h2 {
    margin-top: 0;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
    color: #262626;
  }
  
  h3 {
    margin-top: 0;
    font-size: 16px;
    color: #595959;
  }
`;

const DetailSection = styled.div`
  margin-bottom: 30px;
`;

const DetailItem = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.div`
  font-weight: 600;
  margin-bottom: 5px;
  color: #8c8c8c;
  font-size: 14px;
`;

const Value = styled.div`
  color: #262626;
`;

const ItemList = styled.ul`
  margin: 5px 0;
  padding-left: 20px;
  
  li {
    margin-bottom: 3px;
    display: flex;
    align-items: center;
  }
`;

const AdminResponseSection = styled.div`
  margin-top: 20px;
`;

const ResponseTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-bottom: 15px;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
`;

const ApproveButton = styled(ActionButton)`
  background-color: #52c41a;
  color: white;
  
  &:hover {
    background-color: #389e0d;
  }
`;

const RejectButton = styled(ActionButton)`
  background-color: #ff4d4f;
  color: white;
  
  &:hover {
    background-color: #cf1322;
  }
`;

export default PropertyEditRequestsPage; 
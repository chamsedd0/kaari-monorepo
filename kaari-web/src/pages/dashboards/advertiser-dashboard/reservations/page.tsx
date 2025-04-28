import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { FaSearch } from 'react-icons/fa';
import { getAdvertiserReservationRequests, approveReservationRequest, rejectReservationRequest } from '../../../../backend/server-actions/AdvertiserServerActions';
import { ReservationsTable } from '../../../../components/reservations/ReservationsTable';

const ReservationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #f9fafc;
  min-height: 100vh;
  padding: 32px;
  
  .page-title {
    font: ${Theme.typography.fonts.h3B};
    color: ${Theme.colors.black};
    margin-bottom: 1.5rem;
  }
  
  .page-description {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};
    margin-bottom: 2rem;
  }
  
  .filters-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
    
    .filters {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      
      .filter-button {
        padding: 0.5rem 1rem;
        border-radius: ${Theme.borders.radius.md};
        font: ${Theme.typography.fonts.smallB};
        background-color: ${Theme.colors.white};
        color: ${Theme.colors.gray2};
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &.active {
          background-color: ${Theme.colors.secondary};
          color: white;
        }
        
        &:hover:not(.active) {
          background-color: ${Theme.colors.tertiary};
        }
      }
    }
    
    .select-container {
      position: relative;
      margin-right: 1rem;
      
      select {
        padding: 0.5rem 1rem;
        border-radius: ${Theme.borders.radius.md};
        font: ${Theme.typography.fonts.smallM};
        border: 1px solid ${Theme.colors.gray5};
        background-color: white;
        width: 180px;
        appearance: none;
        background-position: right 10px center;
        background-repeat: no-repeat;
        background-size: 12px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23718096'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
        
        &:focus {
          outline: none;
          border-color: ${Theme.colors.secondary};
        }
      }
    }
    
    .search-container {
      position: relative;
      
      .search-input {
        padding: 0.5rem 1rem 0.5rem 2.5rem;
        border-radius: ${Theme.borders.radius.md};
        font: ${Theme.typography.fonts.smallM};
        border: 1px solid ${Theme.colors.gray5};
        background-color: white;
        width: 250px;
        
        &:focus {
          outline: none;
          border-color: ${Theme.colors.secondary};
        }
      }
      
      .search-icon {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: ${Theme.colors.gray2};
      }
    }
  }
  
  .no-reservations {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
    background-color: white;
    border-radius: ${Theme.borders.radius.md};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    
    .empty-title {
      font: ${Theme.typography.fonts.h4B};
      color: ${Theme.colors.black};
      margin-bottom: 0.5rem;
    }
    
    .empty-message {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.gray2};
    }
  }
`;

interface Reservation {
  reservation: {
    id: string;
    userId: string;
    requestType: string;
    status: 'pending' | 'accepted' | 'rejected' | 'completed';
    message: string;
    createdAt: Date;
    updatedAt: Date;
    scheduledDate?: Date;
  };
  listing?: {
    id: string;
    title: string;
    price: number;
  } | null;
  property?: {
    id: string;
    title: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    price: number;
    occupants?: number;
  } | null;
  client?: {
    id: string;
    name: string;
    surname?: string;
    email: string;
    phoneNumber?: string;
    profilePicture?: string;
    age?: string;
  } | null;
}

const ReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [applicantFilter, setApplicantFilter] = useState<string>('All Applicants');
  const [propertyFilter, setPropertyFilter] = useState<string>('All Properties');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  
  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await getAdvertiserReservationRequests();
      setReservations(data);
      setError(null);
    } catch (err: any) {
      console.error('Error loading reservations:', err);
      setError(err.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      setProcessingRequest(requestId);
      await approveReservationRequest(requestId);
      await loadReservations();
    } catch (err: any) {
      console.error('Error approving request:', err);
      setError(err.message || 'Failed to approve request. Please try again.');
    } finally {
      setProcessingRequest(null);
    }
  };
  
  const handleReject = async (requestId: string) => {
    try {
      setProcessingRequest(requestId);
      await rejectReservationRequest(requestId);
      await loadReservations();
    } catch (err: any) {
      console.error('Error rejecting request:', err);
      setError(err.message || 'Failed to reject request. Please try again.');
    } finally {
      setProcessingRequest(null);
    }
  };
  
  // Get unique applicant names for filter
  const uniqueApplicants = ['All Applicants', ...new Set(
    reservations
      .filter(res => res.client)
      .map(res => `${res.client?.name || ''} ${res.client?.surname || ''}`.trim())
  )];
  
  // Get unique property titles for filter
  const uniqueProperties = ['All Properties', ...new Set(
    reservations
      .filter(res => res.property)
      .map(res => res.property?.title || 'Unknown Property')
  )];
  
  // Filter reservations
  let filteredReservations = reservations;
  
  // Apply status filter
  if (statusFilter !== 'all') {
    filteredReservations = filteredReservations.filter(res => 
      res.reservation.status === statusFilter
    );
  }
  
  // Apply applicant filter
  if (applicantFilter !== 'All Applicants') {
    filteredReservations = filteredReservations.filter(res => 
      `${res.client?.name || ''} ${res.client?.surname || ''}`.trim() === applicantFilter
    );
  }
  
  // Apply property filter
  if (propertyFilter !== 'All Properties') {
    filteredReservations = filteredReservations.filter(res => 
      (res.property?.title || 'Unknown Property') === propertyFilter
    );
  }
  
  // Apply search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredReservations = filteredReservations.filter(res => 
      (res.client?.name || '').toLowerCase().includes(query) ||
      (res.client?.surname || '').toLowerCase().includes(query) ||
      (res.client?.email || '').toLowerCase().includes(query) ||
      (res.property?.title || '').toLowerCase().includes(query) ||
      (res.property?.address?.street || '').toLowerCase().includes(query) ||
      (res.property?.address?.city || '').toLowerCase().includes(query)
    );
  }
  
  if (loading) {
    return <div>Loading reservation requests...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ReservationsContainer>
      <h1 className="page-title">Reservation requests</h1>
      
      <div className="filters-container">
        <div className="filters">
          <button 
            className={`filter-button ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-button ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-button ${statusFilter === 'accepted' ? 'active' : ''}`}
            onClick={() => setStatusFilter('accepted')}
          >
            Accepted
          </button>
          <button 
            className={`filter-button ${statusFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected
          </button>
        </div>
        
        <div className="select-container">
          <select 
            value={applicantFilter} 
            onChange={(e) => setApplicantFilter(e.target.value)}
          >
            {uniqueApplicants.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        
        <div className="select-container">
          <select 
            value={propertyFilter} 
            onChange={(e) => setPropertyFilter(e.target.value)}
          >
            {uniqueProperties.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search reservations..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredReservations.length === 0 ? (
        <div className="no-reservations">
          <h2 className="empty-title">No Reservation Requests Found</h2>
          <p className="empty-message">
            {statusFilter === 'all' 
              ? "You don't have any reservation requests yet."
              : `You don't have any ${statusFilter} reservation requests.`}
          </p>
        </div>
      ) : (
        <ReservationsTable 
          reservations={filteredReservations}
          onApprove={handleApprove}
          onReject={handleReject}
          isProcessing={processingRequest}
        />
      )}
    </ReservationsContainer>
  );
};

export default ReservationsPage;

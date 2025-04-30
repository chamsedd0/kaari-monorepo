import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import { getAdvertiserReservationRequests, approveReservationRequest, rejectReservationRequest } from '../../../../backend/server-actions/AdvertiserServerActions';
import { ReservationDetailsModal } from '../../../../components/reservations/ReservationDetailsModal';
import EmptyBox from '../../../../assets/images/emptybox.svg';
import SelectFieldBaseModelVariant2 from '../../../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2';

const ReservationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: white;
  min-height: 100vh;
  padding: 32px;
  
  .page-title {
    font: ${Theme.typography.fonts.h3B};
    color: ${Theme.colors.black};
    margin-bottom: 1.5rem;
  }
  
  .filters-row {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 1.5rem;
    gap: 1rem;
    
    > div {
      width: 180px;
    }
  }
  
  .reservations-table-container {
    background-color: white;
    border-radius: ${Theme.borders.radius.lg};
    overflow: hidden;
    border: ${Theme.borders.primary};
  }
  
  .reservations-table {
    width: 100%;
    border-collapse: collapse;
    
    th {
      text-align: left;
      padding: 16px;
      font: ${Theme.typography.fonts.smallB};
    color: ${Theme.colors.gray2};
      background-color: #f9fafc;
      border-bottom: 1px solid ${Theme.colors.gray5};
    }
    
    td {
      padding: 16px;
      font: ${Theme.typography.fonts.smallM};
      color: ${Theme.colors.black};
      border-bottom: 1px solid ${Theme.colors.gray5};
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    tr:hover {
      background-color: #f9fafc;
    }
  }
  
  .applicant-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .info-icon {
      color: ${Theme.colors.gray3};
      cursor: pointer;
      margin-left: 5px;
      
      &:hover {
        color: ${Theme.colors.secondary};
      }
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
    
    button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      
      &.approve {
        background-color: #1db954;
        color: white;
        
        &:hover {
          background-color: #19a449;
        }
        
        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
      
      &.reject {
        background-color: #e74c3c;
        color: white;
        
        &:hover {
          background-color: #c0392b;
        }
        
        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }
  }
  
  .status-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    
    &.pending {
      background-color: #fff3e0;
      color: #ff9800;
    }
    
    &.accepted {
      background-color: #e8f5e9;
      color: #1db954;
    }
    
    &.rejected {
      background-color: #fdecec;
      color: #e74c3c;
    }
    
    &.completed {
      background-color: #e8eaf6;
      color: #3f51b5;
    }
  }
  
  .remaining-hours {
    font-weight: 500;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px;
    text-align: center;
    background-color: white;
    border-radius: ${Theme.borders.radius.lg};
    
    img {
      width: 80px;
      margin-bottom: 20px;
    }
    
    .empty-title {
      font: ${Theme.typography.fonts.h4B};
      margin-bottom: 12px;
      color: ${Theme.colors.black};
    }
    
    .empty-description {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.gray2};
      max-width: 400px;
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
    numPeople?: string;
    movingDate?: Date;
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
  const [statusFilter, setStatusFilter] = useState<string>('All');
    const [applicantFilter, setApplicantFilter] = useState<string>('All Applicants');
    const [propertyFilter, setPropertyFilter] = useState<string>('All Properties');
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
  
  // Filter reservations - now show all requests and apply status filter
  let filteredReservations = reservations;
  
  // Apply status filter
  if (statusFilter !== 'All') {
    filteredReservations = filteredReservations.filter(res => 
      res.reservation.status === statusFilter.toLowerCase()
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
  
  // Format date (DD/MM/YYYY)
  const formatDate = (date: Date | undefined | string) => {
    if (!date) return 'N/A';
    
    let dateObj: Date;
    
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'object' && 'seconds' in (date as any)) {
      // Handle Firestore timestamp
      dateObj = new Date((date as any).seconds * 1000);
    } else {
      dateObj = new Date(date);
    }
    
    if (isNaN(dateObj.getTime())) return 'N/A';
    
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  };
  
  // Calculate 24 hours remaining
  const getRemainingHours = (createdDate: Date | undefined | string) => {
    if (!createdDate) return 'N/A';
    
    let dateObj: Date;
    
    if (createdDate instanceof Date) {
      dateObj = createdDate;
    } else if (typeof createdDate === 'object' && 'seconds' in (createdDate as any)) {
      // Handle Firestore timestamp
      dateObj = new Date((createdDate as any).seconds * 1000);
    } else {
      dateObj = new Date(createdDate);
    }
    
    if (isNaN(dateObj.getTime())) return 'N/A';
    
    // 24 hours response window
    const deadlineTime = dateObj.getTime() + (24 * 60 * 60 * 1000);
    const currentTime = new Date().getTime();
    
    if (currentTime > deadlineTime) {
      return 'Expired';
    }
    
    const hoursLeft = Math.round((deadlineTime - currentTime) / (60 * 60 * 1000));
    return `${hoursLeft}h remaining`;
  };
  
  const openDetailsModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
  };
  
  if (loading) {
    return <div>Loading reservation requests...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }

    return (
    <ReservationsContainer>
      <h1 className="page-title">Reservation requests</h1>
      
      <div className="filters-row">
        <SelectFieldBaseModelVariant2
          options={['All', 'Pending', 'Accepted', 'Rejected', 'Completed']}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
        />
        
        <SelectFieldBaseModelVariant2
          options={uniqueApplicants}
            value={applicantFilter} 
          onChange={(value) => setApplicantFilter(value)}
        />
        
        <SelectFieldBaseModelVariant2
          options={uniqueProperties}
            value={propertyFilter} 
          onChange={(value) => setPropertyFilter(value)}
        />
            </div>
      
      {filteredReservations.length === 0 ? (
        <div className="empty-state">
          <img src={EmptyBox} alt="No reservations" />
          <h2 className="empty-title">No Reservation Requests Found</h2>
          <p className="empty-description">
            {statusFilter === 'All'
              ? "You don't have any reservation requests at the moment."
              : `You don't have any ${statusFilter.toLowerCase()} reservation requests.`}
          </p>
        </div>
      ) : (
        <div className="reservations-table-container">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Property</th>
                <th>Applied</th>
                <th>Occupants</th>
                <th>Move-in date</th>
                <th>24 Hours</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((reservation) => (
                <tr key={reservation.reservation.id}>
                  <td>
                    <div className="applicant-cell">
                      <img 
                        src={reservation.client?.profilePicture || "https://via.placeholder.com/40"} 
                        alt={`${reservation.client?.name || 'Unknown'}`} 
                      />
                      <span>
                        {reservation.client ? `${reservation.client.name || ''} ${reservation.client.surname || ''}`.trim() : 'Unknown'}
                        {reservation.client?.age && `, ${reservation.client.age}`}
                      </span>
                      <FaInfoCircle 
                        className="info-icon" 
                        onClick={() => openDetailsModal(reservation)} 
                        title="View details"
                      />
                    </div>
                  </td>
                  <td>
                    {reservation.property?.title || 'Unknown Property'}
                  </td>
                  <td>
                    {formatDate(reservation.reservation.createdAt)}
                  </td>
                  <td>
                    {reservation.reservation.numPeople || '1'}
                  </td>
                  <td>
                    {formatDate(reservation.reservation.movingDate || reservation.reservation.scheduledDate)}
                  </td>
                  <td className="remaining-hours">
                    {reservation.reservation.status === 'pending' ? 
                      getRemainingHours(reservation.reservation.createdAt) : '-'}
                  </td>
                  <td>
                    <span className={`status-badge ${reservation.reservation.status}`}>
                      {reservation.reservation.status.charAt(0).toUpperCase() + reservation.reservation.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {reservation.reservation.status === 'pending' ? (
                      <div className="action-buttons">
                        <button 
                          className="approve"
                          onClick={() => handleApprove(reservation.reservation.id)}
                          disabled={processingRequest === reservation.reservation.id}
                          title="Approve"
                        >
                          <FaCheckCircle size={20} />
                        </button>
                        <button 
                          className="reject"
                          onClick={() => handleReject(reservation.reservation.id)}
                          disabled={processingRequest === reservation.reservation.id}
                          title="Reject"
                        >
                          <FaTimesCircle size={20} />
                        </button>
                      </div>
                    ) : (
                      <div>-</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {selectedReservation && (
        <ReservationDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          reservation={selectedReservation}
          onApprove={handleApprove}
          onReject={handleReject}
          isProcessing={processingRequest}
        />
      )}
    </ReservationsContainer>
    );
};

export default ReservationsPage;

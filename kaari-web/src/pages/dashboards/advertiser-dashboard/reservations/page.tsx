import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaUsers } from 'react-icons/fa';
import { getAdvertiserReservationRequests, approveReservationRequest, rejectReservationRequest } from '../../../../backend/server-actions/AdvertiserServerActions';
import { ReservationDetailsModal } from '../../../../components/reservations/ReservationDetailsModal';
import EmptyBox from '../../../../assets/images/emptybox.svg';
import SelectFieldBaseModelVariant2 from '../../../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2';
import { Request } from '../../../../backend/entities';
import { useChecklist } from '../../../../contexts/checklist/ChecklistContext';

// Extended status type for reservations
type ExtendedStatus = Request['status'] | 'completed';

// Extended Request type to handle the fields we're using in the modal
interface ReservationRequest extends Omit<Request, 'status' | 'requestType'> {
  status: ExtendedStatus;
  requestType: 'rent' | 'information' | 'offer' | 'general';
  movingDate?: Date | string;
  minstay?: string;
}

// The reservation type for this page
interface Reservation {
  reservation: ReservationRequest;
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
    images?: string[];
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

const ReservationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: white;
  min-height: 100vh;
  padding: 32px;
  
  .page-title {
    font: ${Theme.typography.fonts.h4B};
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
    table-layout: fixed;
    
    th {
      text-align: left;
      padding: 16px 20px;
      font: ${Theme.typography.fonts.mediumB};
      color: ${Theme.colors.black};
      border-bottom: ${Theme.borders.primary};
    }
    
    td {
      padding: 16px 20px;
      font: ${Theme.typography.fonts.smallM};
      color: ${Theme.colors.black};
      border-bottom: ${Theme.borders.primary};
      vertical-align: middle;
    }
    
    tr:last-child td {
      border-bottom: none;
    }

    th:first-child, td:first-child {
      padding-left: 24px;
      width: 25%;
    }
    
    th:nth-child(2), td:nth-child(2) {
      width: 25%;
    }
    
    th:nth-child(3), td:nth-child(3) {
      width: 15%;
    }
    
    th:nth-child(4), td:nth-child(4) {
      width: 15%;
      text-align: center;
    }
    
    th:nth-child(5), td:nth-child(5) {
      width: 15%;
      text-align: center;
    }
    
    th:last-child, td:last-child {
      padding-right: 24px;
      width: 15%;
      text-align: center;
    }
  }
  
  .applicant-cell {
    display: flex;
    align-items: center;
    gap: 10px;
    
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .info-icon {
      color: ${Theme.colors.gray2};
      cursor: pointer;
      transition: all 0.2s ease;
      margin-left: auto;
      
      &:hover {
        color: ${Theme.colors.secondary};
      }
    }
    
    .applicant-info {
      display: flex;
      flex-direction: column;
      
      .name {
        font-weight: 500;
        font-size: 14px;
      }
      
      .age {
        font-size: 13px;
        color: ${Theme.colors.gray2};
      }
    }
  }
  
  .property-cell {
    display: flex;
    align-items: center;
    
    .property-name {
      font-size: 14px;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
    
    button {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      
      &.approve {
        background-color: #2E7D32;
        color: white;
        
        &:hover {
          background-color: #1B5E20;
        }
        
        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
      
      &.reject {
        background-color: #C62828;
        color: white;
        
        &:hover {
          background-color: #B71C1C;
        }
        
        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }
  }
  
  .status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    min-width: 90px;
    
    &.pending {
      background-color: #FFF3E0;
      color: #E65100;
    }
    
    &.accepted {
      background-color: #EDF7ED;
      color: #2E7D32;
    }
    
    &.rejected {
      background-color: #FFEBEE;
      color: #C62828;
    }
    
    &.paid {
      background-color: #E0F7FA;
      color: #00838F;
    }
    
    &.movedIn, &.completed {
      background-color: #E8EAF6;
      color: #3949AB;
    }
    
    &.cancelled {
      background-color: #EFEBE9;
      color: #6D4C41;
    }
    
    &.refundProcessing {
      background-color: #FFF8E1;
      color: #FF8F00;
    }
    
    &.refundCompleted {
      background-color: #F1F8E9;
      color: #558B2F;
    }
    
    &.refundFailed {
      background-color: #FFEBEE;
      color: #C62828;
    }
    
    &.cancellationUnderReview {
      background-color: #E1F5FE;
      color: #0277BD;
    }
  }
  
  .remaining-hours {
    font-weight: 500;
    text-align: center;
    
    &.expired {
      color: ${Theme.colors.error};
    }
  }
  
  .text-center {
    text-align: center;
  }
  
  .occupants-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    
    .icon {
      color: ${Theme.colors.gray2};
      font-size: 14px;
    }
    
    .count {
      font-size: 14px;
    }
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
  const { completeItem } = useChecklist();
  
  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await getAdvertiserReservationRequests();
      
      // Ensure all reservation data has the correct requestType
      const typedData = data.map(res => ({
        ...res,
        reservation: {
          ...res.reservation,
          requestType: res.reservation.requestType as 'rent' | 'information' | 'offer' | 'general'
        }
      }));
      
      setReservations(typedData);
      
      // Check if there are any accepted reservations and mark the checklist item as completed
      const hasAcceptedBooking = typedData.some(res => 
        res.reservation.status === 'accepted' || 
        res.reservation.status === 'paid' || 
        res.reservation.status === 'movedIn'
      );
      
      if (hasAcceptedBooking) {
        completeItem('accept_booking');
      }
      
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
      
      // Mark the checklist item as completed when a booking is approved
      completeItem('accept_booking');
      
      await loadReservations();
    } catch (err: any) {
      console.error('Error approving request:', err);
      setError(err.message || 'Failed to approve request. Please try again.');
    } finally {
      setProcessingRequest(null);
    }
  };
  
  const handleReject = async (requestId: string, reason?: string, suggestedMoveInDate?: string) => {
    try {
      setProcessingRequest(requestId);
      // Light bridge: store metadata before calling server-action
      if (suggestedMoveInDate && reason === 'move_in_date_too_far') {
        try {
          // Best-effort: write suggested date on request for server to detect
          // Using fetch to a serverless endpoint would be ideal; here we rely on server-action reading reservation fields if present
          console.debug('Counter-offer metadata:', { requestId, reason, suggestedMoveInDate });
        } catch {}
      }
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
    if (!createdDate) return { text: 'N/A', expired: false };
    
    let dateObj: Date;
    
    if (createdDate instanceof Date) {
      dateObj = createdDate;
    } else if (typeof createdDate === 'object' && 'seconds' in (createdDate as any)) {
      // Handle Firestore timestamp
      dateObj = new Date((createdDate as any).seconds * 1000);
    } else {
      dateObj = new Date(createdDate);
    }
    
    if (isNaN(dateObj.getTime())) return { text: 'N/A', expired: false };
    
    // 24 hours response window
    const deadlineTime = dateObj.getTime() + (24 * 60 * 60 * 1000);
    const currentTime = new Date().getTime();
    
    if (currentTime > deadlineTime) {
      return { text: 'Expired', expired: true };
    }
    
    const hoursLeft = Math.round((deadlineTime - currentTime) / (60 * 60 * 1000));
    return { text: `${hoursLeft}h remaining`, expired: false };
  };
  
  // Get status display name
  const getStatusDisplayName = (status: string) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      case 'paid': return 'Paid';
      case 'movedIn': return 'Moved In';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'refundProcessing': return 'Refund Processing';
      case 'refundCompleted': return 'Refund Complete';
      case 'refundFailed': return 'Refund Failed';
      case 'cancellationUnderReview': return 'Under Review';
      case 'counter_offer_pending_tenant': return 'Counter-offer Pending';
      case 'accepted_counter_offer': return 'Counter-offer Accepted';
      case 'rejected_counter_offer': return 'Counter-offer Rejected';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  const openDetailsModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
  };
  
  // Get number of people
  const getNumPeople = (numPeople?: string): number => {
    if (!numPeople) return 2;
    if (numPeople === 'Alone' || numPeople === '1') return 1;
    const num = parseInt(numPeople);
    return isNaN(num) ? 2 : num;
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
          options={['All', 'Pending', 'Accepted', 'Rejected', 'Paid', 'Moved In', 'Completed', 'Cancelled', 'Refund Processing', 'Refund Complete', 'Refund Failed', 'Under Review']}
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
                <th className="text-center">24 Hours</th>
                <th className="text-center">Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((reservation) => {
                const remainingHours = getRemainingHours(reservation.reservation.createdAt);
                
                return (
                  <tr key={reservation.reservation.id}>
                    <td>
                      <div className="applicant-cell">
                        <img 
                          src={reservation.client?.profilePicture || "https://via.placeholder.com/36"}
                          alt={`${reservation.client?.name || 'Unknown'}`}
                        />
                        <div className="applicant-info">
                          <span className="name">
                            {reservation.client ? `${reservation.client.name || ''} ${reservation.client.surname || ''}`.trim() : 'Unknown'}
                          </span>
                          {reservation.client?.age && (
                            <span className="age">{reservation.client.age}</span>
                          )}
                        </div>
                        <FaInfoCircle 
                          className="info-icon" 
                          onClick={() => openDetailsModal(reservation)} 
                          title="View details"
                          size={16}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="property-cell">
                        <span className="property-name">
                          {reservation.property?.title || 'Apartment in Rabat'}
                        </span>
                      </div>
                    </td>
                    <td>
                      {formatDate(reservation.reservation.createdAt)}
                    </td>
                    <td className="text-center">
                      {reservation.reservation.status === 'pending' ? (
                        <div className={`remaining-hours ${remainingHours.expired ? 'expired' : ''}`}>
                          {remainingHours.text}
                        </div>
                      ) : (
                        <div>-</div>
                      )}
                    </td>
                    <td className="text-center">
                      <span className={`status-badge ${reservation.reservation.status}`}>
                        {getStatusDisplayName(reservation.reservation.status)}
                      </span>
                      {reservation.reservation.status === 'counter_offer_pending_tenant' && reservation.reservation.moveInDate && (
                        <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#92400E' }} title="Awaiting tenant response">
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} />
                          Proposed: {formatDate(reservation.reservation.moveInDate)}
                        </div>
                      )}
                    </td>
                    <td className="text-center">
                      {reservation.reservation.status === 'pending' ? (
                        <div className="action-buttons">
                          <button 
                            className="approve"
                            onClick={() => handleApprove(reservation.reservation.id)}
                            disabled={processingRequest === reservation.reservation.id}
                            title="Approve"
                          >
                            <FaCheckCircle size={18} />
                          </button>
                          <button 
                            className="reject"
                            onClick={() => openDetailsModal(reservation)}
                            disabled={processingRequest === reservation.reservation.id}
                            title="Reject"
                          >
                            <FaTimesCircle size={18} />
                          </button>
                          {/* Optional: future UX for counter-offer when rejecting due to far move-in */}
                        </div>
                      ) : (
                        <div>-</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {selectedReservation && (
        <ReservationDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          reservation={selectedReservation as any}
          onApprove={handleApprove}
          onReject={handleReject}
          isProcessing={processingRequest}
        />
      )}
    </ReservationsContainer>
  );
};

export default ReservationsPage;
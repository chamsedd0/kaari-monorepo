import React, { useEffect, useState } from 'react';
import { ReservationsStyle } from './styles';
import SelectFieldBaseModelVariant2 from '../../../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2';
import profilePlaceholder from '../../../../assets/images/kaariLogoPurplePic.png';
import propertyPlaceholder from '../../../../assets/images/BigCityPic0.png';
import checkIcon from '../../../../components/skeletons/icons/Check-Icon.svg';
import crossIcon from '../../../../components/skeletons/icons/Cross-Icon.svg';
import { 
    getAdvertiserReservationRequests, 
    approveReservationRequest, 
    rejectReservationRequest 
} from '../../../../backend/server-actions/AdvertiserServerActions';
import { Request, Listing, Property, User } from '../../../../backend/entities';

interface ReservationWithDetails {
    reservation: Request;
    listing?: Listing | null;
    property?: Property | null;
    client?: User | null;
}

const ReservationsPage: React.FC = () => {
    const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [processingRequest, setProcessingRequest] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(true);
    const [applicantFilter, setApplicantFilter] = useState<string>('All Applicants');
    const [propertyFilter, setPropertyFilter] = useState<string>('All Properties');

    const loadReservations = async () => {
        try {
            const data = await getAdvertiserReservationRequests();
            setReservations(data);
            setError(null);
        } catch (err) {
            console.error('Error loading reservations:', err);
            setError('Failed to load reservations. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReservations();
    }, []);

    // Unique applicants and properties for dropdowns
    const applicantOptions = ['All Applicants', ...Array.from(new Set(reservations.map(res => res.client ? `${res.client.name} ${res.client.surname || ''}` : 'Unknown User')))].filter(Boolean);
    const propertyOptions = ['All Properties', ...Array.from(new Set(reservations.map(res => res.property?.title || 'Unknown Property')))].filter(Boolean);

    // Filtering logic
    let filteredReservations = reservations;
    if (statusFilter !== 'All') {
        filteredReservations = filteredReservations.filter(res => res.reservation.status === statusFilter.toLowerCase());
    }
    if (applicantFilter !== 'All Applicants') {
        filteredReservations = filteredReservations.filter(res => (res.client ? `${res.client.name} ${res.client.surname || ''}` : 'Unknown User') === applicantFilter);
    }
    if (propertyFilter !== 'All Properties') {
        filteredReservations = filteredReservations.filter(res => (res.property?.title || 'Unknown Property') === propertyFilter);
    }

    const handleStatusChange = (status: string) => {
        setStatusFilter(status);
    };
    const handleApplicantChange = (applicant: string) => {
        setApplicantFilter(applicant);
    };
    const handlePropertyChange = (property: string) => {
        setPropertyFilter(property);
    };

    const handleApprove = async (requestId: string) => {
        try {
            setProcessingRequest(requestId);
            await approveReservationRequest(requestId);
            await loadReservations();
        } catch (err) {
            console.error('Error approving request:', err);
            setError('Failed to approve request. Please try again.');
        } finally {
            setProcessingRequest(null);
        }
    };
    const handleReject = async (requestId: string) => {
        try {
            setProcessingRequest(requestId);
            await rejectReservationRequest(requestId);
            await loadReservations();
        } catch (err) {
            console.error('Error rejecting request:', err);
            setError('Failed to reject request. Please try again.');
        } finally {
            setProcessingRequest(null);
        }
    };

    const formatDate = (date: Date | undefined) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-GB');
    };

    // 24h remaining logic
    const get24hRemaining = (createdAt: Date | undefined) => {
        if (!createdAt) return 'N/A';
        const now = new Date();
        const created = new Date(createdAt);
        const diffMs = created.getTime() + 24 * 60 * 60 * 1000 - now.getTime();
        if (diffMs <= 0) return '0h remaining';
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        return `${hours}h remaining`;
    };

    return (
        <ReservationsStyle>
            <h1 className="section-title">Reservation requests</h1>
            <div className="pending-requests">
                <div className="field-container">
                    <SelectFieldBaseModelVariant2
                        placeholder='All Applicants'
                        options={applicantOptions}
                        value={applicantFilter}
                        onChange={handleApplicantChange}
                    />
                    <SelectFieldBaseModelVariant2
                        placeholder='All Properties'
                        options={propertyOptions}
                        value={propertyFilter}
                        onChange={handlePropertyChange}
                    />
                </div>
            </div>
            {loading ? (
                <div className="loading">Loading reservations...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <div className="border-container">
                    <table className="reservations-table">
                        <thead>
                            <tr>
                                <th>Applicant</th>
                                <th>Property</th>
                                <th>Applied</th>
                                <th>Occupants</th>
                                <th>Move-in Date</th>
                                <th>24 Hours</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.map((res) => (
                                <tr key={res.reservation.id}>
                                    <td>
                                        <div className="applicant-info">
                                            <img src={res.client?.profilePicture || profilePlaceholder} alt="Applicant" />
                                            <span className="applicant-name">
                                                {res.client ? `${res.client.name} ${res.client.surname || ''}` : 'Unknown User'}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="property-info">
                                            <img src={res.property?.images[0] || propertyPlaceholder} alt="Property" />
                                            <span className="property-name">{res.property?.title || 'Unknown Property'}</span>
                                        </div>
                                    </td>
                                    <td className="applied">{formatDate(res.reservation.createdAt)}</td>
                                    <td className="occupants">{(res.reservation as any).occupants || '-'}</td>
                                    <td className="move-in-date">{formatDate(res.reservation.scheduledDate)}</td>
                                    <td className="hours-remaining">{get24hRemaining(res.reservation.createdAt)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            {res.reservation.status === 'pending' ? (
                                                <>
                                                    <div 
                                                        className={`approve-button ${processingRequest === res.reservation.id ? 'processing' : ''}`}
                                                        onClick={() => handleApprove(res.reservation.id)}
                                                    >
                                                        <img src={checkIcon} alt="Check" />
                                                    </div>
                                                    <div 
                                                        className={`reject-button ${processingRequest === res.reservation.id ? 'processing' : ''}`}
                                                        onClick={() => handleReject(res.reservation.id)}
                                                    >
                                                        <img src={crossIcon} alt="Cross" />
                                                    </div>
                                                </>
                                            ) : (
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '6px 16px',
                                                    borderRadius: '16px',
                                                    fontWeight: 600,
                                                    color: res.reservation.status === 'accepted' ? '#fff' : '#fff',
                                                    background: res.reservation.status === 'accepted' ? '#1db954' : '#b80000',
                                                }}>
                                                    {res.reservation.status === 'accepted' ? 'Approved' :
                                                     res.reservation.status === 'rejected' ? 'Rejected' :
                                                     res.reservation.status.charAt(0).toUpperCase() + res.reservation.status.slice(1)}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </ReservationsStyle>
    );
};

export default ReservationsPage;

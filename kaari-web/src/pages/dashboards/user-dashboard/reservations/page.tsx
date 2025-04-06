import React, { useEffect, useState } from 'react';
import LatestRequestCard from '../../../../components/skeletons/cards/latest-request-card';
import { ReservationsTable } from '../../../../components/styles/constructed/reservations/ReservationsTable';
import { ReservationsStyle } from './styles';
import { getClientReservations } from '../../../../backend/server-actions/ClientServerActions';
import { useStore } from '../../../../backend/store';
import { Request, Listing, Property, User } from '../../../../backend/entities';

interface ReservationWithDetails {
  reservation: Request;
  listing?: Listing | null;
  property?: Property | null;
  advertiser?: User | null;
}

const ReservationsPage: React.FC = () => {
    const { user } = useStore();
    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const loadReservations = async () => {
            setLoading(true);
            try {
                const data = await getClientReservations();
                setReservations(data);
                setError(null);
            } catch (err) {
                console.error('Error loading reservations:', err);
                setError('Failed to load reservations. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        loadReservations();
    }, [user?.id]);
    
    // Get pending reservations (for top cards)
    const pendingReservations = reservations.filter(
        res => res.reservation.status === 'pending'
    );
    
    // Get the two most recent pending reservations for display at the top
    const recentPendingReservations = pendingReservations
        .sort((a, b) => 
            new Date(b.reservation.createdAt).getTime() - 
            new Date(a.reservation.createdAt).getTime()
        )
        .slice(0, 2);
    
    return (
        <ReservationsStyle>
            <h1 className="section-title">Reservations</h1>
            
            {loading ? (
                <div className="loading">Loading your reservations...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <>
                    <div className="pending-requests">
                        {recentPendingReservations.length > 0 ? (
                            recentPendingReservations.map((res, index) => (
                                <div key={res.reservation.id} className="request-card">
                                    <LatestRequestCard  
                                        title={`${res.property?.title || 'Property'} - `} 
                                        price={`${res.listing?.price || 0} ${res.listing?.listingType === 'rent' ? 'per Month' : ''}`} 
                                        date={res.reservation.scheduledDate ? 
                                            new Date(res.reservation.scheduledDate).toLocaleDateString('en-US', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            }) : 'No date'
                                        }  
                                        timer={true} 
                                        details={res.property?.description?.substring(0, 50) || 'No description'} 
                                        status={res.reservation.status === 'pending' ? 'Pending' : 
                                                res.reservation.status === 'accepted' ? 'Approved' : 'Declined'} 
                                        image={res.property?.images[0] || ''} 
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="no-pending">
                                <p>No pending reservations found.</p>
                            </div>
                        )}
                    </div>

                    <ReservationsTable reservations={reservations} />
                </>
            )}
        </ReservationsStyle>
    );
};

export default ReservationsPage;

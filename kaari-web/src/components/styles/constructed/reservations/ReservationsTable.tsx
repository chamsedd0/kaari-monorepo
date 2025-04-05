import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { Request, Listing, Property, User } from '../../../../backend/entities';

interface ReservationWithDetails {
  reservation: Request;
  listing?: Listing | null;
  property?: Property | null;
  advertiser?: User | null;
}

interface ReservationsTableProps {
  reservations: ReservationWithDetails[];
}

export const ReservationsTableStyle = styled.div`
    width: 100%;
    padding: 24px;
    background: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    margin-top: 20px;

    h2 {
        font: ${Theme.typography.fonts.h4B};
        color: ${Theme.colors.black};
        margin-bottom: 24px;
    }

    .table-header {
        display: grid;
        grid-template-columns: 2fr 1.5fr 1fr 1fr 0.5fr 0.5fr;
        padding: 12px 16px;
        border-bottom: 1px solid ${Theme.colors.gray5};

        span {
            font: ${Theme.typography.fonts.text14};
            color: ${Theme.colors.gray2};
        }
    }

    .table-row {
        display: grid;
        grid-template-columns: 2fr 1.5fr 1fr 1fr 0.5fr 0.5fr;
        padding: 16px;
        align-items: center;
        border-bottom: 1px solid ${Theme.colors.gray5};

        .property-name {
            font: ${Theme.typography.fonts.text16};
            color: ${Theme.colors.black};
        }

        .advertiser {
            display: flex;
            align-items: center;
            gap: 8px;

            img {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                object-fit: cover;
            }

            span {
                font: ${Theme.typography.fonts.text14};
                color: ${Theme.colors.black};
            }
        }

        .check-in {
            font: ${Theme.typography.fonts.text14};
            color: ${Theme.colors.gray2};
        }

        .status {
            padding: 4px 12px;
            border-radius: 16px;
            font: ${Theme.typography.fonts.smallB};
            width: fit-content;

            &.pending {
                background: ${Theme.colors.info};
                color: ${Theme.colors.white};
            }

            &.approved {
                background: ${Theme.colors.success};
                color: ${Theme.colors.white};
            }

            &.declined {
                background: ${Theme.colors.error};
                color: ${Theme.colors.white};
            }
        }

        .fee {
            font: ${Theme.typography.fonts.text14};
            color: ${Theme.colors.black};
        }

        .details-button {
            padding: 6px 12px;
            border: 1px solid ${Theme.colors.gray5};
            border-radius: ${Theme.borders.radius.md};
            background: transparent;
            font: ${Theme.typography.fonts.text14};
            color: ${Theme.colors.black};
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                background: ${Theme.colors.gray6};
            }
        }
    }
    
    .no-data {
        padding: 32px 16px;
        text-align: center;
        color: ${Theme.colors.gray2};
        font: ${Theme.typography.fonts.text16};
    }
`;

export const ReservationsTable: React.FC<ReservationsTableProps> = ({ reservations }) => {
    // Sort reservations by scheduled date
    const sortedReservations = [...reservations].sort((a, b) => {
        const dateA = a.reservation.scheduledDate ? new Date(a.reservation.scheduledDate).getTime() : 0;
        const dateB = b.reservation.scheduledDate ? new Date(b.reservation.scheduledDate).getTime() : 0;
        return dateB - dateA; // Sort by most recent first
    });
    
    const getStatusClass = (status: string): string => {
        switch (status) {
            case 'pending': return 'pending';
            case 'accepted': return 'approved';
            case 'rejected': return 'declined';
            default: return 'pending';
        }
    };
    
    const getStatusText = (status: string): string => {
        switch (status) {
            case 'pending': return 'Pending';
            case 'accepted': return 'Approved';
            case 'rejected': return 'Declined';
            default: return 'Pending';
        }
    };
    
    return (
        <ReservationsTableStyle>
            <h2>All Reservations</h2>
            
            {sortedReservations.length > 0 ? (
                <>
                    <div className="table-header">
                        <span>Property Name</span>
                        <span>Advertiser</span>
                        <span>Check-in</span>
                        <span>Status</span>
                        <span>Fee</span>
                        <span></span>
                    </div>
                    
                    {sortedReservations.map((res) => (
                        <div key={res.reservation.id} className="table-row">
                            <div className="property-name">
                                {res.property?.title || 'Unknown Property'}
                            </div>
                            <div className="advertiser">
                                <img 
                                    src={res.advertiser?.profilePicture || "https://via.placeholder.com/32"} 
                                    alt={res.advertiser?.name || 'Advertiser'} 
                                />
                                <span>{res.advertiser?.name || 'Unknown'}</span>
                            </div>
                            <div className="check-in">
                                {res.reservation.scheduledDate ? 
                                    new Date(res.reservation.scheduledDate).toLocaleDateString('en-US', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    }) : 'No date'
                                }
                            </div>
                            <div className={`status ${getStatusClass(res.reservation.status)}`}>
                                {getStatusText(res.reservation.status)}
                            </div>
                            <div className="fee">
                                {res.listing ? `$${res.listing.price}` : '$0'}
                            </div>
                            <button className="details-button">Details</button>
                        </div>
                    ))}
                </>
            ) : (
                <div className="no-data">No reservations found</div>
            )}
        </ReservationsTableStyle>
    );
}; 
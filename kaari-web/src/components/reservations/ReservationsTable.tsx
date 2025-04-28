import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Request, Property, User } from '../../backend/entities';

interface ReservationWithDetails {
  reservation: Request;
  property?: Property | null;
  client?: User | null;
}

interface ReservationsTableProps {
  reservations: ReservationWithDetails[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isProcessing: boolean | string | null;
}

const ReservationsTableStyle = styled.div`
    width: 100%;
    padding: 0;
    background: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    overflow: hidden;

    h2 {
        font: ${Theme.typography.fonts.h4B};
        color: ${Theme.colors.black};
        padding: 24px;
        margin: 0;
        border-bottom: 1px solid ${Theme.colors.gray5};
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    thead tr {
        background-color: #F9FAFC;
    }

    th {
        text-align: left;
        padding: 16px 24px;
        font: ${Theme.typography.fonts.smallB};
        color: ${Theme.colors.gray2};
    }

    td {
        padding: 16px 24px;
        border-bottom: 1px solid ${Theme.colors.gray5};
        font: ${Theme.typography.fonts.smallM};
        color: ${Theme.colors.black};
        vertical-align: middle;
    }

    tr:last-child td {
        border-bottom: none;
    }

    .applicant {
        display: flex;
        align-items: center;
        gap: 12px;

        img {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            object-fit: cover;
        }

        .initials {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background-color: ${Theme.colors.tertiary};
            display: flex;
            align-items: center;
            justify-content: center;
            font: ${Theme.typography.fonts.smallB};
            color: ${Theme.colors.gray2};
        }
    }

    .hour-indicator {
        font: ${Theme.typography.fonts.smallB};
            color: ${Theme.colors.black};
        }

    .action-buttons {
        display: flex;
        align-items: center;
        gap: 8px;

        button {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: none;
            
            &.approve {
                background-color: ${Theme.colors.success};
                color: white;
                
                &:hover {
                    background-color: #1e994c;
                }
                
                &:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            }
            
            &.reject {
                background-color: ${Theme.colors.error};
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
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 600;
        
        &.accepted {
            background-color: #E6F5F0;
            color: ${Theme.colors.success};
        }
        
        &.rejected {
            background-color: #FDECEC;
            color: ${Theme.colors.error};
        }
        
        &.completed {
            background-color: #EEE6FD;
            color: ${Theme.colors.secondary};
        }
    }
`;

export const ReservationsTable: React.FC<ReservationsTableProps> = ({ 
    reservations, 
    onApprove, 
    onReject,
    isProcessing 
}) => {
    // Sort reservations by scheduled date
    const sortedReservations = [...reservations].sort((a, b) => {
        const dateA = a.reservation.createdAt ? new Date(a.reservation.createdAt).getTime() : 0;
        const dateB = b.reservation.createdAt ? new Date(b.reservation.createdAt).getTime() : 0;
        return dateB - dateA; // Sort by most recent first
    });

    // Get client initials for avatar
    const getClientInitials = (client: User | null | undefined) => {
        if (!client) return '?';
        const firstInitial = client.name ? client.name.charAt(0).toUpperCase() : '?';
        const lastInitial = client.surname ? client.surname.charAt(0).toUpperCase() : '';
        return `${firstInitial}${lastInitial}`;
    };

    // Format date for display
    const formatDate = (date: Date | undefined | string) => {
        if (!date) return 'N/A';
        
        try {
            let dateObj: Date;
            
            // Check if it's already a Date object
            if (date instanceof Date) {
                dateObj = date;
            }
            // Check if it's a Firestore timestamp (has seconds and nanoseconds)
            else if (typeof date === 'object' && 'seconds' in date && 'nanoseconds' in date) {
                dateObj = new Date(date.seconds * 1000);
            }
            // Handle string or any other format
            else {
                dateObj = new Date(date);
            }
            
            // Check if the date is valid
            if (isNaN(dateObj.getTime())) {
                return 'Invalid Date';
            }
            
            return dateObj.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error, date);
            return 'Invalid Date';
        }
    };

    // Get hours remaining for payment (24h)
    const get24hRemaining = (updatedAt: Date | undefined | string) => {
        if (!updatedAt) return 'N/A';
        
        try {
            let updated: Date;
            
            // Check if it's already a Date object
            if (updatedAt instanceof Date) {
                updated = updatedAt;
            }
            // Check if it's a Firestore timestamp (has seconds and nanoseconds)
            else if (typeof updatedAt === 'object' && 'seconds' in updatedAt && 'nanoseconds' in updatedAt) {
                updated = new Date(updatedAt.seconds * 1000);
            }
            // Handle string or any other format
            else {
                updated = new Date(updatedAt);
            }
            
            // Check if the date is valid
            if (isNaN(updated.getTime())) {
                return 'Invalid Date';
            }
            
            const now = new Date();
            const diffMs = updated.getTime() + 24 * 60 * 60 * 1000 - now.getTime();
            
            if (diffMs <= 0) return '0h';
            
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            return `${hours}h remaining`;
        } catch (error) {
            console.error('Error calculating time remaining:', error, updatedAt);
            return 'N/A';
        }
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        if (status === 'accepted') {
            return <span className="status-badge accepted">Approved</span>;
        } else if (status === 'rejected') {
            return <span className="status-badge rejected">Rejected</span>;
        } else if (status === 'completed') {
            return <span className="status-badge completed">Completed</span>;
        }
        return null;
    };

    return (
        <ReservationsTableStyle>
            <h2>Reservation requests</h2>
            
            <table>
                <thead>
                    <tr>
                        <th>Applicant</th>
                        <th>Property</th>
                        <th>Applied</th>
                        <th>Occupants</th>
                        <th>Move-in date</th>
                        <th>24 Hours</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedReservations.map((res) => (
                        <tr key={res.reservation.id}>
                            <td>
                                <div className="applicant">
                                    {res.client?.profilePicture ? (
                                        <img src={res.client.profilePicture} alt={res.client.name} />
                                    ) : (
                                        <div className="initials">{getClientInitials(res.client)}</div>
                                    )}
                                    <span>{res.client?.name || 'Unknown'}, {res.client?.age || 20}</span>
            </div>
                            </td>
                            <td>{res.property?.title || 'Apartment - flat in Agadir'}</td>
                            <td>{formatDate(res.reservation.createdAt)}</td>
                            <td>{res.property?.occupants || 2}</td>
                            <td>{formatDate(res.reservation.scheduledDate || res.reservation.createdAt)}</td>
                            <td className="hour-indicator">
                                {res.reservation.status === 'accepted' ? 
                                    get24hRemaining(res.reservation.updatedAt) : ''}
                            </td>
                            <td>
                                {res.reservation.status === 'pending' ? (
                                    <div className="action-buttons">
                                        <button 
                                            className="approve"
                                            onClick={() => onApprove(res.reservation.id)}
                                            disabled={isProcessing === res.reservation.id}
                                            title="Approve"
                                        >
                                            <FaCheckCircle size={16} />
                                        </button>
                                        <button 
                                            className="reject"
                                            onClick={() => onReject(res.reservation.id)}
                                            disabled={isProcessing === res.reservation.id}
                                            title="Reject"
                                        >
                                            <FaTimesCircle size={16} />
                                        </button>
                    </div>
                                ) : (
                                    getStatusBadge(res.reservation.status)
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </ReservationsTableStyle>
    );
}; 
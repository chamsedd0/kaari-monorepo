import React, { useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa';
import { Request, Property, User } from '../../backend/entities';
import { ReservationDetailsModal } from './ReservationDetailsModal';

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
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    h2 {
        font: ${Theme.typography.fonts.h4B};
        color: ${Theme.colors.black};
        padding: 24px 32px;
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
        border-bottom: 1px solid ${Theme.colors.gray5};
    }

    td {
        padding: 16px 24px;
        border-bottom: 1px solid ${Theme.colors.gray5};
        font: ${Theme.typography.fonts.smallM};
        color: ${Theme.colors.black};
        vertical-align: middle;
    }

    tr {
        transition: background-color 0.2s ease;
        
        &:hover {
            background-color: #F9FAFC;
        }
        
        &:last-child td {
            border-bottom: none;
        }
    }

    .applicant {
        display: flex;
        align-items: center;
        gap: 12px;

        img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid ${Theme.colors.tertiary};
        }

        .initials {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: ${Theme.colors.tertiary};
            display: flex;
            align-items: center;
            justify-content: center;
            font: ${Theme.typography.fonts.smallB};
            color: ${Theme.colors.gray2};
        }
        
        span {
            font: ${Theme.typography.fonts.smallM};
            color: ${Theme.colors.black};
            
            .age {
                color: ${Theme.colors.gray2};
                margin-left: 4px;
            }
        }
    }

    .hour-indicator {
        font: ${Theme.typography.fonts.smallB};
        color: ${Theme.colors.black};
        
        &.urgent {
            color: ${Theme.colors.error};
        }
    }

    .action-buttons {
        display: flex;
        align-items: center;
        gap: 10px;

        button {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: none;
            transition: all 0.2s ease;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            
            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }
            
            &:active {
                transform: translateY(0);
            }
            
            &.approve {
                background-color: ${Theme.colors.success};
                color: white;
                
                &:hover {
                    background-color: #1e994c;
                }
                
                &:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
                    transform: none;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
            }
            
            &.view {
                background-color: ${Theme.colors.secondary};
                color: white;
                
                &:hover {
                    background-color: #5d3fd3;
                }
            }
        }
    }

    .status-badge {
        display: inline-flex;
        align-items: center;
        padding: 6px 12px;
        border-radius: 16px;
        font: ${Theme.typography.fonts.smallB};
        margin-right: 10px;
        
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
    const [selectedReservation, setSelectedReservation] = useState<ReservationWithDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
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
            
            // Return with urgent class indicator if less than 6 hours
            const isUrgent = hours < 6;
            return { 
                text: `${hours}h remaining`,
                isUrgent
            };
        } catch (error) {
            console.error('Error calculating time remaining:', error, updatedAt);
            return 'N/A';
        }
    };

    // Get status badge
    const getStatusBadge = (status: string) => {
        if (status === 'accepted') {
            return <span className="status-badge accepted">
                <FaCheckCircle size={12} style={{ marginRight: '6px' }} /> Approved
            </span>;
        } else if (status === 'rejected') {
            return <span className="status-badge rejected">
                <FaTimesCircle size={12} style={{ marginRight: '6px' }} /> Rejected
            </span>;
        } else if (status === 'completed') {
            return <span className="status-badge completed">
                <FaCheckCircle size={12} style={{ marginRight: '6px' }} /> Completed
            </span>;
        }
        return null;
    };

    // Function to open the modal with selected reservation
    const openDetailsModal = (reservation: ReservationWithDetails) => {
        setSelectedReservation(reservation);
        setIsModalOpen(true);
    };

    // Function to handle approval from modal
    const handleModalApprove = (id: string) => {
        onApprove(id);
        // Keep modal open to see status change
    };

    // Function to handle rejection from modal
    const handleModalReject = (id: string) => {
        onReject(id);
        // Keep modal open to see status change
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReservation(null);
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
                                    <span>
                                        {res.client?.name || 'Unknown'}
                                        <span className="age">{res.client?.age ? `, ${res.client.age}` : ''}</span>
                                    </span>
                                </div>
                            </td>
                            <td>{res.property?.title || 'Apartment - flat in Agadir'}</td>
                            <td>{formatDate(res.reservation.createdAt)}</td>
                            <td>{res.property?.occupants || res.reservation.numPeople || 2}</td>
                            <td>{formatDate(res.reservation.scheduledDate || res.reservation.movingDate || res.reservation.createdAt)}</td>
                            <td>
                                {res.reservation.status === 'accepted' ? 
                                    (() => {
                                        const timeRemaining = get24hRemaining(res.reservation.updatedAt);
                                        return typeof timeRemaining === 'string' ? 
                                            timeRemaining : 
                                            <span className={`hour-indicator ${timeRemaining.isUrgent ? 'urgent' : ''}`}>
                                                {timeRemaining.text}
                                            </span>;
                                    })() : ''}
                            </td>
                            <td>
                                {res.reservation.status === 'pending' ? (
                                    <div className="action-buttons">
                                        <button 
                                            className="approve"
                                            onClick={() => openDetailsModal(res)}
                                            disabled={isProcessing === res.reservation.id}
                                            title="Approve"
                                        >
                                            <FaCheckCircle size={16} />
                                        </button>
                                        <button 
                                            className="reject"
                                            onClick={() => openDetailsModal(res)}
                                            disabled={isProcessing === res.reservation.id}
                                            title="Reject"
                                        >
                                            <FaTimesCircle size={16} />
                                        </button>
                                        <button
                                            className="view"
                                            onClick={() => openDetailsModal(res)}
                                            title="View Details"
                                        >
                                            <FaEye size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="action-buttons">
                                        {getStatusBadge(res.reservation.status)}
                                        <button
                                            className="view"
                                            onClick={() => openDetailsModal(res)}
                                            title="View Details"
                                        >
                                            <FaEye size={16} />
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <ReservationDetailsModal
                isOpen={isModalOpen}
                onClose={closeModal}
                reservation={selectedReservation}
                onApprove={handleModalApprove}
                onReject={handleModalReject}
                isProcessing={isProcessing}
            />
        </ReservationsTableStyle>
    );
}; 
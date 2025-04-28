import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';
import { getClientReservations, cancelReservation } from '../../../../backend/server-actions/ClientServerActions';
import { processPayment } from '../../../../backend/server-actions/CheckoutServerActions';
import LatestRequestCard from '../../../../components/skeletons/cards/latest-request-card';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import { BpurpleButtonMB48 } from '../../../../components/skeletons/buttons/border_purple_MB48';
import { CardBaseModelStyleLatestRequest } from '../../../../components/styles/cards/card-base-model-style-latest-request';
import { BannerBaseModelTimer } from '../../../../components/skeletons/banners/status/banner-base-model-timer';
import ProgressBanner from '../../../../components/skeletons/banners/status/banner-base-model-progress';
import { useNavigate } from 'react-router-dom';
import emptyBoxSvg from '../../../../assets/images/emptybox.svg';

const ReservationsContainer = styled.div`
  padding: 2rem;
  
  h1 {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
    margin-bottom: 1.5rem;
  }
  
  .filter-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    
    .filter-tabs {
      display: flex;
      gap: 1rem;
    
      .filter-tab {
      padding: 0.5rem 1rem;
      font: ${Theme.typography.fonts.smallB};
      color: ${Theme.colors.gray2};
        border-radius: ${Theme.borders.radius.sm};
      cursor: pointer;
      transition: all 0.3s ease;
        
        &:hover {
          background-color: ${Theme.colors.tertiary};
        }
      
      &.active {
        background-color: ${Theme.colors.secondary};
        color: white;
      }
      }
    }
  }
  
  .latest-requests {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
    
    > div {
      flex: 1;
      min-height: 300px;
      max-width: calc(50% - 0.75rem);
      
      @media (max-width: 768px) {
        max-width: 100%;
      }
    }
    }
    
  .no-reservations {
    text-align: center;
    padding: 3rem;
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};
  }
  
  .other-reservations {
    background-color: white;
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    overflow: hidden;
    margin-top: 2rem;
  }
    
  .table-header {
    border-bottom: 1px solid ${Theme.colors.gray2};
    padding: 1.5rem;
    
    h2 {
      font: ${Theme.typography.fonts.h4B};
      color: ${Theme.colors.black};
      margin: 0;
    }
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th {
      text-align: left;
      padding: 1rem 1.5rem;
      font: ${Theme.typography.fonts.smallB};
      color: ${Theme.colors.gray2};
      background-color: white;
      border-bottom: 1px solid ${Theme.colors.gray2};
    }
    
    td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid ${Theme.colors.gray2};
      font: ${Theme.typography.fonts.smallM};
      color: ${Theme.colors.black};
    }
          
    tr:last-child td {
      border-bottom: none;
    }
    
    .status {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 16px;
      font: ${Theme.typography.fonts.smallB};
      text-align: center;
      min-width: 90px;
      
      &.pending {
        background-color: #E3F8FF;
        color: #0299CC;
      }
        
      &.approved {
        background-color: #E6F5F0;
        color: #0CA86B;
      }
          
      &.declined {
        background-color: #FDECEC;
        color: #D02C2C;
      }
      
      &.completed {
        background-color: #EEE6FD;
        color: ${Theme.colors.secondary};
      }
    }
      
      .action-button {
      padding: 0.5rem 0.75rem;
        border-radius: ${Theme.borders.radius.sm};
        font: ${Theme.typography.fonts.smallB};
        cursor: pointer;
      background-color: white;
          color: ${Theme.colors.secondary};
          border: 1px solid ${Theme.colors.secondary};
      transition: all 0.3s ease;
          
          &:hover {
        background-color: ${Theme.colors.secondary};
        color: white;
      }
    }
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    
    .modal-content {
      background-color: white;
      border-radius: ${Theme.borders.radius.md};
      padding: 2rem;
      width: 90%;
      max-width: 500px;
      
      .modal-title {
        font: ${Theme.typography.fonts.h4B};
        color: ${Theme.colors.black};
        margin-bottom: 1rem;
      }
      
      .modal-message {
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
        margin-bottom: 1.5rem;
      }
      
      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        
        .modal-button {
          padding: 0.75rem 1.5rem;
          border-radius: ${Theme.borders.radius.sm};
          font: ${Theme.typography.fonts.smallB};
          cursor: pointer;
          transition: all 0.3s ease;
          
          &.cancel {
            background-color: white;
            color: ${Theme.colors.gray2};
            border: 1px solid ${Theme.colors.gray};
            
            &:hover {
              background-color: ${Theme.colors.tertiary};
            }
          }
          
          &.confirm {
            background-color: ${Theme.colors.error};
            color: white;
            border: none;
            
            &:hover {
              background-color: #c0392b;
            }
            
            &:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }
          }
          
          &.pay {
            background-color: ${Theme.colors.success};
            color: white;
            border: none;
            
            &:hover {
              background-color: ${Theme.colors.success};
            }
            
            &:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }
`;

const EmptyLatestRequests = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: ${Theme.borders.radius.lg};
  padding: 3rem;
  width: 100%;
  min-height: 300px;
      border: ${Theme.borders.primary};

  
  img {
    width: 100px;
    height: 100px;
    margin-bottom: 1.5rem;
  }
  
  h3 {
    font: ${Theme.typography.fonts.h4B};
    color: ${Theme.colors.black};
    margin-bottom: 0.5rem;
  }
  
  p {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};
    text-align: center;
    max-width: 400px;
  }
`;

interface Reservation {
  reservation: {
    id: string;
    requestType: string;
    status: 'pending' | 'accepted' | 'rejected' | 'completed';
    createdAt: Date;
    updatedAt: Date;
    scheduledDate?: Date;
    message: string;
    propertyId?: string;
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
    images: string[];
  } | null;
  advertiser?: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  } | null;
}

// Define FirestoreTimestamp interface for better type safety
interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

// CustomReservationCard props interface
interface CustomReservationCardProps {
  title: string;
  details: string;
  status: "Approved" | "Declined" | "Pending" | string;
  timer: boolean;
  date: string;
  price: string;
  image: string;
  reservationId: string;
  onCancel: (id: string) => void;
  onConfirmPayment: (id: string) => void;
  updatedAt: Date | FirestoreTimestamp | string;
}

const CustomReservationCard: React.FC<CustomReservationCardProps> = ({ 
  title, 
  details, 
  status, 
  timer, 
  date, 
  price, 
  image,
  reservationId,
  onCancel,
  onConfirmPayment,
  updatedAt
}) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    // Navigate to property details page
    navigate(`/checkout-process?status=${status.toLowerCase()}`);
  };
  
  // Custom styled container for the timer
  const CustomTimerContainer = styled.div`
    .timer {
      min-width: 300px !important;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.4); 
      backdrop-filter: blur(10px);
      border-radius: ${Theme.borders.radius.lg};
      padding: 16px 0px !important;
    }
  `;
  
  return (
    <CardBaseModelStyleLatestRequest timer={timer}>
      <div className="timer-container">
        <img src={image} alt=""/>
        <div className="upper-banner">
          <div className="title-banner">Latest Request</div>
          <div className="status-banner">
            <ProgressBanner status={status as 'Pending' | 'Approved' | 'Declined'} text={status}></ProgressBanner>
          </div>
        </div>
        <div className="main-content">
          {timer && (
            <CustomTimerContainer>
              <div className="timer">
                <CountdownTimer updatedAt={updatedAt} />
              </div>
            </CustomTimerContainer>
          )}
          <div className="text-content">
            <div className="title">
              <b>{title}</b>
              <span>{details}</span>
            </div>
            <div className="info">
              <div className="date">{date}</div>
              <div className="price">{price}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="control-container">
        <BpurpleButtonMB48 
          text="Details" 
          onClick={handleViewDetails}
          icon={
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.64815 5.92592C8.64815 5.63292 8.73504 5.34649 8.89783 5.10286C9.06061 4.85923 9.29199 4.66934 9.56269 4.55721C9.8334 4.44508 10.1313 4.41575 10.4187 4.47291C10.706 4.53007 10.97 4.67117 11.1772 4.87836C11.3844 5.08555 11.5255 5.34952 11.5826 5.6369C11.6398 5.92428 11.6105 6.22216 11.4983 6.49286C11.3862 6.76357 11.1963 6.99494 10.9527 7.15773C10.7091 7.32052 10.4226 7.40741 10.1296 7.40741C9.73672 7.40741 9.3599 7.25132 9.08207 6.97349C8.80424 6.69566 8.64815 6.31884 8.64815 5.92592ZM20.5 10C20.5 11.9778 19.9135 13.9112 18.8147 15.5557C17.7159 17.2002 16.1541 18.4819 14.3268 19.2388C12.4996 19.9957 10.4889 20.1937 8.5491 19.8078C6.60929 19.422 4.82746 18.4696 3.42894 17.0711C2.03041 15.6725 1.078 13.8907 0.692152 11.9509C0.3063 10.0111 0.504333 8.00043 1.26121 6.17316C2.01809 4.3459 3.29981 2.78412 4.9443 1.6853C6.58879 0.58649 8.52219 0 10.5 0C13.1513 0.00294095 15.6931 1.05745 17.5678 2.93218C19.4425 4.80691 20.4971 7.34874 20.5 10ZM18.2778 10C18.2778 8.4617 17.8216 6.95795 16.967 5.6789C16.1124 4.39985 14.8976 3.40295 13.4764 2.81427C12.0552 2.22559 10.4914 2.07156 8.98263 2.37167C7.47389 2.67178 6.08803 3.41254 5.00028 4.50028C3.91254 5.58802 3.17178 6.97389 2.87167 8.48263C2.57157 9.99137 2.72559 11.5552 3.31427 12.9764C3.90296 14.3976 4.89985 15.6123 6.1789 16.467C7.45795 17.3216 8.9617 17.7778 10.5 17.7778C12.5621 17.7756 14.5391 16.9554 15.9973 15.4973C17.4554 14.0391 18.2756 12.0621 18.2778 10ZM11.6111 13.3963V10.3704C11.6111 9.87923 11.416 9.4082 11.0687 9.06091C10.7214 8.71362 10.2504 8.51852 9.75926 8.51852C9.49686 8.51813 9.24279 8.61061 9.04205 8.7796C8.84131 8.94858 8.70685 9.18316 8.66249 9.44178C8.61813 9.70041 8.66673 9.96638 8.79968 10.1926C8.93264 10.4188 9.14136 10.5907 9.38889 10.6778V13.7037C9.38889 14.1948 9.584 14.6659 9.93129 15.0132C10.2786 15.3604 10.7496 15.5556 11.2407 15.5556C11.5031 15.5559 11.7572 15.4635 11.958 15.2945C12.1587 15.1255 12.2932 14.8909 12.3375 14.6323C12.3819 14.3737 12.3333 14.1077 12.2003 13.8815C12.0674 13.6552 11.8586 13.4834 11.6111 13.3963Z" fill="currentColor"/>
            </svg>
          } 
        />
        <PurpleButtonMB48 
          text={status === 'Pending' ? 'Cancel Reservation' : status === 'Approved' ? 'Confirm Payment' : 'View'}
          onClick={() => {
            if (status === 'Pending') {
              onCancel(reservationId);
            } else if (status === 'Approved') {
              onConfirmPayment(reservationId);
            } else {
              handleViewDetails();
            }
          }}
        />
      </div>
    </CardBaseModelStyleLatestRequest>
  );
};

// Create a custom countdown timer component
interface CountdownTimerProps {
  updatedAt: Date | FirestoreTimestamp | string;
}

const CountdownTimer = ({ updatedAt }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState('23:59:59');
  
  useEffect(() => {
    // Function to calculate and format time left
    const calculateTimeLeft = () => {
      if (!updatedAt) return '23:59:59';
      
      try {
        let updated: Date;
        
        // Convert the timestamp to a Date object
        if (updatedAt instanceof Date) {
          updated = updatedAt;
        } 
        else if (typeof updatedAt === 'object' && 'seconds' in updatedAt) {
          const firestoreTimestamp = updatedAt as FirestoreTimestamp;
          updated = new Date(firestoreTimestamp.seconds * 1000);
        }
        else {
          updated = new Date(updatedAt as string);
        }
        
        if (isNaN(updated.getTime())) {
          return '23:59:59';
        }
        
        const now = new Date();
        const deadline = new Date(updated.getTime() + 24 * 60 * 60 * 1000);
        const diffMs = deadline.getTime() - now.getTime();
        
        if (diffMs <= 0) return '00:00:00';
        
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } catch (error) {
        console.error('Error formatting timer display:', error, updatedAt);
        return '23:59:59';
      }
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Set up interval to update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(timer);
  }, [updatedAt]);
  
  return (
    <div style={{ 
      font: 'normal 900 58px Visby CF', 
      color: 'white',
      padding: '16px' 
    }}>
      {timeLeft}
    </div>
  );
};

const ReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [cancellingReservation, setCancellingReservation] = useState(false);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
    
    useEffect(() => {
    loadReservations();
  }, []);
  
        const loadReservations = async () => {
    try {
            setLoading(true);
                const data = await getClientReservations();
                setReservations(data);
    } catch (err: any) {
                console.error('Error loading reservations:', err);
      setError(err.message || 'Failed to load reservations');
            } finally {
                setLoading(false);
            }
        };
        
  const handleConfirmPayment = async () => {
    if (!selectedReservation) return;
    
    try {
      setProcessingPayment(selectedReservation);
      await processPayment(selectedReservation);
      await loadReservations();
      setShowPaymentModal(false);
    } catch (err: any) {
      console.error('Error processing payment:', err);
      setError(err.message || 'Failed to process payment');
    } finally {
      setProcessingPayment(null);
      setSelectedReservation(null);
    }
  };
  
  const openPaymentModal = (reservationId: string) => {
    setSelectedReservation(reservationId);
    setShowPaymentModal(true);
  };
  
  const closePaymentModal = () => {
    setSelectedReservation(null);
    setShowPaymentModal(false);
  };
  
  const getTimeRemaining = (updatedAt: Date | FirestoreTimestamp | string | undefined) => {
    if (!updatedAt) return { hours: 0, minutes: 0, expired: true };
    
    try {
      let updated: Date;
      
      // Check if it's already a Date object
      if (updatedAt instanceof Date) {
        updated = updatedAt;
      } 
      // Check if it's a timestamp object with seconds and nanoseconds (Firestore timestamp)
      else if (typeof updatedAt === 'object' && 'seconds' in updatedAt && 'nanoseconds' in updatedAt) {
        updated = new Date((updatedAt as FirestoreTimestamp).seconds * 1000);
      }
      // Handle string or any other format
      else {
        updated = new Date(updatedAt as string);
      }
      
      if (isNaN(updated.getTime())) {
        console.error('Invalid date in getTimeRemaining:', updatedAt);
        return { hours: 0, minutes: 0, expired: true };
      }
      
      const now = new Date();
      const deadline = new Date(updated.getTime() + 24 * 60 * 60 * 1000);
      const diffMs = deadline.getTime() - now.getTime();
      
      if (diffMs <= 0) return { hours: 0, minutes: 0, expired: true };
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      return { hours, minutes, expired: false };
    } catch (error) {
      console.error('Error in getTimeRemaining:', error, updatedAt);
      return { hours: 0, minutes: 0, expired: true };
    }
  };
  
  const formatTimeRemaining = (updatedAt: Date | FirestoreTimestamp | string | undefined) => {
    const { hours, minutes, expired } = getTimeRemaining(updatedAt);
    
    if (expired) return 'Time expired';
    
    return `${hours}h ${minutes}m remaining`;
        };
        
  const handleCancelReservation = async () => {
    if (!selectedReservation) return;
    
    try {
      setCancellingReservation(true);
      await cancelReservation(selectedReservation);
      await loadReservations();
      setShowCancelModal(false);
    } catch (err: any) {
      console.error('Error cancelling reservation:', err);
      setError(err.message || 'Failed to cancel reservation');
    } finally {
      setCancellingReservation(false);
    }
  };
  
  const openCancelModal = (reservationId: string) => {
    setSelectedReservation(reservationId);
    setShowCancelModal(true);
  };
  
  const closeCancelModal = () => {
    setSelectedReservation(null);
    setShowCancelModal(false);
  };
  
  const formatAddress = (address: any) => {
    if (!address) return 'Address not available';
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  };
  
  const formatDate = (date: Date | FirestoreTimestamp | string | undefined) => {
    if (!date) return 'Date not available';
    
    // Handle case where date might be a Firestore timestamp or string
    let dateObject: Date;
    
    try {
      // Check if it's already a Date object
      if (date instanceof Date) {
        dateObject = date;
      } 
      // Check if it's a timestamp object with seconds and nanoseconds (Firestore timestamp)
      else if (typeof date === 'object' && 'seconds' in date) {
        const firestoreTimestamp = date as FirestoreTimestamp;
        dateObject = new Date(firestoreTimestamp.seconds * 1000);
      }
      // Handle string or any other format
      else {
        dateObject = new Date(date as string);
      }
      
      // Check if the date is valid
      if (isNaN(dateObject.getTime())) {
        return 'Invalid Date';
      }
      
      return dateObject.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Invalid Date';
    }
  };
  
  const formatDateShort = (date: Date | FirestoreTimestamp | string | undefined) => {
    if (!date) return 'N/A';
    
    try {
      let dateObject: Date;
      
      if (date instanceof Date) {
        dateObject = date;
      } 
      else if (typeof date === 'object' && 'seconds' in date) {
        const firestoreTimestamp = date as FirestoreTimestamp;
        dateObject = new Date(firestoreTimestamp.seconds * 1000);
      }
      else {
        dateObject = new Date(date as string);
      }
      
      if (isNaN(dateObject.getTime())) {
        return 'Invalid Date';
      }
      
      return dateObject.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Invalid Date';
    }
  };
  
  const filteredReservations = statusFilter === 'all'
    ? reservations
    : reservations.filter(res => res.reservation.status === statusFilter);
  
  const latestReservations = reservations
    .filter(res => res.reservation.status !== 'completed')
    .sort((a, b) => {
      const dateA = new Date(a.reservation.createdAt).getTime();
      const dateB = new Date(b.reservation.createdAt).getTime();
      return dateB - dateA;
    })
    .slice(0, 2);
  
  const otherReservations = reservations
    .filter(res => !latestReservations.some(latest => latest.reservation.id === res.reservation.id))
    .sort((a, b) => {
      const dateA = new Date(a.reservation.createdAt).getTime();
      const dateB = new Date(b.reservation.createdAt).getTime();
      return dateB - dateA;
    });
  
  const getTimeLeftForMoveIn = (scheduledDate: Date | FirestoreTimestamp | string | undefined) => {
    if (!scheduledDate) return null;
    
    try {
      let moveInDate: Date;
      
      // Check if it's already a Date object
      if (scheduledDate instanceof Date) {
        moveInDate = scheduledDate;
      } 
      // Check if it's a timestamp object with seconds and nanoseconds (Firestore timestamp)
      else if (typeof scheduledDate === 'object' && 'seconds' in scheduledDate) {
        const firestoreTimestamp = scheduledDate as FirestoreTimestamp;
        moveInDate = new Date(firestoreTimestamp.seconds * 1000);
      }
      // Handle string or any other format
      else {
        moveInDate = new Date(scheduledDate as string);
      }
      
      // Check if the date is valid
      if (isNaN(moveInDate.getTime())) {
        console.error('Invalid date in getTimeLeftForMoveIn:', scheduledDate);
        return null;
      }
    
    const now = new Date();
    const diffTime = moveInDate.getTime() - now.getTime();
    
    if (diffTime <= 0) return null;
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} until your viewing`;
    }
    
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} until your viewing`;
    } catch (error) {
      console.error('Error in getTimeLeftForMoveIn:', error, scheduledDate);
      return null;
    }
  };
  
  if (loading) {
    return <div>Loading your reservations...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
    
    return (
    <ReservationsContainer>
      <h1>Reservations</h1>
      
      {reservations.length === 0 && (
        <div className="no-reservations">
          You don't have any reservations yet. Browse our properties and make a reservation!
        </div>
      )}
      
      {latestReservations.length > 0 ? (
        <div className="latest-requests">
          {latestReservations.map(res => {
            const propertyTitle = res.property?.title || "Apartment - flat in the center of Agadir";
            const propertyAddress = res.property ? formatAddress(res.property.address) : "avenue larache, Agadir, Souss-Massa 80000";
            const status = res.reservation.status === 'accepted' ? 'Approved' : 
                          res.reservation.status === 'rejected' ? 'Declined' : 'Pending';
            const price = `${res.property?.price || 1500}$/month`;
            const date = formatDateShort(res.reservation.scheduledDate || res.reservation.createdAt);
            const imageUrl = "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
            const hasTimer = res.reservation.status === 'accepted';
            
            return (
              <CustomReservationCard
                key={res.reservation.id}
                title={propertyTitle}
                details={propertyAddress}
                status={status}
                timer={hasTimer}
                date={date}
                price={price}
                image={imageUrl}
                reservationId={res.reservation.id}
                onCancel={openCancelModal}
                onConfirmPayment={openPaymentModal}
                updatedAt={res.reservation.updatedAt}
              />
            );
          })}
        </div>
      ) : (
        <EmptyLatestRequests>
          <img src={emptyBoxSvg} alt="No latest requests" />
          <h3>No Latest Requests</h3>
          <p>You don't have any active reservation requests. Start browsing properties to make a reservation!</p>
        </EmptyLatestRequests>
      )}
            
      {otherReservations.length > 0 && (
        <div className="other-reservations">
          <div className="table-header">
            <h2>Other Reservations</h2>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Property Name</th>
                <th>Advertiser</th>
                <th>Check-in</th>
                <th>Status</th>
                <th>Fee</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {otherReservations.map(res => (
                <tr key={res.reservation.id}>
                  <td>{res.property?.title || "Apartment in Agadir"}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src="https://randomuser.me/api/portraits/men/32.jpg" 
                        alt="Avatar" 
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          marginRight: '8px' 
                        }} 
                      />
                      {res.advertiser?.name || "Leonardo V."}
                    </div>
                  </td>
                  <td>{formatDateShort(res.reservation.scheduledDate)}</td>
                  <td>
                    <span className={`status ${res.reservation.status === 'accepted' ? 'approved' : 
                                       res.reservation.status === 'rejected' ? 'declined' : 
                                       res.reservation.status === 'completed' ? 'completed' : 'pending'}`}>
                      {res.reservation.status === 'accepted' ? 'Approved' : 
                       res.reservation.status === 'rejected' ? 'Declined' : 
                       res.reservation.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td>0$</td>
                  <td>
                    <button 
                      className="action-button"
                      onClick={() => window.open(`/properties/${res.property?.id || res.reservation.propertyId || ''}`, '_blank')}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Cancel Reservation</h2>
            <p className="modal-message">
              Are you sure you want to cancel this reservation request? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button 
                className="modal-button cancel"
                onClick={closeCancelModal}
                disabled={cancellingReservation}
              >
                Keep Request
              </button>
              <button 
                className="modal-button confirm"
                onClick={handleCancelReservation}
                disabled={cancellingReservation}
              >
                {cancellingReservation ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Confirm Payment</h2>
            <p className="modal-message">
              By confirming this payment, you agree to complete the reservation. 
              Your payment method will be charged for the deposit and first month's rent.
            </p>
            <div className="modal-actions">
              <button 
                className="modal-button cancel"
                onClick={closePaymentModal}
                disabled={processingPayment !== null}
              >
                Cancel
              </button>
              <button 
                className="modal-button pay"
                onClick={handleConfirmPayment}
                disabled={processingPayment !== null}
              >
                {processingPayment ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ReservationsContainer>
    );
};

export default ReservationsPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardBaseModelStyleLatestRequest } from '../../styles/cards/card-base-model-style-latest-request';
import { BannerBaseModelTimer } from '../banners/status/banner-base-model-timer';
import { BpurpleButtonMB48 } from '../buttons/border_purple_MB48';
import { PurpleButtonMB48 } from '../buttons/purple_MB48';
import ProgressBanner from '../banners/status/banner-base-model-progress';

interface CardBaseProps {
    title: string;
    status: 'Pending' | 'Approved' | 'Declined';
    timer?: boolean;
    date?: string;
    price?: string;
    details?: string;
    image: string;
    id?: string; // Property ID
}

const LatestRequestCard: React.FC<CardBaseProps> = ({ 
    title, 
    details, 
    status, 
    timer, 
    date, 
    price, 
    image,
    id = '123' // Default ID for demo
}) => {
    const navigate = useNavigate();
    
    // Map reservation status to checkout status
    const getCheckoutStatus = () => {
        switch (status) {
            case 'Pending': return 'pending';
            case 'Approved': return 'success';
            case 'Declined': return 'rejected';
            default: return 'pending';
        }
    };
    
    const handleViewDetails = () => {
        // Navigate to checkout process with the appropriate status
        navigate(`/checkout-process?status=${getCheckoutStatus()}`);
    };
    
    const handleAccept = () => {
        // For approved reservations, navigate to success page
        // For pending, confirm/accept the reservation
        if (status === 'Pending') {
            // In a real app, you would make an API call to accept the reservation
            // Then navigate to success page
            navigate('/checkout-process?status=success');
        } else {
            // If already approved, view the reservation details
            navigate(`/checkout-process?status=${getCheckoutStatus()}`);
        }
    };

    return (
        <CardBaseModelStyleLatestRequest timer={timer}>
            <div className="timer-container">
                <img src={image} alt=""/>
                <div className="upper-banner">
                    <div className="title-banner">Latest Request</div>
                    <div className="status-banner">
                        <ProgressBanner status={status} text={status}></ProgressBanner>
                    </div>
                </div>
                <div className="main-content">
                    <div className="timer">
                        <BannerBaseModelTimer></BannerBaseModelTimer>
                    </div>
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
                    text={'Details'} 
                    onClick={handleViewDetails}
                    icon={
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.64815 5.92592C8.64815 5.63292 8.73504 5.34649 8.89783 5.10286C9.06061 4.85923 9.29199 4.66934 9.56269 4.55721C9.8334 4.44508 10.1313 4.41575 10.4187 4.47291C10.706 4.53007 10.97 4.67117 11.1772 4.87836C11.3844 5.08555 11.5255 5.34952 11.5826 5.6369C11.6398 5.92428 11.6105 6.22216 11.4983 6.49286C11.3862 6.76357 11.1963 6.99494 10.9527 7.15773C10.7091 7.32052 10.4226 7.40741 10.1296 7.40741C9.73672 7.40741 9.3599 7.25132 9.08207 6.97349C8.80424 6.69566 8.64815 6.31884 8.64815 5.92592ZM20.5 10C20.5 11.9778 19.9135 13.9112 18.8147 15.5557C17.7159 17.2002 16.1541 18.4819 14.3268 19.2388C12.4996 19.9957 10.4889 20.1937 8.5491 19.8078C6.60929 19.422 4.82746 18.4696 3.42894 17.0711C2.03041 15.6725 1.078 13.8907 0.692152 11.9509C0.3063 10.0111 0.504333 8.00043 1.26121 6.17316C2.01809 4.3459 3.29981 2.78412 4.9443 1.6853C6.58879 0.58649 8.52219 0 10.5 0C13.1513 0.00294095 15.6931 1.05745 17.5678 2.93218C19.4425 4.80691 20.4971 7.34874 20.5 10ZM18.2778 10C18.2778 8.4617 17.8216 6.95795 16.967 5.6789C16.1124 4.39985 14.8976 3.40295 13.4764 2.81427C12.0552 2.22559 10.4914 2.07156 8.98263 2.37167C7.47389 2.67178 6.08803 3.41254 5.00028 4.50028C3.91254 5.58802 3.17178 6.97389 2.87167 8.48263C2.57157 9.99137 2.72559 11.5552 3.31427 12.9764C3.90296 14.3976 4.89985 15.6123 6.1789 16.467C7.45795 17.3216 8.9617 17.7778 10.5 17.7778C12.5621 17.7756 14.5391 16.9554 15.9973 15.4973C17.4554 14.0391 18.2756 12.0621 18.2778 10ZM11.6111 13.3963V10.3704C11.6111 9.87923 11.416 9.4082 11.0687 9.06091C10.7214 8.71362 10.2504 8.51852 9.75926 8.51852C9.49686 8.51813 9.24279 8.61061 9.04205 8.7796C8.84131 8.94858 8.70685 9.18316 8.66249 9.44178C8.61813 9.70041 8.66673 9.96638 8.79968 10.1926C8.93264 10.4188 9.14136 10.5907 9.38889 10.6778V13.7037C9.38889 14.1948 9.584 14.6659 9.93129 15.0132C10.2786 15.3604 10.7496 15.5556 11.2407 15.5556C11.5031 15.5559 11.7572 15.4635 11.958 15.2945C12.1587 15.1255 12.2932 14.8909 12.3375 14.6323C12.3819 14.3737 12.3333 14.1077 12.2003 13.8815C12.0674 13.6552 11.8586 13.4834 11.6111 13.3963Z" fill="currentColor"/>
                        </svg>
                    } 
                />
                <PurpleButtonMB48 
                    text={status === 'Pending' ? 'Accept' : 'View'}
                    onClick={handleAccept}
                />
            </div>
        </CardBaseModelStyleLatestRequest>
    );
};

export default LatestRequestCard;
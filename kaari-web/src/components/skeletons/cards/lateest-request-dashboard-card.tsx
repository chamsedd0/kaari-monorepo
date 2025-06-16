import React from 'react';
import { CardBaseModelStyleLatestRequestDashboard } from '../../styles/cards/card-base-model-style-latest-request-dashboard';
import { PurpleButtonMB48 } from '../buttons/purple_MB48';
import { BpurpleButtonMB48 } from '../buttons/border_purple_MB48';
import { useTranslation } from 'react-i18next';
import propertyPlaceholder from '../../../assets/images/propertyExamplePic.png';
import profilePlaceholder from '../../../assets/images/ProfilePicture.png';
import emptyBoxSvg from '../../../assets/images/emptybox.svg';
import { format } from 'date-fns';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { useNavigate } from 'react-router-dom';

// Empty state component for when there are no latest requests
const EmptyLatestRequests = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: ${Theme.borders.primary};
  border-radius: ${Theme.borders.radius.lg};
  padding: 3rem;
  width: 100%;
  min-height: 330px;
  
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
    margin-bottom: 1.5rem;
  }
  
  button {
    background-color: ${Theme.colors.secondary};
    color: ${Theme.colors.white};
    font: ${Theme.typography.fonts.mediumB};
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: ${Theme.borders.radius.extreme};
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: ${Theme.colors.primary};
    }
  }
`;

interface LatestRequestDashboardCardProps {
  title?: string;
  requestImage?: string;
  requestTitle?: string;
  photographerName?: string;
  photographerInfo?: string;
  photographerImage?: string;
  moveInDate?: string;
  appliedOn?: string;
  remainingTime?: string;
  name?: string;
  img?: string;
  date?: string;
  time?: string;
  requestCount?: number;
  requestStatus?: string;
  isEmpty?: boolean;
  onViewMore?: () => void;
  onDetails?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onBrowseProperties?: () => void;
}

const LatestRequestDashboardCard: React.FC<LatestRequestDashboardCardProps> = ({
  title,
  requestImage = '',
  requestTitle = '',
  photographerName = '',
  photographerInfo = '',
  photographerImage = '',
  moveInDate = '',
  appliedOn = '',
  remainingTime = '',
  name = '',
  img = '',
  date = '',
  time = '',
  requestCount = 0,
  requestStatus = 'pending',
  isEmpty = false,
  onViewMore,
  onDetails,
  onAccept,
  onReject,
  onBrowseProperties,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Use either traditional props or the newer dashboard props
  const displayName = name || photographerName || t('advertiser_dashboard.dashboard.anonymous_user', 'Guest');
  const displayImage = img || photographerImage || profilePlaceholder;
  const displayTitle = title || t('advertiser_dashboard.dashboard.latest_request', 'Latest Request');
  const isPending = requestStatus === 'pending';
  
  // Format dates properly with fallbacks
  const formatDate = (dateStr: string) => {
    // Early return if no date
    if (!dateStr || dateStr === '') return 'N/A';
    
    // Handle dates that are already formatted with slashes or dashes
    if (dateStr.includes('/') || dateStr.includes('-') || dateStr.includes(',')) {
      // But still check if it's literally "Invalid Date"
      return dateStr === 'Invalid Date' ? 'N/A' : dateStr;
    }
    
    try {
      // Try to create a Date object
      const date = new Date(dateStr);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) return 'N/A';
      
      // Return formatted date
      return format(date, 'MMM dd, yyyy');
    } catch (e) {
      return 'N/A';
    }
  };
  
  // Use current date as fallback for empty dates
  const today = new Date().toISOString();
  const displayMoveInDate = formatDate(moveInDate || today);
  const displayAppliedOn = formatDate(appliedOn || date || today);
  const displayTime = time || new Date().toLocaleTimeString();
  
  const handleBrowseProperties = () => {
    if (onBrowseProperties) {
      onBrowseProperties();
    } else {
      navigate('/properties');
    }
  };
  
  // If empty state is requested, show the empty component
  if (isEmpty) {
    return (
      <div className="latest-request-container">
        <EmptyLatestRequests>
          <img src={emptyBoxSvg} alt="No requests" />
          <h3>{t('advertiser_dashboard.dashboard.no_requests_title', 'No Latest Requests')}</h3>
          <p>{t('advertiser_dashboard.dashboard.no_requests_description', 'You have no latest reservation requests. Browse properties to find potential tenants.')}</p>
          <button onClick={handleBrowseProperties}>
            {t('property_list.browse_properties', 'Browse Properties')}
          </button>
        </EmptyLatestRequests>
      </div>
    );
  }
  
  return (
    <CardBaseModelStyleLatestRequestDashboard>
      <div className="title-viewmore-container">
        <div className="title">{displayTitle}</div>
        <div className="viewmore" onClick={onViewMore}>
          {t('common.view_more', 'View more')}
        </div>
      </div>
      
      <div className="latest-request-container">
        <img 
          src={requestImage || propertyPlaceholder} 
          alt={t('advertiser_dashboard.dashboard.property_alt', 'Property')} 
          className="latest-request-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = propertyPlaceholder;
          }}
        />
        
        <div className="latest-request-info-container">
          <div className="latest-request-title">
            {requestTitle || t('advertiser_dashboard.dashboard.property_request', 'Property Request')}
          </div>
          
          <div className="latest-request-info">
            <div className="latest-request-picture-name-details">
              <div className="latest-request-picture-name-container">
                <img 
                  src={displayImage} 
                  alt={t('advertiser_dashboard.dashboard.requester_alt', 'Requester')} 
                  className="latest-request-picture"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = profilePlaceholder;
                  }}
                />
                <div className="latest-request-name-container">
                  <div className="latest-request-name">{displayName}</div>
                  <div className="latest-request-info">
                    {photographerInfo || (requestCount > 0 
                      ? t('advertiser_dashboard.dashboard.request_count', 'Request {{count}}', { count: requestCount }) 
                      : t('advertiser_dashboard.dashboard.occupants', 'Occupants: {{count}}', { count: 1 }))}
                  </div>
                </div>
              </div>
              
              <div className="details-container" onClick={onDetails}>
                <div className="details-text">
                  {t('common.details', 'Details')}
                </div>
                <svg className="details-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="move-in-date">
              {moveInDate && moveInDate !== 'Invalid Date' ? 
                t('advertiser_dashboard.reservations.move_in_date_label', 'Move-in date: {{date}}', { date: displayMoveInDate }) : 
                t('advertiser_dashboard.dashboard.request_time', 'Request time: {{time}}', { time: displayTime })
              }
            </div>
            
            <div className="text-container">
              <div className="text-container-text">
                {appliedOn && appliedOn !== 'Invalid Date' ? 
                  t('advertiser_dashboard.reservations.applied_on', 'Applied on: {{date}}', { date: displayAppliedOn }) : 
                  t('advertiser_dashboard.dashboard.received_on', 'Received on: {{date}}', { date: displayAppliedOn })
                }
              </div>
              <div className="text-remaining-time">{remainingTime || ''}</div>
            </div>
          </div>
          
          {isPending && (
            <div className="button-container">
              <BpurpleButtonMB48 
                text={t('advertiser_dashboard.reservations.reject_request', 'Reject Request')} 
                onClick={onReject}
              />
              <PurpleButtonMB48 
                text={t('advertiser_dashboard.reservations.accept_request', 'Accept Request')} 
                onClick={onAccept}
              />
            </div>
          )}
        </div>
      </div>
    </CardBaseModelStyleLatestRequestDashboard>
  );
};

export default LatestRequestDashboardCard;

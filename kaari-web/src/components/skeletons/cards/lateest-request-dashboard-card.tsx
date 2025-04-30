import React from 'react';
import { CardBaseModelStyleLatestRequestDashboard } from '../../styles/cards/card-base-model-style-latest-request-dashboard';
import { PurpleButtonMB48 } from '../buttons/purple_MB48';
import { BpurpleButtonMB48 } from '../buttons/border_purple_MB48';
import { useTranslation } from 'react-i18next';
import propertyPlaceholder from '../../../assets/images/propertyExamplePic.png';
import profilePlaceholder from '../../../assets/images/ProfilePicture.png';

interface LatestRequestDashboardCardProps {
  title?: string;
  requestImage?: string;
  requestTitle?: string;
  photographerName?: string;
  photographerInfo?: string;
  photographerImage?: string;
  moveInDate?: string;
  aplliedon?: string;
  remainingTime?: string;
  name?: string;
  img?: string;
  date?: string;
  time?: string;
  requestCount?: number;
  requestStatus?: string;
  onViewMore?: () => void;
  onDetails?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

const LatestRequestDashboardCard: React.FC<LatestRequestDashboardCardProps> = ({
  title,
  requestImage = '',
  requestTitle = '',
  photographerName = '',
  photographerInfo = '',
  photographerImage = '',
  moveInDate = '',
  aplliedon = '',
  remainingTime = '',
  name = '',
  img = '',
  date = '',
  time = '',
  requestCount = 0,
  requestStatus = 'pending',
  onViewMore,
  onDetails,
  onAccept,
  onReject,
}) => {
  const { t } = useTranslation();
  
  // Use either traditional props or the newer dashboard props
  const displayName = name || photographerName;
  const displayImage = img || photographerImage || profilePlaceholder;
  const displayTitle = title || t('advertiser_dashboard.dashboard.latest_request', 'Latest Request');
  const isPending = requestStatus === 'pending';
  
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
        />
        
        <div className="latest-request-info-container">
          <div className="latest-request-title">{requestTitle || name}</div>
          
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
                    {photographerInfo || t('advertiser_dashboard.dashboard.request_count', 'Request {{count}}', { count: requestCount || '' })}
                  </div>
                </div>
              </div>
              
              <div className="details-container">
                <div className="details-text" onClick={onDetails}>
                  {t('common.details', 'Details')}
                </div>
                <svg className="details-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="move-in-date">
              {moveInDate ? 
                t('advertiser_dashboard.reservations.move_in_date_label', 'Move-in date: {{date}}', { date: moveInDate }) : 
                t('advertiser_dashboard.dashboard.request_time', 'Request time: {{time}}', { time: time || '' })}
            </div>
            
            <div className="text-container">
              <div className="text-container-text">
                {aplliedon ? 
                  t('advertiser_dashboard.reservations.applied_on', 'Applied on: {{date}}', { date: aplliedon }) : 
                  t('advertiser_dashboard.dashboard.received_on', 'Received on: {{date}}', { date: date || '' })}
              </div>
              <div className="text-remaining-time">{remainingTime}</div>
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

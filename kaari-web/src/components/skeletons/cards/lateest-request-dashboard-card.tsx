import React from 'react';
import { CardBaseModelStyleLatestRequestDashboard } from '../../styles/cards/card-base-model-style-latest-request-dashboard';
import { PurpleButtonMB48 } from '../buttons/purple_MB48';
import { BpurpleButtonMB48 } from '../buttons/border_purple_MB48';

interface LatestRequestDashboardCardProps {
  title?: string;
  viewMoreText?: string;
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
  onViewMore?: () => void;
  onDetails?: () => void;
  onAccept?: () => void;
}

const LatestRequestDashboardCard: React.FC<LatestRequestDashboardCardProps> = ({
  title = "Latest Request",
  viewMoreText = 'View more',
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
  onViewMore,
  onDetails,
}) => {
  // Use either traditional props or the newer dashboard props
  const displayName = name || photographerName;
  const displayImage = img || photographerImage;
  const displayTitle = title || "Latest Request";
  
  return (
    <CardBaseModelStyleLatestRequestDashboard>
      <div className="title-viewmore-container">
        <div className="title">{displayTitle}</div>
        <div className="viewmore" onClick={onViewMore}>{viewMoreText}</div>
      </div>
      
      <div className="latest-request-container">
        <img src={requestImage} alt="Property" className="latest-request-image" />
        
        <div className="latest-request-info-container">
          <div className="latest-request-title">{requestTitle || name}</div>
          
          <div className="latest-request-info">
            <div className="latest-request-picture-name-details">
              <div className="latest-request-picture-name-container">
                <img src={displayImage} alt="Requester" className="latest-request-picture" />
                <div className="latest-request-name-container">
                  <div className="latest-request-name">{displayName}</div>
                  <div className="latest-request-info">{photographerInfo || `Request ${requestCount || ''}`}</div>
                </div>
              </div>
              
              <div className="details-container">
                <div className="details-text" onClick={onDetails}>Details</div>
                <svg className="details-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="move-in-date">{moveInDate ? `Move-in date: ${moveInDate}` : `Request time: ${time || ''}`}</div>
            
            <div className="text-container">
              <div className="text-container-text">{aplliedon ? `Applied on: ${aplliedon}` : `Received on: ${date || ''}`}</div>
              <div className="text-remaining-time">{remainingTime}</div>
            </div>
          </div>
          
          <div className="button-container">
            <BpurpleButtonMB48 text="Reject Request" />
            <PurpleButtonMB48 text="Accept Request" />
            
          </div>
        </div>
      </div>
    </CardBaseModelStyleLatestRequestDashboard>
  );
};

export default LatestRequestDashboardCard;

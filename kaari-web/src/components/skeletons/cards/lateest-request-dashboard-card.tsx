import React from 'react';
import { CardBaseModelStyleLatestRequestDashboard } from '../../styles/cards/card-base-model-style-latest-request-dashboard';
import { PurpleButtonMB48 } from '../buttons/purple_MB48';
import { BpurpleButtonMB48 } from '../buttons/border_purple_MB48';

interface LatestRequestDashboardCardProps {
  title: string;
  viewMoreText?: string;
  requestImage: string;
  requestTitle: string;
  photographerName: string;
  photographerInfo: string;
  photographerImage: string;
  moveInDate: string;
  aplliedon: string;
  remainingTime: string;
  onViewMore?: () => void;
  onDetails?: () => void;
  onAccept?: () => void;
}

const LatestRequestDashboardCard: React.FC<LatestRequestDashboardCardProps> = ({
  title,
  viewMoreText = 'View more',
  requestImage,
  requestTitle,
  photographerName,
  photographerInfo,
  photographerImage,
  moveInDate,
  aplliedon,
  remainingTime,
  onViewMore,
  onDetails,
}) => {
  return (
    <CardBaseModelStyleLatestRequestDashboard>
      <div className="title-viewmore-container">
        <div className="title">{title}</div>
        <div className="viewmore" onClick={onViewMore}>{viewMoreText}</div>
      </div>
      
      <div className="latest-request-container">
        <img src={requestImage} alt="Property" className="latest-request-image" />
        
        <div className="latest-request-info-container">
          <div className="latest-request-title">{requestTitle}</div>
          
          <div className="latest-request-info">
            <div className="latest-request-picture-name-details">
              <div className="latest-request-picture-name-container">
                <img src={photographerImage} alt="Photographer" className="latest-request-picture" />
                <div className="latest-request-name-container">
                  <div className="latest-request-name">{photographerName}</div>
                  <div className="latest-request-info">{photographerInfo}</div>
                </div>
              </div>
              
              <div className="details-container">
                <div className="details-text" onClick={onDetails}>Details</div>
                <svg className="details-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="move-in-date">Move-in date: {moveInDate}</div>
            
            <div className="text-container">
              <div className="text-container-text">Applied on: {aplliedon}</div>
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

import React, { useState } from 'react';
import propertyExamplePic from "../../../assets/images/propertyExamplePic.png";
import { CardBaseModelStyle2 } from "../../styles/cards/card-base-model-style-2";
import { PurpleButtonLB40 } from '../buttons/purple_LB40';
import { BpurpleButtonLB40 } from '../buttons/border_purple_LB40';
import { Theme } from "../../../theme/theme";
import { IoChevronBackOutline, IoChevronForwardOutline, IoRefreshOutline, IoCheckmarkCircleOutline, IoWarningOutline } from 'react-icons/io5';
import styled from 'styled-components';
import { Property } from '../../../backend/entities';
import { needsAvailabilityRefresh, getRefreshStatus, formatTimeAgo } from '../../../utils/property-refresh-utils';

interface PropertyCardProps {
  title: string;
  location?: string;
  price?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  imageUrl?: string;
  images?: string[];
  description?: string;
  subtitle?: string;
  minStay?: string;
  onList?: () => void;
  onUnlist?: () => void;
  onAskForEdit?: () => void;
  onRefreshAvailability?: () => void;
  propertyId?: string;
  property?: Property; // Full property object for refresh status
  isSubmitting?: boolean;
  isRefreshing?: boolean;
}

// Styled component for the refresh indicator
const RefreshIndicator = styled.button<{ status: 'needs_refresh' | 'recently_refreshed' | 'never_refreshed' }>`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
  
  ${({ status }) => {
    switch (status) {
      case 'needs_refresh':
        return `
          border-color: #ef4444;
          color: #ef4444;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
          
          &:hover {
            background: #fef2f2;
            transform: scale(1.05);
          }
        `;
      case 'never_refreshed':
        return `
          border-color: #f59e0b;
          color: #f59e0b;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
          
          &:hover {
            background: #fffbeb;
            transform: scale(1.05);
          }
        `;
      case 'recent':
        return `
          border-color: #10b981;
          color: #10b981;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
          cursor: default;
          
          &:hover {
            background: #f0fdf4;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const RefreshTooltip = styled.div<{ visible: boolean }>`
  position: absolute;
  top: -45px;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.3;
  white-space: nowrap;
  opacity: ${({ visible }) => visible ? 1 : 0};
  visibility: ${({ visible }) => visible ? 'visible' : 'hidden'};
  transition: all 0.2s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 12px;
    border: 5px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
  }
`;

const PropertyCardAdvertiserSide: React.FC<PropertyCardProps> = ({
  title,
  location,
  price,
  bedrooms,
  bathrooms,
  area,
  imageUrl,
  images,
  description,
  subtitle,
  minStay,
  onList,
  onUnlist,
  onAskForEdit,
  onRefreshAvailability,
  propertyId,
  property,
  isSubmitting = false,
  isRefreshing = false
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Handle image navigation
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images && images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images && images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }
  };

  // Handle refresh availability
  const handleRefreshClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Don't allow refresh if recently refreshed (within 7 days)
    if (refreshStatus?.status === 'recent') {
      return;
    }
    
    if (onRefreshAvailability && !isRefreshing) {
      onRefreshAvailability();
    }
  };

  // Get refresh status
  const refreshStatus = property ? getRefreshStatus(property) : null;

  // Determine which image to display
  const hasMultipleImages = images && images.length > 1;
  const displayImage = hasMultipleImages 
    ? images[currentImageIndex] 
    : (images && images.length > 0) ? images[0] : (imageUrl || propertyExamplePic);

  // Get refresh icon based on status
  const getRefreshIcon = () => {
    if (isRefreshing) {
      return <IoRefreshOutline style={{ animation: 'spin 1s linear infinite' }} />;
    }
    
    if (!refreshStatus) {
      return <IoRefreshOutline />;
    }
    
    switch (refreshStatus.status) {
      case 'needs_refresh':
        return <IoWarningOutline />;
      case 'never_refreshed':
        return <IoRefreshOutline />;
      case 'recent':
        return <IoCheckmarkCircleOutline />;
      default:
        return <IoRefreshOutline />;
    }
  };

  // Check if refresh is disabled (recently refreshed)
  const isRefreshDisabled = refreshStatus?.status === 'recent' || isRefreshing || isSubmitting;

  return (
    <CardBaseModelStyle2>
        <div className="image-container">
          <img src={displayImage} alt="Property" />
          
          {/* Refresh Indicator */}
          {refreshStatus && (
            <RefreshIndicator
              status={refreshStatus.status}
              onClick={handleRefreshClick}
              disabled={isRefreshDisabled}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {getRefreshIcon()}
              <RefreshTooltip visible={showTooltip}>
                {isRefreshing ? (
                  'Refreshing...'
                ) : refreshStatus.status === 'needs_refresh' ? (
                  'Needs refresh - Click to update'
                ) : refreshStatus.status === 'never_refreshed' ? (
                  'Never refreshed - Click to confirm availability'
                ) : refreshStatus.status === 'recent' ? (
                  `Recently refreshed ${formatTimeAgo(property!.lastAvailabilityRefresh!)}`
                ) : (
                  `Last refreshed ${formatTimeAgo(property!.lastAvailabilityRefresh!)}`
                )}
              </RefreshTooltip>
            </RefreshIndicator>
          )}
          
          {hasMultipleImages && (
            <>
              <button 
                className="nav-button prev" 
                onClick={prevImage} 
                aria-label="Previous image"
              >
                <IoChevronBackOutline />
              </button>
              <button 
                className="nav-button next" 
                onClick={nextImage} 
                aria-label="Next image"
              >
                <IoChevronForwardOutline />
              </button>
              <div className="pagination-dots">
                {images.map((_, index) => (
                  <span 
                    key={index} 
                    className={index === currentImageIndex ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="title">
            <b>{title}</b> 
            <span> {subtitle || location}</span>
        </div>  

        {price && <div className="price">{price}</div>}

        {description && (
          <div className="description">
              {description}
          </div>
        )}

        {(bedrooms || bathrooms || area) && (
          <div className="features">
            {bedrooms && <span>{bedrooms} Bed</span>}
            {bathrooms && <span>{bathrooms} Bath</span>}
            {area && <span>{area} sqft</span>}
          </div>
        )}

        {minStay && (
          <div className="min-stay">
            {minStay}
          </div>
        )}

        <div className="control">
            <div className="button">
              {onUnlist ? (
                <BpurpleButtonLB40 text="Unlist" onClick={onUnlist} disabled={isSubmitting} />
              ) : onList ? (
                <BpurpleButtonLB40 text="List" onClick={onList} disabled={isSubmitting} />
              ) : (
                <BpurpleButtonLB40 text="Unlist" disabled />
              )}
            </div>
            <div className="button">
              <PurpleButtonLB40 
                text="Ask for Edit"
                onClick={onAskForEdit}
                disabled={!onAskForEdit || isSubmitting} 
              />
            </div>
        </div>
        
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
    </CardBaseModelStyle2>
  );
};

export default PropertyCardAdvertiserSide;

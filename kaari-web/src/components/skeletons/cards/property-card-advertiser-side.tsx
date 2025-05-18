import React, { useState } from 'react';
import propertyExamplePic from "../../../assets/images/propertyExamplePic.png";
import { CardBaseModelStyle2 } from "../../styles/cards/card-base-model-style-2";
import { PurpleButtonLB40 } from '../buttons/purple_LB40';
import { BpurpleButtonLB40 } from '../buttons/border_purple_LB40';
import { Theme } from "../../../theme/theme";
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

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
  propertyId?: string;
  isSubmitting?: boolean;
}

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
  propertyId,
  isSubmitting = false
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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

  // Determine which image to display
  const hasMultipleImages = images && images.length > 1;
  const displayImage = hasMultipleImages 
    ? images[currentImageIndex] 
    : (images && images.length > 0) ? images[0] : (imageUrl || propertyExamplePic);

  return (
    <CardBaseModelStyle2>
        <div className="image-container">
          <img src={displayImage} alt="Property" />
          
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
    </CardBaseModelStyle2>
  );
};

export default PropertyCardAdvertiserSide;

import { CardBaseModelStyle1 } from "../../styles/cards/card-base-model-style-1";
import { CertificationBanner } from "../banners/static/certification-banner";
import { IoHeartOutline, IoHeart, IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import React, { memo, useState } from "react";
import { useTranslation } from 'react-i18next';
import defaultImage from "../../../assets/images/propertyExamplePic.png";

interface PropertyCardProps {
  id: string | number;
  title: string;
  description: string;
  subtitle: string;
  price: string | number;
  priceType?: string;
  propertyType: string;
  minstay?: string;
  image?: string;
  images?: string[];
  isRecommended?: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: string | number) => void;
  onClick?: () => void;
}

// Create the component
const PropertyCardComponent = ({
  id,
  title, 
  description,
  subtitle, 
  price, 
  priceType = '/month',
  propertyType,
  minstay, 
  image,
  images,
  isRecommended = false,
  isFavorite, 
  onToggleFavorite,
  onClick
}: PropertyCardProps) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Use the prop directly instead of local state to ensure consistency
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Propagate change to parent component if callback provided
    if (onToggleFavorite && id !== undefined) {
      console.log("Property card calling onToggleFavorite with ID:", id);
      // Pass the id directly without trying to convert it
      onToggleFavorite(id);
    } else {
      console.warn("Cannot toggle favorite: missing callback or ID", { onToggleFavorite, id });
    }
  };

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
    : (images && images.length > 0) ? images[0] : (image || defaultImage);

  return (
    <CardBaseModelStyle1 
      $isRecommended={isRecommended}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
        <div className="image">
            <img src={displayImage} alt="Property" />
            
            {hasMultipleImages && (
              <>
                <button className="nav-button prev" onClick={prevImage} aria-label="Previous image">
                  <IoChevronBackOutline />
                </button>
                <button className="nav-button next" onClick={nextImage} aria-label="Next image">
                  <IoChevronForwardOutline />
                </button>
                <div className="pagination-dots">
                  {images.map((_, index) => (
                    <span 
                      key={index} 
                      className={`dot ${index === currentImageIndex ? 'active' : ''}`}
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
            
            <div className="certifications">
                <CertificationBanner purple text={t('property_card.kaari_verified')}></CertificationBanner>
                <CertificationBanner text={t('property_card.tenant_protection')}></CertificationBanner>
            </div>
            <div className="favorite-icon" onClick={toggleFavorite}>
                {isFavorite ? <IoHeart className="filled" /> : <IoHeartOutline />}
            </div>
        </div>
        <div className="title">
            <b>{title}</b>
            <span>{subtitle}</span>
        </div>  
        <div className="subtitle">
            {minstay}
        </div>
        <div className="price">
            {price} <b>{priceType}</b>
        </div>
        <div className="description">
            {description}
        </div>
        {isRecommended && (
          <div className="recommendedBanner">
              <div className="banner">{t('property_card.recommended')}</div>
          </div>
        )}
    </CardBaseModelStyle1>
  );
};

// Memoize and export the component
export const PropertyCard = memo(PropertyCardComponent, (prevProps, nextProps) => {
  // Only re-render if these key props change
  return (
    prevProps.id === nextProps.id &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.title === nextProps.title &&
    prevProps.price === nextProps.price &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.image === nextProps.image &&
    prevProps.images === nextProps.images
  );
});

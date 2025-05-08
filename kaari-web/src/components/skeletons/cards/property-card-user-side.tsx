import { CardBaseModelStyle1 } from "../../styles/cards/card-base-model-style-1";
import { CertificationBanner } from "../banners/static/certification-banner";
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import React, { memo } from "react";
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

  // Get the first image from images array if available, otherwise use image prop or default
  const displayImage = (images && images.length > 0) ? images[0] : (image || defaultImage);

  return (
    <CardBaseModelStyle1 
      $isRecommended={isRecommended}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
        <div className="image">
            <img src={displayImage} alt="Property" />
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

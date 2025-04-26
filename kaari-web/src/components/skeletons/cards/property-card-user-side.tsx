import { CardBaseModelStyle1 } from "../../styles/cards/card-base-model-style-1";
import { CertificationBanner } from "../banners/static/certification-banner";
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import React, { memo } from "react";

interface PropertyCardProps {
  id: string | number;
  title: string;
  description: string;
  subtitle: string;
  price: string | number;
  priceType?: string;
  propertyType: string;
  minstay?: string;
  image: string;
  isRecommended?: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: string | number) => void;
}

// Create the component
const PropertyCardComponent = ({
  image, 
  title, 
  subtitle, 
  price, 
  minstay, 
  priceType, 
  description, 
  isRecommended, 
  isFavorite, 
  onToggleFavorite,
  id
}: PropertyCardProps) => {
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

  return (
    <CardBaseModelStyle1 $isRecommended={isRecommended}>
        <div className="image">
            <img src={image} alt="Property" />
            <div className="certifications">
                <CertificationBanner purple text='Kaari Verified'></CertificationBanner>
                <CertificationBanner text='Tenants Protection'></CertificationBanner>
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
              <div className="banner">Recommended by Kaari</div>
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
    prevProps.price === nextProps.price
  );
});

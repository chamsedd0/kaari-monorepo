import { CardBaseModelStyle1 } from "../../styles/cards/card-base-model-style-1";
import { CertificationBanner } from "../banners/static/certification-banner";
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import { useState, useEffect } from "react";

export const PropertyCard = ({
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
}: {
  title: string, 
  subtitle: string, 
  price: string, 
  priceType: string, 
  minstay: string, 
  description: string, 
  isRecommended: boolean, 
  image: string, 
  isFavorite?: boolean,
  onToggleFavorite?: (id: number) => void,
  id?: number
}) => {
  const [favorite, setFavorite] = useState(isFavorite || false);
  
  // Update local state when prop changes
  useEffect(() => {
    setFavorite(isFavorite || false);
  }, [isFavorite]);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Update local state
    setFavorite(!favorite);
    
    // Propagate change to parent component if callback provided
    if (onToggleFavorite && id !== undefined) {
      onToggleFavorite(id);
    }
  };

  return (
    <CardBaseModelStyle1 isRecommended={isRecommended}>
        <div className="image">
            <img src={image} alt="Property" />
            <div className="certifications">
                <CertificationBanner purple text='Kaari Verified'></CertificationBanner>
                <CertificationBanner text='Tenants Protection'></CertificationBanner>
            </div>
            <div className="favorite-icon" onClick={toggleFavorite}>
                {favorite ? <IoHeart className="filled" /> : <IoHeartOutline />}
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

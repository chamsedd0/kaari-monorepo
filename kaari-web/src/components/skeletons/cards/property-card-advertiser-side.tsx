import React from 'react';
import propertyExamplePic from "../../../assets/images/propertyExamplePic.png";
import { CardBaseModelStyle2 } from "../../styles/cards/card-base-model-style-2";
import { PurpleButtonLB40 } from '../buttons/purple_LB40';
import { BpurpleButtonLB40 } from '../buttons/border_purple_LB40';

interface PropertyCardProps {
  title: string;
  location?: string;
  price?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  imageUrl?: string;
  description?: string;
  subtitle?: string;
  minStay?: string;
  onList?: () => void;
  onUnlist?: () => void;
  onAskForEdit?: () => void;
  propertyId?: string;
}

const PropertyCardAdvertiserSide: React.FC<PropertyCardProps> = ({
  title,
  location,
  price,
  bedrooms,
  bathrooms,
  area,
  imageUrl,
  description,
  subtitle,
  minStay,
  onList,
  onUnlist,
  onAskForEdit,
  propertyId
}) => {
  return (
    <CardBaseModelStyle2>
        <img src={imageUrl || propertyExamplePic} alt="Property" />
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
                <BpurpleButtonLB40 text="Unlist" onClick={onUnlist} />
              ) : onList ? (
                <BpurpleButtonLB40 text="List" onClick={onList} />
              ) : (
                <BpurpleButtonLB40 text="Unlist" disabled />
              )}
            </div>
            <div className="button">
              <PurpleButtonLB40 
                text="Ask for Edit"
                onClick={onAskForEdit}
                disabled={!onAskForEdit} 
              />
            </div>
        </div>
    </CardBaseModelStyle2>
  );
};

export default PropertyCardAdvertiserSide;

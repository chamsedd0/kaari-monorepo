import React from "react";
import { useNavigate } from "react-router-dom";
import { PropertyRequestCardStyle } from "../../styles/cards/card-send-request-style";
import { CertificationBanner } from "../banners/static/certification-banner";
import { PurpleButtonLB60 } from "../buttons/purple_LB60";
import InfoIcon from "../icons/detailsIcon.svg";
import LikeBannerBaseModelLikeVariant1 from "../banners/status/banner-base-model-like-variant-1";
import ShareButton from "../buttons/button-share";

interface PropertyRequestCardProps {
    title: string;
    isVerified: boolean;
    advertiserName: string;
    advertiserImage: string;
    moveInDate: string;
    priceFor30Days: number;
    serviceFee: number;
    totalPrice: number;
    propertyId?: string;
  }
  
  const PropertyRequestCard: React.FC<PropertyRequestCardProps> = ({ 
    title, 
    isVerified, 
    advertiserName, 
    advertiserImage, 
    moveInDate, 
    priceFor30Days, 
    serviceFee, 
    totalPrice,
    propertyId = '123' // Default value for demo
  }) => {
  const navigate = useNavigate();

  const handleSendRequest = () => {
    // Store property details in localStorage or sessionStorage for checkout process
    sessionStorage.setItem('checkoutPropertyDetails', JSON.stringify({
      propertyId,
      title,
      advertiserName,
      moveInDate,
      priceFor30Days,
      serviceFee,
      totalPrice
    }));
    
    // Navigate to the checkout process
    navigate('/checkout-process');
  };

  return (
    <PropertyRequestCardStyle>
      <div className="title">
        {title}
        {isVerified && <CertificationBanner purple text="Kaari Verified" />}
      </div>
      
      <div className="advertiser-information">
        <div className="info-title">The advertiser</div>
        <div className="profile-info">
          <div className="profile">
            <img src={advertiserImage} alt="Profile" />
            <div className="name">{advertiserName}</div>
          </div>
          <div className="view-profile" onClick={() => navigate(`/advertiser-profile/${advertiserName}`)}>View Profile</div>
        </div>
      </div>
      
      <div className="move-in-date">
        <div className="info-title">Move in date</div>
        <div className="details">
          <div className="move-in-date-display">{moveInDate}</div>
          <div className="buttons">
            <ShareButton />
            <LikeBannerBaseModelLikeVariant1 />
          </div>
        </div>
      </div>
      
      <div className="price-breakdown">
        <div className="row first">Price <img src={InfoIcon} alt="info" /></div>
        <div className="row">
          <span>Price for 30 days</span>
          <span>{priceFor30Days} $</span>
        </div>
        <div className="row">
          <span>Service fee</span>
          <span>{serviceFee} $</span>
        </div>
        <div className="separation-line"></div>
        <div className="row total">
          <span>In Total</span>
          <span className="total-price">{totalPrice} $</span>
        </div>
      </div>
      
      <PurpleButtonLB60 text='Send A Request' onClick={handleSendRequest} />
      <div className="disclaimer">
            You will not pay anything yet
      </div>
    </PropertyRequestCardStyle>
  );
};

export default PropertyRequestCard;

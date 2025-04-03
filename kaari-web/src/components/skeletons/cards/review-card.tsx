import React from 'react';
import { WrittenReviewsCard } from '../../styles/cards/card-base-model-style-written-reviews';
import picture from '../../../assets/images/propertyExamplePic.png';
import avatar from '../../../assets/images/ProfilePicture.png';
import StarIcon from '../icons/Icon-Star.svg';

interface ReviewCardProps {
  propertyImage?: string;
  propertyTitle?: string;
  postedDate?: string;
  lengthOfStay?: string;
  reviewText?: string;
  reviewerImage?: string;
  reviewerName?: string;
  ratings?: {
    landlord: number;
    neighbourhood: number;
    publicTransport: number;
    accommodation: number;
    servicesNearby: number;
  };
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  propertyImage = picture,
  propertyTitle = "Property Title",
  postedDate = "January 1, 2023",
  lengthOfStay = "1 month",
  reviewText = "No review text provided",
  reviewerImage = avatar,
  reviewerName = "Turan M.",
  ratings = {
    landlord: 5,
    neighbourhood: 5,
    publicTransport: 5,
    accommodation: 5,
    servicesNearby: 5
  }
}) => {
  const renderStars = (rating: number) => (
    <div className="stars">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="star">
          <img 
            src={StarIcon} 
            alt="star"
            className={index < rating ? '' : 'empty'}
          />
        </div>
      ))}
    </div>
  );

  return (
    <WrittenReviewsCard>
      <div className="property-info">
        <div className="property-image">
          <img src={propertyImage} alt={propertyTitle} />
        </div>
        <div className="property-text">
          <h2 className="title">{propertyTitle}</h2>
          <div className="subtitle">
            <p className="posted-date">Posted: <b>{postedDate}</b></p>
            <p className="length-of-stay">Length of stay: <b>{lengthOfStay}</b></p>
          </div>
        </div>
      </div>
      
      <p className="property-review-text">{reviewText}</p>

      <div className="reviewer-info">
          <div className="reviewer-image">
            <img src={reviewerImage} alt={reviewerName} />
          </div>
          <span className="name">{reviewerName}</span>
      </div>
      
      <div className="ratings-container">
        <div className="ratings-grid">
          <div className="rating-item">
            <span className="label">Landlord</span>
            {renderStars(ratings.landlord)}
          </div>
          <div className="rating-item">
            <span className="label">Accommodation</span>
            {renderStars(ratings.accommodation)}
          </div>
          <div className="rating-item">
            <span className="label">Neighbourhood safety</span>
            {renderStars(ratings.neighbourhood)}
          </div>
          <div className="rating-item">
            <span className="label">Services nearby</span>
            {renderStars(ratings.servicesNearby)}
          </div>
          <div className="rating-item">
            <span className="label">Public Transport</span>
            {renderStars(ratings.publicTransport)}
          </div>
        </div>

       
      </div>
    </WrittenReviewsCard>
  );
};

export default ReviewCard;

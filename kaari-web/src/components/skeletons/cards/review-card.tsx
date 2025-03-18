import React from 'react';
import { WrittenReviewsCard } from '../../styles/cards/card-base-modal-style-written-reviews';
import picture from '../../../assets/images/propertyExamplePic.png'
import avatar from '../../../assets/images/ProfilePicture.png'

interface ReviewCardProps {
  propertyImage?: string;
  propertyTitle?: string;
  postedDate?: string;
  lengthOfStay?: string;
  reviewText?: string;
  advertiserImage?: string;
  advertiserName?: string;
  ratings?: {
    category: string;
    score: number;
  }[];
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  propertyImage = picture,
  propertyTitle = "Property Title",
  postedDate = "January 1, 2023",
  lengthOfStay = "1 month",
  reviewText = "No review text provided",
  advertiserImage = avatar,
  advertiserName = "Advertiser Name",
  ratings = [
    { category: "Communication", score: 0 },
    { category: "Accuracy", score: 0 },
    { category: "Location", score: 0 },
    { category: "Value", score: 0 }
  ]
}) => {
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
      
      <h3 className="title">Advertiser Rating</h3>
      
      <div className="advertiser-rating">
        <div className="advertiser-info">
          <div className="advertiser-image">
            <img src={advertiserImage} alt={advertiserName} />
          </div>
          <p className="advertiser-name">{advertiserName}</p>
        </div>
        
        <div className="advertiser-rating-text">
          {ratings.map((rating, index) => (
            <div key={index} className="rating-category">
              <span className="category-name">{rating.category}</span>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <div className="star" key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </WrittenReviewsCard>
  );
};

export default ReviewCard;

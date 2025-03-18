import React from 'react';
import { ReviewsPageStyle } from './styles';
import ReviewsWriteSkeleton from '../../../../components/skeletons/cards/reviews-write';
import ReviewCard from '../../../../components/skeletons/cards/review-card';
const ReviewsPage: React.FC = () => {
    return (
        <ReviewsPageStyle>
            <h1 className="section-title">Your reviews</h1>
            <div className="reviews-content">
                <div className="reviews-to-write">Reviews to write <span className="count-reviews"><b>1</b></span></div>
                <ReviewsWriteSkeleton />
            </div>
            <div className="post-reviews-content">
                <h2 className="post-reviews-content-title">Past Reviews You’ve Written</h2>
                <div className="post-reviews-content-form">
                    <ReviewCard 
                        propertyTitle="Luxury Apartment in Downtown"
                        postedDate="May 15, 2023"
                        lengthOfStay="3 months"
                        reviewText="This was an amazing place to stay. The location was perfect, close to restaurants and public transportation. The apartment was clean and well-maintained. The host was very responsive and helpful throughout my stay."
                        advertiserName="John Smith"
                        ratings={[
                            { category: "Communication", score: 4 },
                            { category: "Accuracy", score: 5 },
                            { category: "Location", score: 5 },
                            { category: "Value", score: 4 }
                        ]}
                    />
                    <ReviewCard 
                        propertyTitle="Cozy Studio near the Beach"
                        postedDate="January 10, 2023"
                        lengthOfStay="1 month"
                        reviewText="I had a wonderful experience staying at this studio. It was exactly as described in the listing. The beach was just a short walk away, and there were plenty of shops and cafes nearby. The host provided excellent recommendations for local attractions."
                        advertiserName="Sarah Johnson"
                        ratings={[
                            { category: "Communication", score: 5 },
                            { category: "Accuracy", score: 4 },
                            { category: "Location", score: 5 },
                            { category: "Value", score: 4 }
                        ]}
                    />
                </div>
            </div>
                </ReviewsPageStyle>
    );
};

export default ReviewsPage;

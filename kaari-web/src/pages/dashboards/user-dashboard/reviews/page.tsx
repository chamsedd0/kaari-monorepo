import React from 'react';
import { ReviewsPageStyle } from './styles';

const ReviewsPage: React.FC = () => {
    return (
        <ReviewsPageStyle>
            <h1 className="section-title">Reviews</h1>
            <div className="reviews-content">
                <p>Your reviews will appear here.</p>
            </div>
        </ReviewsPageStyle>
    );
};

export default ReviewsPage;

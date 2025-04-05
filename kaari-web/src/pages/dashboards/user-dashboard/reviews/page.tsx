import React, { useEffect, useState } from 'react';
import { ReviewsPageStyle } from './styles';
import ReviewsWriteSkeleton from '../../../../components/skeletons/cards/reviews-write';
import ReviewCard from '../../../../components/skeletons/cards/review-card';
import { getReviewsToWrite, getUserReviews } from '../../../../backend/server-actions/ReviewServerActions';
import { useStore } from '../../../../backend/store';
import { Review, Property, User } from '../../../../backend/entities';

interface ReviewToWrite {
  property: Property;
  advertiser: User;
  moveInDate: Date;
}

interface UserReview {
  review: Review;
  property: Property;
}

const ReviewsPage: React.FC = () => {
    const { user } = useStore();
    const [loading, setLoading] = useState(true);
    const [reviewsToWrite, setReviewsToWrite] = useState<ReviewToWrite[]>([]);
    const [userReviews, setUserReviews] = useState<UserReview[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const loadReviewsData = async () => {
            setLoading(true);
            try {
                // Fetch reviews to write and written reviews in parallel
                const [toWriteData, writtenData] = await Promise.all([
                    getReviewsToWrite(),
                    getUserReviews()
                ]);
                
                setReviewsToWrite(toWriteData);
                setUserReviews(writtenData);
                setError(null);
            } catch (err) {
                console.error('Error loading reviews data:', err);
                setError('Failed to load reviews. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        loadReviewsData();
    }, [user?.id]);
    
    // Format date nicely
    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };
    
    return (
        <ReviewsPageStyle>
            <h1 className="section-title">Your reviews</h1>
            
            {loading ? (
                <div className="loading">Loading your reviews...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <>
                    <div className="reviews-content">
                        <div className="reviews-to-write">
                            Reviews to write <span className="count-reviews"><b>{reviewsToWrite.length}</b></span>
                        </div>
                        
                        {reviewsToWrite.length > 0 ? (
                            reviewsToWrite.map((item) => (
                                <ReviewsWriteSkeleton 
                                    key={item.property.id}
                                    title={item.property.title}
                                    moveInDate={formatDate(item.moveInDate)}
                                    advertiserName={item.advertiser.name}
                                    propertyImage={item.property.images?.[0] || undefined}
                                    propertyId={item.property.id}
                                />
                            ))
                        ) : (
                            <div className="no-reviews-to-write">
                                <p>You don't have any properties to review at this time.</p>
                            </div>
                        )}
                    </div>
                    
                    {userReviews.length > 0 && (
                        <div className="post-reviews-content">
                            <h2 className="post-reviews-content-title">Past Reviews You've Written</h2>
                            <div className="post-reviews-content-form">
                                {userReviews.map((item) => (
                                    <ReviewCard 
                                        key={item.review.id}
                                        propertyTitle={item.property.title}
                                        propertyImage={item.property.images?.[0]}
                                        postedDate={formatDate(item.review.createdAt)}
                                        lengthOfStay={item.review.stayDuration}
                                        reviewText={item.review.reviewText}
                                        reviewerImage={user?.profilePicture}
                                        reviewerName={user?.name}
                                        ratings={item.review.ratings}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </ReviewsPageStyle>
    );
};

export default ReviewsPage;

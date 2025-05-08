import React, { useEffect, useState } from 'react';
import { MyReviewsPageStyle } from './styles';
import NeedHelpCardComponent from '../../../../../components/skeletons/cards/need-help-card';
import VerifyEmailCardComponent from '../../../../../components/skeletons/cards/verify-email-card';
import ReviewCard from '../../../../../components/skeletons/cards/review-card';
import { getUserReviews } from '../../../../../backend/server-actions/ReviewServerActions';
import { useStore } from '../../../../../backend/store';
import { Review, Property } from '../../../../../backend/entities';

interface UserReview {
  review: Review;
  property: Property;
}

const MyReviewsPage: React.FC = () => {
    const { user } = useStore();
    const [loading, setLoading] = useState(true);
    const [userReviews, setUserReviews] = useState<UserReview[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const loadUserReviews = async () => {
            setLoading(true);
            try {
                const reviews = await getUserReviews();
                setUserReviews(reviews);
                setError(null);
            } catch (err) {
                console.error('Error loading user reviews:', err);
                setError('Failed to load your reviews. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        loadUserReviews();
    }, [user?.id]);
    
    // Format date nicely
    const formatDate = (date: Date | any): string => {
        if (!date) return 'Date not available';
        
        try {
            // Handle different types of date inputs
            let dateObj: Date;
            
            // Check if it's already a Date object
            if (date instanceof Date) {
                dateObj = date;
            } 
            // Handle Firestore timestamp (object with seconds property)
            else if (typeof date === 'object' && 'seconds' in date) {
                dateObj = new Date(date.seconds * 1000);
            }
            // Handle string or any other format
            else {
                dateObj = new Date(date);
            }
            
            // Check if the date is valid
            if (isNaN(dateObj.getTime())) {
                console.warn('Invalid date encountered:', date);
                return 'Date not available';
            }
            
            return dateObj.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error, date);
            return 'Date not available';
        }
    };
    
    return (
        <MyReviewsPageStyle>
            <div className="left">
                <div className="top-section">
                    <h1 className="page-title">My Reviews</h1>
                    <h2 className="section-title">Reviews You've Written</h2>
                    <p className="section-info">
                        View and manage all the reviews you've written for properties you've stayed at.
                    </p>
                </div>
                
                {loading ? (
                    <div className="loading">Loading your reviews...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : userReviews.length > 0 ? (
                    <div className="reviews-list">
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
                ) : (
                    <div className="no-reviews">
                        <p>You haven't written any reviews yet.</p>
                        <p>After staying at a property, you'll be able to share your experience by writing a review.</p>
                    </div>
                )}
            </div>
            <div className="right">
                <VerifyEmailCardComponent />
                <NeedHelpCardComponent 
                    title="Need Help?" 
                    faqItems={[
                        {
                            question: "How do I edit my review?",
                            onClick: () => {}
                        },
                        {
                            question: "Why can't I see my review?",
                            onClick: () => {}
                        },
                        {
                            question: "How long do reviews stay visible?",
                            onClick: () => {}
                        }
                    ]} 
                />
            </div>
        </MyReviewsPageStyle>
    );
};

export default MyReviewsPage;

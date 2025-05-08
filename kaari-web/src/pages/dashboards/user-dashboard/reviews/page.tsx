import React, { useEffect, useState } from 'react';
import { ReviewsPageStyle } from './styles';
import ReviewsWriteSkeleton from '../../../../components/skeletons/cards/reviews-write';
import ReviewCard from '../../../../components/skeletons/cards/review-card';
import { getReviewsToWrite, getUserReviews } from '../../../../backend/server-actions/ReviewServerActions';
import { getActiveReviewPrompts } from '../../../../backend/server-actions/ReviewManagementActions';
import { useStore } from '../../../../backend/store';
import { Review, Property, User } from '../../../../backend/entities';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { FaStar, FaBell, FaExclamationTriangle } from 'react-icons/fa';

// Enhanced notification banner for reviews with high visibility
const ReviewNotificationBanner = styled.div`
    background-color: ${Theme.colors.primary};
    border-radius: ${Theme.borders.radius.md};
    padding: 20px 24px;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    box-shadow: 0 8px 16px rgba(99, 102, 241, 0.25);
    border: 2px solid ${Theme.colors.tertiary};
    animation: pulse 2s infinite;
    
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.5);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
      }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 16px;
        
        .icon {
            font-size: 24px;
            color: ${Theme.colors.tertiary};
        }
        
        .text-container {
            display: flex;
            flex-direction: column;
            gap: 4px;
            
            .title {
                font: ${Theme.typography.fonts.largeB};
                margin: 0;
            }
            
            .subtitle {
                font: ${Theme.typography.fonts.mediumM};
                opacity: 0.9;
            }
        }
    }
    
    .write-review-link {
        background-color: white;
        color: ${Theme.colors.primary};
        padding: 10px 18px;
        border-radius: ${Theme.borders.radius.sm};
        font: ${Theme.typography.fonts.mediumB};
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s;
        border: 2px solid white;
        white-space: nowrap;
        
        &:hover {
            background-color: ${Theme.colors.tertiary};
            transform: translateY(-2px);
        }
        
        .icon {
            font-size: 16px;
        }
    }
`;

interface ReviewToWrite {
  property: Property;
  advertiser: User;
  moveInDate: Date;
}

interface UserReview {
  review: Review;
  property: Property;
}

interface ReviewPrompt {
  id: string;
  propertyId: string;
}

const ReviewsPage: React.FC = () => {
    const { user } = useStore();
    const [loading, setLoading] = useState(true);
    const [reviewsToWrite, setReviewsToWrite] = useState<ReviewToWrite[]>([]);
    const [userReviews, setUserReviews] = useState<UserReview[]>([]);
    const [reviewPrompts, setReviewPrompts] = useState<ReviewPrompt[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const loadReviewsData = async () => {
            setLoading(true);
            try {
                // Fetch reviews to write, written reviews, and active prompts in parallel
                const [toWriteData, writtenData, promptsData] = await Promise.all([
                    getReviewsToWrite(),
                    getUserReviews(),
                    getActiveReviewPrompts()
                ]);
                
                console.log('Reviews to write:', toWriteData);
                console.log('Active prompts:', promptsData);
                
                setReviewsToWrite(toWriteData);
                setUserReviews(writtenData);
                setReviewPrompts(promptsData);
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
    
    // Find promptId for a property if it exists
    const getPromptIdForProperty = (propertyId: string): string | undefined => {
        const prompt = reviewPrompts.find(p => p.propertyId === propertyId);
        return prompt?.id;
    };
    
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
        <ReviewsPageStyle>
            <h1 className="section-title">Your reviews</h1>
            
            {loading ? (
                <div className="loading">Loading your reviews...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <>
                    {reviewsToWrite.length > 0 && (
                        <ReviewNotificationBanner>
                            <div className="notification-content">
                                <FaExclamationTriangle className="icon" />
                                <div className="text-container">
                                    <h3 className="title">You have {reviewsToWrite.length} {reviewsToWrite.length === 1 ? 'property' : 'properties'} waiting for review!</h3>
                                    <div className="subtitle">
                                        Share your experience to help other students find great accommodations
                                    </div>
                                </div>
                            </div>
                            {reviewsToWrite.length === 1 ? (
                                <Link 
                                    to={`/dashboard/user/reviews/write?propertyId=${reviewsToWrite[0].property.id}${
                                        getPromptIdForProperty(reviewsToWrite[0].property.id) 
                                            ? `&promptId=${getPromptIdForProperty(reviewsToWrite[0].property.id)}` 
                                            : ''
                                    }`} 
                                    className="write-review-link"
                                >
                                    <FaStar className="icon" /> Write Review Now
                                </Link>
                            ) : (
                                <Link to="#reviews-to-write" className="write-review-link">
                                    <FaStar className="icon" /> View Properties
                                </Link>
                            )}
                        </ReviewNotificationBanner>
                    )}
                
                    <div id="reviews-to-write" className="reviews-content">
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
                                    promptId={getPromptIdForProperty(item.property.id)}
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

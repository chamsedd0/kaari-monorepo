import React, { useEffect, useState } from 'react';
import { ReviewsPageStyle } from './styles';
import ReviewCard from '../../../../components/skeletons/cards/review-card';
import SelectFieldBaseModelVariant2 from '../../../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2';
import { useTranslation } from 'react-i18next';
import { getAdvertiserPropertyReviews } from '../../../../backend/server-actions/AdvertiserServerActions';
import { Review, Property, User } from '../../../../backend/entities';
import LoadingSpinner from '../../../../components/loading/LoadingSpinner';
import { format, isValid } from 'date-fns';

// Define interface for review data
interface ReviewData {
  review: Review;
  property: Property;
  reviewer: User | null;
}

const ReviewsPage: React.FC = () => {
    const { t } = useTranslation();
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    
    // Fetch reviews when component mounts
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewsData = await getAdvertiserPropertyReviews();
                setReviews(reviewsData);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
                setError('Failed to load reviews. Please try again later.');
                setLoading(false);
            }
        };
        
        fetchReviews();
    }, []);
    
    // Format date to user-friendly string - with robust error handling
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
            
            // Validate date before formatting
            if (!isValid(dateObj)) {
                return 'Date not available';
            }
            
            return format(dateObj, 'MMMM d, yyyy');
        } catch (error) {
            console.error('Error formatting date:', error, date);
            return 'Date not available';
        }
    };
    
    // Handle filter change
    const handleFilterChange = (value: string) => {
        setFilterStatus(value);
    };
    
    return (
        <ReviewsPageStyle>
            <h1 className="reviews-title">{t('advertiser_dashboard.reviews.title')}</h1>
            <div className="reviews-select-container">
                <SelectFieldBaseModelVariant2
                    placeholder={t('advertiser_dashboard.reviews.select_status')}   
                    options={[
                      t('advertiser_dashboard.reviews.status_all'), 
                      t('advertiser_dashboard.reviews.status_pending'), 
                      t('advertiser_dashboard.reviews.status_approved'), 
                      t('advertiser_dashboard.reviews.status_rejected')
                    ]}
                    onChange={handleFilterChange}
                />
            </div>
            
            {loading ? (
                <div className="loading-container">
                    <LoadingSpinner />
                </div>
            ) : error ? (
                <div className="error-message">
                    {error}
                </div>
            ) : reviews.length === 0 ? (
                <div className="no-reviews-message">
                    <p>{t('advertiser_dashboard.reviews.no_reviews')}</p>
                </div>
            ) : (
                <div className="reviews-container">
                    {reviews.map((reviewData) => (
                        <ReviewCard 
                            key={reviewData.review.id}
                            propertyImage={reviewData.property.images?.[0]}
                            propertyTitle={reviewData.property.title}
                            postedDate={formatDate(reviewData.review.createdAt)}
                            lengthOfStay={reviewData.review.stayDuration}
                            reviewText={reviewData.review.reviewText}
                            reviewerImage={reviewData.reviewer?.profilePicture}
                            reviewerName={reviewData.reviewer?.name || 'Anonymous User'}
                            ratings={reviewData.review.ratings}
                        />
                    ))}
                </div>
            )}
        </ReviewsPageStyle>
    );
};

export default ReviewsPage;

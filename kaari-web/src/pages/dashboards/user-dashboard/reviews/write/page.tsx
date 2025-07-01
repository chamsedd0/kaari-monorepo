import React, { useEffect, useState } from 'react';
import { WriteReviewPageStyle } from './styles';
import { createReview } from '../../../../../backend/server-actions/ReviewServerActions';
import { createReviewEnhanced } from '../../../../../backend/server-actions/EnhancedReviewActions';
import { getDocumentById } from '../../../../../backend/firebase/firestore';
import { Property, User } from '../../../../../backend/entities';
import NeedHelpCardComponent from '../../../../../components/skeletons/cards/need-help-card';
import { PurpleButtonMB48 } from '../../../../../components/skeletons/buttons/purple_MB48';
import { WhiteButtonSM32 } from '../../../../../components/skeletons/buttons/white_SM32';
import StarRating from '../../../../../components/skeletons/inputs/star-rating';
import { useNavigate } from 'react-router-dom';

const WriteReviewPage: React.FC = () => {
    const navigate = useNavigate();
    
    // Get property ID and prompt ID from URL query parameters
    const getUrlParams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            propertyId: urlParams.get('propertyId'),
            promptId: urlParams.get('promptId')
        };
    };
    
    const { propertyId, promptId } = getUrlParams();
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    const [property, setProperty] = useState<Property | null>(null);
    const [advertiser, setAdvertiser] = useState<User | null>(null);
    
    // Form state
    const [reviewText, setReviewText] = useState('');
    const [stayDuration, setStayDuration] = useState('');
    const [ratings, setRatings] = useState({
        landlord: 0,
        neighbourhood: 0,
        publicTransport: 0,
        accommodation: 0,
        servicesNearby: 0
    });
    
    // Navigation functions
    const navigateToReviews = () => {
        navigate('/dashboard/user/reviews');
    };
    
    // Load property details when component mounts
    useEffect(() => {
        const loadPropertyDetails = async () => {
            if (!propertyId) {
                setError('No property specified. Please select a property to review.');
                setLoading(false);
                return;
            }
            
            try {
                // Load property details
                const propertyData = await getDocumentById<Property>('properties', propertyId);
                if (!propertyData) {
                    setError('Property not found.');
                    setLoading(false);
                    return;
                }
                
                setProperty(propertyData);
                
                // Load advertiser details
                const advertiserData = await getDocumentById<User>('users', propertyData.ownerId);
                setAdvertiser(advertiserData);
                
                setLoading(false);
            } catch (err) {
                console.error('Error loading property details:', err);
                setError('Failed to load property details. Please try again later.');
                setLoading(false);
            }
        };
        
        if (propertyId) {
            loadPropertyDetails();
        }
    }, [propertyId]);
    
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form
        if (!propertyId) {
            setError('No property specified. Please select a property to review.');
            return;
        }
        
        if (!reviewText.trim()) {
            setError('Please enter your review.');
            return;
        }
        
        if (!stayDuration.trim()) {
            setError('Please specify how long you stayed.');
            return;
        }
        
        // Check if all ratings are provided
        const missingRatings = Object.entries(ratings).some(([, value]) => value === 0);
        if (missingRatings) {
            setError('Please provide all ratings.');
            return;
        }
        
        setSubmitting(true);
        setError(null);
        
        try {
            // Create the review with promptId if it exists
            await createReviewEnhanced(propertyId, {
                stayDuration,
                reviewText,
                ratings,
                moveInDate: new Date(),
                promptId: promptId || undefined
            });
            
            setSuccess(true);
            
            // Redirect after a short delay
            setTimeout(() => {
                navigateToReviews();
            }, 2000);
        } catch (err) {
            console.error('Error submitting review:', err);
            setError('Failed to submit your review. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };
    
    // Handle rating changes
    const handleRatingChange = (category: keyof typeof ratings, value: number) => {
        setRatings(prev => ({
            ...prev,
            [category]: value
        }));
    };
    
    return (
        <WriteReviewPageStyle>
            <div className="left">
                <div className="top-section">
                    <h1 className="page-title">Write a Review</h1>
                    {!loading && property && (
                        <h2 className="property-title">{property.title}</h2>
                    )}
                </div>
                
                {loading ? (
                    <div className="loading">Loading property details...</div>
                ) : error && !property ? (
                    <div className="error">{error}</div>
                ) : success ? (
                    <div className="success">
                        <h3>Thank you for your review!</h3>
                        <p>Your review has been submitted successfully.</p>
                        <p>Redirecting you back to the reviews page...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="review-form">
                        <div className="form-section">
                            <label htmlFor="stayDuration">How long did you stay?</label>
                            <input
                                id="stayDuration"
                                type="text"
                                value={stayDuration}
                                onChange={(e) => setStayDuration(e.target.value)}
                                placeholder="e.g. 2 weeks, 3 months"
                                className="text-input"
                            />
                        </div>
                        
                        <div className="form-section">
                            <label htmlFor="reviewText">Your review</label>
                            <textarea
                                id="reviewText"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Tell us about your experience..."
                                className="text-area"
                                rows={6}
                            />
                        </div>
                        
                        <div className="form-section ratings-section">
                            <h3>Ratings</h3>
                            
                            <div className="rating-item">
                                <span className="rating-label">Landlord Communication</span>
                                <StarRating 
                                    rating={ratings.landlord} 
                                    onRatingChange={(value) => handleRatingChange('landlord', value)} 
                                />
                            </div>
                            
                            <div className="rating-item">
                                <span className="rating-label">Neighbourhood Safety</span>
                                <StarRating 
                                    rating={ratings.neighbourhood} 
                                    onRatingChange={(value) => handleRatingChange('neighbourhood', value)} 
                                />
                            </div>
                            
                            <div className="rating-item">
                                <span className="rating-label">Public Transport</span>
                                <StarRating 
                                    rating={ratings.publicTransport} 
                                    onRatingChange={(value) => handleRatingChange('publicTransport', value)} 
                                />
                            </div>
                            
                            <div className="rating-item">
                                <span className="rating-label">Accommodation</span>
                                <StarRating 
                                    rating={ratings.accommodation} 
                                    onRatingChange={(value) => handleRatingChange('accommodation', value)} 
                                />
                            </div>
                            
                            <div className="rating-item">
                                <span className="rating-label">Services Nearby</span>
                                <StarRating 
                                    rating={ratings.servicesNearby} 
                                    onRatingChange={(value) => handleRatingChange('servicesNearby', value)} 
                                />
                            </div>
                        </div>
                        
                        {error && <div className="form-error">{error}</div>}
                        
                        <div className="form-actions">
                            <WhiteButtonSM32 
                                text="Cancel" 
                                onClick={navigateToReviews} 
                                type="button"
                            />
                            <PurpleButtonMB48 
                                text={submitting ? "Submitting..." : "Submit Review"} 
                                disabled={submitting}
                                type="submit"
                            />
                        </div>
                    </form>
                )}
            </div>
            <div className="right">
                {!loading && property && (
                    <div className="property-card">
                        {property.images && property.images.length > 0 && (
                            <img src={property.images[0]} alt={property.title} className="property-image" />
                        )}
                        <div className="property-info">
                            <h3>{property.title}</h3>
                            <p>{property.address.street}, {property.address.city}</p>
                            {advertiser && (
                                <div className="advertiser-info">
                                    <span>Advertiser: </span>
                                    <strong>{advertiser.name}</strong>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                <NeedHelpCardComponent 
                    title="Need Help?" 
                    faqItems={[
                        {
                            question: "What makes a helpful review?",
                            onClick: () => {}
                        },
                        {
                            question: "Can I edit my review later?",
                            onClick: () => {}
                        },
                        {
                            question: "Will the advertiser see my review?",
                            onClick: () => {}
                        }
                    ]} 
                />
            </div>
        </WriteReviewPageStyle>
    );
};

export default WriteReviewPage; 
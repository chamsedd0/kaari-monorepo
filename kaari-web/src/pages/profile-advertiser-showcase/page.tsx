import { WhiteHeaderUsers } from "../../components/skeletons/constructed/headers/header-users-white";
import { ProfileShowcaseStyle } from "./styles";
import ProfilePic from "../../assets/images/advertiser.png";
import propertyExamplePic from "../../assets/images/propertyExamplePic.png";
import { CertificationBanner } from "../../components/skeletons/banners/static/certification-banner";
import { useState, useEffect } from "react";
import UnifiedHeader from "../../components/skeletons/constructed/headers/unified-header";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "../../backend/server-actions/UserServerActions";
import { getPropertiesByOwner } from "../../backend/server-actions/PropertyServerActions";
import { PropertyCard } from "../../components/skeletons/cards/property-card-user-side";
import defaultPropertyImage from "../../assets/images/propertyExamplePic.png";
import { User, Property } from "../../backend/entities";

export default function ProfileShowcasePage() {
    const [activeTab, setActiveTab] = useState<'ratings' | 'offers'>('offers');
    const [advertiser, setAdvertiser] = useState<User | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Get the id from URL parameter
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (!id) throw new Error("Advertiser ID not provided");
                
                // Fetch advertiser details
                const advertiserData = await getUserById(id);
                if (!advertiserData) throw new Error("Advertiser not found");
                setAdvertiser(advertiserData);
                
                // Fetch advertiser's properties
                const propertiesData = await getPropertiesByOwner(id);
                setProperties(propertiesData);
                
                setError(null);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load advertiser data");
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [id]);

    const formatDate = (date?: Date | string | any) => {
        if (!date) return "N/A";
        
        try {
            // Handle various date formats
            let dateObj;
            
            // If it's a Firestore timestamp with seconds and nanoseconds
            if (date && typeof date === 'object' && 'seconds' in date) {
                dateObj = new Date(date.seconds * 1000);
            } 
            // If it's a string
            else if (typeof date === 'string') {
                dateObj = new Date(date);
            }
            // If it's already a Date object
            else if (date instanceof Date) {
                dateObj = date;
            } 
            // Fallback
            else {
                return "N/A";
            }
            
            // Check if the date is valid
            if (isNaN(dateObj.getTime())) {
                return "N/A";
            }
            
            return dateObj.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return "N/A";
        }
    };
    
    const formatTimeOnPlatform = (date?: Date | string | any) => {
        if (!date) return "N/A";
        
        try {
            // Handle various date formats
            let dateObj;
            
            // If it's a Firestore timestamp with seconds and nanoseconds
            if (date && typeof date === 'object' && 'seconds' in date) {
                dateObj = new Date(date.seconds * 1000);
            } 
            // If it's a string
            else if (typeof date === 'string') {
                dateObj = new Date(date);
            }
            // If it's already a Date object
            else if (date instanceof Date) {
                dateObj = date;
            } 
            // Fallback
            else {
                return "N/A";
            }
            
            // Check if the date is valid
            if (isNaN(dateObj.getTime())) {
                return "N/A";
            }
            
            const now = new Date();
            const diffMs = now.getTime() - dateObj.getTime();
            
            // Convert to days
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            // Calculate years, months, weeks
            const years = Math.floor(diffDays / 365);
            const months = Math.floor(diffDays / 30);
            const weeks = Math.floor(diffDays / 7);
            
            if (years > 0) {
                return years === 1 ? "1 year" : `${years} years`;
            } else if (months > 0) {
                return months === 1 ? "1 month" : `${months} months`;
            } else if (weeks > 0) {
                return weeks === 1 ? "1 week" : `${weeks} weeks`;
            } else {
                return diffDays === 1 ? "1 day" : `${diffDays} days`;
            }
        } catch (error) {
            console.error("Error formatting time on platform:", error);
            return "N/A";
        }
    };
    
    // Calculate time since last online based on updatedAt timestamp
    const getLastOnlineText = (date?: Date | string | any) => {
        if (!date) return "N/A";
        
        try {
            // Handle various date formats
            let dateObj;
            
            // If it's a Firestore timestamp with seconds and nanoseconds
            if (date && typeof date === 'object' && 'seconds' in date) {
                dateObj = new Date(date.seconds * 1000);
            } 
            // If it's a string
            else if (typeof date === 'string') {
                dateObj = new Date(date);
            }
            // If it's already a Date object
            else if (date instanceof Date) {
                dateObj = date;
            } 
            // Fallback
            else {
                return "N/A";
            }
            
            // Check if the date is valid
            if (isNaN(dateObj.getTime())) {
                return "N/A";
            }
            
            const now = new Date();
            const diffMs = now.getTime() - dateObj.getTime();
            
            // Convert to minutes, hours, days
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            // Show the most appropriate time unit
            if (diffMinutes < 1) {
                return "Just now";
            } else if (diffMinutes < 60) {
                return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
            } else if (diffHours < 24) {
                return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
            } else if (diffDays < 7) {
                return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
            } else {
                // For longer periods, show the date
                return dateObj.toLocaleDateString();
            }
        } catch (error) {
            console.error("Error calculating last online time:", error);
            return "N/A";
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error || !advertiser) {
        return <div>Error: {error || "Advertiser not found"}</div>;
    }

    return(
        <ProfileShowcaseStyle>
            <UnifiedHeader variant="white" userType="user" />
            <div className="info-section">
                <img className="image" src={advertiser.profilePicture || ProfilePic} alt="Profile" />
                
                <div className="about-me-section">
                    <span className="about-me-title">About me</span>
                    <p className="about-me-text">
                        {advertiser.aboutMe || "No description provided by the advertiser."}
                    </p>
                    <button className="about-me-button">Show more</button>
                </div>

                <div className="additional-info">
                    <div className="last-online">
                        <span className="title">Last online</span>
                        <span className="subtitle">{getLastOnlineText(advertiser.updatedAt)}</span>
                    </div>
                    <div className="on-kaari-since">
                        <span className="title">On Kaari since</span>
                        <span className="subtitle">{formatTimeOnPlatform(advertiser.createdAt)}</span>
                    </div>
                </div>
            </div>

            <div className="main-section">
                <div className="profile-section">
                    <div className="profile-details">
                        <div className="rating-stars">
                            
                        </div>
                        
                        <div className="profile-information">
                            <h2 className="name">{advertiser.name} {advertiser.surname && advertiser.surname.charAt(0)}.</h2>
                            <div className="certifications">
                                <CertificationBanner purple text="Kaari Verified"></CertificationBanner>
                                <CertificationBanner purple text="Owner since 2022"></CertificationBanner>
                            </div>
                            <span className="location">{advertiser.nationality || "Agadir, Morocco"}</span>
                        </div>

                        <div className="control-buttons">
                            <button 
                                className={`control-button ${activeTab === 'ratings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('ratings')}
                            >
                                Rating and references
                                <span className="icon-counter">2</span>
                            </button>
                            <button 
                                className={`control-button ${activeTab === 'offers' ? 'active' : ''}`}
                                onClick={() => setActiveTab('offers')}
                            >
                                Offers
                                <span className="icon-counter">{properties.length}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="display-section">
                    {activeTab === 'ratings' && (
                        <div className="ratings-content">
                            <h3>Ratings and References</h3>
                            <p>Ratings section is under development.</p>
                        </div>
                    )}
                    {activeTab === 'offers' && (
                        <div className="offers-content">
                            <h3>Offers</h3>
                            {properties.length > 0 ? (
                                <div className="offers-grid">
                                    {properties.map((property) => (
                                        <PropertyCard
                                            key={property.id}
                                            id={property.id}
                                            image={propertyExamplePic}
                                            title={property.title}
                                            subtitle={property.address?.city || 'N/A'}
                                            price={`${property.price} MAD`}
                                            priceType="/month"
                                            minstay={property.minstay || 'Minimum stay: 1 month'}
                                            description={property.description ? 
                                                (property.description.length > 100 ? 
                                                    `${property.description.substring(0, 100)}...` : 
                                                    property.description) : 
                                                'No description available'}
                                            propertyType={property.propertyType}
                                            isFavorite={false}
                                            onToggleFavorite={() => {}}
                                            isRecommended={false}
                                            onClick={() => navigate(`/property/${property.id}`)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p>This advertiser has no available properties at the moment.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ProfileShowcaseStyle>
    )
}
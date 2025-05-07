import { FavouritesStyle } from "./styles";
import React, { useEffect, useState, useRef } from "react";
import UnifiedHeader from "../../components/skeletons/constructed/headers/unified-header";
import { PropertyCard } from "../../components/skeletons/cards/property-card-user-side";
import PropertyPic from "../../assets/images/propertyExamplePic.png";
import LeftArrow from "../../components/skeletons/icons/Icon_Arrow_Left.svg";
import RightArrow from "../../components/skeletons/icons/Icon_Arrow_Right.svg";
import emptyBoxSvg from "../../assets/images/emptybox.svg";
import { getFavoriteProperties, toggleFavoriteProperty } from "../../backend/server-actions/ClientServerActions.tsx";
import { getProperties } from "../../backend/server-actions/PropertyServerActions.tsx";
import { useAuth } from "../../contexts/auth";
import { AuthModal } from "../../components/skeletons/constructed/modals/auth-modal";
import { useNavigate } from "react-router-dom";
import { IoBagOutline } from "react-icons/io5";
import { Property } from "../../backend/entities";
// Import default property images
import livingRoomImage from "../../assets/images/livingRoomExample.png";
import bigCityPic0 from "../../assets/images/BigCityPic0.png";
import bigCityPic1 from "../../assets/images/BigCityPic1.png";
import bigCityPic2 from "../../assets/images/BigCityPic2.png";
import smallPic1 from "../../assets/images/smallPicCity1.png";
import smallPic2 from "../../assets/images/smallPicCity2.png";
import smallPic3 from "../../assets/images/smallPicCity3.png";
import photoshoot1 from "../../assets/images/photoshoot1.png";
import photoshoot2 from "../../assets/images/Photoshoot2.png";
import photoshoot3 from "../../assets/images/Photoshoot3.png";
import photoshoot4 from "../../assets/images/Photoshoot4.png";

// Create an array of default property images
const defaultPropertyImages = [
  PropertyPic,
  livingRoomImage,
  bigCityPic0,
  bigCityPic1,
  bigCityPic2,
  smallPic1,
  smallPic2,
  smallPic3,
  photoshoot1,
  photoshoot2,
  photoshoot3,
  photoshoot4
];

// Function to get a default image based on property ID
const getDefaultPropertyImage = (propertyId: string | number): string => {
  // Use the property ID to consistently select the same image for the same property
  const index = typeof propertyId === 'string' 
    ? propertyId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % defaultPropertyImages.length
    : propertyId % defaultPropertyImages.length;
  
  return defaultPropertyImages[index];
};

// Define PropertyType interface
interface PropertyType {
  id: string | number;
  title: string;
  description: string;
  subtitle?: string;
  propertyType: string;
  price: number;
  priceType?: string;
  minstay?: string;
  image?: string;
  isFavorite: boolean;
}

export const FavouritesPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const favouritesRef = useRef<HTMLDivElement>(null);
    const suggestedRef = useRef<HTMLDivElement>(null);
    
    const [favoriteProperties, setFavoriteProperties] = useState<PropertyType[]>([]);
    const [suggestedProperties, setSuggestedProperties] = useState<PropertyType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    
    // Function to scroll horizontally
    const scroll = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement>) => {
        if (!ref.current) return;
        const scrollAmount = 300;
        const newScrollLeft = direction === 'left' 
            ? ref.current.scrollLeft - scrollAmount 
            : ref.current.scrollLeft + scrollAmount;
        
        ref.current.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    };
    
    // Fetch favorite properties on component mount
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                if (!isAuthenticated) {
                    setLoading(false);
                    return;
                }
                
                setLoading(true);
                
                // Fetch favorite properties
                const favorites = await getFavoriteProperties() as Property[];
                
                // Map to PropertyType format
                const formattedFavorites = favorites.map(property => ({
                    id: property.id,
                    title: property.title,
                    description: property.description,
                    subtitle: property.address.city,
                    propertyType: property.propertyType,
                    price: property.price,
                    priceType: '/month',
                    minstay: property.minstay ? `${property.minstay}` : undefined,
                    image: getDefaultPropertyImage(property.id),
                    isFavorite: true
                }));
                
                setFavoriteProperties(formattedFavorites);
                
                // Fetch some suggested properties (not in favorites)
                const allProperties = await getProperties({ limit: 10 }) as Property[];
                
                // Filter out properties that are already in favorites
                const favoriteIds = favorites.map(p => p.id);
                const suggested = allProperties
                    .filter(p => !favoriteIds.includes(p.id))
                    .slice(0, 7)
                    .map(property => ({
                        id: property.id,
                        title: property.title,
                        description: property.description,
                        subtitle: property.address.city,
                        propertyType: property.propertyType,
                        price: property.price,
                        priceType: '/month',
                        minstay: property.minstay ? `${property.minstay}` : undefined,
                        image: getDefaultPropertyImage(property.id),
                        isFavorite: false
                    }));
                
                setSuggestedProperties(suggested);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching favorites:', error);
                setLoading(false);
            }
        };
        
        fetchFavorites();
    }, [isAuthenticated]);
    
    // Handle favorite toggle
    const handleToggleFavorite = async (propertyId: string | number) => {
        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }
        
        try {
            // Convert number id to string if needed
            const id = propertyId.toString();
            
            // Toggle in the database
            const result = await toggleFavoriteProperty(id);
            
            if (result.added) {
                // If added to favorites, find the property in suggested and move to favorites
                const property = suggestedProperties.find(p => p.id === propertyId);
                if (property) {
                    setFavoriteProperties(prev => [...prev, { ...property, isFavorite: true }]);
                    setSuggestedProperties(prev => prev.filter(p => p.id !== propertyId));
                }
            } else {
                // If removed from favorites, find the property and move to suggested
                const property = favoriteProperties.find(p => p.id === propertyId);
                if (property) {
                    setSuggestedProperties(prev => [...prev, { ...property, isFavorite: false }]);
                    setFavoriteProperties(prev => prev.filter(p => p.id !== propertyId));
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };
    
    // Navigate to property details
    const handlePropertyClick = (propertyId: string | number) => {
        navigate(`/property/${propertyId}`);
    };
    
    // Navigate to browse properties
    const handleBrowseClick = () => {
        navigate('/properties');
    };

    return (
        <FavouritesStyle>
            <UnifiedHeader variant="white" userType="user" />

            <div className="favourites-container">
                <div className="section-header">
                    <h2 className="favourites-title">Favorites</h2>
                    {favoriteProperties.length > 0 && (
                    <div className="navigation-buttons">
                        <button onClick={() => scroll('left', favouritesRef)}>
                            <img src={LeftArrow} alt="Left Arrow" />
                        </button>
                        <button onClick={() => scroll('right', favouritesRef)}>
                            <img src={RightArrow} alt="Right Arrow" />
                        </button>
                    </div>
                    )}
                </div>
                
                {loading ? (
                    <div className="loading-state">
                        <p>Loading your favorite properties...</p>
                    </div>
                ) : !isAuthenticated ? (
                    <div className="empty-state">
                        <p>Please log in to view your favorites</p>
                        <button onClick={() => setShowAuthModal(true)}>Log In</button>
                    </div>
                ) : favoriteProperties.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <img src={emptyBoxSvg} alt="Empty Box" />
                        </div>
                        <h3>No favorites yet</h3>
                        <p>You haven't added any properties to your favorites yet.</p>
                        <p>Explore available properties and save your favorites!</p>
                        <button className="browse-properties-btn" onClick={handleBrowseClick}>Browse Properties</button>
                    </div>
                ) : (
                <div className="favourites-list" ref={favouritesRef}>
                        {favoriteProperties.map(property => (
                    <PropertyCard 
                                key={property.id}
                                id={property.id}
                                image={property.image || getDefaultPropertyImage(property.id)}
                                title={property.title}
                                subtitle={property.subtitle || ''}
                                description={property.description}
                                price={property.price.toString()}
                                priceType={property.priceType || '/month'}
                                minstay={property.minstay || ''}
                        isRecommended={false}
                                propertyType={property.propertyType}
                                isFavorite={property.isFavorite}
                                onToggleFavorite={handleToggleFavorite}
                                onClick={() => handlePropertyClick(property.id)}
                            />
                        ))}
                </div>
                )}
            </div>

            {!loading && suggestedProperties.length > 0 && (
            <div className="suggested-container">
                <div className="section-header">
                    <h3 className="suggested-title">Suggested</h3>
                    <div className="navigation-buttons">
                        <button onClick={() => scroll('left', suggestedRef)}>
                            <img src={LeftArrow} alt="Left Arrow" />
                        </button>
                        <button onClick={() => scroll('right', suggestedRef)}>
                            <img src={RightArrow} alt="Right Arrow" />
                        </button>
                    </div>
                </div>
                <div className="suggested-list" ref={suggestedRef}>
                        {suggestedProperties.map(property => (
                    <PropertyCard 
                                key={property.id}
                                id={property.id}
                                image={property.image || getDefaultPropertyImage(property.id)}
                                title={property.title}
                                subtitle={property.subtitle || ''}
                                description={property.description}
                                price={property.price.toString()}
                                priceType={property.priceType || '/month'}
                                minstay={property.minstay || ''}
                        isRecommended={false}
                                propertyType={property.propertyType}
                                isFavorite={property.isFavorite}
                                onToggleFavorite={handleToggleFavorite}
                                onClick={() => handlePropertyClick(property.id)}
                            />
                        ))}
                    </div>
                </div>
            )}
            
            {/* Auth Modal */}
            {showAuthModal && (
                <AuthModal
                    isOpen={showAuthModal}
                    onClose={() => setShowAuthModal(false)}
                />
            )}
        </FavouritesStyle>
    );
};

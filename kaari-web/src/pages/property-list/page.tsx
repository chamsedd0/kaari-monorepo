import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMap, IoChevronBackOutline, IoChevronForwardOutline, IoClose } from 'react-icons/io5';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { AppliedFilterBannerComponent } from "../../components/skeletons/banners/static/applied-filter-banner";
import { PropertyCard } from "../../components/skeletons/cards/property-card-user-side";
import SelectFieldBaseModelVariant2 from "../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2"
import { PropertyList } from "./styles"
import { getProperties } from "../../backend/server-actions/PropertyServerActions.tsx";
import SearchFilterBar from "../../components/skeletons/inputs/search-bars/search-filter-bar";
import FilteringSection from "../../components/skeletons/constructed/filtering/filtering-section";
import defaultImage from "../../assets/images/propertyExamplePic.png";

import { useAuth } from "../../contexts/auth";
import { useTranslation } from 'react-i18next';
import { Theme } from "../../theme/theme";
import { AuthModal } from '../../components/skeletons/constructed/modals/auth-modal';
import closeIcon from '../../components/skeletons/icons/Cross-Icon.svg';
import { toggleFavoriteProperty, isPropertyFavorited } from "../../backend/server-actions/ClientServerActions.tsx";



// Updated PropertyType interface to match Firestore data model
interface PropertyType {
  id: string | number;
  ownerId: string;
  title: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  propertyType: 'apartment' | 'house' | 'condo' | 'land' | 'commercial';
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  price: number;
  images: string[];
  amenities: string[];
  features: string[];
  // Only properties with 'available' status are shown in search results
  // Properties with 'occupied' status are filtered out
  status: 'available' | 'occupied';
  createdAt: Date;
  updatedAt: Date;
  listingId?: string;
  // UI specific properties
  isFavorite: boolean;
  isRecommended?: boolean;
  subtitle?: string;
  priceType?: string;
  minstay?: string;
  location?: { lat: number; lng: number } | null;
  image?: string;
  // New rooms property
  rooms?: Array<{
    type: 'bedroom' | 'bathroom' | 'kitchen' | 'storage' | 'living';
    area: number;
  }>;
  // Additional properties for filtering
  availableFrom?: Date | string | any; // Date from which the property is available
  capacity?: number; // Number of people the property can accommodate
  rules?: Array<{
    name: string;
    allowed: boolean;
  }>;
  isFurnished: boolean;
}

// Define sort option type 
type SortOptionType = string;

// Add constants for the Google Maps integration
const GOOGLE_MAPS_API_KEY = 'AIzaSyCqhbPAiPspwgshgE9lzbtkpFZwVMfJoww'; // Temporary hardcoded key - move to .env file for production
const DEFAULT_MAP_CENTER = { lat: 34.020882, lng: -6.841650 }; // Rabat, Morocco as default center
const DEFAULT_MAP_ZOOM = 12;

// Define the map container style
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Declare google namespace to fix type errors
declare global {
  interface Window {
    google: any;
  }
}

// Enhanced property marker component
const PropertyMarkers = memo(({ properties, onPropertyClick, selectedPropertyId }: { 
  properties: PropertyType[], 
  onPropertyClick: (property: PropertyType) => void,
  selectedPropertyId: string | number | null
}) => {
  // Format price for marker labels with proper locale
  const { t } = useTranslation();
  
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(price).replace(/\s/g, '');
  };

  // Count properties with valid locations for debugging
  const propertiesWithLocation = properties.filter(p => p.location);
  console.log(`Rendering ${propertiesWithLocation.length} property markers out of ${properties.length} total properties`);
  
  // Log the first few properties to debug
  if (propertiesWithLocation.length > 0) {
    console.log("Sample property locations:", 
      propertiesWithLocation.slice(0, 3).map(p => ({
        id: p.id,
        title: p.title,
        location: p.location
      }))
    );
  } else {
    console.warn("No properties with location data found");
  }

  return (
    <>
      {properties.map(property => {
        if (property.location && 
            typeof property.location.lat === 'number' && 
            typeof property.location.lng === 'number') {
          const isSelected = selectedPropertyId === property.id;

          // Log each marker being rendered for debugging
          console.log(`Rendering marker for property ${property.id} at location:`, property.location);

          return (
            <Marker
              key={property.id}
              position={property.location}
              onClick={() => onPropertyClick(property)}

              // Simple label-style marker with extreme border radius
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 0, // Invisible circle, we'll just use the label
                labelOrigin: new window.google.maps.Point(0, 0)
              }}
              label={{
                text: formatPrice(property.price),
                color: Theme.colors.black,
                fontWeight: 'bold',
                fontSize: '14px',
                className: `property-price-label ${isSelected ? 'selected' : ''}`
              }}
              animation={isSelected ? window.google.maps.Animation.BOUNCE : null}
              zIndex={isSelected ? 1000 : 1}
            />
          );
        }
        return null;
      })}
    </>
  );
});

// Create a separate component for the map with property popup and markers
const PropertyMap = memo(({ 
  showMap, 
  properties, 
  isCollapsed, 
  setProperties, 
  toggleFavorite, 
  selectedProperty, 
  setSelectedProperty,
  mapCenter,
  mapZoom
}: { 
  showMap: boolean,
  properties: PropertyType[],
  isCollapsed: boolean,
  setProperties: React.Dispatch<React.SetStateAction<PropertyType[]>>,
  toggleFavorite: (id: string | number) => void,
  selectedProperty: PropertyType | null,
  setSelectedProperty: (property: PropertyType | null) => void,
  mapCenter: { lat: number; lng: number },
  mapZoom: number
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mapRef = useRef<google.maps.Map>();
  const geocoderRef = useRef<google.maps.Geocoder>();
  const { isAuthenticated } = useAuth();

  // Debug properties being passed to map
  useEffect(() => {
    if (properties.length > 0) {
      console.log(`PropertyMap received ${properties.length} properties`);
      const withLocations = properties.filter(p => p.location && typeof p.location.lat === 'number');
      console.log(`${withLocations.length} properties have valid location data`);
    }
  }, [properties]);

  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'geometry']
  });

  // Create geocoder instance when maps are loaded
  useEffect(() => {
    if (isLoaded && window.google && window.google.maps) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, [isLoaded]);

  // Handle property click
  const handlePropertyClick = useCallback((property: PropertyType) => {
    setSelectedProperty(property);
  }, [setSelectedProperty]);

  // Handle view property button click
  const handleViewProperty = useCallback((propertyId: string | number) => {
    // Navigate to property details page
    navigate(`/property/${propertyId}`);
  }, [navigate]);

  // Geocode properties without location data
  useEffect(() => {
    const geocodeProperties = async () => {
      if (!isLoaded || !geocoderRef.current) return;

      const propertiesWithoutLocation = properties.filter(
        p => (!p.location || typeof p.location?.lat !== 'number' || typeof p.location?.lng !== 'number') && 
             p.address && p.address.street && p.address.city
      );

      if (propertiesWithoutLocation.length === 0) return;

      // Make a copy of properties to update
      const updatedProperties = [...properties];

      // Process geocoding for each property without location
      for (const property of propertiesWithoutLocation) {
        try {
          // Construct a more detailed address string using all available address components
          let addressComponents = [];
          
          // Add street if available
          if (property.address.street) {
            addressComponents.push(property.address.street);
          }
          
          // Add city if available
          if (property.address.city) {
            addressComponents.push(property.address.city);
          }
          
          // Add state/region if available
          if (property.address.state) {
            addressComponents.push(property.address.state);
          }
          
          // Add zip/postal code if available
          if (property.address.zipCode) {
            addressComponents.push(property.address.zipCode);
          }
          
          // Add country if available
          if (property.address.country) {
            addressComponents.push(property.address.country);
          }
          
          // Join all components to create a full address string
          const fullAddress = addressComponents.join(", ");
          
          console.log(`Geocoding address: ${fullAddress} for property ID: ${property.id}`);
          
          // Add a small delay between geocoding requests to respect API limits
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Create geocoding options with region biasing for Morocco
          const geocodingOptions = {
            address: fullAddress,
            region: 'ma' // Country code for Morocco to improve regional accuracy
          };
          
          const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
            geocoderRef.current?.geocode(geocodingOptions, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                console.log(`Geocoding successful for property ${property.id}:`, results[0].geometry.location.toJSON());
                resolve(results);
              } else {
                // Fallback to components geocoding if address string geocoding fails
                if (property.address.city) {
                  geocoderRef.current?.geocode({ 
                    address: property.address.city + (property.address.country ? `, ${property.address.country}` : '')
                  }, (cityResults, cityStatus) => {
                    if (cityStatus === google.maps.GeocoderStatus.OK && cityResults && cityResults.length > 0) {
                      console.log(`Fallback geocoding successful for property ${property.id} using city:`, cityResults[0].geometry.location.toJSON());
                      resolve(cityResults);
              } else {
                reject(new Error(`Geocoding failed for address: ${fullAddress}, status: ${status}`));
                    }
                  });
                } else {
                  reject(new Error(`Geocoding failed for address: ${fullAddress}, status: ${status}`));
                }
              }
            });
          });

          // Update property location
          const propertyIndex = updatedProperties.findIndex(p => p.id === property.id);
          if (propertyIndex !== -1 && result[0].geometry.location) {
            updatedProperties[propertyIndex] = {
              ...updatedProperties[propertyIndex],
              location: {
                lat: result[0].geometry.location.lat(),
                lng: result[0].geometry.location.lng()
              }
            };
          }
        } catch (error) {
          console.error(`Error geocoding property ${property.id}:`, error);
        }
      }

      // Update properties with geocoded locations
      setProperties(updatedProperties);
      
      // Check for properties that still couldn't be geocoded and try a final fallback
      const stillMissingLocations = updatedProperties.filter(
        p => (!p.location || typeof p.location?.lat !== 'number' || typeof p.location?.lng !== 'number')
      );
      
      if (stillMissingLocations.length > 0) {
        console.log(`${stillMissingLocations.length} properties still missing locations, trying city-level fallback`);
        
        const finalUpdatedProperties = [...updatedProperties];
        
        // Try to geocode just using city names as a last resort
        for (const property of stillMissingLocations) {
          try {
            // Skip if we don't even have a city
            if (!property.address || !property.address.city) continue;
            
            // Add a delay to respect API limits
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Try geocoding with just the city and country
            const cityCountry = `${property.address.city}${property.address.country ? `, ${property.address.country}` : ''}`;
            
            console.log(`Final fallback geocoding attempt for property ${property.id} using: ${cityCountry}`);
            
            const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
              geocoderRef.current?.geocode({ 
                address: cityCountry,
                region: 'ma'
              }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                  console.log(`City-level fallback successful for property ${property.id}`);
                  resolve(results);
                } else {
                  reject(new Error(`City-level fallback failed for: ${cityCountry}`));
                }
              });
            });
            
            // Update property location
            const propertyIndex = finalUpdatedProperties.findIndex(p => p.id === property.id);
            if (propertyIndex !== -1 && result[0].geometry.location) {
              // Add a small random offset to prevent overlap of properties in the same city
              const randomLat = (Math.random() - 0.5) * 0.01; // ~1km random offset
              const randomLng = (Math.random() - 0.5) * 0.01;
              
              finalUpdatedProperties[propertyIndex] = {
                ...finalUpdatedProperties[propertyIndex],
                location: {
                  lat: result[0].geometry.location.lat() + randomLat,
                  lng: result[0].geometry.location.lng() + randomLng
                }
              };
            }
          } catch (error) {
            console.error(`Final fallback geocoding failed for property ${property.id}:`, error);
          }
        }
        
        // Update with final geocoded data
        setProperties(finalUpdatedProperties);
      }
    };

    geocodeProperties();
  }, [isLoaded, properties, setProperties]);

  // Update map center and bounds when properties change
  useEffect(() => {
    if (mapRef.current && properties.length > 0) {
      // Filter out properties without valid location data
      const validProperties = properties.filter(
        p => p.location && typeof p.location?.lat === 'number' && typeof p.location?.lng === 'number'
      );
      
      console.log(`Fitting map to ${validProperties.length} valid properties`);
      
      if (validProperties.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        
        validProperties.forEach(property => {
          if (property.location) {
            bounds.extend(new window.google.maps.LatLng(property.location.lat, property.location.lng));
          }
        });
        
        // Center the map on the bounds
        mapRef.current.fitBounds(bounds);
        
        // If we only have one property, set an appropriate zoom level
        if (validProperties.length === 1) {
          mapZoom = 15;
          if (validProperties[0].location) {
            mapCenter = validProperties[0].location;
          }
        } else {
          // Get the zoom after fitting bounds
          const newZoom = mapRef.current.getZoom();
          // Adjust zoom if needed
          if (newZoom && newZoom > 15) {
            mapZoom = 15;
          }
        }
      } else {
        // If no valid properties, center on Rabat
        mapCenter = DEFAULT_MAP_CENTER;
        mapZoom = DEFAULT_MAP_ZOOM;
      }
    }
  }, [properties]);
  
  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Fix to ensure we're using the actual filtered properties
  useEffect(() => {
    // Force refresh markers when properties change
    // This helps address any issues with React's render optimization
    const timer = setTimeout(() => {
      if (mapRef.current) {
        google.maps.event.trigger(mapRef.current, 'resize');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [properties, showMap]);

  return (
    <div className={`map ${showMap ? 'active' : ''} ${isCollapsed ? 'expanded' : ''}`}>
      {!isLoaded ? (
      <div className="map-placeholder">
          <div className="loading-spinner"></div>
          <p>{t('property_list.loading_map')}</p>
      </div>
      ) : loadError ? (
        <div className="map-placeholder">
          <div className="error-icon">⚠️</div>
          <p>{t('property_list.map_error')}</p>
      </div>
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={mapZoom}
          onLoad={onMapLoad}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          }}
        >
          <PropertyMarkers 
            properties={properties} 
            onPropertyClick={handlePropertyClick} 
            selectedPropertyId={selectedProperty?.id || null} 
          />

          {selectedProperty && selectedProperty.location && (
            <InfoWindow
              position={selectedProperty.location}
              onCloseClick={() => setSelectedProperty(null)}
              options={{
                pixelOffset: new window.google.maps.Size(0, -40)
              }}
            >
              <div className="property-info-window">
                {selectedProperty.image && (
                  <div className="info-window-image-container">
                    <img 
                      src={selectedProperty.image} 
                      alt={selectedProperty.title} 
                      className="info-window-image"
                    />
                    <div className="property-type-badge">
                      {t(`property_list.property_type.${selectedProperty.propertyType}`)}
                    </div>

                    <button 
                      className="custom-close-button"
                      onClick={() => setSelectedProperty(null)}
                      aria-label="Close"
                    >
                      <img src={closeIcon} alt="Close" />
        </button>
                  </div>
                )}
                <div className="info-window-content">
                  <h3 className="info-window-title">{selectedProperty.title}</h3>
                  <div className="info-window-details">
                    <div className="info-window-price">
                      {new Intl.NumberFormat('fr-MA', {
                        style: 'currency',
                        currency: 'MAD',
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0
                      }).format(selectedProperty.price)} 
                      <span className="price-type">{t('property_list.per_month')}</span>
                    </div>
                    <div className="info-window-address">
                      {selectedProperty.address.street}, {selectedProperty.address.city}
                    </div>
                    <div className="info-window-features">
                      <span className="feature">
                        {selectedProperty.rooms && selectedProperty.rooms.filter(room => room.type === 'bedroom').length > 0 
                          ? `${selectedProperty.rooms!.filter(room => room.type === 'bedroom').length} ${
                              selectedProperty.rooms!.filter(room => room.type === 'bedroom').length === 1 
                                ? t('property_list.bedroom') 
                                : t('property_list.bedrooms')
                            }`
                          : selectedProperty.bedrooms === 0 
                            ? t('property_list.studio') 
                            : `${selectedProperty.bedrooms} ${
                                selectedProperty.bedrooms === 1 
                                  ? t('property_list.bedroom') 
                                  : t('property_list.bedrooms')
                              }`
                        }
                      </span>
                      <span className="feature-divider">•</span>
                      <span className="feature">
                        {selectedProperty.rooms && selectedProperty.rooms.filter(room => room.type === 'bathroom').length > 0
                          ? `${selectedProperty.rooms!.filter(room => room.type === 'bathroom').length} ${
                              selectedProperty.rooms!.filter(room => room.type === 'bathroom').length === 1 
                                ? t('property_list.bathroom') 
                                : t('property_list.bathrooms')
                            }`
                          : `${selectedProperty.bathrooms} ${
                              selectedProperty.bathrooms === 1 
                                ? t('property_list.bathroom') 
                                : t('property_list.bathrooms')
                            }`
                        }
                      </span>
                      <span className="feature-divider">•</span>
                      <span className="feature">{selectedProperty.area} m²</span>
                    </div>
                    {selectedProperty.amenities.length > 0 && (
                      <div className="info-window-amenities">
                        {selectedProperty.amenities.slice(0, 2).map((amenity, index) => (
                          <span key={index} className="amenity-tag">{t(`property_list.${amenity.toLowerCase().replace(/\s+/g, '_')}`, amenity)}</span>
                        ))}
                        {selectedProperty.amenities.length > 2 && (
                          <span className="more-amenities">+{selectedProperty.amenities.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="info-window-actions">
                    <button 
                      className="view-property-button"
                      onClick={() => handleViewProperty(selectedProperty.id)}
                    >
                      {t('property_list.view_property')}
        </button>
      </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </div>
  );
});

// Enhanced property card component (outside of main component to avoid re-creation)
interface EnhancedPropertyCardProps {
  property: PropertyType;
  onToggleFavorite: (id: string | number) => void;
  isSelected?: boolean;
}

const EnhancedPropertyCardComponent = ({ property, onToggleFavorite, isSelected }: EnhancedPropertyCardProps) => {
  // Format property data for the card component
  const formattedPrice = new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(property.price);
  
  // Don't try to convert the ID, just pass it as is
  const propertyId = property.id;
  
  return (
    <div className={`property-card-wrapper${isSelected ? ' selected' : ''}`}>
      <PropertyCard 
        image={defaultImage}
        title={property.title}
        subtitle={property.subtitle || ''}
        minstay={property.minstay || '1'}
        price={formattedPrice}
        priceType={property.priceType || ''}
        description={property.description}
        propertyType={property.propertyType}
        isRecommended={!!property.isRecommended}
        isFavorite={!!property.isFavorite}
        onToggleFavorite={onToggleFavorite}
        id={propertyId}
      />
    </div>
  );
};

// Memoize the EnhancedPropertyCard to prevent unnecessary renders
const EnhancedPropertyCard = memo(EnhancedPropertyCardComponent, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.property.id === nextProps.property.id &&
    prevProps.property.isFavorite === nextProps.property.isFavorite
  );
});

// Helper function to normalize text by removing accents/diacritics
const normalizeText = (text: string): string => {
  if (!text) return '';
  // Normalize the string and replace diacritics with their base characters
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
};

export default function PropertyListPage() {
  // Hooks
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  
  // Auth state
  const { isAuthenticated } = useAuth();
  
  // State for properties and filtering
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<string>(t('property_list.recommended'));
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [pendingFilters, setPendingFilters] = useState<{ type: string, value: string }[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | undefined>(undefined);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [isFilteringSectionVisible, setIsFilteringSectionVisible] = useState<boolean>(false);
  const [locationInput, setLocationInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>('');
  const [genderInput, setGenderInput] = useState<string>('');
  const propertiesPerPage = 6;
  // Add state for collapsing the main content
  const [isMainContentCollapsed, setIsMainContentCollapsed] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_MAP_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_MAP_ZOOM);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'geometry']
  });

  // Fetch properties and set up initial state
  useEffect(() => {
    const fetchProperties = async () => {
        setIsLoading(true);
      try {
        // Fetch properties from API with any required filters
        let fetchedProperties = await getProperties();
        
        // Check which properties are favorited by the user
        if (isAuthenticated) {
          const checkFavoriteStatus = async () => {
            const propertiesWithFavorites = await Promise.all(
              fetchedProperties.map(async (property) => {
                const isFavorite = await isPropertyFavorited(property.id.toString());
                return { ...property, isFavorite };
              })
            );
            return propertiesWithFavorites;
          };
          
          fetchedProperties = await checkFavoriteStatus();
        }
        
        // Set properties and filtered properties
        setProperties(fetchedProperties.map(property => ({
          ...property,
          subtitle: property.address?.city || '',
          image: defaultImage,
          priceType: '/month',
          minstay: property.minstay?.toString() || '1',
          isRecommended: false,
          // If not authenticated, isFavorite will be false by default
          isFavorite: (property as any).isFavorite || false,
          // Ensure isFurnished is always boolean, default to false if undefined
          isFurnished: property.isFurnished || false
        })) as PropertyType[]);
        
        setFilteredProperties(fetchedProperties.map(property => ({
          ...property,
          subtitle: property.address?.city || '',
          image: defaultImage,
          priceType: '/month',
          minstay: property.minstay?.toString() || '1',
          isRecommended: false,
          isFavorite: (property as any).isFavorite || false,
          // Ensure isFurnished is always boolean, default to false if undefined
          isFurnished: property.isFurnished || false
        })) as PropertyType[]);
        
        setIsLoading(false);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [isAuthenticated]);

  // Handler functions
  const handleDateChange = (date: string) => {
    setDateInput(date);
    
    try {
      // If date is cleared, mark to remove this filter type
      if (!date) {
        setPendingFilters(prev => prev.filter(filter => filter.type !== 'MoveInDate'));
          return;
      }
      
      // Format date for display in filter 
      const dateObj = new Date(date);
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        console.error('Invalid date string:', date);
        return;
      }
      
      const displayDate = dateObj.toLocaleDateString();
      
      // Prepare move-in date filter to be added when search is executed
      setPendingFilters(prev => {
        // Remove existing date filter if any
        const filtersWithoutDate = prev.filter(filter => filter.type !== 'MoveInDate');
        // Add the new filter to pending filters
        return [...filtersWithoutDate, { type: 'MoveInDate', value: displayDate }];
      });
      
      console.log('Date input changed to:', displayDate, 'for date:', dateObj.toISOString());
      } catch (error) {
      console.error('Error processing date:', error);
    }
  };

  const handleGenderChange = (gender: string) => {
    setGenderInput(gender);
    
    // If gender/capacity is cleared, mark to remove this filter type
    if (!gender) {
      setPendingFilters(prev => prev.filter(filter => filter.type !== 'Capacity'));
      return;
    }
    
    // Prepare capacity filter based on selection
    // Now using numeric values directly
    let capacityValue = gender;
    let capacityLabel = '';
    
    if (gender === '7+') {
      capacityLabel = '7+ People';
    } else {
      const count = parseInt(gender, 10);
      capacityLabel = count === 1 ? '1 Person' : `${count} People`;
    }
    
    // Store the capacity filter to be added when search is executed
    setPendingFilters(prev => {
      // Remove existing capacity filter if any
      const filtersWithoutCapacity = prev.filter(filter => filter.type !== 'Capacity');
      // Add the new filter
      return [...filtersWithoutCapacity, { type: 'Capacity', value: capacityLabel }];
    });
    
    console.log('Capacity input changed to:', capacityLabel);
  };

  // Toggle main content collapse
  const toggleMainContentCollapse = () => {
    setIsMainContentCollapsed(!isMainContentCollapsed);
    // Always show map when main content is collapsed
    if (!isMainContentCollapsed && !showMap) {
      setShowMap(true);
    }
  };

  // Toggle map visibility
  const toggleMap = () => {
    setShowMap(!showMap);
  };

  // Apply sorting to properties
  const applySort = useCallback((properties: PropertyType[]) => {
    if (!properties || properties.length === 0) {
      return [];
    }
    
    const sortedProperties = [...properties];
    
    // Apply sorting
    if (sortOption === t('property_list.price_low_high')) {
      sortedProperties.sort((a, b) => a.price - b.price);
    } else if (sortOption === t('property_list.price_high_low')) {
      sortedProperties.sort((a, b) => b.price - a.price);
    } else if (sortOption === t('property_list.newest_first')) {
      sortedProperties.sort((a, b) => {
        // Convert dates to timestamps for comparison
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } else {
      // Default sort: Recommended first, then others
      sortedProperties.sort((a, b) => {
        // First sort by recommended (true values first)
        if (a.isRecommended && !b.isRecommended) {
          return -1;
        } else if (!a.isRecommended && b.isRecommended) {
          return 1;
        }
        
        // If both have the same recommendation status, sort by price (lowest first)
        return a.price - b.price;
      });
    }
    
    // Default case: return the sorted array
    return sortedProperties;
  }, [t, sortOption]);

  // Toggle a filter (add or remove)
  const toggleFilter = (filter: string) => {
    // Use functional update pattern to ensure we have the latest state
    setActiveFilters(prevFilters => {
      const newFilters = prevFilters.includes(filter)
        ? prevFilters.filter(f => f !== filter)
        : [...prevFilters, filter];
      
      // Return the new filters without immediately applying them
        return newFilters;
      });
    // No automatic application of filters
  };
  
  // Apply current filters based on the activeFilters state
  const applyCurrentFilters = useCallback((filtersToApply?: string[]) => {
    // Always hide filtering section and show search view when applying filters
    const filtersToUse = filtersToApply || activeFilters;
    console.log("------- APPLYING FILTERS -------");
    console.log("Filters to apply:", filtersToUse);
    
    // Update active filters if we were provided with new ones
    if (filtersToApply) {
      setActiveFilters(filtersToApply);
    }
    
    setIsFilteringSectionVisible(false);
    
    // Filter properties based on current active filters
    const newFiltered = properties.filter(property => {
      // Always filter by property status - only show available properties
      if (property.status !== 'available') {
        return false;
      }
      
      // Check each filter from our active filters list
      for (const filter of filtersToUse) {
        console.log(`Testing filter: ${filter} on property ${property.id}`);
        
        // Process location filter - now works with or without commas
        if (filter.includes(':') && filter.split(':')[0].trim() === 'Location') {
          const filterLoc = filter.split(':')[1].trim();
          
          // Extract address components for more granular matching
          const addressComponents = {
            street: normalizeText(property.address.street || ''),
            city: normalizeText(property.address.city || ''),
            state: normalizeText(property.address.state || ''),
            zipCode: normalizeText(property.address.zipCode || ''),
            country: normalizeText(property.address.country || '')
          };
          
          // Create a combined address string for full text search
          const addressString = `${addressComponents.street}, ${addressComponents.city}, ${addressComponents.state}, ${addressComponents.zipCode}, ${addressComponents.country}`;
          
          // Split the filter query into parts to match individual components more effectively
          // And normalize each part to remove accents
          const filterParts = filterLoc.split(/[,\s]+/)
            .map(part => normalizeText(part))
            .filter(part => part.length > 1);
          
          // Check if any of the filter parts match any of the address components
          const matchFound = filterParts.some(part => {
            // Check for partial matches in each address component
            return Object.values(addressComponents).some(component => 
              component.includes(part)
            );
          });

          // If no match found in any address component, filter out this property
          if (!matchFound) {
            console.log(`Property ${property.id} filtered out by location: ${filterLoc}`);
            console.log(`Address components:`, addressComponents);
            return false;
          }
          
          console.log(`Property ${property.id} matches location filter "${filterLoc}"`);
        }
        
        // Handle price filters
        if (filter.includes('$') || filter.includes('to')) {
          // Price range filter
          if (filter.includes(" to ")) {
            const [min, max] = filter.split(" to ").map(part => parseInt(part.replace(/\D/g, '')));
            if (property.price < min || property.price > max) {
              console.log(`Property ${property.id} price ${property.price} not in range ${min}-${max}, filtering out`);
              return false;
            }
          }
        }
        
        // Handle date filter - check if property is available from the selected date
        if (filter.includes('/')) {
          const selectedDate = new Date(filter);
           
          // If the property doesn't have an availableFrom date, we exclude it to be safe
          if (!property.availableFrom) {
            console.log(`Property ${property.id} has no availableFrom date, filtering out`);
            return false;
          }
           
          // Convert property availableFrom to a Date object if it's not already
          let availableFromDate: Date;
          if (property.availableFrom instanceof Date) {
            availableFromDate = property.availableFrom;
          } else if (typeof property.availableFrom === 'string') {
            availableFromDate = new Date(property.availableFrom);
          } else if (property.availableFrom && typeof (property.availableFrom as any).toDate === 'function') {
            // Handle Firestore Timestamp objects which have a toDate() method
            availableFromDate = (property.availableFrom as any).toDate();
          } else {
            // If we can't parse the date, skip this property
            console.log(`Property ${property.id} has invalid availableFrom date, filtering out`);
            return false;
          }
           
          // Compare dates - property is only valid if it's available on or before the selected date
          if (availableFromDate > selectedDate) {
            console.log(`Property ${property.id} available from ${availableFromDate.toISOString()} is after the requested date ${selectedDate.toISOString()}, filtering out`);
            return false;
          }
        }
        
        // Handle gender-based filtering here
        if (filter === 'Women Only' || filter === 'Men Only') {
          const ruleToCheck = filter === 'Women Only' ? 'Women only' : 'Men only';
          
          // Check if property has rules array and the gender rule is allowed
          if (!property.rules || !Array.isArray(property.rules)) {
            console.log(`Property ${property.id} has no rules array, filtering out`);
            return false;
          }
          
          const hasRule = property.rules.some(r => 
            r.name.toLowerCase() === ruleToCheck.toLowerCase() && r.allowed
          );
          
          if (!hasRule) {
            console.log(`Property ${property.id} doesn't allow ${ruleToCheck}, filtering out`);
            return false;
          }
        }
        
        // Handle capacity filters (e.g., "Capacity: 3 People", "Capacity: 1 Person")
        if (filter.startsWith('Capacity:')) {
          // Extract the capacity number from the filter
          const capacityText = filter.split(':')[1].trim();
          let requiredCapacity = 0;
          let isPlus = false;
          
          if (capacityText === '7+ People') {
            // Special case for "7+ People" that we explicitly generate
            requiredCapacity = 7;
            isPlus = true;
          } else if (capacityText.includes('+')) {
            // Handle other "X+ People" format
            isPlus = true;
            requiredCapacity = parseInt(capacityText.match(/(\d+)\+/)![1], 10);
          } else {
            // Handle "X People" or "1 Person" format
            requiredCapacity = parseInt(capacityText.match(/(\d+)/)![1], 10);
          }
          
          console.log(`Checking capacity filter: ${capacityText} (${requiredCapacity}${isPlus ? '+' : ''}) for property ${property.id}`);
          
          // If property has no capacity info, filter it out
          if (!property.capacity || typeof property.capacity !== 'number') {
            console.log(`Property ${property.id} has no capacity info, filtering out`);
            return false;
          }
          
          // Check if property's capacity meets the requirement
          if (isPlus) {
            // For "X+ People", property capacity must be at least X
            if (property.capacity < requiredCapacity) {
              console.log(`Property ${property.id} capacity ${property.capacity} is less than required ${requiredCapacity}+, filtering out`);
              return false;
            }
          } else {
            // For exact capacity, property must match exactly
            if (property.capacity !== requiredCapacity) {
              console.log(`Property ${property.id} capacity ${property.capacity} does not match required ${requiredCapacity}, filtering out`);
              return false;
            }
          }
          
          console.log(`Property ${property.id} passes capacity filter with capacity ${property.capacity}`);
        }
        
        // Handle bedroom filters like "Studio", "1 Bedroom", "2 Bedrooms", etc.
        if (filter === t('property_list.studio') || filter.includes(t('property_list.bedroom')) || filter.includes(t('property_list.bedrooms'))) {
        if (filter === t('property_list.studio')) {
          if (property.bedrooms === undefined || typeof property.bedrooms !== 'number' || property.bedrooms !== 0) {
              console.log(`Property ${property.id} is not a studio, filtering out`);
            return false;
          }
          } else {
          const bedroomMatch = filter.match(/^(\d+)\+?\s/);
          if (bedroomMatch) {
            const filterBedrooms = parseInt(bedroomMatch[1], 10);
            const isPlus = filter.includes('+');
            
            if (property.bedrooms === undefined || typeof property.bedrooms !== 'number') {
                console.log(`Property ${property.id} has no bedroom info, filtering out`);
              return false;
            }
            
            if (isPlus && property.bedrooms < filterBedrooms) {
                console.log(`Property ${property.id} has ${property.bedrooms} bedrooms, less than required ${filterBedrooms}+, filtering out`);
              return false;
            } else if (!isPlus && property.bedrooms !== filterBedrooms) {
                console.log(`Property ${property.id} has ${property.bedrooms} bedrooms, not equal to required ${filterBedrooms}, filtering out`);
              return false;
              }
            }
          }
        }
        
        // Handle the isFurnished filter separately
        if (filter === 'isFurnished') {
          console.log(`Checking isFurnished filter for property ${property.id}: ${property.isFurnished}`);
          if (!property.isFurnished) {
            console.log(`Property ${property.id} is not furnished, filtering out`);
            return false;
          }
        }
        
        // Property type filters
        if (filter === 'Apartment' || filter === 'House' || filter === 'Condo' || filter === 'Commercial') {
          // Normalize case for comparison
        const normalizedPropertyType = property.propertyType.toLowerCase();
          const normalizedFilter = filter.toLowerCase();
          
          if (normalizedPropertyType !== normalizedFilter) {
            console.log(`Property ${property.id} type ${normalizedPropertyType} doesn't match ${normalizedFilter}, filtering out`);
          return false;
          }
        }
        
        // Handle amenity filters
        const amenityFilters = ['wifi', 'washing-machine', 'desk', 'wardrobe', 'oven', 'coffee-table', 'sofabed', 'sofa', 'dining-table'];
        if (amenityFilters.includes(filter)) {
          console.log(`Checking amenity filter: ${filter} for property ${property.id}`);
          if (!property.amenities || !property.amenities.includes(filter)) {
            console.log(`Property ${property.id} doesn't have amenity: ${filter}, filtering out`);
          return false;
          }
        }
        
        // Handle features filters
        const featureFilters = ['balcony', 'central-heating', 'parking-space', 'air-conditioning', 'wooden-floors', 'elevator'];
        if (featureFilters.includes(filter)) {
          console.log(`Checking feature filter: ${filter} for property ${property.id}`);
          if (!property.features || !property.features.includes(filter)) {
            console.log(`Property ${property.id} doesn't have feature: ${filter}, filtering out`);
            return false;
          }
        }
        
        // Handle included services filters
        const includedFilters = ['"water"', '"electricity"', '"wifi"'];
        if (includedFilters.includes(filter)) {
          console.log(`Checking included filter: ${filter} for property ${property.id}`);
          
          // Find if the property has this feature (exact match with quotes)
          if (!property.features || !property.features.includes(filter)) {
            console.log(`Property ${property.id} doesn't include: ${filter} in features, filtering out`);
            return false;
          }
          console.log(`Property ${property.id} includes ${filter} in features`);
        }
        
        // Rules filters
        const ruleFilters = ['women-only', 'families-only', 'pets-allowed', 'smoking-allowed'];
        if (ruleFilters.includes(filter)) {
          console.log(`Checking rule filter: ${filter} for property ${property.id}`);
          
          // Check if property has rules array
          if (!property.rules || !Array.isArray(property.rules)) {
            console.log(`Property ${property.id} has no rules array, filtering out`);
            return false;
          }
          
          console.log(`Property ${property.id} rules:`, property.rules);
          
          // Map filter names to rule names in the property
          let ruleName = '';
          switch(filter) {
            case 'women-only':
              ruleName = 'Women only';
              break;
            case 'families-only':
              ruleName = 'Families only';
              break;
            case 'pets-allowed':
              ruleName = 'Pets';
              break;
            case 'smoking-allowed':
              ruleName = 'Smoking';
              break;
          }
          
          console.log(`Looking for rule: "${ruleName}" with allowed=true`);
          
          // Check if the property has the rule and it's allowed
          const rule = property.rules.find(r => r.name.toLowerCase() === ruleName.toLowerCase());
          
          // If the rule doesn't exist or is not allowed, filter out this property
          if (!rule || !rule.allowed) {
            console.log(`Property ${property.id} does not have "${ruleName}" allowed, filtering out`);
            return false;
          }
          
          console.log(`Property ${property.id} has rule "${ruleName}" allowed: true`);
        }
      }
      
      // If the property passed all filters, include it
      return true;
    });
    
    console.log("Filtered properties:", newFiltered.length);
    console.log("------ END FILTERING ------");
    
    // Sort the filtered properties
    const sortedProperties = applySort(newFiltered);
    setFilteredProperties(sortedProperties);
    setCurrentPage(1);
    setIsLoading(false);
  }, [activeFilters, properties, t, applySort]);

  // Clear all filters
  const clearAllFilters = () => {
    setIsLoading(true);
    
    // Clear filter states immediately
    setActiveFilters([]);
    setPendingFilters([]);
    setLocationInput('');
    setDateInput('');
    setGenderInput('');
    
    // Reset to all properties with proper sorting
    const sortedProperties = applySort([...properties]);
    
    // Update filtered properties immediately
    setFilteredProperties(sortedProperties);
    
    // Reset pagination
    setCurrentPage(1);
    
    // Hide the filtering section
    setIsFilteringSectionVisible(false);
    
    // Set loading to false
    setIsLoading(false);
    
    console.log("All filters cleared");
  };

  // Handle search
  const handleSearch = () => {
    // Apply current pending filters to active filters
    if (pendingFilters.length > 0) {
      // Convert pending filters to string format and update active filters
      const formattedFilters = pendingFilters.map(filter => {
        // For location filters, we need to clean the value a bit to improve matching
        if (filter.type === 'Location') {
          const cleanedLocation = filter.value.trim();
          // Only add location filter if it's not empty after cleaning
          if (cleanedLocation) {
            // We don't normalize here since we want to display the original text to the user
            // Normalization happens during the actual filtering process
            return `${filter.type}: ${cleanedLocation}`;
          } else {
            return ''; // Empty string will be filtered out below
          }
        }
        return `${filter.type}: ${filter.value}`;
      }).filter(filter => filter !== ''); // Remove any empty filters
      
      // Find active filters that don't have a pending counterpart
      const typesToReplace = pendingFilters.map(filter => filter.type);
      const remainingActiveFilters = activeFilters.filter(activeFilter => {
        // Extract the filter type (everything before the colon)
        const filterType = activeFilter.split(':')[0].trim();
        // Keep this filter if its type isn't in pendingFilters
        return !typesToReplace.includes(filterType);
      });
      
      // Combine remaining active filters with new pending filters
      const newActiveFilters = [...remainingActiveFilters, ...formattedFilters];
      
      console.log('Applying filters:', newActiveFilters);
      
      // Set active filters and apply them
      setActiveFilters(newActiveFilters);
      applyCurrentFilters(newActiveFilters);
    } else {
      // Just apply existing active filters if no pending changes
    applyCurrentFilters();
    }
  };

  // Handle search input changes with debounce
  const handleSearchInputChange = (location: string) => {
    // Update the location input state with the original text (with accents preserved)
    // This ensures the UI shows exactly what the user typed
    setLocationInput(location);
    
    // Clear previous timeout if it exists
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set a new timeout to delay processing the location change
    const newTimeout = setTimeout(() => {
      // Store location filter for when search is executed
      if (location.trim()) {
        setPendingFilters(prev => {
          // Check if we already have a location filter
          const hasLocationFilter = prev.some(f => f.type === 'Location');
          let newFilters = [...prev];
          
          // Remove existing location filter if any
          if (hasLocationFilter) {
            newFilters = newFilters.filter(f => f.type !== 'Location');
          }
          
          // Add new location filter to pending filters with original text
          // The normalization will happen during the actual filtering
          return [...newFilters, { type: 'Location', value: location }];
        });
        
        console.log('Location input changed to:', location);
      } else {
        // If location is empty, mark to remove this filter type
        setPendingFilters(prev => prev.filter(f => f.type !== 'Location'));
      }
    }, 300); // Reduced debounce time for better responsiveness
    
    // Save the timeout ID
    setSearchTimeout(newTimeout);
  };

  // Handle sort option change
  const handleSortChange = (value: string) => {
    setSortOption(value);
    
    // Apply the new sort immediately to the current filtered properties
    setTimeout(() => {
      const sortedProperties = applySort(filteredProperties);
      setFilteredProperties(sortedProperties);
    }, 0);
  };

  // Toggle filtering section visibility
  const toggleFilteringSection = () => {
    setIsFilteringSectionVisible(!isFilteringSectionVisible);
  };

  // Advanced filtering implementation
  const handleAdvancedFiltering = useCallback(() => {
    applyCurrentFilters();
  }, [applyCurrentFilters]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (propertyId: string | number) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      // Call the server action to update the favorite status in the database
      const result = await toggleFavoriteProperty(propertyId.toString());
      
      // Update the local UI state based on the result from the server
    setProperties(prevProperties => 
      prevProperties.map(property => 
        property.id === propertyId 
            ? { ...property, isFavorite: result.added } 
          : property
      )
    );

    setFilteredProperties(prevFiltered => 
      prevFiltered.map(property => 
        property.id === propertyId 
            ? { ...property, isFavorite: result.added } 
          : property
      )
    );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  }, [isAuthenticated]);

  // Ensure map recenters when a property is selected from the card list
  useEffect(() => {
    if (selectedProperty && selectedProperty.location) {
      setMapCenter(selectedProperty.location);
      setMapZoom(15); // or your preferred zoom level
    }
  }, [selectedProperty]);

    return (
    <PropertyList $isCollapsed={isMainContentCollapsed}>
      <div className={`main-content ${isMainContentCollapsed ? 'collapsed' : ''}`} ref={scrollRef}>
        <button 
          className="collapse-toggle-button"
          onClick={toggleMainContentCollapse}
          aria-label={isMainContentCollapsed ? 'Expand content' : 'Collapse content'}
        >
          {isMainContentCollapsed ? <IoChevronForwardOutline /> : <IoChevronBackOutline />}
        </button>

        {isFilteringSectionVisible ? (
          <div className="filtering-section">
            <FilteringSection 
              onApplyFilters={applyCurrentFilters}
              onClearFilters={clearAllFilters}
              activeFilters={activeFilters}
              onToggleFilter={toggleFilter}
              location={locationInput}
              date={dateInput}
              gender={genderInput}
              onLocationChange={handleSearchInputChange}
              onDateChange={handleDateChange}
              onGenderChange={handleGenderChange}
              setActiveFilters={setActiveFilters}
              onBack={() => setIsFilteringSectionVisible(false)}
            />
          </div>
        ) : (
          <div className="content-container">
            <div className="search-form">
              <SearchFilterBar 
                onLocationChange={handleSearchInputChange}
                onDateChange={handleDateChange}
                onGenderChange={handleGenderChange}
                onSearch={handleSearch}
                onAdvancedFilteringClick={toggleFilteringSection}
                location={locationInput}
                date={dateInput}
                gender={genderInput}
              />
            </div>

            {/* Restore the search results container */}
            <div className="search-results-container">
              <div className="filters-container">
                <div className="text-select">
                  <div className="text">
                    <div className="title">
                      {t('property_list.renting_title')}
                    </div>
                    <div className="sub-title">
                      {filteredProperties.length} {t(filteredProperties.length === 1 ? 'property_list.waiting_tenants' : 'property_list.waiting_tenants_plural')}
                    </div>
                  </div>

                  <div className="select-container">
                    <SelectFieldBaseModelVariant2 
                      options={[
                        t('property_list.recommended'),
                        t('property_list.price_low_high'),
                        t('property_list.price_high_low'),
                        t('property_list.newest_first')
                      ]}
                      placeholder={t('property_list.sort_by')}
                      onChange={handleSortChange}
                    />
                  </div>
                </div>

                {activeFilters.length > 0 && (
                  <div className="applied-filters">
                    {activeFilters.map((filter, index) => (
                      <div key={index} className="filter-badge">
                        <AppliedFilterBannerComponent label={filter} />
                        <button 
                          className="remove-icon" 
                          onClick={() => {
                            // First remove the filter
                            setActiveFilters(prevFilters => {
                              const newFilters = prevFilters.filter(f => f !== filter);
                              // Then immediately apply the updated filters
                              setTimeout(() => applyCurrentFilters(newFilters), 0);
                              return newFilters;
                            });
                          }}
                          aria-label={`Remove ${filter} filter`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>{t('property_list.loading')}</p>
                </div>
              ) : filteredProperties.length > 0 ? (
                <>
                  <div className="results-container">
                    {filteredProperties.slice(
                      (currentPage - 1) * propertiesPerPage, 
                      currentPage * propertiesPerPage
                    ).map((property) => {
                      const propertyKey = property.id.toString();
                      const isSelected = selectedProperty?.id === property.id;
                      return (
                        <div 
                          className={`result${isSelected ? ' selected' : ''}`} 
                          key={propertyKey}
                          onClick={() => setSelectedProperty(property)}
                          style={{ cursor: 'pointer'}}
                        >
                          <EnhancedPropertyCard 
                            property={property} 
                            onToggleFavorite={toggleFavorite} 
                            isSelected={isSelected}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {Math.ceil(filteredProperties.length / propertiesPerPage) > 1 && (
                    <div className="pagination">
                      <button 
                        className="page-button arrow" 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        ←
                      </button>
                      
                      {[...Array(Math.ceil(filteredProperties.length / propertiesPerPage))].map((_, index) => (
                        <button
                          key={index}
                          className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button 
                        className="page-button arrow" 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProperties.length / propertiesPerPage)))}
                        disabled={currentPage === Math.ceil(filteredProperties.length / propertiesPerPage)}
                      >
                        →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">🏠</div>
                  <h3>{t('property_list.no_results')}</h3>
                  <p>{t('property_list.adjust_filters')}</p>
                  <button onClick={clearAllFilters}>
                    {t('property_list.clear_filters')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <PropertyMap 
        showMap={showMap || isMainContentCollapsed}
        properties={filteredProperties} 
        isCollapsed={isMainContentCollapsed}
        setProperties={setProperties}
        toggleFavorite={toggleFavorite}
        selectedProperty={selectedProperty}
        setSelectedProperty={setSelectedProperty}
        mapCenter={mapCenter}
        mapZoom={mapZoom}
      />

      {showMap && !isMainContentCollapsed && (
        <button className="close-map-button" onClick={toggleMap} aria-label="Close map">
          <IoClose />
        </button>
      )}

      {!isMainContentCollapsed && (
      <button className="toggle-map-button" onClick={toggleMap}>
        <IoMap />
          {showMap ? t('property_list.hide_map') : t('property_list.show_map')}
      </button>
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </PropertyList>
  );
}
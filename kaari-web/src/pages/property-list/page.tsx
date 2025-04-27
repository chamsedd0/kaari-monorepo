import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMap, IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { AppliedFilterBannerComponent } from "../../components/skeletons/banners/static/applied-filter-banner";
import { PropertyCard } from "../../components/skeletons/cards/property-card-user-side";
import SelectFieldBaseModelVariant2 from "../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2"
import { PropertyList } from "./styles"
import { getProperties } from "../../backend/server-actions/PropertyServerActions";
import SearchFilterBar from "../../components/skeletons/inputs/search-bars/search-filter-bar";
import FilteringSection from "../../components/skeletons/constructed/filtering/filtering-section";
import defaultImage from "../../assets/images/propertyExamplePic.png";
import { useAuth } from "../../contexts/auth";
import { useTranslation } from 'react-i18next';
import { Theme } from "../../theme/theme";
import { AuthModal } from '../../components/skeletons/constructed/modals/auth-modal';
import closeIcon from '../../components/skeletons/icons/Cross-Icon.svg';
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
  // Only properties with 'available' or 'rented' status are shown in search results
  // Properties with 'sold' or 'pending' status are considered unlisted and filtered out
  status: 'available' | 'sold' | 'pending' | 'rented';
  createdAt: Date;
  updatedAt: Date;
  listingId?: string;
  // UI specific properties
  isFavorite?: boolean;
  isRecommended?: boolean;
  subtitle?: string;
  priceType?: string;
  minstay?: string;
  location?: { lat: number; lng: number } | null;
  image?: string;
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
  toggleFavorite 
}: { 
  showMap: boolean,
  properties: PropertyType[],
  isCollapsed: boolean,
  setProperties: React.Dispatch<React.SetStateAction<PropertyType[]>>,
  toggleFavorite: (id: string | number) => void
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_MAP_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_MAP_ZOOM);
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
    if (property.location) {
      setMapCenter(property.location);
      setMapZoom(15); // Zoom in when a property is selected
    }
  }, []);

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
          setMapZoom(15);
          if (validProperties[0].location) {
            setMapCenter(validProperties[0].location);
          }
        } else {
          // Get the zoom after fitting bounds
          const newZoom = mapRef.current.getZoom();
          // Adjust zoom if needed
          if (newZoom && newZoom > 15) {
            setMapZoom(15);
          }
        }
      } else {
        // If no valid properties, center on Rabat
        setMapCenter(DEFAULT_MAP_CENTER);
        setMapZoom(DEFAULT_MAP_ZOOM);
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
                        {selectedProperty.bedrooms === 0 ? t('property_list.studio') : 
                         `${selectedProperty.bedrooms} ${selectedProperty.bedrooms === 1 ? t('property_list.bedroom') : t('property_list.bedrooms')}`}
                      </span>
                      <span className="feature-divider">•</span>
                      <span className="feature">
                        {selectedProperty.bathrooms} {selectedProperty.bathrooms === 1 ? t('property_list.bathroom') : t('property_list.bathrooms')}
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
}

const EnhancedPropertyCardComponent = ({ property, onToggleFavorite }: EnhancedPropertyCardProps) => {
  // Format property data for the card component
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.price);
  
  // Don't try to convert the ID, just pass it as is
  const propertyId = property.id;
  
  return (
    <div className="property-card-wrapper">
      <PropertyCard 
        image={property.image || defaultImage}
        title={property.title}
        subtitle={property.subtitle || ''}
        minstay={property.minstay || ''}
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

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'geometry']
  });

  // Load properties on mount
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setIsLoading(true);
        
        // Fetch properties from Firestore
        const fetchedProperties = await getProperties();
        
        if (fetchedProperties && fetchedProperties.length > 0) {
          // Transform Firestore data to match our PropertyType interface if needed
          const propertyData: PropertyType[] = fetchedProperties.map((prop) => {
            // Ensure we have proper type conversion
            const property = prop as any;
            
            // Convert Firestore timestamp to Date objects if needed
            let createdDate = new Date();
            let updatedDate = new Date();
            
            if (property.createdAt instanceof Date) {
              createdDate = property.createdAt;
            } else if (property.createdAt && typeof property.createdAt.toDate === 'function') {
              createdDate = property.createdAt.toDate();
            }
            
            if (property.updatedAt instanceof Date) {
              updatedDate = property.updatedAt;
            } else if (property.updatedAt && typeof property.updatedAt.toDate === 'function') {
              updatedDate = property.updatedAt.toDate();
            }
            
            // Use property's location if available, otherwise it will be geocoded later
            const location = property.location && 
                            typeof property.location.lat === 'number' && 
                            typeof property.location.lng === 'number' ? 
                            property.location : null;
            
            return {
              id: property.id || '',
              ownerId: property.ownerId || '',
              title: property.title || '',
              description: property.description || '',
              address: property.address || {
                street: '',
                city: 'Rabat',
                state: 'Rabat-Salé-Kénitra',
                zipCode: '',
                country: 'Morocco'
              },
              propertyType: (property.propertyType || 'apartment') as 'apartment' | 'house' | 'condo' | 'land' | 'commercial',
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              area: property.area || 0,
              price: property.price || 0,
              images: property.images || [],
              amenities: property.amenities || [],
              features: property.features || [],
              status: (property.status || 'available') as 'available' | 'sold' | 'pending' | 'rented',
              createdAt: createdDate,
              updatedAt: updatedDate,
              // UI specific properties
              isFavorite: Boolean(property.isFavorite),
              isRecommended: Boolean(property.isRecommended),
              subtitle: property.subtitle || '',
              priceType: property.priceType || '/month',
              minstay: property.minstay || '',
              location,
              image: property.image || defaultImage
            } as PropertyType;
          });
          
          // Filter out unlisted properties (those with status 'sold' or 'pending')
          const filteredProperties = propertyData.filter(property => property.status === 'available' || property.status === 'rented');
          
          console.log("Loaded properties from Firestore:", filteredProperties.length);
          setProperties(filteredProperties);
          setFilteredProperties(filteredProperties);
    setIsLoading(false);
          return;
    } else {
          console.log("No properties found in Firestore, using mock data");
          
          // If no properties found, use basic mock data with null locations (will be geocoded)
          const mockPropertiesBase: PropertyType[] = [
            {
              id: '1',
              ownerId: 'owner1',
              title: 'Luxury Apartment in Agdal',
              description: 'Beautiful apartment with great views of the city',
              address: {
                street: '123 Avenue Hassan II',
                city: 'Rabat',
                state: 'Rabat-Salé-Kénitra',
                zipCode: '10000',
                country: 'Morocco'
              },
              propertyType: 'apartment',
              bedrooms: 2,
              bathrooms: 2,
              area: 120,
              price: 7500,
              images: [],
              amenities: ['Parking', 'Pool', 'Gym', 'Furnished', 'WiFi'],
              features: ['Water included', 'Electricity included', 'WiFi included'],
              status: 'available',
              createdAt: new Date('2023-01-15'),
              updatedAt: new Date('2023-02-01'),
              subtitle: 'Modern living in the heart of the city',
              priceType: 'MAD/month',
              minstay: '12 months',
              isFavorite: false,
              isRecommended: true,
            image: defaultImage,
              location: null
            },
            {
              id: '2',
              ownerId: 'owner2',
              title: 'Cozy Studio Near University',
              description: 'Perfect for students, close to campus',
              address: {
                street: '45 Avenue Mohammed V',
                city: 'Rabat',
                state: 'Rabat-Salé-Kénitra',
                zipCode: '10010',
                country: 'Morocco'
              },
              propertyType: 'apartment',
              bedrooms: 0,
              bathrooms: 1,
              area: 50,
              price: 3200,
              images: [],
              amenities: ['Furnished', 'WiFi'],
              features: ['WiFi included'],
              status: 'available',
              createdAt: new Date('2023-03-10'),
              updatedAt: new Date('2023-03-15'),
              subtitle: 'Student-friendly housing',
              priceType: 'MAD/month',
              minstay: '6 months',
              isFavorite: false,
              isRecommended: false,
              image: defaultImage,
              location: null
            }
          ];
          
          // Filter mock data before setting state
          const availableMockProperties = mockPropertiesBase.filter(
            property => property.status === 'available' || property.status === 'rented'
          );
          
          setProperties(availableMockProperties);
          setFilteredProperties(availableMockProperties);
        }
      } catch (error) {
        console.error('Error loading properties:', error);
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  // Handler functions
  const handleDateChange = (date: string) => {
    setDateInput(date);
  };

  const handleGenderChange = (gender: string) => {
    setGenderInput(gender);
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
    console.log("Current active filters:", filtersToUse);
    
    // Update active filters if we were provided with filters
    if (filtersToApply) {
      setActiveFilters(filtersToApply);
    }
    
    // Directly apply filtering here
    const filtered = properties.filter(property => {
      // Check each filter
      for (const filter of filtersToUse) {
        // Skip if we don't have a filter
        if (!filter) continue;
        
        // Bedroom filters
        if (filter === t('property_list.studio')) {
          if (property.bedrooms === undefined || typeof property.bedrooms !== 'number' || property.bedrooms !== 0) {
            return false;
          }
        } else if (filter.includes(t('property_list.bedroom')) || filter.includes(t('property_list.bedrooms'))) {
          const bedroomMatch = filter.match(/^(\d+)\+?\s/);
          if (bedroomMatch) {
            const filterBedrooms = parseInt(bedroomMatch[1], 10);
            const isPlus = filter.includes('+');
            
            if (property.bedrooms === undefined || typeof property.bedrooms !== 'number') {
              return false;
            }
            
            if (isPlus && property.bedrooms < filterBedrooms) {
              return false;
            } else if (!isPlus && property.bedrooms !== filterBedrooms) {
              return false;
            }
          }
        }
        
        // Property Type filters - normalize case for comparison
        const normalizedPropertyType = property.propertyType.toLowerCase();
        if (filter === "Apartment" && normalizedPropertyType !== 'apartment') {
          return false;
        } else if (filter === "House" && normalizedPropertyType !== 'house') {
          return false;
        } else if (filter === "Condo" && normalizedPropertyType !== 'condo') {
          return false;
        } else if (filter === "Commercial" && normalizedPropertyType !== 'commercial') {
          return false;
        }
        
        // Price range filter
        if (filter.includes(" to ")) {
          const [min, max] = filter.split(" to ").map(part => parseInt(part.replace(/\D/g, '')));
          if (property.price < min || property.price > max) {
            return false;
          }
        }
        
        // Amenity filters
        const amenityFilters = ['Furnished', 'WiFi', 'Parking', 'Pool', 'Fitness Center', 'Pets Allowed'];
        if (amenityFilters.includes(filter)) {
          const hasAmenity = property.amenities.some(a => 
            a.toLowerCase() === filter.toLowerCase() ||
            (filter === 'WiFi' && a.toLowerCase() === 'wi-fi')
          );
          if (!hasAmenity) {
            return false;
          }
        }
        
        // Included fees
        if (filter === 'water' || filter === 'electricity' || filter === 'wifi') {
          const hasFeature = property.features.some(f => 
            f.toLowerCase().includes(filter.toLowerCase())
          );
          if (!hasFeature) {
            return false;
          }
        }
        
        // Location filter
        if (filter.startsWith('Location:')) {
          const locationQuery = filter.replace('Location:', '').trim().toLowerCase();
          const propertyLocation = (property.address.city + ', ' + property.address.state).toLowerCase();
          if (!propertyLocation.includes(locationQuery)) {
            return false;
          }
        }
      }
      
      return true;
    });
    
    console.log("Filtered properties count:", filtered.length);
    
    // Apply sorting
    const sortedProperties = applySort(filtered);
    
    // Update the state
    setFilteredProperties(sortedProperties);
    setCurrentPage(1);
    setIsFilteringSectionVisible(false);
    setIsLoading(false);
  }, [activeFilters, properties, t, applySort]);

  // Clear all filters
  const clearAllFilters = () => {
    setIsLoading(true);
    
    // Clear filter states immediately
    setActiveFilters([]);
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
  };

  // Handle search
  const handleSearch = () => {
    // Apply current filters and decide whether to hide filtering section
    // Only hide filtering section if we're currently in search view
    applyCurrentFilters();
  };

  // Handle search input changes with debounce
  const handleSearchInputChange = (location: string) => {
    // Update the location input state
    setLocationInput(location);
    
    // Clear previous timeout if it exists
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set a new timeout to delay the search execution
    const newTimeout = setTimeout(() => {
      // If there's a search value, update the activeFilters state using the functional update pattern
      if (location.trim()) {
        // Using functional update to ensure we have the latest state
        setActiveFilters(prevFilters => {
          // Check if we already have a location filter
          const hasLocationFilter = prevFilters.some(f => f.startsWith('Location:'));
          let newFilters = [...prevFilters];
          
          // Remove existing location filter if any
          if (hasLocationFilter) {
            newFilters = newFilters.filter(f => !f.startsWith('Location:'));
          }
          
          // Add new location filter
          const newLocationFilter = `Location: ${location}`;
          newFilters = [...newFilters, newLocationFilter];
          
          // Return the updated filters without applying immediately
          return newFilters;
        });
      } else {
        // If location is empty, remove any location filters
        setActiveFilters(prevFilters => {
          const newFilters = prevFilters.filter(f => !f.startsWith('Location:'));
          // Return the updated filters without applying immediately
          return newFilters;
        });
      }
      // No automatic apply of filters
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
  const toggleFavorite = useCallback((propertyId: string | number) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setProperties(prevProperties => 
      prevProperties.map(property => 
        property.id === propertyId 
          ? { ...property, isFavorite: !property.isFavorite } 
          : property
      )
    );

    setFilteredProperties(prevFiltered => 
      prevFiltered.map(property => 
        property.id === propertyId 
          ? { ...property, isFavorite: !property.isFavorite } 
          : property
      )
    );
  }, [isAuthenticated]);

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
                      
                      return (
                        <div 
                          className="result" 
                          key={propertyKey}
                        >
                          <EnhancedPropertyCard 
                            property={property} 
                            onToggleFavorite={toggleFavorite} 
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
      />

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
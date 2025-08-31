import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMap, IoChevronBackOutline, IoChevronForwardOutline, IoClose } from 'react-icons/io5';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { AppliedFilterBannerComponent } from "../../components/skeletons/banners/static/applied-filter-banner";
import { PropertyCard } from "../../components/skeletons/cards/property-card-user-side";
import { PropertyCardSkeleton } from "../../components/skeletons/cards/property-card-skeleton";
import SelectFieldBaseModelVariant2 from "../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2"
import { PropertyList } from "./styles"
import { getProperties } from "../../backend/server-actions/PropertyServerActions";
import SearchFilterBar from "../../components/skeletons/inputs/search-bars/search-filter-bar";
import FilteringSection from "../../components/skeletons/constructed/filtering/filtering-section";
// defaultImage import removed (unused)

import { useAuth } from "../../contexts/auth";
import { useTranslation } from 'react-i18next';
import { Theme } from "../../theme/theme";
import { AuthModal } from '../../components/skeletons/constructed/modals/auth-modal';
import closeIcon from '../../components/skeletons/icons/Cross-Icon.svg';
import { toggleSavedProperty, isPropertySaved } from "../../backend/server-actions/ClientServerActions";
import { getGoogleMapsLoaderOptions } from '../../utils/googleMapsConfig';



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
  propertyType: 'apartment' | 'house' | 'studio' | 'room' | 'villa' | 'penthouse' | 'townhouse';
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
  
  // Housing preferences
  housingPreference?: string; // 'womenOnly' | 'familiesOnly' | etc.
  
  // Dedicated fields for allowed rules
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  
  // Dedicated fields for included utilities
  includesWater?: boolean;
  includesElectricity?: boolean;
  includesWifi?: boolean;
  includesGas?: boolean;
  
  // Dedicated fields for property features
  hasBalcony?: boolean;
  hasCentralHeating?: boolean;
  hasParking?: boolean;
  hasAirConditioning?: boolean;
  hasWoodenFloors?: boolean;
  hasElevator?: boolean;
  hasSwimmingPool?: boolean;
  hasFireplace?: boolean;
  isAccessible?: boolean;
}

// Define sort option type 
type SortOptionType = string;

// Add constants for the Google Maps integration
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
  // const { t } = useTranslation();
  
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
  // removed unused isAuthenticated

  // Debug properties being passed to map
  useEffect(() => {
    if (properties.length > 0) {
      console.log(`PropertyMap received ${properties.length} properties`);
      const withLocations = properties.filter(p => p.location && typeof p.location.lat === 'number');
      console.log(`${withLocations.length} properties have valid location data`);
    }
  }, [properties]);

  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader(getGoogleMapsLoaderOptions());
  // mark unused param as referenced to satisfy TS noUnusedParameters
  void toggleFavorite;

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
                  <div className="info-window-image-container" style={{ 
                    width: '100%', 
                    aspectRatio: '4/3', 
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '8px'
                  }}>
                    <img 
                      src={selectedProperty.image} 
                      alt={selectedProperty.title} 
                      className="info-window-image"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
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
        images={property.images}
        title={property.title}
        subtitle={property.subtitle || ''}
        minstay={property.minstay || '1'}
        price={formattedPrice}
        priceType={property.priceType || ''}
        description={property.description}
        propertyType={property.propertyType}
        isRecommended={!!property.isRecommended}
        isFavorite={!!property.isFavorite}
        housingPreference={property.housingPreference}
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

// Handle amenities, features and other array-based filters with string normalization
const arrayBasedFilters = {
  amenities: [
    'desk', 'cabinet', 'dining-table', 'wardrobe', 'chair', 'sofa', 'dresser',
    'walk-in-closet', 'oven', 'hotplate-cooktop', 'mirror', 'washing-machine', 'gym'
  ],
  features: [
    'balcony', 'central-heating', 'parking-space', 'air-conditioning', 'wooden-floors',
    'elevator', 'swimming-pool', 'fireplace', 'accessible', 'water', 'electricity', 'wifi', 'gas'
  ]
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

  // Read URL search parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const locationParam = params.get('location');
    const dateParam = params.get('date');
    
    // Set initial filter values from URL parameters
    if (locationParam) {
      setLocationInput(locationParam);
      setPendingFilters(prev => {
        // Remove any existing location filter
        const filtered = prev.filter(f => f.type !== 'Location');
        // Add the new location filter
        return [...filtered, { type: 'Location', value: locationParam }];
      });
    }
    
    if (dateParam) {
      setDateInput(dateParam);
      setPendingFilters(prev => {
        // Remove any existing date filter
        const filtered = prev.filter(f => f.type !== 'Date');
        // Add the new date filter
        return [...filtered, { type: 'Date', value: dateParam }];
      });
    }
    
    // Apply URL parameters as active filters after properties are loaded
    if (locationParam || dateParam) {
      const newFilters: string[] = [];
      
      if (locationParam) {
        newFilters.push(`Location: ${locationParam}`);
      }
      
      if (dateParam) {
        newFilters.push(dateParam); // Date filters are just the date string
      }
      
      setActiveFilters(newFilters);
    }
  }, [location.search]);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader(getGoogleMapsLoaderOptions());

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
                const isFavorite = await isPropertySaved(property.id.toString());
                return { ...property, isFavorite };
              })
            );
            return propertiesWithFavorites;
          };
          
          fetchedProperties = await checkFavoriteStatus();
        }
        
        // Set properties and filtered properties
        const processedProperties = fetchedProperties.map(property => ({
          ...property,
          subtitle: property.address?.city || '',
          priceType: '/month',
          minstay: property.minstay?.toString() || '1',
          isRecommended: false,
          // If not authenticated, isFavorite will be false by default
          isFavorite: (property as any).isFavorite || false,
          // Ensure isFurnished is always boolean, default to false if undefined
          isFurnished: property.isFurnished || false
        })) as PropertyType[];
        
        setProperties(processedProperties);
        setFilteredProperties(processedProperties);
        setIsLoading(false);
        
        // Apply any active filters immediately after loading properties
        if (activeFilters.length > 0) {
          setTimeout(() => {
            applyCurrentFilters(activeFilters);
          }, 0);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, [isAuthenticated, activeFilters]); // Add activeFilters as a dependency

  // Handler functions
  const handleDateChange = (date: string) => {
    setDateInput(date);
    
    try {
      // If date is cleared, mark to remove this filter type
      if (!date) {
        setPendingFilters(prev => prev.filter(filter => filter.type !== 'Date'));
        return;
      }
      
      // Normalize date format to ensure consistency
      let normalizedDate = date;
      
      // If date includes time part (T), remove it
      if (date.includes('T')) {
        normalizedDate = date.split('T')[0];
      }
      
      // Format date for display in filter
      const dateObj = new Date(normalizedDate);
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        console.error('Invalid date string:', date);
        return;
      }
      
      // Re-format to ensure YYYY-MM-DD format
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      console.log(`Original date: ${date}, Normalized: ${normalizedDate}, Formatted: ${formattedDate}`);
      
      // Prepare date filter to be added when search is executed
      setPendingFilters(prev => {
        // Remove existing date filter if any
        const filtersWithoutDate = prev.filter(filter => filter.type !== 'Date');
        // Add the new filter to pending filters - use the formatted date string
        return [...filtersWithoutDate, { type: 'Date', value: formattedDate }];
      });
      
      console.log('Date input changed to:', formattedDate);
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
      
      // Important: Each filter must pass for the property to be included (AND logic)
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
          continue; // Continue to next filter since this one passed
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
        
        // Handle amenities, features and other array-based filters with string normalization
        if ([...arrayBasedFilters.amenities, ...arrayBasedFilters.features].includes(filter)) {
          console.log(`Processing filter: ${filter} for property ${property.id}`);
          
          // Function to safely normalize strings
          const normalize = (str: any): string => {
            if (!str) return '';
            // More aggressive normalization - remove all non-alphanumeric characters
            return str.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
          };
          
          // Get the normalized filter value
          const normalizedFilter = normalize(filter);
          console.log(`Normalized filter: "${normalizedFilter}" (from "${filter}")`);
          
          // Determine which array to check based on the filter
          let arrayToCheck: string[] = [];
          let arrayName = '';
          
          if (arrayBasedFilters.amenities.includes(filter)) {
            arrayToCheck = property.amenities || [];
            arrayName = 'amenities';
          } else if (arrayBasedFilters.features.includes(filter)) {
            arrayToCheck = property.features || [];
            arrayName = 'features';
          }

          // No array to check
          if (!arrayToCheck.length) {
            console.log(`Property ${property.id} has no ${arrayName} array, filtering out`);
            return false;
          }
          
          // Log the array contents for debugging
          console.log(`Property ${property.id} ${arrayName}:`, arrayToCheck);
          
          // Additional validation - check if any array item is empty or null
          const hasEmptyItems = arrayToCheck.some(item => !item || item.trim() === '');
          if (hasEmptyItems) {
            console.warn(`Property ${property.id} has empty or null items in ${arrayName} array`);
          }
          
          // Check if any array item matches after normalization
          const hasMatch = arrayToCheck.some(item => {
            if (!item) return false;
            
            const normalizedItem = normalize(item);
            
            // Try multiple matching approaches
            // 1. Direct match after normalization
            const exactMatch = normalizedItem === normalizedFilter;
            
            // 2. One contains the other (to handle partial matches)
            // For walk-in-closet we need to be more careful with partial matches
            // Let's use stricter matching for composite terms
            let containmentMatch = false;
            
            if (filter.includes('-')) {
              // For composite terms like "walk-in-closet", use more careful matching
              // either exact match or item must explicitly contain the whole composite term
              containmentMatch = normalizedItem.includes(normalizedFilter);
            } else {
              // For simple terms, allow either direction of containment
              containmentMatch = normalizedItem.includes(normalizedFilter) || 
                                 normalizedFilter.includes(normalizedItem);
            }
            
            // Special handling for composite names (with dashes)
            // Ensure all parts are present and in the right order
            const isCompositeMatch = filter.includes('-') && 
                                    filter.split('-').every(part => {
                                      const normalizedPart = normalize(part);
                                      return normalizedItem.includes(normalizedPart);
                                    }) &&
                                    // Additional check for proper ordering of terms
                                    filter.split('-').reduce((lastIndex, part) => {
                                      const normalizedPart = normalize(part);
                                      const partIndex = normalizedItem.indexOf(normalizedPart, lastIndex);
                                      return partIndex !== -1 ? partIndex + normalizedPart.length : -1;
                                    }, 0) !== -1;
            
            console.log(`  Comparing: "${item}" → normalized: "${normalizedItem}"`);
            console.log(`    - Exact match: ${exactMatch}`);
            console.log(`    - Contains relationship: ${containmentMatch}`);
            console.log(`    - Composite match: ${isCompositeMatch}`);
            
            // For walk-in-closet, be more strict
            if (filter === 'walk-in-closet') {
              // Only accept exact matches or very specific composite matches
              return exactMatch || (isCompositeMatch && containmentMatch);
            }
            
            // Also be strict with simple closet or wardrobe terms to avoid confusion with walk-in-closet
            if (filter === 'wardrobe' || filter === 'closet') {
              // Avoid matching if the item contains "walk-in" or "walk in"
              if (normalizedItem.includes('walkin') || normalizedItem.includes('walk')) {
                return false;
              }
            }
            
            return exactMatch || containmentMatch || isCompositeMatch;
          });
          
          if (!hasMatch) {
            console.log(`Property ${property.id} does not match ${arrayName} filter: "${filter}", filtering out`);
            return false;
          }
          
          console.log(`Property ${property.id} matches ${arrayName} filter: "${filter}"`);
          continue; // Continue to next filter since this one passed
        }
        
        // Handle date filter - check if property is available from the selected date
        if ((filter.includes(':') && filter.split(':')[0].trim() === 'Date') || 
            ((filter.includes('-') || filter.includes('/')) && 
            // Make sure it's not an amenity with a dash
            ![...arrayBasedFilters.amenities, ...arrayBasedFilters.features].includes(filter))) {
          try {
            // Extract the actual date value if it's in the format "Date: YYYY-MM-DD"
            let dateValue = filter;
            if (filter.includes(':') && filter.split(':')[0].trim() === 'Date') {
              dateValue = filter.split(':')[1].trim();
            }
            
            // Standardize date format from either MM/DD/YYYY or YYYY-MM-DD
            let selectedDate: Date;
            
            if (dateValue.includes('/')) {
              // Handle MM/DD/YYYY format
              const [month, day, year] = dateValue.split('/').map(num => parseInt(num, 10));
              selectedDate = new Date(year, month - 1, day);
            } else {
              // Handle YYYY-MM-DD format (possibly with time)
              selectedDate = new Date(dateValue.split('T')[0]);
            }
            
            console.log(`Processing date filter: ${filter}, parsed as: ${selectedDate.toISOString().split('T')[0]}`);
            
            // Skip this filter if the date is invalid
            if (isNaN(selectedDate.getTime())) {
              console.log(`Invalid date filter: ${filter}, skipping`);
              continue;
            }
            
            // Reset time portion to midnight to compare dates only
            selectedDate.setHours(0, 0, 0, 0);
             
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
              // Try to handle various string date formats
              if (property.availableFrom.includes('T')) {
                // ISO format
                availableFromDate = new Date(property.availableFrom);
              } else if (property.availableFrom.includes('/')) {
                // MM/DD/YYYY format
                const [month, day, year] = property.availableFrom.split('/').map(num => parseInt(num, 10));
                availableFromDate = new Date(year, month - 1, day);
              } else if (property.availableFrom.includes('-')) {
                // YYYY-MM-DD format
                availableFromDate = new Date(property.availableFrom);
              } else {
                // Try direct parsing as a last resort
                availableFromDate = new Date(property.availableFrom);
              }
            } else if (property.availableFrom && typeof (property.availableFrom as any).toDate === 'function') {
              // Handle Firestore Timestamp objects which have a toDate() method
              availableFromDate = (property.availableFrom as any).toDate();
            } else if (property.availableFrom && typeof property.availableFrom === 'object' && 
                      'seconds' in (property.availableFrom as any)) {
              // Handle Firestore Timestamp-like objects
              const timestamp = property.availableFrom as any;
              availableFromDate = new Date(timestamp.seconds * 1000);
            } else {
              // If we can't parse the date, skip this property
              console.log(`Property ${property.id} has invalid availableFrom date format, filtering out`);
              return false;
            }
            
            // Reset time portion to midnight for fair comparison
            availableFromDate.setHours(0, 0, 0, 0);
            
            // Debug logs
            console.log(`Property ${property.id} availableFrom: ${availableFromDate.toISOString().split('T')[0]}`);
            console.log(`Selected date: ${selectedDate.toISOString().split('T')[0]}`);
            console.log(`Comparison result: ${availableFromDate <= selectedDate ? 'Available' : 'Not available'}`);
            
            // Check if the property is available from the selected date
            // Property is available if its availableFrom date is on or before the selected date
            if (availableFromDate > selectedDate) {
              console.log(`Property ${property.id} is not available from ${selectedDate.toISOString().split('T')[0]}, filtering out`);
              return false;
            }
            
            console.log(`Property ${property.id} is available from ${selectedDate.toISOString().split('T')[0]}`);
            continue;
          } catch (error) {
            console.error(`Error processing date filter for property ${property.id}:`, error);
            // Skip this filter if there's an error
            continue;
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
            const matches = capacityText.match(/(\d+)\+/);
            if (matches && matches[1]) {
              requiredCapacity = parseInt(matches[1], 10);
            }
          } else {
            // Handle "X People" or "1 Person" format
            const matches = capacityText.match(/(\d+)/);
            if (matches && matches[1]) {
              requiredCapacity = parseInt(matches[1], 10);
            }
          }
          
          console.log(`Checking capacity filter: ${capacityText} (${requiredCapacity}${isPlus ? '+' : ''}) for property ${property.id}`);
          
          // Parse property capacity, handling different formats
          let propertyCapacity: number | undefined;
          
          if (property.capacity !== undefined) {
            if (typeof property.capacity === 'number') {
              propertyCapacity = property.capacity;
            } else if (typeof property.capacity === 'string') {
              // Try to parse string capacity to number
              propertyCapacity = parseInt(property.capacity, 10);
              if (isNaN(propertyCapacity)) {
                propertyCapacity = undefined;
              }
            }
          }
          
          // If property has no valid capacity info, filter it out
          if (propertyCapacity === undefined) {
            console.log(`Property ${property.id} has no valid capacity info, filtering out`);
            return false;
          }
          
          // Check if property's capacity meets the requirement
          if (isPlus) {
            // For "X+ People", property capacity must be at least X
            if (propertyCapacity < requiredCapacity) {
              console.log(`Property ${property.id} capacity ${propertyCapacity} is less than required ${requiredCapacity}+, filtering out`);
              return false;
            }
          } else {
            // For exact capacity, property must match exactly
            if (propertyCapacity !== requiredCapacity) {
              console.log(`Property ${property.id} capacity ${propertyCapacity} does not match required ${requiredCapacity}, filtering out`);
              return false;
            }
          }
          
          console.log(`Property ${property.id} passes capacity filter with capacity ${propertyCapacity}`);
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
          if (property.isFurnished !== true) {
            console.log(`Property ${property.id} is not furnished, filtering out`);
            return false;
          }
          console.log(`Property ${property.id} is furnished, passing filter`);
          continue; // Continue to next filter since this one passed
        }
        
        // Handle housing preferences (womenOnly, familiesOnly)
        if (filter === 'womenOnly' || filter === 'familiesOnly') {
          console.log(`Checking housing preference filter: ${filter} for property ${property.id}`);
          
          // Check if we have a direct match on the housingPreference field
          if (property.housingPreference === filter) {
            console.log(`Property ${property.id} matches housing preference via housingPreference field: ${filter}`);
            continue; // Continue to next filter since this one passed
          }
          
          // If no match and housingPreference is set to something else, filter out
          if (property.housingPreference) {
            console.log(`Property ${property.id} has different housingPreference: ${property.housingPreference}, filtering out`);
            return false;
          }
          
          // If no housingPreference field, check rules array as fallback (older data)
          if (property.rules && Array.isArray(property.rules)) {
            const ruleMap = {
              'womenOnly': ['women only', 'womenonly', 'women-only', 'women'],
              'familiesOnly': ['families only', 'familiesonly', 'families-only', 'families', 'family only']
            };
            
            const possibleRuleNames = ruleMap[filter as keyof typeof ruleMap] || [];
            
            // Check if the property has any matching rule and it's allowed
            const ruleMatch = property.rules.find(r => {
              if (!r.name) return false;
              const ruleName = r.name.toLowerCase().replace(/[\s-_]+/g, '');
              return possibleRuleNames.some(possibleName => 
                ruleName === possibleName || ruleName.includes(possibleName)
              );
            });
            
            if (ruleMatch && ruleMatch.allowed) {
              console.log(`Property ${property.id} has matching rule "${ruleMatch.name}" allowed: true`);
              continue; // Continue to next filter since this one passed
            }
          }
          
          console.log(`Property ${property.id} does not match housing preference: ${filter}, filtering out`);
          return false;
        }
        
        // Handle special boolean filters: isFurnished, petsAllowed, smokingAllowed
        const booleanFilters = ['isFurnished', 'petsAllowed', 'smokingAllowed'];
        if (booleanFilters.includes(filter)) {
          console.log(`Checking boolean filter: ${filter} for property ${property.id}`);
          
          // For these filters, check if the corresponding property field is true
          if (property[filter as keyof PropertyType] === true) {
            console.log(`Property ${property.id} has ${filter} = true`);
            continue; // Continue to next filter since this one passed
          }
          
          // For petsAllowed and smokingAllowed, try the rules array as fallback
          if ((filter === 'petsAllowed' || filter === 'smokingAllowed') && property.rules && Array.isArray(property.rules)) {
            const ruleTerms = {
              'petsAllowed': ['pet', 'pets', 'animal', 'animals'],
              'smokingAllowed': ['smoking', 'smoke']
            };
            
            const relevantTerms = filter === 'petsAllowed' ? ruleTerms.petsAllowed : ruleTerms.smokingAllowed;
            
            // Look for matching rule
            const matchingRule = property.rules.find(rule => {
              if (!rule.name) return false;
              const ruleName = rule.name.toLowerCase();
              return relevantTerms.some(term => ruleName.includes(term));
            });
            
            if (matchingRule && matchingRule.allowed === true) {
              console.log(`Property ${property.id} has ${filter} allowed via rules array`);
              continue; // Continue to next filter since this one passed
            }
          }
          
          console.log(`Property ${property.id} doesn't have ${filter} = true, filtering out`);
          return false;
        }
        
        // Housing preference filters
        if (filter === 'womenOnly' || filter === 'familiesOnly') {
          console.log(`Checking housing preference filter: ${filter} for property ${property.id}`);
          
          // Exact match on the housingPreference field
          if (property.housingPreference === filter) {
            console.log(`Property ${property.id} matches housing preference via housingPreference field: ${filter}`);
            continue; // Continue to next filter since this one passed
          }
          
          // If a different preference is set, filter out
          if (property.housingPreference) {
            console.log(`Property ${property.id} has different housingPreference: ${property.housingPreference}, filtering out`);
            return false;
          }
          
          // Fallback to rules for older data format
          if (property.rules && Array.isArray(property.rules)) {
            const ruleTerms = {
              'womenOnly': ['women', 'woman', 'female'],
              'familiesOnly': ['family', 'families', 'children']
            };
            
            const relevantTerms = filter === 'womenOnly' ? ruleTerms.womenOnly : ruleTerms.familiesOnly;
            
            const matchingRule = property.rules.find(rule => {
              if (!rule.name) return false;
              const ruleName = rule.name.toLowerCase();
              return relevantTerms.some(term => ruleName.includes(term));
            });
            
            if (matchingRule && matchingRule.allowed === true) {
              console.log(`Property ${property.id} matches ${filter} via rules array`);
              continue; // Continue to next filter since this one passed
            }
          }
          
          console.log(`Property ${property.id} does not match housing preference: ${filter}, filtering out`);
          return false;
        }

        // Property type filters
        if (['apartment', 'house', 'studio', 'room', 'condo', 'commercial', 'villa', 'penthouse', 'townhouse'].includes(filter)) {
          console.log(`Checking property type filter: ${filter} for property ${property.id}, has type: ${property.propertyType}`);
          
          // Case-insensitive property type comparison
          if (property.propertyType && property.propertyType.toLowerCase() === filter.toLowerCase()) {
            console.log(`Property ${property.id} matches property type: ${filter}`);
            continue; // Continue to next filter since this one passed
          }
          
          console.log(`Property ${property.id} does not match property type: ${filter}, filtering out`);
          return false;
        }
      }
      
      // If we reach here, it means the property passed ALL filters
      console.log(`Property ${property.id} passed ALL filters`);
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
      // Toggle favorite in the database
      const added = await toggleSavedProperty(propertyId.toString());
      
      // Update the local UI state based on the result from the server
    setProperties(prevProperties => 
      prevProperties.map(property => 
        property.id === propertyId 
            ? { ...property, isFavorite: added } 
          : property
      )
    );

    setFilteredProperties(prevFiltered => 
      prevFiltered.map(property => 
        property.id === propertyId 
            ? { ...property, isFavorite: added } 
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
                <div className="results-container">
                  {Array.from({length: propertiesPerPage}).map((_, idx) => (
                    <div className="result" key={`skeleton-${idx}`}>
                      <div style={{ width: '100%' }}>
                        <PropertyCardSkeleton />
                      </div>
                    </div>
                  ))}
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
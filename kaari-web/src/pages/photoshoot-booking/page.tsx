import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PhotoshootBookingPageStyle } from './styles';
import UnifiedHeader from '../../components/skeletons/constructed/headers/unified-header';
import CalendarComponent from '../../components/skeletons/constructed/calendar/calendar';
import InputBaseModel from '../../components/skeletons/inputs/input-fields/input-variant';
import TextAreaBaseModel from '../../components/skeletons/inputs/input-fields/textarea-variant';
import { PurpleButtonLB60 } from '../../components/skeletons/buttons/purple_LB60';
import { DEFAULT_TIME_SLOTS } from '../../config/constants';

import { FaClock, FaChevronLeft, FaChevronRight, FaSpinner, FaMapMarkerAlt, FaSearch, FaPhoneAlt, FaUser } from 'react-icons/fa';
import SelectFieldBaseModelVariant1 from '../../components/skeletons/inputs/select-fields/select-field-base-model-variant-1';
import photoshootService from '../../services/photoshoot-service';
import Modal from '../../components/skeletons/constructed/modal/modal';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { getGoogleMapsLoaderOptions } from '../../utils/googleMapsConfig';
import { useStore } from '../../backend/store';

// Default map center (Rabat, Morocco)
const DEFAULT_MAP_CENTER = { lat: 34.020882, lng: -6.841650 };

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '12px',
};

// Declare global google namespace
declare global {
  interface Window {
    google: any;
  }
}

const PhotoshootBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Get current user information from the store
  const currentUser = useStore(state => state.user);
  
  // State for form values
  const [formData, setFormData] = useState({
    streetName: '',
    streetNumber: '',
    floor: '',
    city: '',
    postalCode: '',
    flat: '',
    stateRegion: '',
    country: '',
    propertyType: t('photoshoot_booking.property_types.apartment'),
    phoneNumber: currentUser?.phoneNumber || '', // Prefill phone number if available
    name: currentUser?.name || '', // Prefill name if available
    date: '',
    timeSlot: '',
    comments: '',
    location: DEFAULT_MAP_CENTER, // Start with default location
  });

  // State for selected date
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [displayDate, setDisplayDate] = useState('Wednesday, May 15th');
  
  // State for time slots
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>(DEFAULT_TIME_SLOTS);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  
  // State for booking process
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [disabledDates] = useState<Date[]>([]);

  // Google Maps-related state - explicitly initialize marker position with default
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(DEFAULT_MAP_CENTER);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral>(DEFAULT_MAP_CENTER);
  const [mapZoom, setMapZoom] = useState(12);
  const [showFallbackMarker, setShowFallbackMarker] = useState(false);
  
  // Refs for maps
  const mapRef = useRef<google.maps.Map>();
  const searchBoxRef = useRef<google.maps.places.SearchBox>();
  const geocoderRef = useRef<google.maps.Geocoder>();

  // Property type options
  const propertyTypeOptions = [
    t('photoshoot_booking.property_types.apartment'),
    t('photoshoot_booking.property_types.house'),
    t('photoshoot_booking.property_types.villa'),
    t('photoshoot_booking.property_types.penthouse'),
    t('photoshoot_booking.property_types.studio'),
    t('photoshoot_booking.property_types.townhouse')
  ];

  // Add this useEffect to check for authentication state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, () => {
      // Authentication state change handler - implementation removed but keeping the hook
      // for future use
    });
    
    return () => unsubscribe();
  }, []);

  // Load Google Maps JavaScript API
  const { isLoaded } = useJsApiLoader(getGoogleMapsLoaderOptions());

  // Force marker to be visible when component mounts and any time isLoaded changes
  useEffect(() => {
    if (isLoaded) {
      console.log("Maps API loaded, ensuring marker is visible");
      // Always set a marker position when the map loads
      setMarkerPosition(prevPosition => {
        // Only update if not already set
        if (!prevPosition || (prevPosition.lat === 0 && prevPosition.lng === 0)) {
          console.log("Setting initial marker position to:", DEFAULT_MAP_CENTER);
          return DEFAULT_MAP_CENTER;
        }
        console.log("Keeping existing marker position:", prevPosition);
        return prevPosition;
      });
      
      // Make sure map is centered
      setMapCenter(DEFAULT_MAP_CENTER);
    }
  }, [isLoaded]);
  
  // Add direct timeout to ensure marker is set after the map is fully loaded
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        if (!markerPosition || (markerPosition.lat === 0 && markerPosition.lng === 0)) {
          console.log("Timeout: forcing marker position to be set");
          setMarkerPosition(DEFAULT_MAP_CENTER);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded, markerPosition]);

  // Create geocoder instance when maps are loaded
  useEffect(() => {
    if (isLoaded && window.google && window.google.maps) {
      geocoderRef.current = new window.google.maps.Geocoder();
      console.log("Maps loaded, geocoder initialized");
    }
  }, [isLoaded]);

  // Create a function to handle reverse geocoding and updating fields
  const updateAddressFromLocation = useCallback((position: { lat: number, lng: number }) => {
    if (!geocoderRef.current) {
      console.log("Geocoder not available");
      return;
    }
    
    console.log("Reverse geocoding position:", position);
    
    geocoderRef.current.geocode({ location: position }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        console.log("Geocoding result:", results[0]);
        const place = results[0];
          
          // Extract address components
          if (place.address_components) {
            let streetName = '';
            let streetNumber = '';
            let city = '';
            let state = '';
            let postalCode = '';
            let country = '';
            
            place.address_components.forEach(component => {
              const types = component.types;
              
              if (types.includes('street_number')) {
                streetNumber = component.long_name;
              }
              
              if (types.includes('route')) {
                streetName = component.long_name;
              }
              
              if (types.includes('locality')) {
                city = component.long_name;
              }
              
              if (types.includes('administrative_area_level_1')) {
                state = component.long_name;
              }
              
              if (types.includes('postal_code')) {
                postalCode = component.long_name;
              }
              
              if (types.includes('country')) {
                country = component.long_name;
              }
            });
          
          console.log("Extracted address components:", {
            streetName, streetNumber, city, state, postalCode, country
            });
            
            // Update form data with address components
            setFormData(prev => ({
              ...prev,
              streetName: streetName || prev.streetName,
              streetNumber: streetNumber || prev.streetNumber,
              city: city || prev.city,
              stateRegion: state || prev.stateRegion,
              postalCode: postalCode || prev.postalCode,
            country: country || prev.country,
            location: position
            }));
          }
      } else {
        console.log("Geocoding failed with status:", status);
        }
    });
  }, []);

  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    console.log("Map loaded, setting ref");
    mapRef.current = map;
    
    // Make sure we have a marker visible by default
    console.log("Current marker position on map load:", markerPosition);
    
    // Add click listener to map to allow placing marker by clicking
    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const clickPosition = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        };
        
        console.log("Map clicked, setting new position:", clickPosition);
        
        // Update marker position and map center
        setMarkerPosition(clickPosition);
        setMapCenter(clickPosition);
        
        // Update address fields from the new location
        updateAddressFromLocation(clickPosition);
      }
    });
  }, []);

  // Handle search box load
  const onSearchBoxLoad = useCallback((searchBox: google.maps.places.SearchBox) => {
    searchBoxRef.current = searchBox;
  }, []);

  // Handle search box places changed
  const onPlacesChanged = useCallback(() => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      
      console.log("Places changed, received places:", places?.length);
      
      if (places && places.length > 0) {
        const place = places[0];
        console.log("Selected place:", place.formatted_address);
        
        if (place.geometry && place.geometry.location) {
          // Get location
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          
          console.log("New location from search:", location);
          
          // Update map
          setMapCenter(location);
          setMarkerPosition(location);
          setMapZoom(16);
          
          // Update address fields from the new location
          updateAddressFromLocation(location);
        }
      }
    }
  }, []);

  // Handle marker drag end
  const onMarkerDragEnd = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      
      setMarkerPosition(newPosition);
      
      // Update address fields from the new location
      updateAddressFromLocation(newPosition);
    }
  }, []);

  // Update map when address fields change
  useEffect(() => {
    // Only run if all required fields are filled
    if (
      formData.streetName && 
      formData.city && 
      formData.country && 
      geocoderRef.current && 
      isLoaded
    ) {
      // Build address string
      const addressString = `${formData.streetNumber} ${formData.streetName}, ${formData.city}, ${formData.stateRegion ? `${formData.stateRegion}, ` : ''}${formData.country}`;
      
      // Geocode the address
      geocoderRef.current.geocode({ address: addressString }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          
          // Update map only if the location is significantly different
          // to avoid infinite loops
          if (!markerPosition || 
              Math.abs(location.lat - markerPosition.lat) > 0.0001 || 
              Math.abs(location.lng - markerPosition.lng) > 0.0001) {
            setMapCenter(location);
            setMarkerPosition(location);
            setMapZoom(16);
            
            // Update address fields from the new location
            updateAddressFromLocation(location);
          }
        }
      });
    }
  }, [
    formData.streetName, 
    formData.streetNumber, 
    formData.city, 
    formData.stateRegion, 
    formData.country, 
    isLoaded,
    markerPosition
  ]);

  // Check date availability - commented out but kept for future use
  /*
  const checkDateAvailability = async (date: Date): Promise<boolean> => {
    try {
      const response = await photoshootService.checkAvailability(date);
      return response.available;
    } catch (error) {
      console.error('Error checking date availability:', error);
      return false;
    }
  };
  */

  // Handle input change for custom components
  const handleCustomInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle date change
  const handleDateChange = async (date: Date) => {
    setSelectedDate(date);
    
    // Format the date for display
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    setDisplayDate(formattedDate);
    
    // Update form data with ISO string for backend
    setFormData(prev => ({
      ...prev,
      date: date.toISOString()
    }));
    
    // Reset selected time slot
    setSelectedTimeSlot('');
    setFormData(prev => ({
      ...prev,
      timeSlot: ''
    }));
    
    // Fetch available time slots for this date
    setLoadingTimeSlots(true);
    try {
      const timeSlots = await photoshootService.getAvailableTimeSlots(date);
      setAvailableTimeSlots(timeSlots);
    } catch (error) {
      console.error('Error loading time slots:', error);
      setAvailableTimeSlots(DEFAULT_TIME_SLOTS);
    } finally {
      setLoadingTimeSlots(false);
    }
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (time: string) => {
    setSelectedTimeSlot(time);
    setFormData(prev => ({
      ...prev,
      timeSlot: time
    }));
  };

  // Handle property type selection
  const handlePropertyTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      propertyType: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent | React.MouseEvent<HTMLButtonElement> | any) => {
    if (e && e.preventDefault) {
    e.preventDefault();
    }
    
    console.log('Submitting form data:', formData);
    
    // Validate form
    if (!selectedDate || !selectedTimeSlot) {
      alert(t('photoshoot_booking.validation.date_time', 'Please select a date and time for your photoshoot.'));
      return;
    }
    
    if (!formData.streetName || !formData.postalCode || !formData.city || !formData.country) {
      alert(t('photoshoot_booking.validation.address', 'Please fill in all required address fields.'));
      return;
    }
    
    if (!formData.name) {
      alert(t('photoshoot_booking.validation.name', 'Please provide your name.'));
      return;
    }
    
    if (!formData.phoneNumber) {
      alert(t('photoshoot_booking.validation.phone', 'Please provide a phone number for contact purposes.'));
      return;
    }
    
    // Create a copy of form data with location properly handled
    const submissionData = {
      ...formData,
      location: formData.location || undefined // Convert null to undefined
    };
    
    // Submit the booking
    setIsSubmitting(true);
    try {
      console.log('Calling bookPhotoshoot service...');
      const response = await photoshootService.bookPhotoshoot(submissionData);
      console.log('Received booking response:', response);
      
      setResponseMessage(response.message);
      
      if (response.success) {
        console.log('Booking successful, navigating to thank you page with ID:', response.bookingId);
        
        // Try direct location change instead of navigate
        const thankYouUrl = `/photoshoot-booking/thank-you?bookingId=${response.bookingId}`;
        console.log('Navigating to URL:', thankYouUrl);
        
        // Use both methods to ensure navigation works
        window.location.href = thankYouUrl;
        
        // Also try React Router navigate as a fallback
        navigate(thankYouUrl, {
          state: { bookingId: response.bookingId }
        });
      } else {
        console.log('Booking unsuccessful:', response.message);
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setResponseMessage(t('photoshoot_booking.error.generic', 'An error occurred while processing your booking. Please try again.'));
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Simple wrapper for button click
  const handleButtonSubmit = () => {
    handleSubmit({});
  };
  
  // Reset form to initial state - commented out but kept for future use
  /*
  const resetForm = () => {
    setFormData({
      streetName: '',
      streetNumber: '',
      floor: '',
      flat: '',
      postalCode: '',
      city: '',
      stateRegion: '',
      country: '',
      propertyType: t('photoshoot_booking.property_types.apartment'),
      phoneNumber: '',
      name: '',
      date: '',
      timeSlot: '',
      comments: '',
      location: DEFAULT_MAP_CENTER
    });
    setSelectedDate(null);
    setSelectedTimeSlot('');
    setMarkerPosition(DEFAULT_MAP_CENTER);
    setMapCenter(DEFAULT_MAP_CENTER);
    setMapZoom(12);
  };
  */
  
  // Navigate to previous day
  const navigatePrevDay = () => {
    if (selectedDate) {
      const prevDay = new Date(selectedDate);
      prevDay.setDate(prevDay.getDate() - 1);
      handleDateChange(prevDay);
    }
  };
  
  // Navigate to next day
  const navigateNextDay = () => {
    if (selectedDate) {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      handleDateChange(nextDay);
    }
  };
  
  // Render the error modal
  const renderErrorModal = () => {
    if (!showErrorModal) return null;
    
    return (
      <Modal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)}>
        <div className="error-modal">
          <h3>{t('photoshoot_booking.error.title', 'Booking Error')}</h3>
          <p>{responseMessage || t('photoshoot_booking.error.generic', 'An error occurred while processing your booking. Please try again.')}</p>
          <button onClick={() => setShowErrorModal(false)}>
            {t('photoshoot_booking.error.close', 'Close')}
          </button>
        </div>
      </Modal>
    );
  };
  
  // Add a console log to debug marker position in the render method
  console.log("Rendering component with marker position:", markerPosition);

  // Add a useEffect to update the phone number and name if the user data loads after component mount
  useEffect(() => {
    if (currentUser) {
      const updates: Partial<typeof formData> = {};
      
      if (currentUser.phoneNumber && !formData.phoneNumber) {
        updates.phoneNumber = currentUser.phoneNumber;
      }
      
      if (currentUser.name && !formData.name) {
        updates.name = currentUser.name;
      }
      
      if (Object.keys(updates).length > 0) {
        setFormData(prev => ({
          ...prev,
          ...updates
        }));
        console.log("Prefilled user data:", updates);
      }
    }
  }, [currentUser, formData.phoneNumber, formData.name]);

  // Add these console logs to check marker position state
  useEffect(() => {
    console.log("Marker position changed:", markerPosition);
  }, [markerPosition]);

  // Component for a fallback DOM marker
  const FallbackMarker = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      if (!mapContainerRef.current) return;
      
      // Create a marker element
      const marker = document.createElement('div');
      marker.className = 'custom-map-marker';
      marker.style.position = 'absolute';
      marker.style.top = '50%';
      marker.style.left = '50%';
      marker.style.zIndex = '10000';
      
      // Add to map container
      mapContainerRef.current.appendChild(marker);
      
      // Cleanup
      return () => {
        if (mapContainerRef.current && marker.parentNode) {
          marker.parentNode.removeChild(marker);
        }
      };
    }, []);
    
    return <div ref={mapContainerRef} className="fallback-marker-container" />;
  };

  // Update the render map function to include a fallback DOM marker
  const renderMap = () => {
    if (!isLoaded) {
      return (
        <div className="map-loading">
          <FaSpinner className="spinner" />
          <p>{t('photoshoot_booking.loading_map', 'Loading map...')}</p>
        </div>
      );
    }

    console.log("Rendering map with marker at position:", markerPosition);
    
    return (
      <>
        <div className="map-container">
          <GoogleMap
            mapContainerClassName="map-container"
            center={mapCenter}
            zoom={mapZoom}
            onLoad={onMapLoad}
            mapContainerStyle={{
              width: '100%',
              height: '400px',
              borderRadius: '10px',
              border: '1px solid #ccc',
            }}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
              zoomControl: true,
            }}
            onClick={(e) => {
              if (e.latLng) {
                const clickPosition = {
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng()
                };
                console.log("Map clicked, new position:", clickPosition);
                setMarkerPosition(clickPosition);
                setMapCenter(clickPosition);
                
                // Update address fields from the new location
                updateAddressFromLocation(clickPosition);
              }
            }}
          >
            {/* Primary marker implementation */}
            {isLoaded && markerPosition && (
              <Marker
                position={markerPosition}
                draggable
                icon={{
                  url: '/map-marker.svg',
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
                onClick={() => console.log("Marker clicked")}
                onDragEnd={(e) => {
                  if (e.latLng) {
                    const newPosition = {
                      lat: e.latLng.lat(),
                      lng: e.latLng.lng()
                    };
                    console.log("Marker dragged to:", newPosition);
                    setMarkerPosition(newPosition);
                    
                    // Update address fields from the new location
                    updateAddressFromLocation(newPosition);
                  }
                }}
              />
            )}

            {/* Fallback marker implementation */}
            {markerPosition && isLoaded && showFallbackMarker && (
              <Marker
                position={markerPosition}
                draggable
                visible={true}
                clickable={true}
                opacity={1.0}
                zIndex={1000}
                animation={window.google.maps.Animation.DROP}
                icon={{
                  url: '/map-marker.svg',
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
                onDragEnd={(e) => {
                  if (e.latLng) {
                    const newPosition = {
                      lat: e.latLng.lat(),
                      lng: e.latLng.lng()
                    };
                    console.log("Fallback marker dragged to:", newPosition);
                    setMarkerPosition(newPosition);
                    
                    // Update address fields from the new location
                    updateAddressFromLocation(newPosition);
                  }
                }}
              />
            )}
          </GoogleMap>
          
          {/* Fallback marker as direct DOM element */}
          <div 
            className="custom-map-marker" 
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              zIndex: 9999,
              pointerEvents: 'none'
            }}
          />
        </div>
        
        <p className="map-hint">
          <FaMapMarkerAlt className="map-hint-icon" />
          {t('photoshoot_booking.drag_marker_hint', 'Drag the marker or click on the map to set the exact location of your property')}
        </p>
      </>
    );
  };
  
  return (
    <>
      <UnifiedHeader />
      
      <PhotoshootBookingPageStyle>
        <h1 className="page-title">{t('photoshoot_booking.title', 'Book Your Free Photoshoot')}</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2 className="section-title">{t('photoshoot_booking.address_title', 'Property Address')}</h2>
            
            <div className="form-grid">
              <div className="form-group">
              <label htmlFor="streetName" style={{marginBottom: '24px'}}>{t('photoshoot_booking.street_name', 'Street Name')}</label>

                
                <div className="address-search-wrapper">
                  {isLoaded ? (
                    <StandaloneSearchBox
                      onLoad={onSearchBoxLoad}
                      onPlacesChanged={onPlacesChanged}
                    >
                      <div className="address-search-input">
                        <input
                          type="text"
                          value={formData.streetName}
                          onChange={(e) => handleCustomInputChange('streetName', e.target.value)}
                          placeholder={t('photoshoot_booking.street_name_placeholder', 'Search for your address')}
                          className="map-search-input"
                        />
                      </div>
                    </StandaloneSearchBox>
                  ) : (
                <InputBaseModel
                  value={formData.streetName}
                      title={t('photoshoot_booking.street_name', 'Street Name')}
                  onChange={(e) => handleCustomInputChange('streetName', e.target.value)}
                  placeholder={t('photoshoot_booking.street_name_placeholder', 'Enter street name')}
                />
                  )}
                </div>
                <p className="field-description">{t('photoshoot_booking.address_search_help', 'Search for your address to automatically fill the fields, or enter manually')}</p>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="streetNumber">{t('photoshoot_booking.street', 'Street Number')}</label>
                  <InputBaseModel
                    value={formData.streetNumber}
                    onChange={(e) => handleCustomInputChange('streetNumber', e.target.value)}
                    placeholder={t('photoshoot_booking.street_placeholder', '23')}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="floor">{t('photoshoot_booking.floor', 'Floor')}</label>
                  <InputBaseModel
                    value={formData.floor}
                    onChange={(e) => handleCustomInputChange('floor', e.target.value)}
                    placeholder={t('photoshoot_booking.floor_placeholder', '1')}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="flat">{t('photoshoot_booking.flat', 'Flat')}</label>
                  <InputBaseModel
                    value={formData.flat}
                    onChange={(e) => handleCustomInputChange('flat', e.target.value)}
                    placeholder={t('photoshoot_booking.flat_placeholder', '2')}
                  />
                </div>
              </div>
              
              <div className="form-row">
              <div className="form-group">
                  <label htmlFor="postalCode">{t('photoshoot_booking.postal_code', 'Postal Code')}</label>
                <InputBaseModel
                  value={formData.postalCode}
                  onChange={(e) => handleCustomInputChange('postalCode', e.target.value)}
                    placeholder={t('photoshoot_booking.postal_code_placeholder', '12345')}
                    
                />
              </div>
              
              <div className="form-group">
                  <label htmlFor="city">{t('photoshoot_booking.city', 'City')}</label>
                <InputBaseModel
    
                  value={formData.city}
                  onChange={(e) => handleCustomInputChange('city', e.target.value)}
                    placeholder={t('photoshoot_booking.city_placeholder', 'Enter city')}
                    
                />
                </div>
              </div>
              
              <div className="form-row">
              <div className="form-group">
                  <label htmlFor="stateRegion">{t('photoshoot_booking.state_region', 'State or Region')}</label>
                <InputBaseModel
                  value={formData.stateRegion}
                  onChange={(e) => handleCustomInputChange('stateRegion', e.target.value)}
                    placeholder={t('photoshoot_booking.state_region_placeholder', 'Enter state or region')}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="country">{t('photoshoot_booking.country', 'Country')}</label>
                  <InputBaseModel 
                    value={formData.country}
                    onChange={(e) => handleCustomInputChange('country', e.target.value)}
                    placeholder={t('photoshoot_booking.country_placeholder', 'Enter country')}

                />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="propertyType">{t('photoshoot_booking.property_type', 'Type of property')}</label>
                <SelectFieldBaseModelVariant1
                  value={formData.propertyType}
                  onChange={handlePropertyTypeChange}
                  options={propertyTypeOptions}
                />
              </div>
              
              
            </div>
            
            {/* Google Maps Location Picker */}
            <div className="map-section">
              <h3 className="map-title">{t('photoshoot_booking.locate_on_map', 'Locate on Map')}</h3>
              <p className="map-description">{t('photoshoot_booking.map_description', 'Drag the marker to set the exact location of your property. The address fields will update automatically.')}</p>
              
              {renderMap()}
            </div>
          </div>
          
          <div className="appointment-section">
            <h2 className="section-title">{t('photoshoot_booking.appointment_title', 'Appointment Request')}</h2>
            
            <div className="date-picker-container">
              <div className="calendar-wrapper">
                <CalendarComponent
                  selectedDate={selectedDate}
                  onDateSelect={handleDateChange}
                  disabledDates={disabledDates}
                />
              </div>
              
              <div className="time-picker">
                <div className="date-navigation">
                  <button 
                    type="button"
                    className="nav-button"
                    onClick={navigatePrevDay}
                    disabled={!selectedDate}
                  >
                    <FaChevronLeft />
                  </button>
                  
                  <div className="selected-date">
                    {selectedDate ? displayDate : t('photoshoot_booking.select_date', 'Select a date')}
                  </div>
                  
                  <button 
                    type="button"
                    className="nav-button"
                    onClick={navigateNextDay}
                    disabled={!selectedDate}
                  >
                    <FaChevronRight />
                  </button>
                </div>
                
                {loadingTimeSlots ? (
                  <div className="loading-slots">
                    <FaSpinner className="spinner" />
                    <p>{t('photoshoot_booking.loading_time_slots', 'Loading available time slots...')}</p>
                  </div>
                ) : (
                  <>
                    {availableTimeSlots.length > 0 ? (
                      <div className="time-slots-wrapper">
                        {availableTimeSlots.map((time) => (
                          <div
                            key={time}
                            className={`time-slot ${selectedTimeSlot === time ? 'selected' : ''}`}
                            onClick={() => handleTimeSlotSelect(time)}
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-slots-message">
                        <p>{t('photoshoot_booking.no_slots_message', 'No available time slots for this date. Please select another date.')}</p>
                      </div>
                    )}
                  </>
                )}
                
                <div className="timezone-selector">
                  <div className="timezone-icon">
                    <FaClock />
                  </div>
                  <div className="dropdown-wrapper">
                    <select>
                      <option>Africa / Casablanca (7:38 PM)</option>
                      <option>Europe / London</option>
                      <option>Europe / Paris</option>
                      <option>America / New York</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Information Section */}
          <div className="contact-section">
            <h2 className="section-title">{t('photoshoot_booking.contact_title', 'Contact Information')}</h2>
            
            <div className="form-row">
            <div className="form-group">
                <label htmlFor="name">
                  <FaUser className="input-icon" />
                  {t('photoshoot_booking.name', 'Your Name')}
                </label>
                <InputBaseModel
                  value={formData.name}
                  onChange={(e) => handleCustomInputChange('name', e.target.value)}
                  placeholder={t('photoshoot_booking.name_placeholder', 'Enter your full name')}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phoneNumber">
                  <FaPhoneAlt className="input-icon" />
                  {t('photoshoot_booking.phone_number', 'Phone Number')}
                </label>
              <InputBaseModel
                value={formData.phoneNumber}
                onChange={(e) => handleCustomInputChange('phoneNumber', e.target.value)}
                placeholder={t('photoshoot_booking.phone_number_placeholder', 'Enter your phone number')}
              />
            </div>
            </div>
            
            <p className="field-description">{t('photoshoot_booking.contact_description', 'We will use this information to contact you regarding the photoshoot.')}</p>
          </div>
          
          {/* Comments Section */}
          <div className="comments-section">
            <h2 className="section-title">{t('photoshoot_booking.comments_title', 'Additional Comments')}</h2>
            
            <div className="form-group">
              <TextAreaBaseModel
                value={formData.comments}
                onChange={(e) => handleCustomInputChange('comments', e.target.value)}
                placeholder={t('photoshoot_booking.comments_placeholder', 'Tell us more about your property or any special requirements')}
              />
            </div>
          </div>
          
          <div className="submit-section" style={{maxWidth: '300px', margin: '0 auto'}}>
            <PurpleButtonLB60 
              text={t('photoshoot_booking.submit_button', 'Book a Photoshoot')}
              onClick={handleButtonSubmit}
              disabled={isSubmitting}
            />
          </div>
        </form>
        
        {renderErrorModal()}
      </PhotoshootBookingPageStyle>
    </>
  );
};

export default PhotoshootBookingPage;

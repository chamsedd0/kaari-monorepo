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

import { FaClock, FaChevronLeft, FaChevronRight, FaSpinner, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import SelectFieldBaseModelVariant1 from '../../components/skeletons/inputs/select-fields/select-field-base-model-variant-1';
import photoshootService from '../../services/photoshoot-service';
import Modal from '../../components/skeletons/constructed/modal/modal';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox } from '@react-google-maps/api';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyCqhbPAiPspwgshgE9lzbtkpFZwVMfJoww';

// Default map center (Rabat, Morocco)
const DEFAULT_MAP_CENTER = { lat: 34.020882, lng: -6.841650 };

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '12px',
};

// Libraries needed for Google Maps
const libraries = ['places', 'geometry'];

// Declare global google namespace
declare global {
  interface Window {
    google: any;
  }
}

const PhotoshootBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
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
    date: '',
    timeSlot: '',
    comments: '',
    location: null as { lat: number; lng: number } | null,
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
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  // Google Maps-related state
  const [mapCenter, setMapCenter] = useState(DEFAULT_MAP_CENTER);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [mapZoom, setMapZoom] = useState(12);
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

  // Inside the PhotoshootBookingPage component, add the current user state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Load Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries as any[]
  });

  // Add this useEffect to check for authentication state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });
    
    return () => unsubscribe();
  }, []);

  // Create geocoder instance when maps are loaded
  useEffect(() => {
    if (isLoaded && window.google && window.google.maps) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, [isLoaded]);

  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Handle search box load
  const onSearchBoxLoad = useCallback((searchBox: google.maps.places.SearchBox) => {
    searchBoxRef.current = searchBox;
  }, []);

  // Handle search box places changed
  const onPlacesChanged = useCallback(() => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      
      if (places && places.length > 0) {
        const place = places[0];
        
        if (place.geometry && place.geometry.location) {
          // Get location
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          
          // Update map
          setMapCenter(location);
          setMarkerPosition(location);
          setMapZoom(16);
          
          // Update form data with location
          setFormData(prev => ({
            ...prev,
            location
          }));
          
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
            
            // Update form data with address components
            setFormData(prev => ({
              ...prev,
              streetName: streetName || prev.streetName,
              streetNumber: streetNumber || prev.streetNumber,
              city: city || prev.city,
              stateRegion: state || prev.stateRegion,
              postalCode: postalCode || prev.postalCode,
              country: country || prev.country
            }));
          }
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
      
      // Update form data with new position
      setFormData(prev => ({
        ...prev,
        location: newPosition
      }));
      
      // Reverse geocode the new position to get address
      if (geocoderRef.current) {
        geocoderRef.current.geocode({ location: newPosition }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
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
              
              // Update form data with address components
              setFormData(prev => ({
                ...prev,
                streetName: streetName || prev.streetName,
                streetNumber: streetNumber || prev.streetNumber,
                city: city || prev.city,
                stateRegion: state || prev.stateRegion,
                postalCode: postalCode || prev.postalCode,
                country: country || prev.country
              }));
            }
          }
        });
      }
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
            
            // Update form data with location
            setFormData(prev => ({
              ...prev,
              location
            }));
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

  // Check date availability
  const checkDateAvailability = async (date: Date): Promise<boolean> => {
    try {
      const response = await photoshootService.checkAvailability(date);
      return response.available;
    } catch (error) {
      console.error('Error checking date availability:', error);
      return false;
    }
  };

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
  
  // Reset form to initial state
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
      date: '',
      timeSlot: '',
      comments: '',
      location: null
    });
    setSelectedDate(null);
    setSelectedTimeSlot('');
    setMarkerPosition(null);
    setMapCenter(DEFAULT_MAP_CENTER);
    setMapZoom(12);
  };
  
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
                <label htmlFor="streetName">{t('photoshoot_booking.street_name', 'Street Name')}</label>
                <InputBaseModel
                  value={formData.streetName}
                  onChange={(e) => handleCustomInputChange('streetName', e.target.value)}
                  placeholder={t('photoshoot_booking.street_name_placeholder', 'Enter street name')}
                  
                />
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
              <p className="map-description">{t('photoshoot_booking.map_description', 'Select the exact location of your property by searching or moving the marker on the map.')}</p>
              
              {isLoaded ? (
                <>
                  <div className="search-box-container">
                    <StandaloneSearchBox
                      onLoad={onSearchBoxLoad}
                      onPlacesChanged={onPlacesChanged}
                    >
                      <div className="search-input-container">
                        <FaSearch className="search-icon" />
                        <input
                          type="text"
                          placeholder={t('photoshoot_booking.search_address', 'Search for an address')}
                          className="map-search-input"
                        />
                      </div>
                    </StandaloneSearchBox>
                  </div>
                  
                  <div className="map-container">
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={mapCenter}
                      zoom={mapZoom}
                      onLoad={onMapLoad}
                      options={{
                        zoomControl: true,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: true
                      }}
                    >
                      {markerPosition && (
                        <Marker
                          position={markerPosition}
                          draggable={true}
                          onDragEnd={onMarkerDragEnd}
                          animation={window.google.maps.Animation.DROP}
                        />
                      )}
                    </GoogleMap>
                  </div>
                  
                  <p className="map-hint">
                    <FaMapMarkerAlt className="map-hint-icon" />
                    {t('photoshoot_booking.drag_marker_hint', 'Drag the marker to set the exact location of your property')}
                  </p>
                </>
              ) : (
                <div className="map-loading">
                  <FaSpinner className="spinner" />
                  <p>{t('photoshoot_booking.loading_map', 'Loading map...')}</p>
                </div>
              )}
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
          
          <div className="submit-section">
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhotoshootBookingPageStyle } from './styles';
import UnifiedHeader from '../../components/skeletons/constructed/headers/unified-header';
import CalendarComponent from '../../components/skeletons/constructed/calendar/calendar';
import InputBaseModel from '../../components/skeletons/inputs/input-fields/input-variant';
import TextAreaBaseModel from '../../components/skeletons/inputs/input-fields/textarea-variant';
import { PurpleButtonLB60 } from '../../components/skeletons/buttons/purple_LB60';
import { DEFAULT_TIME_SLOTS } from '../../config/constants';

import { FaClock, FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';
import mapImage from '../../assets/images/map.png';
import Footer from '../../components/skeletons/constructed/footer/footer';
import SelectFieldBaseModelVariant1 from '../../components/skeletons/inputs/select-fields/select-field-base-model-variant-1';
import photoshootService from '../../services/photoshoot-service';
import Modal from '../../components/skeletons/constructed/modal/modal';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const PhotoshootBookingPage: React.FC = () => {
  const navigate = useNavigate();
  
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
    propertyType: 'Apartment',
    date: '',
    timeSlot: '',
    comments: ''
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

  // Property type options
  const propertyTypeOptions = [
    'Apartment',
    'House',
    'Villa',
    'Penthouse',
    'Studio',
    'Townhouse'
  ];

  // Inside the PhotoshootBookingPage component, add the current user state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Add this useEffect to check for authentication state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });
    
    return () => unsubscribe();
  }, []);

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!selectedDate || !selectedTimeSlot) {
      alert('Please select a date and time for your photoshoot.');
      return;
    }
    
    if (!formData.streetName || !formData.postalCode || !formData.city || !formData.country) {
      alert('Please fill in all required address fields.');
      return;
    }
    
    // Submit the booking
    setIsSubmitting(true);
    try {
      const response = await photoshootService.bookPhotoshoot(formData);
      
      setResponseMessage(response.message);
      
      if (response.success) {
        // Navigate to thank you page with booking ID
        navigate(`/photoshoot-booking/thank-you?bookingId=${response.bookingId}`, {
          state: { bookingId: response.bookingId }
        });
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setResponseMessage('An error occurred while saving your booking to Firestore. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
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
      propertyType: 'Apartment',
      date: '',
      timeSlot: '',
      comments: ''
    });
    setSelectedDate(null);
    setSelectedTimeSlot('');
    setDisplayDate('Wednesday, May 15th');
  };

  // Navigation for date selection
  const navigatePrevDay = () => {
    if (selectedDate) {
      const prevDay = new Date(selectedDate);
      prevDay.setDate(prevDay.getDate() - 1);
      handleDateChange(prevDay);
    }
  };

  const navigateNextDay = () => {
    if (selectedDate) {
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      handleDateChange(nextDay);
    } else {
      // If no date is selected, select tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      handleDateChange(tomorrow);
    }
  };

  // Error modal content
  const renderErrorModal = () => {
    return (
      <Modal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)}
        title="Booking Error"
      >
        <div className="error-modal">
          <p>{responseMessage}</p>
          <p>Please try selecting a different time slot or date.</p>
          <button 
            className="close-btn" 
            onClick={() => setShowErrorModal(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    );
  };

  return (
    <>
      <UnifiedHeader variant="white" userType="advertiser" showSearchBar={true} />
      
      <PhotoshootBookingPageStyle>
        <h1 className="page-title">Booking a Photoshoot</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Property Address Section */}
          <div className="form-section">
            <h2 className="section-title">Address of the Property</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <InputBaseModel
                  type="text"
                  title="Street Name *"
                  placeholder="John Kennedy St"
                  value={formData.streetName}
                  onChange={(e) => handleCustomInputChange('streetName', e.target.value)}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <InputBaseModel
                    type="text"
                    title="Street Number"
                    placeholder="23"
                    value={formData.streetNumber}
                    onChange={(e) => handleCustomInputChange('streetNumber', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <InputBaseModel
                    type="text"
                    title="Floor"
                    placeholder="1"
                    value={formData.floor}
                    onChange={(e) => handleCustomInputChange('floor', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <InputBaseModel
                    type="text"
                    title="Flat"
                    placeholder="2"
                    value={formData.flat}
                    onChange={(e) => handleCustomInputChange('flat', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <InputBaseModel
                  type="text"
                  title="Postal Code *"
                  placeholder="012345"
                  value={formData.postalCode}
                  onChange={(e) => handleCustomInputChange('postalCode', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <InputBaseModel
                  type="text"
                  title="City *" 
                  placeholder="Agadir" 
                  value={formData.city}
                  onChange={(e) => handleCustomInputChange('city', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <InputBaseModel
                  type="text"
                  title="State or Region"
                  placeholder="Some Region"
                  value={formData.stateRegion}
                  onChange={(e) => handleCustomInputChange('stateRegion', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <InputBaseModel
                  type="text"
                  title="Country *"
                  placeholder="Morocco"
                  value={formData.country}
                  onChange={(e) => handleCustomInputChange('country', e.target.value)}
                />
              </div>
            </div>
            

            
            {/* Property Type */}
            <div className="form-group" style={{ maxWidth: '300px' }}>
              <SelectFieldBaseModelVariant1
                options={propertyTypeOptions}
                value={formData.propertyType}
                onChange={handlePropertyTypeChange}
                placeholder="Select property type"
                label="Type of property *"
              />
            </div>
          </div>
          
          {/* Appointment Request Section */}
          <div className="form-section appointment-section">
            <h2 className="section-title">Appointment Request</h2>
            
            <div className="date-picker-container">
              <div className="calendar-wrapper">
                <CalendarComponent
                  selectedDate={selectedDate}
                  onDateSelect={handleDateChange}
                  format="MM/DD/YYYY"
                  minDate={new Date()}
                  disabledDates={disabledDates}
                  checkAvailability={checkDateAvailability}
                />
              </div>
              
              <div className="time-picker">
                <div className="date-navigation">
                  <button className="nav-button prev" onClick={navigatePrevDay} type="button">
                    <FaChevronLeft />
                  </button>
                  <div className="selected-date">{displayDate}</div>
                  <button className="nav-button next" onClick={navigateNextDay} type="button">
                    <FaChevronRight />
                  </button>
                </div>
                
                {loadingTimeSlots ? (
                  <div className="loading-slots">
                    <FaSpinner className="spinner" />
                    <p>Loading available time slots...</p>
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
                        <p>No available time slots for this date. Please select another date.</p>
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
          <div className="form-section">            
            <div className="form-group">
              <TextAreaBaseModel
                title="Any comments or concerns?"
                placeholder="Tell us more about your property or any special requirements"
                value={formData.comments}
                onChange={(e) => handleCustomInputChange('comments', e.target.value)}
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="submit-button-container">
            <PurpleButtonLB60 
              text={isSubmitting ? "Processing..." : "Book a Photoshoot"} 
              onClick={(e) => {
                e?.preventDefault();
                handleSubmit(e as unknown as React.FormEvent);
              }} 
            />
          </div>
          
          <p className="required-fields-note">* Required fields</p>
        </form>
      </PhotoshootBookingPageStyle>
      
      {renderErrorModal()}
      
      <Footer />
    </>
  );
};

export default PhotoshootBookingPage;

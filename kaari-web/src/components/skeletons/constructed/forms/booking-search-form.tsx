import React, { useState } from "react";
import { useJsApiLoader } from '@react-google-maps/api';
import { getGoogleMapsLoaderOptions } from '../../../../utils/googleMapsConfig';
import { useNavigate } from "react-router-dom";
import { FormBaseModelVariant1 } from "../../../styles/constructed/forms/form-base-model-style-variant-1";

import InputVariantSearch from "../../inputs/input-fields/input-variant-search";

import InputVariantDatePicker from "../../inputs/input-fields/input-variant-date-picker";

import { PurpleButtonH4B70 } from "../../buttons/purple_H4B70";

interface BookingSearchFormProps {
  onSubmit?: (e: React.FormEvent) => void;
}

const BookingSearchForm: React.FC<BookingSearchFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  
  // Create a proper initial date (tomorrow) in ISO format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };
  
  const [selectedDate, setSelectedDate] = useState(getTomorrowDate());
  const { isLoaded } = useJsApiLoader(getGoogleMapsLoaderOptions());
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create search parameters
    const params = new URLSearchParams();
    
    if (location) {
      params.append("location", location);
    }
    if (typeof lat === 'number' && typeof lng === 'number') {
      params.set('lat', String(lat));
      params.set('lng', String(lng));
      params.set('radius', '15');
    }
    
    if (selectedDate) {
      // Ensure the date is in the correct format (YYYY-MM-DD)
      // This ensures consistency with the property list page date format
      let formattedDate = selectedDate;
      
      // If the date includes time part (T), remove it
      if (selectedDate.includes('T')) {
        formattedDate = selectedDate.split('T')[0];
      }
      
      // Validate that the date is in YYYY-MM-DD format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(formattedDate)) {
        console.log(`Using formatted date: ${formattedDate}`);
        params.append("date", formattedDate);
      } else {
        console.error(`Invalid date format: ${selectedDate}, using default`);
        // Try to parse and reformat the date
        try {
          const dateObj = new Date(selectedDate);
          if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toISOString().split('T')[0];
            params.append("date", formattedDate);
          }
        } catch (e) {
          console.error("Error parsing date:", e);
        }
      }
    }
    
    // Navigate to properties page with search parameters
    navigate(`/properties?${params.toString()}`);
    
    // Call the onSubmit prop if provided
    if (onSubmit) onSubmit(e);
  };

  return (
    <FormBaseModelVariant1 onSubmit={handleSubmit}>
      <InputVariantSearch
        type="text"
        placeholder="Location"
        value={location}
        onChange={handleSearchChange}
        onPlaceSelected={(text, plat, plng) => {
          setLocation(text);
          if (typeof plat === 'number' && typeof plng === 'number') {
            setLat(plat); setLng(plng);
            (window as any).__search_lat = plat;
            (window as any).__search_lng = plng;
          }
        }}
      />

      <InputVariantDatePicker
        value={selectedDate}
        onChange={handleDateChange}
        title="When?"
      />
      
      <PurpleButtonH4B70 onClick={handleSubmit} />    
    </FormBaseModelVariant1>
  );
};

export default BookingSearchForm;


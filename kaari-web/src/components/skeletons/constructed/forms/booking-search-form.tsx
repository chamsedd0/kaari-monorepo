import React, { useState } from "react";
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
  const [selectedDate, setSelectedDate] = useState(Date.now().toString());

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
    
    if (selectedDate) {
      params.append("date", selectedDate);
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
        title="Where do you want to stay?"
      />

      <InputVariantDatePicker
        value={selectedDate}
        onChange={handleDateChange}
        title="When do you want to stay?"
      />
      
      <PurpleButtonH4B70 onClick={handleSubmit} />    
    </FormBaseModelVariant1>
  );
};

export default BookingSearchForm;


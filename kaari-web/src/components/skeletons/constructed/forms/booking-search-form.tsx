import React from "react";
import { FormBaseModelVariant1 } from "../../../styles/constructed/forms/form-base-model-style-variant-1";

import InputVariantSearch from "../../inputs/input-fields/input-variant-search";

import InputVariantDatePicker from "../../inputs/input-fields/input-variant-date-picker";

import { PurpleButtonH4B70 } from "../../buttons/purple_H4B70";

interface BookingSearchFormProps {
  onSubmit?: (e: React.FormEvent) => void;
}

const BookingSearchForm: React.FC<BookingSearchFormProps> = ({ onSubmit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <FormBaseModelVariant1 onSubmit={handleSubmit}>
      <InputVariantSearch
        type="text"
        placeholder="Location"
      />

      <InputVariantDatePicker
        value={Date.now().toString()}
        onChange={console.log}
      />
      
      <PurpleButtonH4B70
        text="GO!"
      />    
    </FormBaseModelVariant1>
  );
};

export default BookingSearchForm;


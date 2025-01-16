import React, { useState } from 'react';
import SelectFieldBaseModelVariant1 from './select-field-base-model-variant-1';
import styled from 'styled-components';
import { Label2 } from '../../../styles/inputs/select-fields/select-field-base-model-style-1';

const DatePickerContainer = styled.div`
  display: flex;
  gap: 8px;
`;

interface DatePickerProps {
  label?: string;
  onChange?: (date: {day: string, month: string, year: string}) => void;
}

const SelectFieldDatePicker: React.FC<DatePickerProps> = ({
  label = "Date of Birth",
  onChange
}) => {
  const [selectedDate, setSelectedDate] = useState({
    day: '',
    month: '',
    year: ''
  });

  // Generate arrays for days, months and years
  const days = Array.from({length: 31}, (_, i) => String(i + 1).padStart(2, '0'));
  const months = Array.from({length: 12}, (_, i) => String(i + 1).padStart(2, '0'));
  const years = Array.from({length: 61}, (_, i) => String(2020 - i));

  const handleChange = (value: string, type: 'day' | 'month' | 'year') => {
    const newDate = {
      ...selectedDate,
      [type]: value
    };
    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  return (
    <div>
      <Label2>{label}</Label2>
      <DatePickerContainer>
        <SelectFieldBaseModelVariant1
          options={days}
          placeholder="DD"
          onChange={(value) => handleChange(value, 'day')}
        />
        <SelectFieldBaseModelVariant1
          options={months}
          placeholder="MM"
          onChange={(value) => handleChange(value, 'month')}
        />
        <SelectFieldBaseModelVariant1
          options={years}
          placeholder="YYYY"
          onChange={(value) => handleChange(value, 'year')}
        />
      </DatePickerContainer>
    </div>
  );
};

export default SelectFieldDatePicker;

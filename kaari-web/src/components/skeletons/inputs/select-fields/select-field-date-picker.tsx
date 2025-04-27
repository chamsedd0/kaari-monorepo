import React, { useState, useEffect } from 'react';
import SelectFieldBaseModelVariant1 from './select-field-base-model-variant-1';
import styled from 'styled-components';
import { Label2 } from '../../../styles/inputs/select-fields/select-field-base-model-style-1';
import { useTranslation } from 'react-i18next';

const DatePickerContainer = styled.div`
  display: flex;
  gap: 20px;
`;

interface DatePickerProps {
  label?: string;
  onChange?: (date: {day: string, month: string, year: string}) => void;
  initialDate?: {day: string, month: string, year: string};
}

const SelectFieldDatePicker: React.FC<DatePickerProps> = ({
  label = "Date of Birth",
  onChange,
  initialDate
}) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState({
    day: initialDate?.day || '',
    month: initialDate?.month || '',
    year: initialDate?.year || ''
  });

  // Update state when initialDate changes
  useEffect(() => {
    if (initialDate) {
      setSelectedDate({
        day: initialDate.day || '',
        month: initialDate.month || '',
        year: initialDate.year || ''
      });
    }
  }, [initialDate]);

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
          placeholder={t('common.date_picker.day', 'DD')}
          value={selectedDate.day}
          onChange={(value) => handleChange(value, 'day')}
        />
        <SelectFieldBaseModelVariant1
          options={months}
          placeholder={t('common.date_picker.month', 'MM')}
          value={selectedDate.month}
          onChange={(value) => handleChange(value, 'month')}
        />
        <SelectFieldBaseModelVariant1
          options={years}
          placeholder={t('common.date_picker.year', 'YYYY')}
          value={selectedDate.year}
          onChange={(value) => handleChange(value, 'year')}
        />
      </DatePickerContainer>
    </div>
  );
};

export default SelectFieldDatePicker;

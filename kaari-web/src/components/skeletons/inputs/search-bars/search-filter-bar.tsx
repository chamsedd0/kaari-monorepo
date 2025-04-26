import React, { useState, FormEvent } from 'react';
import styled from 'styled-components';
import { IoSearch, IoLocationOutline, IoCalendarOutline, IoPersonOutline, IoClose } from 'react-icons/io5';
import { Theme } from '../../../../theme/theme';
import { useTranslation } from 'react-i18next';

// Styling for the new search and filter bar component
const SearchFilterBarContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterItem = styled.div<{ active?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 40px;
  background: white;
  border: 1px solid ${props => props.active ? Theme.colors.primary : Theme.colors.fifth};
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: ${props => props.active ? Theme.colors.primary : Theme.colors.black};
  flex: 1;
  
  &:hover {
    border-color: ${Theme.colors.primary};
  }
  
  svg {
    margin-right: 8px;
    min-width: 16px;
  }

  input, select {
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    width: 100%;
    color: ${Theme.colors.black};

    &::placeholder {
      color: ${Theme.colors.gray2};
    }
  }

  .clear-button {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${Theme.colors.gray2};

    &:hover {
      color: ${Theme.colors.black};
    }
  }
`;

const SearchButton = styled.button`
  background-color: ${Theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${Theme.colors.primaryHover};
  }
  
  svg {
    font-size: 20px;
  }
`;

const ApplyFiltersButton = styled.button`
  background-color: ${Theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0 20px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
  
  &:hover {
    background-color: ${Theme.colors.primaryHover};
  }
`;

interface SearchFilterBarProps {
  onLocationChange: (location: string) => void;
  onDateChange: (date: string) => void;
  onGenderChange: (gender: string) => void;
  onSearch: () => void;
  onAdvancedFilteringClick: () => void;
  location: string;
  date: string;
  gender: string;
  showAdvancedButton?: boolean;
  showSearchButton?: boolean;
  showApplyFiltersButton?: boolean;
  onApplyFilters?: () => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  onLocationChange,
  onDateChange,
  onGenderChange,
  onSearch,
  onAdvancedFilteringClick,
  location,
  date,
  gender,
  showAdvancedButton = true,
  showSearchButton = true,
  showApplyFiltersButton = false,
  onApplyFilters
}) => {
  const { t } = useTranslation();
  
  // Local states to track which input is currently focused
  const [locationFocused, setLocationFocused] = useState(false);
  const [dateFocused, setDateFocused] = useState(false);
  const [genderFocused, setGenderFocused] = useState(false);

  const handleClearLocation = () => {
    onLocationChange('');
  };

  const handleClearDate = () => {
    onDateChange('');
  };
  
  // Prevent form submission on Enter key
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch();
  };
  
  // Handler for Apply Filters button
  const handleApplyFilters = () => {
    if (onApplyFilters) {
      // First apply filters to update filter state
      onApplyFilters();
      
      // Then trigger search with a longer delay to ensure state updates have completed
      setTimeout(() => {
        console.log('Triggering search after delay');
        onSearch();
      }, 200);
    }
  };

  return (
    <SearchFilterBarContainer as="form" onSubmit={handleSubmit}>
      <FilterItem active={locationFocused || location !== ''}>
        <IoLocationOutline color={locationFocused || location !== '' ? Theme.colors.primary : "#333"} />
        <input
          type="text"
          placeholder={t('common.location')}
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          onFocus={() => setLocationFocused(true)}
          onBlur={() => setLocationFocused(false)}
        />
        {location && (
          <button className="clear-button" onClick={handleClearLocation}>
            <IoClose size={16} />
          </button>
        )}
      </FilterItem>
      
      <FilterItem active={dateFocused || date !== ''}>
        <IoCalendarOutline color={dateFocused || date !== '' ? Theme.colors.primary : "#333"} />
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          onFocus={() => setDateFocused(true)}
          onBlur={() => setDateFocused(false)}
        />
        {date && (
          <button className="clear-button" onClick={handleClearDate}>
            <IoClose size={16} />
          </button>
        )}
      </FilterItem>
      
      <FilterItem active={genderFocused || gender !== ''}>
        <IoPersonOutline color={genderFocused || gender !== '' ? Theme.colors.primary : "#333"} />
        <select
          value={gender}
          onChange={(e) => onGenderChange(e.target.value)}
          onFocus={() => setGenderFocused(true)}
          onBlur={() => setGenderFocused(false)}
        >
          <option value="">{t('common.any_gender')}</option>
          <option value="women_only">{t('common.women_only')}</option>
          <option value="men_only">{t('common.men_only')}</option>
          <option value="other">{t('common.other_gender')}</option>
        </select>
      </FilterItem>
      
      {showSearchButton && (
        <SearchButton onClick={onSearch} aria-label={t('common.search')} type="button">
          <IoSearch />
        </SearchButton>
      )}
      
      {showAdvancedButton && (
        <ApplyFiltersButton onClick={onAdvancedFilteringClick} type="button">
          {t('common.advanced_filtering')}
        </ApplyFiltersButton>
      )}
      
      {showApplyFiltersButton && (
        <ApplyFiltersButton onClick={handleApplyFilters} type="button">
          {t('common.apply_filters')}
        </ApplyFiltersButton>
      )}
    </SearchFilterBarContainer>
  );
};

export default SearchFilterBar; 
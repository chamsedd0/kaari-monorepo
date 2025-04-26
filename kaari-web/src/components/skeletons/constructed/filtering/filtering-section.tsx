import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../../../theme/theme';
import SearchFilterBar from '../../inputs/search-bars/search-filter-bar';

const FilteringSectionContainer = styled.div`
  width: 100%;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
`;

const FilteringRow = styled.div`
  margin-bottom: 24px;
`;

const FilteringTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 12px;
  color: ${Theme.colors.black};
`;

const DropdownSelector = styled.div`
  position: relative;
  width: 100%;
  
  select {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    background-color: white;
    appearance: none;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: ${Theme.colors.primary};
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #333;
    pointer-events: none;
  }
`;

const PriceInputsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const PriceInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${Theme.colors.primary};
  }
  
  &::placeholder {
    color: #9E9E9E;
  }
`;

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .checkbox {
    width: 20px;
    height: 20px;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    
    &.checked {
      background-color: ${Theme.colors.primary};
      border-color: ${Theme.colors.primary};
      
      &::after {
        content: '';
        width: 10px;
        height: 5px;
        border-left: 2px solid white;
        border-bottom: 2px solid white;
        position: absolute;
        top: 5px;
        transform: rotate(-45deg);
      }
    }
  }
  
  label {
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    
    svg {
      width: 16px;
      height: 16px;
      color: #9E9E9E;
    }
  }
`;

const ClearAllButton = styled.button`
  background-color: ${Theme.colors.primary};
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
`;

interface FilteringSectionProps {
  onApplyFilters: (filters?: string[]) => void;
  activeFilters: string[];
  onToggleFilter: (filter: string) => void;
  onClearFilters?: () => void;
  location?: string;
  date?: string;
  gender?: string;
  onLocationChange?: (location: string) => void;
  onDateChange?: (date: string) => void;
  onGenderChange?: (gender: string) => void;
  setActiveFilters?: (filters: string[]) => void;
}

const FilteringSection: React.FC<FilteringSectionProps> = ({
  onApplyFilters,
  activeFilters,
  onToggleFilter,
  onClearFilters,
  location = '',
  date = '',
  gender = '',
  onLocationChange = () => {},
  onDateChange = () => {},
  onGenderChange = () => {},
  setActiveFilters
}) => {
  const { t } = useTranslation();
  const [numPeople, setNumPeople] = useState('2');
  const [bedrooms, setBedrooms] = useState('2');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [localLocation, setLocalLocation] = useState(location);
  const [localDate, setLocalDate] = useState(date);
  const [localGender, setLocalGender] = useState(gender);
  const [localActiveFilters, setLocalActiveFilters] = useState<string[]>([]);

  // Update local state when props change
  useEffect(() => {
    setLocalLocation(location);
    setLocalDate(date);
    setLocalGender(gender);
    setLocalActiveFilters(activeFilters);
  }, [location, date, gender, activeFilters]);

  // Handle bedrooms - create the filter string expected by the page component
  const handleBedroomChange = (value: string) => {
    setBedrooms(value);
  };

  // Apply local state to parent component when the apply button is clicked
  const handleApply = () => {
    console.log("Applying filters in FilteringSection");
    // Update parent component's state with local values
    onLocationChange(localLocation);
    onDateChange(localDate);
    onGenderChange(localGender);
    
    // Collect all filter changes we need to make
    let finalFilters = [...activeFilters]; // Start with current filters
    
    // Handle price range
    if (minPrice && maxPrice) {
      const priceRangeFilter = `${minPrice} to ${maxPrice}`;
      const existingPriceFilter = finalFilters.find(f => 
        f.includes('$0-$1000') || f.includes('$1000-$2000') || f.includes('$2000-$3000') || 
        f.includes('$3000+') || f.includes(' to '));
      
      if (existingPriceFilter) {
        // Remove existing price filter
        finalFilters = finalFilters.filter(f => f !== existingPriceFilter);
      }
      
      // Add new price filter
      if (!finalFilters.includes(priceRangeFilter)) {
        finalFilters.push(priceRangeFilter);
      }
    }
    
    // Handle bedrooms
    let bedroomFilter;
    if (bedrooms === '0') {
      bedroomFilter = t('property_list.studio');
    } else if (bedrooms === '1') {
      bedroomFilter = `1 ${t('property_list.bedroom')}`;
    } else {
      bedroomFilter = `${bedrooms} ${t('property_list.bedrooms')}`;
    }
    
    // Find any existing bedroom filter
    const existingBedroomFilter = finalFilters.find(f => 
      f === t('property_list.studio') || 
      f.includes(t('property_list.bedroom')) || 
      f.includes(t('property_list.bedrooms')));
    
    // Remove existing bedroom filter if any
    if (existingBedroomFilter) {
      finalFilters = finalFilters.filter(f => f !== existingBedroomFilter);
    }
    
    // Add new bedroom filter
    finalFilters.push(bedroomFilter);
    
    // Handle property type
    if (propertyType) {
      const existingTypeFilter = finalFilters.find(f => 
        (f === 'Apartment' || f === 'House' || f === 'Condo' || f === 'Commercial'));
      
      // Remove existing property type filter if any
      if (existingTypeFilter) {
        finalFilters = finalFilters.filter(f => f !== existingTypeFilter);
      }
      
      // Add new property type filter
      finalFilters.push(propertyType);
    }
    
    // Handle amenities - replace with the current local state
    // First remove any existing amenity filters
    const allAmenityIds = [...amenities, ...includedFees].map(item => item.id);
    finalFilters = finalFilters.filter(filter => !allAmenityIds.includes(filter));
    
    // Then add the ones that are checked in the local state
    localActiveFilters.forEach(filter => {
      if (allAmenityIds.includes(filter) && !finalFilters.includes(filter)) {
        finalFilters.push(filter);
      }
    });
    
    console.log("Final filters to apply:", finalFilters);
    
    // Set the final filters list directly in the parent component
    if (setActiveFilters) {
      setActiveFilters(finalFilters);
    }
    
    // Call parent's apply function with the final filters directly
    console.log("Calling parent's onApplyFilters with filters");
    onApplyFilters(finalFilters);
  };

  const amenities = [
    { id: 'Furnished', label: t('common.furnished'), icon: '🪑' },
    { id: 'WiFi', label: t('common.wifi'), icon: '📶' },
    { id: t('property_list.parking'), label: t('property_list.parking'), icon: '🚗' },
    { id: t('property_list.pets_allowed'), label: t('property_list.pets_allowed'), icon: '🐾' },
    { id: t('property_list.pool'), label: t('property_list.pool'), icon: '🏊' },
    { id: t('property_list.fitness_center'), label: t('property_list.fitness_center'), icon: '🏋️' }
  ];

  const includedFees = [
    { id: 'water', label: t('common.water'), icon: '💧' },
    { id: 'electricity', label: t('common.electricity'), icon: '⚡' },
    { id: 'wifi', label: t('common.wifi'), icon: '📶' }
  ];

  const isAmenityChecked = (id: string) => {
    return localActiveFilters.includes(id);
  };

  const handleAmenityToggle = (id: string) => {
    // Update local state instead of calling parent's toggle function immediately
    setLocalActiveFilters(prevFilters => {
      const newLocalFilters = prevFilters.includes(id)
        ? prevFilters.filter(f => f !== id)
        : [...prevFilters, id];
      return newLocalFilters;
    });
  };

  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(value);
  };

  return (
    <FilteringSectionContainer>
      <SearchFilterBar 
        onLocationChange={setLocalLocation}
        onDateChange={setLocalDate}
        onGenderChange={setLocalGender}
        onSearch={() => {}}
        onAdvancedFilteringClick={() => {}}
        location={localLocation}
        date={localDate}
        gender={localGender}
        showAdvancedButton={false}
        showSearchButton={false}
        showApplyFiltersButton={true}
        onApplyFilters={handleApply}
      />
      
      {activeFilters.length > 0 && onClearFilters && (
        <ClearAllButton onClick={onClearFilters}>
          {t('property_list.clear_all_filters')}
        </ClearAllButton>
      )}
      
      <FilteringRow>
        <FilteringTitle>{t('common.number_of_people')}</FilteringTitle>
        <DropdownSelector>
          <select 
            value={numPeople} 
            onChange={(e) => setNumPeople(e.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5+">5+</option>
          </select>
        </DropdownSelector>
      </FilteringRow>
      
      <FilteringRow>
        <FilteringTitle>{t('property_list.bedrooms')}</FilteringTitle>
        <DropdownSelector>
          <select 
            value={bedrooms} 
            onChange={(e) => handleBedroomChange(e.target.value)}
          >
            <option value="0">{t('property_list.studio')}</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="3+">3+</option>
          </select>
        </DropdownSelector>
      </FilteringRow>
      
      <FilteringRow>
        <FilteringTitle>{t('property_list.price_range')}</FilteringTitle>
        <PriceInputsContainer>
          <PriceInput 
            type="number" 
            placeholder={t('common.min')}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span>→</span>
          <PriceInput 
            type="number" 
            placeholder={t('common.max')}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </PriceInputsContainer>
      </FilteringRow>
      
      <FilteringRow>
        <FilteringTitle>{t('common.property_type')}</FilteringTitle>
        <DropdownSelector>
          <select 
            value={propertyType} 
            onChange={(e) => handlePropertyTypeChange(e.target.value)}
          >
            <option value="Apartment">{t('property_list.property_type.apartment')}</option>
            <option value="House">{t('property_list.property_type.house')}</option>
            <option value="Condo">{t('property_list.property_type.condo')}</option>
            <option value="Commercial">{t('property_list.property_type.commercial')}</option>
          </select>
        </DropdownSelector>
      </FilteringRow>
      
      <FilteringRow>
        <FilteringTitle>{t('property_list.amenities')}</FilteringTitle>
        <AmenitiesGrid>
          {amenities.map(amenity => (
            <AmenityItem key={amenity.id}>
              <div 
                className={`checkbox ${isAmenityChecked(amenity.id) ? 'checked' : ''}`}
                onClick={() => handleAmenityToggle(amenity.id)}
              ></div>
              <label onClick={() => handleAmenityToggle(amenity.id)}>
                <span>{amenity.icon}</span> {amenity.label}
              </label>
            </AmenityItem>
          ))}
        </AmenitiesGrid>
      </FilteringRow>
      
      <FilteringRow>
        <FilteringTitle>{t('common.includes')}</FilteringTitle>
        <AmenitiesGrid>
          {includedFees.map(fee => (
            <AmenityItem key={fee.id}>
              <div 
                className={`checkbox ${isAmenityChecked(fee.id) ? 'checked' : ''}`}
                onClick={() => handleAmenityToggle(fee.id)}
              ></div>
              <label onClick={() => handleAmenityToggle(fee.id)}>
                <span>{fee.icon}</span> {fee.label}
              </label>
            </AmenityItem>
          ))}
        </AmenitiesGrid>
      </FilteringRow>
    </FilteringSectionContainer>
  );
};

export default FilteringSection; 
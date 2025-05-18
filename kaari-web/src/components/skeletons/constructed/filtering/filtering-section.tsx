import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../../../theme/theme';
import SearchFilterBar from '../../inputs/search-bars/search-filter-bar';
import { FaBed, FaCouch, FaTable, FaChair, FaDesktop, FaArrowLeft, FaUsers, FaPaw, FaSmoking, FaParking, FaSnowflake, FaWheelchair, FaSwimmingPool } from 'react-icons/fa';
import { BiCloset, BiCabinet, BiWind } from 'react-icons/bi';
import { MdTableRestaurant, MdOutlineCoffee, MdWaterDrop, MdOutlineLocalLaundryService, MdOutlineKitchen, MdOutlineMicrowave, MdOutlineBalcony, MdOutlineFireplace, MdOutlineBathtub, MdOutlineHeatPump, MdOutlineWindow } from 'react-icons/md';
import { RiWaterFlashFill, RiWifiFill, RiParkingBoxLine } from 'react-icons/ri';
import { BsFillLightningFill, BsHouseDoor } from 'react-icons/bs';
import { ImWoman } from 'react-icons/im';
import { IoChevronDown } from 'react-icons/io5';
import { TbAirConditioning, TbWood } from 'react-icons/tb';
import { GiHeatHaze } from 'react-icons/gi';

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

// Updated dropdown selector to match search bar styling
const DropdownSelector = styled.div`
  position: relative;
  width: 100%;
  
  select {
    width: 100%;
    padding: 0 16px;
    height: 42px;
    border: 1px solid #E2E8F0;
    border-radius: 50px;
    background-color: white;
    appearance: none;
    font-size: 14px;
    color: #1E293B;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    
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
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    font-size: 16px;
    color: #94A3B8;
  }
`;

const PriceInputsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const PriceInput = styled.input`
  flex: 1;
  padding: 0 16px;
  height: 42px;
  border: 1px solid #E2E8F0;
  border-radius: 50px;
  font-size: 14px;
  color: #1E293B;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  
  &:focus {
    outline: none;
    border-color: ${Theme.colors.primary};
  }
  
  &::placeholder {
    color: #94A3B8;
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
    border: 1px solid #E2E8F0;
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
      color: ${Theme.colors.secondary};
    }
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 32px;
`;

const ClearAllButton = styled.button`
  background-color: ${Theme.colors.primary};
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  
  &:hover {
    background-color: ${Theme.colors.secondary};
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: white;
  color: ${Theme.colors.black};
  padding: 12px 24px;
  border: 1px solid #E2E8F0;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  
  &:hover {
    background-color: #F8FAFC;
  }
  
  svg {
    font-size: 16px;
  }
`;

interface FilteringSectionProps {
  onApplyFilters: (filters?: string[]) => void;
  activeFilters: string[];
  onToggleFilter: (filter: string) => void;
  onClearFilters?: () => void;
  onBack?: () => void;
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
  onBack,
  location = '',
  date = '',
  gender = '',
  onLocationChange = () => {},
  onDateChange = () => {},
  onGenderChange = () => {},
  setActiveFilters
}) => {
  const { t } = useTranslation();
  const [bedrooms, setBedrooms] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
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
    if (bedrooms) {
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
    }
    
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
    const allAmenityIds = [...amenities, ...includedFees, ...acceptsOnlyRules].map(item => item.id);
    // Also include the furnished filter ID
    const allFilterIds = [...allAmenityIds, furnishedFilter.id];
    finalFilters = finalFilters.filter(filter => !allFilterIds.includes(filter));
    
    // Then add the ones that are checked in the local state
    localActiveFilters.forEach(filter => {
      if (allFilterIds.includes(filter) && !finalFilters.includes(filter)) {
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

  // Updated amenities with icons and matching the advertiser dashboard
  const amenities = [
    { id: 'sofabed', label: t('advertiser_dashboard.properties.amenities.sofabed'), icon: <FaCouch style={{ color: Theme.colors.secondary }} /> },
    { id: 'dining-table', label: t('advertiser_dashboard.properties.amenities.dining_table'), icon: <MdTableRestaurant style={{ color: Theme.colors.secondary }} /> },
    { id: 'wardrobe', label: t('advertiser_dashboard.properties.amenities.wardrobe'), icon: <BiCloset style={{ color: Theme.colors.secondary }} /> },
    { id: 'cabinet', label: t('advertiser_dashboard.properties.amenities.cabinet'), icon: <BiCabinet style={{ color: Theme.colors.secondary }} /> },
    { id: 'desk', label: t('advertiser_dashboard.properties.amenities.desk'), icon: <FaDesktop style={{ color: Theme.colors.secondary }} /> },
    { id: 'sofa', label: t('advertiser_dashboard.properties.amenities.sofa'), icon: <FaCouch style={{ color: Theme.colors.secondary }} /> },
    { id: 'coffee-table', label: t('advertiser_dashboard.properties.amenities.coffee_table'), icon: <MdOutlineCoffee style={{ color: Theme.colors.secondary }} /> },
    { id: 'washing-machine', label: t('advertiser_dashboard.properties.amenities.washing_machine'), icon: <MdOutlineLocalLaundryService style={{ color: Theme.colors.secondary }} /> },
    { id: 'oven', label: t('advertiser_dashboard.properties.amenities.oven'), icon: <MdOutlineKitchen style={{ color: Theme.colors.secondary }} /> },
    { id: 'microwave', label: t('advertiser_dashboard.properties.amenities.microwave'), icon: <MdOutlineMicrowave style={{ color: Theme.colors.secondary }} /> },
    { id: 'bathtub', label: t('advertiser_dashboard.properties.amenities.bathtub'), icon: <MdOutlineBathtub style={{ color: Theme.colors.secondary }} /> }
  ];

  // Define furnished filter
  const furnishedFilter = { id: 'isFurnished', label: t('common.furnished'), icon: <FaBed style={{ color: Theme.colors.secondary }} /> };

  // Updated included fees options with appropriate IDs that match the filters
  const includedFees = [
    { id: 'water', label: t('common.water'), icon: <RiWaterFlashFill style={{ color: Theme.colors.secondary }} /> },
    { id: 'electricity', label: t('common.electricity'), icon: <BsFillLightningFill style={{ color: Theme.colors.secondary }} /> },
    { id: 'wifi', label: t('common.wifi'), icon: <RiWifiFill style={{ color: Theme.colors.secondary }} /> },
    { id: 'gas', label: t('common.gas'), icon: <BsFillLightningFill style={{ color: Theme.colors.secondary }} /> }
  ];
  
  // Add property features as a separate category
  const propertyFeatures = [
    { id: 'balcony', label: t('property_features.balcony'), icon: <MdOutlineBalcony style={{ color: Theme.colors.secondary }} /> },
    { id: 'central-heating', label: t('property_features.central_heating'), icon: <GiHeatHaze style={{ color: Theme.colors.secondary }} /> },
    { id: 'parking-space', label: t('property_features.parking_space'), icon: <RiParkingBoxLine style={{ color: Theme.colors.secondary }} /> },
    { id: 'air-conditioning', label: t('property_features.air_conditioning'), icon: <TbAirConditioning style={{ color: Theme.colors.secondary }} /> },
    { id: 'wooden-floors', label: t('property_features.wooden_floors'), icon: <TbWood style={{ color: Theme.colors.secondary }} /> },
    { id: 'elevator', label: t('property_features.elevator'), icon: <FaWheelchair style={{ color: Theme.colors.secondary }} /> },
    { id: 'swimming-pool', label: t('property_features.swimming_pool'), icon: <FaSwimmingPool style={{ color: Theme.colors.secondary }} /> },
    { id: 'fireplace', label: t('property_features.fireplace'), icon: <MdOutlineFireplace style={{ color: Theme.colors.secondary }} /> },
    { id: 'accessible', label: t('property_features.accessible'), icon: <FaWheelchair style={{ color: Theme.colors.secondary }} /> }
  ];

  // Separate women-only and families-only from other rules
  const housingPreferences = [
    { id: 'women-only', label: t('common.women_only'), icon: <ImWoman style={{ color: Theme.colors.secondary }} /> },
    { id: 'families-only', label: t('common.families_only'), icon: <FaUsers style={{ color: Theme.colors.secondary }} /> }
  ];

  // Updated accepts only rules (now without women-only and families-only)
  const acceptsOnlyRules = [
    { id: 'pets-allowed', label: t('common.pets_allowed'), icon: <FaPaw style={{ color: Theme.colors.secondary }} /> },
    { id: 'smoking-allowed', label: t('common.smoking_allowed'), icon: <FaSmoking style={{ color: Theme.colors.secondary }} /> }
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

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    }
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
      
      <FilteringRow>
        <FilteringTitle>{t('property_list.bedrooms')}</FilteringTitle>
        <DropdownSelector>
          <select 
            value={bedrooms} 
            onChange={(e) => handleBedroomChange(e.target.value)}
          >
            <option value="">{t('property_list.select_bedrooms')}</option>
            <option value="0">{t('property_list.studio')}</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="3+">3+</option>
          </select>
          <IoChevronDown style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }}/>
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
            <option value="">{t('property_list.select_property_type')}</option>
            <option value="Apartment">{t('property_list.property_type.apartment')}</option>
            <option value="House">{t('property_list.property_type.house')}</option>
            <option value="Studio">{t('property_list.property_type.studio')}</option>
            <option value="Room">{t('property_list.property_type.room')}</option>
            <option value="Villa">{t('property_list.property_type.villa')}</option>
            <option value="Penthouse">{t('property_list.property_type.penthouse')}</option>
            <option value="Townhouse">{t('property_list.property_type.townhouse')}</option>
          </select>
          <IoChevronDown style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }}/>
        </DropdownSelector>
      </FilteringRow>
      
      <FilteringRow>
        <FilteringTitle>{t('common.furnished')}</FilteringTitle>
        <AmenitiesGrid>
          <AmenityItem>
            <div 
              className={`checkbox ${isAmenityChecked(furnishedFilter.id) ? 'checked' : ''}`}
              onClick={() => handleAmenityToggle(furnishedFilter.id)}
            ></div>
            <label onClick={() => handleAmenityToggle(furnishedFilter.id)}>
              {furnishedFilter.icon} {furnishedFilter.label}
            </label>
          </AmenityItem>
        </AmenitiesGrid>
      </FilteringRow>

      {/* New dedicated section for housing preferences */}
      <FilteringRow>
        <FilteringTitle>{t('common.housing_preferences')}</FilteringTitle>
        <AmenitiesGrid>
          {housingPreferences.map(preference => (
            <AmenityItem key={preference.id}>
              <div 
                className={`checkbox ${isAmenityChecked(preference.id) ? 'checked' : ''}`}
                onClick={() => handleAmenityToggle(preference.id)}
              ></div>
              <label onClick={() => handleAmenityToggle(preference.id)}>
                {preference.icon} {preference.label}
              </label>
            </AmenityItem>
          ))}
        </AmenitiesGrid>
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
                {amenity.icon} {amenity.label}
              </label>
            </AmenityItem>
          ))}
        </AmenitiesGrid>
      </FilteringRow>
      
      {/* New Property Features section */}
      <FilteringRow>
        <FilteringTitle>{t('property_features.title')}</FilteringTitle>
        <AmenitiesGrid>
          {propertyFeatures.map(feature => (
            <AmenityItem key={feature.id}>
              <div 
                className={`checkbox ${isAmenityChecked(feature.id) ? 'checked' : ''}`}
                onClick={() => handleAmenityToggle(feature.id)}
              ></div>
              <label onClick={() => handleAmenityToggle(feature.id)}>
                {feature.icon} {feature.label}
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
                {fee.icon} {fee.label}
              </label>
            </AmenityItem>
          ))}
        </AmenitiesGrid>
      </FilteringRow>

      <FilteringRow>
        <FilteringTitle>{t('common.allowed')}</FilteringTitle>
        <AmenitiesGrid>
          {acceptsOnlyRules.map(rule => (
            <AmenityItem key={rule.id}>
              <div 
                className={`checkbox ${isAmenityChecked(rule.id) ? 'checked' : ''}`}
                onClick={() => handleAmenityToggle(rule.id)}
              ></div>
              <label onClick={() => handleAmenityToggle(rule.id)}>
                {rule.icon} {rule.label}
              </label>
            </AmenityItem>
          ))}
        </AmenitiesGrid>
      </FilteringRow>

      <ButtonsContainer>
        <BackButton onClick={handleBackClick}>
          <FaArrowLeft /> {t('common.back')}
        </BackButton>
      
        {activeFilters.length > 0 && onClearFilters && (
          <ClearAllButton onClick={onClearFilters}>
            {t('property_list.clear_all_filters')}
          </ClearAllButton>
        )}
      </ButtonsContainer>
    </FilteringSectionContainer>
  );
};

export default FilteringSection; 
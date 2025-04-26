import React, { useState, FormEvent, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { IoSearch, IoLocationOutline, IoCalendarOutline, IoPersonOutline, IoClose, IoChevronDown } from 'react-icons/io5';
import { Theme } from '../../../../theme/theme';
import { useTranslation } from 'react-i18next';

// Styling for the new search and filter bar component
const SearchFilterBarContainer = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  margin-bottom: 16px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterItem = styled.div<{ active?: boolean, isSelect?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 42px;
  background: white;
  border: 1px solid ${props => props.active ? Theme.colors.primary : "#E2E8F0"};
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: ${props => props.active ? Theme.colors.primary : "#64748B"};
  flex: 1;
  max-width: ${props => props.isSelect ? '180px' : 'unset'};
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  
  &:hover {
    border-color: ${Theme.colors.primary};
  }
  
  svg {
    margin-right: 8px;
    min-width: 18px;
    color: ${props => props.active ? Theme.colors.primary : "#64748B"};
  }

  input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    width: 100%;
    color: #1E293B;
    font-family: inherit;
    font-weight: 400;

    &::placeholder {
      color: #94A3B8;
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
    color: #94A3B8;
    padding: 0;

    &:hover {
      color: #64748B;
    }
  }

  .dropdown-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94A3B8;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    transition: transform 0.2s ease;
  }

  &.open .dropdown-icon {
    transform: translateY(-50%) rotate(180deg);
  }
`;

const CustomSelectButton = styled.button`
  border: none;
  background: transparent;
  font-size: 14px;
  width: 100%;
  text-align: left;
  color: #1E293B;
  font-family: inherit;
  font-weight: 400;
  cursor: pointer;
  padding: 0;
  outline: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &::placeholder {
    color: #94A3B8;
  }
`;

const CustomSelectDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  overflow: hidden;
  display: ${props => props.isOpen ? 'block' : 'none'};
  max-height: 200px;
  overflow-y: auto;
`;

const SelectOption = styled.div<{ isSelected: boolean }>`
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
  background: ${props => props.isSelected ? "#F8FAFC" : "white"};
  color: ${props => props.isSelected ? Theme.colors.primary : "#1E293B"};
  
  &:hover {
    background: #F1F5F9;
  }
`;

// Custom date picker styling
const DatePickerDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  width: 280px;
  padding: 16px;
`;

const DatePickerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const MonthNavigationButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #64748B;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    background: #F1F5F9;
  }
`;

const MonthYearLabel = styled.div`
  font-weight: 500;
  color: #1E293B;
`;

const DaysHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 8px;
`;

const DayLabel = styled.div`
  font-size: 12px;
  color: #94A3B8;
  text-align: center;
`;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

const DayButton = styled.button<{ isToday?: boolean; isSelected?: boolean; isCurrentMonth?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: pointer;
  border: none;
  background: ${props => 
    props.isSelected ? Theme.colors.primary : 
    props.isToday ? '#EFF6FF' : 'transparent'
  };
  color: ${props => 
    props.isSelected ? 'white' : 
    props.isToday ? Theme.colors.primary : 
    !props.isCurrentMonth ? '#CBD5E1' : '#1E293B'
  };
  
  &:hover {
    background: ${props => props.isSelected ? Theme.colors.primary : '#F1F5F9'};
  }
  
  &:disabled {
    cursor: default;
    color: #CBD5E1;
    background: transparent;
  }
`;

const SearchButton = styled.button`
  background-color: ${Theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 50px;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  
  &:hover {
    background-color: ${Theme.colors.primary};
  }
  
  svg {
    font-size: 20px;
  }
`;

const ApplyFiltersButton = styled.button`
  background-color: ${Theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0 20px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
  flex-shrink: 0;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  
  &:hover {
    background-color: ${Theme.colors.primary};
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
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const genderSelectRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Format date for display
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return t('common.select_date');
    
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) return t('common.select_date');
      
      return new Intl.DateTimeFormat(navigator.language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(dateObj);
    } catch (e) {
      return t('common.select_date');
    }
  };

  // Gender options
  const genderOptions = [
    { value: '', label: t('common.any_gender') },
    { value: 'women_only', label: t('common.women_only') },
    { value: 'men_only', label: t('common.men_only') },
    { value: 'other', label: t('common.other_gender') }
  ];

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
    console.log("Apply Filters button clicked");
    if (onApplyFilters) {
      // Apply filters to update filter state and show the search view
      onApplyFilters();
    }
  };

  // Get current gender label
  const getCurrentGenderLabel = () => {
    const option = genderOptions.find(opt => opt.value === gender);
    return option ? option.label : t('common.any_gender');
  };

  // Date picker helpers
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const daysArray = [];
    
    // Previous month days
    const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday as first day
    if (prevMonthDays > 0) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevMonthYear = month === 0 ? year - 1 : year;
      const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
      
      for (let i = prevMonthDays - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        daysArray.push({
          day,
          month: prevMonth,
          year: prevMonthYear,
          isCurrentMonth: false
        });
      }
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push({
        day,
        month,
        year,
        isCurrentMonth: true
      });
    }
    
    // Next month days
    const totalCells = 42; // 6 rows of 7 days
    const nextMonthDays = totalCells - daysArray.length;
    
    if (nextMonthDays > 0) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextMonthYear = month === 11 ? year + 1 : year;
      
      for (let day = 1; day <= nextMonthDays; day++) {
        daysArray.push({
          day,
          month: nextMonth,
          year: nextMonthYear,
          isCurrentMonth: false
        });
      }
    }
    
    return daysArray;
  };

  const formatDateString = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handleDateSelect = (year: number, month: number, day: number) => {
    const dateString = formatDateString(year, month, day);
    onDateChange(dateString);
    setDateDropdownOpen(false);
  };

  const isToday = (year: number, month: number, day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const isSelectedDate = (year: number, month: number, day: number) => {
    if (!date) return false;
    
    try {
      const selectedDate = new Date(date);
      return (
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year
      );
    } catch (e) {
      return false;
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  // Day names
  const dayNames = [
    t('common.mon'),
    t('common.tue'),
    t('common.wed'),
    t('common.thu'),
    t('common.fri'),
    t('common.sat'),
    t('common.sun')
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genderSelectRef.current && !genderSelectRef.current.contains(event.target as Node)) {
        setGenderDropdownOpen(false);
      }
      
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setDateDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search button click
  const handleSearchClick = () => {
    console.log("Search with:", { location, date, gender });
    onSearch();
  };

  return (
    <SearchFilterBarContainer as="form" onSubmit={handleSubmit}>
      <FilterItem active={locationFocused || location !== ''}>
        <IoLocationOutline />
        <input
          type="text"
          placeholder={t('common.location')}
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          onFocus={() => setLocationFocused(true)}
          onBlur={() => setLocationFocused(false)}
        />
        {location && (
          <button 
            type="button"
            className="clear-button" 
            onClick={handleClearLocation}
          >
            <IoClose size={16} />
          </button>
        )}
      </FilterItem>
      
      <FilterItem 
        active={date !== ''}
        isSelect={true}
        className={dateDropdownOpen ? 'open' : ''}
        ref={datePickerRef}
        onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
      >
        <IoCalendarOutline />
        <CustomSelectButton type="button">
          {formatDateForDisplay(date)}
        </CustomSelectButton>
        {date && (
          <button 
            type="button"
            className="clear-button" 
            onClick={(e) => {
              e.stopPropagation();
              handleClearDate();
            }}
          >
            <IoClose size={16} />
          </button>
        )}
        <div className="dropdown-icon">
          <IoChevronDown />
        </div>
        
        <DatePickerDropdown isOpen={dateDropdownOpen} onClick={(e) => e.stopPropagation()}>
          <DatePickerHeader>
            <MonthNavigationButton type="button" onClick={handlePrevMonth}>
              &lsaquo;
            </MonthNavigationButton>
            <MonthYearLabel>
              {currentMonth.toLocaleDateString(navigator.language, { month: 'long', year: 'numeric' })}
            </MonthYearLabel>
            <MonthNavigationButton type="button" onClick={handleNextMonth}>
              &rsaquo;
            </MonthNavigationButton>
          </DatePickerHeader>
          
          <DaysHeader>
            {dayNames.map((day, index) => (
              <DayLabel key={index}>{day}</DayLabel>
            ))}
          </DaysHeader>
          
          <DayGrid>
            {generateCalendarDays().map((day, index) => (
              <DayButton
                key={index}
                type="button"
                isToday={isToday(day.year, day.month, day.day)}
                isSelected={isSelectedDate(day.year, day.month, day.day)}
                isCurrentMonth={day.isCurrentMonth}
                onClick={() => handleDateSelect(day.year, day.month, day.day)}
              >
                {day.day}
              </DayButton>
            ))}
          </DayGrid>
        </DatePickerDropdown>
      </FilterItem>
      
      <FilterItem 
        active={gender !== ''}
        isSelect={true}
        className={genderDropdownOpen ? 'open' : ''}
        ref={genderSelectRef}
        onClick={() => setGenderDropdownOpen(!genderDropdownOpen)}
      >
        <IoPersonOutline />
        <CustomSelectButton type="button">
          {getCurrentGenderLabel()}
        </CustomSelectButton>
        <div className="dropdown-icon">
          <IoChevronDown />
        </div>

        <CustomSelectDropdown isOpen={genderDropdownOpen}>
          {genderOptions.map(option => (
            <SelectOption 
              key={option.value} 
              isSelected={gender === option.value}
              onClick={(e) => {
                e.stopPropagation();
                onGenderChange(option.value);
                setGenderDropdownOpen(false);
              }}
            >
              {option.label}
            </SelectOption>
          ))}
        </CustomSelectDropdown>
      </FilterItem>
      
      {showSearchButton && (
        <SearchButton 
          onClick={handleSearchClick} 
          aria-label={t('common.search')} 
          type="button"
        >
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
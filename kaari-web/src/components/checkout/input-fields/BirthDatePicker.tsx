import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { FiCalendar, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface BirthDatePickerProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
  name?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

const DatePickerContainer = styled.div`
  position: relative;
  width: 100%;
  font-family: inherit;
  
  label {
    display: block;
    margin-bottom: 8px;
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.black};
  }
  
  .error-text {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.error};
    margin-top: 4px;
  }
`;

const DatePickerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: ${Theme.colors.white};
  border: 1px solid ${Theme.colors.tertiary};
  border-radius: ${Theme.borders.radius.extreme};
  cursor: pointer;
  transition: all 0.3s ease;
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.primary};
  
  &:hover {
    border-color: ${Theme.colors.secondary};
  }
  
  &:focus, &.active {
    border-color: ${Theme.colors.secondary};
    outline: none;
  }
  
  .placeholder {
    color: ${Theme.colors.gray2};
  }
  
  .date-icon {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${Theme.colors.secondary};
  }
`;

const CalendarDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: ${Theme.colors.white};
  border: 1px solid ${Theme.colors.tertiary};
  border-radius: ${Theme.borders.radius.sm};
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  padding: 16px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  .mode-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    
    button {
      padding: 4px 8px;
      background: none;
      border: none;
      cursor: pointer;
      font: ${Theme.typography.fonts.smallM};
      color: ${Theme.colors.gray2};
      border-radius: 4px;
      
      &.active {
        background: ${Theme.colors.quaternary};
        color: ${Theme.colors.secondary};
        font-weight: bold;
      }
      
      &:hover:not(.active) {
        background: ${Theme.colors.quaternary};
      }
    }
  }
  
  .title {
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.black};
  }
  
  .nav-buttons {
    display: flex;
    gap: 8px;
    
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${Theme.colors.quaternary};
      border: none;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      color: ${Theme.colors.gray2};
      transition: all 0.2s ease;
      
      &:hover {
        background: ${Theme.colors.tertiary};
        color: ${Theme.colors.secondary};
      }
    }
  }
`;

const YearsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  
  .year {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    font: ${Theme.typography.fonts.mediumM};
    border-radius: ${Theme.borders.radius.sm};
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover:not(.disabled) {
      background: ${Theme.colors.quaternary};
    }
    
    &.disabled {
      color: ${Theme.colors.tertiary};
      cursor: not-allowed;
    }
    
    &.selected {
      background: ${Theme.colors.secondary};
      color: white;
    }
  }
`;

const MonthsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  
  .month {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    font: ${Theme.typography.fonts.mediumM};
    border-radius: ${Theme.borders.radius.sm};
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover:not(.disabled) {
      background: ${Theme.colors.quaternary};
    }
    
    &.disabled {
      color: ${Theme.colors.tertiary};
      cursor: not-allowed;
    }
    
    &.selected {
      background: ${Theme.colors.secondary};
      color: white;
    }
  }
`;

const WeekdaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
  
  .weekday {
    text-align: center;
    font: ${Theme.typography.fonts.smallB};
    color: ${Theme.colors.gray2};
    padding: 6px 0;
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  
  .day {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    font: ${Theme.typography.fonts.smallM};
    border-radius: ${Theme.borders.radius.sm};
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover:not(.disabled):not(.selected) {
      background: ${Theme.colors.quaternary};
    }
    
    &.disabled {
      color: ${Theme.colors.tertiary};
      cursor: not-allowed;
    }
    
    &.today {
      border: 1px dashed ${Theme.colors.secondary};
    }
    
    &.selected {
      background: ${Theme.colors.secondary};
      color: white;
    }
    
    &.outside-month {
      color: ${Theme.colors.tertiary};
    }
  }
`;

// Format date for display
const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

// Get the number of days in a month
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// Get the day of the week of the first day of the month (0 = Sunday, 6 = Saturday)
const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

type ViewMode = 'years' | 'months' | 'days';

const BirthDatePicker: React.FC<BirthDatePickerProps> = ({
  label,
  value,
  onChange,
  name,
  required = false,
  error,
  disabled = false,
  placeholder = 'Select date of birth'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('years');
  
  // Get today's date
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Parse the selected date or use today's date (memoized to avoid changing reference every render)
  const selectedDate = useMemo(() => (value ? new Date(value) : null), [value]);
  
  // For year view, we show a range of 16 years
  const [yearRangeStart, setYearRangeStart] = useState(Math.max(currentYear - 100, 1900));
  
  // Calendar view state (month and year being displayed)
  const [viewDate, setViewDate] = useState({
    month: selectedDate ? selectedDate.getMonth() : today.getMonth(),
    year: selectedDate ? selectedDate.getFullYear() : currentYear - 30, // Default to 30 years ago for birth dates
  });
  
  // Update view date when the value prop changes
  useEffect(() => {
    if (selectedDate) {
      setViewDate({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear()
      });
    }
  }, [value]);
  
  const handlePrevYearRange = () => {
    setYearRangeStart(prev => Math.max(prev - 16, 1900));
  };
  
  const handleNextYearRange = () => {
    setYearRangeStart(prev => Math.min(prev + 16, currentYear - 16));
  };
  
  const handlePrevYear = () => {
    setViewDate(prev => ({
      ...prev,
      year: prev.year - 1
    }));
  };
  
  const handleNextYear = () => {
    setViewDate(prev => ({
      ...prev,
      year: Math.min(prev.year + 1, currentYear)
    }));
  };
  
  const handlePrevMonth = () => {
    setViewDate(prev => {
      if (prev.month === 0) {
        return { month: 11, year: prev.year - 1 };
      } else {
        return { ...prev, month: prev.month - 1 };
      }
    });
  };
  
  const handleNextMonth = () => {
    setViewDate(prev => {
      if (prev.month === 11) {
        return { month: 0, year: Math.min(prev.year + 1, currentYear) };
      } else {
        return { ...prev, month: prev.month + 1 };
      }
    });
  };
  
  const isDateInFuture = (date: Date): boolean => {
    return date > today;
  };
  
  const handleYearSelect = (year: number) => {
    setViewDate(prev => ({
      ...prev,
      year
    }));
    setViewMode('months');
  };
  
  const handleMonthSelect = (month: number) => {
    setViewDate(prev => ({
      ...prev,
      month
    }));
    setViewMode('days');
  };
  
  const handleDateClick = (day: number) => {
    const newDate = new Date(viewDate.year, viewDate.month, day);
    if (isDateInFuture(newDate)) return; // Don't allow future dates
    
    // Format date as YYYY-MM-DD
    const formattedDate = newDate.toISOString().split('T')[0];
    
    // Create synthetic change event
    if (typeof onChange === 'function') {
      if (onChange.length === 1) {
        onChange(formattedDate);
      } else {
        const syntheticEvent = {
          target: {
            name,
            value: formattedDate
          }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    }
    
    setIsOpen(false);
  };
  
  const generateYears = () => {
    const years = [];
    for (let year = yearRangeStart; year < yearRangeStart + 16 && year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };
  
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
    const firstDayOfMonth = getFirstDayOfMonth(viewDate.year, viewDate.month);
    
    // Get the number of days from the previous month to display
    const daysFromPrevMonth = firstDayOfMonth;
    
    // Get the number of days in the previous month
    const prevMonthDays = viewDate.month === 0 
      ? getDaysInMonth(viewDate.year - 1, 11)
      : getDaysInMonth(viewDate.year, viewDate.month - 1);
    
    // Calculate how many days from the next month to display to fill the grid
    const totalDaysDisplayed = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;
    const daysFromNextMonth = totalDaysDisplayed - daysInMonth - daysFromPrevMonth;
    
    const days = [];
    
    // Add days from the previous month
    for (let i = 0; i < daysFromPrevMonth; i++) {
      const day = prevMonthDays - daysFromPrevMonth + i + 1;
      const date = new Date(
        viewDate.month === 0 ? viewDate.year - 1 : viewDate.year,
        viewDate.month === 0 ? 11 : viewDate.month - 1,
        day
      );
      
      days.push({
        day,
        isCurrentMonth: false,
        date,
        isSelectable: !isDateInFuture(date)
      });
    }
    
    // Add days from the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(viewDate.year, viewDate.month, i);
      days.push({
        day: i,
        isCurrentMonth: true,
        date,
        isSelectable: !isDateInFuture(date)
      });
    }
    
    // Add days from the next month
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(
        viewDate.month === 11 ? viewDate.year + 1 : viewDate.year,
        viewDate.month === 11 ? 0 : viewDate.month + 1,
        i
      );
      days.push({
        day: i,
        isCurrentMonth: false,
        date,
        isSelectable: !isDateInFuture(date)
      });
    }
    
    return days;
  };
  
  const handleHeaderClick = () => {
    if (!disabled) {
      // If we're opening the calendar and there's a selected date, set the view mode appropriately
      if (!isOpen && selectedDate) {
        setViewDate({
          month: selectedDate.getMonth(),
          year: selectedDate.getFullYear()
        });
        setViewMode('days');
      } else if (!isOpen) {
        // Default to years view when opening with no selected date
        setViewMode('years');
        // Default the year range to show years around 30 years ago (common birth year range)
        const defaultYear = currentYear - 30;
        setYearRangeStart(Math.floor(defaultYear / 16) * 16);
      }
      setIsOpen(!isOpen);
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Calendar items based on view mode
  let calendarContent = null;
  
  if (viewMode === 'years') {
    const years = generateYears();
    calendarContent = (
      <>
        <CalendarHeader>
          <div className="title">{`${yearRangeStart} - ${Math.min(yearRangeStart + 15, currentYear)}`}</div>
          <div className="nav-buttons">
            <button onClick={handlePrevYearRange} type="button" aria-label="Previous years">
              <FiChevronLeft />
            </button>
            <button 
              onClick={handleNextYearRange} 
              type="button" 
              aria-label="Next years" 
              disabled={yearRangeStart + 16 > currentYear}
            >
              <FiChevronRight />
            </button>
          </div>
        </CalendarHeader>
        <YearsGrid>
          {years.map(year => (
            <div
              key={year}
              className={`year ${selectedDate && selectedDate.getFullYear() === year ? 'selected' : ''}`}
              onClick={() => handleYearSelect(year)}
            >
              {year}
            </div>
          ))}
        </YearsGrid>
      </>
    );
  } else if (viewMode === 'months') {
    calendarContent = (
      <>
        <CalendarHeader>
          <div className="title">{viewDate.year}</div>
          <div className="nav-buttons">
            <button onClick={handlePrevYear} type="button" aria-label="Previous year">
              <FiChevronLeft />
            </button>
            <button 
              onClick={handleNextYear} 
              type="button" 
              aria-label="Next year" 
              disabled={viewDate.year >= currentYear}
            >
              <FiChevronRight />
            </button>
          </div>
        </CalendarHeader>
        <MonthsGrid>
          {MONTHS.map((month, index) => {
            const isDisabled = viewDate.year === currentYear && index > today.getMonth();
            const isSelected = selectedDate && 
                              selectedDate.getFullYear() === viewDate.year && 
                              selectedDate.getMonth() === index;
            
            return (
              <div
                key={month}
                className={`month ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                onClick={() => !isDisabled && handleMonthSelect(index)}
              >
                {month.substring(0, 3)}
              </div>
            );
          })}
        </MonthsGrid>
      </>
    );
  } else {
    const calendarDays = generateCalendarDays();
    calendarContent = (
      <>
        <CalendarHeader>
          <div className="mode-selector">
            <button 
              className={viewMode === ('years' as any) ? 'active' : ''}
              onClick={() => setViewMode('years')}
            >
              Year
            </button>
            <button 
              className={viewMode === ('months' as any) ? 'active' : ''}
              onClick={() => setViewMode('months')}
            >
              Month
            </button>
            <button 
              className={viewMode === 'days' ? 'active' : ''}
              onClick={() => setViewMode('days')}
            >
              Day
            </button>
          </div>
          <div className="title">
            {MONTHS[viewDate.month]} {viewDate.year}
          </div>
          <div className="nav-buttons">
            <button onClick={handlePrevMonth} type="button" aria-label="Previous month">
              <FiChevronLeft />
            </button>
            <button 
              onClick={handleNextMonth} 
              type="button" 
              aria-label="Next month" 
              disabled={(viewDate.year === currentYear && viewDate.month >= today.getMonth())}
            >
              <FiChevronRight />
            </button>
          </div>
        </CalendarHeader>
        
        <WeekdaysRow>
          {WEEKDAYS.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </WeekdaysRow>
        
        <DaysGrid>
          {calendarDays.map(({ day, isCurrentMonth, date, isSelectable }, index) => {
            // Check if this date is selected
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            
            return (
              <div
                key={`${date.toISOString()}-${index}`}
                className={`day
                  ${!isCurrentMonth ? 'outside-month' : ''}
                  ${!isSelectable ? 'disabled' : ''}
                  ${isSelected ? 'selected' : ''}
                `}
                onClick={() => isSelectable && isCurrentMonth && handleDateClick(day)}
              >
                {day}
              </div>
            );
          })}
        </DaysGrid>
      </>
    );
  }
  
  return (
    <DatePickerContainer ref={containerRef}>
      {label && (
        <label htmlFor={name}>{label}{required && <span style={{ color: 'red' }}> *</span>}</label>
      )}
      
      <DatePickerHeader 
        onClick={handleHeaderClick}
        className={isOpen ? 'active' : ''}
        tabIndex={0}
        role="button"
        aria-disabled={disabled}
      >
        {value ? (
          <span>{formatDateForDisplay(value)}</span>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <span className="date-icon">
          <FiCalendar />
          <FiChevronDown />
        </span>
      </DatePickerHeader>
      
      <CalendarDropdown isOpen={isOpen}>
        {calendarContent}
      </CalendarDropdown>
      
      {/* Hidden native date input for form submission */}
      <input
        id={name}
        name={name}
        type="date"
        value={value}
        onChange={(e) => onChange(e)}
        required={required}
        disabled={disabled}
        style={{ 
          display: 'none'
        }}
      />
      
      {error && <div className="error-text">{error}</div>}
    </DatePickerContainer>
  );
};

export default BirthDatePicker; 
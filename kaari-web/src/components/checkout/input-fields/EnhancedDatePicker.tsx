import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { FiCalendar, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface EnhancedDatePickerProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
  name?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
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
  
  .month-year {
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

const EnhancedDatePicker: React.FC<EnhancedDatePickerProps> = ({
  label,
  value,
  onChange,
  name,
  required = false,
  error,
  disabled = false,
  min,
  max,
  placeholder = 'Select a date'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parse the min and max dates
  const minDate = min ? new Date(min) : null;
  const maxDate = max ? new Date(max) : null;
  
  // Parse the selected date or use today's date
  const today = new Date();
  let selectedDate = value ? new Date(value) : null;
  
  // Calendar view state (month and year being displayed)
  const [viewDate, setViewDate] = useState({
    month: selectedDate ? selectedDate.getMonth() : today.getMonth(),
    year: selectedDate ? selectedDate.getFullYear() : today.getFullYear()
  });
  
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
        return { month: 0, year: prev.year + 1 };
      } else {
        return { ...prev, month: prev.month + 1 };
      }
    });
  };
  
  const isDateInRange = (date: Date): boolean => {
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  };
  
  const handleDateClick = (day: number) => {
    const newDate = new Date(viewDate.year, viewDate.month, day);
    if (!isDateInRange(newDate)) return;
    
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
        isSelectable: isDateInRange(date)
      });
    }
    
    // Add days from the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(viewDate.year, viewDate.month, i);
      days.push({
        day: i,
        isCurrentMonth: true,
        date,
        isSelectable: isDateInRange(date)
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
        isSelectable: isDateInRange(date)
      });
    }
    
    return days;
  };
  
  const handleHeaderClick = () => {
    if (!disabled) {
      // If we're opening the calendar, set the view date to the selected date or today
      if (!isOpen && selectedDate) {
        setViewDate({
          month: selectedDate.getMonth(),
          year: selectedDate.getFullYear()
        });
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
  
  // Calendar days
  const calendarDays = generateCalendarDays();
  
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
        <CalendarHeader>
          <div className="month-year">
            {MONTHS[viewDate.month]} {viewDate.year}
          </div>
          <div className="nav-buttons">
            <button onClick={handlePrevMonth} type="button" aria-label="Previous month">
              <FiChevronLeft />
            </button>
            <button onClick={handleNextMonth} type="button" aria-label="Next month">
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
            // Check if this date is today
            const isToday = date.toDateString() === new Date().toDateString();
            
            // Check if this date is selected
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            
            return (
              <div
                key={`${date.toISOString()}-${index}`}
                className={`day
                  ${!isCurrentMonth ? 'outside-month' : ''}
                  ${!isSelectable ? 'disabled' : ''}
                  ${isToday ? 'today' : ''}
                  ${isSelected ? 'selected' : ''}
                `}
                onClick={() => isSelectable && isCurrentMonth && handleDateClick(day)}
              >
                {day}
              </div>
            );
          })}
        </DaysGrid>
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
        min={min}
        max={max}
        style={{ 
          display: 'none'
        }}
      />
      
      {error && <div className="error-text">{error}</div>}
    </DatePickerContainer>
  );
};

export default EnhancedDatePicker; 
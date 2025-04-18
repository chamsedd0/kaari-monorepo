import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Theme } from "../../../../theme/theme";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaAngleDown } from "react-icons/fa";

const DatePickerContainer = styled.div`
  width: 100%;
  position: relative;

  .date-input-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-height: 70px;
    width: 100%;
    padding: 24px 32px;
    border: none;
    border-radius: ${Theme.borders.radius.extreme};
    background-color: ${Theme.colors.white};
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }

  .date-label {
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.secondary};
    margin-right: 16px;
  }

  .date-value {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font: ${Theme.typography.fonts.largeM};
    color: ${Theme.colors.black};
  }

  .calendar-icon {
    color: ${Theme.colors.primary};
    font-size: 18px;
    transition: transform 0.3s ease;
  }

  .dropdown-open .calendar-icon {
    transform: rotate(180deg);
  }

  .date-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 100%;
    background-color: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    z-index: 100;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    
    &.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
  }

  .dropdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .navigation {
      display: flex;
      align-items: center;
    }
    
    .month-selector, .year-selector {
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
      
      .custom-dropdown {
        position: relative;
        margin-right: 12px;
        
        .dropdown-selected {
          display: flex;
          align-items: center;
          font: ${Theme.typography.fonts.mediumB};
          color: ${Theme.colors.black};
          background: transparent;
          padding: 6px 24px 6px 12px;
          border-radius: 8px;
          transition: all 0.2s ease;
          
          &:hover {
            background: ${Theme.colors.tertiary}20;
          }
          
          .dropdown-icon {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            color: ${Theme.colors.primary};
            font-size: 12px;
            transition: transform 0.2s ease;
          }
          
          &.open .dropdown-icon {
            transform: translateY(-50%) rotate(180deg);
          }
        }
        
        .dropdown-list {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-height: 200px;
          overflow-y: auto;
          z-index: 10;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px);
          transition: all 0.2s ease;
          width: max-content;
          min-width: 100%;
          
          &.open {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }
          
          .dropdown-item {
            padding: 8px 16px;
            font: ${Theme.typography.fonts.text14};
            color: ${Theme.colors.black};
            cursor: pointer;
            transition: all 0.2s ease;
            
            &:hover {
              background: ${Theme.colors.tertiary}30;
            }
            
            &.selected {
              background: ${Theme.colors.tertiary}50;
              color: ${Theme.colors.primary};
              font-weight: 600;
            }
          }
        }
      }
    }
    
    .navigation-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .nav-button {
      background: none;
      border: none;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${Theme.colors.primary};
      cursor: pointer;
      border-radius: 50%;
      margin: 0 4px;
      transition: all 0.2s ease;
      
      &:hover {
        background-color: ${Theme.colors.tertiary}30;
      }
      
      &:active {
        transform: scale(0.95);
      }
    }
  }

  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 8px;
    
    .weekday {
      font: ${Theme.typography.fonts.smallM};
      color: ${Theme.colors.gray2};
      text-align: center;
      padding: 8px 0;
    }
  }

  .days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0px;
    
    .day {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.black};
      cursor: pointer;
      transition: all 0.2s ease;
      margin: 0 auto;
      
      &:hover:not(.disabled):not(.selected) {
        background-color: ${Theme.colors.tertiary}30;
      }
      
      &.selected {
        background-color: ${Theme.colors.primary};
        color: white;
      }
      
      &.today:not(.selected) {
        border: 2px solid ${Theme.colors.primary}80;
      }
      
      &.disabled {
        color: ${Theme.colors.gray};
        cursor: default;
      }
      
      &.other-month {
        color: ${Theme.colors.gray2};
      }
    }
  }
`;

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  title?: string;
}

const InputVariantDatePicker: React.FC<DatePickerProps> = ({
  value = "",
  onChange,
  title = "Date",
}) => {
  // Get tomorrow's date
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : getTomorrow()
  );
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? selectedDate.getMonth() : getTomorrow().getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    selectedDate ? selectedDate.getFullYear() : getTomorrow().getFullYear()
  );
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  
  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      
      if (isMonthDropdownOpen && monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setIsMonthDropdownOpen(false);
      }
      
      if (isYearDropdownOpen && yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setIsYearDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMonthDropdownOpen, isYearDropdownOpen]);
  
  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date || isNaN(date.getTime())) {
      // Show tomorrow's date instead of placeholder
      const tomorrow = getTomorrow();
      
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      
      return tomorrow.toLocaleDateString('en-US', options);
    }
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return date.toLocaleDateString('en-US', options);
  };
  
  // Generate days for calendar
  const generateDays = () => {
    const days = [];
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Add days from previous month
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        month: currentMonth - 1,
        year: currentMonth === 0 ? currentYear - 1 : currentYear,
        isCurrentMonth: false
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true
      });
    }
    
    // Add days from next month
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: currentMonth + 1,
        year: currentMonth === 11 ? currentYear + 1 : currentYear,
        isCurrentMonth: false
      });
    }
    
    return days;
  };
  
  // Handle date selection
  const handleDateSelect = (day: number, month: number, year: number) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
    
    if (onChange) {
      onChange(newDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }
    
    setIsOpen(false);
  };
  
  // Ensure the initial render selects tomorrow in the calendar
  useEffect(() => {
    // Make sure tomorrow is initially selected in the calendar
    if (!selectedDate) {
      const tomorrow = getTomorrow();
      setSelectedDate(tomorrow);
      setCurrentMonth(tomorrow.getMonth());
      setCurrentYear(tomorrow.getFullYear());
      
      if (onChange) {
        onChange(tomorrow.toISOString().split('T')[0]);
      }
    }
  }, []);
  
  // Navigate to previous month
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Generate month options
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Generate year options (10 years before and after current year)
  const currentYearNum = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYearNum - 10 + i);
  
  // Check if a date is today
  const isToday = (day: number, month: number, year: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };
  
  // Check if a date is selected
  const isSelected = (day: number, month: number, year: number) => {
    if (!selectedDate) return false;
    
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };
  
  const toggleMonthDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsYearDropdownOpen(false);
    setIsMonthDropdownOpen(!isMonthDropdownOpen);
  };
  
  const toggleYearDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMonthDropdownOpen(false);
    setIsYearDropdownOpen(!isYearDropdownOpen);
  };
  
  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(monthIndex);
    setIsMonthDropdownOpen(false);
  };
  
  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setIsYearDropdownOpen(false);
  };
  
  const days = generateDays();
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <DatePickerContainer ref={dropdownRef}>
      <div 
        className={`date-input-container ${isOpen ? 'dropdown-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="date-label">{title}</span>
        <div className="date-value">
          <span>{formatDate(selectedDate)}</span>
          <FaCalendarAlt className="calendar-icon" />
        </div>
      </div>
      
      <div className={`date-dropdown ${isOpen ? 'open' : ''}`}>
        <div className="dropdown-header">
          <div className="navigation">
            <div className="month-selector" ref={monthDropdownRef}>
              <div className="custom-dropdown">
                <div 
                  className={`dropdown-selected ${isMonthDropdownOpen ? 'open' : ''}`} 
                  onClick={toggleMonthDropdown}
                >
                  <span>{months[currentMonth]}</span>
                  <FaAngleDown className="dropdown-icon" />
                </div>
                <div className={`dropdown-list ${isMonthDropdownOpen ? 'open' : ''}`}>
                  {months.map((month, index) => (
                    <div 
                      key={month} 
                      className={`dropdown-item ${currentMonth === index ? 'selected' : ''}`}
                      onClick={() => handleMonthSelect(index)}
                    >
                      {month}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="year-selector" ref={yearDropdownRef}>
              <div className="custom-dropdown">
                <div 
                  className={`dropdown-selected ${isYearDropdownOpen ? 'open' : ''}`} 
                  onClick={toggleYearDropdown}
                >
                  <span>{currentYear}</span>
                  <FaAngleDown className="dropdown-icon" />
                </div>
                <div className={`dropdown-list ${isYearDropdownOpen ? 'open' : ''}`}>
                  {years.map((year) => (
                    <div 
                      key={year} 
                      className={`dropdown-item ${currentYear === year ? 'selected' : ''}`}
                      onClick={() => handleYearSelect(year)}
                    >
                      {year}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="navigation-buttons">
            <button className="nav-button" onClick={goToPrevMonth}>
              <FaChevronLeft />
            </button>
            <button className="nav-button" onClick={goToNextMonth}>
              <FaChevronRight />
            </button>
          </div>
        </div>
        
        <div className="weekdays">
          {weekdays.map((day) => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="days-grid">
          {days.map((day, index) => (
            <div
              key={index}
              className={`day ${
                !day.isCurrentMonth ? 'other-month' : ''
              } ${
                isToday(day.day, day.month, day.year) ? 'today' : ''
              } ${
                isSelected(day.day, day.month, day.year) ? 'selected' : ''
              }`}
              onClick={() => handleDateSelect(day.day, day.month, day.year)}
            >
              {day.day}
            </div>
          ))}
        </div>
      </div>
    </DatePickerContainer>
  );
};

export default InputVariantDatePicker;

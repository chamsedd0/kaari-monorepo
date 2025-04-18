import React, { useState, useEffect } from 'react';
import CalendarComponentBaseModel from "../../../styles/constructed/calendar/calendar-base-model-style";
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  format?: string;
  disabledDates?: Date[];
  minDate?: Date;
  checkAvailability?: (date: Date) => Promise<boolean>;
}

const CalendarComponent: React.FC<CalendarProps> = ({ 
  selectedDate: propSelectedDate, 
  onDateSelect, 
  format = 'MM/DD/YYYY',
  disabledDates = [],
  minDate = new Date(),
  checkAvailability
}) => {
  const [currentMonth, setCurrentMonth] = useState<number>(propSelectedDate ? propSelectedDate.getMonth() : new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(propSelectedDate ? propSelectedDate.getFullYear() : new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(propSelectedDate);
  const [days, setDays] = useState<Array<{ 
    day: number; 
    month: number; 
    year: number; 
    isCurrentMonth: boolean;
    isDisabled: boolean;
    isLoading?: boolean;
  }>>([]);
  const [loadingDates, setLoadingDates] = useState<{[key: string]: boolean}>({});

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Format to yyyy-mm-dd string for comparing dates
  const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  // Check if a date is in the disabledDates array
  const isDateDisabled = (day: number, month: number, year: number): boolean => {
    // Check if date is before minDate
    const date = new Date(year, month, day);
    const minDateTime = new Date(minDate);
    minDateTime.setHours(0, 0, 0, 0);
    
    if (date < minDateTime) {
      return true;
    }
    
    // Check if date is in disabledDates
    return disabledDates.some(disabledDate => {
      return (
        disabledDate.getDate() === day &&
        disabledDate.getMonth() === month &&
        disabledDate.getFullYear() === year
      );
    });
  };

  useEffect(() => {
    generateDays();
  }, [currentMonth, currentYear, disabledDates, minDate]);

  useEffect(() => {
    setSelectedDate(propSelectedDate);
  }, [propSelectedDate]);

  const generateDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    const tempDays = [];
    
    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      
      const isDisabled = isDateDisabled(daysInPrevMonth - i, prevMonth, prevYear);
      
      tempDays.push({
        day: daysInPrevMonth - i,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        isDisabled
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const isDisabled = isDateDisabled(i, currentMonth, currentYear);
      
      tempDays.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        isDisabled
      });
    }
    
    // Next month days
    const remainingCells = 42 - tempDays.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      
      const isDisabled = isDateDisabled(i, nextMonth, nextYear);
      
      tempDays.push({
        day: i,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isDisabled
      });
    }
    
    setDays(tempDays);
  };

  const incrementMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const decrementMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const incrementYear = () => {
    setCurrentYear(currentYear + 1);
  };

  const decrementYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const handleDateClick = async (day: number, month: number, year: number, isDisabled: boolean) => {
    if (isDisabled) return;
    
    const newDate = new Date(year, month, day);
    
    // If we need to check availability
    if (checkAvailability) {
      const dateKey = formatDateKey(newDate);
      
      try {
        // Set this date as loading
        setLoadingDates(prev => ({ ...prev, [dateKey]: true }));
        
        // Check availability from the API
        const isAvailable = await checkAvailability(newDate);
        
        // Update days to mark this date as available/unavailable
        if (!isAvailable) {
          // If not available, add to disabled dates
          const updatedDisabledDates = [...disabledDates, newDate];
          disabledDates = updatedDisabledDates;
          generateDays();
          return;
        }
        
        // If available, continue with selection
        setSelectedDate(newDate);
        onDateSelect(newDate);
      } catch (error) {
        console.error('Error checking date availability:', error);
      } finally {
        // Clear loading state
        setLoadingDates(prev => {
          const updated = { ...prev };
          delete updated[dateKey];
          return updated;
        });
      }
    } else {
      // No availability check needed, just select the date
      setSelectedDate(newDate);
      onDateSelect(newDate);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    let formattedDate = format;
    formattedDate = formattedDate.replace('MM', month);
    formattedDate = formattedDate.replace('DD', day);
    formattedDate = formattedDate.replace('YYYY', year.toString());
    
    return formattedDate;
  };

  const isDateSelected = (day: number, month: number, year: number) => {
    if (!selectedDate) return false;
    
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  const isToday = (day: number, month: number, year: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  return (
    <CalendarComponentBaseModel>
      <div className="chosen-date">{formatDate(selectedDate)}</div>

      <div className="control-date">
        <div className="month-select">
          <span>{months[currentMonth]}</span>
          <div className="controls">
            <button className="up" onClick={incrementMonth}>
              <FaChevronUp />
            </button>
            <button className="down" onClick={decrementMonth}>
              <FaChevronDown />
            </button>
          </div>
        </div>
        <div className="year-select">
          <span>{currentYear}</span>
          <div className="controls">
            <button className="up" onClick={incrementYear}>
              <FaChevronUp />
            </button>
            <button className="down" onClick={decrementYear}>
              <FaChevronDown />
            </button>
          </div>
        </div>
      </div>

      <div className="calendar">
        <div className="days-enum">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div key={day} className="day">
              {day}
            </div>
          ))}
        </div>

        <div className="day-numbers">
          {days.map((dayInfo, index) => {
            const dateKey = formatDateKey(new Date(dayInfo.year, dayInfo.month, dayInfo.day));
            const isLoading = loadingDates[dateKey] || false;
            
            return (
              <div
                key={index}
                className={`day-number-box 
                  ${isDateSelected(dayInfo.day, dayInfo.month, dayInfo.year) ? 'selected' : ''} 
                  ${isToday(dayInfo.day, dayInfo.month, dayInfo.year) ? 'today' : ''} 
                  ${!dayInfo.isCurrentMonth ? 'other-month' : ''}
                  ${dayInfo.isDisabled ? 'disabled' : ''}
                  ${isLoading ? 'loading' : ''}`}
                onClick={() => handleDateClick(dayInfo.day, dayInfo.month, dayInfo.year, dayInfo.isDisabled)}
              >
                {dayInfo.day}
                {isLoading && <span className="loading-indicator">...</span>}
              </div>
            );
          })}
        </div>
      </div>
    </CalendarComponentBaseModel>
  );
};

export default CalendarComponent;

import React, { useState, useEffect, useMemo } from 'react';
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
  // Simple state management
  const [currentMonth, setCurrentMonth] = useState<number>(propSelectedDate ? propSelectedDate.getMonth() : new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(propSelectedDate ? propSelectedDate.getFullYear() : new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(propSelectedDate);
  const [loadingDates, setLoadingDates] = useState<{[key: string]: boolean}>({});
  const [disabledDatesList, setDisabledDatesList] = useState<Date[]>(disabledDates);

  // Static values that don't change
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Update selected date when prop changes
  useEffect(() => {
    setSelectedDate(propSelectedDate);
  }, [propSelectedDate]);

  // Update disabled dates when prop changes
  useEffect(() => {
    setDisabledDatesList(disabledDates);
  }, [disabledDates]);

  // Format date key for comparison
  const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  // Check if a date is disabled
  const isDateDisabled = (day: number, month: number, year: number): boolean => {
    // Check if date is before minDate
    const date = new Date(year, month, day);
    const minDateTime = new Date(minDate);
    minDateTime.setHours(0, 0, 0, 0);
    
    if (date < minDateTime) {
      return true;
    }
    
    // Check if date is in disabledDates
    return disabledDatesList.some(disabledDate => 
        disabledDate.getDate() === day &&
        disabledDate.getMonth() === month &&
        disabledDate.getFullYear() === year
      );
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const day = daysInPrevMonth - i;
      
      days.push({
        day,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        isDisabled: isDateDisabled(day, prevMonth, prevYear)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        isDisabled: isDateDisabled(i, currentMonth, currentYear)
      });
    }
    
    // Next month days
    const remainingCells = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      
      days.push({
        day: i,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isDisabled: isDateDisabled(i, nextMonth, nextYear)
      });
    }
    
    return days;
  }, [currentMonth, currentYear, disabledDatesList, minDate]);

  // Navigation handlers
  const incrementMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
    // Don't call onDateSelect here
  };

  const decrementMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
    // Don't call onDateSelect here
  };

  const incrementYear = () => {
    setCurrentYear(y => y + 1);
    // Don't call onDateSelect here
  };

  const decrementYear = () => {
    setCurrentYear(y => y - 1);
    // Don't call onDateSelect here
  };

  // Date selection handler
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
          setDisabledDatesList(prev => [...prev, newDate]);
          setLoadingDates(prev => {
            const updated = { ...prev };
            delete updated[dateKey];
            return updated;
          });
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

  // Format date for display
  const formatDate = (date: Date | null): string => {
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

  // Check if a date is selected
  const isDateSelected = (day: number, month: number, year: number): boolean => {
    if (!selectedDate) return false;
    
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  // Check if a date is today
  const isToday = (day: number, month: number, year: number): boolean => {
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
          <span>{MONTHS[currentMonth]}</span>
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
          {DAYS.map((day) => (
            <div key={day} className="day">
              {day}
            </div>
          ))}
        </div>

        <div className="day-numbers">
          {calendarDays.map((dayInfo, index) => {
            const dateKey = formatDateKey(new Date(dayInfo.year, dayInfo.month, dayInfo.day));
            const isLoading = loadingDates[dateKey] || false;
            
            return (
              <div
                key={`${dayInfo.year}-${dayInfo.month}-${dayInfo.day}-${index}`}
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

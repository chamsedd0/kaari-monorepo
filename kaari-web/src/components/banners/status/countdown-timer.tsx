import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface CountdownTimerProps {
  targetDate: Date | string;
  timeSlot: string;  // "10:00 AM - 12:00 PM" format
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, timeSlot }) => {
  const { t, i18n } = useTranslation();
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isInvalidDate, setIsInvalidDate] = useState<boolean>(false);
  
  useEffect(() => {
    const calculateTimeRemaining = () => {
      try {
        // Check if targetDate is valid
        if (!targetDate || targetDate === 'Invalid Date') {
          setIsInvalidDate(true);
          return t('advertiser_dashboard.photoshoot.invalid_date', 'Invalid date');
        }

        // Parse target date
        const targetDateObj = new Date(targetDate);
        
        // Check if date is valid
        if (isNaN(targetDateObj.getTime())) {
          setIsInvalidDate(true);
          return t('advertiser_dashboard.photoshoot.invalid_date', 'Invalid date');
        }
        
        // Check if timeSlot is valid
        if (!timeSlot || typeof timeSlot !== 'string') {
          return `${formatDateOnly(targetDateObj)}`;
        }
        
        // Extract time from timeSlot (assuming format like "10:00 AM - 12:00 PM")
        const startTime = timeSlot.split(' - ')[0];
        if (!startTime) {
          return `${formatDateOnly(targetDateObj)}`;
        }
        
        // Parse hours and minutes from start time
        let hours = 0;
        let minutes = 0;
        let validTimeFormat = false;
        
        // Parse the time string (handle both 12-hour and 24-hour formats)
        if (startTime.includes('AM') || startTime.includes('PM')) {
          // 12-hour format
          const timeParts = startTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (timeParts) {
            hours = parseInt(timeParts[1], 10);
            minutes = parseInt(timeParts[2], 10);
            validTimeFormat = true;
            
            // Convert to 24-hour format if PM
            if (timeParts[3].toUpperCase() === 'PM' && hours < 12) {
              hours += 12;
            }
            // Convert 12 AM to 0 hours
            if (timeParts[3].toUpperCase() === 'AM' && hours === 12) {
              hours = 0;
            }
          }
        } else {
          // 24-hour format
          const timeParts = startTime.match(/(\d+):(\d+)/);
          if (timeParts) {
            hours = parseInt(timeParts[1], 10);
            minutes = parseInt(timeParts[2], 10);
            validTimeFormat = true;
          }
        }
        
        // If time format is invalid, just return the date
        if (!validTimeFormat) {
          return `${formatDateOnly(targetDateObj)}`;
        }
        
        // Set the target date with the correct time
        const fullTargetDate = new Date(targetDateObj);
        fullTargetDate.setHours(hours, minutes, 0, 0);
        
        // Calculate the time difference
        const now = new Date();
        const difference = fullTargetDate.getTime() - now.getTime();
        
        // Check if the target date has already passed
        if (difference <= 0) {
          setIsExpired(true);
          return t('advertiser_dashboard.photoshoot.time_expired', 'Time expired');
        }
        
        // Calculate days, hours, and minutes
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hoursRemaining = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        
        // Format the time
        let timeString = '';
        
        if (days > 0) {
          timeString += `${days} ${days === 1 ? t('advertiser_dashboard.photoshoot.day', 'day') : t('advertiser_dashboard.photoshoot.days', 'days')} `;
        }
        
        if (hoursRemaining > 0 || days > 0) {
          timeString += `${hoursRemaining} ${hoursRemaining === 1 ? t('advertiser_dashboard.photoshoot.hour', 'hour') : t('advertiser_dashboard.photoshoot.hours', 'hours')} `;
        }
        
        timeString += `${minutesRemaining} ${minutesRemaining === 1 ? t('advertiser_dashboard.photoshoot.minute', 'minute') : t('advertiser_dashboard.photoshoot.minutes', 'minutes')}`;
        
        return timeString;
      } catch (error) {
        console.error('Error calculating time remaining:', error);
        setIsInvalidDate(true);
        return t('advertiser_dashboard.photoshoot.invalid_date', 'Invalid date');
      }
    };
    
    // Helper function to format just the date portion
    const formatDateOnly = (date: Date) => {
      try {
        const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
        return date.toLocaleDateString(locale, {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      } catch (error) {
        console.error('Error formatting date:', error);
        return t('advertiser_dashboard.photoshoot.invalid_date', 'Invalid date');
      }
    };
    
    // Update time remaining immediately and then every minute
    setTimeRemaining(calculateTimeRemaining());
    
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [targetDate, timeSlot, t, i18n]); // Re-calculate when targetDate or timeSlot changes
  
  return (
    <div>
      {isInvalidDate ? (
        <span style={{ color: '#FF6B6B' }}>{t('advertiser_dashboard.photoshoot.invalid_date', 'Invalid date')}</span>
      ) : isExpired ? (
        <span style={{ color: '#FF6B6B' }}>{t('advertiser_dashboard.photoshoot.time_expired', 'Time expired')}</span>
      ) : (
        <>
          {timeSlot} ({timeRemaining})
        </>
      )}
    </div>
  );
}; 
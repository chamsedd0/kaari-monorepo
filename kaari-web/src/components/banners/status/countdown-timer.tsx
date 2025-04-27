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
  
  useEffect(() => {
    const calculateTimeRemaining = () => {
      // Parse target date
      const targetDateObj = new Date(targetDate);
      
      // Extract time from timeSlot (assuming format like "10:00 AM - 12:00 PM")
      const startTime = timeSlot.split(' - ')[0];
      
      // Parse hours and minutes from start time
      let hours = 0;
      let minutes = 0;
      
      // Parse the time string (handle both 12-hour and 24-hour formats)
      if (startTime.includes('AM') || startTime.includes('PM')) {
        // 12-hour format
        const timeParts = startTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (timeParts) {
          hours = parseInt(timeParts[1], 10);
          minutes = parseInt(timeParts[2], 10);
          
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
        }
      }
      
      // Set the target date with the correct time
      targetDateObj.setHours(hours, minutes, 0, 0);
      
      // Calculate the time difference
      const now = new Date();
      const difference = targetDateObj.getTime() - now.getTime();
      
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
    };
    
    // Update time remaining immediately and then every minute
    setTimeRemaining(calculateTimeRemaining());
    
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [targetDate, timeSlot, t]); // Re-calculate when targetDate or timeSlot changes
  
  return (
    <div>
      {isExpired ? (
        <span style={{ color: '#FF6B6B' }}>{t('advertiser_dashboard.photoshoot.time_expired', 'Time expired')}</span>
      ) : (
        <>
          {timeSlot} ({timeRemaining})
        </>
      )}
    </div>
  );
}; 
import React, { useState, useEffect } from 'react';
import { BannerBaseModelStyleTimer } from "../../../styles/banners/status/banner-base-model-style-timer";

interface CountdownTimerProps {
  targetDate: Date | string;
  timeSlot?: string; // Optional time slot (e.g., "7:00 AM", "1:00 PM")
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, timeSlot }) => {
  const [timeLeft, setTimeLeft] = useState('00:00:00:00');
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      try {
        // Create target date object
        const targetDateObj = new Date(targetDate);
        
        // If a time slot is provided, set the correct hours and minutes
        if (timeSlot) {
          const timeMatch = timeSlot.match(/(\d+):(\d+)\s?(AM|PM)/i);
          
          if (timeMatch) {
            let hours = parseInt(timeMatch[1], 10);
            const minutes = parseInt(timeMatch[2], 10);
            const period = timeMatch[3].toUpperCase();
            
            // Convert to 24-hour format
            if (period === 'PM' && hours < 12) {
              hours += 12;
            } else if (period === 'AM' && hours === 12) {
              hours = 0;
            }
            
            targetDateObj.setHours(hours, minutes, 0, 0);
          }
        }
        
        const now = new Date();
        const difference = targetDateObj.getTime() - now.getTime();
        
        if (difference <= 0) {
          setTimeLeft('00:00:00:00');
          return;
        }
        
        // Calculate days, hours, minutes, seconds
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Format the time with leading zeros
        const formattedDays = days.toString().padStart(2, '0');
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        setTimeLeft(`${formattedDays}:${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
      } catch (error) {
        console.error('Error calculating time left:', error);
        setTimeLeft('00:00:00:00');
      }
    };
    
    // Calculate time left immediately
    calculateTimeLeft();
    
    // Set interval to update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, [targetDate, timeSlot]);
  
  return (
    <BannerBaseModelStyleTimer>
      <div className="timer">{timeLeft}</div>
    </BannerBaseModelStyleTimer>
  );
}; 
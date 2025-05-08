import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

interface TimerProps {
  expiryTime: Date;
  className?: string;
}

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  width: 100%;
  height: 100%;
`;

const TimerDigits = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TimeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0.25rem;
`;

const Digit = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 3rem;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  min-width: 4rem;
  text-align: center;
  margin-bottom: 0.25rem;
`;

const Label = styled.div`
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.05em;
`;

const Separator = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin: 0 0.25rem;
  padding-bottom: 1.5rem;
`;

const ExpiredMessage = styled.div`
  background-color: ${Theme.colors.error};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  margin-top: 1rem;
`;

const TimerComponent: React.FC<TimerProps> = ({ expiryTime }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({ 
    hours: 0, minutes: 0, seconds: 0 
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = expiryTime.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      // Calculate time units
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update timer every second
    const timer = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);

      if (updatedTimeLeft.hours === 0 && updatedTimeLeft.minutes === 0 && updatedTimeLeft.seconds === 0) {
        clearInterval(timer);
        setIsExpired(true);
      }
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, [expiryTime]);

  // Format digits to always show two digits (e.g., 01 instead of 1)
  const formatDigit = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  return (
    <TimerContainer>
      {isExpired ? (
        <ExpiredMessage>Time Expired!</ExpiredMessage>
      ) : (
        <>
          <TimerDigits>
            <TimeSection>
              <Digit>{formatDigit(timeLeft.hours)}</Digit>
              <Label>Hours</Label>
            </TimeSection>
            <Separator>:</Separator>
            <TimeSection>
              <Digit>{formatDigit(timeLeft.minutes)}</Digit>
              <Label>Minutes</Label>
            </TimeSection>
            <Separator>:</Separator>
            <TimeSection>
              <Digit>{formatDigit(timeLeft.seconds)}</Digit>
              <Label>Seconds</Label>
            </TimeSection>
          </TimerDigits>
        </>
      )}
    </TimerContainer>
  );
};

export default TimerComponent; 
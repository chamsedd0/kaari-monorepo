import React, { useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { PurpleButtonMB48 } from '../buttons/purple_MB48';
import { BpurpleButtonMB48 } from '../buttons/border_purple_MB48';
import { DEFAULT_TIME_SLOTS } from '../../../config/constants';

interface ReschedulePhotoshootModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newDate: Date, newTimeSlot: string) => void;
  photoshootLocation: string;
  currentDate: Date | string;
  currentTimeSlot: string;
}

const ReschedulePhotoshootModal: React.FC<ReschedulePhotoshootModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  photoshootLocation,
  currentDate,
  currentTimeSlot,
}) => {
  // Convert to Date object if string
  const initialDate = new Date(currentDate);
  
  // Format date for input field YYYY-MM-DD
  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [date, setDate] = useState(formatDateForInput(initialDate));
  const [timeSlot, setTimeSlot] = useState(currentTimeSlot);
  const [error, setError] = useState('');
  
  // Use the default time slots from constants
  const timeSlots = DEFAULT_TIME_SLOTS;
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    if (!date) {
      setError('Please select a date');
      return;
    }
    
    if (!timeSlot) {
      setError('Please select a time slot');
      return;
    }
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError('Please select a date in the future');
      return;
    }
    
    onConfirm(selectedDate, timeSlot);
  };
  
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <h3>Reschedule Photoshoot</h3>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <ModalContent>
          <p className="info">
            You're rescheduling the photoshoot at <strong>{photoshootLocation}</strong>.
          </p>
          
          <div className="current-info">
            <h4>Current Schedule</h4>
            <p>
              Date: {initialDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              <br />
              Time: {currentTimeSlot}
            </p>
          </div>
          
          <div className="reschedule-section">
            <h4>New Schedule</h4>
            
            <div className="form-group">
              <label htmlFor="photoshootDate">Select a new date:</label>
              <input
                type="date"
                id="photoshootDate"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setError('');
                }}
                min={formatDateForInput(new Date())}
                className={error && !date ? 'error' : ''}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="timeSlot">Select a new time slot:</label>
              <select
                id="timeSlot"
                value={timeSlot}
                onChange={(e) => {
                  setTimeSlot(e.target.value);
                  setError('');
                }}
                className={error && !timeSlot ? 'error' : ''}
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            
            {error && <p className="error-message">{error}</p>}
          </div>
        </ModalContent>
        
        <ModalFooter>
          <div className="button-container">
            <BpurpleButtonMB48 
              text="Cancel" 
              onClick={onClose}
            />
            <PurpleButtonMB48 
              text="Confirm Reschedule" 
              onClick={handleSubmit}
            />
          </div>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: ${Theme.borders.radius.lg};
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${Theme.colors.lightGray};
  
  h3 {
    font: ${Theme.typography.fonts.largeB};
    color: ${Theme.colors.primary};
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${Theme.colors.gray2};
  
  &:hover {
    color: ${Theme.colors.primary};
  }
`;

const ModalContent = styled.div`
  padding: 20px;
  
  p.info {
    margin-bottom: 20px;
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.black};
    line-height: 1.5;
  }
  
  .current-info, .reschedule-section {
    margin-bottom: 24px;
    
    h4 {
      font: ${Theme.typography.fonts.mediumB};
      color: ${Theme.colors.primary};
      margin: 0 0 10px 0;
    }
    
    p {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.black};
      line-height: 1.5;
      margin: 0;
    }
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
    
    label {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.black};
      margin-bottom: 8px;
    }
    
    input, select {
      padding: 12px;
      border: 1px solid ${Theme.colors.lightGray};
      border-radius: 8px;
      font: ${Theme.typography.fonts.mediumM};
      
      &.error {
        border-color: ${Theme.colors.danger};
      }
      
      &:focus {
        outline: none;
        border-color: ${Theme.colors.primary};
      }
    }
  }
  
  .error-message {
    color: ${Theme.colors.danger};
    font: ${Theme.typography.fonts.smallM};
    margin: 5px 0 0;
  }
`;

const ModalFooter = styled.div`
  padding: 20px;
  border-top: 1px solid ${Theme.colors.lightGray};
  
  .button-container {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    
    button {
      min-width: 120px;
    }
  }
`;

export default ReschedulePhotoshootModal; 
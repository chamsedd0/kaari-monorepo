import React from 'react';
import { CardBaseModelStyleUnassignedPhotoshoot } from '../../styles/cards/card-base-model-style-unassiged-photoshoot';
import { BpurpleButtonMB48 } from '../buttons/border_purple_MB48';
import { PurpleButtonMB48 } from '../buttons/purple_MB48';
import cancel from '../icons/Cross-Icon.svg';
import { FaCamera } from 'react-icons/fa';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

interface UnassignedPhotoshootProps {
  date: string;
  time: string;
  photographerName: string;
  photographerInfo: string;
  photographerImage: string;
  location: string;
  number: number;
}

const StatusCardWrapper = styled.div`
  background-color: #FFFAF5;
  border: 1px dashed ${Theme.colors.primary}40;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
  
  .camera-icon-container {
    background-color: #FFF1E0;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    border: 1px dashed ${Theme.colors.primary}30;
  }
  
  .camera-icon {
    color: ${Theme.colors.primary};
    font-size: 32px;
  }
  
  .status-title {
    font: ${Theme.typography.fonts.largeB};
    color: #4A4A4A;
    margin-bottom: 8px;
  }
  
  .status-text {
    font: ${Theme.typography.fonts.mediumM};
    color: #6A6A6A;
    margin-bottom: 16px;
    max-width: 260px;
  }
  
  .in-progress-container {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${Theme.colors.primary};
    font: ${Theme.typography.fonts.mediumB};
  }
  
  .progress-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${Theme.colors.primary};
  }
`;

const UnassignedPhotoshoot: React.FC<UnassignedPhotoshootProps> = ({
  date,
  time,
  photographerInfo,
  photographerImage,
  location,
  number
}) => {
  return (
    <CardBaseModelStyleUnassignedPhotoshoot>
      <div className="first-container">
        <div className="title-container">
          <div className="circle-number">{number}</div>
          <h3 className="title">Upcoming Photoshoot</h3>
        </div>
        <p className="info-text">{location}</p>
      </div>
      
      <StatusCardWrapper>
        <div className="camera-icon-container">
          <FaCamera className="camera-icon" />
        </div>
        <h3 className="status-title">Awaiting Assignment</h3>
        <p className="status-text">
          A professional photographer will be assigned to your session within 24 hours
        </p>
        <div className="in-progress-container">
          <div className="progress-dot"></div>
          <span>In progress</span>
        </div>
      </StatusCardWrapper>
      
      <div className="middle-container">
        <div className="right-container">
          <span className="date">{date}</span>
          <span className="time">{time}</span>
        </div>
      </div>
      
      <div className="bottom-container">
        <BpurpleButtonMB48 
          text="Cancel Photoshoot" 
          icon={<img src={cancel} alt="cancel" />} 
        />
        <BpurpleButtonMB48 text="Reschedule"/>
        <PurpleButtonMB48 text="Download Summary"/>
      </div>
    </CardBaseModelStyleUnassignedPhotoshoot>
  );
};

export default UnassignedPhotoshoot;

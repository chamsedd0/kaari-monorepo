import React, { ReactNode } from 'react';
import { CardBaseModelStyleUpcomingPhotoshoot } from '../../styles/cards/card-base-model-style-upcoming-photoshoot';
import { BpurpleButtonMB48 } from '../buttons/border_purple_MB48';
import {PurpleButtonMB48} from '../buttons/purple_MB48'
import cancel from '../icons/Cross-Icon.svg'
import upload from '../icons/Icon_Download.svg'

interface UpcomingPhotoshootProps {
  date: string;
  time: string;
  description: string;
  photographerImage: string | ReactNode;
  location: string;
  number?: number;
}

const UpcomingPhotoshoot: React.FC<UpcomingPhotoshootProps> = ({
  date,
  time,
  description,
  photographerImage,
  location,
  number
}) => {
  return (
    <CardBaseModelStyleUpcomingPhotoshoot>
      <div className="first-container">
        <div className="title-container">
          <div className="circle-number">{number}</div>
          <h3 className="title">Upcoming Photoshoot</h3>
        </div>
        <p className="info-text">{location}</p>
      </div>
      
      <div className="middle-container">
        <div className="left-container">
          {typeof photographerImage === 'string' ? (
            <img src={photographerImage} alt="Photographer" style={{ width: '56px', height: '56px' }} />
          ) : (
            <div style={{ width: '56px', height: '56px' }}>{photographerImage}</div>
          )}
          <div className="personal-info-container">
            <span className="description2">{description}</span>
          </div>
        </div>
        <div className="right-container">
          <span className="date">{date}</span>
          <span className="time">{time}</span>
        </div>
      </div>
      
      <div className="bottom-container">
        <div className="button-container">
      <PurpleButtonMB48 text= "Reschedule"/>
        <BpurpleButtonMB48 
          text="Cancel Photoshoot" 
          icon={<img src={cancel} alt="cancel" />} 
        />
        </div>
        <div className="upload-Icon">
          <img src={upload} alt="upload" />
        </div>
      </div>
    </CardBaseModelStyleUpcomingPhotoshoot>
  );
};

export default UpcomingPhotoshoot;

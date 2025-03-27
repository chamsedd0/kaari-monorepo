import React from 'react';
import { CardBaseModelStyleUpcomingPhotoshoot } from '../../styles/cards/card-base-model-style-upcoming-photoshoot';
import { WhatsappButton } from '../buttons/whatsapp-button';
import { BpurpleButtonMB48 } from '../buttons/border_purple_MB48';
import {PurpleButtonMB48} from '../buttons/purple_MB48'
import cancel from '../icons/Cross-Icon.svg'

interface UpcomingPhotoshootProps {
  date: string;
  time: string;
  photographerName: string;
  photographerInfo: string;
  photographerImage: string;
  location: string;
  number: number;
}

const UpcomingPhotoshoot: React.FC<UpcomingPhotoshootProps> = ({
  date,
  time,
  photographerName,
  photographerInfo,
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
          <img src={photographerImage} alt="Photographer" />
          <div className="personal-info-container">
            <span className="name">{photographerName}</span>
            <span className="info">{photographerInfo}</span>
            <WhatsappButton 
              text="Contact via WhatsApp" 
                icon={'whatsapp'}
            />
          </div>
        </div>
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
        <BpurpleButtonMB48 text= "Reschedule"/>
        <PurpleButtonMB48 text= "Download Summary"/>
      </div>
    </CardBaseModelStyleUpcomingPhotoshoot>
  );
};

export default UpcomingPhotoshoot;

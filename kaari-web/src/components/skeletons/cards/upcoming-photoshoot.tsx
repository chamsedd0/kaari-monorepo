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
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.6 2.4C12.1333 0.933333 10.2 0.133333 8.13333 0.133333C3.86667 0.133333 0.4 3.6 0.4 7.86667C0.4 9.26667 0.8 10.6 1.53333 11.7333L0.333333 15.7333L4.4 14.5333C5.53333 15.2 6.8 15.5333 8.13333 15.5333C12.4 15.5333 15.8667 12.0667 15.8667 7.8C15.8667 5.73333 15.0667 3.86667 13.6 2.4ZM8.13333 14.2C6.93333 14.2 5.8 13.8667 4.8 13.2667L4.53333 13.1333L2.13333 13.8667L2.86667 11.5333L2.73333 11.2667C2.06667 10.2 1.73333 9.06667 1.73333 7.86667C1.73333 4.33333 4.6 1.46667 8.13333 1.46667C9.86667 1.46667 11.4667 2.13333 12.6667 3.33333C13.8667 4.53333 14.5333 6.13333 14.5333 7.86667C14.5333 11.4 11.6667 14.2 8.13333 14.2ZM11.6667 9.53333C11.4667 9.4 10.4667 8.93333 10.3333 8.86667C10.1333 8.8 10 8.73333 9.86667 8.93333C9.73333 9.13333 9.33333 9.6 9.2 9.73333C9.06667 9.86667 8.93333 9.86667 8.73333 9.73333C7.73333 9.26667 7.06667 8.86667 6.4 7.73333C6.2 7.4 6.6 7.46667 6.93333 6.8C7 6.66667 6.93333 6.53333 6.86667 6.4C6.8 6.26667 6.4 5.26667 6.2 4.86667C6 4.46667 5.8 4.53333 5.66667 4.53333C5.53333 4.53333 5.4 4.53333 5.26667 4.53333C5.13333 4.53333 4.93333 4.6 4.73333 4.8C4.6 5 4.06667 5.46667 4.06667 6.46667C4.06667 7.46667 4.8 8.4 4.93333 8.53333C5.06667 8.66667 6.4 10.6667 8.4 11.5333C9.66667 12.0667 10.1333 12.1333 10.7333 12.0667C11.0667 12 11.8667 11.6 12.0667 11.1333C12.2667 10.6667 12.2667 10.2667 12.2 10.1333C12.1333 10 12 10 11.6667 9.53333Z" fill="#25D366"/>
              </svg>}
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

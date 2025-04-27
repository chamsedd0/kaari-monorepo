import React from 'react';
import { CardBaseModelStyleUpcomingPhotoshoot } from '../../styles/cards/card-base-model-style-upcoming-photoshoot';
import { WhatsappButton } from '../buttons/whatsapp-button';
import { BpurpleButtonMB48 } from '../buttons/border_purple_MB48';
import {PurpleButtonMB48} from '../buttons/purple_MB48'
import cancel from '../icons/Cross-Icon.svg'
import upload from '../icons/icon_download.svg'
import { useTranslation } from 'react-i18next';


interface UpcomingPhotoshootProps {
  date: string;
  time: string;
  photographerName: string;
  photographerInfo: string;
  photographerImage: string;
  location: string;
  number?: number;
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
  const { t } = useTranslation();

  return (
    <CardBaseModelStyleUpcomingPhotoshoot>
      <div className="first-container">
        <div className="title-container">
          <div className="circle-number">{number}</div>
          <h3 className="title">{t('advertiser_dashboard.photoshoot.upcoming_title', 'Upcoming Photoshoot')}</h3>
        </div>
        <p className="info-text">{location}</p>
      </div>
      
      <div className="middle-container">
        <div className="left-container">
          <img src={photographerImage} alt={t('advertiser_dashboard.photoshoot.photographer_alt', 'Photographer')} />
          <div className="personal-info-container">
            <span className="name">{photographerName}</span>
            <span className="info">{photographerInfo}</span>
            <WhatsappButton 
              text={t('advertiser_dashboard.photoshoot.contact_whatsapp', 'Contact via WhatsApp')} 
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
        <div className="button-container">
      <PurpleButtonMB48 text={t('advertiser_dashboard.photoshoot.reschedule', 'Reschedule')}/>
        <BpurpleButtonMB48 
          text={t('advertiser_dashboard.photoshoot.cancel', 'Cancel Photoshoot')} 
          icon={<img src={cancel} alt={t('common.cancel_icon_alt', 'cancel')} />} 
        />
        </div>
        <div className="upload-Icon">
          <img src={upload} alt={t('common.upload_icon_alt', 'upload')} />
        </div>
      </div>
    </CardBaseModelStyleUpcomingPhotoshoot>
  );
};

export default UpcomingPhotoshoot;

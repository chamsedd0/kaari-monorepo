import React from 'react';
import { ContactAdvisorCardStyle } from '../../styles/cards/card-base-model-style-contact-advisor-card';
import { PurpleButtonMB48 } from '../buttons/purple_MB48';
import { CertificationBanner } from '../banners/static/certification-banner';
import icon from '../icons/icon_messages.svg';

interface ContactAdvisorCardProps {
  advisorName: string;
  advisorImage: string;
}

const ContactAdvisorCard: React.FC<ContactAdvisorCardProps> = ({
  advisorName,
  advisorImage
}) => {
  return (
    <ContactAdvisorCardStyle>
      <div className="title-container">
        <div className="title">Contact Your Advertiser</div>
        <img src={icon} alt="icon" />
      </div>
      
      <div className="description-container">
        <div className="important-text">Important!</div>
        <div className="description">Contacting the advertiser will be considered as confirmation of your reservation. The payment will be processed after your confirmation.</div>
      </div>
      
      <div className="bottom-container">
        <div className="left-container">
          <img src={advisorImage} alt={`${advisorName} profile`} />
          <div className="text-container">
            <div className="name">{advisorName}</div>
            <div className="experience-container">
              <CertificationBanner text="Experienced host" purple={true} />
            </div>
          </div>
        </div>
        
        <div className="button-container">
          <PurpleButtonMB48 text="Contact" />
        </div>
      </div>
    </ContactAdvisorCardStyle>
  );
};

export default ContactAdvisorCard;

import React from 'react';
import { PhotoshootsPageStyle } from './styles';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import NeedHelpCardComponent from '../../../../components/skeletons/cards/need-help-card';
import PreparePropertyComponent from '../../../../components/skeletons/cards/prepare-your-property';
import UpcomingPhotoshoot from '../../../../components/skeletons/cards/upcoming-photoshoot';
import UpcomingPhotoshoot2 from '../../../../components/skeletons/cards/upcoming-photoshoot2';
import profile from '../../../../assets/images/HeroImage.png' 
import SpinningLoading from '../../../../components/skeletons/icons/SpinningLoading';
import { useNavigate } from 'react-router-dom';

const PhotoshootPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBookPhotoshoot = () => {
    navigate('/photoshoot-booking');
  };
  
  return (
    <PhotoshootsPageStyle>
      <div className="left">
        <div className="section-title-container">
          <h2 className="section-title">Book a Photoshoot</h2>
          <div className="button-container">
            <PurpleButtonMB48 
              text="Book a free Photoshoot" 
              onClick={handleBookPhotoshoot}
            />
          </div>
        </div>
        <UpcomingPhotoshoot 
          number={1}  
          date="20/09/2024 6:00 PM"
          time="01:15:44:23"
          photographerName="Derek Xavier "
          photographerInfo="Kaari Photography Agent "
          photographerImage={profile}
          location="123 Main Street, Apartment 4B"
        />
         <UpcomingPhotoshoot2 
          number={2}  
          date="20/09/2024 6:00 PM"
          time="01:15:44:23"
          description="An agent is being assigned to your photoshoot. Please wait a moment."
          photographerImage={<SpinningLoading />}
          location="123 Main Street, Apartment 4B"
        />
        <div className="history-container">
          <h3 className="history-title">History of photoshoots</h3>
          <div className="history-item-container">
          <div className="history-item">
            <span className="location">Location</span>
            <span className="date-time">20/09/2024</span>
            <span className="date-time">6:00 PM</span>
          </div>
          <div className="history-item">
            <span className="location">Location</span>
            <span className="date-time">20/09/2024</span>
            <span className="date-time">6:00 PM</span>
          </div>
          
            <div className="history-item">
              <span className="location">Location</span>
              <span className="date-time">20/09/2024</span>
            <span className="date-time">6:00 PM</span>
          </div>
          </div>
        </div>
       
      </div>
      <div className="right">
      <PreparePropertyComponent />
        <NeedHelpCardComponent />
        
      </div>
      
    </PhotoshootsPageStyle>
  );
};

export default PhotoshootPage;

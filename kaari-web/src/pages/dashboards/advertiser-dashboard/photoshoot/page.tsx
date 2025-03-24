import React from 'react';
import { PhotoshootsPageStyle } from './styles';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import NeedHelpCardComponent from '../../../../components/skeletons/cards/need-help-card';
import PreparePropertyComponent from '../../../../components/skeletons/cards/prepare-your-property';

const PhotoshootPage: React.FC = () => {
  return (
    <PhotoshootsPageStyle>
      <div className="left">
        <div className="section-title-container">
          <h2 className="section-title">Book a Photoshoot</h2>
          <div className="button-container">
            <PurpleButtonMB48 text="Book a free Photoshoot" />
          </div>
        </div>
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

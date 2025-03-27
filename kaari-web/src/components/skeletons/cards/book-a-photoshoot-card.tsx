import React from 'react';
import { BookAPhotoshootCard } from '../../styles/cards/card-base-model-style-book-a-photoshoot';
import { PurpleButtonMB48 } from '../buttons/purple_MB48';
import cameraIcon from '../../../assets/icons/camera-girl.svg';

interface BookAPhotoshootCardProps {
  hostText?: string;
  infoText?: string;
  buttonText?: string;

  onClick?: () => void;
}

const BookAPhotoshootComponent: React.FC<BookAPhotoshootCardProps> = ({
  hostText = "Host your property",
  infoText = " Book a photoshoot right now and start hosting with Kaari!",
  buttonText = "Book a Photoshoot",
  onClick
}) => {
  return (
    <BookAPhotoshootCard>
      <div className="text-picture-container">
        <div className="text-container">
          <span className="host-text">{hostText}</span>
          <span className="book-a-photoshoot-text">Book a Photoshoot!</span>
          <span className="info-text">{infoText}</span>
        </div>
        <div className="picture-container">
          <img src={cameraIcon} alt="Camera" />
        </div>
      </div>
      <PurpleButtonMB48 text={buttonText} onClick={onClick} />
    </BookAPhotoshootCard>
  );
};

export default BookAPhotoshootComponent;

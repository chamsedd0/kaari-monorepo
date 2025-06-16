import React from 'react';
import { BookAPhotoshootCard } from '../../styles/cards/card-base-model-style-book-a-photoshoot';
import { PurpleButtonMB48 } from '../buttons/purple_MB48';
import cameraIcon from '../../../assets/icons/camera-girl.svg';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface BookAPhotoshootCardProps {
  onBookPhotoshoot?: () => void;
  onClick?: () => void; // For backward compatibility
}

const BookAPhotoshootComponent: React.FC<BookAPhotoshootCardProps> = ({
  onBookPhotoshoot,
  onClick
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onBookPhotoshoot) {
      onBookPhotoshoot();
    } else if (onClick) {
      onClick();
    } else {
      navigate('/photoshoot-booking');
    }
  };

  return (
    <BookAPhotoshootCard>
      <div className="text-picture-container">
        <div className="text-container">
          <span className="host-text">{t('advertiser_dashboard.photoshoot.host_property', 'Host your property')}</span>
          <span className="book-a-photoshoot-text">{t('advertiser_dashboard.photoshoot.book_exclamation', 'Book a Photoshoot!')}</span>
          <span className="info-text">{t('advertiser_dashboard.photoshoot.book_info', 'Book a photoshoot right now and start hosting with Kaari!')}</span>
        </div>
        <div className="picture-container">
          <img src={cameraIcon} alt={t('advertiser_dashboard.photoshoot.camera_alt', 'Camera')} />
        </div>
      </div>
      <PurpleButtonMB48 text={t('advertiser_dashboard.photoshoot.book_button', 'Book a Photoshoot')} onClick={handleClick} />
    </BookAPhotoshootCard>
  );
};

export default BookAPhotoshootComponent;

import React from 'react';
import { ApplicationTrackingCard } from '../../styles/cards/card-base-model-style-Application-Tracking';

interface ApplicationTrackingCardProps {
  title: string;
  description: string;
  imageSrc: string;
  onClick?: () => void;
}

const ApplicationTrackingCardComponent: React.FC<ApplicationTrackingCardProps> = ({
  title,
  description,
  imageSrc,
  onClick
}) => {
  return (
    <ApplicationTrackingCard onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {imageSrc && (
        <div className="image-container">
          <img src={imageSrc} alt={title} />
        </div>
      )}
        <h3 className="title-text">{title}</h3>
        <p className="description-text">{description}</p>
    </ApplicationTrackingCard>
  );
};

export default ApplicationTrackingCardComponent;


import React from 'react';
import { NotificationCard } from '../../styles/cards/card-base-model-style-notification';

interface NotificationCardProps {
  isNew?: boolean;
  title: string;
  date: string;
  message: string;
  onClick?: () => void;
}

const NotificationCardComponent: React.FC<NotificationCardProps> = ({
  isNew = false,
  title,
  date,
  message,
  onClick
}) => {
  return (
    <NotificationCard onClick={onClick}>
      <div className="card-content">
        <div className="top-content">
          <div className="left-content">
            {isNew && <div className="new-container">NEW</div>}
            <div className="notification-title">{title}</div>
          </div>
          <div className="date">{date}</div>
        </div>
        <div className="info-text">
          {message}
        </div>
      </div>
    </NotificationCard>
  );
};

export default NotificationCardComponent;

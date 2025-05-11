import { MessageBannerBaseModelStyle } from "../../../styles/banners/messages/message-banner-base-model-style";
import React from "react";

interface MessageBannerProps {
  profileImage: string;
  name: string;
  message: string;
  time: string;
  unreadCount?: number;
  isActive?: boolean;
}

export const MessageBanner: React.FC<MessageBannerProps> = ({
  profileImage,
  name,
  message,
  time,
  unreadCount = 0,
  isActive = false
}) => {
  return (
    <MessageBannerBaseModelStyle unread={unreadCount} className={isActive ? 'active' : ''}>
      <div className="banner">
        <img className="profile-image" src={profileImage} alt={name} />
        <div className="content">
          <div className="top-row">
            <div className="name">{name}</div>
            <div className="time">{time}</div>
          </div>
          <div className="bottom-row">
            <div className="message">{message}</div>
            {unreadCount > 0 && (
              <div className="unread-indicator">
                {unreadCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </MessageBannerBaseModelStyle>
  );
};

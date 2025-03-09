import { MessageBannerBaseModelStyle } from "../../../styles/banners/messages/message-banner-base-model-style";

export const MessageBanner = ({
  profileImage,
  name,
  time,
  message,
  unreadCount,
}: {
  profileImage: string;
  name: string;
  time: string;
  message: string;
  unreadCount: number;
}) => {
  return (
    <MessageBannerBaseModelStyle>
      <div className="content">
        <img src={profileImage} alt={name} />
        <div className="text">
          <div className="name">
            {name} <span>{time}</span>
          </div>
          <div className="message">{message}</div>
        </div>
      </div>
      <div className="counter">
        <span>{unreadCount}</span>
      </div>
    </MessageBannerBaseModelStyle>
  );
};

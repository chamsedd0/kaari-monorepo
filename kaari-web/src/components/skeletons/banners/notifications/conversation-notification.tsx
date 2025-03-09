import { NotificationBaseModelStyleConversation } from "../../../styles/banners/notifications/notification-base-model-style-conversation";
import closeIcon from "../../icons/Cross-Icon.svg";

export const ConversationNotification = ({
  profileImage,
  name,
  message,
}: {
  profileImage: string;
  name: string;
  message: string;
}) => {
  return (
    <NotificationBaseModelStyleConversation>
      <div className="content">
        <img className="close-button" src={closeIcon} alt="close" />
        <img src={profileImage} alt={name} />
        <div className="text">
          <div className="name">{name}</div>
          <div className="message">{message}</div>
        </div>
        <div className="actions">
          <button>Details</button>
        </div>
      </div>
    </NotificationBaseModelStyleConversation>
  );
};

import { MessageBubbleBaseModelStyle } from "../../../styles/banners/messages/message-bubble-base-model-style";
import checkIcon from '../../icons/Check-Icon.svg'
import deleteIcon from '../../icons/Delete-Icon.svg'
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

interface MessageBubbleProps {
  variant: "primary" | "secondary";
  message: string;
  timestamp: string;
  isRead?: boolean;
  isTyping?: boolean;
  onDelete?: () => void;
  attachment?: {
    type: "image" | "file";
    url: string;
    name?: string;
    size?: number;
  };
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  variant, 
  message, 
  timestamp,
  isRead,
  isTyping,
  onDelete,
  attachment
}) => {
  const { t } = useTranslation();
  const [showReadStatus, setShowReadStatus] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Show read status with an animation effect
  useEffect(() => {
    if (isRead !== undefined) {
      const timer = setTimeout(() => {
        setShowReadStatus(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isRead]);

  // Format file size to readable format
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  };
  
  // Display the typing indicator if isTyping is true, otherwise show the regular message
  if (isTyping) {
    return (
      <MessageBubbleBaseModelStyle variant={variant}>
        <div className="text">
          {t('messages.typing')}
        </div>
        <div className="typing-indicator">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </MessageBubbleBaseModelStyle>
    );
  }
  
  return (
    <MessageBubbleBaseModelStyle variant={variant}>
      {onDelete && (
        <button 
          className="message-delete-button" 
          onClick={onDelete}
          title={t('messages.delete_message')}
        >
          <img src={deleteIcon} alt={t('messages.delete_message')} />
        </button>
      )}
      
      {attachment && attachment.type === "image" && (
        <div className="image-attachment">
          <div className={`image-wrapper ${imageLoaded ? 'loaded' : 'loading'}`}>
            {!imageLoaded && <div className="loader"></div>}
            <img 
              src={attachment.url} 
              alt={attachment.name || "Image attachment"} 
              onLoad={() => setImageLoaded(true)}
              onClick={() => window.open(attachment.url, '_blank')}
            />
          </div>
        </div>
      )}
      
      {attachment && attachment.type === "file" && (
        <div className="file-attachment">
          <div className="file-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill={variant === "primary" ? "#E2E2E2" : "rgba(255, 255, 255, 0.2)"}/>
              <path d="M14 2V8H20L14 2Z" fill={variant === "primary" ? "#CCCCCC" : "rgba(255, 255, 255, 0.1)"}/>
            </svg>
          </div>
          <div className="file-info">
            <div className="file-name">{attachment.name || "File"}</div>
            <div className="file-size">{formatFileSize(attachment.size)}</div>
          </div>
          <a href={attachment.url} download className="download-button" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9H15V3H9V9H5L12 16L19 9ZM5 18V20H19V18H5Z" fill={variant === "primary" ? "#0057FF" : "white"}/>
            </svg>
          </a>
        </div>
      )}
      
      {message && (
        <div className="text">
          {message}
        </div>
      )}
      
      <div className="timestamp">  
        {variant === "secondary" && isRead !== undefined && (
          <span 
            className={`read-status ${isRead ? 'read' : 'not-read'} ${showReadStatus ? 'visible' : ''}`} 
            title={isRead ? t('messages.read') : t('messages.delivered')}
          >
            <img src={checkIcon} alt={isRead ? t('messages.read') : t('messages.delivered')} />
          </span>
        )}
        {timestamp}
      </div>
    </MessageBubbleBaseModelStyle>
  );
};

export default MessageBubble;
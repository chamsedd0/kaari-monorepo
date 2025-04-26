import React, { useState } from 'react';
import { MessagesPageStyle } from './styles';
import { MessageBanner } from '../../../../components/skeletons/banners/messages/message-banner';
import EditIcon from '../../../../components/skeletons/icons/New-Chat-Icon.svg';
import DeleteIcon from '../../../../components/skeletons/icons/blackDots.svg';
import profileImage from '../../../../assets/images/ProfilePicture.png';
import { ConversationHeader } from '../../../../components/skeletons/banners/static/conversation-header';
import MessageField from '../../../../components/skeletons/inputs/input-fields/message-field';
import MessageBubble from '../../../../components/skeletons/banners/messages/message-bubble';
import ArrowLeft from '../../../../components/skeletons/icons/ArrowRightThickPrimary.svg';
import { useTranslation } from 'react-i18next';



interface MessageHeaderProps {
  onTogglePanel: () => void;
  isPanelCollapsed: boolean;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ onTogglePanel, isPanelCollapsed }) => {
  const { t } = useTranslation();
  
  return (
    <div className="conversation-header-wrapper">
      <button 
        className={`toggle-panel-button ${isPanelCollapsed ? 'collapsed' : ''}`}
        onClick={onTogglePanel}
        aria-label={isPanelCollapsed ? t('messages.expand_conversations') : t('messages.collapse_conversations')}
      >
        <img src={ArrowLeft} alt={t('messages.toggle_panel')} />
      </button>
      <ConversationHeader senderName={'John Price'} senderPic={profileImage} lastOnline={'Today'} />
    </div>
  );
};

const MessageInput = () => {
  const [message, setMessage] = useState<string>('');
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  
  return <MessageField value={message} onChange={handleMessageChange} />;
};
const ConversationBanner = () => <MessageBanner profileImage={profileImage} name={'John Price'} time={'Today'} message={'Hi! Nice to meet you! You can ask me anything...'} unreadCount={3} />;

const MessagesPage: React.FC = () => {
  const [activeConversation, setActiveConversation] = useState<number | null>(0);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(false);
  const { t } = useTranslation();

  // Mock data - replace with your actual data
  const conversations = [
    { id: 0, name: 'John Price', lastMessage: 'Hi! Nice to meet you! You can ask me anything...', time: 'Today', isUnread: true },
    { id: 1, name: 'Leonardo Vincent', lastMessage: 'Hello there!', time: '14.07.2024', isUnread: false },
    { id: 2, name: 'Steve Johnson', lastMessage: 'Hello there!', time: '14.07.2024', isUnread: false }
  ];

  const messages = [
    { id: 0, senderId: 0, text: 'Hello there! I want to ask a few questions about your stay', time: '10:45', isRead: true },
    { id: 1, senderId: 1, text: 'Hi! Nice to meet you! You can ask me anything anytime. I will try and respond as soon as possible. If I do not reply, call me on 070 123 45 67', time: '10:45', isRead: true },
    { id: 2, senderId: 0, text: 'Hello there! I want to ask a few questions about your stay', time: '10:45', isRead: true },
    { id: 3, senderId: 1, text: 'Hello there! I want to ask a few questions about your stay', time: '10:45', isRead: true }
  ];

  // Determine if message is from user (0) or other person (1)
  const isMessageFromMe = (senderId: number) => senderId === 1;

  const togglePanel = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  return (
    <MessagesPageStyle>
      <div className="messages-page-layout">
        <div className={`conversations-list ${isPanelCollapsed ? 'collapsed' : ''}`}>
          <div className="conversations-list-content">
            <div className="conversations-header">
              <h2>{t('messages.title')}</h2>
              <div className="actions">
                <div className="edit-button">
                  <img src={EditIcon} alt={t('messages.edit')} />
                </div>
                <div className="delete-button">
                  <img src={DeleteIcon} alt={t('messages.delete')} />
                </div>
              </div>
            </div>
            {conversations.map(conversation => (
              <div 
                key={conversation.id} 
                className={`conversation-item ${activeConversation === conversation.id ? 'active' : ''}`}
                onClick={() => setActiveConversation(conversation.id)}
              >
                <ConversationBanner />
              </div>
            ))}
          </div>
        </div>

        <div className="chat-area">
          <MessageHeader onTogglePanel={togglePanel} isPanelCollapsed={isPanelCollapsed} />
          
          <div className="chat-content">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message-container ${isMessageFromMe(message.senderId) ? 'receiver' : 'sender'}`}
              >
                {!isMessageFromMe(message.senderId) && (
                  <div className="avatar">
                    <img src={profileImage} alt={t('messages.profile')} />
                  </div>
                )}
                <div className="message-bubble">
                  <MessageBubble 
                    variant={isMessageFromMe(message.senderId) ? 'secondary' : 'primary'} 
                    message={message.text} 
                    timestamp={message.time} 
                  />
                </div>
                {isMessageFromMe(message.senderId) && (
                  <div className="avatar">
                    <img src={profileImage} alt={t('messages.profile')} />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <MessageInput />
        </div>
      </div>
    </MessagesPageStyle>
  );
};

export default MessagesPage;

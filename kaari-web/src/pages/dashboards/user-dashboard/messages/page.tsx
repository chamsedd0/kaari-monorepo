import React, { useState } from 'react';
import {
  MessagesPageLayout,
  ConversationsList,
  ConversationsHeader,
  ConversationsListContent,
  ConversationItem,
  ChatArea,
  ChatContent,
  MessageContainer
} from './styles';

// You'll replace these with your actual components
const MessageBubble = () => <div>Message Bubble Component</div>;
const MessageHeader = () => <div>Message Header Component</div>;
const MessageInput = () => <div>Message Input Component</div>;
const ConversationBanner = () => <div>Conversation Banner Component</div>;

const MessagesPage: React.FC = () => {
  const [activeConversation, setActiveConversation] = useState<number | null>(0);

  // Mock data - replace with your actual data
  const conversations = [
    { id: 0, name: 'John Price', lastMessage: 'Hi! Nice to meet you! You can ask me anything...', time: 'Today', isUnread: true },
    { id: 1, name: 'Leonardo Vincent', lastMessage: 'Hello there!', time: '14.07.2024', isUnread: false },
    { id: 2, name: 'Steve Johnson', lastMessage: 'Hello there!', time: '14.07.2024', isUnread: false }
  ];

  const messages = [
    { id: 0, senderId: 0, text: 'Hello there! I want to ask a few questions about your stay', time: '10:48', isRead: true },
    { id: 1, senderId: 'me', text: 'Hi! Nice to meet you! You can ask me anything anytime. I will try and respond as soon as possible. If I do not reply, call me', time: '10:48', isRead: true }
  ];

  return (
    <MessagesPageLayout>
      <ConversationsList>
        <ConversationsHeader>
          <h2>Messages</h2>
          <div className="actions">
            <button>✏️</button>
            <button>⋯</button>
          </div>
        </ConversationsHeader>
        <ConversationsListContent>
          {conversations.map(conversation => (
            <ConversationItem 
              key={conversation.id} 
              isActive={activeConversation === conversation.id}
              onClick={() => setActiveConversation(conversation.id)}
            >
              {/* Replace with your ConversationBanner component */}
              <ConversationBanner />
            </ConversationItem>
          ))}
        </ConversationsListContent>
      </ConversationsList>

      <ChatArea>
        {/* Replace with your MessageHeader component */}
        <MessageHeader />
        
        <ChatContent>
          {messages.map(message => (
            <MessageContainer 
              key={message.id} 
              isSender={message.senderId === 'me'}
            >
              {/* Replace with your MessageBubble component */}
              <MessageBubble />
            </MessageContainer>
          ))}
        </ChatContent>
        
        {/* Replace with your MessageInput component */}
        <MessageInput />
      </ChatArea>
    </MessagesPageLayout>
  );
};

export default MessagesPage;

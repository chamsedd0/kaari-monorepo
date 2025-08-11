import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { PageContainer, PageHeader, GlassCard } from '../../../../components/admin/AdminUI';
import { 
  getConversationById,
  getMessagesByConversationId,
  sendAdminMessage,
  Conversation,
  Message
} from '../../../../backend/server-actions/MessagesServerActions';

const ConversationContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px);
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
  overflow: hidden;
  background-color: white;
`;

const ConversationHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid ${Theme.colors.gray};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: ${Theme.colors.secondary};
  font: ${Theme.typography.fonts.smallB};
  cursor: pointer;
  padding: 0;
  margin-right: 15px;
  
  svg {
    margin-right: 5px;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ParticipantsInfo = styled.div`
  font: ${Theme.typography.fonts.smallB};
  color: ${Theme.colors.secondary};
`;

const BookingInfo = styled.div`
  font-size: 0.8rem;
  color: ${Theme.colors.primary};
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
`;

const MessageItem = styled.div<{ $isSelf: boolean }>`
  max-width: 70%;
  margin-bottom: 15px;
  align-self: ${props => props.$isSelf ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div<{ $isSelf: boolean; $isAdmin: boolean }>`
  padding: 10px 15px;
  border-radius: 18px;
  background-color: ${props => {
    if (props.$isAdmin) return '#e3f2fd';
    return props.$isSelf ? '#e3f2fd' : 'white';
  }};
  border: 1px solid ${props => {
    if (props.$isAdmin) return '#bbdefb';
    return props.$isSelf ? '#bbdefb' : '#e0e0e0';
  }};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
`;

const MessageContent = styled.div`
  font-size: 0.95rem;
  white-space: pre-wrap;
  word-break: break-word;
`;

const MessageInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 0.75rem;
  color: ${Theme.colors.gray2};
`;

const SenderName = styled.span<{ $isAdmin: boolean }>`
  font-weight: ${props => props.$isAdmin ? 'bold' : 'normal'};
  color: ${props => props.$isAdmin ? Theme.colors.primary : Theme.colors.gray2};
`;

const MessageTime = styled.span``;

const InputContainer = styled.div`
  display: flex;
  padding: 15px;
  border-top: 1px solid ${Theme.colors.gray};
`;

const MessageInput = styled.input`
  flex-grow: 1;
  padding: 10px 15px;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 20px;
  font: ${Theme.typography.fonts.smallM};
  
  &:focus {
    outline: none;
    border-color: ${Theme.colors.secondary};
  }
`;

const SendButton = styled.button<{ $disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-left: 10px;
  background-color: ${props => props.$disabled ? '#e0e0e0' : Theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 50%;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.$disabled ? '#e0e0e0' : Theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  text-align: center;
  color: ${Theme.colors.gray2};
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${Theme.colors.gray2};
`;

const DateSeparator = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  
  &::before, &::after {
    content: '';
    flex-grow: 1;
    height: 1px;
    background-color: ${Theme.colors.gray};
  }
`;

const DateLabel = styled.span`
  padding: 0 10px;
  font-size: 0.8rem;
  color: ${Theme.colors.gray2};
  background-color: #f9f9f9;
`;

const ConversationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load conversation and messages
  useEffect(() => {
    const loadConversation = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get conversation details
        const conversationData = await getConversationById(id);
        if (!conversationData) {
          setError('Conversation not found');
          return;
        }
        
        setConversation(conversationData);
        
        // Get messages
        const messagesData = await getMessagesByConversationId(id);
        setMessages(messagesData);
      } catch (err) {
        console.error('Error loading conversation:', err);
        setError('Failed to load conversation. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadConversation();
  }, [id]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Format message time
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date for separators
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };
  
  // Check if date is different from previous message
  const shouldShowDateSeparator = (index: number, currentDate: Date) => {
    if (index === 0) return true;
    
    const prevDate = messages[index - 1].timestamp;
    return currentDate.toDateString() !== prevDate.toDateString();
  };
  
  // Send message
  const handleSendMessage = async () => {
    if (!id || !newMessage.trim() || sending) return;
    
    try {
      setSending(true);
      await sendAdminMessage(id, newMessage);
      
      // Add message to UI immediately for better UX
      const newMsg: Message = {
        id: `temp-${Date.now()}`,
        conversationId: id,
        senderId: 'admin',
        senderName: 'Kaari Admin',
        senderRole: 'admin',
        content: newMessage,
        timestamp: new Date(),
        isRead: false
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage('');
      
      // Reload messages to get server-generated ID
      const updatedMessages = await getMessagesByConversationId(id);
      setMessages(updatedMessages);
    } catch (err) {
      console.error('Error sending message:', err);
      // Show error
    } finally {
      setSending(false);
    }
  };
  
  return (
    <PageContainer>
      <PageHeader title="Conversation" />
      <GlassCard>
        <ConversationContainer>
          {loading ? (
            <LoadingState>Loading conversation...</LoadingState>
          ) : error || !conversation ? (
            <EmptyState>
              <div>{error || 'Conversation not found'}</div>
              <BackButton onClick={() => navigate('/dashboard/admin/messages')}>
                <FaArrowLeft /> Back to Messages
              </BackButton>
            </EmptyState>
          ) : (
            <>
              <ConversationHeader>
                <BackButton onClick={() => navigate('/dashboard/admin/messages')}>
                  <FaArrowLeft /> Back
                </BackButton>
                <HeaderInfo>
                  <ParticipantsInfo>
                    {conversation.participants.tenant.name} (Tenant) ↔︎ {conversation.participants.advertiser.name} (Advertiser)
                  </ParticipantsInfo>
                  {conversation.linkedBooking && (
                    <BookingInfo>
                      {conversation.linkedBooking.id ? `Booking ID: ${conversation.linkedBooking.id}` : conversation.linkedBooking.propertyTitle}
                    </BookingInfo>
                  )}
                </HeaderInfo>
              </ConversationHeader>
              
              <MessagesContainer>
                {messages.length === 0 ? (
                  <EmptyState>
                    <div>No messages in this conversation yet.</div>
                  </EmptyState>
                ) : (
                  messages.map((message, index) => {
                    const isSelf = message.senderRole === 'admin';
                    const isAdmin = message.senderRole === 'admin';
                    const showDateSeparator = shouldShowDateSeparator(index, message.timestamp);
                    
                    return (
                      <React.Fragment key={message.id}>
                        {showDateSeparator && (
                          <DateSeparator>
                            <DateLabel>{formatDate(message.timestamp)}</DateLabel>
                          </DateSeparator>
                        )}
                        <MessageItem $isSelf={isSelf}>
                          <MessageBubble $isSelf={isSelf} $isAdmin={isAdmin}>
                            <MessageContent>{message.content}</MessageContent>
                          </MessageBubble>
                          <MessageInfo>
                            <SenderName $isAdmin={isAdmin}>{message.senderName}</SenderName>
                            <MessageTime>{formatMessageTime(message.timestamp)}</MessageTime>
                          </MessageInfo>
                        </MessageItem>
                      </React.Fragment>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </MessagesContainer>
              
              <InputContainer>
                <MessageInput 
                  type="text" 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <SendButton 
                  onClick={handleSendMessage} 
                  $disabled={!newMessage.trim() || sending}
                >
                  {sending ? '...' : <FaPaperPlane size={16} />}
                </SendButton>
              </InputContainer>
            </>
          )}
        </ConversationContainer>
      </GlassCard>
    </PageContainer>
  );
};

export default ConversationPage; 
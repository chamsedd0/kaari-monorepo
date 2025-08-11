import React, { useState, useEffect } from 'react';
import { FaSearch, FaComments } from 'react-icons/fa';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { PageContainer, PageHeader, FilterBar as GlassFilterBar, SearchBox as GlassSearchBox, GlassCard } from '../../../../components/admin/AdminUI';
import { useNavigate } from 'react-router-dom';
import { 
  getAllConversations,
  searchConversations,
  Conversation
} from '../../../../backend/server-actions/MessagesServerActions';


// Styled components
const MessagesContainer = styled.div`
  display: flex;
  height: calc(100vh - 240px);
  overflow: hidden;
`;

const ConversationsList = styled.div`
  width: 100%;
  background-color: transparent;
  overflow-y: auto;
`;

// Replaced with shared FilterBar + GlassSearchBox from AdminUI

const ConversationItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid ${Theme.colors.gray};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f3eefb;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ParticipantsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const Participants = styled.div`
  font: ${Theme.typography.fonts.smallB};
  color: ${Theme.colors.secondary};
`;

const TimeStamp = styled.div`
  font-size: 0.8rem;
  color: ${Theme.colors.gray2};
`;

const BookingInfo = styled.div`
  font-size: 0.8rem;
  color: ${Theme.colors.primary};
  margin-bottom: 5px;
`;

const MessagePreview = styled.div`
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  
  svg {
    font-size: 3rem;
    margin-bottom: 15px;
    color: ${Theme.colors.secondary};
    opacity: 0.5;
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${Theme.colors.gray2};
`;



const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const allConversations = await getAllConversations();
        setConversations(allConversations);
        setFilteredConversations(allConversations);
      } catch (err) {
        console.error('Error loading conversations:', err);
        setError('Failed to load conversations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadConversations();
  }, []);
  
  // Handle search
  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery.trim()) {
        setFilteredConversations(conversations);
        return;
      }
      
      try {
        setLoading(true);
        const results = await searchConversations(searchQuery);
        setFilteredConversations(results);
      } catch (err) {
        console.error('Error searching conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    
    handleSearch();
  }, [searchQuery, conversations]);
  
  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hr ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Open conversation detail
  const openConversation = (conversationId: string) => {
    navigate(`/dashboard/admin/messages/${conversationId}`);
  };
  
  return (
    <PageContainer>
      <PageHeader title="Messages" />
      <GlassCard>
        <MessagesContainer>
          <GlassFilterBar>
            <GlassSearchBox>
              <FaSearch />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </GlassSearchBox>
          </GlassFilterBar>
          <ConversationsList>
            
            {loading ? (
              <LoadingState>Loading conversations...</LoadingState>
            ) : error ? (
              <EmptyState>
                <div>{error}</div>
              </EmptyState>
            ) : filteredConversations.length === 0 ? (
              <EmptyState>
                <FaComments />
                <div>No conversations found</div>
                <div>When users start chatting, their conversations will appear here.</div>
              </EmptyState>
            ) : (
              filteredConversations.map(conversation => (
                <ConversationItem 
                  key={conversation.id}
                  onClick={() => openConversation(conversation.id)}
                >
                  <ParticipantsContainer>
                    <Participants>
                      {conversation.participants.tenant.name} (Tenant) ↔︎ {conversation.participants.advertiser.name} (Advertiser)
                    </Participants>
                    {conversation.lastMessage && (
                      <TimeStamp>
                        {formatRelativeTime(conversation.lastMessage.timestamp)}
                      </TimeStamp>
                    )}
                  </ParticipantsContainer>
                  
                  {conversation.linkedBooking && (
                    <BookingInfo>
                      {conversation.linkedBooking.id ? `Booking ID: ${conversation.linkedBooking.id}` : conversation.linkedBooking.propertyTitle}
                    </BookingInfo>
                  )}
                  
                  {conversation.lastMessage && (
                    <MessagePreview>
                      {conversation.lastMessage.content}
                    </MessagePreview>
                  )}
                </ConversationItem>
              ))
            )}
          </ConversationsList>
        </MessagesContainer>
      </GlassCard>
    </PageContainer>
  );
};

export default MessagesPage; 
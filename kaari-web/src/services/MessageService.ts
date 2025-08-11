import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from '../backend/firebase/config';
import { advertiserNotifications, userNotifications } from '../utils/notification-helpers';

// Define message interface
export interface Message {
  id?: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: Timestamp;
  isRead: boolean;
  attachments?: Array<{
    url: string;
    type: string;
    name: string;
  }>;
}

// Define conversation interface
export interface Conversation {
  id?: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTimestamp?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  unreadCounts?: Record<string, number>;
  metadata?: {
    propertyId?: string;
    reservationId?: string;
    advertiserId?: string;
    clientId?: string;
    propertyTitle?: string;
  };
}

// Define user type interface
export interface UserProfile {
  id: string;
  name: string;
  profilePicture?: string;
  userType: 'user' | 'advertiser' | 'admin';
}

class MessageService {
  private messagesCollection = 'messages';
  private conversationsCollection = 'conversations';
  private usersCollection = 'users';

  // Create a new conversation
  async createConversation(
    participantIds: string[],
    metadata?: Conversation['metadata']
  ): Promise<string> {
    try {
      if (participantIds.length < 2) {
        throw new Error('Conversation requires at least 2 participants');
      }
      
      // Check if conversation already exists
      const existingConversation = await this.findConversationByParticipants(participantIds);
      if (existingConversation) {
        return existingConversation.id!;
      }
      
      const now = Timestamp.now();
      const newConversation: Omit<Conversation, 'id'> = {
        participants: participantIds,
        createdAt: now,
        updatedAt: now,
        unreadCounts: participantIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {}),
        metadata
      };

      const docRef = await addDoc(collection(db, this.conversationsCollection), newConversation);
      return docRef.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  // Find conversation by participants
  async findConversationByParticipants(participantIds: string[]): Promise<Conversation | null> {
    try {
      // Sort IDs to ensure consistent queries
      const sortedParticipantIds = [...participantIds].sort();
      
      // We need to find a conversation that contains exactly these participants
      // First, we query for conversations that include the first participant
      const q = query(
        collection(db, this.conversationsCollection),
        where('participants', 'array-contains', sortedParticipantIds[0])
      );
      
      const querySnapshot = await getDocs(q);
      
      // Then we filter to find the conversation that has exactly these participants
      const conversations = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Conversation))
        .filter(conversation => {
          const participantsSet = new Set(conversation.participants);
          return (
            participantsSet.size === sortedParticipantIds.length &&
            sortedParticipantIds.every(id => participantsSet.has(id))
          );
        });
      
      return conversations.length > 0 ? conversations[0] : null;
    } catch (error) {
      console.error('Error finding conversation by participants:', error);
      throw error;
    }
  }

  // Send a message
  async sendMessage(
    conversationId: string,
    senderId: string,
    recipientId: string,
    text: string,
    attachments?: Message['attachments']
  ): Promise<string> {
    try {
      // Get conversation to verify participants
      const conversationRef = doc(db, this.conversationsCollection, conversationId);
      const conversationDoc = await getDoc(conversationRef);
      
      if (!conversationDoc.exists()) {
        throw new Error('Conversation not found');
      }
      
      const conversation = conversationDoc.data() as Conversation;
      
      if (!conversation.participants.includes(senderId) || 
          !conversation.participants.includes(recipientId)) {
        throw new Error('Invalid participants for this conversation');
      }
      
      // Create the message
      const newMessage: Omit<Message, 'id'> = {
        conversationId,
        senderId,
        recipientId,
        text,
        timestamp: Timestamp.now(),
        isRead: false,
        attachments
      };
      
      // Add message to database
      const docRef = await addDoc(collection(db, this.messagesCollection), newMessage);
      
      // Update conversation with last message info
      const batch = writeBatch(db);
      
      // Increment unread count for recipient
      const unreadCounts = conversation.unreadCounts || {};
      unreadCounts[recipientId] = (unreadCounts[recipientId] || 0) + 1;
      
      batch.update(conversationRef, {
        lastMessage: text,
        lastMessageTimestamp: newMessage.timestamp,
        updatedAt: newMessage.timestamp,
        unreadCounts
      });
      
      await batch.commit();
      
      // Send notification for new message
      await this.sendMessageNotification(senderId, recipientId, conversationId);
      
      return docRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Mark messages as read
  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      // Update unread count in conversation
      const conversationRef = doc(db, this.conversationsCollection, conversationId);
      const conversationDoc = await getDoc(conversationRef);
      
      if (!conversationDoc.exists()) {
        throw new Error('Conversation not found');
      }
      
      const conversation = conversationDoc.data() as Conversation;
      const unreadCounts = conversation.unreadCounts || {};
      
      // Reset unread count for this user
      unreadCounts[userId] = 0;
      
      await updateDoc(conversationRef, { unreadCounts });
      
      // Get unread messages for this user
      const q = query(
        collection(db, this.messagesCollection),
        where('conversationId', '==', conversationId),
        where('recipientId', '==', userId),
        where('isRead', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Batch update all messages
      if (!querySnapshot.empty) {
        const batch = writeBatch(db);
        
        querySnapshot.docs.forEach(messageDoc => {
          batch.update(messageDoc.ref, { isRead: true });
        });
        
        await batch.commit();
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  // Get messages for a conversation
  async getMessages(conversationId: string, limitCount = 50): Promise<Message[]> {
    try {
      const q = query(
        collection(db, this.messagesCollection),
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Message))
        .reverse(); // Reverse to get chronological order
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  // Get conversations for a user
  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const q = query(
        collection(db, this.conversationsCollection),
        where('participants', 'array-contains', userId),
         orderBy('lastMessageTimestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Conversation[];
    } catch (error) {
      console.error('Error getting user conversations:', error);
      throw error;
    }
  }

  // Get total unread message count for a user
  async getTotalUnreadCount(userId: string): Promise<number> {
    try {
      const conversations = await this.getUserConversations(userId);
      return conversations.reduce((total, conversation) => {
        const unreadCounts = conversation.unreadCounts || {};
        return total + (unreadCounts[userId] || 0);
      }, 0);
    } catch (error) {
      console.error('Error getting total unread count:', error);
      throw error;
    }
  }

  // Subscribe to conversation updates
  subscribeToConversation(
    conversationId: string,
    callback: (messages: Message[]) => void
  ): () => void {
    const q = query(
      collection(db, this.messagesCollection),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'asc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      callback(messages);
    }, error => {
      console.error('Error subscribing to conversation:', error);
    });
  }

  // Subscribe to user conversations updates
  subscribeToUserConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void
  ): () => void {
    const q = query(
      collection(db, this.conversationsCollection),
      where('participants', 'array-contains', userId),
       orderBy('lastMessageTimestamp', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const conversations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Conversation[];
      
      callback(conversations);
    }, error => {
      console.error('Error subscribing to user conversations:', error);
    });
  }

  // Get user profile data
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, this.usersCollection, userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          id: userId,
          name: userData.name || 'Unknown User',
          profilePicture: userData.profilePicture,
          userType: userData.userType || 'user'
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Helper method to send a notification for a new message
  private async sendMessageNotification(
    senderId: string,
    recipientId: string,
    conversationId: string
  ): Promise<void> {
    try {
      // Get sender profile to include their name in the notification
      const senderProfile = await this.getUserProfile(senderId);
      const recipientProfile = await this.getUserProfile(recipientId);
      
      if (!senderProfile || !recipientProfile) {
        console.error('Could not find user profiles for message notification');
        return;
      }
      
      // Get the actual user document to determine the correct role
      const recipientRef = doc(db, this.usersCollection, recipientId);
      const recipientDoc = await getDoc(recipientRef);
      
      if (!recipientDoc.exists()) {
        console.error('Recipient user document not found');
        return;
      }
      
      const recipientData = recipientDoc.data();
      const recipientRole = recipientData.role || 'client';
      
      console.log(`Sending message notification to ${recipientId} with role ${recipientRole}`);
      
      // Send notification based on recipient role
      if (recipientRole === 'advertiser') {
        await advertiserNotifications.newMessage(
          recipientId,
          senderId,
          senderProfile.name,
          conversationId
        );
      } else {
        await userNotifications.newMessage(
          recipientId,
          senderId,
          senderProfile.name,
          conversationId
        );
      }
    } catch (error) {
      console.error('Error sending message notification:', error);
      // Don't throw to prevent disrupting the main flow
    }
  }
}

export default new MessageService(); 
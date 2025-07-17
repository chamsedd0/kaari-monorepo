'use server';

import { 
  collection, 
  getDocs, 
  getDoc,
  doc,
  query, 
  where, 
  orderBy,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  limit,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Collection references
const CONVERSATIONS_COLLECTION = 'conversations';
const MESSAGES_COLLECTION = 'messages';
const USERS_COLLECTION = 'users';

// Message interface
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'tenant' | 'advertiser' | 'admin';
  content: string;
  timestamp: Date;
  isRead: boolean;
}

// Conversation interface
export interface Conversation {
  id: string;
  participants: {
    tenant: {
      id: string;
      name: string;
    };
    advertiser: {
      id: string;
      name: string;
    };
  };
  linkedBooking?: {
    id: string;
    propertyId: string;
    propertyTitle: string;
  };
  lastMessage?: {
    content: string;
    timestamp: Date;
    senderId: string;
    senderName: string;
    senderRole: 'tenant' | 'advertiser' | 'admin';
  };
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Process a conversation document and convert to Conversation
 */
async function processConversationDoc(docSnapshot: QueryDocumentSnapshot<DocumentData>): Promise<Conversation> {
  try {
    const data = docSnapshot.data();
    
    // Extract participant details from the document
    const participantDetails = data.participantDetails || {};
    
    // Get tenant and advertiser info
    let tenantId = '';
    let tenantName = 'Unknown Tenant';
    let advertiserId = '';
    let advertiserName = 'Unknown Advertiser';
    
    // Extract participants from the document
    const participants = data.participants || [];
    
    // Find participant IDs from the array
    if (participants.length >= 2) {
      // Assuming first participant is tenant and second is advertiser
      tenantId = participants[0];
      advertiserId = participants[1];
      
      // Get names from participantDetails if available
      if (participantDetails[tenantId]) {
        tenantName = participantDetails[tenantId].name || 'Unknown Tenant';
      }
      
      if (participantDetails[advertiserId]) {
        advertiserName = participantDetails[advertiserId].name || 'Unknown Advertiser';
      }
    }
    
    // Get last message
    let lastMessage = null;
    if (data.lastMessage) {
      lastMessage = {
        content: data.lastMessage || '',
        timestamp: data.lastMessageTimestamp?.toDate ? data.lastMessageTimestamp.toDate() : new Date(),
        senderId: '',
        senderName: '',
        senderRole: 'tenant' as const
      };
    }
    
    // Get property information from metadata
    const metadata = data.metadata || {};
    let linkedBooking = undefined;
    
    if (metadata.propertyId || metadata.propertyTitle) {
      linkedBooking = {
        id: metadata.reservationId || '',
        propertyId: metadata.propertyId || '',
        propertyTitle: metadata.propertyTitle || 'Unknown Property'
      };
    }
    
    // Calculate unread count
    const unreadCounts = data.unreadCounts || {};
    let totalUnread = 0;
    
    // Sum up all unread counts
    Object.values(unreadCounts).forEach((count: any) => {
      if (typeof count === 'number') {
        totalUnread += count;
      }
    });
    
    return {
      id: docSnapshot.id,
      participants: {
        tenant: {
          id: tenantId,
          name: tenantName
        },
        advertiser: {
          id: advertiserId,
          name: advertiserName
        }
      },
      linkedBooking,
      lastMessage,
      unreadCount: totalUnread,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date()
    };
  } catch (error) {
    console.error('Error processing conversation:', error);
    return {
      id: docSnapshot.id,
      participants: {
        tenant: {
          id: '',
          name: 'Unknown Tenant'
        },
        advertiser: {
          id: '',
          name: 'Unknown Advertiser'
        }
      },
      unreadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

/**
 * Process a message document and convert to Message
 */
function processMessageDoc(docSnapshot: QueryDocumentSnapshot<DocumentData>): Message {
  const data = docSnapshot.data();
  
  return {
    id: docSnapshot.id,
    conversationId: data.conversationId || '',
    senderId: data.senderId || '',
    senderName: data.senderName || 'Unknown',
    senderRole: data.senderRole || 'tenant',
    content: data.text || '',
    timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(),
    isRead: data.isRead || false
  };
}

/**
 * Get all conversations
 */
export async function getAllConversations(): Promise<Conversation[]> {
  try {
    const conversationsRef = collection(db, CONVERSATIONS_COLLECTION);
    
    // Get all documents from the conversations collection
    let querySnapshot = await getDocs(conversationsRef);
    
    // If no documents found, there's nothing to return
    if (querySnapshot.empty) {
      return [];
    }
    
    // If documents were found, we can process them
    const conversations: Conversation[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const conversation = await processConversationDoc(docSnapshot);
      conversations.push(conversation);
    }
    
    // Sort the conversations by updatedAt date (newest first)
    conversations.sort((a, b) => {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
    
    return conversations;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw new Error('Failed to fetch conversations');
  }
}

/**
 * Get conversation by ID
 */
export async function getConversationById(id: string): Promise<Conversation | null> {
  try {
    const docRef = doc(db, CONVERSATIONS_COLLECTION, id);
    const docSnapshot = await getDoc(docRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    return await processConversationDoc(docSnapshot);
  } catch (error) {
    console.error('Error fetching conversation by ID:', error);
    throw new Error('Failed to fetch conversation');
  }
}

/**
 * Get messages by conversation ID
 */
export async function getMessagesByConversationId(conversationId: string): Promise<Message[]> {
  try {
    // First try to get messages from the subcollection
    const messagesRef = collection(db, CONVERSATIONS_COLLECTION, conversationId, 'messages');
    const q = query(
      messagesRef,
      orderBy('timestamp', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const messages: Message[] = [];
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        conversationId,
        senderId: data.senderId || '',
        senderName: data.senderName || 'Unknown',
        senderRole: data.senderRole || 'tenant',
        content: data.text || '',
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(),
        isRead: data.isRead || false
      });
    });
    
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

/**
 * Search conversations
 */
export async function searchConversations(searchTerm: string): Promise<Conversation[]> {
  try {
    // Get all conversations first (not ideal but Firestore doesn't support text search)
    const conversations = await getAllConversations();
    
    // Filter locally
    const query = searchTerm.toLowerCase();
    return conversations.filter(conversation => {
      return (
        conversation.participants.tenant.name.toLowerCase().includes(query) ||
        conversation.participants.advertiser.name.toLowerCase().includes(query) ||
        (conversation.linkedBooking?.propertyTitle.toLowerCase().includes(query)) ||
        (conversation.lastMessage?.content.toLowerCase().includes(query))
      );
    });
  } catch (error) {
    console.error('Error searching conversations:', error);
    throw new Error('Failed to search conversations');
  }
}

/**
 * Send a message
 */
export async function sendAdminMessage(conversationId: string, content: string): Promise<void> {
  try {
    // Get the conversation first
    const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
    const conversationDoc = await getDoc(conversationRef);
    
    if (!conversationDoc.exists()) {
      throw new Error('Conversation not found');
    }
    
    // Add the message to the subcollection
    const messagesRef = collection(db, CONVERSATIONS_COLLECTION, conversationId, 'messages');
    const now = serverTimestamp();
    
    await addDoc(messagesRef, {
      senderId: 'admin',
      senderName: 'Kaari Admin',
      senderRole: 'admin',
      text: content,
      timestamp: now,
      isRead: false
    });
    
    // Update the conversation with the last message
    await conversationRef.update({
      lastMessage: content,
      lastMessageTimestamp: now,
      updatedAt: now
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
} 
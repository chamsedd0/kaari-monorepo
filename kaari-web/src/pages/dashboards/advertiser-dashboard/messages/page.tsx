import React, { useState, useEffect, useRef } from 'react';
import { MessagesPageStyle } from './styles';
import { MessageBanner } from '../../../../components/skeletons/banners/messages/message-banner';
import DeleteIcon from '../../../../components/skeletons/icons/blackDots.svg';
import profileImage from '../../../../assets/images/ProfilePicture.png';
import { ConversationHeader } from '../../../../components/skeletons/banners/static/conversation-header';
import MessageField from '../../../../components/skeletons/inputs/input-fields/message-field';
import MessageBubble from '../../../../components/skeletons/banners/messages/message-bubble';
import ArrowLeft from '../../../../components/skeletons/icons/ArrowRightThickPrimary.svg';
import { useTranslation } from 'react-i18next';
import { db } from '../../../../backend/firebase/config';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  Timestamp,
  doc,
  serverTimestamp,
  getDoc,
  updateDoc,
  setDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { useAuth } from '../../../../contexts/auth/AuthContext'; // Corrected path for AuthContext
import { formatDistanceToNow } from 'date-fns';
import { useToastService } from '../../../../services/ToastService'; // Corrected path for ToastService

// Interfaces for Firestore data
interface User {
  id: string;
  email?: string;
  name: string;
  surname?: string;
  phoneNumber?: string;
  profilePicture?: string;  // From backend entities
  profilePicUrl?: string;   // For compatibility
  lastSeen?: Timestamp;
  isOnline?: boolean;
  // Firebase Auth compatibility fields
  uid?: string;             
  displayName?: string;     
  photoURL?: string;        
}

interface Conversation {
  id: string;
  participants: string[]; 
  participantDetails: { [userId: string]: { 
    name: string; 
    profilePicUrl?: string;
    profilePicture?: string; // Add field for compatibility
    lastSeen?: Timestamp;
    isOnline?: boolean;
  } };
  lastMessage: string;
  lastMessageTimestamp: Timestamp | null;
  unreadCounts?: { [userId: string]: number }; 
  typingUsers?: string[]; // Array of user IDs who are currently typing
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Timestamp | null;
  isRead?: boolean;
  attachments?: Array<{
    type: "image" | "file";
    url: string;
    name?: string;
    size?: number;
  }>;
}

interface MessageHeaderProps {
  onTogglePanel: () => void;
  isPanelCollapsed: boolean;
  activeConversation: Conversation | null;
  currentUser: User | null;
  isTyping?: boolean;
  isOnline?: boolean;
  onDeleteConversation?: () => void;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ 
  onTogglePanel, 
  isPanelCollapsed, 
  activeConversation, 
  currentUser,
  isTyping = false,
  isOnline = false,
  onDeleteConversation
}) => {
  const { t } = useTranslation();
  
  const otherParticipantId = activeConversation?.participants.find(pId => pId !== currentUser?.id);
  const otherParticipantDetails = otherParticipantId ? activeConversation?.participantDetails[otherParticipantId] : null;
  
  // Determine online status text
  const getOnlineStatus = () => {
    if (!otherParticipantId || !activeConversation?.participantDetails[otherParticipantId]) {
      return '';
    }
    
    const participantIsOnline = activeConversation.participantDetails[otherParticipantId].isOnline;
    const lastSeen = activeConversation.participantDetails[otherParticipantId].lastSeen;
    
    if (isTyping) {
      return t('messages.typing');
    } else if (isOnline || participantIsOnline) {
      return t('messages.online');
    } else if (lastSeen) {
      return t('messages.last_seen', { time: formatDistanceToNow(lastSeen.toDate(), { addSuffix: true }) });
    } else {
      return '';
    }
  };
  
  return (
    <div className="conversation-header-wrapper">
      <button 
        className={`toggle-panel-button ${isPanelCollapsed ? 'collapsed' : ''}`}
        onClick={onTogglePanel}
        aria-label={isPanelCollapsed ? t('messages.expand_conversations') : t('messages.collapse_conversations')}
      >
        <img src={ArrowLeft} alt={t('messages.toggle_panel')} />
      </button>
      {activeConversation && otherParticipantDetails ? (
        <ConversationHeader 
          senderName={otherParticipantDetails.name} 
          senderPic={otherParticipantDetails.profilePicUrl || otherParticipantDetails.profilePicture || profileImage} 
          lastOnline={getOnlineStatus()}
          isTyping={isTyping}
          isOnline={isOnline || (otherParticipantId && activeConversation.participantDetails[otherParticipantId]?.isOnline) || false}
          onDeleteConversation={onDeleteConversation}
        />
      ) : (
        <ConversationHeader senderName={t('messages.select_conversation')} senderPic={profileImage} lastOnline={''} />
      )}
    </div>
  );
};

interface MessageInputProps {
  activeConversationId: string | null;
  currentUser: User | null;
  setUserTyping: (isTyping: boolean) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  activeConversationId, 
  currentUser, 
  setUserTyping 
}) => {
  const [message, setMessage] = useState<string>('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { t } = useTranslation();
  const toastService = useToastService();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    
    // Handle typing indicator
    if (newValue && !typingTimeoutRef.current) {
      setUserTyping(true);
      typingTimeoutRef.current = setTimeout(() => {
        setUserTyping(false);
        typingTimeoutRef.current = null;
      }, 3000); // Stop typing indicator after 3 seconds of inactivity
    } else if (!newValue) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      setUserTyping(false);
    } else {
      // Reset the typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setUserTyping(false);
        typingTimeoutRef.current = null;
      }, 3000);
    }
  };

  const handleAttachmentSelect = (files: File[]) => {
    // Limit to max 5 files per message
    if (files.length + attachments.length > 5) {
      toastService.showToast('warning', t('messages.warning'), t('messages.max_attachments'));
      // Add only the first files up to the limit
      const remainingSlots = 5 - attachments.length;
      if (remainingSlots > 0) {
        setAttachments([...attachments, ...files.slice(0, remainingSlots)]);
      }
      return;
    }
    
    // Add new files to existing attachments
    setAttachments([...attachments, ...files]);
  };

  // Upload a file to Firebase Storage and get its public URL
  const uploadFile = async (file: File): Promise<string> => {
    try {
      // Import Firebase storage only when needed
      const { storage } = await import('../../../../backend/firebase/config');
      const { ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage');
      
      const fileRef = ref(storage, `attachments/${activeConversationId}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          () => {}, // Progress handling if needed
          (error) => {
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };
  
  const handleSendMessage = async () => {
    if ((!message.trim() && attachments.length === 0) || !activeConversationId || !currentUser) return;
    
    // Don't allow sending if already uploading
    if (uploading) return;

    try {
      setUploading(true);
      
      // Clear typing indicator immediately
      setUserTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      
      // Get the conversation to update unread counts
      const conversationRef = doc(db, 'conversations', activeConversationId);
      const conversationSnap = await getDoc(conversationRef);
      
      if (!conversationSnap.exists()) {
        toastService.showToast('error', t('messages.error'), t('messages.conversation_not_found'));
        setUploading(false);
        return;
      }
      
      const conversationData = conversationSnap.data() as Conversation;
      const otherParticipantId = conversationData.participants.find(
        id => id !== currentUser.id
      );
      
      if (!otherParticipantId) {
        toastService.showToast('error', t('messages.error'), t('messages.invalid_conversation'));
        setUploading(false);
        return;
      }
      
      // Create a new unread counts object if it doesn't exist
      const unreadCounts = conversationData.unreadCounts || {};
      // Increment unread count for the other participant
      unreadCounts[otherParticipantId] = (unreadCounts[otherParticipantId] || 0) + 1;

      // Upload attachments if any
      const messageAttachments = [];
      if (attachments.length > 0) {
        for (const file of attachments) {
          try {
            const downloadURL = await uploadFile(file);
            messageAttachments.push({
              type: file.type.startsWith('image/') ? 'image' : 'file',
              url: downloadURL,
              name: file.name,
              size: file.size
            });
          } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
            toastService.showToast('error', t('messages.error'), t('messages.failed_to_upload_file', { fileName: file.name }));
          }
        }
      }
      
      // Add the message
      const messagesColRef = collection(db, 'conversations', activeConversationId, 'messages');
      await addDoc(messagesColRef, {
        conversationId: activeConversationId,
        senderId: currentUser.id,
        text: message.trim(),
        timestamp: serverTimestamp(),
        isRead: false,
        attachments: messageAttachments.length > 0 ? messageAttachments : undefined,
      });

      // Update the conversation's lastMessage, lastMessageTimestamp, and unreadCounts
      const lastMessageText = message.trim() || 
        (messageAttachments.length > 0 
          ? t('messages.sent_attachment', { count: messageAttachments.length }) 
          : '');
          
      await updateDoc(conversationRef, { 
        lastMessage: lastMessageText,
        lastMessageTimestamp: serverTimestamp(),
        unreadCounts,
      });

      setMessage(''); // Clear input field
      setAttachments([]); // Clear attachments
    } catch (error) {
      console.error("Error sending message: ", error);
      toastService.showToast('error', t('messages.error'), t('messages.failed_to_send'));
    } finally {
      setUploading(false);
    }
  };
  
  // Cleanup typing indicator on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setUserTyping(false);
    };
  }, [setUserTyping]);
  
  return (
    <div className="message-input-wrapper">
      {attachments.length > 0 && (
        <div className="attachments-preview">
          {attachments.map((file, index) => (
            <div key={index} className="attachment-preview-item">
              <span className="file-name">{file.name}</span>
              <button 
                onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                className="remove-attachment"
                aria-label={t('messages.remove_attachment')}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <MessageField 
        value={message} 
        onChange={handleMessageChange} 
        onSend={handleSendMessage} 
        onAttachmentSelect={handleAttachmentSelect}
      />
      {uploading && (
        <div className="upload-indicator">
          {t('messages.uploading')}
        </div>
      )}
    </div>
  );
};

// Component for conversation list items
interface ConversationBannerProps {
  conversation: Conversation;
  currentUser: User | null;
  isActive: boolean;
  onClick: () => void;
}

const RealConversationBanner: React.FC<ConversationBannerProps> = ({ conversation, currentUser, isActive, onClick }) => {
  const { t } = useTranslation();
  if (!currentUser) return null;

  const otherParticipantId = conversation.participants.find(pId => pId !== currentUser.id);
  if (!otherParticipantId) return null;
  
  const otherParticipant = conversation.participantDetails[otherParticipantId];
  const unreadCount = conversation.unreadCounts?.[currentUser.id] || 0;
  
  // Format the time or date for display
  const formatTime = (timestamp: Timestamp | null) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate();
    const now = new Date();
    
    // If it's today, show the time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If it's within the last 7 days, show the day name
    const daysAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise, show the date
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className={`conversation-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      <MessageBanner 
        profileImage={otherParticipant?.profilePicUrl || otherParticipant?.profilePicture || profileImage} 
        name={otherParticipant?.name || t('messages.unknown_user')} 
        time={formatTime(conversation.lastMessageTimestamp)} 
        message={conversation.lastMessage} 
        unreadCount={unreadCount}
        isActive={isActive}
      />
    </div>
  );
};

const MessagesPage: React.FC = () => {
  const { t } = useTranslation();
  const { user: authUser } = useAuth(); // Get authenticated user
  const toastService = useToastService();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(false);
  const [loadingConversations, setLoadingConversations] = useState<boolean>(true);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [isUserTyping, setIsUserTyping] = useState<boolean>(false);
  const [otherUserTyping, setOtherUserTyping] = useState<boolean>(false);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null); // Add error state
  
  // Add refs to track subscriptions
  const conversationsSubscribed = useRef<boolean>(false);
  const messagesSubscribed = useRef<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  console.log("AdvertiserMessagesPage rendering, user:", authUser?.id, "currentUser:", currentUser?.id, "loadingConversations:", loadingConversations);

  // Add debug effect to track loading state
  useEffect(() => {
    console.log("Loading state changed - conversations:", loadingConversations, "messages:", loadingMessages);
  }, [loadingConversations, loadingMessages]);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // UseEffect for scrolling to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Handle typing indicator updates
  useEffect(() => {
    if (!currentUser?.id || !activeConversation?.id) return;
    
    const updateTypingStatus = async () => {
      try {
        const conversationRef = doc(db, 'conversations', activeConversation.id);
        
        // Get current typing users
        const conversationSnap = await getDoc(conversationRef);
        if (!conversationSnap.exists()) return;
        
        const conversationData = conversationSnap.data() as Conversation;
        let typingUsers = conversationData.typingUsers || [];
        
        if (isUserTyping && !typingUsers.includes(currentUser.id)) {
          // Add current user to typing users
          typingUsers = [...typingUsers, currentUser.id];
        } else if (!isUserTyping && typingUsers.includes(currentUser.id)) {
          // Remove current user from typing users
          typingUsers = typingUsers.filter(id => id !== currentUser.id);
        } else {
          // No change needed
          return;
        }
        
        // Update typing status in Firestore
        await updateDoc(conversationRef, { typingUsers });
      } catch (error) {
        console.error("Error updating typing status:", error);
      }
    };
    
    updateTypingStatus();
  }, [isUserTyping, currentUser, activeConversation]);
  
  // Set online status and fetch/create user profile
  useEffect(() => {
    if (!authUser) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }
    
    const fetchUser = async () => {
      if (!authUser) return;
      
      const userDocRef = doc(db, 'users', authUser.id || authUser.uid || '');
      
      try {
        // Update online status and last seen
        await updateDoc(userDocRef, {
          isOnline: true,
          lastSeen: serverTimestamp()
        }).catch(() => {
          // If update fails, the document might not exist yet
          return setDoc(userDocRef, {
            id: authUser.id || authUser.uid || '',
            name: authUser.name || authUser.displayName || 'Advertiser',
            email: authUser.email || '',
            profilePicture: authUser.profilePicture || authUser.photoURL || undefined,
            isOnline: true,
            lastSeen: serverTimestamp()
          });
        });
        
        // Get user data
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setCurrentUser({ id: userSnap.id, ...userSnap.data() } as User);
        }
        
        // Set up presence cleanup
        const handleUserOffline = async () => {
          const userRef = doc(db, 'users', authUser.id || authUser.uid || '');
          await updateDoc(userRef, {
            isOnline: false,
            lastSeen: serverTimestamp()
          }).catch(console.error);
        };
        
        // Add event listeners for tab/window close
        window.addEventListener('beforeunload', handleUserOffline);
        
        return () => {
          window.removeEventListener('beforeunload', handleUserOffline);
          handleUserOffline(); // Mark user as offline when component unmounts
        };
      } catch (error) {
        console.error("Error setting up user presence:", error);
        return;
      }
    };
    
    fetchUser();
  }, [authUser, navigate]); 

  // Fetch conversations for the current user
  useEffect(() => {
    if (!currentUser) {
      console.log("No current user, skipping conversation fetch");
      return;
    }
    
    // Only subscribe once
    if (conversationsSubscribed.current) {
      console.log("Already subscribed to conversations, skipping");
      return;
    }
    
    console.log("Fetching conversations for advertiser:", currentUser.id);
    setLoadingConversations(true);
    setError(null);
    
    try {
      const q = query(
        collection(db, 'conversations'), 
        where('participants', 'array-contains', currentUser.id),
        orderBy('lastMessageTimestamp', 'desc')
      );

      // Mark as subscribed before creating the listener
      conversationsSubscribed.current = true;
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log("Received conversation snapshot with", querySnapshot.size, "conversations");
        const fetchedConversations: Conversation[] = [];
        querySnapshot.forEach((doc) => {
          fetchedConversations.push({ id: doc.id, ...doc.data() } as Conversation);
        });
        setConversations(fetchedConversations);
        setLoadingConversations(false);
        
        if (activeConversation) {
          const updatedActiveConversation = fetchedConversations.find(
            conv => conv.id === activeConversation.id
          );
          if (updatedActiveConversation) {
            setActiveConversation(updatedActiveConversation);
            
            if (updatedActiveConversation.typingUsers && currentUser) {
              const otherUsers = updatedActiveConversation.typingUsers.filter(
                id => id !== currentUser.id
              );
              setOtherUserTyping(otherUsers.length > 0);
            } else {
              setOtherUserTyping(false);
            }
          }
        }
      }, (error) => {
        console.error("Error fetching conversations: ", error);
        setLoadingConversations(false);
        setError("Failed to load conversations: " + error.message);
        toastService.showToast('error', t('messages.error'), t('messages.failed_to_load_conversations'));
        // Reset subscription flag on error so we can try again
        conversationsSubscribed.current = false;
      });

      return () => {
        console.log("Unsubscribing from conversations listener");
        unsubscribe();
        // Reset subscription flag when unmounting
        conversationsSubscribed.current = false;
      };
    } catch (error: any) {
      console.error("Error setting up conversations listener:", error);
      setLoadingConversations(false);
      setError("Error setting up conversations listener: " + error.message);
      // Reset subscription flag on error so we can try again
      conversationsSubscribed.current = false;
    }
  }, [currentUser?.id]);

  // Fetch messages for the active conversation
  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }

    // Reset the subscription flag when active conversation changes
    if (messagesSubscribed.current) {
      console.log("Already subscribed to messages, but active conversation changed. Resetting.");
      messagesSubscribed.current = false;
    }

    if (messagesSubscribed.current) {
      console.log("Already subscribed to messages for this conversation, skipping");
      return;
    }

    console.log("Fetching messages for conversation:", activeConversation.id);
    setLoadingMessages(true);

    try {
      const messagesColRef = collection(db, 'conversations', activeConversation.id, 'messages');
      const q = query(messagesColRef, orderBy('timestamp', 'asc'));

      // Mark as subscribed before creating the listener
      messagesSubscribed.current = true;

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log("Received messages snapshot with", querySnapshot.size, "messages");
        const fetchedMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          fetchedMessages.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages(fetchedMessages);
        setLoadingMessages(false);
        
        // Mark messages from the other user as read
        markMessagesAsRead(fetchedMessages);
      }, (error) => {
        console.error("Error fetching messages: ", error);
        setLoadingMessages(false);
        setError("Failed to load messages: " + error.message);
        toastService.showToast('error', t('messages.error'), t('messages.failed_to_load_messages'));
        // Reset subscription flag on error so we can try again
        messagesSubscribed.current = false;
      });

      return () => {
        console.log("Unsubscribing from messages listener");
        unsubscribe();
        // Reset subscription flag when unmounting
        messagesSubscribed.current = false;
      };
    } catch (error: any) {
      console.error("Error setting up messages listener:", error);
      setLoadingMessages(false);
      setError("Error setting up messages listener: " + error.message);
      // Reset subscription flag on error so we can try again
      messagesSubscribed.current = false;
    }
  }, [activeConversation?.id]);
  
  // Mark messages as read when the conversation is viewed
  const markMessagesAsRead = async (fetchedMessages: Message[]) => {
    if (!currentUser || !activeConversation) return;
    
    // Find messages from other users that aren't read
    const unreadMessages = fetchedMessages.filter(msg => 
      msg.senderId !== currentUser.id && msg.isRead === false
    );
    
    if (unreadMessages.length === 0) return;
    
    try {
      console.log(`Marking ${unreadMessages.length} messages as read`);
      // Use a batch to update all messages at once
      const batch = writeBatch(db);
      unreadMessages.forEach(msg => {
        const msgRef = doc(db, 'conversations', activeConversation.id, 'messages', msg.id);
        batch.update(msgRef, { isRead: true });
      });
      
      // Update unread count in the conversation
      const convRef = doc(db, 'conversations', activeConversation.id);
      batch.update(convRef, { [`unreadCounts.${currentUser.id}`]: 0 });
      
      await batch.commit();
      console.log("Successfully marked messages as read");
    } catch (error) {
      console.error("Error marking messages as read:", error);
      setError("Failed to mark messages as read: " + (error as Error).message);
    }
  };

  // Determine if message is from the current user
  const isMessageFromMe = (senderId: string) => senderId === currentUser?.id;

  const togglePanel = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };
  
  const handleConversationSelect = (conversation: Conversation) => {
    setActiveConversation(conversation);
  };
  
  // Format message timestamp to a readable format
  const formatMessageTime = (timestamp: Timestamp | null): string => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Time part (HH:MM)
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Check if it's today, yesterday, or another day
    if (date >= today) {
      return `${t('messages.today')} ${timeStr}`;
    } else if (date >= yesterday) {
      return `${t('messages.yesterday')} ${timeStr}`;
    } else {
      // For other dates, show a full date
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year} ${timeStr}`;
    }
  };

  // Add an effect to sync currentUser with authUser
  useEffect(() => {
    if (authUser) {
      setCurrentUser({
        id: authUser.id || authUser.uid || '',
        name: authUser.name || authUser.displayName || 'Advertiser',
        email: authUser.email || '',
        profilePicture: authUser.profilePicture || authUser.photoURL || undefined,
        isOnline: true
      });
    }
  }, [authUser]);

  // Inside the MessagesPage component
  const handleDeleteMessage = async (messageId: string) => {
    if (!activeConversation) return;
    
    try {
      const messageRef = doc(db, 'conversations', activeConversation.id, 'messages', messageId);
      await deleteDoc(messageRef);
      toastService.showToast('success', t('messages.success'), t('messages.message_deleted'));
    } catch (error) {
      console.error("Error deleting message:", error);
      toastService.showToast('error', t('messages.error'), t('messages.failed_to_delete_message'));
    }
  };

  const handleDeleteConversation = async () => {
    if (!activeConversation || !currentUser) return;
    
    try {
      // Delete all messages in the conversation first
      const messagesColRef = collection(db, 'conversations', activeConversation.id, 'messages');
      const messagesSnapshot = await getDocs(messagesColRef);
      
      const batch = writeBatch(db);
      messagesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // Delete the conversation document
      batch.delete(doc(db, 'conversations', activeConversation.id));
      
      await batch.commit();
      
      // Clear active conversation
      setActiveConversation(null);
      
      toastService.showToast('success', t('messages.success'), t('messages.conversation_deleted'));
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toastService.showToast('error', t('messages.error'), t('messages.failed_to_delete_conversation'));
    }
  };

  // Override main return to show any errors
  if (error) {
    return (
      <MessagesPageStyle>
        <div className="messages-page-layout">
          <div className="error-state">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Reload Page</button>
          </div>
        </div>
      </MessagesPageStyle>
    );
  }

  return (
    <MessagesPageStyle>
      <div className="messages-page-layout">
        <div className={`conversations-list ${isPanelCollapsed ? 'collapsed' : ''}`}>
          <div className="conversations-list-content">
            <div className="conversations-header">
              <h2>{t('messages.title')}</h2>
              <div className="actions">
                {/* Advertiser can only respond to messages, not initiate them */}
                <div className="delete-button">
                  <img src={DeleteIcon} alt={t('messages.delete')} />
                </div>
              </div>
            </div>
            
            {loadingConversations ? (
              <div className="loading-state">{t('messages.loading_conversations')}</div>
            ) : conversations.length === 0 ? (
              <div className="empty-state">{t('messages.no_conversations')}</div>
            ) : (
              <div className="conversation-list">
                {conversations.map(conversation => (
                  <RealConversationBanner
                    key={conversation.id} 
                    conversation={conversation}
                    currentUser={currentUser}
                    isActive={activeConversation?.id === conversation.id}
                    onClick={() => handleConversationSelect(conversation)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="chat-area">
          {activeConversation ? (
            <>
              <MessageHeader 
                onTogglePanel={togglePanel} 
                isPanelCollapsed={isPanelCollapsed} 
                activeConversation={activeConversation}
                currentUser={currentUser}
                isTyping={otherUserTyping}
                isOnline={activeConversation?.participantDetails?.[
                  activeConversation.participants.find(id => id !== currentUser?.id) || ''
                ]?.isOnline}
                onDeleteConversation={handleDeleteConversation}
              />
              
              <div className="messages-container">
                {loadingMessages ? (
                  <div className="messages-loading">{t('messages.loading_messages')}</div>
                ) : messages.length === 0 ? (
                  <div className="messages-empty">{t('messages.no_messages')}</div>
                ) : (
                  <>
                    {messages.map(message => (
                      <MessageBubble
                        key={message.id}
                        variant={message.senderId === currentUser?.id ? "secondary" : "primary"}
                        message={message.text}
                        timestamp={formatMessageTime(message.timestamp)}
                        isRead={message.isRead}
                        attachment={message.attachments && message.attachments.length > 0 ? message.attachments[0] : undefined}
                        onDelete={message.senderId === currentUser?.id ? () => handleDeleteMessage(message.id) : undefined}
                      />
                    ))}
                    {otherUserTyping && (
                      <MessageBubble
                        key="typing-indicator"
                        variant="primary"
                        message=""
                        timestamp=""
                        isTyping={true}
                      />
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
              
              <MessageInput 
                activeConversationId={activeConversation.id} 
                currentUser={currentUser} 
                setUserTyping={setIsUserTyping}
              />
            </>
          ) : (
            <div className="no-conversation-selected">
              <h3>{t('messages.no_conversation_selected')}</h3>
              <p>{t('messages.select_conversation')}</p>
            </div>
          )}
        </div>
      </div>
    </MessagesPageStyle>
  );
};

export default MessagesPage;


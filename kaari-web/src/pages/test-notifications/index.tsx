import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { useAuth } from '../../contexts/auth/AuthContext';
import UnifiedHeader from '../../components/skeletons/constructed/headers/unified-header';
import { generateTestNotifications, generateSingleNotification } from '../../utils/test-notifications';
import { useNotifications } from '../../contexts/notifications/NotificationContext';
import NotificationService from '../../services/NotificationService';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f7f9fc;
  padding-top: 80px; /* Space for header */
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
`;

const Description = styled.p`
  color: #4b5563;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 24px;
`;

const Button = styled.button`
  background-color: ${Theme.colors.primary};
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 12px;
  margin-bottom: 12px;
  
  &:hover {
    background-color: #4f46e5;
  }
  
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 24px;
  
  ${Button} {
    margin-right: 12px;
    margin-bottom: 12px;
  }
`;

const NotificationType = styled.div`
  margin-bottom: 24px;
`;

const NotificationTypeTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
`;

// New styled components for debugging section
const DebugSection = styled.div`
  background-color: #f0f0f0;
  border-radius: 12px;
  padding: 16px;
  margin-top: 24px;
  overflow: auto;
  max-height: 300px;
`;

const DebugHeader = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const DebugItem = styled.div`
  font-family: monospace;
  font-size: 12px;
  padding: 4px 0;
  border-bottom: 1px dashed #ccc;
  white-space: pre-wrap;
  word-break: break-all;
`;

const TestNotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { notifications, loading, refreshNotifications } = useNotifications();
  const [loadingGen, setLoadingGen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  
  // Add a log function for debugging
  const addLog = (message: string) => {
    setDebugLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };
  
  useEffect(() => {
    if (user) {
      addLog(`User authenticated: ${user.id}, type: ${user.userType || 'user'}`);
    } else {
      addLog(`No user authenticated`);
    }
  }, [user]);
  
  useEffect(() => {
    addLog(`Notifications updated: ${notifications.length} notifications found, loading: ${loading}`);
  }, [notifications, loading]);
  
  const handleGenerateAll = async () => {
    if (!user) {
      setResult('You must be logged in to generate notifications');
      return;
    }
    
    setLoadingGen(true);
    setResult('Generating notifications...');
    addLog(`Generating all notifications for ${user.userType || 'user'} ${user.id}`);
    
    try {
      await generateTestNotifications(
        user.id,
        user.userType || 'user'
      );
      setResult('Successfully generated all notification types! Check your notification bell.');
      addLog(`Notifications generation completed`);
      
      // Refresh notifications after creating them
      await refreshNotifications();
    } catch (error) {
      console.error('Error generating notifications:', error);
      setResult('Error generating notifications. See console for details.');
      addLog(`Error generating notifications: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoadingGen(false);
    }
  };
  
  const handleGenerateNotification = async (type: string) => {
    if (!user) {
      setResult('You must be logged in to generate notifications');
      return;
    }
    
    setLoadingGen(true);
    setResult(`Generating ${type} notification...`);
    addLog(`Generating ${type} notification for ${user.userType || 'user'} ${user.id}`);
    
    try {
      await generateSingleNotification(
        user.id,
        user.userType || 'user',
        type
      );
      setResult(`Successfully generated ${type} notification! Check your notification bell.`);
      addLog(`${type} notification generation completed`);
      
      // Refresh notifications after creating them
      await refreshNotifications();
    } catch (error) {
      console.error(`Error generating ${type} notification:`, error);
      setResult(`Error generating ${type} notification. See console for details.`);
      addLog(`Error generating ${type} notification: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoadingGen(false);
    }
  };
  
  // Function to directly create a test notification
  const createDirectNotification = async () => {
    if (!user) {
      setResult('You must be logged in to create a notification');
      return;
    }
    
    setLoadingGen(true);
    setResult('Creating direct test notification...');
    addLog(`Creating direct test notification for ${user.userType || 'user'} ${user.id}`);
    
    try {
      const notificationId = await NotificationService.createNotification(
        user.id,
        user.userType || 'user',
        'test_notification',
        'Direct Test Notification',
        'This is a direct test notification created through the NotificationService.',
        '/test-notifications',
        { timestamp: new Date().toISOString() }
      );
      
      setResult(`Successfully created direct test notification with ID: ${notificationId}`);
      addLog(`Direct test notification created with ID: ${notificationId}`);
      
      // Refresh notifications after creating them
      await refreshNotifications();
    } catch (error) {
      console.error('Error creating direct test notification:', error);
      setResult('Error creating direct test notification. See console for details.');
      addLog(`Error creating direct test notification: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoadingGen(false);
    }
  };
  
  // Add this function to check Firestore for notifications directly
  const checkFirestoreForNotifications = async () => {
    if (!user) {
      setResult('You must be logged in to check notifications');
      return;
    }
    
    setLoadingGen(true);
    setResult('Checking Firestore for notifications...');
    addLog(`Checking Firestore for notifications for ${user.userType || 'user'} ${user.id}`);
    
    try {
      const debugInfo = await NotificationService.getNotificationsDebugInfo(
        user.id,
        user.userType || 'user'
      );
      
      setResult(`Firestore check: ${debugInfo.notificationsExist ? `Found ${debugInfo.count} notifications` : 'No notifications found'} in collection '${debugInfo.collectionPath}'`);
      
      addLog(`Firestore check results: ${JSON.stringify(debugInfo)}`);
      
      if (debugInfo.sampleNotifications.length > 0) {
        addLog(`Sample notifications: ${JSON.stringify(debugInfo.sampleNotifications)}`);
      }
      
      if (debugInfo.error) {
        addLog(`Error in Firestore check: ${debugInfo.error}`);
      }
    } catch (error) {
      console.error('Error checking Firestore for notifications:', error);
      setResult('Error checking Firestore for notifications. See console for details.');
      addLog(`Error checking Firestore: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoadingGen(false);
    }
  };
  
  // Add a function to directly create a document in Firestore without using NotificationService
  const createFirestoreDocumentDirectly = async () => {
    if (!user) {
      setResult('You must be logged in to create a document');
      return;
    }
    
    setLoadingGen(true);
    setResult('Creating Firestore document directly...');
    addLog(`Attempting to create a document directly in Firestore for ${user.userType || 'user'} ${user.id}`);
    
    try {
      // Import necessary Firestore methods directly
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../../backend/firebase/config');
      
      // Create a direct reference to the notifications collection
      const notificationsCollection = collection(db, 'notifications');
      
      // Create the document data
      const documentData = {
        userId: user.id,
        userType: user.userType || 'user',
        type: 'direct_test',
        title: 'Direct Firestore Test',
        message: 'This notification was created directly in Firestore.',
        timestamp: serverTimestamp(),
        isRead: false,
        link: '/test-notifications',
        metadata: { createdAt: new Date().toISOString() }
      };
      
      addLog(`Document data prepared: ${JSON.stringify(documentData)}`);
      
      // Add the document to Firestore
      const docRef = await addDoc(notificationsCollection, documentData);
      
      setResult(`Firestore document created directly with ID: ${docRef.id}`);
      addLog(`Firestore document created with ID: ${docRef.id}`);
      
      // Refresh notifications
      await refreshNotifications();
    } catch (error) {
      console.error('Error creating Firestore document directly:', error);
      setResult('Error creating Firestore document directly. See console for details.');
      addLog(`Error creating Firestore document: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoadingGen(false);
    }
  };
  
  return (
    <PageContainer>
      <UnifiedHeader 
        variant="white" 
        userType={user?.userType || "user"}
        isAuthenticated={!!user}
      />
      
      <ContentContainer>
        <Card>
          <Title>Notification Test Page</Title>
          <Description>
            This page allows you to test the notification system by generating sample notifications.
            You need to be logged in to use this feature.
          </Description>
          
          <Button 
            onClick={handleGenerateAll}
            disabled={loadingGen || !user}
          >
            Generate All Notification Types
          </Button>
          
          <Button 
            onClick={createDirectNotification}
            disabled={loadingGen || !user}
            style={{ backgroundColor: Theme.colors.secondary }}
          >
            Create Direct Test Notification
          </Button>
          
          <Button 
            onClick={checkFirestoreForNotifications}
            disabled={loadingGen || !user}
            style={{ backgroundColor: '#2563eb' }}
          >
            Check Firestore Directly
          </Button>
          
          <Button 
            onClick={createFirestoreDocumentDirectly}
            disabled={loadingGen || !user}
            style={{ backgroundColor: '#2563eb' }}
          >
            Create Firestore Document Directly
          </Button>
          
          {result && (
            <div style={{ 
              padding: '12px', 
              marginBottom: '20px', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '6px',
              color: '#4b5563'
            }}>
              {result}
            </div>
          )}
          
          <NotificationType>
            <NotificationTypeTitle>User Notifications</NotificationTypeTitle>
            <ButtonGroup>
              <Button 
                onClick={() => handleGenerateNotification('accepted')}
                disabled={loadingGen || !user}
              >
                Reservation Accepted
              </Button>
              <Button 
                onClick={() => handleGenerateNotification('rejected')}
                disabled={loadingGen || !user}
              >
                Reservation Rejected
              </Button>
              <Button 
                onClick={() => handleGenerateNotification('payment_reminder')}
                disabled={loadingGen || !user}
              >
                Payment Reminder
              </Button>
              <Button 
                onClick={() => handleGenerateNotification('move_in_reminder')}
                disabled={loadingGen || !user}
              >
                Move-in Reminder
              </Button>
              <Button 
                onClick={() => handleGenerateNotification('cancelled_by_advertiser')}
                disabled={loadingGen || !user}
              >
                Cancelled by Advertiser
              </Button>
              <Button 
                onClick={() => handleGenerateNotification('refund')}
                disabled={loadingGen || !user}
              >
                Refund Handled
              </Button>
              <Button 
                onClick={() => handleGenerateNotification('cancellation')}
                disabled={loadingGen || !user}
              >
                Cancellation Handled
              </Button>
            </ButtonGroup>
          </NotificationType>
          
          <NotificationType>
            <NotificationTypeTitle>Advertiser Notifications</NotificationTypeTitle>
            <ButtonGroup>
              <Button 
                onClick={() => handleGenerateNotification('photoshoot')}
                disabled={loadingGen || !user}
              >
                Photoshoot Booked
              </Button>
              <Button 
                onClick={() => handleGenerateNotification('reservation_request')}
                disabled={loadingGen || !user}
              >
                Reservation Request
              </Button>
              <Button 
                onClick={() => handleGenerateNotification('payment')}
                disabled={loadingGen || !user}
              >
                Payment Confirmed
              </Button>
              <Button 
                onClick={() => handleGenerateNotification('move_in')}
                disabled={loadingGen || !user}
              >
                Client Moved In
              </Button>
              <Button 
                onClick={() => handleGenerateNotification('cancellation')}
                disabled={loadingGen || !user}
              >
                Reservation Cancelled
              </Button>
            </ButtonGroup>
          </NotificationType>
        </Card>
        
        <Card>
          <Title>Notification Debugging</Title>
          <Description>
            Current notification state and activity logs.
          </Description>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>Current User:</h3>
            <pre style={{ backgroundColor: '#f3f4f6', padding: '12px', borderRadius: '6px', overflow: 'auto' }}>
              {user ? JSON.stringify({
                id: user.id,
                userType: user.userType || 'user',
                email: user.email,
                name: user.name
              }, null, 2) : 'Not logged in'}
            </pre>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>Notifications ({notifications.length}):</h3>
            <Button 
              onClick={refreshNotifications}
              disabled={loading}
              style={{ marginBottom: '12px' }}
            >
              Refresh Notifications
            </Button>
            <pre style={{ backgroundColor: '#f3f4f6', padding: '12px', borderRadius: '6px', overflow: 'auto' }}>
              {loading ? 'Loading...' : notifications.length > 0 ? 
                JSON.stringify(notifications.map(n => ({
                  id: n.id,
                  type: n.type,
                  title: n.title,
                  isRead: n.isRead,
                  timestamp: n.timestamp?.toDate?.().toISOString() || n.timestamp,
                })), null, 2) : 'No notifications found'}
            </pre>
          </div>
          
          <DebugSection>
            <DebugHeader>Debug Logs:</DebugHeader>
            {debugLogs.map((log, index) => (
              <DebugItem key={index}>{log}</DebugItem>
            ))}
            {debugLogs.length === 0 && <DebugItem>No logs yet</DebugItem>}
          </DebugSection>
        </Card>
      </ContentContainer>
    </PageContainer>
  );
};

export default TestNotificationsPage; 
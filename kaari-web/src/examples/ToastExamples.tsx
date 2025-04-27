import React from 'react';
import { useToast } from '../contexts/ToastContext';
import { useToastService } from '../services/ToastService';
import { PurpleButtonMB48 } from '../components/skeletons/buttons/purple_MB48';
import styled from 'styled-components';

/**
 * This file provides examples of how to use the toast notification system.
 * It's for demonstration purposes and not meant to be part of the app.
 */

const ExampleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  
  h2 {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  
  .buttons-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  code {
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 4px;
    display: block;
    margin: 10px 0;
    font-family: monospace;
    white-space: pre-wrap;
  }
`;

const ToastExamples: React.FC = () => {
  // Method 1: Direct use of the Toast context
  const { addToast } = useToast();
  
  // Method 2: Using the predefined toast service
  const toast = useToastService();
  
  // Examples of Method 1: Direct use of Toast Context
  const showBasicToasts = () => {
    addToast('success', 'Success Toast', 'This is a basic success toast notification');
    
    // Show next toast after a delay to avoid overlap
    setTimeout(() => {
      addToast('error', 'Error Toast', 'This is a basic error toast notification');
    }, 500);
    
    setTimeout(() => {
      addToast('info', 'Info Toast', 'This is a basic info toast notification');
    }, 1000);
    
    setTimeout(() => {
      addToast('warning', 'Warning Toast', 'This is a basic warning toast notification');
    }, 1500);
  };
  
  // Examples of Method 2: Using the Toast Service
  
  // Authentication examples
  const showAuthToasts = () => {
    toast.auth.loginSuccess();
    
    setTimeout(() => {
      toast.auth.loginError('Invalid username or password');
    }, 500);
    
    setTimeout(() => {
      toast.auth.registrationSuccess();
    }, 1000);
  };
  
  // Profile examples
  const showProfileToasts = () => {
    toast.profile.updateSuccess();
    
    setTimeout(() => {
      toast.profile.uploadPhotoSuccess();
    }, 500);
    
    setTimeout(() => {
      toast.profile.uploadDocumentSuccess();
    }, 1000);
  };
  
  // Property examples
  const showPropertyToasts = () => {
    toast.property.createSuccess();
    
    setTimeout(() => {
      toast.property.updateSuccess();
    }, 500);
    
    setTimeout(() => {
      toast.property.editRequestSuccess();
    }, 1000);
  };
  
  // Support examples
  const showSupportToasts = () => {
    toast.support.messageSuccess();
    
    setTimeout(() => {
      toast.support.messageError('Failed to connect to the server');
    }, 500);
  };
  
  // Custom toast examples
  const showCustomToasts = () => {
    toast.showToast('success', 'Custom Success', 'This is a custom success message');
    
    setTimeout(() => {
      toast.app.actionSuccess('Data export');
    }, 500);
    
    setTimeout(() => {
      toast.app.permissionDenied();
    }, 1000);
    
    setTimeout(() => {
      toast.app.featureNotAvailable();
    }, 1500);
  };
  
  return (
    <ExampleContainer>
      <h1>Toast Notification Examples</h1>
      <p>
        This page demonstrates how to use the toast notification system in your application.
        There are two methods to show toast notifications:
      </p>
      
      <h2>Method 1: Using Toast Context Directly</h2>
      <code>{`import { useToast } from '../contexts/ToastContext';

// Inside your component:
const { addToast } = useToast();

// Show a toast:
addToast('success', 'Success', 'Operation completed successfully');`}</code>
      
      <div className="buttons-group">
        <PurpleButtonMB48 text="Show Basic Toasts" onClick={showBasicToasts} />
      </div>
      
      <h2>Method 2: Using Toast Service (Recommended)</h2>
      <p>
        The Toast Service provides predefined toast messages for common actions,
        making it easier to maintain consistent messaging across the application.
      </p>
      
      <code>{`import { useToastService } from '../services/ToastService';

// Inside your component:
const toast = useToastService();

// Show predefined toasts:
toast.auth.loginSuccess();
toast.profile.updateSuccess();
toast.property.createSuccess();

// Or custom toasts:
toast.showToast('info', 'Custom Title', 'Custom message');
toast.app.actionSuccess('File upload');`}</code>
      
      <h2>Examples by Category</h2>
      
      <div className="buttons-group">
        <PurpleButtonMB48 text="Auth Toasts" onClick={showAuthToasts} />
        <PurpleButtonMB48 text="Profile Toasts" onClick={showProfileToasts} />
        <PurpleButtonMB48 text="Property Toasts" onClick={showPropertyToasts} />
        <PurpleButtonMB48 text="Support Toasts" onClick={showSupportToasts} />
        <PurpleButtonMB48 text="Custom Toasts" onClick={showCustomToasts} />
      </div>
      
      <h2>Implementation Notes</h2>
      <ul>
        <li>Toasts appear in the bottom-right corner of the screen</li>
        <li>Toasts auto-close after 5 seconds by default</li>
        <li>Toasts can be manually closed by clicking the X button</li>
        <li>Multiple toasts stack vertically with the newest at the bottom</li>
      </ul>
      
      <h2>Real-world Usage Example:</h2>
      <code>{`// In a form submission handler:
const handleSubmit = async () => {
  try {
    setLoading(true);
    await updateUserProfile(userData);
    toast.profile.updateSuccess();
  } catch (error) {
    toast.profile.updateError(error.message);
  } finally {
    setLoading(false);
  }
};`}</code>
    </ExampleContainer>
  );
};

export default ToastExamples; 
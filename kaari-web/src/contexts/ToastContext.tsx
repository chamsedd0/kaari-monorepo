import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import HeadlineTextSuccess from '../components/skeletons/headline-text/headline-text-success';
import HeadlineTextRejected from '../components/skeletons/headline-text/headline-text-error';
import HeadlineTextInfo from '../components/skeletons/headline-text/headline-text-info';
import HeadlineTextWarning from '../components/skeletons/headline-text/headline-text-warning';
import styled from 'styled-components';

// Define toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// Interface for individual toast data
export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description: string;
  autoClose?: boolean;
  duration?: number;
  exiting?: boolean;
}

// Context interface
interface ToastContextType {
  addToast: (type: ToastType, title: string, description: string, autoClose?: boolean, duration?: number) => void;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
}

// Create context with default value
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast container styling
const ToastContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 99999;
  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  max-height: 90vh;
  overflow-y: auto;
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding: 10px;
  pointer-events: none;
  
  /* Hide the scrollbar for WebKit browsers */
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    background: transparent;
  }

  /* Each toast should have pointer events */
  & > * {
    pointer-events: auto;
    animation: slideIn 0.3s ease-out forwards;
    opacity: 0;
    transform: translateX(100%);
    min-width: 300px;
    max-width: 400px;
  }

  @keyframes slideIn {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  .toast-exiting {
    animation: fadeOut 0.3s ease-in forwards;
  }
`;

// Toast provider component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Add a new toast notification
  const addToast = useCallback((
    type: ToastType, 
    title: string, 
    description: string, 
    autoClose = true, 
    duration = 5000
  ) => {
    // Check if a toast with the same title already exists
    const hasDuplicateToast = toasts.some(toast => 
      toast.title === title && !toast.exiting
    );
    
    // If a duplicate toast exists, don't add another one
    if (hasDuplicateToast) {
      return;
    }
    
    const id = Date.now().toString();
    const newToast: Toast = {
      id,
      type,
      title,
      description,
      autoClose,
      duration
    };

    setToasts(prevToasts => [...prevToasts, newToast]);

    // Auto-close toast after duration if autoClose is true
    if (autoClose) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [toasts]);

  // Remove a toast notification
  const removeToast = useCallback((id: string) => {
    // Mark toast as exiting
    setToasts(prevToasts => 
      prevToasts.map(toast => 
        toast.id === id 
          ? { ...toast, exiting: true } 
          : toast
      )
    );

    // Remove toast after animation
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 300); // Match animation duration
  }, []);
  
  // Remove all toasts
  const removeAllToasts = useCallback(() => {
    // Mark all toasts as exiting
    setToasts(prevToasts => 
      prevToasts.map(toast => ({ ...toast, exiting: true }))
    );

    // Remove all toasts after animation
    setTimeout(() => {
      setToasts([]);
    }, 300);
  }, []);

  // Render the appropriate toast component based on type
  const renderToast = (toast: Toast) => {
    const { id, type, title, description, exiting } = toast;
    const className = exiting ? 'toast-exiting' : '';

    switch (type) {
      case 'success':
        return (
          <div key={id} className={className}>
            <HeadlineTextSuccess 
              title={title} 
              description={description} 
              onClose={() => removeToast(id)} 
            />
          </div>
        );
      case 'error':
        return (
          <div key={id} className={className}>
            <HeadlineTextRejected 
              title={title} 
              description={description} 
              onClose={() => removeToast(id)} 
            />
          </div>
        );
      case 'info':
        return (
          <div key={id} className={className}>
            <HeadlineTextInfo 
              title={title} 
              description={description} 
              onClose={() => removeToast(id)} 
            />
          </div>
        );
      case 'warning':
        return (
          <div key={id} className={className}>
            <HeadlineTextWarning 
              title={title} 
              description={description} 
              onClose={() => removeToast(id)} 
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, removeAllToasts }}>
      {children}
      <ToastContainer>
        {toasts.map(renderToast)}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}; 
import React, { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import FocusTrap from './focus-trap'; // We'll create this next
import eventBus, { EventType } from '../../../../utils/event-bus';

// Styled components for the modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  animation: fadeIn 0.3s ease;
  padding: 20px;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const ModalContainer = styled.div`
  background-color: ${Theme.colors.white};
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 480px;
  position: relative;
  animation: slideIn 0.3s ease;
  overflow: hidden;

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @media (max-width: 600px) {
    max-width: 100%;
    border-radius: 16px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  position: relative;

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: ${Theme.colors.black};
    margin: 0;
    text-align: center;
    flex: 1;
  }

  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 24px;
    color: ${Theme.colors.black};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    transition: all 0.2s;
    position: absolute;
    right: 16px;
    top: 16px;

    &:hover, &:focus {
      color: ${Theme.colors.primary};
      background-color: rgba(103, 58, 183, 0.1);
    }
    
    &:focus-visible {
      outline: 2px solid ${Theme.colors.primary};
      outline-offset: 2px;
    }
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  
  @media (max-width: 480px) {
    max-height: calc(100vh - 150px);
    padding: 16px;
  }
`;

const ModalFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid ${Theme.colors.fifth};
  display: flex;
  justify-content: center;
  gap: 12px;
  
  @media (max-width: 480px) {
    padding: 16px;
    flex-direction: column;
  }
`;

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  modalId: string;
  size?: 'small' | 'medium' | 'large';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  showCloseButton?: boolean;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  modalId,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className = '',
  showCloseButton = true
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [previousFocus, setPreviousFocus] = useState<HTMLElement | null>(null);

  // Save previous focus and set up event listeners
  useEffect(() => {
    // Remember the element that had focus before opening the modal
    if (isOpen) {
      setPreviousFocus(document.activeElement as HTMLElement);
      
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
      
      // Emit modal open event
      eventBus.emit(EventType.UI_MODAL_OPEN, { 
        modalId,
        props: { size }
      });
    }
    
    return () => {
      if (isOpen) {
        // Restore body scrolling when modal closes
        document.body.style.overflow = '';
        
        // Emit modal close event
        eventBus.emit(EventType.UI_MODAL_CLOSE, { modalId });
        
        // Return focus to previous element when modal closes
        if (previousFocus && 'focus' in previousFocus) {
          setTimeout(() => {
            previousFocus.focus();
          }, 0);
        }
      }
    };
  }, [isOpen, modalId, size, previousFocus]);
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEsc]);
  
  // Handle overlay click to close modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // If modal is not open, render nothing
  if (!isOpen) return null;
  
  // Generate a unique modal title ID
  const modalTitleId = `modal-${modalId}-title`;
  const modalDescriptionId = `modal-${modalId}-description`;

  return (
    <ModalOverlay 
      onClick={handleOverlayClick} 
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalTitleId}
      aria-describedby={description ? modalDescriptionId : undefined}
      className={`modal-overlay ${className}`}
    >
      <FocusTrap>
        <ModalContainer 
          ref={modalRef}
          className={`modal-container modal-size-${size}`}
          style={{ maxWidth: size === 'small' ? '400px' : size === 'large' ? '800px' : '600px' }}
        >
          <ModalHeader className="modal-header">
            <h2 id={modalTitleId}>{title}</h2>
            {showCloseButton && (
              <button 
                className="close-button"
                onClick={onClose}
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
            )}
          </ModalHeader>
          
          {description && (
            <div id={modalDescriptionId} className="sr-only">
              {description}
            </div>
          )}
          
          <ModalBody className="modal-body">
            {children}
          </ModalBody>
          
          {footer && (
            <ModalFooter className="modal-footer">
              {footer}
            </ModalFooter>
          )}
        </ModalContainer>
      </FocusTrap>
    </ModalOverlay>
  );
};

export default AccessibleModal; 
import React, { useState, useRef, useEffect } from 'react';
import { ModalOverlayStyle, MessagingModalStyle } from '../../../styles/constructed/modals/auth-modal-style';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { PurpleButtonLB60 } from '../../buttons/purple_LB60';

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    name: string;
    avatar?: string;
  };
  onSendMessage: (message: string) => void;
}

export const MessagingModal: React.FC<MessagingModalProps> = ({
  isOpen,
  onClose,
  recipient,
  onSendMessage
}) => {
  const [message, setMessage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus the textarea when modal opens
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlayStyle>
      <MessagingModalStyle ref={modalRef}>
        <div className="modal-header">
          <div className="recipient-info">
            {recipient.avatar ? (
              <img src={recipient.avatar} alt={recipient.name} className="recipient-avatar" />
            ) : (
              <div className="recipient-avatar-placeholder">
                {recipient.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h2>Message to {recipient.name}</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="message-input-container">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleChange}
                placeholder={`Write your message to ${recipient.name}...`}
                rows={5}
                required
              />
            </div>

            <div className="messaging-info">
              <p>
                <strong>Response time:</strong> Usually within 24 hours
              </p>
            </div>

            <div className="button-container">
              <PurpleButtonLB60 
                text="Send Message" 
                onClick={handleSubmit}
                icon={<FaPaperPlane />}
                disabled={!message.trim()}
              />
            </div>
          </form>
        </div>
      </MessagingModalStyle>
    </ModalOverlayStyle>
  );
};

export default MessagingModal; 
import React, { useState, useRef, useEffect } from 'react';
import { ModalOverlayStyle, MessagingModalStyle } from '../../../styles/constructed/modals/auth-modal-style';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { PurpleButtonLB60 } from '../../buttons/purple_LB60';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
            <h2>{t('messages.message_to')} {recipient.name}</h2>
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
                placeholder={`${t('messages.write_message_to')} ${recipient.name}...`}
                rows={5}
                required
              />
            </div>

            <div className="messaging-info">
              <p>
                <strong>{t('messages.response_time')}:</strong> {t('messages.usually_within')}
              </p>
            </div>

            <div className="button-container">
              <PurpleButtonLB60 
                text={t('messages.send_message')}
                onClick={(e) => handleSubmit(e as any)}
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
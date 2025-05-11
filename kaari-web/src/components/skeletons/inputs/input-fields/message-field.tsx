import MessageFieldBaseModel from "../../../styles/inputs/input-fields/message-field-base-model-style";
import React, { KeyboardEvent, useState, useRef } from "react";
import MoreIcon from '../../icons/more-icon.svg'
import SendIcon from '../../icons/send-icon.svg'
import { useTranslation } from 'react-i18next';

interface MessageFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend?: () => void;
  onAttachmentSelect?: (files: File[]) => void;
}

const MessageField: React.FC<MessageFieldProps> = ({
  value,
  onChange,
  onSend,
  onAttachmentSelect,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && onSend) {
      e.preventDefault();
      onSend();
    }
  };

  const handleSendClick = () => {
    if (onSend) {
      onSend();
    }
  };
  
  const handlePlusButtonClick = () => {
    // Trigger the hidden file input when plus button is clicked
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      if (onAttachmentSelect) {
        onAttachmentSelect(filesArray);
      }
      // Reset file input after selection
      e.target.value = '';
    }
  };

  return (
    <MessageFieldBaseModel isEmpty={value === '' || value === undefined}>
        <div className="plus-button" onClick={handlePlusButtonClick}>
            <img src={MoreIcon} alt={t('messages.add_attachment')} />
        </div>
        
        {/* Hidden file input element */}
        <input 
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          multiple
          accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
        />
        
        <input className="messeging-input"
            type='text'
            placeholder={t('messages.type_message')}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
        />

        <div 
          className="send-button" 
          onClick={handleSendClick}
          style={{ cursor: 'pointer' }}
        >
          <img src={SendIcon} alt={t('messages.send_message')} />
        </div>
    </MessageFieldBaseModel>
  );
};

export default MessageField;

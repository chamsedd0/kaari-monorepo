import MessageFieldBaseModel from "../../../styles/inputs/input-fields/message-field-base-model-style";
import React from "react";
import MoreIcon from '../../icons/more-icon.svg'
import SendIcon from '../../icons/send-icon.svg'
import { useTranslation } from 'react-i18next';

interface MessageFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MessageField: React.FC<MessageFieldProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  
  return (
    <MessageFieldBaseModel isEmpty={value === '' || value === undefined}>
        <div className="plus-button">
            <img src={MoreIcon} alt="" />
        </div>
        <input className="messeging-input"
            type='text'
            placeholder={t('messages.type_message')}
            value={value}
            onChange={onChange}
        />

        <img src={SendIcon} alt="" className="send-button" />
    </MessageFieldBaseModel>
  );
};

export default MessageField;

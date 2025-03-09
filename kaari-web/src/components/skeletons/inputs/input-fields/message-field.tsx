import MessageFieldBaseModel from "../../../styles/inputs/input-fields/message-field-base-model-style";
import React from "react";
import MoreIcon from '../../icons/More-Icon.svg'
import SendIcon from '../../icons/Icon-Send.svg'

interface MessageFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MessageField: React.FC<MessageFieldProps> = ({
  value,
  onChange,
}) => {
  return (
    <MessageFieldBaseModel isEmpty={value === '' || value === undefined}>
        <div className="plus-button">
            <img src={MoreIcon} alt="" />
        </div>
        <input className="messeging-input"
            type='text'
            placeholder='Type your message here....'
            value={value}
            onChange={onChange}
        />

        <img src={SendIcon} alt="" className="send-button" />
    </MessageFieldBaseModel>
  );
};

export default MessageField;

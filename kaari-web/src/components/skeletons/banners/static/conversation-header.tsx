import ConversationHeaderBaseModel from "../../../styles/banners/static/conversation-header-base-model-style";
import { useTranslation } from 'react-i18next';
import warningIcon from '../../icons/Report-Icon.svg'
import deleteIcon from '../../icons/Delete-Icon.svg'

interface ConversationHeaderProps {
  senderName: string;
  senderPic: string;
  lastOnline: string;
  isTyping?: boolean;
  isOnline?: boolean;
  onDeleteConversation?: () => void;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({ 
  senderName, 
  senderPic, 
  lastOnline,
  isTyping = false,
  isOnline = false,
  onDeleteConversation
}) => {
    const { t } = useTranslation();
    
    const getStatusClass = () => {
      if (isTyping) return 'typing';
      if (isOnline) return 'online';
      return '';
    };

    return (
        <ConversationHeaderBaseModel>
            <div className="profile-show-case">
                <img src={senderPic} alt={senderName} />
                <div className="text">
                    <div className="name">{senderName}</div>
                    <div className={`last-online ${getStatusClass()}`}>{lastOnline}</div>
                </div>
            </div>
            <div className="controls">
                <div className="control-button" title={t('messages.report')}>
                    <img src={warningIcon} alt={t('messages.report')} />
                </div>
                
                {onDeleteConversation && (
                  <div 
                    className="control-button" 
                    title={t('messages.delete_conversation')}
                    onClick={onDeleteConversation}
                  >
                    <img src={deleteIcon} alt={t('messages.delete_conversation')} />
                  </div>
                )}
                
            </div>
        </ConversationHeaderBaseModel>
    );
};


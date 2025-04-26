import ConversationHeaderBaseModel from "../../../styles/banners/static/conversation-header-base-model-style";
import { useTranslation } from 'react-i18next';
import starIcon from '../../icons/Icon-Star.svg'
import warningIcon from '../../icons/Report-Icon.svg'
import dotsIcon from '../../icons/Dot-Menu.svg'



export const ConversationHeader = ( { senderName, senderPic, lastOnline }: { senderName: string, senderPic: string, lastOnline: string } ) => {
    const { t } = useTranslation();
    
    return (
        <ConversationHeaderBaseModel>
            <div className="profile-show-case">
                <img src={senderPic} alt={senderName} />
                <div className="text">
                    <div className="name">{senderName}</div>
                    <div className="last-online">{lastOnline}</div>
                </div>
                
            </div>
            <div className="controls">
                    <img src={warningIcon} alt={t('messages.report')} />
                    <img src={starIcon} alt={t('messages.favorite')} />
                    <img className="dots" src={dotsIcon} alt={t('messages.options')} />
            </div>
        </ConversationHeaderBaseModel>
        
    );
};


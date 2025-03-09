import ConversationHeaderBaseModel from "../../../styles/banners/static/conversation-header-base-model-style";

import starIcon from '../../icons/Icon-Star.svg'
import warningIcon from '../../icons/Report-Icon.svg'
import dotsIcon from '../../icons/Dot-Menu.svg'



export const ConversationHeader = ( { senderName, senderPic, lastOnline }: { senderName: string, senderPic: string, lastOnline: string } ) => {
    return (

        <ConversationHeaderBaseModel>
            <div className="profile-show-case">
                <img src={senderPic} alt="" />
                <div className="text">
                    <div className="name">{senderName}</div>
                    <div className="last-online">{lastOnline}</div>
                </div>
                
            </div>
            <div className="controls">
                    <img src={warningIcon} alt="" />
                    <img src={starIcon} alt="" />
                    <img className="dots" src={dotsIcon} alt="" />
            </div>
        </ConversationHeaderBaseModel>
        
    );
};


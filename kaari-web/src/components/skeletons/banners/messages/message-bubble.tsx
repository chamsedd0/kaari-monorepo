import { MessageBubbleBaseModelStyle } from "../../../styles/banners/messages/message-bubble-base-model-style";
import checkIcon from '../../icons/Check-Icon.svg'





export const MessageBubble = ( { variant, message, timestamp }: { variant: "primary" | "secondary", message: string, timestamp: string } ) => {
    return (
        <MessageBubbleBaseModelStyle variant={variant}>

            <div className="text">
                {message}
           </div>

           <div className="timestamp">
                <img src={checkIcon} alt="check" />
                {timestamp}
                
           </div>


        </MessageBubbleBaseModelStyle>
    );
};


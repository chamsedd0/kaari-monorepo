import React from 'react';
import { CardBaseModelStyleMessages } from '../../styles/cards/card-base-model-style-messages';
import { Theme } from '../../../theme/theme';

interface MessagesCardProps {
    title?: string;
    message?: string;
    img?: string;
    name?: string;
    messageCount?: number;
    isRead?: boolean;
    onViewMore?: () => void;
}

const MessagesCard: React.FC<MessagesCardProps> = ({
    title = "Messages",
    message = "",
    img = "",
    name = "User",
    messageCount = 0,
    isRead = false,
    onViewMore
}) => {
    return (
        <CardBaseModelStyleMessages>
            <div className="title-viewmore-container">
                <h3 className="title">{title}</h3>
                <span className="viewmore" onClick={onViewMore}>View More</span>
            </div>
            <div className="chat-container">
                <div className="chat-box">
                    <img 
                        src={img} 
                        alt={`${name}'s profile`} 
                        className="profile-picture"
                    />
                    <div className="text-container">
                        <span className="name">{name}</span>
                        <span className="message">{message}</span>
                    </div>
                    <div className="end-container">
                        <svg 
                            className="icon" 
                            width="14" 
                            height="14" 
                            viewBox="0 0 14 14" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                d="M13 1L1 13M1 1L13 13" 
                                stroke={isRead ? Theme.colors.gray2 : Theme.colors.black} 
                                strokeWidth="1.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="details">{"Details"}</span>
                    </div>
                </div>
            </div>
            <div className="chat-container">
                <div className="chat-box">
                    <img 
                        src={img} 
                        alt={`${name}'s profile`} 
                        className="profile-picture"
                    />
                    <div className="text-container">
                        <span className="name">{name}</span>
                        <span className="message">{message}</span>
                    </div>
                    <div className="end-container">
                        <svg 
                            className="icon" 
                            width="14" 
                            height="14" 
                            viewBox="0 0 14 14" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                d="M13 1L1 13M1 1L13 13" 
                                stroke={isRead ? Theme.colors.gray2 : Theme.colors.black} 
                                strokeWidth="1.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="details">{"Details"}</span>
                    </div>
                </div>
            </div>
        </CardBaseModelStyleMessages>
    );
};

export default MessagesCard;

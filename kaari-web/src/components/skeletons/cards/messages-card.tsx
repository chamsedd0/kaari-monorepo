import React from 'react';
import { CardBaseModelStyleMessages } from '../../styles/cards/card-base-model-style-messages';
import { Theme } from '../../../theme/theme';
import { useTranslation } from 'react-i18next';

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
    title,
    message = "",
    img = "",
    name = "",
    messageCount = 0,
    isRead = false,
    onViewMore
}) => {
    const { t } = useTranslation();
    
    return (
        <CardBaseModelStyleMessages>
            <div className="title-viewmore-container">
                <h3 className="title">{title || t('advertiser_dashboard.dashboard.messages')}</h3>
                <span className="viewmore" onClick={onViewMore}>{t('common.view_more', 'View More')}</span>
            </div>
            <div className="chat-container">
                <div className="chat-box">
                    <img 
                        src={img} 
                        alt={t('advertiser_dashboard.messages.profile_picture_alt', '{{name}}\'s profile', { name })} 
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
                        <span className="details">{t('common.details', 'Details')}</span>
                    </div>
                </div>
            </div>
            <div className="chat-container">
                <div className="chat-box">
                    <img 
                        src={img} 
                        alt={t('advertiser_dashboard.messages.profile_picture_alt', '{{name}}\'s profile', { name })} 
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
                        <span className="details">{t('common.details', 'Details')}</span>
                    </div>
                </div>
            </div>
        </CardBaseModelStyleMessages>
    );
};

export default MessagesCard;

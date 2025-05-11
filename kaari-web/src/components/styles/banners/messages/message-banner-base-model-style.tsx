import { Theme } from "../../../../theme/theme";    
import styled from "styled-components";

export const MessageBannerBaseModelStyle = styled.div`
    width: 100%;
    background-color: transparent;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: rgba(246, 248, 250, 0.8);
        border-color: rgba(0, 0, 0, 0.04);
        transform: translateY(-1px);
    }
    
    &.active {
        background-color: rgba(0, 87, 255, 0.04);
        border-color: rgba(0, 87, 255, 0.1);
        
        &:hover {
            background-color: rgba(0, 87, 255, 0.08);
        }
    }

    .banner {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .profile-image {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            object-fit: cover;
            border: 1px solid rgba(0, 0, 0, 0.04);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            transition: transform 0.2s ease;
            flex-shrink: 0;
            
            &:hover {
                transform: scale(1.05);
            }
        }
        
        .content {
            display: flex;
            flex-direction: column;
            flex: 1;
            gap: 4px;
            min-width: 0;
            
            .top-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                
                .name {
                    font-weight: 600;
                    font-size: 14px;
                    color: ${Theme.colors.black};
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .time {
                    font-size: 12px;
                    color: #6B7280;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
            }
            
            .bottom-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                
                .message {
                    font-size: 13px;
                    color: #6B7280;
                    max-width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.4;
                }
                
                .unread-indicator {
                    display: ${props => props.unread > 0 ? 'flex' : 'none'};
                    align-items: center;
                    justify-content: center;
                    min-width: 20px;
                    height: 20px;
                    border-radius: 10px;
                    background-color: ${Theme.colors.secondary};
                    color: white;
                    font-size: 11px;
                    font-weight: 600;
                    padding: 0 6px;
                    flex-shrink: 0;
                    margin-left: 8px;
                    
                    animation: pulse-light 2s infinite;
                    
                    @keyframes pulse-light {
                        0% {
                            box-shadow: 0 0 0 0 rgba(0, 87, 255, 0.4);
                        }
                        70% {
                            box-shadow: 0 0 0 6px rgba(0, 87, 255, 0);
                        }
                        100% {
                            box-shadow: 0 0 0 0 rgba(0, 87, 255, 0);
                        }
                    }
                }
            }
        }
    }
`;


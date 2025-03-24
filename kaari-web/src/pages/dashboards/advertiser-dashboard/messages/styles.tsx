import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const MessagesPageStyle = styled.div`
    width: 100%;

    .messages-page-layout {
        display: flex;
        width: 100%;
        height: 100%;
        min-height: 600px;
        max-height: 600px;
        border-radius: ${Theme.borders.radius.lg};
        border: ${Theme.borders.primary};
        padding: 20px;
    }

    .conversations-list {
        display: flex;
        flex-direction: column;
        min-width: 280px;
        width: 280px;
        transition: all 0.3s ease;
        overflow: hidden;
        position: relative;
        
        &.collapsed {
            width: 0;
            min-width: 0;
            padding: 0;
            margin: 0;
        }
    }

    .conversations-header {
        border-bottom: ${Theme.borders.primary};
        padding-bottom: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        h2 {
            font: ${Theme.typography.fonts.h4B};
            color: ${Theme.colors.black};
        }

        .actions {
            display: flex;
            gap: 12px;
            align-items: center;
            justify-content: center;


            .edit-button, .delete-button {
                cursor: pointer;
                transition: all 0.3s ease;

                &:hover {
                    opacity: 0.8;
                }
            }
        }
    }

    .conversations-list-content {
        flex: 1;
        padding: 0px;
        padding-right: 20px;
        display: flex;
        flex-direction: column;
        transition: opacity 0.3s ease;
        width: 100%;
        
        .conversations-list.collapsed & {
            opacity: 0;
        }
    }

    .conversation-item {
        border-bottom: ${Theme.borders.primary};

        &:last-child {
            border-bottom: none;
        }
    }

    .toggle-panel-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-right: 20px;
        background-color: transparent;
        
        img {
            width: 24px;
            height: 24px;
            transition: transform 0.3s ease;
        }
        
        &.collapsed img {
            transform: rotate(-180deg) ;
        }
    }

    .chat-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: ${Theme.colors.fifth};
        border-radius: ${Theme.borders.radius.md};
        padding: 16px;
        border: ${Theme.borders.primary};
        width: 100%;
        transition: all 0.3s ease;
    }
    
    .conversation-header-wrapper {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
    }
    
    .chat-content {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 16px;
        padding: 20px 0px;
        width: 100%;
    }

    .message-container {
        width: 100%;
        display: flex;
        align-items: flex-end;
        
        .avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;
            
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        
        &.sender {
            justify-content: flex-start;
            
            .avatar {
                margin-right: 8px;
            }
            
            .message-bubble {
                margin-right: auto;
                margin-left: 8px;
                max-width: 200px;
                @media (max-width: 1400px) {
                    max-width: 200px;
                }
            }
        }
        
        &.receiver {
            justify-content: flex-end;
            
            .avatar {
                order: 1;
                margin-left: 8px;
            }
            
            .message-bubble {
                margin-left: auto;
                margin-right: 8px;
                max-width: 400px;
                @media (max-width: 1400px) {
                    max-width: 200px;
                }
            }
        }
    }
`;

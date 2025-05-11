import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const MessagesPageStyle = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    position: relative;
    background-color: #f7f9fc;

    .messages-page-layout {
        display: flex;
        height: calc(75vh - 70px);
        padding: 20px;
        gap: 20px;
        
        .error-state {
            background: white;
            border-radius: 12px;
            padding: 32px;
            margin: auto;
            text-align: center;
            max-width: 480px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
            border: 1px solid #eaecf0;
            
            h3 {
                color: #dc2626;
                margin-bottom: 16px;
                font-size: 22px;
                font-weight: 600;
                letter-spacing: -0.2px;
            }
            
            p {
                margin-bottom: 24px;
                line-height: 1.6;
                color: #4b5563;
                font-size: 15px;
            }
            
            button {
                background-color: #0057FF;
                color: white;
                border: none;
                border-radius: 8px;
                padding: 12px 24px;
                font-size: 15px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                
                &:hover {
                    background-color: #0046cc;
                    transform: translateY(-2px);
                }
                
                &:active {
                    transform: translateY(0);
                }
            }
    }

    .conversations-list {
            background: white;
            border-radius: 12px;
            overflow-y: auto;
        width: 280px;
            height: 100%;
            flex-shrink: 0;
            transition: all 0.25s ease;
        position: relative;
            border: ${Theme.borders.primary};
        
        &.collapsed {
            width: 0;
            padding: 0;
            margin: 0;
                overflow: hidden;
                opacity: 0;
            }
            
            .conversations-list-content {
                padding: 16px;
                display: flex;
                flex-direction: column;
                height: 100%;

    .conversations-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
                    padding: 25px 0px;
                    padding-top: 9px;
                    margin-bottom: 20px;
                    border-bottom: ${Theme.borders.primary};
                    
                    h2 {
                        font-size: 18px;
                        font-weight: 600;
                        color: #111827;
                        margin: 0;
        }

        .actions {
            display: flex;
                        gap: 8px;
                        
                        .edit-button, .delete-button {
                            border-radius: 6px;
                            width: 32px;
                            height: 32px;
                            display: flex;
            align-items: center;
            justify-content: center;
                cursor: pointer;
                            transition: all 0.2s ease;

                &:hover {
                                background: #f3f4f6;
                            }
                            
                            &:active {
                                background: #e5e7eb;
                            }
                            
                            img {
                                width: 16px;
                                height: 16px;
                                opacity: 0.75;
                            }
                        }
                    }
                }
                
                .conversation-list {
        display: flex;
        flex-direction: column;
                    gap: 8px;
                    overflow-y: auto;
                    flex: 1;
                    
                    /* Custom scrollbar */
                    &::-webkit-scrollbar {
                        width: 4px;
                    }
                    
                    &::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    
                    &::-webkit-scrollbar-thumb {
                        background-color: rgba(0, 0, 0, 0.2);
                        border-radius: 4px;
        }
    }

    .conversation-item {
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.15s ease;

    }

                .loading-state, .empty-state {
        display: flex;
        align-items: center;
        justify-content: center;
                    height: 100%;
                    color: #6b7280;
                    font-size: 14px;
                    text-align: center;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .loading-state {
                    &::before {
                        content: '';
                        margin-bottom: 8px;
                        border: 2px solid #f3f4f6;
                        border-top: 2px solid #0057FF;
                        border-radius: 50%;
            width: 24px;
            height: 24px;
                        animation: spin 0.8s linear infinite;
                    }
                }
                
                .empty-state {
                    &::before {
                        content: "💬";
                        font-size: 32px;
                        margin-bottom: 8px;
                    }
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
        }
    }

    .chat-area {
        display: flex;
        flex-direction: column;
            flex: 1;
            background: white;
            border-radius: 12px;
            overflow: hidden;
        border: ${Theme.borders.primary};
            transition: all 0.25s ease;
    
    .conversation-header-wrapper {
        display: flex;
        align-items: center;
                padding: 16px;
                border-bottom: ${Theme.borders.primary};
                background-color: white;
                
                .toggle-panel-button {
                    background: none;
                    border:none;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-right: 12px;
                    padding: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    
                    
                    
                    img {
                        width: 18px;
                        height: 18px;
                        transition: transform 0.25s ease;
                        opacity: 0.75;
                        transform: rotate(180deg);
                    }
                    
                    &.collapsed {
                        img {
                            transform: rotate(0deg);
                        }
                    }
                }
            }
            
            .messages-container {
        flex: 1;
                padding: 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
                min-height: 300px;
                max-height: calc(100vh - 170px);
                
                /* Custom scrollbar */
                &::-webkit-scrollbar {
                    width: 4px;
                }
                
                &::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                &::-webkit-scrollbar-thumb {
                    background-color: rgba(0, 0, 0, 0.2);
                    border-radius: 4px;
                }
                
                .messages-loading, .messages-empty {
        display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 300px;
                    color: #6b7280;
                    font-size: 14px;
                    text-align: center;
                }
                
                .messages-loading::before {
                    content: '';
                    width: 28px;
                    height: 28px;
            border-radius: 50%;
                    border: 2px solid #f3f4f6;
                    border-top: 2px solid #0057FF;
                    margin-bottom: 12px;
                    animation: spin 0.8s linear infinite;
                }
                
                .messages-empty::before {
                    content: "💬";
                    font-size: 32px;
                    margin-bottom: 8px;
                }
            }
            
            .chat-content {
                display: none;
            }
                
            .no-conversation-selected {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: #6b7280;
                padding: 24px;
                text-align: center;
                background-color: #f9fafb;
                
                h3 {
                    font-size: 18px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 8px;
                }
                
                p {
                    font-size: 14px;
                    color: #4b5563;
                    max-width: 280px;
                    line-height: 1.5;
                }
                
                &::before {
                    content: "👋";
                    font-size: 36px;
                    margin-bottom: 16px;
                }
            }
            
            .chat-footer {
                padding: 16px;
                background-color: white;
                border-top: 1px solid #eaecf0;
            }
        }
    }
    
    /* Message bubble styles */
    .primary {
        background-color: white !important;
        color: #111827 !important;
        align-self: flex-start;
        border-radius: 16px 16px 16px 4px !important;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        margin-right: auto;
        border: 1px solid #eaecf0;
        max-width: 75%;
        transition: box-shadow 0.2s ease;
        
        &:hover {
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .message-text {
            font-size: 14px !important;
            line-height: 1.5 !important;
        }
        
        .timestamp {
            font-size: 11px !important;
            color: #9ca3af !important;
            margin-top: 4px !important;
        }
    }
    
    .secondary {
        background-color: ${Theme.colors.secondary} !important;
        color: white !important;
        align-self: flex-end;
        border-radius: 16px 16px 4px 16px !important;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        margin-left: auto;
        max-width: 75%;
        transition: box-shadow 0.2s ease;
        
        &:hover {
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }
        
        .message-text {
            font-size: 14px !important;
            line-height: 1.5 !important;
        }
        
        .timestamp {
            font-size: 11px !important;
            color: rgba(255, 255, 255, 0.7) !important;
            margin-top: 4px !important;
        }
        
        .read-status {
            margin-left: 4px;
            
            &.read {
                color: rgba(255, 255, 255, 0.9);
            }
            
            &.unread {
                color: rgba(255, 255, 255, 0.6);
            }
        }
    }
    
    @media (max-width: 768px) {
        .messages-page-layout {
            flex-direction: column;
            height: auto;
            
            .conversations-list {
                width: 100% !important;
                max-height: 300px;
                
                &.collapsed {
                    max-height: 0;
                    padding: 0;
                    margin: 0;
                    border: none;
                }
            }
            
            .chat-area {
                height: calc(100vh - 400px);
                min-height: 400px;
            }
        }
    }
    
    @media (max-width: 480px) {
        .messages-page-layout {
            padding: 12px;
            gap: 12px;
            
            .primary, .secondary {
                max-width: 85%;
            }
            
            .conversations-list {
                .conversations-list-content {
                    padding: 12px;
                }
            }
            
            .chat-area {
                .messages-container, .chat-content {
                    padding: 16px;
                }
                
                .chat-footer {
                    padding: 12px;
                }
            }
        }
    }

    .message-input-wrapper {
        width: 100%;
        padding: 0 16px 16px;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .attachments-preview {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 8px 16px;
        background-color: rgba(0, 0, 0, 0.02);
        border-radius: 12px;
        margin-bottom: 8px;
    }

    .attachment-preview-item {
        display: flex;
        align-items: center;
        gap: 4px;
        background-color: white;
        padding: 6px 10px;
        border-radius: 12px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        font-size: 13px;
    }

    .file-name {
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #333;
    }

    .remove-attachment {
        background: none;
        border: none;
        color: #999;
        font-size: 16px;
        line-height: 1;
        cursor: pointer;
        padding: 0 4px;
        border-radius: 50%;
        
        &:hover {
            background-color: rgba(0, 0, 0, 0.05);
            color: #666;
        }
    }

    .upload-indicator {
        position: absolute;
        bottom: 70px;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${Theme.colors.secondary};
        color: white;
        padding: 8px 16px;
        border-radius: 16px;
        font-size: 13px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        animation: fadeInUp 0.3s ease;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translate(-50%, 10px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
`;

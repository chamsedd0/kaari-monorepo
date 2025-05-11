import { Theme } from "../../../../theme/theme";
import styled from "styled-components";

export const MessageBubbleBaseModelStyle = styled.div<{ variant: "primary" | "secondary" }>`
    display: flex;
    flex-direction: column;
    align-items: ${props => props.variant === "primary" ? "flex-start" : "flex-end"};
    max-width: 320px;
    width: auto;
    padding: 14px 18px;
    gap: 6px;
    position: relative;
    margin: ${props => props.variant === "primary" ? "4px auto 4px 0" : "4px 0 4px auto"};
    
    border-radius: ${props => props.variant === "primary" 
        ? `20px 20px 20px 4px`
        : `20px 20px 4px 20px`};
    background-color: ${props => props.variant === "primary" ? "#FFFFFF" : Theme.colors.secondary};
    box-shadow: ${props => props.variant === "primary" 
        ? "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)"
        : "0 1px 3px rgba(0, 0, 0, 0.1)"};
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    
    &:hover {
        box-shadow: ${props => props.variant === "primary" 
            ? "0 3px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)" 
            : "0 3px 6px rgba(0, 0, 0, 0.15)"};
        transform: translateY(-1px);
        
        .timestamp {
            opacity: 1;
        }
        
        .message-delete-button {
            opacity: 0.85;
            pointer-events: auto;
        }
    }
    
    /* Delete button styling */
    .message-delete-button {
        position: absolute;
        top: -10px;
        ${props => props.variant === "primary" ? "right: -10px;" : "left: -10px;"}
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background-color: #f44336;
        border: 1px solid rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
        z-index: 2;
        opacity: 0;
        pointer-events: none;
        
        &:hover {
            transform: scale(1.1);
            opacity: 1;
        }
        
        img {
            width: 14px;
            height: 14px;
            filter: brightness(0) invert(1);
            transition: all 0.2s ease;
        }
    }
    
    /* Image attachment styling */
    .image-attachment {
        width: 100%;
        max-width: 280px;
        margin-bottom: 8px;
        
        .image-wrapper {
            position: relative;
            width: 100%;
            border-radius: 12px;
            overflow: hidden;
            
            &.loading {
                min-height: 160px;
                background-color: ${props => props.variant === "primary" 
                    ? "rgba(0, 0, 0, 0.05)" 
                    : "rgba(255, 255, 255, 0.1)"};
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .loader {
                width: 32px;
                height: 32px;
                border: 3px solid ${props => props.variant === "primary" 
                    ? "rgba(0, 0, 0, 0.1)" 
                    : "rgba(255, 255, 255, 0.2)"};
                border-top: 3px solid ${props => props.variant === "primary" 
                    ? Theme.colors.secondary
                    : "white"};
                border-radius: 50%;
                animation: spin 1s linear infinite;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1;
            }
            
            img {
                width: 100%;
                display: block;
                cursor: pointer;
                transition: transform 0.3s ease;
                
                &:hover {
                    transform: scale(1.03);
                }
            }
        }
    }
    
    /* File attachment styling */
    .file-attachment {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 10px;
        background-color: ${props => props.variant === "primary" 
            ? "rgba(0, 0, 0, 0.03)" 
            : "rgba(255, 255, 255, 0.1)"};
        border-radius: 12px;
        margin-bottom: 8px;
        
        .file-icon {
            margin-right: 12px;
            flex-shrink: 0;
        }
        
        .file-info {
            flex: 1;
            min-width: 0;
            
            .file-name {
                font-size: 14px;
                font-weight: 500;
                color: ${props => props.variant === "primary" ? "#333" : "white"};
                margin-bottom: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .file-size {
                font-size: 12px;
                color: ${props => props.variant === "primary" ? "#666" : "rgba(255, 255, 255, 0.7)"};
            }
        }
        
        .download-button {
            width: 34px;
            height: 34px;
            border-radius: 8px;
            background-color: ${props => props.variant === "primary" 
                ? "rgba(0, 87, 255, 0.08)" 
                : "rgba(255, 255, 255, 0.15)"};
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 8px;
            flex-shrink: 0;
            transition: all 0.2s ease;
            
            &:hover {
                background-color: ${props => props.variant === "primary" 
                    ? "rgba(0, 87, 255, 0.15)" 
                    : "rgba(255, 255, 255, 0.25)"};
                transform: scale(1.05);
            }
        }
    }
    
    /* Message text styling */
    .text {
        font-size: 15px;
        line-height: 1.6;
        letter-spacing: 0.01em;
        color: ${props => props.variant === "primary" ? Theme.colors.black : "#FFFFFF"};
        width: 100%;
        text-align: left;
        overflow-wrap: break-word;
        margin: 0;
        font-weight: ${props => props.variant === "primary" ? "400" : "400"};
    }

    /* Timestamp styling */
    .timestamp {
        font-size: 11px;
        color: ${props => props.variant === "primary" ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.7)"};
        width: 100%;
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 2px;
        font-weight: 300;
        opacity: 0.7;
        transition: opacity 0.2s ease;
        letter-spacing: 0.01em;
        
        .read-status {
            display: flex;
            align-items: center;
            margin-right: 5px;
            transition: all 0.2s ease;
            position: relative;
            opacity: 0;
            transform: translateY(4px);
            
            &.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            &::before {
                content: '';
                position: absolute;
                width: 6px;
                height: 6px;
                background-color: ${props => props.variant === "primary" 
                    ? "rgba(0, 0, 0, 0.25)" 
                    : "rgba(255, 255, 255, 0.5)"};
                border-radius: 50%;
                right: 0;
                bottom: -2px;
                opacity: 0;
                transition: opacity 0.2s ease;
            }
            
            &:hover {
                transform: scale(1.1);
            }
            
            &.read {
                img {
                    filter: ${props => props.variant === "primary" 
                        ? "brightness(0) saturate(100%) invert(34%) sepia(94%) saturate(1733%) hue-rotate(206deg) brightness(100%) contrast(103%)" 
                        : "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%)"};
                }
                
                &::after {
                    content: "✓";
                    position: absolute;
                    left: -4px;
                    bottom: 0;
                    font-size: 8px;
                    color: ${props => props.variant === "primary" 
                        ? "rgba(0, 87, 255, 0.8)" 
                        : "rgba(255, 255, 255, 0.8)"};
                }
            }
            
            &.not-read::before {
                opacity: 1;
            }
            
            img {
                width: 12px;
                height: 10px;
                filter: ${props => props.variant === "primary" 
                    ? "brightness(0)" 
                    : "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%)"};
            }
        }
    }
    
    /* Animated typing indicator */
    .typing-indicator {
        display: flex;
        align-items: center;
        padding: 4px 8px;
        border-radius: 12px;
        background-color: ${props => props.variant === "primary" 
            ? "rgba(0, 0, 0, 0.05)" 
            : "rgba(255, 255, 255, 0.15)"};
        margin-top: 4px;
        
        .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: ${props => props.variant === "primary" 
                ? "rgba(0, 0, 0, 0.4)" 
                : "rgba(255, 255, 255, 0.7)"};
            margin: 0 2px;
            animation: typing-dot 1.4s infinite ease-in-out;
            
            &:nth-child(1) {
                animation-delay: 0s;
            }
            
            &:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            &:nth-child(3) {
                animation-delay: 0.4s;
            }
        }
    }
    
    @keyframes typing-dot {
        0%, 60%, 100% {
            transform: translateY(0);
        }
        30% {
            transform: translateY(-4px);
        }
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
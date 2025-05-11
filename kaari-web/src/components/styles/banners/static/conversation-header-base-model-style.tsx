import { Theme } from "../../../../theme/theme";
import styled from "styled-components";

const ConversationHeaderBaseModel = styled.div`
    width: 100%;
    height: 100%;
    max-height: 80px;
    background-color: white;
    border-radius: 12px 12px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    position: relative;
    z-index: 5;

    

    .profile-show-case {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 16px;

        img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
            cursor: pointer;
            
        }

        .text {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            flex-direction: column;
            gap: 8px;
            color: ${Theme.colors.black};

            .name {
                font-weight: 700;
                font-size: 17px;
                letter-spacing: 0.01em;
                color: #333;
            }
            
            .last-online {
                font-size: 13px;
                font-weight: 400;
                color: #637381;
                display: flex;
                align-items: center;
                
                &.online {
                    color: #10b981;
                    font-weight: 500;
                    
                    &::before {
                        content: '';
                        width: 8px;
                        height: 8px;
                        background-color: #10b981;
                        border-radius: 50%;
                        display: inline-block;
                        margin-right: 8px;
                    }
                }
                
                &.typing {
                    color: ${Theme.colors.secondary};
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    
                    &::before {
                        content: '';
                        width: 8px;
                        height: 8px;
                        background-color: ${Theme.colors.secondary};
                        border-radius: 50%;
                        display: inline-block;
                        margin-right: 8px;
                        animation: pulse 1.5s infinite;
                    }
                    
                    @keyframes pulse {
                        0% {
                            transform: scale(0.8);
                            opacity: 0.7;
                        }
                        50% {
                            transform: scale(1.2);
                            opacity: 1;
                        }
                        100% {
                            transform: scale(0.8);
                            opacity: 0.7;
                        }
                    }
                }
            }
        }
    }

    .controls {
        display: flex;
        align-items: center;
        gap: 16px;
        padding-right: 8px;
        
        .control-button {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.25s ease;
            background-color: #f5f7fa;
            border: 1px solid rgba(0, 0, 0, 0.03);
            
            &:hover {
                background-color: #e9edf2;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
            }
            
            &:active {
                transform: translateY(0);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            
            &:nth-child(3) {
                background-color: #ffebee;
                border-color: #ffcdd2;
                
                &:hover {
                    background-color: #ffcdd2;
                }
                
                img {
                    opacity: 0.9;
                }
            }
            
            img {
                width: 20px;
                height: 20px;
                transition: all 0.3s ease;
                opacity: 0.7;
                
                &:hover {
                    opacity: 1;
                    transform: scale(1.1);
                }
            }
        }

        .dots {
            align-self: center;
            width: 22px;
            height: 22px;
            cursor: pointer;
            opacity: 0.7;
            
            &:hover {
                opacity: 0.95;
            }
        }
    }
`

export default ConversationHeaderBaseModel;
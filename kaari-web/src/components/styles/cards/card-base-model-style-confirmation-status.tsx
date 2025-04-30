import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

export const CardBaseModelStyleConfirmationStatus = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: start;
    width: 100%;
    background: linear-gradient(to right, rgba(159, 50, 225, 1), rgba(67, 13, 174, 1));
    border-radius: ${Theme.borders.radius.lg};
    max-height: 320px;
    margin-bottom: 2rem;
    overflow: hidden;
    
    &.accepted {
        background: linear-gradient(90deg, #00A6DB 0%, #00D072 100%);
    }
    
    &.rejected {
        background: linear-gradient(90deg, ${Theme.colors.secondary} 0%, #FF3B5C 100%);
    }
    
    &.completed {
        background: linear-gradient(90deg, #00A6DB 0%, #00D072 100%);
        position: relative;
        overflow: visible;
        min-height: 320px;
        
        .right-container {
            position: static;
            
            img {
                position: absolute;
                bottom: 0;
                right: 10px;
                width: auto;
                height: 220px;
                max-height: 80%;
                object-fit: contain;
                @media (max-width: 768px) {
                    height: 180px;
                    right: 10px;
                }
                @media (max-width: 480px) {
                    height: 130px;
                    opacity: 0.9;
                }
            }
        }
        
        .left-container {
            position: relative;
            z-index: 2;
            width: 70%;
            @media (max-width: 768px) {
                width: 80%;
            }
            @media (max-width: 480px) {
                width: 100%;
            }
        }
    }
    
    &.payment-failed {
        background: linear-gradient(90deg, ${Theme.colors.secondary} 0%, #FF3B5C 100%);
    }
    
    &.refund-pending {
        background: linear-gradient(90deg, ${Theme.colors.secondary} 0%, #9C4DF4 100%);
    }
    
    &.refund-processed {
        background: linear-gradient(90deg, #00A6DB 0%, #00D072 100%);
    }
    
    &.moved-in {
        background: linear-gradient(90deg, #00A6DB 0%, #4caf50 100%);
        
        .right-container {
            padding: 1.5rem;
            
            .refund-timer {
                width: 100%;
                
                .timer-label {
                    font: ${Theme.typography.fonts.mediumB};
                    color: white;
                    margin-bottom: 1rem;
                    text-align: center;
                }
                
                .countdown-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    
                    .countdown-segment {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: ${Theme.borders.radius.sm};
                        padding: 0.75rem 0.5rem;
                        min-width: 60px;
                        
                        .count {
                            font: ${Theme.typography.fonts.h3};
                            color: white;
                        }
                        
                        .label {
                            font: ${Theme.typography.fonts.smallM};
                            color: rgba(255, 255, 255, 0.8);
                        }
                    }
                    
                    .separator {
                        font: ${Theme.typography.fonts.h3};
                        color: white;
                        margin-top: -0.5rem;
                    }
                }
            }
            
            .refund-expired {
                text-align: center;
                
                .expired-message {
                    font: ${Theme.typography.fonts.mediumB};
                    color: white;
                    margin-bottom: 1rem;
                }
                
                img {
                    max-width: 120px;
                    height: auto;
                }
            }
        }
    }

    .left-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 25px;
        width: 65%;
        padding: 30px;

        .confirmation-status-text {
            font: ${Theme.typography.fonts.largeM};
            color: ${Theme.colors.white};
        }

        .h3-text {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.white};
        }

        .text16-text {
            font: ${Theme.typography.fonts.text16};
            color: ${Theme.colors.white};
            max-width: 90%;
        }

        .button-container {
            width: 100%;
            display: flex;
            gap: 16px;
        }
    }
    
    .right-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 35%;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;
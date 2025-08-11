import styled from 'styled-components';
import { Theme } from '../../../../../../theme/theme';

export const ProfileSectionStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 40px;
    width: 100%;

    .section-title {
        font: ${Theme.typography.fonts.h2};
        color: ${Theme.colors.black};
    }

    .profile-image-container {
        display: flex;
        align-items: center;
        gap: 16px;
        

        .profile-image {
            width: 120px;
            height: 120px;
            border-radius: ${Theme.borders.radius.round};
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            box-shadow: 0 10px 24px rgba(0,0,0,0.08);
            &.aura--agency {
                box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.15), 0 12px 28px rgba(147,51,234,0.18);
            }
            &.aura--broker {
                box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15), 0 12px 28px rgba(99,102,241,0.18);
            }
            &.aura--landlord {
                box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15), 0 12px 28px rgba(16,185,129,0.18);
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .text-button {
            font: ${Theme.typography.fonts.link16};
            color: ${Theme.colors.secondary};
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                color: ${Theme.colors.primary};
            }
        }

        .edit-photo-btn {
            border: 1px solid ${Theme.colors.tertiary};
            background: #fff;
            color: ${Theme.colors.black};
            font: ${Theme.typography.fonts.mediumM};
            border-radius: 999px;
            padding: 8px 12px;
            cursor: pointer;
            box-shadow: 0 6px 14px rgba(0,0,0,0.06);
            transition: transform 0.15s ease, box-shadow 0.15s ease;
            &:hover { transform: translateY(-1px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
            &:active { transform: translateY(0); }
        }

        .role-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            border-radius: 999px;
            border: 1px solid ${Theme.colors.tertiary};
            font-size: 12px;
            color: ${Theme.colors.black};
            background: #fff;
            box-shadow: 0 6px 14px rgba(0,0,0,0.06);
        }
    }

    .profile-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        width: 100%;
        gap: 20px;
   
        .profile-inbut-label {
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.black}; 
        }
        
        .text-button {
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${Theme.colors.secondary};
            font: ${Theme.typography.fonts.link16};
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 8px 0;
            text-decoration: underline;
            width: fit-content;
            
            &:hover {
                opacity: 0.8;
            }
            
            &:active {
                opacity: 0.6;
            }
        }
        
        .languages-container {
            display: flex;
            flex-direction: column;
            
            .text-button {
                display: inline-flex;
                align-items: center;
                color: #9333ea;
                font: ${Theme.typography.fonts.mediumM};
                font-weight: 500;
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 8px 12px;
                text-decoration: none;
                border-radius: 20px;
                width: fit-content;
                transition: all 0.2s ease;
                
                &:hover {
                    background-color: rgba(147, 51, 234, 0.08);
                }
                
                &:active {
                    opacity: 0.7;
                }
                
                &:after {
                    content: '+';
                    margin-left: 4px;
                    font-size: 16px;
                }
            }
            
            .selected-languages {
                display: inline-flex;
                flex-wrap: nowrap;
                gap: 6px;
                align-items: center;
                height: 26px;
                
                .language-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font: ${Theme.typography.fonts.mediumM};
                    border-radius: 50px;
                    border: 1px solid transparent;
                    height: 100%;
                    font-size: 14px;
                }
                
                .text-button {
                    margin: 0;
                    width: fit-content;
                    color: #9333ea;
                    text-decoration: none;
                    font-weight: 500;
                    padding: 0;
                    font-size: 14px;
                    
                    &:hover {
                        background-color: transparent;
                        text-decoration: underline;
                    }
                    
                    &:after {
                        content: none;
                    }
                }
            }
        }
    }
    
    .error-message {
        color: ${Theme.colors.error};
        font: ${Theme.typography.fonts.mediumM};
        background-color: ${Theme.colors.tertiary};
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 20px;
    }
    
    .success-message {
        color: ${Theme.colors.success};
        font: ${Theme.typography.fonts.mediumM};
        background-color: ${Theme.colors.tertiary};
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 20px;
    }

    .profile-actions {
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }
`;

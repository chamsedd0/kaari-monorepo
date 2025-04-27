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
                font: ${Theme.typography.fonts.medium};
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
                    font: ${Theme.typography.fonts.medium};
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
        font: ${Theme.typography.fonts.medium};
        background-color: ${Theme.colors.errorLight};
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 20px;
    }
    
    .success-message {
        color: ${Theme.colors.success};
        font: ${Theme.typography.fonts.medium};
        background-color: ${Theme.colors.successLight};
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

import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const ContactsPageStyle = styled.div`
    display: flex;
    width: 100%;
    gap: 40px;

    .main-content{
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 48px;

        .contacts-content{
            display: flex;
            width: 100%;
            gap: 42px;

            .contacts-content-info{
                display: flex;
                flex-direction: column;
                width: 50%;
                gap: 32px;

                .contacts-content-info-title{
                    font: ${Theme.typography.fonts.h3};
                    color: ${Theme.colors.black};
                }

                .contacts-email-number{
                    font: ${Theme.typography.fonts.h4B};
                    color: ${Theme.colors.secondary};
                }

                .contacts-content-description{
                    font: ${Theme.typography.fonts.text16};
                    color: ${Theme.colors.gray2};
                }  

               
            }
            img {
                    height: 100%;
                    width: 100%;
                    max-width: 351px;
                    max-height: 349.28px;
                }
        }

        .social-media-content{
            display: flex;
            flex-direction: column;
            width:100%;
            gap: 28px;
            border-radius: ${Theme.borders.radius.md};
            border: ${Theme.borders.primary};
            padding: 24px;
            
            .social-media-content-title{
                font: ${Theme.typography.fonts.h4B};
                color: ${Theme.colors.black};
            }

            .social-media-box{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                grid-gap: 40px;
                width: 100%;

               .facebook-content{
                display: flex;
                align-items: center;
                justify-content: start;
                gap: 17px;

                .contact-icon{
                    width: 30px;
                    height: 30px;
                }

                .-content-title{
                    font: ${Theme.typography.fonts.text16};
                    color: ${Theme.colors.gray2};
                    transition: all 0.3s ease;


                    &:hover {
                    color: ${Theme.colors.primary};
                }
                }
                
                
               }
                    cursor: pointer;

                
            }
            
        }

        .contact-form{
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 32px;

            .contact-form-title{
                font: ${Theme.typography.fonts.h4B};
                color: ${Theme.colors.black};
            }
            
            .form-result {
                padding: 16px;
                border-radius: 8px;
                margin-bottom: 16px;
                font: ${Theme.typography.fonts.mediumM};
                
                &.success {
                    background-color: rgba(92, 208, 133, 0.1);
                    border: 1px solid rgba(92, 208, 133, 0.5);
                    color: #2e7d32;
                }
                
                &.error {
                    background-color: rgba(244, 67, 54, 0.1);
                    border: 1px solid rgba(244, 67, 54, 0.5);
                    color: #d32f2f;
                }
            }
            
            .contact-form-container {
                display: flex;
                flex-direction: column;
                width: 100%;
                gap: 24px;
                
                .form-row {
                    display: flex;
                    width: 100%;
                    gap: 16px;
                    
                    @media (max-width: 768px) {
                        flex-direction: column;
                    }
                }
                
                .form-group {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    gap: 8px;
                    
                    .form-label{
                        font: ${Theme.typography.fonts.largeB};
                        color: ${Theme.colors.black};
                    }
                    
                    .error-text {
                        font: ${Theme.typography.fonts.smallM};
                        color: #d32f2f;
                        margin-top: 4px;
                    }
                }
                
                .form-error {
                    border-color: #d32f2f !important;
                    
                    &:focus {
                        border-color: #d32f2f !important;
                        box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2) !important;
                    }
                }
            }
        }
    }
    .right {
        display: flex;
        flex-direction: column;
        flex: 0.35;
        gap: 24px;
    }


    .form-button{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 188px;      
    }
`;

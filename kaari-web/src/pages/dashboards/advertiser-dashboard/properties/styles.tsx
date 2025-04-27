import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const PropertiesPageStyle = styled.div`
  display: flex;
    align-items: start;
    gap: 32px;
    width: 100%;

    .properties-section {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 32px;

        .section-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .properties-section-title {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.black};
        }
        
        .error-message {
            padding: 12px 16px;
            background-color: rgba(255, 99, 71, 0.1);
            border-left: 4px solid tomato;
            color: tomato;
            border-radius: 4px;
            margin-bottom: 16px;
        }
        
        .loading-spinner {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 32px;
            color: ${Theme.colors.gray2};
            font: ${Theme.typography.fonts.mediumM};
            
            &:before {
                content: '';
                width: 24px;
                height: 24px;
                border: 3px solid ${Theme.colors.fifth};
                border-top-color: ${Theme.colors.secondary};
                border-radius: 50%;
                animation: spinner 1s linear infinite;
                margin-right: 12px;
            }
            
            @keyframes spinner {
                to {
                    transform: rotate(360deg);
                }
            }
        }
        
        .no-properties-message {
            background-color: ${Theme.colors.white};
            border: ${Theme.borders.primary};
            border-radius: 12px;
            padding: 60px 30px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            
            img {
                width: 120px;
                height: auto;
                margin-bottom: 20px;
            }

            button {
                height: 48px !important;
                width: 200px !important;
                font: ${Theme.typography.fonts.mediumB} !important;
            }
            
            h4 {
                color: ${Theme.colors.primary};
                font: ${Theme.typography.fonts.largeB};
                margin-bottom: 10px;
            }
            
            p {
                color: ${Theme.colors.primary};
                font: ${Theme.typography.fonts.mediumM};
                margin-bottom: 24px;
            }
        }

        .my-properties {
            display: flex;
            flex-direction: column;
            gap: 20px;

            .section-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;

                .title {
                    font: ${Theme.typography.fonts.largeB};
                    color: ${Theme.colors.black};
                }

                .navigation-buttons {
                    display: flex;
                    gap: 12px;

                    button {
                        width: 40px;
                        height: 40px;
                        border-radius: ${Theme.borders.radius.md};
                        border: 1px solid ${Theme.colors.tertiary};
                        background: ${Theme.colors.white};
                        color: ${Theme.colors.black};
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;

                        &:hover {
                            background: ${Theme.colors.tertiary};
                        }
                    }
                }
            }

            .properties-group {
                display: flex;
                gap: 20px;
                overflow-x: auto;
                padding: 10px 0;
                scrollbar-width: none;
                
                &::-webkit-scrollbar {
                    display: none;
                }

                /* Set max-width for property cards */
                > div {
                    min-width: 320px;
                    max-width: 320px;
                    flex-shrink: 0;
                }
            }
        }
    }
`;




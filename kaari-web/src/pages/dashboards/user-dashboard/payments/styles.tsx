import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const PaymentsPageStyle = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    background-color: ${Theme.colors.white};
    align-items: start;
    justify-content: space-between;
    gap: 40px;
    
    .info-container {
        flex: 0.45;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        max-width: 300px;
        gap: 20px;

        .payment-safety-card {
            background-color: ${Theme.colors.white};
            border-radius: ${Theme.borders.radius.md};
            border: ${Theme.borders.primary};
            padding: 24px 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;

            img {
                width: 38px;
                margin-bottom: 8px;
            }

            h3 {
                font: ${Theme.typography.fonts.extraLargeM};
                color: ${Theme.colors.black};
                line-height: 150%;

            }

            p {
                font: ${Theme.typography.fonts.text14};
                color: ${Theme.colors.gray2};
                line-height: 150%;
            }

            .terms {
                display: inline;
                text-decoration: underline;
                cursor: pointer;
                font: ${Theme.typography.fonts.link14};
            }

            .learn-more {
                font: ${Theme.typography.fonts.largeB};
                color: ${Theme.colors.black};
                margin-top: 8px;
                text-decoration: underline;
                cursor: pointer;
                transition: all 0.3s ease;

                &:hover {
                    opacity: 0.8;
                }
            }
        }

        .help-card {
            background-color: ${Theme.colors.white};
            border-radius: ${Theme.borders.radius.md};
            border: ${Theme.borders.primary};
            padding: 32px 16px;
            display: flex;
            flex-direction: column;
            gap: 25px;
            padding-bottom: 63px;

            h3 {
                font: ${Theme.typography.fonts.extraLargeB};
                color: ${Theme.colors.black};
                margin: 0;
            }

            .faq-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                width: 100%;

                &:last-child {
                    border-bottom: none;
                }

                span {
                    font: ${Theme.typography.fonts.text14};
                    font-weight: 700;
                    color: ${Theme.colors.gray2};
                    text-decoration: underline;
                    cursor: pointer;
                }

                .arrow {
                    
                }
            }
        }
    }

    .container {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background-color: ${Theme.colors.white};
        gap: 40px;

        .title-section {
            display: flex;
            flex-direction: column;
            gap: 16px;

            .title {
                font: ${Theme.typography.fonts.h3};
                color: ${Theme.colors.black};
            }

            .control-buttons {
                display: flex;
                gap: 40px;

                .button {
                    font: ${Theme.typography.fonts.extraLargeB};
                    padding: 24px 0px;

                    color: ${Theme.colors.black};
                    border: none;
                    background: none;
                    cursor: pointer;
                    border-bottom: 4px solid transparent;
                    transition: all 0.2s ease;

                    &:hover, &.active {
                        color: ${Theme.colors.secondary};
                        border-bottom: 4px solid ${Theme.colors.secondary};
                    }
                }
            }
        }

        .main-section {
            display: flex;
            flex-direction: column;
            gap: 20px;
            align-items: start;
            justify-content: start;

            .title {
                font: ${Theme.typography.fonts.h4B};
                color: ${Theme.colors.black};
            }

            .subtitle {
                font: ${Theme.typography.fonts.largeM};
                color: ${Theme.colors.gray2};
            }

            .payment-info-saved {
                width: 100%;
                max-height: 90px;
            }
            
            .advanced-filtering-button {
               width: 100%;
               display: flex;
               align-items: center;
               justify-content: start;
               
               button {
                max-width: 200px;
                border-radius: 100px;
               }
            }
        }
    }
`; 
import { Theme } from "../../../theme/theme";
import styled from "styled-components";

export const CardBaseModelStyleCheckout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    min-height: 600px;
    max-width: 350px;
    overflow: hidden;
    
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    background-color: ${Theme.colors.white};
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);

    img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .container {
        width: 100%;    
        padding: 20px;
        padding-top: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 16px;

        .text {
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: center;
            color: ${Theme.colors.black};
            text-align: start;
            gap: 8px;
            width: 100%;

            .title {
                font: ${Theme.typography.fonts.h5};
                width: 100%;
                color: ${Theme.colors.black};
            }

            .move-in-date {
                font: ${Theme.typography.fonts.mediumM};
                width: 100%;
                color: ${Theme.colors.gray2};
            }

            .length-of-stay {
                font: ${Theme.typography.fonts.mediumM};
                width: 100%;
                color: ${Theme.colors.gray2};
            }
        }

        .profile-show-case {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            margin: 8px 0;

            .profile-info {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;

                img {
                    width: 32px;
                    height: 32px;
                    object-fit: cover;
                    border-radius: 50%;
                }

                .profile-name {
                    font: ${Theme.typography.fonts.largeB};
                    color: ${Theme.colors.black};
                }
            }
        }

        .price-details {
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: center;
            gap: 12px;
            width: 100%;
            margin-top: 16px;

            .first {   
                font: ${Theme.typography.fonts.largeB} !important;
                color: ${Theme.colors.black};
                margin-bottom: 4px;

                img {
                    width: 16px;
                    height: 16px;
                    margin-left: 8px;
                }
            }

            .row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.black}; 
                
                b {
                    font: ${Theme.typography.fonts.mediumM};
                    color: ${Theme.colors.gray2};
                }

                span {
                    font: ${Theme.typography.fonts.mediumB};
                    color: ${Theme.colors.black};
                }
            }

            .line-separator {
                width: 100%;
                height: 1px;
                background-color: ${Theme.colors.tertiary};
                margin: 4px 0;
            }

            .total {
                font: ${Theme.typography.fonts.largeB};
                color: ${Theme.colors.black};

                span {
                    font: ${Theme.typography.fonts.largeB};
                    color: ${Theme.colors.secondary};
                }
            }
        }

        .actions {
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: start;
            gap: 8px;
            padding: 8px 0;
            width: 100%;
            margin-top: 16px;

            .cancellation-policy {
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.black};
            }
        }

        .button {
            background-color: transparent;
            color: ${Theme.colors.secondary};
            font: ${Theme.typography.fonts.link14};
            border: none;
            cursor: pointer;
            text-decoration: underline;
            transition: all 0.3s ease;
            padding: 0;
            text-align: left;

            &:hover {
                color: ${Theme.colors.primary};
            }
        }
    }
`;

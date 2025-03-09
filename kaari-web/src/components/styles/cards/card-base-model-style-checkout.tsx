import { Theme } from "../../../theme/theme";
import styled from "styled-components";

export const CardBaseModelStyleCheckout = styled.div`

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    max-height: 800px;
    max-width: 420px;
    overflow: hidden;
    
    
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    background-color: ${Theme.colors.white};
    width: 100%;

    img {
        width: 100%;
        height: 40%;
        max-height: 260px;
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

        gap: 10px;
        width: 100%;

        .title {
            font: ${Theme.typography.fonts.extraLargeB};
            width: 100%;
            color: ${Theme.colors.black};
        }

        .move-in-date {
            font: ${Theme.typography.fonts.largeM};
            width: 100%;
            color: ${Theme.colors.gray};
        }

        .length-of-stay {
            font: ${Theme.typography.fonts.largeM};
            width: 100%;
            color: ${Theme.colors.gray};
        }
    }

    .profile-show-case {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .profile-info {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;

            img {
                width: 48px;
                height: 48px;
                object-fit: cover;
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
        gap: 16px;
        width: 100%;

        .first {   
            
            font: ${Theme.typography.fonts.largeB} !important;

            img {
                width: 24px;
                height: 24px;
                
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
                color: ${Theme.colors.gray};

            }

            span {
                font: ${Theme.typography.fonts.mediumB};
                color: ${Theme.colors.primary};
            }
        }

        .line-separator {
            width: 100%;
            height: 1px;
            background-color: ${Theme.colors.tertiary};
        }

        .total {
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.black};

            span {
                font: ${Theme.typography.fonts.h4B};
                color: ${Theme.colors.secondary};
            }
        }
    }

    .actions {
        display: flex;
        flex-direction: column;
        align-items: end;
        justify-content: end;
        gap: 12px;
        padding: 10px 0;
        width: 100%;

        font: ${Theme.typography.fonts.largeB};
    }

    .button {
        background-color: transparent;
        color: ${Theme.colors.secondary};
        font: ${Theme.typography.fonts.link14};
        border: none;
        cursor: pointer;
        text-decoration: underline;
        transition: all 0.3s ease;

        &:hover {
            color: ${Theme.colors.primary};
        }
    }
    }

`;

import styled from "styled-components";
import { Theme } from "../../../theme/theme";



export const PropertyRequestCardStyle = styled.div`

    width: 100%;
    height: 100%;

    display: flex;
    align-items: start;
    justify-content: start;
    flex-direction: column;

    gap: 28px;


    .title {
        width: 100%;
        font: ${Theme.typography.fonts.h4DB};
        color: ${Theme.colors.black};

        display: flex;
        align-items: start;
        justify-content: start;
        flex-direction: column;
        gap: 16px;
    }

    .advertiser-information {

        width: 100%;
        display: flex;
        align-items: start;
        justify-content: start;
        flex-direction: column;
        gap: 12px;

        .info-title {
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.black};
        }

        .profile-info {

            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .profile {

                display: flex;
                align-items: center;
                justify-content: start;
                gap: 12px;

                img {
                    width: 48px;
                    height: 48px;
                }

                .name {
                    font: ${Theme.typography.fonts.mediumM};
                    color: ${Theme.colors.gray2};
                }

            }
        }
    }

    .move-in-date {
        
        width: 100%;
        display: flex;
        align-items: start;
        justify-content: start;
        flex-direction: column;
        gap: 16px;

        .details {

            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .move-in-date-display {
                border: ${Theme.borders.primary};
                display: flex;
                align-items: center;
                justify-content: center;
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.quaternary};
                padding: 13px 54.5px;
            }

            .buttons {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
            }

        }

    }

    .price-breakdown {

        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 16px;

        .row {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            color: ${Theme.colors.gray2};
            font: ${Theme.typography.fonts.mediumM};

        }

        .first, .total{
            color: ${Theme.colors.black};
            font: ${Theme.typography.fonts.largeB};

            img {
                width: 20px;
                height: 20px;
            }
        }

        .separation-line {
            width: 100%;
            height: 1px;
        }

        .total-price {
            font: ${Theme.typography.fonts.h4B};
            color: ${Theme.colors.secondary};
        }

        .price {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.black};
        }
    }

    .send-request-button {
        width: 100%;
    }

    .disclaimer {
        width: 100%;
        color: ${Theme.colors.primary};
        font: ${Theme.typography.fonts.mediumM};
        text-align: center;
        margin: auto;
    }

`
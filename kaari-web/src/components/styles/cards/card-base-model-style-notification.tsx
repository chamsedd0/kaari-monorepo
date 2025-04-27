import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const NotificationCard = styled.div`
    background-color: ${Theme.colors.white};
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 300px;
    max-width: 400px;
    z-index: 1000;
    position: absolute;

    &:hover {
        background-color: ${Theme.colors.sixth};
    }

    &:active {
        background-color: ${Theme.colors.fifth};
    }

    .card-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        padding: 12px;

        .top-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;

            .left-content {
                display: flex;
                align-items: center;
                gap: 8px;

                .new-container {
                    display: flex;
                    align-items: center;
                    border-radius: ${Theme.borders.radius.extreme};
                    background-color: ${Theme.colors.secondary};
                    padding: 4px 10px;
                    font: ${Theme.typography.fonts.smallB};
                    color: ${Theme.colors.white};
                }

                .notification-title {
                    font: ${Theme.typography.fonts.largeM};
                    color: ${Theme.colors.black};
                }
            }

            .date{
                font: ${Theme.typography.fonts.smallM};
                color: ${Theme.colors.gray};
            }
        }

        .info-text {
            font: ${Theme.typography.fonts.text14};
            color: ${Theme.colors.gray2};
        }
    }
`;
import { Theme } from "../../../../theme/theme";    
import styled from "styled-components";

export const MessageBannerBaseModelStyle = styled.div`
    width: 100%;
    height: 100%;
    background-color: ${Theme.colors.white};
    border: none;
    padding: 15px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    transition: background-color 0.3s ease;
    cursor: pointer;

    &:hover {
        background-color: ${Theme.colors.fifth};
    }

    .content {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 14px;
        height: 100%;
        width: 100%;

        img {
            width: 46px;
            height: 46px;
        }

        .text {
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: space-between;
            color: ${Theme.colors.black};
            gap: 8px;
            width: 100%;

            .name {
                font: ${Theme.typography.fonts.largeB};
                display: flex;
                align-items: center;
                justify-content: center;

                span {
                    margin-left: 8px;
                    color: ${Theme.colors.primary};
                    font: ${Theme.typography.fonts.smallM};
                }
            }

            .message {
                font: ${Theme.typography.fonts.text12};
                max-height: 30px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 150px;
            }
        }
    }

    .counter {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: ${Theme.borders.radius.extreme};
        background-color: ${Theme.colors.secondary};
        color: ${Theme.colors.white};
        font: ${Theme.typography.fonts.smallB};
        padding: 3px 11px;
        text-align: center;

        span {
            margin-top: 2px;
        }
    }

`;


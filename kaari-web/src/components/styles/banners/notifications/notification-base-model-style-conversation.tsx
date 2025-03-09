import { Theme } from "../../../../theme/theme";
import styled from "styled-components";

export const NotificationBaseModelStyleConversation = styled.div`
    width: 100%;
    height: 100%;
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.sm};
    border: ${Theme.borders.primary};
    padding: 20px;
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 24px;
    position: relative;

    .close-button {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 12px !important;
        height: 12px !important;
        cursor: pointer;
        filter: brightness(0);
    }

    .content {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 14px;
        height: 100%;

        img {
            width: 60px;
            height: 60px;
        }

        .text {
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: space-between;
            color: ${Theme.colors.black};
            gap: 8px;

            .name {
                font: ${Theme.typography.fonts.largeB};
            }

            .message {
                font: ${Theme.typography.fonts.text12};
            }
        }
    }

    .actions {
        display: flex;
        flex-direction: column;
        align-items: end;
        justify-content: end;
        height: 100%;
        
        button {
            color: ${Theme.colors.secondary};
            font: ${Theme.typography.fonts.largeB};
            background-color: transparent;
            border: none;
            cursor: pointer;
        }
    }
`;
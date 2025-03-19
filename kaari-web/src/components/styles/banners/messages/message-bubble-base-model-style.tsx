import { Theme } from "../../../../theme/theme";
import styled from "styled-components";

export const MessageBubbleBaseModelStyle = styled.div<{ variant: "primary" | "secondary" }>`
    display: flex;
    flex-direction: column;
    align-items: ${props => props.variant === "primary" ? "flex-start" : "flex-end"};
    max-width: 320px;
    padding: 12px 16px;
    gap: 6px;
    position: relative;
    
    border-radius: ${props => props.variant === "primary" 
        ? `14px 14px 14px 0`
        : `14px 14px 0 14px`};
    background-color: ${props => props.variant === "primary" ? Theme.colors.sixth : Theme.colors.white};
    
    /* Add bubble tail for primary (sender) messages */
    ${props => props.variant === "primary" && `
        &::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: -10px;
            width: 16px;
            border-radius: 50% 50% 50% 50%;
            height: 16px;
            background-color: ${Theme.colors.sixth};
            clip-path: polygon(100% 0, 100% 100%, 0 100%);
        }
    `}
    
    /* Add bubble tail for secondary (receiver) messages */
    ${props => props.variant === "secondary" && `
        &::before {
            content: '';
            position: absolute;
            bottom: 0;
            right: -10px;
            width: 16px;
            border-radius: 50% 50% 50% 50%;
            height: 16px;
            background-color: ${Theme.colors.white};
            clip-path: polygon(0 0, 100% 100%, 0 100%);
        }
    `}
    
    .text {
        font: ${Theme.typography.fonts.text12};
        color: ${Theme.colors.black};
        width: 100%;
        text-align: left;
        overflow-wrap: break-word;
        margin-bottom: 6px;
    }

    .timestamp {
        position: absolute;
        bottom: 6px;
        right: 9px;

        font: ${Theme.typography.fonts.extraSmallB};
        color: ${Theme.colors.gray2};
        width: 100%;
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 4px;

        img {
            display: ${props => props.variant === "secondary" ? "flex" : "none"};
            width: 10px;
            height: 8px;
            filter: brightness(0);
            margin-right: 4px;
        }
    }
`;
import { Theme } from "../../../../theme/theme";
import styled from "styled-components";

export const MessageBubbleBaseModelStyle = styled.div<{ variant: "primary" | "secondary" }>`
    width: 100%;
    height: 100%;
    border-radius: ${props => props.variant === "primary" 
        ? `${Theme.borders.radius.lg} 2px ${Theme.borders.radius.lg} ${Theme.borders.radius.lg}`
        : `2px ${Theme.borders.radius.lg} ${Theme.borders.radius.lg} ${Theme.borders.radius.lg}`};
    background-color: ${props => props.variant === "secondary" ? Theme.colors.senary : Theme.colors.white};
    border: none;
    padding: 10px;
    padding-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    gap: 0px;

    max-height: 100px;
    max-width: 240px;
    color: ${Theme.colors.black};


    .text {
        font: ${Theme.typography.fonts.text12};
        width: 100%;
        text-align: left;
        max-height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;

    }

    .timestamp {
        font: ${Theme.typography.fonts.extraSmallB};
        width: 100%;
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        img {
            display: ${props => props.variant === "primary" ? "flex" : "none"};
            width: 10px;
            height: 8px;
            filter: brightness(0);
            margin-right: 4px;
        }


    }


`;
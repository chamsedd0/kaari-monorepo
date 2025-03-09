import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const CardBaseModelStyleRequest = styled.div`
    width: 100%;
    height: 100%;
    max-height: 400px;
    background-color: ${Theme.colors.white};
    gap: 12px;

    border-radius: ${Theme.borders.radius.sm};
    border: ${Theme.borders.primary};
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-between;
    padding: 16px;

    .title {
        font: ${Theme.typography.fonts.extraLargeB};
        color: ${Theme.colors.primary};
        text-align: start;
        width: 100%;
        margin-top: 10px;
    }

    img {
        width: 100%;
        height: 50%;
        object-fit: cover;
        border-radius: 6px;
    }

    .text {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: center;
        gap: 8px;
        width: 100%;

        .title {
            font: ${Theme.typography.fonts.text16};
            color: ${Theme.colors.black};
            text-align: start;
            width: 100%;

            b {
                font: ${Theme.typography.fonts.largeB};
            }
        }

        .price {
            font: ${Theme.typography.fonts.extraLargeB};
            color: ${Theme.colors.black};
            text-align: start;
            width: 100%;
        }

        .description {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.success};
            text-align: start;
            width: 100%;
        }

        .progress {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: end;
        }
    }

`;
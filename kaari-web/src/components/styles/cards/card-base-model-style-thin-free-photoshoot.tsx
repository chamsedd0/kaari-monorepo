import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const CardBaseModelStyleThinFreePhotoshoot = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 20px;
    max-height: 96px;
    border-radius: ${Theme.borders.radius.lg};
    background: linear-gradient(135deg, rgba(143, 39, 206, 1) 0%, rgba(151, 71, 255, 1) 100%);
    position: relative;
    overflow: hidden;

    .text-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 8px;
        width: 130%;

        .text-16 {
            font: ${Theme.typography.fonts.text16};
            color: ${Theme.colors.white};
        }

        .h3-text {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.white};
        }

    }

    .image-container {
        overflow: visible;
        width: 200px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        width: 130%;
    }
    .image-container img {
        width: 170px;
        height: 200px;
        margin-top: 60px;

    }

    .button-container {
        width: 100%;
    }

`;
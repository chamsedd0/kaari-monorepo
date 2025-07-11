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
    background: ${Theme.colors.secondary};
    position: relative;
    overflow: hidden;

    .text-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 8px;

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
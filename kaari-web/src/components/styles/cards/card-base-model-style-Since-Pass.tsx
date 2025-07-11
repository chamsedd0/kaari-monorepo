import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const CardBaseModelStyleSincePass = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 20px;
    max-height: 96px;
    border-radius: ${Theme.borders.radius.lg};
    background: linear-gradient(to right, rgba(173, 115, 255, 1), rgba(0, 191, 212, 1));

    .container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 15px;

        .title-text {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.white};
        }

        .number-text {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.white};
        }
    }
`;

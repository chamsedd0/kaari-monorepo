import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const CardBaseModelStyleYourPassIsActive = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border-radius: ${Theme.borders.radius.lg};
    background: rgba(255, 255, 255, 0.15);
    padding: 51px 16px;
    max-height: 180px;
    gap: 12px;

    img {
        width: 70px;
        height: 80px;
    }

    .text-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 12px;

        .title-text {
            font: ${Theme.typography.fonts.h4B};
            color: ${Theme.colors.white};
        }

        .text-12 {
            font: ${Theme.typography.fonts.text12};
            color: ${Theme.colors.white};
        }
    }
`;
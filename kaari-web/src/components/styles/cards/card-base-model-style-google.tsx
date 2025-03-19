import styled from "styled-components";
import { Theme } from "../../../theme/theme";
export const CardBaseModelStyleGoogle = styled.div`
    width: 100%;
    background-color: ${Theme.colors.white};
    gap: 20px;
    padding: 20px;


    border-radius: ${Theme.borders.radius.md};
    border: ${Theme.borders.primary};
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-between;

    .title {
        font: ${Theme.typography.fonts.extraLargeB};
        color: ${Theme.colors.black};
        text-align: start;
        width: 100%;
    }

    .description {
        font: ${Theme.typography.fonts.text16};
        color: ${Theme.colors.gray2};
        text-align: start;
        width: 100%;
        line-height: 150%;

    }

    .button {
        width: 100%;
    }

`;
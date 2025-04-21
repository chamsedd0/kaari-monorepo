import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const BwhiteLB48 = styled.button`
    background-color: transparent;
    color: ${Theme.colors.white};
    border: 3px solid ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.extreme};

    font: ${Theme.typography.fonts.largeB};
    padding: 12px 20px;
    max-height: 48px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        color: ${Theme.colors.gray};
        border-color: ${Theme.colors.gray};
    }
`
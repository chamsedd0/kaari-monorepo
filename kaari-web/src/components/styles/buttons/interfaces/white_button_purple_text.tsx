import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const WhiteButtonPurpleText = styled.button`
    background-color: ${Theme.colors.white};
    color: ${Theme.colors.secondary};
    border: none;
    border-radius: ${Theme.borders.radius.extreme};
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: ${Theme.colors.gray};
    }
`
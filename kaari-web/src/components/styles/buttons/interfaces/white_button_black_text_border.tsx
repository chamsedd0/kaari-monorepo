import styled from "styled-components";
import { Theme } from "../../../../theme/theme";


export const WhiteButtonBlackTextBorder = styled.button`
    background-color: ${Theme.colors.white};          
    color: ${Theme.colors.black};

    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.extreme};

    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: rgba(218, 196, 233, 1);          
    }

`
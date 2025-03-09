import styled from "styled-components";
import { Theme } from "../../../../theme/theme";


export const GoogleButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    background-color: ${Theme.colors.white};
    color: ${Theme.colors.black};
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.extreme};

    cursor: pointer;
    transition: all 0.3s ease;

    img {
        width: 16px;
        height: 16px;
    }

    &:hover {
        background-color: ${Theme.colors.tertiary};
    }


`
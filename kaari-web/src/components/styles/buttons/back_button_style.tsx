import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const BackButtonStyle = styled.button`
    background-color: transparent;
    color: ${Theme.colors.gray2};
    font: ${Theme.typography.fonts.mediumB};
    border: none;
    cursor: pointer;
    padding: 8px 24px;
    margin-right: 16px;
    height: 48px;
    border-radius: ${Theme.borders.radius.extreme};
    transition: all 0.3s ease;
    
    &:hover {
        color: ${Theme.colors.primary};
        background-color: ${Theme.colors.gray};
    }
`; 
import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const NavigationCardBaseModalStyle = styled.div`

    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 12px;
    background-color: ${Theme.colors.white};
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.md};

    .nav-link {
        display: flex;
        align-items: center;
        justify-content: start;
        text-decoration: none;
        border: none;
        background-color: transparent;
        cursor: pointer;
        padding: 16px 24px;


        .nav-link-text {
            font: ${Theme.typography.fonts.largeM};
            color: ${Theme.colors.gray2};
            transition: color 0.3s ease;
        }

        &:hover .nav-link {
            color: ${Theme.colors.primary};
        }

        &.active .nav-link {
            color: ${Theme.colors.primary};
        }
    }
`;

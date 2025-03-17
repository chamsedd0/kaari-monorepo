import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const NavigationPannelDashboardStyle = styled.div`

    min-height: 100vh;
    max-width: 208px;
    background-color: ${Theme.colors.white};
    border-right: ${Theme.borders.primary};

    margin-top: 80px;

    display: flex;
    flex-direction: column;

    gap: 30px; 
    align-items: start;
    justify-content: start;
    padding: 60px 20px;
    padding-right: 55px;

    .nav-link {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 8px;
        text-decoration: none;
        border: none;
        background-color: transparent;
        cursor: pointer;


        .nav-link-icon {
            width: 24px;
            height: 24px;
        }

        .nav-link-text {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.black};
            transition: color 0.3s ease;
        }

        &:hover .nav-link-text {
            color: ${Theme.colors.secondary};
        }

        &.active .nav-link-text {
            color: ${Theme.colors.secondary};
        }
    }
`

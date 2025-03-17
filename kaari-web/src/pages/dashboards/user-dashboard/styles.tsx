import styled from "styled-components";
import { Theme } from "../../../theme/theme";


export const UserDashboardStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    gap: 32px;
    flex: 1;
    margin-top: 80px;
    padding: 32px 40px;
    position: relative;

    .section-title {
        font: ${Theme.typography.fonts.h3};
        color: ${Theme.colors.black};
    }

    .section-container {
        width: 100%;
        min-height: 500px;
        opacity: 1;
        transition: opacity 300ms;

        &.animating {
            opacity: 0;
        }
    }
`


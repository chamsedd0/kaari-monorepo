import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const DashboardPageStyle = styled.div`
    display: flex;
    flex-direction: row;
    gap: 24px;
    width: 100%;

    .left {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .right {
        width: 300px;
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .empty-module {
        border: ${Theme.borders.primary};
        border-radius: ${Theme.borders.radius.lg};
        padding: 24px;
        width: 100%;

        h3 {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.black};
            margin-top: 0;
            margin-bottom: 16px;
        }
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 24px;
        text-align: center;

        img {
            width: 64px;
            height: 64px;
            margin-bottom: 16px;
        }

        .title {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.black};
            margin-bottom: 8px;
        }

        .description {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.gray2};
            margin-bottom: 16px;
            max-width: 400px;
        }

        .action-button {
            background-color: ${Theme.colors.primary};
            color: white;
            border: none;
            border-radius: ${Theme.borders.radius.md};
            padding: 12px 24px;
            font: ${Theme.typography.fonts.mediumB};
            cursor: pointer;
            transition: background-color 0.2s;

            &:hover {
                background-color: ${Theme.colors.primary};
            }
        }
    }

    @media (max-width: 1024px) {
        flex-direction: column;

        .right {
            width: 100%;
        }
    }
`;

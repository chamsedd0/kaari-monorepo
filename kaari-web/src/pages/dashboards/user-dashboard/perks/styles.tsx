import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const PerksPageStyle = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 32px;

    .section-title {
        font: ${Theme.typography.fonts.h3};
        color: ${Theme.colors.black};
    }

    .perks-content {
        padding: 24px;
        border: ${Theme.borders.primary};
        border-radius: ${Theme.borders.radius.md};
    }
`;

import styled from "styled-components";
import { Theme } from "../../../theme/theme";
import { PurpleBorderButton } from "./interfaces/purple_border_button";

export const BpurpleMB48 = styled(PurpleBorderButton)`
    font: ${Theme.typography.fonts.mediumB};
    padding: 12px 43.5px;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    max-height: 48px;
    max-width: 100%;

    svg {
        width: 20px;
        height: 20px;
        fill: ${Theme.colors.primary};
    }
`
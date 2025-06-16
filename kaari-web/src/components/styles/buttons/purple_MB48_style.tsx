import styled from "styled-components";
import { Theme } from "../../../theme/theme";
import { PurpleButtonWhiteText } from "./interfaces/purple_button_white_text";


export const PurpleMB48 = styled(PurpleButtonWhiteText)`
    font: ${Theme.typography.fonts.mediumB};
    padding: 0px 22px;

    height: 48px;
    width: 100%;
    max-width: 250px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`

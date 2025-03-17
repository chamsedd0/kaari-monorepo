import styled from "styled-components";
import { Theme } from "../../../theme/theme";
import { PurpleButtonWhiteText } from "./interfaces/purple_button_white_text";


export const PurpleMB48 = styled(PurpleButtonWhiteText)`
    font: ${Theme.typography.fonts.mediumB};
    padding: 17px 33px;

    max-height: 48px;
    width: 100%;
`

import styled from "styled-components";
import { PurpleButtonWhiteText } from "./interfaces/purple_button_white_text";
import { Theme } from "../../../theme/theme";

export const PurpleLB60 = styled(PurpleButtonWhiteText)`

    font: ${Theme.typography.fonts.largeB};
    padding: 22px 55px;
    width: 100%;

    @media (max-width: 1100px) {
        font: ${Theme.typography.fonts.largeB};
        padding: 18px 40px;
    }

    @media (max-width: 900px) {
        font: ${Theme.typography.fonts.mediumB};
        padding: 16px 28px;
    }

    @media (max-width: 700px) {
        font: ${Theme.typography.fonts.mediumB};
        padding: 14px 22px;
    }
    
`;
import styled from "styled-components";
import { PurpleButtonWhiteText } from "./interfaces/purple_button_white_text";
import { Theme } from "../../../theme/theme";

export const PurpleH4B70 = styled(PurpleButtonWhiteText)`

    font: ${Theme.typography.fonts.h4B};
    height: 70px;
    max-width: 70px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 20px;
        height: 20px;
    }
`;
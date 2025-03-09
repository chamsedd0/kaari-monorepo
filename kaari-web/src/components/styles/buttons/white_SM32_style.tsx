import styled from "styled-components";
import { Theme } from "../../../theme/theme";
import { WhiteButtonBlackTextBorder } from "./interfaces/white_button_black_text_border";

export const WhiteSM32 = styled(WhiteButtonBlackTextBorder)`
    font: ${Theme.typography.fonts.smallM};
    padding: 9px 28px;
`;
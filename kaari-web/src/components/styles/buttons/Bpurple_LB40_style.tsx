import styled from "styled-components";
import { Theme } from "../../../theme/theme";
import { PurpleBorderButton } from "./interfaces/purple_border_button";

export const BpurpleLB40 = styled(PurpleBorderButton)`
    font: ${Theme.typography.fonts.largeB};
    padding: 8px 48px;
    max-height: 40px;

`
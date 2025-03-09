import styled from "styled-components";
import { Theme } from "../../../theme/theme";
import { GoogleButton } from "./interfaces/google_button";


export const GoogleSM32 = styled(GoogleButton)`
    max-height: 32px;
    padding: 5px 17px;
    font: ${Theme.typography.fonts.smallM};
    
`
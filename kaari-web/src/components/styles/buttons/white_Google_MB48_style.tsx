import styled from "styled-components";
import { Theme } from "../../../theme/theme";
import { GoogleButton } from "./interfaces/google_button";


export const GoogleMB48 = styled(GoogleButton)`
    max-height: 48px;
    padding: 13px 20px;
    font: ${Theme.typography.fonts.mediumB};
    
`
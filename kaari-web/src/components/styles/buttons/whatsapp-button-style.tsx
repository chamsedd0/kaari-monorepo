import styled from "styled-components";
import { Theme } from "../../../theme/theme";


export const WhatsappButtonStyle = styled.button`
   display: flex;
   align-items: center;
   justify-content: center;
   background-color: ${Theme.colors.success};
   border: ${Theme.borders.primary};
   border-radius: ${Theme.borders.radius.extreme};
   max-height: 32px;
   padding: 8px 20px;
   cursor: pointer;
   transition: all 0.3s ease;
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.white};
  
   
`


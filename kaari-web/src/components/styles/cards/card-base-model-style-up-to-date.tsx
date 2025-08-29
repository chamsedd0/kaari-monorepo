import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const UpToDateCard = styled.div`
    background-color: ${Theme.colors.secondary};
    border-radius: ${Theme.borders.radius.lg};
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 17px;
    align-items: start;
    
    
    
   
   .report-Icon {
    width: clamp(48px, 10vw, 64px);
    height: clamp(48px, 10vw, 64px);
    color: ${Theme.colors.white};
    
    
   }

   .report-title {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.white};
    max-width: 280px;
   }

   .report-description {
    font: ${Theme.typography.fonts.text14};
    color: ${Theme.colors.white};
   }

   .report-button {
    max-width: 280px;
    width: 100%;
    display: flex;
    justify-content: center;
   }

   @media (max-width: 640px) {
     .report-title { max-width: none; }
   }
   
`;
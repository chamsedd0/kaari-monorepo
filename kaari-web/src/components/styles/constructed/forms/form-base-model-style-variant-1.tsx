import styled from "styled-components";
import { FormBaseModel } from "./form-base-model-style";

export const FormBaseModelVariant1 = styled(FormBaseModel)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    max-width: 870px;
    width: 100%;
    
    /* Make the search input and date picker flex-grow to take available space */
    & > div:nth-child(1),
    & > div:nth-child(2) {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 200px;
    }
    
    /* Keep the button at its original size */
    & > button {
      flex-shrink: 0;
    }

    @media (max-width: 1024px) {
        flex-direction: column;
        gap: 24px;
        max-width: 90%;
        
        & > div:nth-child(1),
        & > div:nth-child(2),
        & > button {
          width: 100%;
          max-width: 100%;
        }
    }
    
    @media (max-width: 576px) {
        max-width: 100%;
        padding: 0 16px;
    }
`;
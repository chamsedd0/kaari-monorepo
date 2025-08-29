import { Theme } from "../../../../theme/theme";
import styled from "styled-components";

const CheckBoxBaseModelStyle3 = styled.div`
  display: flex;
  flex-direction: row;
  gap: clamp(12px, 3vw, 24px);
  align-items: center;
  width: 100%;
  
  .checkbox-option {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    
    input[type="radio"] {
      appearance: none;
      width: clamp(16px, 4vw, 20px);
      height: clamp(16px, 4vw, 20px);
      border: ${Theme.colors.tertiary} 1px solid;
      border-radius: 50%;
      margin: 0;
      cursor: pointer;
      position: relative;
      
      &:checked {
        border: ${Theme.colors.tertiary} 1px solid;
        
        &:after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: clamp(8px, 3vw, 12px);
          height: clamp(8px, 3vw, 12px);
          border-radius: 50%;
          background-color: ${Theme.colors.primary};
        }
      }
      
      &:focus {
        outline: none;
      }
    }
    
    label {
      font: ${Theme.typography.fonts.smallB};
      color: ${Theme.colors.black};
    }
  }
`;

export default CheckBoxBaseModelStyle3;

import { Theme } from "../../../../theme/theme";
import styled from "styled-components";

const CheckBoxBaseModelStyle3 = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: center;
  width: 100%;
  
  .checkbox-option {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    
    input[type="radio"] {
      appearance: none;
      width: 20px;
      height: 20px;
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
          width: 12px;
          height: 12px;
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

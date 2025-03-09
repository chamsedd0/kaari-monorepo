import styled from "styled-components";
import InputBaseModel1 from "./input-base-model-style-1";
import { Theme } from "../../../../theme/theme";

const InputBaseModel3 = styled(InputBaseModel1)`
  gap: 0px !important;
  max-width: unset!important;


  input {
    padding: 28px 32px !important;
    border: none !important;
    max-height: 70px !important;

    &::placeholder {
      font: ${Theme.typography.fonts.largeB} !important;
    }
  }
`;

export default InputBaseModel3;

    
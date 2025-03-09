import { Theme } from "../../../../theme/theme";
import styled from "styled-components";

const InputBaseModel1 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  width: 100%;
  max-width: 757px;

  span {
    font: ${Theme.typography.fonts.extraLargeB};
    color: ${Theme.colors.black};
  }

  input {
    width: 100%;
    padding: 22px 24px;
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.extreme};
    font: ${Theme.typography.fonts.largeM};
    color: ${Theme.colors.primary};
    background-color: ${Theme.colors.white};
    transition: all 0.3s ease;

    &::placeholder {
      color: ${Theme.colors.tertiary};
    }

    &:focus {
      outline: none;
    }

    &:disabled {
      background-color: ${Theme.colors.gray};
      cursor: not-allowed;
    }
  }
`;

export default InputBaseModel1;

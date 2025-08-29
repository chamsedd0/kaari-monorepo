import { Theme } from "../../../../theme/theme";
import styled from "styled-components";

const InputBaseModel1 = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 2.6vw, 16px);
  align-items: flex-start;
  width: 100%;

  span {
    font: ${Theme.typography.fonts.largeB};
    color: ${Theme.colors.black};
  }

  input {
    width: 100%;
    padding: clamp(12px, 3.4vw, 22px) clamp(14px, 3.6vw, 24px);
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
  
  @media (max-width: 480px) {
    span { font: ${Theme.typography.fonts.mediumB}; }
  }
`;

export default InputBaseModel1;

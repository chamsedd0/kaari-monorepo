import { Theme } from "../../../../theme/theme";
import styled from "styled-components";

const TextAreaBaseModel1 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  width: 100%;
  
  transition:
    width 0.01s ease,
    height 0.01s ease;

  span {
    font: ${Theme.typography.fonts.largeB};
    color: ${Theme.colors.black};
  }

  textarea {
    width: 100%;
    min-height: 200px;
    padding: 24px;
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.sm};
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

export default TextAreaBaseModel1;

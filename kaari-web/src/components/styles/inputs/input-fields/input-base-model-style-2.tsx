import { Theme } from "../../../../theme/theme";
import styled from "styled-components";

const InputBaseModel2 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  width: 100%;
  max-width: 490px;

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 22px 24px;
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.extreme};

    background-color: ${Theme.colors.white};
  }

  span {
    font: ${Theme.typography.fonts.largeB};
    color: ${Theme.colors.black};
  }
  img {
    cursor: pointer;
    transition: all 0.3s ease;
  }

  input {
    width: 100%;
    transition: all 0.3s ease;
    border: none;
    background-color: transparent;
    font: ${Theme.typography.fonts.largeM};
    color: ${Theme.colors.primary};

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

export default InputBaseModel2;

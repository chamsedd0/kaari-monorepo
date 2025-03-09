import { Theme } from "../../../../theme/theme";
import styled from "styled-components";

const InputDatePicker = styled.div`

  width: 100%;
        
  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-height: 70px;

    gap: 24px;
    width: 100%;
    padding: 28px 32px;
    border: none;
    border-radius: ${Theme.borders.radius.extreme};

    background-color: ${Theme.colors.white};
  }


  p {
    cursor: default;
    pointer-events: none;
    transition: all 0.3s ease;
    font: ${Theme.typography.fonts.largeB};
    color: ${Theme.colors.secondary};
  }

  input {
    width: 100%;
    transition: all 0.3s ease;
    border: none;
    background-color: transparent;
    font: ${Theme.typography.fonts.largeB};
    color: ${Theme.colors.tertiary};

    &::-webkit-calendar-picker-indicator {
      filter: invert(27%) sepia(51%) saturate(4238%) hue-rotate(270deg) brightness(60%) contrast(97%);
      cursor: pointer;
    }


    &::placeholder {
      color: ${Theme.colors.gray};
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

export default InputDatePicker;
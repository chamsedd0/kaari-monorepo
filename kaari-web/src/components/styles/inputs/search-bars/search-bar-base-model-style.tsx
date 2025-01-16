import { Theme } from '../../../../theme/theme';
import styled from 'styled-components';

const SearchBarBaseModel = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 440px;
  padding: 12px 24px;
  border: ${Theme.borders.primary};
  border-radius: ${Theme.borders.radius.extreme};
  background-color: ${Theme.colors.white};
  transition: all 0.3s ease;

  img {
    width: 16px;
    height: 16px;
    color: ${Theme.colors.gray};
    margin-right: 12px;
  }

  input {
    width: 100%;
    border: none;
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.primary};
    background: transparent;

    &::placeholder {
      color: ${Theme.colors.gray};
      font: ${Theme.typography.fonts.mediumM};
    }

    &:focus {
      outline: none;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }
`;

export default SearchBarBaseModel;

import styled from 'styled-components';
import { Theme } from '../../../theme/theme';


const ButtonBaseModel = styled.button`
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: ${Theme.borders.radius.extreme};
  border: none;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 8px;
  max-width: 100%;
  min-width: 95px;
  max-height: 70px;
  min-height: 32px;

  img {
    max-width: 16px;
    max-height: 16px;
  }
`;

export default ButtonBaseModel;


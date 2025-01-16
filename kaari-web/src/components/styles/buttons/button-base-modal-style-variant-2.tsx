import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import ButtonBaseModel from './button-base-modal-style';

const ButtonBaseModel2 = styled(ButtonBaseModel)<{_white?: boolean}>`

  color: ${props => props._white ? Theme.colors.white : Theme.colors.secondary};
  font-family: 'Visby CF';
  background-color: transparent;
  border: ${props => props._white ? '4px solid ' + Theme.colors.white : Theme.borders.button} !important;


  &:hover {
    border: ${props => props._white ? '4px solid ' + Theme.colors.white : Theme.borders.buttonHover} !important;
    color: ${props => props._white ? Theme.colors.white : Theme.colors.primary};
    opacity: ${props => props._white ? 0.6 : 1};
  }
`;

export default ButtonBaseModel2;


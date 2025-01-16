import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import ButtonBaseModel from './button-base-modal-style';

const ButtonBaseModel1 = styled(ButtonBaseModel)<{hoverSecondary?: boolean}>`

  color: ${Theme.colors.white};
  background-color: ${props => props.hoverSecondary ? Theme.colors.primary : Theme.colors.secondary};
  font: ${Theme.typography.fonts.largeB};
  padding: 22px;

  &:hover {
    background-color: ${props => props.hoverSecondary ? Theme.colors.secondary : Theme.colors.primary};
  }
`;

export default ButtonBaseModel1;


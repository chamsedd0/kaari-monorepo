import { Theme } from '../../../theme/theme';
import styled from 'styled-components';
import ButtonBaseModel from './button-base-modal-style';

const ButtonBaseModel3 = styled(ButtonBaseModel)<{ variant?: boolean }>`
  color: ${props => props.variant ? Theme.colors.secondary : Theme.colors.black};
  border: ${props => props.variant ? 'none' : Theme.borders.primary};
  background-color: ${Theme.colors.white};

  &:hover {
    background-color: ${props => props.variant ? `${Theme.colors.white}99` : Theme.colors.tertiary};
  }


`;

export default ButtonBaseModel3;


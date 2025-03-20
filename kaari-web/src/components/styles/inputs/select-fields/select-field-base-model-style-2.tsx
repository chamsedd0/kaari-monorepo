import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { ChevronIcon, Label, Option, SelectDropdown, SelectHeader } from './select-field-base-model-style';
import { SelectContainer } from './select-field-base-model-style';

export const SelectContainer1 = styled(SelectContainer)`
  font: ${Theme.typography.fonts.smallM};
  color: ${Theme.colors.quaternary};
`;

export const SelectHeader1 = styled(SelectHeader)`
    padding: 10px 12px;
    

`;

export const SelectDropdown1 = styled(SelectDropdown) <{ isOpen: boolean }>`
  //same as select-field-base-model-style
`;

export const Option1 = styled(Option)`
  //same as select-field-base-model-style
`;

export const Label1 = styled(Label)`
  font: ${Theme.typography.fonts.mediumB};
`;

export const ChevronIcon1 = styled(ChevronIcon)<{ isOpen: boolean }>`
  img {
    width: 10px;
    height: 10px;
    transform: translateY(30%)
  }
`;

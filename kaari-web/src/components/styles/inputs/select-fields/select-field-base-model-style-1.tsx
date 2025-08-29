// date picker

import styled from 'styled-components';
import { SelectContainer, ChevronIcon, Label, Option, SelectDropdown, SelectHeader } from './select-field-base-model-style';
import { Theme } from '../../../../theme/theme';

export const SelectContainer2 = styled(SelectContainer)`
    //same as select-field-base-model-style
    min-width: 64px !important;
    width: 100%;
    
`;

export const SelectHeader2 = styled(SelectHeader)`
    //same as select-field-base-model-style
    font: ${Theme.typography.fonts.mediumM};
    padding: clamp(10px, 3vw, 14px) clamp(10px, 3vw, 14px);
    
`;

export const SelectDropdown2 = styled(SelectDropdown) <{ isOpen: boolean }>`
    //same as select-field-base-model-style
`;

export const Option2 = styled(Option)`
  //same as select-field-base-model-style
  max-height: 70px;
  overflow-y: auto;
`;

export const Label2 = styled(Label)`
  //same as select-field-base-model-style
  margin-bottom: clamp(8px, 2.6vw, 16px);
`;

export const ChevronIcon2 = styled(ChevronIcon)<{ isOpen: boolean }>`
  //same as select-field-base-model-style

  img {
    width: 15px;
    height: 15px;
  }

`;
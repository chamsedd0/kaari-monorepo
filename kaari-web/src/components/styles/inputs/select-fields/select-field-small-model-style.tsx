import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

export const SelectContainer = styled.div`
  position: relative;
  width: 100%;
  max-height: 50px;
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.tertiary};
  
    * {
        transition: all 0.3s ease;
    }
   
`;

export const SelectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: ${Theme.colors.white};
  border: ${Theme.borders.primary};
  
 

  border-radius: ${Theme.borders.radius.extreme};
  cursor: pointer;
  
  &:hover {
    border-color: ${Theme.colors.secondary};
  }
`;

export const SelectDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background: ${Theme.colors.white};
  border: ${Theme.borders.primary};
  border-radius: ${Theme.borders.radius.sm};
  max-height: 170px;
  overflow-y: auto;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};

`;

export const Option = styled.div<{ selected?: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  background: ${props => props.selected ? Theme.colors.quaternary : 'transparent'};
  
  &:hover {
    background: ${Theme.colors.quaternary};
  }
`;



export const ChevronIcon = styled.div<{ isOpen: boolean }>`
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.2s ease;

  img {
    max-width: 20px;
    max-height: 20px;
  }
`;

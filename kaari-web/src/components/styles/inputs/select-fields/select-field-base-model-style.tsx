import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

export const SelectContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 757px;
  font: ${Theme.typography.fonts.largeB};
  color: ${Theme.colors.primary};
  
    * {
        transition: all 0.3s ease;
    }
`;

export const SelectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 24px;
  background: ${Theme.colors.white};
  border: ${Theme.borders.primary};
  max-height: 60px;

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
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};

`;

export const Option = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  
  &:hover {
    background: ${Theme.colors.quaternary};
  }
`;

export const Label = styled.div`
  margin-bottom: 8px;
  font: ${Theme.typography.fonts.largeB};
  color: ${Theme.colors.black};
`;

export const ChevronIcon = styled.div<{ isOpen: boolean }>`
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.2s ease;
`;

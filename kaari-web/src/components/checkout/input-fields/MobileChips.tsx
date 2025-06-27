import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

interface MobileChipsProps {
  options: Array<{
    id: string;
    label: string;
  }>;
  selectedOptions: string[];
  onChange: (id: string) => void;
  label?: string;
  translationPrefix?: string;
  t?: (key: string) => string;
}

const MobileChips: React.FC<MobileChipsProps> = ({
  options,
  selectedOptions,
  onChange,
  label,
  translationPrefix,
  t
}) => {
  const getLabel = (option: { id: string; label: string }) => {
    if (t && translationPrefix) {
      return t(`${translationPrefix}.${option.label}`);
    }
    return option.label;
  };

  return (
    <ChipsContainer>
      {label && <Label>{label}</Label>}
      <ChipsWrapper>
        {options.map(option => (
          <Chip
            key={option.id}
            isSelected={selectedOptions.includes(option.id)}
            onClick={() => onChange(option.id)}
          >
            {getLabel(option)}
          </Chip>
        ))}
      </ChipsWrapper>
    </ChipsContainer>
  );
};

const ChipsContainer = styled.div`
  width: 100%;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.black};
  margin-bottom: 12px;
  padding-left: 5px;
  font-size: 14px;
  display: block;
`;

const ChipsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
  justify-content: center;
`;

const Chip = styled.div<{ isSelected: boolean }>`
  padding: 10px 16px;
  border-radius: ${Theme.borders.radius.extreme};
  border: 1.5px solid ${props => props.isSelected ? Theme.colors.secondary : Theme.colors.gray};
  background-color: ${props => props.isSelected ? Theme.colors.secondary : Theme.colors.white};
  color: ${props => props.isSelected ? Theme.colors.white : Theme.colors.gray2};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  min-width: 80px;
  
  &:active {
    transform: scale(0.96);
  }
`;

export default MobileChips; 
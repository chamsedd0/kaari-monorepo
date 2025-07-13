import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';

interface MobileStepCounterProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  className?: string;
}

const MobileStepCounter: React.FC<MobileStepCounterProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
  className,
}) => {
  // Check if the current language direction is RTL
  const isRTL = document.documentElement.dir === 'rtl';

  return (
    <StepCounterContainer className={className}>
      <StepInfo isRTL={isRTL}>
        <CurrentStep>{currentStep}</CurrentStep>
        <TotalSteps>/ {totalSteps}</TotalSteps>
      </StepInfo>
      {stepLabels && stepLabels[currentStep - 1] && (
        <StepLabel isRTL={isRTL}>{stepLabels[currentStep - 1]}</StepLabel>
      )}
      <ProgressBar>
        <Progress width={(currentStep / totalSteps) * 100} isRTL={isRTL} />
      </ProgressBar>
    </StepCounterContainer>
  );
};

const StepCounterContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 5px;
`;

interface StepInfoProps {
  isRTL: boolean;
}

const StepInfo = styled.div<StepInfoProps>`
  display: flex;
  align-items: baseline;
  ${props => props.isRTL ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}
`;

const CurrentStep = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: ${Theme.colors.secondary};
`;

const TotalSteps = styled.span`
  font-size: 16px;
  color: ${Theme.colors.gray2};
  margin-left: 4px;
`;

interface StepLabelProps {
  isRTL: boolean;
}

const StepLabel = styled.div<StepLabelProps>`
  font-size: 14px;
  color: ${Theme.colors.black};
  margin-top: 4px;
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${Theme.colors.gray};
  border-radius: 2px;
  overflow: hidden;
  margin-top: 8px;
`;

interface ProgressProps {
  width: number;
  isRTL: boolean;
}

const Progress = styled.div<ProgressProps>`
  height: 100%;
  width: ${props => props.width}%;
  background-color: ${Theme.colors.success};
  border-radius: 2px;
  transition: width 0.3s ease;
  ${props => props.isRTL ? 'transform-origin: right;' : 'transform-origin: left;'}
  ${props => props.isRTL ? 'margin-right: 0;' : 'margin-left: 0;'}
`;

export default MobileStepCounter; 
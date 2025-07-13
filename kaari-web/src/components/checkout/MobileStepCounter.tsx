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
        <StepLabel>{stepLabels[currentStep - 1]}</StepLabel>
      )}
      <ProgressBar>
        <Progress width={(currentStep / totalSteps) * 100} isRTL={isRTL} />
      </ProgressBar>
    </StepCounterContainer>
  );
};

const StepCounterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;
`;

const StepInfo = styled.div<{ isRTL: boolean }>`
  display: flex;
  align-items: baseline;
  justify-content: ${props => props.isRTL ? 'flex-end' : 'flex-start'};
`;

const CurrentStep = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${Theme.colors.secondary};
`;

const TotalSteps = styled.span`
  font-size: 14px;
  color: ${Theme.colors.gray2};
  margin-left: 2px;
`;

const StepLabel = styled.div`
  font-size: 14px;
  color: ${Theme.colors.black};
  margin-top: 2px;
  font-weight: 500;
  text-align: inherit; /* Will inherit from parent's direction */
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${Theme.colors.gray};
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
`;

const Progress = styled.div<{ width: number; isRTL: boolean }>`
  height: 100%;
  width: ${props => props.width}%;
  background-color: ${Theme.colors.success};
  border-radius: 2px;
  transition: width 0.3s ease;
  transform-origin: ${props => props.isRTL ? 'right' : 'left'};
  margin-left: ${props => props.isRTL ? 'auto' : '0'};
  margin-right: ${props => props.isRTL ? '0' : 'auto'};
`;

export default MobileStepCounter; 
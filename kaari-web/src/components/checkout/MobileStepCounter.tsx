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
    <StepCounterContainer className={className} isRTL={isRTL}>
      <StepInfo isRTL={isRTL}>
        <CurrentStep>{currentStep}</CurrentStep>
        <TotalSteps>/ {totalSteps}</TotalSteps>
      </StepInfo>
      {stepLabels && stepLabels[currentStep - 1] && (
        <StepLabel isRTL={isRTL}>{stepLabels[currentStep - 1]}</StepLabel>
      )}
      <ProgressBar isRTL={isRTL}>
        <Progress 
          width={(currentStep / totalSteps) * 100} 
          isRTL={isRTL}
        />
      </ProgressBar>
    </StepCounterContainer>
  );
};

interface RTLProps {
  isRTL?: boolean;
}

interface ProgressProps extends RTLProps {
  width: number;
}

const StepCounterContainer = styled.div<RTLProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;
  background-color: ${Theme.colors.white};
  border-radius: ${Theme.borders.radius.md};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

const StepInfo = styled.div<RTLProps>`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  flex-direction: ${props => props.isRTL ? 'row-reverse' : 'row'};
`;

const CurrentStep = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: ${Theme.colors.secondary};
`;

const TotalSteps = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${Theme.colors.gray2};
  margin-left: 4px;
`;

const StepLabel = styled.div<RTLProps>`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${Theme.colors.black};
  text-align: ${props => props.isRTL ? 'right' : 'left'};
`;

const ProgressBar = styled.div<RTLProps>`
  width: 100%;
  height: 6px;
  background-color: ${Theme.colors.gray};
  border-radius: ${Theme.borders.radius.extreme};
  overflow: hidden;
  direction: ${props => props.isRTL ? 'rtl' : 'ltr'};
`;

const Progress = styled.div<ProgressProps>`
  height: 100%;
  width: ${props => props.width}%;
  background-color: ${Theme.colors.success};
  border-radius: ${Theme.borders.radius.extreme};
  transition: width 0.3s ease;
  transform-origin: ${props => props.isRTL ? 'right' : 'left'};
`;

export default MobileStepCounter; 
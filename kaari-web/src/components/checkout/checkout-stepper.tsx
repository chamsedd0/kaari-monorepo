import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';

const StepperContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 2rem;
  
  .step-circles {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    width: 100%;
    position: relative;
    
    .step-line {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 2px;
      background-color: ${Theme.colors.tertiary};
      z-index: 1;
      transform: translateY(-50%);
    }
    
    .progress-line {
      position: absolute;
      top: 50%;
      left: 0;
      height: 2px;
      background-color: ${Theme.colors.secondary};
      z-index: 2;
      transform: translateY(-50%);
      transition: width 0.3s ease;
    }
  }
  
  .step-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${Theme.colors.tertiary};
    display: flex;
    align-items: center;
    justify-content: center;
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.gray2};
    position: relative;
    z-index: 3;
    transition: all 0.3s ease;
    
    &.active {
      background-color: ${Theme.colors.secondary};
      color: white;
    }
    
    &.completed {
      background-color: ${Theme.colors.primary};
      color: white;
    }
  }
  
  .step-labels {
    display: flex;
    justify-content: space-between;
    width: 100%;
    
    .step-label {
      font: ${Theme.typography.fonts.smallM};
      color: ${Theme.colors.gray2};
      text-align: center;
      transition: all 0.3s ease;
      max-width: 150px;
      padding: 0 10px;
      
      &.active {
        color: ${Theme.colors.secondary};
        font: ${Theme.typography.fonts.smallB};
      }
      
      &.completed {
        color: ${Theme.colors.primary};
      }
    }
  }
`;

interface CheckoutStepperProps {
  activeStep: number;
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ activeStep }) => {
  const steps = [
    { number: 1, label: 'Rental Application' },
    { number: 2, label: 'Payment Method' },
    { number: 3, label: 'Confirmation' },
    { number: 4, label: 'Success' }
  ];

  // Calculate progress percentage for the progress line
  const progressPercentage = ((activeStep - 1) / (steps.length - 1)) * 100;

  return (
    <StepperContainer>
      <div className="step-circles">
        <div className="step-line"></div>
        <div className="progress-line" style={{ width: `${progressPercentage}%` }}></div>
        
        {steps.map((step) => (
          <div 
            key={step.number}
            className={`
              step-circle 
              ${step.number === activeStep ? 'active' : ''} 
              ${step.number < activeStep ? 'completed' : ''}
            `}
          >
            {step.number}
          </div>
        ))}
      </div>
      
      <div className="step-labels">
        {steps.map((step) => (
          <div 
            key={step.number}
            className={`
              step-label
              ${step.number === activeStep ? 'active' : ''} 
              ${step.number < activeStep ? 'completed' : ''}
            `}
          >
            {step.label}
          </div>
        ))}
      </div>
    </StepperContainer>
  );
};

export default CheckoutStepper; 
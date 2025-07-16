import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { FaCheck } from 'react-icons/fa';

const StepperContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  
  .step-circles {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    width: 100%;
    position: relative;
    
    .step-line {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 3px;
      background-color: ${Theme.colors.tertiary};
      z-index: 1;
      transform: translateY(-50%);
    }
    
    .progress-line {
      position: absolute;
      top: 50%;
      left: 0;
      height: 3px;
      background-color: ${Theme.colors.secondary};
      z-index: 2;
      transform: translateY(-50%);
      transition: width 0.5s ease;
    }
  }
  
  .step-circle {
    width: 48px;
    height: 48px;
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    &.active {
      background-color: ${Theme.colors.secondary};
      color: white;
      box-shadow: 0 3px 12px ${Theme.colors.secondary}90;
      transform: scale(1.05);
    }
    
    &.completed {
      background-color: ${Theme.colors.primary};
      color: white;
      box-shadow: 0 3px 12px ${Theme.colors.primary}90;
    }
    
    .check-icon {
      font-size: 20px;
    }
  }
  
  .step-labels {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 8px;
    
    .step-label {
      font: ${Theme.typography.fonts.smallM};
      color: ${Theme.colors.gray2};
      text-align: center;
      transition: all 0.3s ease;
      max-width: 150px;
      padding: 0 8px;
      
      &.active {
        color: ${Theme.colors.secondary};
        font: ${Theme.typography.fonts.smallB};
        transform: translateY(-2px);
      }
      
      &.completed {
        color: ${Theme.colors.primary};
        font: ${Theme.typography.fonts.smallB};
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
    { number: 2, label: 'Protection Options' },
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
            {step.number < activeStep ? (
              <FaCheck className="check-icon" />
            ) : (
              step.number
            )}
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
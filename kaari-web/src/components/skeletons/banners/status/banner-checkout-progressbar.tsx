import React from 'react';
import { CheckoutProgressBarStyle, ProgressStep } from '../../../styles/banners/status/banner-checkout-progressbar-style';
import { Step1Icon, Step2Icon, Step3Icon, Step1Inactive, Step2Inactive, Step3Inactive } from '../../checkoutprocess/StepIcons';
import { Theme } from '../../../../theme/theme';

interface CheckoutProgressBarProps {
    currentStep: number;
}

const steps = [
    { number: 1, label: 'Rental Application' },
    { number: 2, label: 'Payment Method' },
    { number: 3, label: 'Confirmation' },
];

export const CheckoutProgressBar: React.FC<CheckoutProgressBarProps> = ({ currentStep }) => {
    return (
        <CheckoutProgressBarStyle>
            {steps.map((step) => (
                <React.Fragment key={step.number}>
                    <ProgressStep 
                        isActive={step.number === currentStep}
                        isPassed={step.number < currentStep}
                    >
                        <div className="step-icon">
                            {step.number === 1 && (
                                step.number <= currentStep ? <Step1Icon /> : <Step1Inactive />
                            )}
                            {step.number === 2 && (
                                step.number <= currentStep ? <Step2Icon /> : <Step2Inactive />
                            )}
                            {step.number === 3 && (
                                step.number <= currentStep ? <Step3Icon /> : <Step3Inactive />
                            )}
                        </div>
                    </ProgressStep>
                </React.Fragment>
            ))}
            <div className="step-labels">
                {steps.map((step) => (
                    <div 
                        key={`label-${step.number}`} 
                        className={`step-label ${step.number <= currentStep ? 'active' : ''}`}
                    >
                        {step.label}
                    </div>
                ))}
            </div>
        </CheckoutProgressBarStyle>
    );
};

export default CheckoutProgressBar;

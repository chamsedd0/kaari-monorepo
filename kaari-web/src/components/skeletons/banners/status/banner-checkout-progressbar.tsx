import React from 'react';
import { CheckoutProgressBarStyle, ProgressStep } from '../../../styles/banners/status/banner-checkout-progressbar-style';

interface CheckoutProgressBarProps {
    currentStep: number;
}

const steps = [
    { number: 1, label: 'Rental Application' },
    { number: 2, label: 'Payment Method' },
    { number: 3, label: 'Confirmation' }
];

export const CheckoutProgressBar: React.FC<CheckoutProgressBarProps> = ({ currentStep }) => {
    return (
        <CheckoutProgressBarStyle>
            {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                    <ProgressStep 
                        isActive={step.number === currentStep}
                        isPassed={step.number < currentStep}
                    >
                        <div className="step-number">{step.number}</div>
                        <div className="step-label">{step.label}</div>
                    </ProgressStep>
                    {index < steps.length - 1 && (
                        <div className={`progress-line ${step.number < currentStep ? 'active' : ''}`} />
                    )}
                </React.Fragment>
            ))}
        </CheckoutProgressBarStyle>
    );
};

export default CheckoutProgressBar;

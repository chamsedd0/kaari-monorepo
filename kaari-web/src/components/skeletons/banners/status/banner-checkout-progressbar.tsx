import React from 'react';
import { CheckoutProgressBarStyle, ProgressStep } from '../../../styles/banners/status/banner-checkout-progressbar-style';
import Step1 from '../../checkoutprocess/step1.svg'
import Step2 from '../../checkoutprocess/step2.svg'
import Step3 from '../../checkoutprocess/step3.svg'
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
                        <img className={`step-number ${step.number === 1 ? 'first' : ''} ${step.number === 2 ? 'second' : ''} ${step.number === 3 ? 'third' : ''}`} src={step.number === 1 ? Step1 : step.number === 2 ? Step2 : Step3} alt={step.label} />
                    </ProgressStep>

                </React.Fragment>
            ))}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                width: '112%',
                position: 'absolute', 
                top: '100%', 
                marginTop: '8px',
            }}>
                {steps.map((step) => (
                    <div 
                        key={`label-${step.number}`} 
                        style={{ 
                            textAlign: 'center',
                            maxWidth: '75px',
                            color: Theme.colors.secondary,
                            opacity: step.number <= currentStep ? 1 : 0.5,
                            transition: 'all 0.3s ease',
                            font: Theme.typography.fonts.smallB
                        }}
                    >
                        {step.label}
                    </div>
                ))}
            </div>
        </CheckoutProgressBarStyle>
    );
};

export default CheckoutProgressBar;

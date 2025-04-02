import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

interface ProgressStepProps {
    isActive: boolean;
    isPassed: boolean;
}

export const CheckoutProgressBarStyle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    position: relative;
    padding: 0 10px;

    .progress-line {
        flex: 1;
        height: 6px;
        background-color: ${Theme.colors.gray2};
        position: relative;
        z-index: 1;
        border-radius: 16px;
        margin-bottom: 24px;
        
        &.active {
            background-color: ${Theme.colors.secondary};
        }
    }
`;

export const ProgressStep = styled.div<ProgressStepProps>`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
    min-width: 120px;

    .step-number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${props => props.isActive || props.isPassed ? Theme.colors.secondary : Theme.colors.gray2};
        color: ${Theme.colors.white};
        font: ${Theme.typography.fonts.largeB};
        margin-bottom: 12px;
        transition: all 0.3s ease;

        ${props => props.isPassed && `
            background-color: ${Theme.colors.white};
            border: 2px solid ${Theme.colors.secondary};
            color: ${Theme.colors.secondary};
        `}
    }

    .step-label {
        font: ${Theme.typography.fonts.mediumB};
        color: ${props => props.isActive ? Theme.colors.secondary : Theme.colors.gray2};
        white-space: nowrap;
        text-align: center;
        transition: all 0.3s ease;
        
        ${props => props.isPassed && `
            color: ${Theme.colors.secondary};
        `}
    }
`;
